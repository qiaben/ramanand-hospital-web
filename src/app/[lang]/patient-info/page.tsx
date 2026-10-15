import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClipboardCheck, ClipboardList, CreditCard, FileText, Scale, ShieldPlus, Timer, Accessibility } from "lucide-react";
import { patientTopics } from "@/data/content";
import { u } from "@/data/ui";
import { hasLocale, tr } from "@/lib/i18n";
import { PageHeader, SectionHead } from "@/components/Section";
import Reveal from "@/components/Reveal";
import Accordion from "@/components/Accordion";

export async function generateMetadata({ params }: PageProps<"/[lang]/patient-info">): Promise<Metadata> {
  const { lang } = await params;
  return { title: hasLocale(lang) ? u("patientTitle", lang) : "Patient information" };
}

const icons = { admission: ClipboardList, discharge: ClipboardCheck, documents: FileText, visiting: Timer, insurance: ShieldPlus, payment: CreditCard, rights: Scale, access: Accessibility } as const;

export default async function Page({ params }: PageProps<"/[lang]/patient-info">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <>
      <PageHeader eyebrow={u("patientTitle", lang)} title={u("patientTitle", lang)} sub={u("patientSub", lang)} />

      <section className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:pb-28">
        {/* PENDING: every topic below is still "[TO BE PROVIDED]" in the client form. */}
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {patientTopics.map((t, i) => {
            const Icon = icons[t.key as keyof typeof icons];
            return (
              <Reveal as="li" key={t.key} delay={(i % 4) * 0.07}>
                <div className="card card-hover group h-full p-7">
                  <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg transition duration-500 group-hover:-rotate-6 group-hover:scale-110 ${i % 2 ? "from-green-400 to-green-700" : "from-blue-400 to-blue-700"}`}>
                    <Icon className="h-7 w-7" aria-hidden />
                  </span>
                  <h2 className="mt-6 text-2xl text-blue-950">{tr(t.title, lang)}</h2>
                  <p className="mt-2 text-sm text-muted">{u("updatingSoon", lang)}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </section>

      <section className="bg-mist pattern-cross-blue">
        <div className="mx-auto max-w-4xl px-5 py-20 sm:py-28">
          <SectionHead center eyebrow="FAQ" title={u("faqTitle", lang)} />
          <div className="mt-12"><Accordion /></div>
        </div>
      </section>
    </>
  );
}
