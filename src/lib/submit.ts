import { FORM_ACCESS_KEY, FORM_ENDPOINT, BOOKING_API } from "@/data/integrations";
import { site } from "@/data/content";

export const formConfigured = () => !!FORM_ENDPOINT;
export const bookingConfigured = () => !!BOOKING_API;

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

export type Slot = { t: string; free: boolean };

/** Free and taken times for a doctor (kind "appt") or the lab (kind "lab") on a day. Null when the service cannot be reached. */
export async function fetchSlots(kind: "appt" | "lab", doctor: string, date: string): Promise<Slot[] | null> {
  if (!BOOKING_API) return null;
  try {
    const res = await fetch(`${BOOKING_API}/slots?kind=${kind}&doctor=${encodeURIComponent(doctor)}&date=${date}`);
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data.slots) ? data.slots : null;
  } catch {
    return null;
  }
}

export type BookingRequest = {
  kind: "appt" | "lab";
  lang: "en" | "hi";
  doctor: string;
  name: string;
  mobile: string;
  email: string;
  age: string;
  gender: string;
  date: string;
  time: string;
  website: string;
  details: Record<string, string>;
};

/**
 * Books the slot. The service saves it only while the slot is free, then sends the patient and the doctor
 * their confirmations and schedules the 10 minute reminder.
 */
export async function submitBooking(b: BookingRequest): Promise<{ ok: true; ref: string } | { ok: false; reason: "full" | "server" }> {
  try {
    const res = await fetch(`${BOOKING_API}/book`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) });
    if (res.status === 409) return { ok: false, reason: "full" };
    if (!res.ok) return { ok: false, reason: "server" };
    const data = await res.json();
    return data.ref ? { ok: true, ref: String(data.ref) } : { ok: false, reason: "server" };
  } catch {
    return { ok: false, reason: "server" };
  }
}

/** Sends the contact-page enquiry to the booking service, which emails it to the hospital. Resolves true on success. */
export async function submitEnquiry(f: { name: string; mobile: string; email: string; message: string; website: string }) {
  try {
    const res = await fetch(`${BOOKING_API}/enquiry`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(f) });
    return res.ok;
  } catch {
    return false;
  }
}
