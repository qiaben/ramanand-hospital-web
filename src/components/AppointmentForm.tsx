"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, TriangleAlert } from "lucide-react";
import { departments, deptBySlug, doctorBySlug, doctors } from "@/data/content";
import { timeLabel } from "@/data/slots";
import SlotPicker from "./SlotPicker";
import { bookingConfigured, formConfigured, mailtoFallback, submitBooking, submitForm } from "@/lib/submit";
import { u, type UiKey } from "@/data/ui";
import { tr } from "@/lib/i18n";
import { useLang } from "@/lib/lang-context";

type Values = {
  department: string;
  doctor: string;
  date: string;
  time: string;
  name: string;
  mobile: string;
  email: string;
  age: string;
  gender: string;
  reason: string;
  consent: boolean;
  website: string; // honeypot, must stay empty
};
type Errors = Partial<Record<keyof Values, UiKey>>;

const empty: Values = {
  department: "", doctor: "", date: "", time: "", name: "", mobile: "",
  email: "", age: "", gender: "", reason: "", consent: false, website: "",
};

function validate(step: number, v: Values): Errors {
  const e: Errors = {};
  if (step === 0 && !v.department) e.department = "eDept";
  if (step === 1) {
    if (!v.date) e.date = "eDate";
    else if (new Date(`${v.date}T00:00:00`).getDay() === 0) e.date = "eSunday";
    if (!v.time) e.time = "eTime";
  }
  if (step === 2) {
    if (v.name.trim().length < 2) e.name = "eName";
    if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.mobile.replace(/\s|-/g, ""))) e.mobile = "eMobile";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "eEmail";
    const age = Number(v.age);
    if (!v.age || !Number.isFinite(age) || age < 0 || age > 120) e.age = "eAge";
    if (!v.gender) e.gender = "eGender";
    if (!v.consent) e.consent = "eConsent";
  }
  return e;
}

const field =
  "w-full rounded-2xl border border-line bg-paper/60 px-4 py-3.5 text-blue-950 placeholder:text-muted/60 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:bg-mist";
const label = "mb-2 block text-sm font-medium text-blue-950";

export default function AppointmentForm() {
  const lang = useLang();
  const params = useSearchParams();
  const [v, setV] = useState<Values>(() => {
    const doc = doctorBySlug(params.get("doctor") ?? "");
    if (doc) return { ...empty, doctor: doc.slug, department: doc.department };
    const dept = deptBySlug(params.get("dept") ?? "");
    return dept ? { ...empty, department: dept.slug } : empty;
  });
  const [errors, setErrors] = useState<Errors>({});
  const [step, setStep] = useState(0);
  const [ref, setRef] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<UiKey | null>(null);
  const [mailto, setMailto] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

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
      <p role="alert" className="mt-2 text-sm text-red-700">
        {u(errors[k]!, lang)}
      </p>
    ) : null;

  const steps: UiKey[] = ["stepDoctor", "stepWhen", "stepYou"];
  const doc = v.doctor ? doctorBySlug(v.doctor) : undefined;
  const deptDoctors = doctors.filter((d) => d.department === v.department);
  // Each department has one doctor today, so "any available doctor" books that doctor.
  const slotDoctor = v.doctor || deptDoctors[0]?.slug || "";

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

    // The reference lets staff and the patient find this request again on the phone.
    const code = `RH-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
    const fields = {
      reference: code,
      patient_language: lang === "hi" ? "Hindi" : "English",
      department: deptBySlug(v.department)?.name.en ?? v.department,
      doctor: doctorBySlug(v.doctor)?.name.en ?? "Any available doctor",
      preferred_date: v.date,
      preferred_time: timeLabel(v.time, "en"),
      patient_name: v.name,
      mobile: v.mobile,
      email: v.email || "(not given)",
      age: v.age,
      gender: v.gender,
      reason: v.reason || "(not given)",
      consent_given: "yes",
    };
    const subject = `New appointment request ${code}`;

    if (bookingConfigured()) {
      setSending(true);
      setFormError(null);
      const r = await submitBooking({
        kind: "appt", lang, doctor: slotDoctor, name: v.name, mobile: v.mobile, email: v.email, age: v.age, gender: v.gender,
        date: v.date, time: v.time, website: v.website,
        details: { department: deptBySlug(v.department)?.name.en ?? v.department, reason: v.reason },
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
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card rounded-2xl! p-8 text-center sm:p-12"
      >
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
            [u("fDepartment", lang), deptBySlug(v.department) ? tr(deptBySlug(v.department)!.name, lang) : ""],
            [u("fDoctor", lang), doc ? tr(doc.name, lang) : u("anyDoctor", lang)],
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
        <button
          onClick={() => { setV(empty); setStep(0); setRef(null); setMailto(null); setBooked(false); }}
          className="btn btn-outline mt-8"
        >
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
          className="mt-9 grid gap-6 sm:grid-cols-2"
        >
          {step === 0 && (
            <>
              <div className="sm:col-span-2">
                <label htmlFor="department" className={label}>{u("fDepartment", lang)} *</label>
                <select id="department" className={field} value={v.department}
                  onChange={(e) => { setV((p) => ({ ...p, department: e.target.value, doctor: "" })); setErrors((p) => ({ ...p, department: undefined })); }}>
                  <option value="">{u("selectDept", lang)}</option>
                  {departments.map((d) => <option key={d.slug} value={d.slug}>{tr(d.name, lang)}</option>)}
                </select>
                {err("department")}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="doctor" className={label}>{u("fDoctor", lang)}</label>
                <select id="doctor" className={field} value={v.doctor} disabled={!v.department} onChange={(e) => set("doctor", e.target.value)}>
                  <option value="">{u("anyDoctor", lang)}</option>
                  {deptDoctors.map((d) => <option key={d.slug} value={d.slug}>{tr(d.name, lang)}</option>)}
                </select>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="sm:col-span-2">
                <label htmlFor="date" className={label}>{u("fDate", lang)} *</label>
                <input id="date" type="date" ref={dateRef} className={field} value={v.date} onChange={(e) => { set("date", e.target.value); set("time", ""); }} />
                <p className="mt-2 text-xs text-muted">{u("opd", lang)}: {lang === "en" ? "Mon to Sat, 6 PM to 10 PM" : "सोम से शनि, शाम 6 से रात 10 बजे"}</p>
                {err("date")}
              </div>
              <div className="sm:col-span-2">
                <p id="time-label" className={label}>{u("fTimeExact", lang)} *</p>
                <SlotPicker kind="appt" doctor={slotDoctor} date={v.date} value={v.time} onChange={(t) => set("time", t)} />
                {err("time")}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="sm:col-span-2">
                <label htmlFor="name" className={label}>{u("fName", lang)} *</label>
                <input id="name" className={field} value={v.name} autoComplete="name" onChange={(e) => set("name", e.target.value)} />
                {err("name")}
              </div>
              <div>
                <label htmlFor="mobile" className={label}>{u("fMobile", lang)} *</label>
                <input id="mobile" type="tel" inputMode="numeric" className={field} value={v.mobile} autoComplete="tel" onChange={(e) => set("mobile", e.target.value)} />
                {err("mobile")}
              </div>
              <div>
                <label htmlFor="email" className={label}>{u("fEmailReq", lang)} *</label>
                <input id="email" type="email" className={field} value={v.email} autoComplete="email" onChange={(e) => set("email", e.target.value)} />
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
              <div className="sm:col-span-2">
                <label htmlFor="reason" className={label}>{u("fReason", lang)}</label>
                <textarea id="reason" rows={3} maxLength={250} placeholder={u("fReasonHint", lang)} className={field} value={v.reason} onChange={(e) => set("reason", e.target.value)} />
                <p className="mt-1 text-right text-xs text-muted">{v.reason.length}/250</p>
              </div>

              {/* Honeypot: hidden from people, filled by bots */}
              <div aria-hidden className="absolute left-[-9999px]">
                <label>Website<input tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set("website", e.target.value)} /></label>
              </div>

              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
                  <input type="checkbox" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-1 h-5 w-5 rounded accent-blue-600" />
                  {/* TODO: replace with the hospital-approved consent text linked to the Privacy Notice. */}
                  <span>{u("consent", lang)} *</span>
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
            {sending ? u("sending", lang) : u("submit", lang)}
          </button>
        )}
      </div>
      {formError && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">{u(formError, lang)}</p>}
      <p className="mt-5 text-center text-xs text-muted">{u("noPayment", lang)}</p>
    </form>
  );
}
