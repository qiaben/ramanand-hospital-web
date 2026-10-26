/**
 * Booking times. These match the rules in worker/index.js, which is the one that really decides: it never
 * lets a slot be booked twice. Doctors see patients Monday to Saturday, 6 PM to 10 PM, in 15 minute slots.
 * The laboratory is open every day, 10 AM to 10 PM, in 30 minute slots. The hospital has not confirmed the
 * slot lengths, so change them here and in worker/wrangler.toml (SLOT_RULES) together.
 */
export type SlotKind = "appt" | "lab";

export const slotRules: Record<SlotKind, { start: number; end: number; step: number; days: number[] }> = {
  appt: { start: 18 * 60, end: 22 * 60, step: 15, days: [1, 2, 3, 4, 5, 6] },
  lab: { start: 10 * 60, end: 22 * 60, step: 30, days: [0, 1, 2, 3, 4, 5, 6] },
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Every slot of a day as "HH:MM", or none when the day is closed. */
export function daySlots(kind: SlotKind, date: string): string[] {
  const r = slotRules[kind];
  const day = new Date(`${date}T00:00:00`).getDay();
  if (!r.days.includes(day)) return [];
  const out: string[] = [];
  for (let m = r.start; m + r.step <= r.end; m += r.step) out.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
  return out;
}

/** "18:15" as "6:15 PM", or "शाम 6:15 बजे" in Hindi. */
export function timeLabel(t: string, lang: "en" | "hi") {
  const [h, m] = t.split(":").map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  if (lang === "en") return `${h12}:${pad(m)} ${h < 12 ? "AM" : "PM"}`;
  const part = h < 12 ? "सुबह" : h < 17 ? "दोपहर" : h < 20 ? "शाम" : "रात";
  return `${part} ${h12}:${pad(m)} बजे`;
}
