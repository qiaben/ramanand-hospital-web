/**
 * Third-party services that power the forms. Fill these in; no server of our own is needed.
 *
 * 1) FORM_ENDPOINT: where the appointment-request and enquiry forms are sent. Each submission is
 *    emailed to the hospital. Works with Web3Forms (https://api.web3forms.com/submit, needs
 *    FORM_ACCESS_KEY) or Formspree (https://formspree.io/f/<your-form-id>, no key needed).
 *
 * 2) CALENDLY: optional. If a link is set, the Appointment page shows Calendly's live booking
 *    calendar instead of the request form. Use one link per doctor (or one shared link).
 */
export const FORM_ENDPOINT = ""; // e.g. "https://api.web3forms.com/submit"
export const FORM_ACCESS_KEY = ""; // Web3Forms access key (leave empty for Formspree)

/**
 * 3) BOOKING_API: the booking service in /worker. When it is set, patients pick an exact time, the booking is
 *    saved, and the patient and the doctor get a confirmation and a 10 minute reminder by WhatsApp and email.
 *    Leave empty to use the form service above. Setup steps are in worker/README.md.
 */
// For local testing put NEXT_PUBLIC_BOOKING_API=http://localhost:8787 in .env.local; for the live site paste the address here.
export const BOOKING_API = process.env.NEXT_PUBLIC_BOOKING_API ?? ""; // e.g. "https://ramanand-booking.<account>.workers.dev"

export const CALENDLY: { default: string; doctors: Record<string, string> } = {
  default: "", // e.g. "https://calendly.com/ramanand-hospital/opd"
  doctors: {
    "arun-kumar": "", // e.g. "https://calendly.com/ramanand-hospital/dr-arun-kumar"
    "shikha-siwach": "",
  },
};

export const calendlyEnabled = () => !!CALENDLY.default || Object.values(CALENDLY.doctors).some(Boolean);
