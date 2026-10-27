"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Building2, Check, FlaskConical, Home, LocateFixed, MapPin, Search, TriangleAlert, X } from "lucide-react";
import { timeLabel } from "@/data/slots";
import SlotPicker from "./SlotPicker";
import { labTestGroups, type LabTestGroup } from "@/data/lab-tests";
import { tr } from "@/lib/i18n";
import { formConfigured, bookingConfigured, mailtoFallback, submitBooking, submitForm } from "@/lib/submit";
import { u, type UiKey } from "@/data/ui";
import { useLang } from "@/lib/lang-context";

// Lets the team guide a patient who does not know which test to choose.
const NOT_SURE = "Doctor advised / not sure";
// The full rate list has thousands of names, so only this many show per group until the patient asks for more.
const PAGE = 60;

type Values = {
  tests: string[];
  testNames: string;
  where: "hospital" | "home";
  address: string;
  pincode: string;
  lat: string;
  lng: string;
  date: string;
  time: string;
  name: string;
  mobile: string;
  email: string;
  age: string;
  gender: string;
  consent: boolean;
  website: string; // honeypot, must stay empty
};
type Errors = Partial<Record<keyof Values, UiKey>>;

const empty: Values = { tests: [], testNames: "", where: "hospital", address: "", pincode: "", lat: "", lng: "", date: "", time: "", name: "", mobile: "", email: "", age: "", gender: "", consent: false, website: "" };

function validate(step: number, v: Values): Errors {
  const e: Errors = {};
  if (step === 0 && !v.tests.length) e.tests = "eTests";
  if (step === 1) {
    if (!v.date) e.date = "eDate";
    if (!v.time) e.time = "eTime";
  }
  if (step === 2) {
    if (v.name.trim().length < 2) e.name = "eName";
    if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.mobile.replace(/\s|-/g, ""))) e.mobile = "eMobile";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "eEmail";
    const age = Number(v.age);
    if (!v.age || !Number.isFinite(age) || age < 0 || age > 120) e.age = "eAge";
    if (!v.gender) e.gender = "eGender";
    if (v.where === "home") {
      if (v.address.trim().length < 8) e.address = "eAddress";
      if (!/^\d{6}$/.test(v.pincode.trim())) e.pincode = "ePincode";
    }
    if (!v.consent) e.consent = "eConsent";
  }
  return e;
}

const field =
  "w-full rounded-2xl border border-line bg-paper/60 px-4 py-3.5 text-blue-950 placeholder:text-muted/60 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10";
const label = "mb-2 block text-sm font-medium text-blue-950";
const pick = "rounded-2xl border px-3 py-3.5 text-sm font-semibold transition duration-300";
const pickOn = "border-transparent bg-linear-to-br from-blue-500 to-blue-800 text-white shadow-lg shadow-blue-700/30";
const pickOff = "border-line bg-white text-blue-950 hover:border-blue-500";

export default function LabBookingForm() {
  const lang = useLang();
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [step, setStep] = useState(0);
  const [ref, setRef] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<UiKey | null>(null);
  const [mailto, setMailto] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [shown, setShown] = useState<Record<string, number>>({});
  const [fullGroups, setFullGroups] = useState<LabTestGroup[]>([]);

  // The complete rate list is a large file, so it loads in the background after the form opens.
  useEffect(() => {
    let live = true;
    import("@/data/lab-tests-full.json").then((m) => live && setFullGroups(m.default as LabTestGroup[]));
    return () => { live = false; };
  }, []);
  const [loc, setLoc] = useState<"idle" | "busy" | "ok" | "denied" | "fail">("idle");

  // Set on the DOM after mount: reading the current date during prerender is not allowed.
  const dateRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (dateRef.current) dateRef.current.min = new Date().toISOString().slice(0, 10);
  }, [step]);

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    setV((p) => ({ ...p, [k]: val }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };
  const err = (k: keyof Values) =>
    errors[k] ? (
      <p role="alert" className="mt-2 text-sm text-red-700">{u(errors[k]!, lang)}</p>
    ) : null;
  const toggle = (t: string) => set("tests", v.tests.includes(t) ? v.tests.filter((x) => x !== t) : [...v.tests, t]);

  const steps: UiKey[] = ["labStepTests", "stepWhen", "stepYou"];

  // Reads the phone's location, then asks OpenStreetMap for a street address so the patient only has to check it.
  function useMyLocation() {
    if (!navigator.geolocation) return setLoc("fail");
    setLoc("busy");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setV((p) => ({ ...p, lat, lng }));
        setErrors((p) => ({ ...p, address: undefined, pincode: undefined }));
        setLoc("ok");
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`);
          const d = await r.json();
          const pin = String(d?.address?.postcode ?? "").replace(/\D/g, "").slice(0, 6);
          setV((p) => ({
            ...p,
            address: p.address.trim() ? p.address : String(d?.display_name ?? "").slice(0, 250),
            pincode: p.pincode || pin,
          }));
        } catch {
          /* the coordinates are enough, the patient can type the address */
        }
      },
      (e) => setLoc(e.code === 1 ? "denied" : "fail"),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }

  const q = query.trim().toLowerCase();
  const visible = [...labTestGroups, ...fullGroups]
    .filter((g) => group === "all" || g.key === group)
    .map((g) => {
      const all = g.tests.filter((t) => !q || t.toLowerCase().includes(q));
      return { ...g, total: all.length, tests: all.slice(0, PAGE * (shown[g.key] ?? 1)) };
    })
    .filter((g) => g.total);
  const notSure = v.tests.includes(NOT_SURE);
  const chosen = v.tests.filter((t) => t !== NOT_SURE);

  function next() {
    const errs = validate(step, v);
    setErrors(errs);
    if (!Object.keys(errs).length) setStep((s) => s + 1);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (v.website || sending) return; // bot or double click
    const errs = validate(2, v);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const code = `RL-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
    const fields = {
      reference: code,
      patient_language: lang === "hi" ? "Hindi" : "English",
      tests: v.tests.join(", "),
      test_notes: v.testNames || "(not given)",
      sample_collection: v.where === "home" ? "Home collection (staff to visit)" : "Patient visits the hospital",
      address: v.where === "home" ? v.address : "(not needed)",
      pincode: v.where === "home" ? v.pincode : "(not needed)",
      location_map: v.where === "home" && v.lat ? `https://www.google.com/maps?q=${v.lat},${v.lng}` : "(not shared)",
      preferred_date: v.date,
      preferred_time: timeLabel(v.time, "en"),
      patient_name: v.name,
      mobile: v.mobile,
      email: v.email || "(not given)",
      age: v.age,
      gender: v.gender,
      consent_given: "yes",
    };
    const subject = `New lab slot request ${code}`;

    if (bookingConfigured()) {
      setSending(true);
      setFormError(null);
      const r = await submitBooking({
        kind: "lab", lang, doctor: "lab", name: v.name, mobile: v.mobile, email: v.email, age: v.age, gender: v.gender,
        date: v.date, time: v.time, website: v.website,
        details: {
          tests: v.tests.join(", "), testNotes: v.testNames, collection: v.where, address: v.address, pincode: v.pincode,
          mapLink: v.where === "home" && v.lat ? `https://www.google.com/maps?q=${v.lat},${v.lng}` : "",
        },
      });
      setSending(false);
      if (r.ok) { setBooked(true); return setRef(r.ref); }
      if (r.reason === "full") { set("time", ""); setStep(1); return setFormError("slotTaken"); }
      return setFormError("eServer");
    }

    if (!formConfigured()) {
      // No form service connected yet: offer the details as an email instead of pretending they were sent.
      setMailto(mailtoFallback(subject, Object.entries(fields).map(([k, val]) => `${k}: ${val}`).join("\n")));
      return setRef(code);
    }
    setSending(true);
    setFormError(null);
    const ok = await submitForm(subject, fields);
    setSending(false);
    if (ok) setRef(code);
    else setFormError("eServer");
  }

  if (ref) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card rounded-2xl! p-8 text-center sm:p-12">
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-700"
        >
          <Check className="h-8 w-8" aria-hidden />
        </motion.span>
        <h2 className="mt-6 text-4xl text-blue-950">{booked ? u("booked", lang) : u("received", lang)}</h2>
        <p className="mx-auto mt-3 max-w-md text-muted">{booked ? u("bookedText", lang) : u("receivedText", lang).replace("{mobile}", v.mobile)}</p>
        <dl className="mx-auto mt-8 max-w-sm divide-y divide-line border-y border-line text-left text-sm">
          {[
            [u("labTestsSel", lang), v.tests.map((t) => (t === NOT_SURE ? u("labNotSure", lang) : t)).join(", ")],
            [u("labWhere", lang), v.where === "home" ? u("labHome", lang) : u("labHospital", lang)],
            [u("fDate", lang), `${v.date} · ${timeLabel(v.time, lang)}`],
            [u("reference", lang), ref],
          ].map(([k, val]) => (
            <div key={k} className="flex justify-between gap-4 py-3">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right font-medium text-blue-950">{val}</dd>
            </div>
          ))}
        </dl>
        {mailto && (
          <div className="mx-auto mt-6 max-w-md rounded-xl bg-amber-50 p-4 text-left text-sm text-amber-900">
            <p className="flex items-start gap-2 font-bold">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {u("notSentTitle", lang)}
            </p>
            <p className="mt-1">{u("notSentText", lang)}</p>
            <a href={mailto} className="btn btn-blue mt-3 px-5! py-2.5!">{u("mailInstead", lang)}</a>
          </div>
        )}
        <button onClick={() => { setV(empty); setStep(0); setRef(null); setMailto(null); setBooked(false); }} className="btn btn-outline mt-8">
          {u("another", lang)}
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card rounded-2xl! p-6 sm:p-10">
      <p className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-950">{u("emergencyForm", lang)}</p>

      <ol className="mt-8 flex items-center" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 items-center last:flex-none">
            <span
              aria-current={i === step ? "step" : undefined}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm transition-colors duration-500 ${
                i < step ? "border-transparent bg-linear-to-br from-blue-500 to-green-500 text-white" : i === step ? "border-blue-600 text-blue-600" : "border-line text-muted"
              }`}
            >
              {i < step ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
            </span>
            <span className={`ml-3 hidden text-sm sm:block ${i === step ? "font-medium text-blue-950" : "text-muted"}`}>{u(s, lang)}</span>
            {i < steps.length - 1 && (
              <span className="mx-4 h-px flex-1 overflow-hidden bg-line">
                <motion.span className="block h-full origin-left bg-linear-to-r from-blue-500 to-green-500" animate={{ scaleX: i < step ? 1 : 0 }} transition={{ duration: 0.6 }} />
              </span>
            )}
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          transition={{ duration: 0.3 }}
          className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {step === 0 && (
            <>
              <div className="sm:col-span-2">
                <p id="tests-label" className={label}>{u("labPickTests", lang)} *</p>
                <p className="-mt-1 mb-3 text-xs text-muted">{u("labPickHint", lang)}</p>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setShown({}); }}
                    placeholder={u("labSearch", lang)}
                    aria-label={u("labSearch", lang)}
                    className={`${field} pl-11`}
                  />
                </div>

                <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label={u("labCategories", lang)}>
                  {[{ key: "all", title: { en: "All tests", hi: "सभी जाँचें" } }, ...labTestGroups, ...fullGroups].map((g) => (
                    <button
                      type="button"
                      key={g.key}
                      aria-pressed={group === g.key}
                      onClick={() => setGroup(g.key)}
                      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition ${group === g.key ? "border-transparent bg-blue-700 text-white" : "border-line bg-white text-blue-950 hover:border-blue-500"}`}
                    >
                      {tr(g.title, lang)}
                    </button>
                  ))}
                </div>

                <p className="mt-3 text-xs font-semibold text-muted">{u("labTotal", lang).replace("{n}", String([...labTestGroups, ...fullGroups].reduce((n, g) => n + g.tests.length, 0)))}</p>
                <div role="group" aria-labelledby="tests-label" className="mt-2 max-h-96 overflow-y-auto rounded-2xl border border-line bg-white p-2">
                  {visible.length === 0 && <p className="px-3 py-6 text-center text-sm text-muted">{u("labNoMatch", lang)}</p>}
                  {visible.map((g) => (
                    <div key={g.key} className="mb-1">
                      <p className="sticky top-0 bg-white/95 px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-green-700 backdrop-blur">{tr(g.title, lang)}</p>
                      <ul>
                        {g.tests.map((t) => {
                          const on = v.tests.includes(t);
                          return (
                            <li key={t}>
                              <button type="button" aria-pressed={on} onClick={() => toggle(t)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${on ? "bg-blue-50 font-semibold text-blue-800" : "text-blue-950 hover:bg-mist"}`}>
                                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${on ? "border-blue-600 bg-blue-600 text-white" : "border-line bg-white"}`}>
                                  {on && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />}
                                </span>
                                {t}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                      {g.tests.length < g.total && (
                        <button type="button" onClick={() => setShown((s) => ({ ...s, [g.key]: (s[g.key] ?? 1) + 1 }))} className="mx-3 my-2 text-sm font-bold text-blue-700 underline">
                          {u("labShowMore", lang).replace("{n}", String(Math.min(PAGE, g.total - g.tests.length)))}
                        </button>
                      )}
                      {g.tests.length < g.total && (
                        <button type="button" onClick={() => setShown((s) => ({ ...s, [g.key]: Math.ceil(g.total / PAGE) }))} className="mx-3 my-2 text-sm font-bold text-blue-700 underline">
                          {u("labShowAll", lang)} ({g.total})
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button type="button" aria-pressed={notSure} onClick={() => toggle(NOT_SURE)} className={`mt-3 flex w-full items-center gap-3 text-left ${pick} px-4! ${notSure ? pickOn : pickOff}`}>
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${notSure ? "bg-white/20" : "bg-blue-50 text-blue-600"}`}>
                    {notSure ? <Check className="h-4 w-4" aria-hidden /> : <FlaskConical className="h-3.5 w-3.5" aria-hidden />}
                  </span>
                  {u("labNotSure", lang)}
                </button>

                {chosen.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-muted">{u("labSelected", lang).replace("{n}", String(chosen.length))}</p>
                    <ul className="flex flex-wrap gap-2">
                      {chosen.map((t) => (
                        <li key={t} className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 py-1 pl-3 pr-1.5 text-[13px] font-semibold text-blue-800">
                          {t}
                          <button type="button" onClick={() => toggle(t)} aria-label={`${u("labRemove", lang)} ${t}`} className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-blue-200">
                            <X className="h-3 w-3" aria-hidden />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {err("tests")}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="testNames" className={label}>{u("labTestNames", lang)}</label>
                <textarea id="testNames" rows={3} maxLength={250} className={field} value={v.testNames} onChange={(e) => set("testNames", e.target.value)} />
                <p className="mt-1 text-right text-xs text-muted">{v.testNames.length}/250</p>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="sm:col-span-2">
                <p id="where-label" className={label}>{u("labWhere", lang)}</p>
                <div role="group" aria-labelledby="where-label" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {([
                    { v: "hospital", t: u("labHospital", lang), d: u("labHospitalSub", lang), Icon: Building2 },
                    { v: "home", t: u("labHome", lang), d: u("labHomeSub", lang), Icon: Home },
                  ] as const).map((o) => (
                    <button type="button" key={o.v} aria-pressed={v.where === o.v} onClick={() => set("where", o.v)} className={`flex items-start gap-3 text-left ${pick} px-4! ${v.where === o.v ? pickOn : pickOff}`}>
                      <o.Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                      <span>
                        <span className="block">{o.t}</span>
                        <span className={`mt-0.5 block text-xs font-normal ${v.where === o.v ? "text-white/80" : "text-muted"}`}>{o.d}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="date" className={label}>{u("fDate", lang)} *</label>
                <input id="date" type="date" ref={dateRef} className={field} value={v.date} onChange={(e) => { set("date", e.target.value); set("time", ""); }} />
                {err("date")}
              </div>
              <div className="sm:col-span-2">
                <p id="time-label" className={label}>{u("labTime", lang)} *</p>
                <SlotPicker kind="lab" doctor="lab" date={v.date} value={v.time} onChange={(t) => set("time", t)} />
                {err("time")}
              </div>
              <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-900 sm:col-span-2">{u("labBring", lang)}</p>
            </>
          )}

          {step === 2 && (
            <>
              <div className="sm:col-span-2">
                <label htmlFor="name" className={label}>{u("fName", lang)} *</label>
                <input id="name" className={field} value={v.name} autoComplete="name" onChange={(e) => set("name", e.target.value)} />
                {err("name")}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="mobile" className={label}>{u("fMobile", lang)} *</label>
                <input id="mobile" type="tel" inputMode="numeric" className={field} value={v.mobile} autoComplete="tel" onChange={(e) => set("mobile", e.target.value)} />
                {err("mobile")}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="email" className={label}>{u("fEmailReq", lang)} *</label>
                <input id="email" type="email" className={field} value={v.email} autoComplete="email" onChange={(e) => set("email", e.target.value)} />
                <p className="mt-1.5 text-xs text-muted">{u("labConfirmNote", lang)}</p>
                {err("email")}
              </div>
              <div>
                <label htmlFor="age" className={label}>{u("fAge", lang)} *</label>
                <input id="age" type="number" min={0} max={120} className={field} value={v.age} onChange={(e) => set("age", e.target.value)} />
                {err("age")}
              </div>
              <div>
                <label htmlFor="gender" className={label}>{u("fGender", lang)} *</label>
                <select id="gender" className={field} value={v.gender} onChange={(e) => set("gender", e.target.value)}>
                  <option value="">{u("select", lang)}</option>
                  <option value="female">{u("female", lang)}</option>
                  <option value="male">{u("male", lang)}</option>
                  <option value="other">{u("other", lang)}</option>
                </select>
                {err("gender")}
              </div>

              {v.where === "home" && (
                <>
                  <div className="sm:col-span-2">
                    <button type="button" onClick={useMyLocation} disabled={loc === "busy"} className="btn btn-outline w-full justify-center disabled:opacity-60 sm:w-auto">
                      <LocateFixed className="h-4 w-4 text-green-600" aria-hidden />
                      {loc === "busy" ? u("labLocating", lang) : u("labUseLocation", lang)}
                    </button>
                    {loc === "ok" && v.lat && (
                      <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm text-green-800">
                        <MapPin className="h-4 w-4" aria-hidden /> {u("labLocationSaved", lang)}
                        <a href={`https://www.google.com/maps?q=${v.lat},${v.lng}`} target="_blank" rel="noopener noreferrer" className="font-semibold underline">{u("labViewMap", lang)}</a>
                      </p>
                    )}
                    {loc === "denied" && <p role="alert" className="mt-2 text-sm text-red-700">{u("labLocationDenied", lang)}</p>}
                    {loc === "fail" && <p role="alert" className="mt-2 text-sm text-red-700">{u("labLocationFail", lang)}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className={label}>{u("labAddress", lang)} *</label>
                    <textarea id="address" rows={3} maxLength={250} autoComplete="street-address" className={field} value={v.address} onChange={(e) => set("address", e.target.value)} />
                    {err("address")}
                  </div>
                  <div>
                    <label htmlFor="pincode" className={label}>{u("labPincode", lang)} *</label>
                    <input id="pincode" inputMode="numeric" maxLength={6} autoComplete="postal-code" className={field} value={v.pincode} onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))} />
                    {err("pincode")}
                  </div>
                </>
              )}

              {/* Honeypot: hidden from people, filled by bots */}
              <div aria-hidden className="absolute left-[-9999px]">
                <label>Website<input tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set("website", e.target.value)} /></label>
              </div>

              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
                  <input type="checkbox" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-1 h-5 w-5 rounded accent-blue-600" />
                  <span>{u("labConsent", lang)} *</span>
                </label>
                {err("consent")}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="btn btn-outline">
            <ArrowLeft className="h-4 w-4" aria-hidden /> {u("back", lang)}
          </button>
        ) : <span />}
        {step < 2 ? (
          <button key="continue" type="button" onClick={next} className="btn btn-blue">
            {u("next", lang)} <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        ) : (
          <button key="submit" type="submit" disabled={sending} className="btn btn-green disabled:opacity-60">
            {sending ? u("sending", lang) : u("labSubmit", lang)}
          </button>
        )}
      </div>
      {formError && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">{u(formError, lang)}</p>}
      <p className="mt-5 text-center text-xs text-muted">{u("noPayment", lang)}</p>
    </form>
  );
}
