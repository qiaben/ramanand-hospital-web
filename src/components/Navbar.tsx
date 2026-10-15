"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Clock, Menu, Phone, X } from "lucide-react";
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
    <header className="sticky top-0 z-50 bg-white">
      <div className="hidden border-b border-line bg-blue-50 text-blue-900 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-1.5 text-[13px]">
          <span className="flex items-center gap-3">
            <Clock className="h-3.5 w-3.5 text-green-700" aria-hidden />
            {u("opd", lang)} · {tr(site.opdText, lang)}
            <OpenNow compact />
          </span>
          <a href={`tel:${site.tel}`} className="flex items-center gap-2 font-semibold transition hover:text-blue-600">
            <Phone className="h-3.5 w-3.5 text-green-700" aria-hidden />
            {site.phoneDisplay}
          </a>
        </div>
      </div>

      <div className={`border-b bg-white transition-shadow duration-300 ${scrolled ? "border-line shadow-[0_8px_24px_-16px_rgb(11_31_71/0.35)]" : "border-line"}`}>
        <nav aria-label="Main" className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2.5">
          <Link href={`/${lang}`} className="flex items-center gap-3">
            <Logo size="sm" className="h-12 w-12 sm:h-14 sm:w-14" priority />
            <span className="leading-none">
              <span className="block whitespace-nowrap text-base font-extrabold text-blue-800 sm:text-xl">{tr(site.name, lang)}</span>
              <span className="mt-1 block whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.2em] text-green-700 sm:text-[10px]">
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
                  className="relative block whitespace-nowrap px-3.5 py-5 text-[14.5px] font-semibold text-blue-950/75 transition-colors hover:text-blue-700 aria-[current=page]:text-blue-700 after:absolute after:inset-x-3.5 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-green-500 after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
                >
                  {tr(item.label, lang)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2.5">
            <Link
              href={`/${other}${rest}/`}
              hrefLang={other}
              lang={other}
              className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
            >
              {u("switchTo", lang)}
            </Link>
            <Link href={`/${lang}/appointment`} className="btn btn-green hidden whitespace-nowrap px-5! py-2.5! sm:inline-flex">
              <CalendarCheck className="h-4 w-4" aria-hidden />
              {u("requestAppt", lang)}
            </Link>
            <button
              onClick={() => setOpenPath(open ? null : pathname)}
              aria-expanded={open}
              aria-label={open ? u("close", lang) : u("menu", lang)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-blue-800 xl:hidden"
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
              className="overflow-hidden border-t border-line bg-white xl:hidden"
            >
              <ul className="mx-auto max-w-7xl px-5 py-2">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={`/${lang}${item.href}`} className="block border-b border-line py-3.5 text-lg font-semibold text-blue-900">
                      {tr(item.label, lang)}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
