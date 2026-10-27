import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { site, steps } from "@/data/content";
import { u } from "@/data/ui";
import { hasLocale, tr } from "@/lib/i18n";
import { PageHeader } from "@/components/Section";
import Reveal from "@/components/Reveal";
import AppointmentForm from "@/components/AppointmentForm";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import { calendlyEnabled } from "@/data/integrations";
import { bookingConfigured } from "@/lib/submit";

export async function generateMetadata({ params }: PageProps<"/[lang]/appointment">): Promise<Metadata> {
  const { lang } = await params;
  return { title: hasLocale(lang) ? u("apptTitle", lang) : "Appointment" };
}

export default async function Page({ params }: PageProps<"/[lang]/appointment">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <>
      <PageHeader eyebrow={u("requestAppt", lang)} title={u("apptTitle", lang)} sub={u(bookingConfigured() ? "apptSubBooked" : "apptSub", lang)} />
      <section className="mx-auto grid grid-cols-1 max-w-7xl gap-12 px-5 pb-24 pt-16 sm:pb-32 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <ol className="space-y-4">
            {steps.slice(1).map((s, i) => (
              <Reveal as="li" key={s.t.en} delay={i * 0.08}>
                <div className="card flex gap-4 rounded-3xl! p-5">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center font-display rounded-full bg-linear-to-br text-lg text-white shadow-md ${i < 2 ? "from-blue-400 to-blue-700" : "from-green-400 to-green-700"}`}>{i + 1}</span>
                  <span>
                    <span className="font-display block text-xl text-blue-950">{tr(s.t, lang)}</span>
                    <span className="mt-0.5 block text-sm text-muted">{tr(s.d, lang)}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </ol>
          <p className="mt-6 text-sm text-muted">
            {u("callUs", lang)}: <a className="font-bold text-blue-700 underline" href={`tel:${site.tel}`}>{site.phoneDisplay}</a>
          </p>
        </aside>
        {calendlyEnabled() ? (
          <CalendlyEmbed />
        ) : (
          <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-mist" />}>
            <AppointmentForm />
          </Suspense>
        )}
      </section>
    </>
  );
}
