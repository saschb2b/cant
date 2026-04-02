# Screening Feature Plan

Paid feature that lets recruiters/HR create technical screening assessments using challenges from the cant app ecosystem. Learning remains free.

**Design principles** (based on how Codility, HackerRank, TestGorilla, HackerEarth work):

- Recruiters screen hundreds of candidates. Every click counts. Assessment creation must take minutes.
- The shareable link is the product. Recruiter creates, copies link, pastes into job posting or email.
- Candidates must not need an account. Name + email, then start. Show time estimate upfront.
- Results must support bulk comparison (ranking, sorting, filtering), not just individual review.
- Recruiters reuse assessments across similar roles. Duplicate + tweak is essential.
- Auto-scoring with instant results. No manual grading.

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
- [ ] Show total question count updating live as categories are toggled

**Step 2: Per-category configuration**

- [ ] For each selected category, configure: number of questions (default: all available)
- [ ] Optional difficulty filter (easy, medium, hard) if the app supports it
- [ ] Global time limit for the entire assessment (optional)

**Step 3: Persistence**

- [ ] `assessment` table: id, title, description, status, userId, timeLimit, createdAt, updatedAt
- [ ] `assessment_category` table: assessmentId, appId, categoryId, questionCount, difficulty
- [ ] Save/update assessment with its selected categories

**Step 4: Share**

- [ ] Generate a unique shareable link per assessment (e.g. `/s/:assessmentId`)
- [ ] Copy-to-clipboard button on the assessment detail page
- [ ] Link only works when assessment status is "active"

**Step 5: Duplicate**

- [ ] "Duplicate" action on any existing assessment
- [ ] Creates a new draft with the same categories and config, new title ("Copy of ...")

---

## Milestone 5: Candidate Experience

Candidates open an assessment link and complete the challenges. No account required.

**Landing page**

- [ ] Public `/s/:assessmentId` shows: assessment title, number of topics, estimated time, recruiter/company name
- [ ] Candidate enters name and email to start (stored, not verified)
- [ ] Clear expectations: "This will take approximately X minutes"

**Challenge player**

- [ ] Load questions from the selected apps/categories in randomized order
- [ ] One question at a time, with progress indicator (e.g. "12 of 30")
- [ ] Countdown timer if time limit is configured (visible but not obtrusive)
- [ ] Auto-submit when timer expires
- [ ] Each answer is stored immediately (no data loss on disconnect)

**Completion**

- [ ] Thank-you page with a summary (questions answered, time taken)
- [ ] Results are auto-scored instantly (correct/wrong per question)
- [ ] Recruiter is notified (in-app, later via email)

---

## Milestone 6: Results and Comparison

Recruiters review and compare candidate submissions.

**Candidate ranking table**

- [ ] Per-assessment table: candidate name, email, score (%), time taken, date, status
- [ ] Default sort by score descending
- [ ] Filter by status: all, pending review, proceed, rejected
- [ ] Search by candidate name/email
- [ ] Inline status toggle (proceed / reject / pending) without leaving the list

**Candidate detail view**

- [ ] Per-question breakdown: correct/wrong, time spent, category, difficulty
- [ ] Score by category (e.g. "TypeScript: 8/10, React: 6/8")
- [ ] Compare side-by-side with another candidate (stretch goal)

**Export**

- [ ] CSV export of candidate list with scores and status

---

## Milestone 7: Payments

Gate assessment creation behind a paid plan.

- [ ] Integrate payment provider (Stripe or Lemon Squeezy)
- [ ] Pricing model: per active assessment per month, or monthly subscription with assessment limit
- [ ] Recruiter billing page: current plan, usage, invoices
- [ ] Free tier: 1 active assessment, up to 10 candidates per assessment
- [ ] Paid tier: unlimited assessments and candidates
- [ ] Webhook handling for payment events (upgrade, downgrade, cancellation)

---

## Milestone 8: Polish and Launch

- [ ] Email notifications: candidate completed (to recruiter), assessment link sent (to candidate)
- [ ] Recruiter branding: company name on assessment landing page
- [ ] Dashboard analytics: completion rate, average score, candidate funnel per assessment
- [ ] Rate limiting on public assessment links (prevent abuse/bots)
- [ ] Assessment expiry: optional deadline after which the link stops accepting new candidates
- [ ] Documentation/help page for recruiters
- [ ] Landing page marketing section for the screening product
- [ ] SEO and Open Graph tags for assessment landing pages

---

## Local Development

All milestones should be testable locally without external services.

- **Auth**: dev-login endpoint creates real sessions. No OAuth apps needed for day-to-day dev.
- **Database**: SQLite file at `data/auth.db`, gitignored. Delete to reset.
- **Payments**: use Stripe test mode / Lemon Squeezy sandbox. No real charges in dev.
- **Assessment link**: works on `localhost:3000/s/:assessmentId` with seeded data.
- **Multi-app challenges**: `pnpm dev` starts all apps, but for screening dev you only need cant-hub running. Mock challenge data locally so you don't need every cant app running simultaneously.
