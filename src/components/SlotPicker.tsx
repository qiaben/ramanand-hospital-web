"use client";

import { useEffect, useState } from "react";
import { daySlots, timeLabel, type SlotKind } from "@/data/slots";
import { fetchSlots, type Slot } from "@/lib/submit";
import { u } from "@/data/ui";
import { useLang } from "@/lib/lang-context";

/**
 * The exact times a patient can book on a day. With the booking service connected, times that are already
 * taken are shown crossed out. Without it, every time of the day is offered.
 */
export default function SlotPicker({ kind, doctor, date, value, onChange }: { kind: SlotKind; doctor: string; date: string; value: string; onChange: (t: string) => void }) {
  const lang = useLang();
  const key = `${kind}|${doctor}|${date}`;
  const [res, setRes] = useState<{ key: string; slots: Slot[] } | null>(null);

  useEffect(() => {
    if (!date) return;
    let live = true;
    (async () => {
      const remote = await fetchSlots(kind, doctor, date);
      const slots = remote ?? daySlots(kind, date).map((t) => ({ t, free: true }));
      // Today's times that have already passed cannot be booked.
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const cutoff = now.getHours() * 60 + now.getMinutes() + 15;
      const usable = slots.map((s) => {
        const [h, m] = s.t.split(":").map(Number);
        return date === today && h * 60 + m < cutoff ? { ...s, free: false } : s;
      });
      if (live) setRes({ key, slots: usable });
    })();
    return () => { live = false; };
  }, [kind, doctor, date, key]);

  if (!date) return <p className="text-sm text-muted">{u("slotPickDate", lang)}</p>;
  if (!res || res.key !== key) return <p className="text-sm text-muted">{u("slotsLoading", lang)}</p>;
  if (!res.slots.length) return <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">{u("slotsClosed", lang)}</p>;
  if (!res.slots.some((s) => s.free)) return <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">{u("slotsNone", lang)}</p>;

  return (
    <div role="group" aria-labelledby="time-label" className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
      {res.slots.map((s) => (
        <button
          type="button"
          key={s.t}
          disabled={!s.free}
          aria-pressed={value === s.t}
          onClick={() => onChange(s.t)}
          className={`rounded-xl border px-2 py-3 text-sm font-semibold transition duration-300 ${
            value === s.t
              ? "border-transparent bg-linear-to-br from-blue-500 to-blue-800 text-white shadow-lg shadow-blue-700/30"
              : s.free
                ? "border-line bg-white text-blue-950 hover:border-blue-500"
                : "cursor-not-allowed border-line bg-mist text-muted/50 line-through"
          }`}
        >
          {timeLabel(s.t, lang)}
        </button>
      ))}
    </div>
  );
}
