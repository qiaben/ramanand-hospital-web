import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Noto_Sans_Devanagari, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { site } from "@/data/content";
import { u } from "@/data/ui";
import { hasLocale, locales, tr } from "@/lib/i18n";
import { LangProvider } from "@/lib/lang-context";
import { isPreview } from "@/lib/base-path";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";
import MobileBar from "@/components/MobileBar";

const body = Plus_Jakarta_Sans({ variable: "--font-body", subsets: ["latin"] });
const bodyHi = Noto_Sans_Devanagari({ variable: "--font-body-hi", subsets: ["devanagari"] });

export const viewport: Viewport = { themeColor: "#1550c0" };

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const name = tr(site.name, lang);
  return {
    metadataBase: new URL(`https://${site.domain}`),
    title: { default: `${name} | ${tr(site.tagline, lang)}`, template: `%s | ${name}` },
    description: u("heroSub", lang),
    alternates: { languages: { en: "/en", hi: "/hi" } },
    // The GitHub Pages preview must not compete with the real site in search results.
    ...(isPreview ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} data-scroll-behavior="smooth" className={`${body.variable} ${bodyHi.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <LangProvider lang={lang}>
          <a
            href="#main"
            className="sr-only z-200 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            {u("skip", lang)}
          </a>
          <MotionProvider>
            <Navbar />
            <main id="main" className="flex-1">{children}</main>
            <Footer lang={lang} />
            <MobileBar />
          </MotionProvider>
        </LangProvider>
      </body>
    </html>
  );
}
