## Deliverable

A single editable DOCX — `Spark_PRD_v1.docx` — saved to `/mnt/documents/` and surfaced as a downloadable artifact in chat. Generated with the `docx` Node library (per the DOCX skill), with US Letter pages, Nunito-inspired typography, branded amber (#ec9f00) accents, table of contents, headings, tables, and callouts. After generation it will be converted to PDF + images for a visual QA pass before delivery.

No code, schema, or product changes will be made to the Spark app itself — this is a documentation artifact only.

## PRD structure (sections)

1. **Document control** — owner (PM), contributors (1 designer, 1 FE, 1 BE), status, version history, review cadence.
2. **Executive summary** — what Spark is, who it serves, why now (FIFA-ready hospitality/events/tourism talent), the one-line bet.
3. **Vision & strategy** — 3-year vision, 12-month north star metric, positioning vs. generic LMS / bootcamps.
4. **Problem & users** — pains for learners, tutors, employers, partners, cities. Persona cards (Aspiring Event Coordinator, Bartender/Mixologist, Content Creator, MC/Host, Tutor, Sponsor, Admin).
5. **Current state assessment (v0 baseline)** — honest audit of what's shipped today: marketing site, auth, admin CMS, programs/events/news/media, partner & scholarship surfaces, profile, tutor signup. What's keep / improve / rebuild.
6. **Goals, non-goals, success metrics** — activation, completion, NPS, tutor supply, paid conversion, partner pipeline.
7. **Scope by release**
   - **MVP (Months 1–2)** — see below
   - **V1 (Months 3–4)**
   - **V2 (Months 5–7)**
   - **V3 (Months 8–12)**
8. **Ideation track** — discovery rituals, weekly user interviews, opportunity solution tree, prioritization (RICE) for a 3-person side-project pace.
9. **Design track** — design system hardening, component library, content design, accessibility (WCAG 2.1 AA), responsive breakpoints, motion guidelines, handoff via Figma.
10. **Engineering track** — architecture (React/Vite/TS frontend, Lovable Cloud / Postgres + Edge Functions backend), data model, auth & roles, RLS posture, observability, CI, environments.
11. **Cross-functional workflow** — 2-week sprints, weekly side-project capacity (designer ~8h, FE ~10h, BE ~10h, PM ~6h), Friday demos, async standups.
12. **Risks & mitigations** — capacity, scope creep, payment/compliance, content velocity, tutor supply.
13. **Open questions & decisions log**.
14. **Appendices** — competitor scan, glossary, KPI definitions.

## Release plan (specifics)

**MVP — Weeks 1–8 (≈2 months)**
Goal: a learner can discover Spark, sign up, enroll in 1 paid micro-credential, complete modules + quiz, and an admin can manage everything.

- Polish current marketing site (hero, audience, programs teaser, partners, scholarship).
- Auth: email + Google, profile setup, password reset (already mostly in place — harden).
- Programs: catalog, details, enrollment, module player, quizzes, progress tracking.
- Payments: Stripe/Paddle checkout for one paid program; free programs supported.
- Admin CMS: programs, modules, events, blog posts (with draft preview), users (view + role).
- Events + News read-only public pages with images and detail routes (already shipped — stabilize).
- Tutor signup (Google Form link — already shipped).
- Analytics baseline (PostHog or GA4) + error tracking (Sentry).
- Legal: Terms, Privacy, Cookies.
- Cut for MVP: certificates, sponsor flow, scholarships submissions, mobile app, advanced search.

**V1 — Weeks 9–16 (Months 3–4)**
- Verifiable PDF certificates + public verification page.
- Enrollment receipts + invoicing.
- "Light a Spark Fund" scholarship application flow + admin review.
- Sponsor Your Orbit intake + sponsor dashboard (read-only).
- Refer-a-friend with attribution.
- Improved learner dashboard (My Programs progress, deadlines, certificates wall).
- SEO pass on programs, news, events (schema.org, sitemaps, OG images per item).

**V2 — Weeks 17–28 (Months 5–7)**
- Tutor portal: in-app tutor application (replace Google Form), tutor profile, course authoring, revenue share statements.
- Employer/partner portal: job board, talent shortlist, sponsor-a-cohort.
- Live cohorts: scheduled sessions, calendar invites, recordings linked to modules.
- Discussion threads per module + cohort.
- Notifications (email + in-app), digest preferences.
- Multi-currency pricing, regional discounts.

**V3 — Weeks 29–52 (Months 8–12)**
- Mobile PWA polish (offline module reading, push notifications).
- Municipal/FIFA city partner dashboards with cohort rollups.
- Stackable credential bundles → "Spark Diplomas".
- Icon-partner masterclasses (premium tier).
- Internationalization (EN first; FR/AR/PT roadmap).
- Recommendation engine (next-best program) using existing AI gateway.

## Capacity & timeline assumptions

| Role | Side-project weekly capacity | Implication |
|---|---|---|
| PM | ~6h | 1 PRD update + 1 user interview per week |
| Designer | ~8h | ~1 polished flow per sprint |
| Frontend | ~10h | ~1 medium feature per sprint |
| Backend | ~10h | ~1 schema + endpoints per sprint |

Sprints are 2 weeks. Buffer of ~20% per release for QA, bugfix, content. Release dates are working-week-based, not calendar-week, so a "2-month MVP" assumes ~16 productive person-weeks across the team.

## Technical details (engineering appendix in the doc)

- **Frontend**: React 18, Vite, TS, Tailwind, shadcn/ui, framer-motion, react-router. Reuse existing `SparkSubNav`, brand tokens, Nunito.
- **Backend**: Lovable Cloud (Postgres + Edge Functions + Storage + Auth). RLS on every public table; roles via `user_roles` + `has_role` RPC (already established pattern).
- **Payments**: Stripe (default) or Paddle (if MoR needed for tax). Decision logged in PRD.
- **AI**: Lovable AI Gateway for content moderation, quiz generation assistant, recommendation later.
- **Observability**: Sentry (frontend + functions), PostHog product analytics, Supabase logs.
- **CI/Quality**: typecheck on PR, Lighthouse budgets on marketing pages, a11y checks via axe.

## QA before delivery

After generating the DOCX, convert to PDF + page images and visually inspect every page for: clipped text, broken tables, missing headings, color contrast on amber accents, TOC accuracy. Fix and regenerate as `Spark_PRD_v2.docx` if issues are found. Then surface the final file with a `<presentation-artifact>` tag.
