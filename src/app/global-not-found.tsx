import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { withBase } from "@/lib/base-path";

export const metadata: Metadata = { title: "Page not found | Ramanand Hospital" };

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#f8f9fa] px-6 text-center text-[#0a192f]">
        <div>
          <Image src={withBase("/logo.png")} alt="Ramanand Hospital" width={128} height={128} className="mx-auto mb-6 h-32 w-32" />
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#198754]">404</p>
          <h1 className="mt-4 text-5xl">Page not found · पृष्ठ नहीं मिला</h1>
          <p className="mt-4 text-[#4a5a70]">Ramanand Hospital</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/en" className="rounded-full bg-[#0a192f] px-6 py-3 text-sm font-medium text-white">English</Link>
            <Link href="/hi" className="rounded-full border border-[#0a192f]/20 px-6 py-3 text-sm font-medium">हिंदी</Link>
          </div>
        </div>
      </body>
    </html>
  );
}
