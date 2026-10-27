/**
 * Booking service for Ramanand Hospital (Cloudflare Worker + D1 database).
 *
 * The website is a static export with no server, so this small service does the work that needs one:
 *   GET  /slots   which exact times are free for a doctor or the lab on a day
 *   POST /book    saves a booking if its slot is still free, then sends
 *                   - the patient a confirmation by WhatsApp and email (to the number and address they typed)
 *                   - the doctor (or lab desk) an alert by WhatsApp and email
 *   cron (every minute) sends a reminder 10 minutes before each booking, to the patient and the doctor
 *   GET  /cancel  lets the patient cancel from the link in their confirmation
 *
 * Secrets are set with `wrangler secret put`, never in the website code. See worker/README.md.
 * Patient messages carry only who, when and the reference. Test names and health details go to the doctor only.
 */

const TZ_MIN = 330; // India Standard Time, UTC+5:30
const MIN_LEAD_MS = 15 * 60 * 1000; // a booking must be at least 15 minutes away so a reminder is still useful
const REMIND_MS = 10 * 60 * 1000;

// Slot rules. Override with the SLOT_RULES variable, for example {"appt":{"step":20}}.
const DEFAULT_RULES = {
  appt: { start: 18 * 60, end: 22 * 60, step: 15, cap: 1, days: [1, 2, 3, 4, 5, 6] }, // OPD, Monday to Saturday, 6 PM to 10 PM
  lab: { start: 10 * 60, end: 22 * 60, step: 30, cap: 3, days: [0, 1, 2, 3, 4, 5, 6] }, // laboratory, 10 AM to 10 PM
};

const rulesFor = (env) => {
  try {
    const o = JSON.parse(env.SLOT_RULES || "{}");
    return { appt: { ...DEFAULT_RULES.appt, ...o.appt }, lab: { ...DEFAULT_RULES.lab, ...o.lab } };
  } catch {
    return DEFAULT_RULES;
  }
};

const pad = (n) => String(n).padStart(2, "0");
const hhmm = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
const slotList = (r) => {
  const out = [];
  for (let m = r.start; m + r.step <= r.end; m += r.step) out.push(hhmm(m));
  return out;
};
const startTs = (date, t) => {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = t.split(":").map(Number);
  return Date.UTC(y, mo - 1, d, h, mi) - TZ_MIN * 60000;
};
const weekday = (date) => new Date(`${date}T00:00:00Z`).getUTCDay();

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clip = (s, n) => String(s ?? "").slice(0, n);

function timeLabel(t, hi) {
  const [h, m] = t.split(":").map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  if (!hi) return `${h12}:${pad(m)} ${h < 12 ? "AM" : "PM"}`;
  const part = h < 12 ? "सुबह" : h < 17 ? "दोपहर" : h < 20 ? "शाम" : "रात";
  return `${part} ${h12}:${pad(m)} बजे`;
}
const dateLabel = (date, hi) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString(hi ? "hi-IN" : "en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

function cors(env, request) {
  const origin = request.headers.get("origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const ok = allowed.includes(origin);
  return {
    ok,
    headers: {
      "access-control-allow-origin": ok ? origin : allowed[0] || "",
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "content-type",
      vary: "origin",
    },
  };
}
const json = (body, status, headers) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });

/** Who gets the staff side: the doctor (or lab desk) for this booking plus the hospital addresses and numbers. */
function staffFor(env, b) {
  let all = {};
  try { all = JSON.parse(env.DOCTORS_JSON || "{}"); } catch { /* ignore */ }
  const d = all[b.doctor] || {};
  const list = (s) => String(s || "").split(",").map((x) => x.trim()).filter(Boolean);
  const emails = [...new Set([d.email, ...list(env.HOSPITAL_EMAIL)].filter(Boolean))];
  const wa = [...new Set([d.wa, ...list(env.STAFF_WA_NUMBERS)].filter(Boolean).map((x) => String(x).replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")))];
  return { d, emails, wa };
}

function whatText(b, d, hi) {
  if (b.kind === "lab") {
    const home = b.details.collection === "home";
    return hi ? (home ? "घर से नमूना संग्रह" : "प्रयोगशाला विज़िट") : home ? "home sample collection" : "lab visit";
  }
  return hi ? `${d.nameHi || d.name || "डॉक्टर"} के साथ अपॉइंटमेंट` : `appointment with ${d.name || "our doctor"}`;
}

/* ---------- sending ---------- */

const mailReady = (env) => !!(env.MAIL_RELAY_URL || env.RESEND_API_KEY);

async function sendEmail(env, d, payload) {
  // Option 1: send through the hospital's own Gmail with a small Google Apps Script (worker/gmail-relay.gs). No domain setup needed.
  if (env.MAIL_RELAY_URL) {
    const res = await fetch(env.MAIL_RELAY_URL, {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: JSON.stringify({ secret: env.MAIL_RELAY_SECRET, name: `${d.name ? d.name + ", " : ""}Ramanand Hospital`, to: payload.to, subject: payload.subject, html: payload.html, replyTo: payload.reply_to || d.email || "" }),
    });
    return res.ok;
  }
  // Option 2: Resend, which needs the sending domain verified.
  const from = env.MAIL_FROM_ADDRESS ? `${d.name ? d.name + ", " : ""}Ramanand Hospital <${env.MAIL_FROM_ADDRESS}>` : env.MAIL_FROM;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ from, reply_to: d.email || undefined, ...payload }),
  });
  return res.ok;
}

/** One WhatsApp template message. The template must be approved in Meta's WhatsApp Manager. */
async function sendWa(env, to, template, lang, params) {
  const res = await fetch(`https://graph.facebook.com/v21.0/${env.WA_PHONE_ID}/messages`, {
    method: "POST",
    headers: { authorization: `Bearer ${env.WA_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: { name: template, language: { code: lang }, components: [{ type: "body", parameters: params.map((text) => ({ type: "text", text: String(text) })) }] },
    }),
  });
  return res.ok;
}
const waReady = (env) => !!(env.WA_TOKEN && env.WA_PHONE_ID);
const safe = (p) => p.catch(() => false);

const row = (k, v) => `<tr><td style="padding:6px 14px 6px 0;color:#5b6b82">${esc(k)}</td><td style="padding:6px 0;font-weight:600">${esc(v)}</td></tr>`;
const wrap = (inner) =>
  `<div style="font-family:Arial,sans-serif;color:#0a2a5e;max-width:520px">${inner}<p style="margin-top:24px;color:#5b6b82;font-size:13px">Ramanand Hospital, Sonipat-Narela Road, Akbarpur Barota, Sonipat, Haryana 131103. Phone 74044 77208</p></div>`;

/** The email a patient gets. One layout for doctor appointments, one for lab slots, each in English and Hindi. */
function patientEmail(b, d, hi, cancel) {
  const L = (en, h) => (hi ? h : en);
  const x = b.details || {};
  const lab = b.kind === "lab";
  const date = dateLabel(b.date, hi);
  const time = timeLabel(b.time, hi);
  const rows = lab
    ? [
        [L("Tests", "जाँचें"), x.tests || L("As advised by your doctor", "डॉक्टर की सलाह अनुसार")],
        [L("Date", "तारीख"), date],
        [L("Time", "समय"), time],
        [L("Sample", "सैंपल"), x.collection === "home" ? L("Home collection at your address", "आपके पते पर सैंपल संग्रह") : L("Visit our laboratory", "हमारी प्रयोगशाला में आएँ")],
        [L("Reference", "संदर्भ संख्या"), b.ref],
      ]
    : [
        [L("Doctor", "डॉक्टर"), (hi ? d.nameHi : d.name) || d.name || L("Our doctor", "हमारे डॉक्टर")],
        ...(x.department ? [[L("Department", "विभाग"), x.department]] : []),
        ...(x.reason ? [[L("Symptoms", "तकलीफ़"), x.reason]] : []),
        [L("Date", "तारीख"), date],
        [L("Time", "समय"), time],
        [L("Reference", "संदर्भ संख्या"), b.ref],
      ];
  const note = lab
    ? x.collection === "home"
      ? L("Our team will call you before they reach your address. Some tests need fasting for 8 to 12 hours (water is allowed). If you are not sure, call us.", "हमारी टीम आपके पते पर आने से पहले फ़ोन करेगी। कुछ जाँचों के लिए 8 से 12 घंटे खाली पेट रहना होता है (पानी पी सकते हैं)। निश्चित न हों तो हमें फ़ोन करें।")
      : L("Please come a few minutes early. Some tests need fasting for 8 to 12 hours (water is allowed). If you are not sure, call us.", "कृपया कुछ मिनट पहले आएँ। कुछ जाँचों के लिए 8 से 12 घंटे खाली पेट रहना होता है (पानी पी सकते हैं)। निश्चित न हों तो हमें फ़ोन करें।")
    : L("Please arrive 10 minutes early and bring any old reports or prescriptions.", "कृपया 10 मिनट पहले पहुँचें और पुरानी रिपोर्ट या पर्ची साथ लाएँ।");
  const title = lab ? L("Your lab slot is confirmed", "आपका लैब स्लॉट पक्का हुआ") : L("Your appointment is confirmed", "आपकी अपॉइंटमेंट पक्की हुई");
  const subject = lab
    ? L(`Lab slot confirmed: ${date}, ${time} (${b.ref})`, `लैब स्लॉट पक्का: ${date}, ${time} (${b.ref})`)
    : L(`Appointment confirmed: ${date}, ${time} (${b.ref})`, `अपॉइंटमेंट पक्की: ${date}, ${time} (${b.ref})`);
  const html = wrap(
    `<div style="background:#0a4fd6;color:#fff;padding:14px 18px;border-radius:10px 10px 0 0;font-weight:700">Ramanand Hospital</div>` +
      `<div style="border:1px solid #dbe4f3;border-top:0;padding:18px;border-radius:0 0 10px 10px">` +
      `<h2 style="margin:0 0 8px">${esc(title)}</h2>` +
      `<p>${L("Hello", "नमस्ते")} ${esc(b.name)}, ${L("we will remind you 10 minutes before your time.", "समय से 10 मिनट पहले हम आपको याद दिलाएँगे।")}</p>` +
      `<table>${rows.map(([k, v]) => row(k, v)).join("")}</table>` +
      `<p style="background:#eef4ff;padding:10px 12px;border-radius:8px">${esc(note)}</p>` +
      `<p><a href="${cancel}" style="color:#0a4fd6">${L("Cancel this booking", "बुकिंग रद्द करें")}</a> &nbsp;|&nbsp; ${L("Questions? Call", "प्रश्न? फ़ोन करें")} 74044 77208</p></div>`,
  );
  return { subject, html };
}

async function notifyBooked(env, b, base) {
  const hi = b.lang === "hi";
  const { d, emails, wa } = staffFor(env, b);
  const what = whatText(b, d, hi);
  const date = dateLabel(b.date, hi);
  const time = timeLabel(b.time, hi);
  const cancel = `${base}/cancel?ref=${encodeURIComponent(b.ref)}&t=${b.token}`;
  const tasks = {};

  if (mailReady(env) && b.email) {
    const m = patientEmail(b, d, hi, cancel);
    tasks.patientMail = safe(sendEmail(env, d, { to: [b.email], subject: m.subject, html: m.html }));
  }
  if (waReady(env)) {
    tasks.whatsapp = safe(sendWa(env, `91${b.mobile}`, env.WA_T_BOOKED || "booking_confirmed", hi ? "hi" : "en", [b.name, what, date, time, b.ref]));
  }
  if (mailReady(env) && emails.length) {
    const x = b.details;
    const rows = [
      ["Reference", b.ref], ["For", whatText(b, d, false)], ["Date", dateLabel(b.date, false)], ["Time", timeLabel(b.time, false)],
      ["Patient", b.name], ["Mobile", b.mobile], ["Email", b.email || "(not given)"], ["Age / gender", `${b.age} / ${b.gender}`],
      ...(x.department ? [["Department", x.department]] : []),
      ...(x.reason ? [["Symptoms", x.reason]] : []),
      ...(x.tests ? [["Tests", x.tests]] : []),
      ...(x.testNotes ? [["Test notes", x.testNotes]] : []),
      ...(x.collection === "home" ? [["Sample", "HOME COLLECTION"], ["Address", x.address], ["PIN", x.pincode], ["Map", x.mapLink || "(not shared)"]] : x.collection ? [["Sample", "Patient visits the lab"]] : []),
    ];
    tasks.staffMail = safe(sendEmail(env, d, { to: emails, reply_to: b.email || undefined, subject: `New booking ${b.ref}: ${b.name}, ${dateLabel(b.date, false)} ${timeLabel(b.time, false)}`, html: wrap(`<h2>New booking</h2><table>${rows.map(([k, y]) => row(k, y)).join("")}</table>`) }));
  }
  if (waReady(env) && wa.length) {
    tasks.staffWhatsapp = Promise.all(wa.map((to) => safe(sendWa(env, to, env.WA_T_STAFF || "staff_booking_alert", "en", [whatText(b, d, false), b.name, b.mobile, `${dateLabel(b.date, false)} ${timeLabel(b.time, false)}`, b.ref])))).then((r) => r.every(Boolean));
  }
  const keys = Object.keys(tasks);
  const vals = await Promise.all(keys.map((k) => tasks[k]));
  return Object.fromEntries(keys.map((k, i) => [k, vals[i]]));
}

async function notifyReminder(env, b) {
  const hi = b.lang === "hi";
  const { d, emails, wa } = staffFor(env, b);
  const what = whatText(b, d, hi);
  const jobs = [];
  if (waReady(env)) jobs.push(safe(sendWa(env, `91${b.mobile}`, env.WA_T_REMIND || "booking_reminder", hi ? "hi" : "en", [b.name, what, timeLabel(b.time, hi)])));
  if (mailReady(env) && b.email) {
    jobs.push(safe(sendEmail(env, d, { to: [b.email], subject: hi ? `याद दिलाना: ${timeLabel(b.time, true)}` : `Reminder: your booking at ${timeLabel(b.time, false)}`, html: wrap(hi ? `<p>नमस्ते ${esc(b.name)}, ${esc(what)} ${esc(timeLabel(b.time, true))} पर है।</p>` : `<p>Hello ${esc(b.name)}, a reminder: your ${esc(what)} is at ${esc(timeLabel(b.time, false))}.</p>`) })));
  }
  if (waReady(env)) for (const to of wa) jobs.push(safe(sendWa(env, to, env.WA_T_STAFF_REMIND || "staff_booking_reminder", "en", [whatText(b, d, false), b.name, b.mobile, timeLabel(b.time, false)])));
  if (mailReady(env) && emails.length) jobs.push(safe(sendEmail(env, d, { to: emails, subject: `In 10 minutes: ${b.name}, ${timeLabel(b.time, false)}`, html: wrap(`<p>Reminder: ${esc(b.name)} (${esc(b.mobile)}), ${esc(whatText(b, d, false))}, at ${esc(timeLabel(b.time, false))}. Reference ${esc(b.ref)}.</p>`) })));
  await Promise.all(jobs);
}

/* ---------- requests ---------- */

function clean(body, rules) {
  if (body.website) return null; // honeypot
  const kind = body.kind === "lab" ? "lab" : body.kind === "appt" ? "appt" : null;
  if (!kind) return null;
  const mobile = String(body.mobile ?? "").replace(/[\s-]/g, "").replace(/^\+?91/, "");
  const email = clip(body.email, 120).trim();
  const x = body.details && typeof body.details === "object" ? body.details : {};
  const doctor = kind === "lab" ? "lab" : clip(body.doctor, 40);
  const v = {
    kind,
    doctor,
    lang: body.lang === "hi" ? "hi" : "en",
    name: clip(body.name, 80).trim(),
    mobile,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "",
    age: clip(body.age, 3),
    gender: clip(body.gender, 10),
    date: clip(body.date, 10),
    time: clip(body.time, 5),
    details: {
      department: clip(x.department, 80), reason: clip(x.reason, 250), tests: clip(x.tests, 400), testNotes: clip(x.testNotes, 250),
      collection: x.collection === "home" ? "home" : x.collection === "hospital" ? "hospital" : "",
      address: clip(x.address, 250), pincode: clip(x.pincode, 6),
      mapLink: String(x.mapLink ?? "").startsWith("https://www.google.com/maps?q=") ? clip(x.mapLink, 120) : "",
    },
  };
  if (v.name.length < 2 || !/^[6-9]\d{9}$/.test(v.mobile)) return null;
  if (kind === "appt" && !/^[a-z0-9-]{1,40}$/.test(doctor)) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v.date) || !/^\d{2}:\d{2}$/.test(v.time)) return null;
  const r = rules[kind];
  if (!r.days.includes(weekday(v.date)) || !slotList(r).includes(v.time)) return null;
  const ts = startTs(v.date, v.time);
  if (ts < Date.now() + MIN_LEAD_MS || ts > Date.now() + 90 * 86400000) return null;
  return { ...v, ts };
}

async function takenCounts(env, kind, doctor, date) {
  const { results } = await env.DB.prepare("SELECT time, COUNT(*) AS c FROM bookings WHERE kind=? AND doctor=? AND date=? AND status='booked' GROUP BY time").bind(kind, doctor, date).all();
  return Object.fromEntries((results || []).map((r) => [r.time, r.c]));
}

async function slots(url, env) {
  const kind = url.searchParams.get("kind") === "lab" ? "lab" : "appt";
  const date = url.searchParams.get("date") || "";
  const doctor = kind === "lab" ? "lab" : clip(url.searchParams.get("doctor"), 40);
  const r = rulesFor(env)[kind];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !r.days.includes(weekday(date))) return { slots: [], closed: true };
  const taken = await takenCounts(env, kind, doctor, date);
  return { slots: slotList(r).map((t) => ({ t, free: (taken[t] || 0) < r.cap && startTs(date, t) >= Date.now() + MIN_LEAD_MS })) };
}

async function book(request, env, base) {
  let body;
  try {
    const text = await request.text();
    if (text.length > 6000) return { status: 413, body: { ok: false } };
    body = JSON.parse(text);
  } catch {
    return { status: 400, body: { ok: false } };
  }
  const rules = rulesFor(env);
  const v = clean(body, rules);
  if (!v) return { status: 422, body: { ok: false } };

  const ref = `${v.kind === "lab" ? "RL" : "RH"}-${v.date.replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
  const token = crypto.randomUUID().replace(/-/g, "");
  // The insert only happens while the slot still has room, so two people cannot take the same slot.
  const res = await env.DB.prepare(
    `INSERT INTO bookings (ref, kind, doctor, date, time, start_ts, name, mobile, email, lang, age, gender, details, token, created)
     SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM bookings WHERE kind=? AND doctor=? AND date=? AND time=? AND status='booked') < ?`,
  )
    .bind(ref, v.kind, v.doctor, v.date, v.time, v.ts, v.name, v.mobile, v.email, v.lang, v.age, v.gender, JSON.stringify(v.details), token, Date.now(), v.kind, v.doctor, v.date, v.time, rules[v.kind].cap)
    .run();
  if (!res.meta || res.meta.changes === 0) return { status: 409, body: { ok: false, reason: "full" } };

  const sent = await notifyBooked(env, { ...v, ref, token }, base);
  return { status: 200, body: { ok: true, ref, ...sent } };
}

async function cancel(url, env, base) {
  const ref = url.searchParams.get("ref") || "";
  const t = url.searchParams.get("t") || "";
  const page = (msg) => new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ramanand Hospital</title><body style="font-family:Arial,sans-serif;max-width:480px;margin:15vh auto;padding:0 20px;color:#0a2a5e"><h2>${esc(msg)}</h2><p>Ramanand Hospital, 74044 77208</p>`, { headers: { "content-type": "text/html; charset=utf-8" } });
  const b = await env.DB.prepare("SELECT * FROM bookings WHERE ref=? AND token=?").bind(ref, t).first();
  if (!b) return page("This link is not valid.");
  if (b.status === "cancelled") return page("This booking is already cancelled.");
  if (b.start_ts < Date.now()) return page("This booking time has passed.");
  await env.DB.prepare("UPDATE bookings SET status='cancelled' WHERE id=?").bind(b.id).run();
  const { d, emails } = staffFor(env, b);
  if (mailReady(env) && emails.length) {
    await safe(sendEmail(env, d, { to: emails, subject: `Cancelled ${b.ref}`, html: wrap(`<p>${esc(b.name)} (${esc(b.mobile)}) cancelled the booking on ${esc(dateLabel(b.date, false))} at ${esc(timeLabel(b.time, false))}. Reference ${esc(b.ref)}.</p>`) }));
  }
  return page("Your booking is cancelled.");
}

/** Website enquiry form: emailed to the hospital inbox only. The visitor's email, when given, becomes the reply address. */
async function enquiry(request, env) {
  let body;
  try { body = await request.json(); } catch { return { status: 400, body: { ok: false } }; }
  if (body.website) return { status: 200, body: { ok: true } }; // honeypot
  const name = clip(body.name, 80).trim();
  const mobile = String(body.mobile ?? "").replace(/[\s-]/g, "").replace(/^\+?91/, "");
  const email = clip(body.email, 120).trim();
  const message = clip(body.message, 1500).trim();
  if (name.length < 2 || !/^[6-9]\d{9}$/.test(mobile) || message.length < 5 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return { status: 400, body: { ok: false } };
  if (!mailReady(env)) return { status: 503, body: { ok: false } };
  const to = (env.ENQUIRY_EMAIL || "ramanandhosp@gmail.com").split(",").map((x) => x.trim()).filter(Boolean);
  const rows = [["Name", name], ["Mobile", mobile], ["Email", email || "(not given)"]];
  const html = wrap(`<h2>New website enquiry</h2><table>${rows.map(([k, v]) => row(k, v)).join("")}</table><p style="background:#eef4ff;padding:10px 12px;border-radius:8px;white-space:pre-wrap">${esc(message)}</p>`);
  const ok = await sendEmail(env, { name: "Website enquiry" }, { to, reply_to: email || undefined, subject: `Website enquiry from ${name}`, html });
  return ok ? { status: 200, body: { ok: true } } : { status: 502, body: { ok: false } };
}

/* ---------- entry points ---------- */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const c = cors(env, request);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: c.headers });
    const base = env.PUBLIC_URL || url.origin;

    if (request.method === "GET" && url.pathname === "/cancel") return cancel(url, env, base);
    if (!c.ok) return json({ ok: false }, 403, c.headers);
    if (request.method === "GET" && url.pathname === "/slots") return json(await slots(url, env), 200, c.headers);
    if (request.method === "POST" && url.pathname === "/book") {
      const r = await book(request, env, base);
      return json(r.body, r.status, c.headers);
    }
    if (request.method === "POST" && url.pathname === "/enquiry") {
      const r = await enquiry(request, env);
      return json(r.body, r.status, c.headers);
    }
    return json({ ok: false }, 404, c.headers);
  },

  /** Runs every minute: sends the reminder for bookings that start within the next 10 minutes. */
  async scheduled(_event, env) {
    const now = Date.now();
    const { results } = await env.DB.prepare("SELECT * FROM bookings WHERE status='booked' AND reminded=0 AND start_ts > ? AND start_ts <= ?").bind(now, now + REMIND_MS).all();
    for (const b of results || []) {
      // Mark first, so a slow send cannot cause a second reminder on the next minute.
      const r = await env.DB.prepare("UPDATE bookings SET reminded=1 WHERE id=? AND reminded=0").bind(b.id).run();
      if (!r.meta || r.meta.changes === 0) continue;
      await notifyReminder(env, { ...b, details: JSON.parse(b.details || "{}") });
    }
    // Keep patient details only as long as they are needed: delete bookings more than 30 days old, once an hour.
    if (new Date(now).getUTCMinutes() === 0) await env.DB.prepare("DELETE FROM bookings WHERE start_ts < ?").bind(now - 30 * 86400000).run();
  },
};
