"use client";

import { useState } from "react";
import { Check, TriangleAlert } from "lucide-react";
import { formConfigured, mailtoFallback, submitForm } from "@/lib/submit";
import { u, type UiKey } from "@/data/ui";
import { useLang } from "@/lib/lang-context";

const field =
  "w-full rounded-2xl border border-line bg-paper/60 px-4 py-3.5 text-blue-950 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10";

export default function ContactForm() {
  const lang = useLang();
  const [v, setV] = useState({ name: "", mobile: "", message: "", website: "" });
  const [errors, setErrors] = useState<Partial<Record<"name" | "mobile" | "message", UiKey>>>({});
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [mailto, setMailto] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (v.website || sending) return; // bot or double click
    const errs: typeof errors = {};
    if (v.name.trim().length < 2) errs.name = "eName";
    if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.mobile.replace(/\s|-/g, ""))) errs.mobile = "eMobile";
    if (v.message.trim().length < 5) errs.message = "eMessage";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const fields = { name: v.name, mobile: v.mobile, message: v.message };
    const subject = `Website enquiry from ${v.name}`;
    if (!formConfigured()) {
      setMailto(mailtoFallback(subject, `name: ${v.name}\nmobile: ${v.mobile}\n\n${v.message}`));
      return setDone(true);
    }
    setSending(true);
    setFailed(false);
    const ok = await submitForm(subject, fields);
    setSending(false);
    if (ok) setDone(true);
    else setFailed(true);
  }

  if (done) {
    return (
      <div className="card rounded-2xl! p-8 text-center sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-700">
          <Check className="h-7 w-7" aria-hidden />
        </span>
        <p className="mt-5 font-display text-2xl text-blue-950">{u("sent", lang)}</p>
        {mailto && (
          <div className="mx-auto mt-5 max-w-sm rounded-xl bg-amber-50 p-4 text-left text-sm text-amber-900">
            <p className="flex items-start gap-2 font-bold"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{u("notSentTitle", lang)}</p>
            <p className="mt-1">{u("notSentText", lang)}</p>
            <a href={mailto} className="btn btn-blue mt-3 px-5! py-2.5!">{u("mailInstead", lang)}</a>
          </div>
        )}
      </div>
    );
  }

  const row = (id: "name" | "mobile", key: UiKey, type = "text") => (
    <div>
      <label htmlFor={`c-${id}`} className="mb-2 block text-sm font-semibold text-blue-950">{u(key, lang)} *</label>
      <input id={`c-${id}`} type={type} className={field} value={v[id]} onChange={(e) => { setV({ ...v, [id]: e.target.value }); setErrors({ ...errors, [id]: undefined }); }} />
      {errors[id] && <p role="alert" className="mt-2 text-sm text-red-700">{u(errors[id]!, lang)}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 card rounded-2xl! p-6 sm:p-10">
      <h2 className="text-4xl text-blue-950">{u("enquiry", lang)}</h2>
      {row("name", "yourName")}
      {row("mobile", "fMobile", "tel")}
      <div>
        <label htmlFor="c-message" className="mb-2 block text-sm font-semibold text-blue-950">{u("yourMessage", lang)} *</label>
        <textarea id="c-message" rows={4} className={field} value={v.message} onChange={(e) => { setV({ ...v, message: e.target.value }); setErrors({ ...errors, message: undefined }); }} />
        {errors.message && <p role="alert" className="mt-2 text-sm text-red-700">{u(errors.message, lang)}</p>}
      </div>
      <div aria-hidden className="absolute left-[-9999px]">
        <label>Website<input tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => setV({ ...v, website: e.target.value })} /></label>
      </div>
      {failed && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{u("eServer", lang)}</p>}
      <button type="submit" disabled={sending} className="btn btn-green disabled:opacity-60">
        {sending ? u("sending", lang) : u("send", lang)}
      </button>
    </form>
  );
}
