export const locales = ["en", "hi"] as const;
export type Lang = (typeof locales)[number];
export type L = { en: string; hi: string };
export type LL = { en: string[]; hi: string[] };

export const hasLocale = (x: string): x is Lang => (locales as readonly string[]).includes(x);

/** Pick the string for a language. */
export const tr = (x: L, lang: Lang) => x[lang];
export const trl = (x: LL, lang: Lang) => x[lang];
