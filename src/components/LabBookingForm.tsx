"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Building2, Check, FlaskConical, Home, TriangleAlert } from "lucide-react";
import { labWindows } from "@/data/windows";
import { formConfigured, mailtoFallback, submitForm } from "@/lib/submit";
import { u, type UiKey } from "@/data/ui";
import { useLang } from "@/lib/lang-context";

// Test areas the laboratory has told us it covers. The last option lets the team guide the patient.
const tests = [
  { v: "Microbiology", en: "Microbiology", hi: "माइक्रोबायोलॉजी" },
  { v: "Biochemistry", en: "Biochemistry", hi: "बायोकेमिस्ट्री" },
  { v: "Hematology", en: "Hematology", hi: "हेमेटोलॉजी" },
  { v: "ECG", en: "ECG", hi: "ECG" },
  { v: "Doctor advised / not sure", en: "", hi: "" },
] as const;

type Values = {
  tests: string[];
  testNames: string;
  where: "hospital" | "home";
  address: string;
  pincode: string;
  date: string;
  time: string;
  name: string;
  mobile: string;
  age: string;
  gender: string;
  consent: boolean;
  website: string; // honeypot, must stay empty
};
type Errors = Partial<Record<keyof Values, UiKey>>;

const empty: Values = { tests: [], testNames: "", where: "hospital", address: "", pincode: "", date: "", time: "", name: "", mobile: "", age: "", gender: "", consent: false, website: "" };

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
  const testLabel = (t: (typeof tests)[number]) => (t.en ? t[lang] : u("labNotSure", lang));
  const toggle = (t: string) => set("tests", v.tests.includes(t) ? v.tests.filter((x) => x !== t) : [...v.tests, t]);

  const steps: UiKey[] = ["labStepTests", "stepWhen", "stepYou"];

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
    const win = labWindows.find((w) => w.v === v.time);
    const fields = {
      reference: code,
      patient_language: lang === "hi" ? "Hindi" : "English",
      tests: v.tests.join(", "),
      test_notes: v.testNames || "(not given)",
      sample_collection: v.where === "home" ? "Home collection (staff to visit)" : "Patient visits the hospital",
      address: v.where === "home" ? v.address : "(not needed)",
      pincode: v.where === "home" ? v.pincode : "(not needed)",
      preferred_date: v.date,
      preferred_time: win?.en ?? v.time,
      patient_name: v.name,
      mobile: v.mobile,
      age: v.age,
      gender: v.gender,
      consent_given: "yes",
    };
    const subject = `New lab slot request ${code}`;

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
    const win = labWindows.find((w) => w.v === v.time);
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
        <h2 className="mt-6 text-4xl text-blue-950">{u("received", lang)}</h2>
        <p className="mx-auto mt-3 max-w-md text-muted">{u("receivedText", lang).replace("{mobile}", v.mobile)}</p>
        <dl className="mx-auto mt-8 max-w-sm divide-y divide-line border-y border-line text-left text-sm">
          {[
            [u("labTestsSel", lang), v.tests.map((t) => testLabel(tests.find((x) => x.v === t)!)).join(", ")],
            [u("labWhere", lang), v.where === "home" ? u("labHome", lang) : u("labHospital", lang)],
            [u("fDate", lang), `${v.date} · ${win ? win[lang] : ""}`],
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
        <button onClick={() => { setV(empty); setStep(0); setRef(null); setMailto(null); }} className="btn btn-outline mt-8">
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
                <p id="tests-label" className={label}>{u("labPickTests", lang)} *</p>
                <p className="-mt-1 mb-3 text-xs text-muted">{u("labPickHint", lang)}</p>
                <div role="group" aria-labelledby="tests-label" className="grid gap-3 sm:grid-cols-2">
                  {tests.map((t) => {
                    const on = v.tests.includes(t.v);
                    return (
                      <button type="button" key={t.v} aria-pressed={on} onClick={() => toggle(t.v)} className={`flex items-center gap-3 text-left ${pick} px-4! ${on ? pickOn : pickOff}`}>
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${on ? "bg-white/20" : "bg-blue-50 text-blue-600"}`}>
                          {on ? <Check className="h-4 w-4" aria-hidden /> : <FlaskConical className="h-3.5 w-3.5" aria-hidden />}
                        </span>
                        {testLabel(t)}
                      </button>
                    );
                  })}
                </div>
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
                <div role="group" aria-labelledby="where-label" className="grid gap-3 sm:grid-cols-2">
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
                <input id="date" type="date" ref={dateRef} className={field} value={v.date} onChange={(e) => set("date", e.target.value)} />
                {err("date")}
              </div>
              <div className="sm:col-span-2">
                <p id="time-label" className={label}>{u("labTime", lang)} *</p>
                <div role="group" aria-labelledby="time-label" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {labWindows.map((w) => (
                    <button type="button" key={w.v} aria-pressed={v.time === w.v} onClick={() => set("time", w.v)} className={`${pick} ${v.time === w.v ? pickOn : pickOff}`}>
                      {w[lang]}
                    </button>
                  ))}
                </div>
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
          <button type="button" onClick={next} className="btn btn-blue">
            {u("next", lang)} <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        ) : (
          <button type="submit" disabled={sending} className="btn btn-green disabled:opacity-60">
            {sending ? u("sending", lang) : u("labSubmit", lang)}
          </button>
        )}
      </div>
      {formError && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">{u(formError, lang)}</p>}
      <p className="mt-5 text-center text-xs text-muted">{u("noPayment", lang)}</p>
    </form>
  );
}
