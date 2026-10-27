import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Phone } from "lucide-react";
import { site } from "@/data/content";
import { u } from "@/data/ui";
import { hasLocale, tr } from "@/lib/i18n";
import { PageHeader } from "@/components/Section";
import LabBookingForm from "@/components/LabBookingForm";
import QrCode from "@/components/QrCode";
import { bookingConfigured } from "@/lib/submit";

export async function generateMetadata({ params }: PageProps<"/[lang]/lab-booking">): Promise<Metadata> {
  const { lang } = await params;
  return { title: hasLocale(lang) ? u("labBookTitle", lang) : "Lab booking" };
}

export default async function Page({ params }: PageProps<"/[lang]/lab-booking">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <>
      <PageHeader eyebrow={u("labPharmacyHours", lang)} title={u("labBookTitle", lang)} sub={u(bookingConfigured() ? "labBookSubBooked" : "labBookSub", lang)} />
      <section className="mx-auto grid grid-cols-1 max-w-7xl gap-12 px-5 pb-24 pt-16 sm:pb-32 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">
        <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          <div className="card flex items-center gap-4 rounded-3xl! p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
              <Clock className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="block text-sm text-muted">{u("openingHours", lang)}</span>
              <span className="font-display block text-xl text-blue-950">{tr(site.labPharmacyText, lang)}</span>
            </span>
          </div>
          <div className="card hidden items-center gap-4 rounded-3xl! p-5 lg:flex">
            <QrCode url={`https://${site.domain}/${lang}/lab-booking/`} label={u("labScanTitle", lang)} className="w-24 shrink-0 [&>svg]:h-auto [&>svg]:w-full" />
            <span>
              <span className="font-display block text-lg text-blue-950">{u("labScanTitle", lang)}</span>
              <span className="mt-0.5 block text-sm text-muted">{u("labScanSub", lang)}</span>
            </span>
          </div>
          <p className="text-sm text-muted">
            {u("callUs", lang)}:{" "}
            <a className="inline-flex items-center gap-1 font-bold text-blue-700 underline" href={`tel:${site.tel}`}>
              <Phone className="h-3.5 w-3.5" aria-hidden />
              {site.phoneDisplay}
            </a>
          </p>
        </aside>
        <LabBookingForm />
      </section>
    </>
  );
}
