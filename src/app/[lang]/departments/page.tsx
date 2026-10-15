import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { u } from "@/data/ui";
import { hasLocale } from "@/lib/i18n";
import { PageHeader } from "@/components/Section";
import DeptCards from "@/components/DeptCards";

export async function generateMetadata({ params }: PageProps<"/[lang]/departments">): Promise<Metadata> {
  const { lang } = await params;
  return { title: hasLocale(lang) ? u("deptPageTitle", lang) : "Departments" };
}

export default async function Page({ params }: PageProps<"/[lang]/departments">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <>
      <PageHeader eyebrow={u("deptEyebrow", lang)} title={u("deptPageTitle", lang)} sub={u("deptPageSub", lang)} />
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-16 sm:pb-32"><h2 className="sr-only">{u("deptPageTitle", lang)}</h2><DeptCards lang={lang} /></section>
    </>
  );
}
