import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { site } from "@/data/content";
import { u } from "@/data/ui";
import { hasLocale } from "@/lib/i18n";
import Hero from "@/components/Hero";
import QuickActions from "@/components/QuickActions";
import AboutIntro from "@/components/AboutIntro";
import PillarsScene from "@/components/PillarsScene";
import DeptCards from "@/components/DeptCards";
import DoctorCards from "@/components/DoctorCards";
import FacilityGrid from "@/components/FacilityGrid";
import MessageBand from "@/components/MessageBand";
import JourneyLine from "@/components/JourneyLine";
import VisitBlock from "@/components/VisitBlock";
import CtaBand from "@/components/CtaBand";
import { SectionHead } from "@/components/Section";
import Reveal from "@/components/Reveal";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hospital",
    name: site.name.en,
    url: `https://${site.domain}`,
    telephone: site.tel,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sonipat-Narela Road, Akbarpur Barota",
      addressLocality: "Sonipat",
      addressRegion: "Haryana",
      postalCode: "131103",
      addressCountry: "IN",
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "18:00", closes: "22:00" },
    ],
  };

  const more = (href: string, label: string) => (
    <Reveal className="mt-10 text-center">
      <Link href={href} className="btn btn-outline group">
        {label}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
      </Link>
    </Reveal>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <QuickActions />
      <AboutIntro />
      <PillarsScene />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
        <SectionHead center eyebrow={u("deptEyebrow", lang)} title={u("deptTitle", lang)} sub={u("deptSub", lang)} />
        <div className="mt-12"><DeptCards lang={lang} /></div>
        {more(`/${lang}/departments`, u("allDepts", lang))}
      </section>

      <section className="bg-mist py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead center eyebrow={u("docEyebrow", lang)} title={u("docTitle", lang)} />
          <div className="mt-12"><DoctorCards lang={lang} /></div>
          {more(`/${lang}/doctors`, u("allDoctors", lang))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
        <SectionHead center eyebrow={u("facEyebrow", lang)} title={u("facTitle", lang)} />
        <div className="mt-12"><FacilityGrid lang={lang} /></div>
      </section>

      <MessageBand lang={lang} />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
        <SectionHead center eyebrow={u("stepsEyebrow", lang)} title={u("stepsTitle", lang)} sub={u("stepsSub", lang)} />
        <div className="mt-14"><JourneyLine /></div>
      </section>

      <div className="border-t border-line bg-mist"><VisitBlock lang={lang} /></div>
      <div className="pt-20 sm:pt-24"><CtaBand lang={lang} /></div>
    </>
  );
}
