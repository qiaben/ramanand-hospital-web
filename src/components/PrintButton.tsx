"use client";

import { Printer } from "lucide-react";

export default function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-blue print:hidden">
      <Printer className="h-4 w-4" aria-hidden /> {label}
    </button>
  );
}
