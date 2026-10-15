"use client";

import { useSyncExternalStore } from "react";
import { useLang } from "@/lib/lang-context";
import { u } from "@/data/ui";

type Status = "open" | "today" | "tomorrow" | "monday" | "";

// OPD is Monday to Saturday, 6 PM to 10 PM, India time.
function compute(): Status {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const day = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const workday = day !== "Sun";
  if (workday && hour >= 18 && hour < 22) return "open";
  if (workday && hour < 18) return "today";
  if (day === "Sat" || day === "Sun") return "monday";
  return "tomorrow";
}

function subscribe(cb: () => void) {
  const id = setInterval(cb, 60_000);
  return () => clearInterval(id);
}

export default function OpenNow({ tone = "light", compact = false }: { tone?: "light" | "dark"; compact?: boolean }) {
  const lang = useLang();
  const status = useSyncExternalStore<Status>(subscribe, compute, () => "");
  if (!status) return <span className={`inline-block ${compact ? "h-7 w-28" : "h-9"}`} aria-hidden />;

  const open = status === "open";
  const text = open
    ? u("openNow", lang)
    : status === "today"
      ? u("opensToday", lang)
      : status === "tomorrow"
        ? u("opensTomorrow", lang)
        : u("opensMonday", lang);

  const skin = compact
    ? open
      ? "bg-green-50 py-1.5 text-[11px] text-green-800 ring-1 ring-green-200"
      : "bg-amber-50 py-1.5 text-[11px] text-amber-800 ring-1 ring-amber-200"
    : tone === "dark"
      ? "glass py-2 text-sm text-white"
      : "bg-green-50 py-2 text-sm text-green-800 ring-1 ring-green-200";

  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap rounded-full px-3.5 font-semibold normal-case tracking-normal ${skin}`}>
      <span className="relative flex h-2.5 w-2.5">
        {open && <span className="absolute inset-0 rounded-full bg-green-400 animate-ping-soft" />}
        <span className={`relative h-2.5 w-2.5 rounded-full ${open ? "bg-green-500" : "bg-amber-400"}`} />
      </span>
      {text}
    </span>
  );
}
