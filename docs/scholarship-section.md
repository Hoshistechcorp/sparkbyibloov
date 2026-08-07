# Scholarship Section ("Light a Spark") — Change Documentation

Scope: the `/spark` scholarship section and the "Sponsor Your Orbit" flow.

## Files

- `src/components/spark/SparkScholarship.tsx` — section with two cards: **Light a Spark Fund** (external donation link) and **Sponsor Your Orbit** (opens dialog).
- `src/components/spark/SparkSponsorDialog.tsx` — 3-step sponsorship form.

## Frontend changes

### 1. Buttons cleaned up
- Removed the leading inline SVG icons from both CTA buttons (`Donate Now`, `Design Your Scholarship`) and dropped the now-unneeded `gap-2`. Labels are text-only.
- Removed the sparkle emoji from the dialog's final `Confirm Scholarship` button.
- Card header icons, sizing, colors, hover and tap animations are unchanged.

### 2. Phone number field added (Step 1 of the sponsor form)
- New `phone` state, rendered as a required `<Input type="tel">` between **Email Address** and **Sponsor learners from**.
- Validation: `canProceedStep1` now requires non-empty email, non-empty location, and a phone value of at least 7 characters. The "Choose Programs" button stays disabled until all three pass.
- Phone is shown in the Step 3 "Sponsor Details" summary and is cleared by `handleClose()` along with the other fields.

### Current data flow
`handleSubmit()` currently only flips local `submitted` state — no network call yet. Payload the backend should expect:

```ts
{
  name?: string,
  email: string,
  phone: string,
  location: string,
  items: Array<{ program_id: string; students: number; unit_price: number }>,
  total_amount: number,
  total_students: number
}
```

Programs are read client-side from `spark_programs` (`id, cool_name, real_name, price, color, description`, `published = true`, ordered by `sort_order`). Prices must be re-verified server-side; never trust the client `total_amount`.

## Backend work required

### 1. Persist sponsorships
Create a `sponsorships` table (sponsor contact fields incl. `phone`, status, computed `total_amount`) plus a `sponsorship_items` child table (`sponsorship_id`, `program_id`, `students`, `unit_price`). RLS: allow insert from anon/authenticated (lead capture), restrict select to admins only — same posture as `program_interest`. Remember GRANTs for `authenticated`/`anon` insert and `service_role`.

### 2. Email notifications
Both emails are sent from an edge function (server-side) after the sponsorship row is committed, never from the browser.

**a. Sponsor confirmation email** — triggered when a person completes "Sponsor Your Orbit".
- To: the submitted `email`.
- Contents: thank-you message, program breakdown (program name, learners, unit price, subtotal), total amount, target location, and next steps for payment/onboarding.

**b. Admin notification email** — triggered whenever an action completes.
- To: the configured admin/ops address (store as a secret or admin settings row, not hardcoded).
- Sent on: a completed sponsorship submission, a completed donation callback, and any status change on a sponsorship (e.g. confirmed, paid, cancelled).
- Contents: sponsor name/email/phone/location, program breakdown, total amount, timestamp, and a deep link to the record in the admin dashboard.

Implementation notes:
- Single edge function (e.g. `notify-sponsorship`) that validates input with Zod, inserts the record with the service role, recomputes totals from `spark_programs.price`, then sends both emails.
- Return 400 with field errors on validation failure; email failures should be logged and must not roll back the stored lead.
- Make sends idempotent per sponsorship id so retries don't double-email.

### 3. Admin surface
Add a "Sponsorships" view in the admin dashboard listing sponsor contact details (including phone), programs, learner counts, totals, and status, with the ability to change status (which fires the admin notification above).

## Frontend follow-up once the endpoint exists
Replace `handleSubmit()`'s local-only behavior with `supabase.functions.invoke('notify-sponsorship', { body: payload })`, show a loading state on the confirm button, surface errors with a toast, and only render the success screen after a 2xx response.