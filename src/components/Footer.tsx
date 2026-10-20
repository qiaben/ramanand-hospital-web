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
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Logo size="sm" className="h-16 w-16" />
              <p className="text-2xl font-bold text-white">{tr(site.name, lang)}</p>
            </div>
            <p className="mt-5 text-lg font-semibold text-white/90">{tr(site.tagline, lang)}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">{u("footerNote", lang)}</p>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-lime">{u("followUs", lang)}</p>
            <div className="mt-3 flex gap-3">
              <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 transition hover:bg-white hover:text-blue-700">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21h3z" /></svg>
              </a>
              <a href={site.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 transition hover:bg-white hover:text-red-600">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z" /></svg>
              </a>
            </div>
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
              <li>
                <Link href={`/${lang}/lab-booking`} className="font-semibold text-lime">{u("bookLabTest", lang)}</Link>
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
            <h2 className={`${h} mt-6`}>{u("labPharmacyHours", lang)}</h2>
            <p className="mt-4 flex gap-3 text-[15px]">
              <Clock className="mt-1 h-4 w-4 shrink-0 text-lime" aria-hidden />
              {tr(site.labPharmacyText, lang)}
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
