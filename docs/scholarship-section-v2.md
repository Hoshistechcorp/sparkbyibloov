# Scholarship Section — Current Changes and Delivery Notes

**Product area:** Spark landing page, “Light a Spark” scholarship section  
**Audience:** Frontend engineer, backend engineer, product/design stakeholders  
**Status:** Frontend experience updated; sponsorship persistence and notification automation remain backend follow-up work.

## 1. Scope

The scholarship section on `/spark` contains two actions:

- **Light a Spark Fund** — sends a donor to the external payment page.
- **Sponsor Your Orbit** — opens a three-step scholarship sponsorship form.

This document records the latest copy and interaction changes, defines the data contract, and specifies the backend and email work required to make sponsorship submissions production-ready.

## 2. Latest changes made

### Scholarship section

- Restored the **Light a Spark** section on the `/spark` page between the Academic Partners section and the final call to action.
- Kept the two-card layout and existing card header artwork/visual treatment.
- Updated the section introduction to: “Education should never be out of reach. Fund a dream, sponsor a learner, or power a scholarship and help shape the next generation of industry leaders.”
- Removed inline SVG icons from the two primary card buttons. The labels are now text-only:
  - `Donate Now`
  - `Design Your Scholarship`
- The decorative icons inside the card headers remain unchanged; only the button icons were removed.

### Sponsor Your Orbit form

- Added a required **Phone Number** field to Step 1, using a telephone input.
- Step 1 now requires:
  - Email address
  - Phone number with at least 7 characters
  - Sponsorship location
- Added the submitted phone number to the Step 3 sponsor details summary.
- Reset the phone number when the dialog closes, alongside the other form fields.
- Preserved the existing three-step flow:
  1. Contact details and location
  2. Programs and learner counts
  3. Review and confirmation
- The confirmation screen currently appears from local component state. It does not yet persist the sponsorship or send email.

### Copy and punctuation

- Removed em dashes from the scholarship descriptions and related landing-page copy where requested.
- Preserved the requested non-breaking spaces in the two scholarship card descriptions before the final clause.

## 3. Frontend implementation notes

### Relevant files

- `src/components/spark/SparkScholarship.tsx` — renders the scholarship section and opens the sponsorship dialog.
- `src/components/spark/SparkSponsorDialog.tsx` — owns the three-step form, program selection, learner counts, totals, and current success state.
- `src/pages/Spark.tsx` — places `SparkScholarship` after `SparkPartners` and before `SparkCTA`.

### Current client-side behavior

- Programs are loaded from published records in `spark_programs`.
- The client calculates a display total from the selected program prices and learner counts.
- The client currently sets `submitted` to `true` on confirmation; no request is made yet.
- Client totals are display-only and must never be trusted for billing or persistence.

### Frontend work required for production submission

Replace the local-only `handleSubmit` behavior with a request to a backend function. The UI should:

1. Disable the confirmation action while the request is in progress.
2. Submit the contact details, location, selected programs, and learner counts.
3. Show a clear error state if validation, persistence, or the request fails.
4. Show the success state only after a successful response.
5. Prevent duplicate submissions if the user clicks more than once.
6. Keep the confirmation summary available while the request is processing.

## 4. Sponsorship data contract

The browser may submit this shape:

```ts
{
  name?: string;
  email: string;
  phone: string;
  location: string;
  items: Array<{
    program_id: string;
    students: number;
  }>;
}
```

The backend must load the current published program prices and derive:

```ts
{
  unit_price: number;
  subtotal: number;
  total_amount: number;
  total_students: number;
}
```

Never accept a client-provided price or total as authoritative.

## 5. Backend requirements

### Sponsorship persistence

Create a sponsorship parent record and child item records. Suggested fields:

**`sponsorships`**

- `id`
- `name` (nullable)
- `email`
- `phone`
- `location`
- `status` — for example `submitted`, `contacted`, `confirmed`, `paid`, `cancelled`
- `total_amount`
- `total_students`
- `created_at`, `updated_at`

**`sponsorship_items`**

- `id`
- `sponsorship_id`
- `program_id`
- `students`
- `unit_price`
- `subtotal`

The write operation should validate the payload, verify that program IDs are published, recalculate prices from the database, and commit the parent and child rows atomically.

### Access control

- Allow anonymous and authenticated visitors to submit a sponsorship lead.
- Do not allow public or sponsor read-back of contact details.
- Restrict sponsorship reads and status changes to authorized admins.
- Add explicit table grants in the same migration as each public table.
- Keep administrator roles in the dedicated roles table and use the server-side role check for admin access.

### Admin dashboard

Add a **Sponsorships** view with:

- Sponsor name, email, phone, and location
- Submission date and last updated date
- Programs and learner counts
- Recalculated total amount
- Status and status history
- Admin-only status changes
- A link from a notification email to the relevant admin record

## 6. Email notification requirements

All email sends must run server-side after persistence. Do not send notification emails directly from the browser.

### Sponsor confirmation email

When a sponsorship is successfully submitted, send an email to the sponsor’s submitted address containing:

- Thank-you confirmation
- Sponsorship reference
- Target location
- Program breakdown: program name, learners, unit price, subtotal
- Total scholarship amount
- Next steps for payment and onboarding
- Contact details for follow-up

### Admin action email

An admin/operations recipient must receive an email whenever an action is completed, including:

- A completed sponsorship submission
- A completed donation/payment callback, when that integration is available
- A sponsorship status change such as confirmed, paid, or cancelled

The admin email should include the sponsor’s name, email, phone, location, programs, learner counts, total amount, timestamp, action type, and a deep link to the admin record. Store the recipient in protected configuration or an admin settings record; never hardcode it in the client.

### Email reliability

- Trigger emails only after the database transaction succeeds.
- Keep email failures from deleting a valid sponsorship record.
- Log delivery failures for admin follow-up.
- Make sends idempotent by sponsorship ID and notification type so retries do not duplicate messages.
- Do not expose provider API keys in frontend code.

## 7. Suggested delivery sequence

1. Add the sponsorship tables, grants, and RLS policies.
2. Implement one server-side submission function that validates and recalculates totals.
3. Connect the frontend confirmation action to the function with loading and error states.
4. Add sponsor confirmation and admin notification templates.
5. Add the admin Sponsorships view and protected status updates.
6. Add idempotency, retry logging, and end-to-end tests.
7. Test anonymous submission, authenticated submission, invalid programs, duplicate clicks, email failure, admin access, and status-change notifications.

## 8. Acceptance criteria

- A visitor can complete the form with name optional and email, phone, and location required.
- Phone numbers shorter than seven characters cannot proceed from Step 1.
- A visitor can select one or more published programs and set learner counts.
- The server recalculates every unit price and total.
- A successful submission is stored and receives a unique reference.
- The sponsor receives a confirmation email after persistence succeeds.
- An admin receives an email for completed sponsorship actions and later status changes.
- Public users cannot read sponsorship records or other sponsors’ contact information.
- Admin users can review sponsorships and change status through the protected admin surface.
- The UI shows loading, success, and failure states without duplicate submissions.
