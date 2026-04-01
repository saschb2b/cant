# Screening Feature Plan

Paid feature that lets recruiters/HR create technical screening assessments using challenges from the cant app ecosystem. Learning remains free.

---

## Milestone 1: Authentication

Users can sign in to cant-hub via social login.

- [ ] Set up local dev OAuth apps (GitHub, Google, GitLab) with `localhost` callback URLs and document the setup steps in `docs/local-auth-setup.md`
- [ ] Add a seed/dev script that pre-populates a test recruiter and test developer account in SQLite for quick local testing without OAuth
- [ ] Run better-auth DB migrations (user, session, account tables)
- [ ] Create sign-in page with social login buttons
- [ ] Add user menu to site header (avatar, sign out)
- [ ] Persist session across page navigations
- [ ] Add middleware to protect authenticated routes

---

## Milestone 2: Role Model

Distinguish between developers (free) and recruiters (paid).

- [ ] Define user roles: `developer`, `recruiter`
- [ ] Add role selection after first sign-in (onboarding step)
- [ ] Store role in the database (better-auth metadata or custom table)
- [ ] Gate recruiter routes behind role check

---

## Milestone 3: Recruiter Dashboard

Recruiters get a dashboard to manage their screening courses.

- [ ] Create `/dashboard` layout with sidebar navigation
- [ ] Build empty state for new recruiters (no courses yet)
- [ ] List existing courses with status (draft, active, archived)
- [ ] Add create/edit/delete actions for courses

---

## Milestone 4: Course Builder

Recruiters compose a screening course by picking from cant apps.

- [ ] Fetch available apps and their categories from the app registry
- [ ] UI to select which cant apps to include (e.g. cant-type, cant-resize)
- [ ] For each selected app, show categories and let recruiter pick which to include
- [ ] Configure parameters per category: number of questions, difficulty filter, time limit
- [ ] Preview the course structure before saving
- [ ] Save course to database (course, course_apps, course_categories tables)
- [ ] Generate a unique shareable link per course (e.g. `/s/:courseId`)

---

## Milestone 5: Candidate Experience

Developers open a screening link and solve the challenges.

- [ ] Public `/s/:courseId` landing page showing course overview (apps, categories, estimated time)
- [ ] Candidate enters name/email (no account required, or optional social login)
- [ ] Challenge player: loads questions from selected apps/categories in sequence
- [ ] Timer and progress indicator
- [ ] On completion, store results (answers, score, time per question) linked to the course
- [ ] Thank-you/completion page

---

## Milestone 6: Results Dashboard

Recruiters review candidate submissions.

- [ ] Per-course candidate list with scores, completion time, date
- [ ] Sort/filter candidates by score, date, status
- [ ] Candidate detail view: per-question breakdown (correct/wrong, time spent)
- [ ] Mark candidates as "proceed" / "reject" / "review"
- [ ] Export results (CSV)

---

## Milestone 7: Payments

Gate course creation behind a paid plan.

- [ ] Integrate payment provider (Stripe or Lemon Squeezy)
- [ ] Define pricing model (per-course, subscription, or usage-based)
- [ ] Recruiter billing page: plan status, invoices, upgrade/downgrade
- [ ] Enforce limits: free tier (if any) vs paid tier
- [ ] Webhook handling for payment events

---

## Milestone 8: Polish and Launch

- [ ] Email notifications: candidate completed, course shared
- [ ] Recruiter branding: add company name/logo to screening link
- [ ] Analytics: course completion rates, average scores
- [ ] Rate limiting and abuse prevention on public screening links
- [ ] Documentation for recruiters (how to create, share, review)
- [ ] Landing page marketing section for the screening product

---

## Local Development

All milestones should be testable locally without external services.

- **Auth**: seed script creates test accounts so OAuth apps are not required for day-to-day dev. Document how to set up real OAuth apps for integration testing.
- **Database**: SQLite file at `data/auth.db`, gitignored. Delete to reset.
- **Payments**: use Stripe test mode / Lemon Squeezy sandbox. No real charges in dev.
- **Screening link**: works on `localhost:3000/s/:courseId` with seeded course data.
- **Multi-app challenges**: `pnpm dev` starts all apps, but for screening dev you only need cant-hub running. Mock challenge data locally so you don't need every cant app running simultaneously.
