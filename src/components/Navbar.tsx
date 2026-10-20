"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Clock, FlaskConical, Menu, Phone, Pill, X } from "lucide-react";
import { nav, site } from "@/data/content";
import { u } from "@/data/ui";
import { tr } from "@/lib/i18n";
import { useLang } from "@/lib/lang-context";
import Logo from "./Logo";
import OpenNow from "./OpenNow";

export default function Navbar() {
  const lang = useLang();
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(en|hi)/, "").replace(/\/$/, "") || "";
  const other = lang === "en" ? "hi" : "en";

  // The menu counts as open only on the page it was opened on, so navigating closes it.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "" ? rest === "" : rest.startsWith(href));

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-linear-to-r from-blue-950 via-blue-900 to-green-800 text-white sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-1.5 text-[13px]">
          <span className="flex min-w-0 items-center gap-x-4">
            <span className="flex items-center gap-2 whitespace-nowrap">
              <Clock className="h-3.5 w-3.5 text-lime" aria-hidden />
              <span className="font-bold">{u("opd", lang)}</span>
              <span className="text-white/90">{tr(site.opdText, lang)}</span>
              <OpenNow compact />
            </span>
            <span aria-hidden className="hidden h-4 w-px bg-white/30 lg:block" />
            <span className="hidden items-center gap-2 whitespace-nowrap lg:flex">
              <Pill className="h-3.5 w-3.5 text-lime" aria-hidden />
              <span className="font-bold">{u("labPharmacyShort", lang)}</span>
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 font-semibold">{tr(site.labPharmacyText, lang)}</span>
            </span>
          </span>
          <a href={`tel:${site.tel}`} className="flex shrink-0 items-center gap-2 whitespace-nowrap font-semibold transition hover:text-white/80">
            <Phone className="h-3.5 w-3.5 text-white/90" aria-hidden />
            {site.phoneDisplay}
          </a>
        </div>
      </div>

      <div className={`relative bg-linear-to-r from-blue-800 via-blue-600 to-green-600 text-white transition-shadow duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-linear-to-r after:from-lime after:via-white after:to-lime ${scrolled ? "shadow-[0_12px_30px_-12px_rgb(8_30_80/0.6)]" : "shadow-[0_8px_20px_-14px_rgb(8_30_80/0.45)]"}`}>
        <nav aria-label="Main" className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-2.5">
          <Link href={`/${lang}`} className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-md ring-2 ring-white/40 sm:h-14 sm:w-14">
              <Logo size="sm" className="h-10 w-10 sm:h-12 sm:w-12" priority />
            </span>
            <span className="leading-none">
              <span className="block whitespace-nowrap text-base font-extrabold text-white sm:text-xl xl:text-lg 2xl:text-xl">{tr(site.name, lang)}</span>
              <span className="mt-1 block whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.2em] text-lime sm:text-[10px]">
                {lang === "en" ? "Trust · Care · Healing" : "विश्वास · देखभाल · उपचार"}
              </span>
            </span>
          </Link>

          <ul className="hidden items-center xl:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={`/${lang}${item.href}`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="relative block whitespace-nowrap px-2.5 py-5 text-[14.5px] 2xl:px-3.5 font-semibold text-white/90 transition-colors hover:text-white aria-[current=page]:text-white after:absolute after:inset-x-2.5 after:bottom-[3px] 2xl:after:inset-x-3.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-lime after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
                >
                  {tr(item.label, lang)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href={`/${other}${rest}/`}
              hrefLang={other}
              lang={other}
              className="rounded-lg border border-white/40 bg-white/10 px-2.5 py-2 text-sm font-bold text-white transition hover:bg-white/25"
            >
              {u("switchTo", lang)}
            </Link>
            <Link
              href={`/${lang}/lab-booking`}
              className="group hidden items-center gap-2 whitespace-nowrap rounded-full border border-lime/70 bg-linear-to-br from-lime to-green-300 px-3.5 py-2.5 text-[13.5px] font-bold text-blue-950 shadow-lg shadow-green-900/30 transition hover:-translate-y-0.5 hover:shadow-xl md:inline-flex"
            >
              <FlaskConical className="h-4 w-4 transition group-hover:-rotate-12" aria-hidden />
              {u("bookLabShort", lang)}
            </Link>
            <Link href={`/${lang}/appointment`} className="btn hidden whitespace-nowrap bg-white! px-4! py-2.5! text-[14px]! 2xl:px-5! text-blue-800! shadow-lg shadow-blue-950/25 hover:bg-blue-50! sm:inline-flex">
              <CalendarCheck className="h-4 w-4 text-green-600" aria-hidden />
              {u("requestAppt", lang)}
            </Link>
            <button
              onClick={() => setOpenPath(open ? null : pathname)}
              aria-expanded={open}
              aria-label={open ? u("close", lang) : u("menu", lang)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/40 bg-white/10 text-white xl:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-white/20 bg-linear-to-br from-blue-700 to-green-700 xl:hidden"
            >
              <ul className="mx-auto max-w-7xl px-5 py-2">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={`/${lang}${item.href}`} className="block border-b border-white/15 py-3.5 text-lg font-semibold text-white">
                      {tr(item.label, lang)}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mx-auto max-w-7xl px-5 pb-4 pt-1">
                <Link href={`/${lang}/lab-booking`} className="flex items-center justify-center gap-2 rounded-full bg-linear-to-br from-lime to-green-300 px-5 py-3.5 text-base font-bold text-blue-950 shadow-lg">
                  <FlaskConical className="h-5 w-5" aria-hidden />
                  {u("bookLabTest", lang)}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
