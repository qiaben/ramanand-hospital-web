import { FORM_ACCESS_KEY, FORM_ENDPOINT } from "@/data/integrations";
import { site } from "@/data/content";

export const formConfigured = () => !!FORM_ENDPOINT;

/** Opens the visitor's email app with the details filled in. Used when no form service is set up yet. */
export const mailtoFallback = (subject: string, body: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/**
 * Sends a form to the configured form service (Web3Forms or Formspree). The hospital receives it by email.
 * Resolves true on success.
 */
export async function submitForm(subject: string, fields: Record<string, string>) {
  if (!FORM_ENDPOINT) return false;
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        ...(FORM_ACCESS_KEY ? { access_key: FORM_ACCESS_KEY } : {}),
        subject,
        from_name: "Ramanand Hospital website",
        ...fields,
      }),
    });
    if (!res.ok) return false;
    const data = await res.json().catch(() => ({}));
    return data.success !== false;
  } catch {
    return false;
  }
}
