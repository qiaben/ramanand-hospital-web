import Link from "next/link";
import { ArrowRight, Clock, Languages } from "lucide-react";
import { deptBySlug, doctors, listedDoctors, site } from "@/data/content";
import { u } from "@/data/ui";
import { tr, trl, type Lang } from "@/lib/i18n";
import Reveal from "./Reveal";
import Tilt from "./Tilt";

/** Round avatar with a slowly turning ring. Shows initials until the doctor's photo (with consent) is supplied. */
export function Portrait({
  initials,
  size = "md",
  tone = "blue",
}: {
  initials: string;
  size?: "md" | "lg";
  tone?: "blue" | "green";
}) {
  const dim = size === "lg" ? "h-44 w-44" : "h-24 w-24";
  return (
    <div className={`relative shrink-0 ${dim}`}>
      <div aria-hidden className="animate-ring-spin absolute -inset-1 rounded-full" style={{ background: `conic-gradient(from 0deg, ${tone === "blue" ? "#0b5ed7, #bcd4fa, #45b886, #0b5ed7" : "#198754, #a3d6bf, #4a82e0, #198754"})`, animationDuration: "14s" }} />
      <div
        className={`relative flex h-full w-full items-center justify-center rounded-full ring-4 ring-white ${
          tone === "blue" ? "bg-linear-to-br from-blue-100 to-blue-50 text-blue-700" : "bg-linear-to-br from-green-100 to-green-50 text-green-700"
        } ${size === "lg" ? "text-6xl" : "text-3xl"} font-extrabold`}
      >
        {initials}
      </div>
    </div>
  );
}

export default function DoctorCards({ lang }: { lang: Lang }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {doctors.map((d, i) => {
        const dept = deptBySlug(d.department);
        const tone = i % 2 === 0 ? "blue" : "green";
        return (
          <Reveal key={d.slug} delay={i * 0.1} className="h-full">
            <Tilt className="h-full">
              <Link href={`/${lang}/doctors/${d.slug}`} className="card card-hover edge-glow group flex h-full flex-col gap-6 p-6 sm:flex-row sm:p-7">
                <Portrait initials={tr(d.initials, lang)} tone={tone} />
                <div className="flex flex-1 flex-col">
                  <p className={`text-xs font-bold uppercase tracking-[0.14em] ${tone === "blue" ? "text-blue-600" : "text-green-700"}`}>
                    {dept && tr(dept.name, lang).split(" (")[0]}
                  </p>
                  <h3 className="mt-1.5 text-2xl text-blue-950">{tr(d.name, lang)}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-md bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700">{d.qualification}</span>
                    <span className="rounded-md bg-green-50 px-2.5 py-1 text-sm font-semibold text-green-700">
                      {d.experienceYears} {u("yearsExp", lang)}
                    </span>
                  </div>
                  <p className="mt-4 flex items-center gap-2.5 text-sm text-muted">
                    <Clock className="h-4 w-4 text-green-700" aria-hidden /> {tr(site.opdText, lang)}
                  </p>
                  <p className="mt-1.5 flex items-start gap-2.5 text-sm text-muted">
                    <Languages className="mt-0.5 h-4 w-4 shrink-0 text-green-700" aria-hidden /> {trl(d.languages, lang).join(" · ")}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold text-blue-700">
                    {u("viewProfile", lang)}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            </Tilt>
          </Reveal>
        );
      })}
      {listedDoctors.map((d, i) => {
        const tone = (doctors.length + i) % 2 === 0 ? "blue" : "green";
        return (
          <Reveal key={d.key} delay={(doctors.length + i) * 0.1} className="h-full lg:last:odd:col-span-2 lg:last:odd:mx-auto lg:last:odd:w-[calc(50%-0.75rem)]">
            <div className="card flex h-full flex-col gap-6 p-6 sm:flex-row sm:p-7">
              <Portrait initials={tr(d.initials, lang)} tone={tone} />
              <div className="flex flex-1 flex-col justify-center">
                <p className={`text-xs font-bold uppercase tracking-[0.14em] ${tone === "blue" ? "text-blue-600" : "text-green-700"}`}>{tr(d.field, lang)}</p>
                <h3 className="mt-1.5 text-2xl text-blue-950">{tr(d.name, lang)}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-md bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700">{d.qualification}</span>
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
