"use client";

import Link from "next/link";
import { CalendarCheck, Phone } from "lucide-react";
import { site } from "@/data/content";
import { u } from "@/data/ui";
import { useLang } from "@/lib/lang-context";

/** Always-visible call and appointment buttons on phones. */
export default function MobileBar() {
  const lang = useLang();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white p-2.5 shadow-[0_-8px_24px_-14px_rgb(11_31_71/0.3)] sm:hidden">
      <div className="mx-auto flex max-w-md gap-2.5">
        <a href={`tel:${site.tel}`} className="btn btn-outline flex-[0.85] px-3! py-3!">
          <Phone className="h-4 w-4 text-green-700" aria-hidden /> {u("call", lang)}
        </a>
        <Link href={`/${lang}/appointment`} className="btn btn-green flex-[1.7] whitespace-nowrap px-3! py-3! text-[13.5px]!">
          <CalendarCheck className="h-4 w-4" aria-hidden /> {u("requestAppt", lang)}
        </Link>
      </div>
    </div>
  );
}
