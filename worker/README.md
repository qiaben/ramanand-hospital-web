# Booking service (appointments and lab slots)

A small Cloudflare Worker with a database. It lets patients book an exact time, then sends the messages.

## What happens

1. The patient picks a doctor (or the lab), a day and an exact time on the website. Times that are taken are crossed out.
2. On submit the booking is saved. Two people can never get the same slot.
3. **The patient** gets a confirmation by WhatsApp and email, to the number and address they typed. It names the doctor and has a link to cancel.
4. **The doctor** (or the lab desk) gets an alert by WhatsApp and email with the patient's details, and the hospital inbox gets a copy.
5. **10 minutes before** the time, the patient and the doctor each get a reminder by WhatsApp and email.
6. Bookings older than 30 days are deleted automatically.

Patient messages carry only who, when and the reference. Test names, reasons and addresses go to the doctor only.

Slots: doctors 6 PM to 10 PM Monday to Saturday in 15 minute slots, one patient per slot. Laboratory 10 AM to 10 PM every day in 30 minute slots, up to 3 patients per slot. Change them in `wrangler.toml` (`SLOT_RULES`) and in `src/data/slots.ts`.

## One-time setup

### 1. Email, through the hospital's Gmail (no domain or DNS needed)
1. Sign in to the hospital Gmail account and open script.google.com. Choose New project and paste in `gmail-relay.gs`.
2. Project settings, Script properties, add `SECRET` with a long random text.
3. Deploy, New deployment, Web app, Execute as Me, Access Anyone. Copy the Web app URL.
4. Put that URL in `MAIL_RELAY_URL` in `wrangler.toml`, and later run `npx wrangler secret put MAIL_RELAY_SECRET` with the same SECRET.

Emails then come from the hospital Gmail address, with the doctor's name as the sender name. A free Gmail account sends to about 100 recipients a day, which is roughly 20 bookings a day (3 recipients for the confirmation and 2 for the reminder). A Google Workspace account allows about 1,500.

Optional instead: Resend (resend.com) sends from a hospital-domain address but needs DNS records added to the domain. Set `RESEND_API_KEY` and `MAIL_FROM_ADDRESS` and leave `MAIL_RELAY_URL` empty.

### 2. WhatsApp (Meta WhatsApp Business Cloud API)
1. At developers.facebook.com create a Business app, add WhatsApp, and register the hospital's WhatsApp Business number. The number cannot already be in normal WhatsApp use. Note its **Phone number ID**.
2. Create a permanent token (System User with `whatsapp_business_messaging`).
3. Create these templates, category **Utility**, in English and in Hindi for the two patient templates. Meta must approve them (minutes to a day).

| Template name | Sent to | Variables | English text |
|---|---|---|---|
| `booking_confirmed` | patient | 1 name, 2 what, 3 date, 4 time, 5 reference | `Hello {{1}}, your {{2}} is confirmed for {{3}} at {{4}}. Reference {{5}}. We will remind you 10 minutes before. Ramanand Hospital, 83072 07870.` |
| `booking_reminder` | patient | 1 name, 2 what, 3 time | `Hello {{1}}, this is a reminder from Ramanand Hospital. Your {{2}} is at {{3}}. Please arrive a few minutes early. For any help, call 83072 07870.` |
| `staff_booking_alert_v2` | doctor, lab desk | 1 what, 2 patient, 3 mobile, 4 date and time, 5 reference | `New booking received at Ramanand Hospital. Service: {{1}}. Patient name: {{2}}. Patient mobile number: {{3}}. Date and time: {{4}}. Booking reference: {{5}}. Please check the hospital email for the full details.` |
| `staff_booking_reminder` | doctor, lab desk | 1 what, 2 patient, 3 mobile, 4 time | `Reminder from Ramanand Hospital: a booking starts in 10 minutes. Service: {{1}}. Patient name: {{2}}. Patient mobile number: {{3}}. Time: {{4}}. Please be ready.` |

Hindi texts for the two patient templates (language `hi`):
- `booking_confirmed`: `नमस्ते {{1}}, आपका {{2}} {{3}} को {{4}} पर पक्का हो गया है। संदर्भ {{5}}। समय से 10 मिनट पहले हम आपको याद दिलाएँगे। रामानंद हॉस्पिटल, 83072 07870।`
- `booking_reminder`: `नमस्ते {{1}}, रामानंद हॉस्पिटल की ओर से याद दिलाना: आपका {{2}} {{3}} पर है। कृपया कुछ मिनट पहले पहुँचें। किसी भी सहायता के लिए 83072 07870 पर कॉल करें।`

Lab bookings use their own two confirmation templates (English and Hindi each), chosen by how the sample is given: `lab_visit_confirmed` and `lab_home_confirmed`. Both take 4 variables: 1 name, 2 date, 3 time, 4 reference.
- `lab_visit_confirmed`: `Hello {{1}}, your laboratory visit is confirmed for {{2}} at {{3}}. Reference {{4}}. Please come a few minutes early. Some tests need fasting for 8 to 12 hours (water is allowed). Ramanand Hospital, 83072 07870.`
- `lab_home_confirmed`: `Hello {{1}}, your home sample collection is confirmed for {{2}} at {{3}}. Reference {{4}}. Our team will call you before they reach your address. Some tests need fasting for 8 to 12 hours (water is allowed). Ramanand Hospital, 83072 07870.`
Their reminder uses `booking_reminder` and their staff alert uses `staff_booking_alert_v2`.

Here `{{2}}` reads like "appointment with Dr. Arun Kumar" or "lab visit" (English), and "डॉ. अरुण कुमार के साथ अपॉइंटमेंट" or "प्रयोगशाला विज़िट" (Hindi), so the sentences must stay worded to fit that. The same templates serve doctor appointments and lab bookings.

When creating each template in WhatsApp Manager: category Utility, type Text, no header, footer or buttons, and set **Type of variable to Number** (not Name), because the service sends numbered variables. Sample values for Meta's review:
- `booking_confirmed`: Ravi Kumar, appointment with Dr. Arun Kumar, Mon 3 Nov 2026, 6:15 PM, RH-20261103-1234
- `booking_reminder`: Ravi Kumar, appointment with Dr. Arun Kumar, 6:15 PM
- `staff_booking_alert_v2`: appointment with Dr. Arun Kumar, Ravi Kumar, 9876543210, Mon 3 Nov 2026 6:15 PM, RH-20261103-1234
- `staff_booking_reminder`: appointment with Dr. Arun Kumar, Ravi Kumar, 9876543210, 6:15 PM

The English and Hindi versions of a patient template share the same name. If the Hindi version is not approved, the service sends the English one.

The hospital's WhatsApp Business number is **83072 07870**. Messages are sent from this number, so the patient sees "Ramanand Hospital" and the number above.

Checklist for the number (Meta WhatsApp Manager):
1. Add 83072 07870 under WhatsApp, API Setup, Add phone number, and verify it with the SMS or call code.
2. If the number is already used in the WhatsApp Business app on a phone, either choose Meta's "coexistence" onboarding (keeps the phone app working) or delete that WhatsApp account first.
3. Copy the **Phone number ID** (not the phone number) into `WA_PHONE_ID`, and the permanent token into `WA_TOKEN`.
4. Add a payment method in the Meta Business account. Without it, template messages are not delivered.
5. Hindi templates are optional. If a Hindi template is not approved, the English one is sent instead.
6. If a message does not arrive, run `npx wrangler tail` while testing. The Meta error code and reason are printed there.

### 3. Doctors
In `wrangler.toml` fill `DOCTORS_JSON` with each doctor's email and WhatsApp number (10 digits), and the lab desk under `lab`. Put the hospital inbox in `HOSPITAL_EMAIL`.

### 4. Deploy
```
cd worker
npx wrangler login
npx wrangler d1 create ramanand-bookings          # prints a database id: paste it into wrangler.toml
npx wrangler d1 execute ramanand-bookings --remote --file=schema.sql
npx wrangler secret put MAIL_RELAY_SECRET   # or RESEND_API_KEY if you use Resend
npx wrangler secret put WA_TOKEN
npx wrangler secret put WA_PHONE_ID
npx wrangler deploy
```
Wrangler prints the service address. Put it in `PUBLIC_URL` in `wrangler.toml` and deploy again.

### 5. Connect the website
In `src/data/integrations.ts` set `BOOKING_API = "https://ramanand-booking.<account>.workers.dev"`, then rebuild and publish the site.

## Notes
- Until `BOOKING_API` is set, the forms behave as before: every time is offered, nothing is saved and the request goes to the form service or email.
- If only email or only WhatsApp is configured, the other is skipped. A failed message never blocks the booking.
- Only the websites in `ALLOWED_ORIGINS` can call the service. Add a rate limit in the Cloudflare dashboard before launch.
- Cost: Cloudflare is free at this size, email is free to about 3,000 a month, WhatsApp is about 10 to 15 paise per delivered message.
