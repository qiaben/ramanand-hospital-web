/**
 * Where the site lives. Empty when it is served from the root of a domain (www.ramanandhospital.com).
 * On the GitHub Pages preview it is "/ramanand-hospital-web". Set NEXT_PUBLIC_BASE_PATH at build time;
 * the values "", "/" and "root" all mean "no sub-folder".
 */
const raw = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim();
export const BASE = raw === "" || raw === "/" || raw === "root" ? "" : `/${raw.replace(/^\/+|\/+$/g, "")}`;

/** Prefix a root-relative path (like "/logo.png") with the sub-folder, if any. */
export const withBase = (path: string) => `${BASE}${path}`;

/** True on the preview address, which should not be indexed by search engines. */
export const isPreview = BASE !== "";
