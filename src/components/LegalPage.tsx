import { TriangleAlert } from "lucide-react";
import type { L, Lang } from "@/lib/i18n";
import { tr } from "@/lib/i18n";
import { PageHeader } from "./Section";
import Reveal from "./Reveal";

export default function LegalPage({
  lang,
  doc,
}: {
  lang: Lang;
  doc: { title: L; intro: L; sections: { h: L; p: L }[] };
}) {
  return (
    <>
      <PageHeader eyebrow={lang === "en" ? "Legal" : "कानूनी"} title={tr(doc.title, lang)} sub={tr(doc.intro, lang)} />
      <div className="mx-auto max-w-3xl px-5 py-20">
        {/* Remove this banner once the hospital has approved the text. */}
        <p className="mb-12 flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {lang === "en"
            ? "Draft for the hospital's review and approval. Not yet final."
            : "अस्पताल की समीक्षा और स्वीकृति के लिए प्रारूप। अभी अंतिम नहीं है।"}
        </p>
        <div className="space-y-10">
          {doc.sections.map((s, i) => (
            <Reveal key={s.h.en}>
              <section>
                <h2 className="text-3xl text-blue-950">
                  <span className="mr-3 text-green-700 font-display">{String(i + 1).padStart(2, "0")}</span>
                  {tr(s.h, lang)}
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-muted">{tr(s.p, lang)}</p>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
