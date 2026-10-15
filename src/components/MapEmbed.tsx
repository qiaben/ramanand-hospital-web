"use client";

import { useState } from "react";
import { ExternalLink, Layers, Map as MapIcon } from "lucide-react";
import { site } from "@/data/content";
import { u } from "@/data/ui";
import { useLang } from "@/lib/lang-context";

/**
 * Live Google map centred on the hospital's exact pin, in satellite view by default.
 * Uses Google's keyless embed, so no API key or billing is needed.
 */
export default function MapEmbed() {
  const lang = useLang();
  const [view, setView] = useState<"k" | "m">("k"); // k = satellite, m = road map
  const { lat, lng } = site.coords;
  const src = `https://maps.google.com/maps?q=${lat},${lng}&t=${view}&z=19&hl=${lang === "hi" ? "hi" : "en"}&output=embed`;

  const tab = (v: "k" | "m", label: string, Icon: typeof Layers) => (
    <button
      type="button"
      onClick={() => setView(v)}
      aria-pressed={view === v}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
        view === v ? "bg-blue-600 text-white shadow" : "text-blue-900 hover:bg-blue-50"
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {label}
    </button>
  );

  return (
    <div className="card relative h-full min-h-96 overflow-hidden p-0">
      <iframe
        title={u("mapTitle", lang)}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
      <div className="absolute left-3 top-3 flex gap-1 rounded-xl bg-white/95 p-1 shadow-md ring-1 ring-line backdrop-blur">
        {tab("k", u("mapSatellite", lang), Layers)}
        {tab("m", u("mapRoad", lang), MapIcon)}
      </div>
      <a
        href={site.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-blue absolute bottom-3 left-3 px-4! py-2.5! text-sm!"
      >
        <ExternalLink className="h-4 w-4" aria-hidden />
        {u("openMaps", lang)}
      </a>
    </div>
  );
}
