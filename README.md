# Ramanand Hospital: official website

A **static website** (plain HTML/CSS/JS once built), in English and Hindi (`/en/`, `/hi/`).
Built with Next.js + Tailwind + Framer Motion. No server or database is needed to run it.

```bash
npm install
npm run dev      # develop at http://localhost:3000
npm run build    # writes the finished website into the `out` folder
```

Upload the `out` folder to any static host (GitHub Pages, Netlify, cPanel, ...).
Pushing to `main` also publishes it to GitHub Pages through `.github/workflows/deploy.yml`
(serve it from the domain root, e.g. www.ramanandhospital.com).

## Where to edit
- `src/data/content.ts`: hospital details, departments, doctors, facilities (English + Hindi)
- `src/data/ui.ts`: buttons, labels, form text (English + Hindi)
- `src/data/legal.ts`: DRAFT privacy notice and disclaimer for the hospital's approval
- `src/data/integrations.ts`: **booking and form services** (below)

## Booking and forms (integrations)
Edit `src/data/integrations.ts`:
- **Form service** (`FORM_ENDPOINT`): Web3Forms or Formspree. Appointment requests and enquiries are emailed to the hospital.
  Until it is filled in, the forms offer to send the details by email instead.
- **Calendly** (`CALENDLY`): add a booking link (per doctor, or one shared link) and the Appointment page shows
  Calendly's live calendar instead of the request form.

## Still to supply
Real logo vector, patient-info content, lab test list, health packages, social links, hospital-approved legal text,
and review of the Hindi translations.
