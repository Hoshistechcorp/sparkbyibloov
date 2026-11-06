# Team signup + new home video

## 1. Home page video
- Swap the hero background video for the new video link you sent.

## 2. "Start your journey" page (sign up)
Content follows your uploaded brief.
- Headline: "Form Your Team of 7. Get Funded Together." plus the subhead about scholarships and funding of up to 100% (it never says "100% for everyone").
- A short "How it works" list with 4 steps.
- A choice at the top: **Team of 7** or **Individual (register interest)**. Signing up alone still works.
- Fields: Full name, Email, Password, WhatsApp/phone (optional, with a country code picker), Country + city, **Language** (dropdown: English, French, Portuguese, Arabic, Swahili, Hausa, Yoruba, Igbo, Amharic, Other), **Team name** (required for teams, hidden for individuals), interests (the same 9 options, names unchanged), "Other" text, and a consent checkbox (required).
- Button says "Register My Team" for teams and "Register Interest" for individuals, with the line "Registering alone? You can still sign up. We will help you find your seven."
- Confirmation screen: "You are in…" message, shows the team name, and a **share link** that fills in the team name for teammates (`/spark/auth?team=Name`).
- Login and forgot-password stay the same.

## 3. Saving the data
- Save the new details (name, phone, location, language, team or individual, team name, interests, consent) to each person's profile when they sign up.
- Admin user details page shows team name, type, language and phone, so you can group the seven people in a team.

## Technical details
- Migration: add nullable columns to `profiles`: `full_name`, `phone`, `language`, `location`, `registration_type` ('team'|'individual'), `team_name`, `interests`, `consent_contact` boolean. Update `handle_new_user()` so it reads these from the signup metadata. Add an index on lower(team_name).
- Validate the form with zod. Team name is trimmed and required when the type is team.
- Note: this changes the earlier rule that signup only asks for email, interests and location. Memory will be updated to match.
