import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarCheck, FlaskConical } from "lucide-react";
import { site } from "@/data/content";
import { u } from "@/data/ui";
import { hasLocale, tr } from "@/lib/i18n";
import QrCode from "@/components/QrCode";
import PrintButton from "@/components/PrintButton";

// A page for the front desk to print. It is not meant to be found through search.
export const metadata: Metadata = { title: "QR codes", robots: { index: false, follow: false } };

export default async function Page({ params }: PageProps<"/[lang]/qr">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const base = `https://${site.domain}/${lang}`;
  const cards = [
    { icon: FlaskConical, title: u("qrLab", lang), url: `${base}/lab-booking/` },
    { icon: CalendarCheck, title: u("qrAppt", lang), url: `${base}/appointment/` },
  ];
  return (
    <section className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-4xl text-blue-950">{u("qrTitle", lang)}</h1>
          <p className="mt-2 max-w-xl text-muted">{u("qrSub", lang)}</p>
        </div>
        <PrintButton label={u("qrPrint", lang)} />
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 print:mt-0 print:gap-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <li key={c.url} className="card flex flex-col items-center rounded-3xl! p-8 text-center print:break-inside-avoid print:border print:shadow-none">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700"><Icon className="h-6 w-6" aria-hidden /></span>
              <h2 className="mt-4 text-2xl text-blue-950">{c.title}</h2>
              <QrCode url={c.url} label={c.title} className="mt-5 w-full max-w-64 [&>svg]:h-auto [&>svg]:w-full" />
              <p className="mt-4 text-sm font-semibold text-blue-950">{tr(site.name, lang)}</p>
              <p className="mt-1 break-all text-xs text-muted">{c.url.replace("https://", "")}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
