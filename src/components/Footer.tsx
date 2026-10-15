import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { nav, site } from "@/data/content";
import { u } from "@/data/ui";
import { tr, type Lang } from "@/lib/i18n";
import Logo from "./Logo";

export default function Footer({ lang }: { lang: Lang }) {
  const h = "text-xs font-bold uppercase tracking-[0.16em] text-lime";
  return (
    <footer className="mt-auto bg-ink text-white/75">
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-14 sm:pb-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Logo size="sm" className="h-16 w-16" />
              <p className="text-2xl font-bold text-white">{tr(site.name, lang)}</p>
            </div>
            <p className="mt-5 text-lg font-semibold text-white/90">{tr(site.tagline, lang)}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">{u("footerNote", lang)}</p>
          </div>

          <div>
            <h2 className={h}>{u("quickLinks", lang)}</h2>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={`/${lang}${n.href}`} className="transition hover:text-white">{tr(n.label, lang)}</Link>
                </li>
              ))}
              <li>
                <Link href={`/${lang}/appointment`} className="font-semibold text-lime">{u("requestAppt", lang)}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={h}>{u("contactTitle", lang)}</h2>
            <ul className="mt-4 space-y-3.5 text-[15px]">
              <li className="flex gap-3"><MapPin className="mt-1 h-4 w-4 shrink-0 text-lime" aria-hidden />{tr(site.address, lang)}</li>
              <li className="flex gap-3"><Phone className="mt-1 h-4 w-4 shrink-0 text-lime" aria-hidden /><a href={`tel:${site.tel}`} className="transition hover:text-white">{site.phoneDisplay}</a></li>
              <li className="flex gap-3"><Mail className="mt-1 h-4 w-4 shrink-0 text-lime" aria-hidden /><a href={`mailto:${site.email}`} className="break-all transition hover:text-white">{site.email}</a></li>
            </ul>
          </div>

          <div>
            <h2 className={h}>{u("timings", lang)}</h2>
            <p className="mt-4 flex gap-3 text-[15px]">
              <Clock className="mt-1 h-4 w-4 shrink-0 text-lime" aria-hidden />
              {tr(site.opdText, lang)}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>© {tr(site.name, lang)} · {tr(site.entity, lang)} · {u("facilityId", lang)}: {site.facilityId}</p>
          <p className="flex gap-5">
            <Link href={`/${lang}/privacy`} className="transition hover:text-white">{u("privacy", lang)}</Link>
            <Link href={`/${lang}/disclaimer`} className="transition hover:text-white">{u("disclaimer", lang)}</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
