"use client";

import { useEffect, useRef, useState } from "react";
import { CALENDLY } from "@/data/integrations";
import { doctors } from "@/data/content";
import { u } from "@/data/ui";
import { tr } from "@/lib/i18n";
import { useLang } from "@/lib/lang-context";

declare global {
  interface Window {
    Calendly?: { initInlineWidget: (o: { url: string; parentElement: HTMLElement }) => void };
  }
}

const SCRIPT = "https://assets.calendly.com/assets/external/widget.js";

/** Calendly's live booking calendar, one tab per doctor that has a link. */
export default function CalendlyEmbed() {
  const lang = useLang();
  const options = [
    ...doctors.filter((d) => CALENDLY.doctors[d.slug]).map((d) => ({ key: d.slug, label: tr(d.name, lang), url: CALENDLY.doctors[d.slug] })),
    ...(CALENDLY.default ? [{ key: "default", label: u("anyDoctor", lang), url: CALENDLY.default }] : []),
  ];
  const [active, setActive] = useState(options[0]?.key);
  const url = options.find((o) => o.key === active)?.url;
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el || !url) return;
    el.innerHTML = "";
    const init = () => window.Calendly?.initInlineWidget({ url: `${url}?hide_gdpr_banner=1&primary_color=1550c0`, parentElement: el });
    if (window.Calendly) return init();
    let s = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT}"]`);
    if (!s) {
      s = document.createElement("script");
      s.src = SCRIPT;
      s.async = true;
      document.body.appendChild(s);
    }
    s.addEventListener("load", init);
    return () => s.removeEventListener("load", init);
  }, [url]);

  return (
    <div className="card rounded-2xl! p-4 sm:p-8">
      <h2 className="text-2xl text-blue-950">{u("bookCalendar", lang)}</h2>
      <p className="mt-2 text-muted">{u("bookCalendarSub", lang)}</p>
      {options.length > 1 && (
        <div role="group" aria-label={u("anyOf", lang)} className="mt-5 flex flex-wrap gap-2">
          {options.map((o) => (
            <button key={o.key} aria-pressed={active === o.key} onClick={() => setActive(o.key)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${active === o.key ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-800 hover:bg-blue-100"}`}>
              {o.label}
            </button>
          ))}
        </div>
      )}
      <div ref={box} className="mt-4 h-[720px] w-full" />
    </div>
  );
}
