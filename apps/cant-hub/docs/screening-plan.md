# Screening Feature Plan

Paid feature that lets recruiters/HR create technical screening assessments using challenges from the cant app ecosystem. Learning remains free.

---

## Milestone 1: Authentication (done)

Users can sign in to cant-hub via social login.

- [x] Dev-login endpoint for local testing without OAuth
- [x] Better-auth with node:sqlite, auto-migration on startup
- [x] Sign-in page with social login buttons (GitHub, Google, GitLab)
- [x] User pill menu in site header with sign out
- [x] Middleware to protect authenticated routes
- [x] Local auth setup docs

---

## Milestone 2: Role Model (done)

Distinguish between developers (free) and recruiters (paid).

- [x] User role field (developer, recruiter, null)
- [x] Onboarding page for role selection after first sign-in
- [x] Dashboard layout with server-side recruiter role check
- [x] Gate recruiter routes behind role check

---

## Milestone 3: Recruiter Dashboard (done)

Recruiters get a dashboard to manage their assessments.

- [x] `/dashboard` layout with sidebar navigation, header, footer
- [x] Empty state for new recruiters
- [x] List assessments with status (draft, active, archived)
- [x] Create/delete assessments, status transitions

---

## Milestone 4: Assessment Builder

Recruiters compose an assessment by picking topics from cant apps.

**Step 1: App and category selection**

- [ ] Read available apps and their categories from the shared app registry (`cant-apps.ts`)
- [ ] Show apps as selectable cards (icon, name, description, category count)
- [ ] Expanding an app reveals its categories as a checklist
- [ ] Selected categories are summarized in a sidebar/panel

**Step 2: Per-category configuration**

- [ ] For each selected category, configure: number of questions (default: all)
- [ ] Optional difficulty filter (easy, medium, hard) if applicable
- [ ] Optional time limit per category or for the whole assessment

**Step 3: Persistence**

- [ ] `assessment` table (rename from `course`): id, title, description, status, userId, timeLimit, createdAt, updatedAt
- [ ] `assessment_category` table: assessmentId, appId, categoryId, questionCount, difficulty
- [ ] Save/update assessment with its selected categories
- [ ] Generate a unique shareable link per assessment (e.g. `/s/:assessmentId`)

**Step 4: Preview**

- [ ] Summary view showing: total questions, estimated time, topics covered per app
- [ ] Option to copy the shareable link

---

## Milestone 5: Candidate Experience

Candidates open an assessment link and solve the challenges.

- [ ] Public `/s/:assessmentId` landing page: assessment title, topics, estimated time, recruiter name
- [ ] Candidate enters name and email (no account required)
- [ ] Challenge player: loads questions from the selected apps/categories in sequence
- [ ] Timer (if configured) and progress indicator
- [ ] On completion, store results (answers, score, time per question) linked to the assessment
- [ ] Completion page with thank-you message

---

## Milestone 6: Results Dashboard

Recruiters review candidate submissions.

- [ ] Per-assessment candidate list: name, score, completion time, date
- [ ] Sort/filter candidates by score, date, status
- [ ] Candidate detail view: per-question breakdown (correct/wrong, time spent, category)
- [ ] Mark candidates as "proceed" / "reject" / "review"
- [ ] Export results (CSV)

---

## Milestone 7: Payments

Gate assessment creation behind a paid plan.

- [ ] Integrate payment provider (Stripe or Lemon Squeezy)
- [ ] Define pricing model (per-assessment, subscription, or usage-based)
- [ ] Recruiter billing page: plan status, invoices, upgrade/downgrade
- [ ] Enforce limits: free tier (if any) vs paid tier
- [ ] Webhook handling for payment events

---

## Milestone 8: Polish and Launch

- [ ] Email notifications: candidate completed, assessment shared
- [ ] Recruiter branding: company name/logo on assessment link page
- [ ] Analytics: completion rates, average scores, drop-off points
- [ ] Rate limiting and abuse prevention on public assessment links
- [ ] Documentation for recruiters (how to create, share, review)
- [ ] Landing page marketing section for the screening product

---

## Local Development

All milestones should be testable locally without external services.

- **Auth**: dev-login endpoint creates real sessions. No OAuth apps needed for day-to-day dev.
- **Database**: SQLite file at `data/auth.db`, gitignored. Delete to reset.
- **Payments**: use Stripe test mode / Lemon Squeezy sandbox. No real charges in dev.
- **Assessment link**: works on `localhost:3000/s/:assessmentId` with seeded data.
- **Multi-app challenges**: `pnpm dev` starts all apps, but for screening dev you only need cant-hub running. Mock challenge data locally so you don't need every cant app running simultaneously.
