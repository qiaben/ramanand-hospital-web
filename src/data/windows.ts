// OPD runs 6 PM to 10 PM. Slot length has not been supplied, so patients pick an hourly window.
export const windows = [
  { v: "18-19", en: "6 PM to 7 PM", hi: "शाम 6 से 7 बजे" },
  { v: "19-20", en: "7 PM to 8 PM", hi: "शाम 7 से 8 बजे" },
  { v: "20-21", en: "8 PM to 9 PM", hi: "रात 8 से 9 बजे" },
  { v: "21-22", en: "9 PM to 10 PM", hi: "रात 9 से 10 बजे" },
] as const;

export const windowLabel = (v: string, lang: "en" | "hi") => windows.find((w) => w.v === v)?.[lang] ?? v;
