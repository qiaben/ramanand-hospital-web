import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Ramanand Hospital",
  robots: { index: false },
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-paper">{children}</body>
    </html>
  );
}
