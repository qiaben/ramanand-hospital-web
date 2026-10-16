"use client";

import { FlaskConical } from "lucide-react";
import { u } from "@/data/ui";
import { useLang } from "@/lib/lang-context";
import Logo from "./Logo";
import Tilt from "./Tilt";

/**
 * The crest as a living centrepiece: it beats like a heart, ripples spread out from it,
 * a ring of text slowly circles it, and the whole thing leans toward the pointer.
 */
export default function CrestOrbit() {
  const lang = useLang();
  const ring =
    lang === "en"
      ? "TRUST • CARE • HEALING • RAMANAND HOSPITAL • TRUST • CARE • HEALING • RAMANAND HOSPITAL • "
      : "विश्वास • देखभाल • उपचार • रामानंद हॉस्पिटल • विश्वास • देखभाल • उपचार • रामानंद हॉस्पिटल • ";

  return (
    <Tilt max={7} className="mx-auto w-full max-w-md" glare="rgb(255 255 255 / 0.5)">
      <div className="relative aspect-square">
        {/* soft glow behind everything */}
        <div aria-hidden className="absolute inset-[10%] rounded-full bg-[radial-gradient(closest-side,rgb(36_104_212/0.22),rgb(25_135_84/0.12)_60%,transparent)]" />

        {/* ripples, one per heartbeat */}
        {[0, 1.05, 2.1].map((d) => (
          <span
            key={d}
            aria-hidden
            className="animate-ripple absolute inset-[16%] rounded-full border border-blue-400/45"
            style={{ animationDelay: `${d}s` }}
          />
        ))}

        {/* circling text */}
        <svg aria-hidden viewBox="0 0 300 300" className="animate-ring-spin absolute inset-0 h-full w-full">
          <defs>
            <path id="crest-ring" d="M150 150 m-128 0 a128 128 0 1 1 256 0 a128 128 0 1 1 -256 0" />
          </defs>
          <text className="fill-blue-700/70 text-[10.5px] font-bold" style={{ letterSpacing: lang === "en" ? "3px" : "0" }}>
            <textPath href="#crest-ring">{ring}</textPath>
          </text>
        </svg>

        {/* the crest on a white disc */}
        <div className="absolute inset-[17%] rounded-full bg-white shadow-[0_24px_60px_-20px_rgb(21_80_192/0.45)] ring-1 ring-blue-100" />
        <div className="animate-beat absolute inset-[20%]" style={{ transform: "translateZ(40px)" }}>
          <Logo size="lg" priority className="h-full w-full drop-shadow-[0_10px_14px_rgb(11_31_71/0.22)]" />
        </div>

        {/* floating facts */}
        <div className="card animate-drift absolute left-0 top-0 rounded-xl px-3 py-1.5 sm:top-[12%] sm:px-3.5 sm:py-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-green-700">{lang === "en" ? "Day Care" : "डे केयर"}</p>
          <p className="text-sm font-bold text-blue-950">{lang === "en" ? "5 beds" : "5 बिस्तर"}</p>
        </div>
        <div className="card animate-drift absolute right-0 top-[4%] flex items-center gap-2 rounded-xl px-3 py-1.5 [animation-delay:-3s] sm:top-[26%] sm:gap-2.5 sm:px-3.5 sm:py-2">
          <FlaskConical className="h-5 w-5 text-green-700" aria-hidden />
          <p className="text-sm font-bold text-blue-950">{lang === "en" ? "Lab & Pharmacy" : "लैब एवं फार्मेसी"}</p>
        </div>
        <div className="card animate-drift absolute bottom-0 right-[4%] rounded-xl px-3 py-1.5 [animation-delay:-5s] sm:bottom-[8%] sm:px-3.5 sm:py-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-green-700">{u("opd", lang)}</p>
          <p className="text-sm font-bold text-blue-950">{lang === "en" ? "6 PM – 10 PM" : "शाम 6 – रात 10"}</p>
        </div>
      </div>
    </Tilt>
  );
}
