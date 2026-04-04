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

## Milestone 4: Assessment Builder (done)

Recruiters compose an assessment by picking topics from cant apps.

**Architecture: Shared App Catalog**

- [x] Created `packages/shared/src/lib/app-catalog.ts` as single source of truth for all category metadata (slugs, labels, descriptions, sections, learning paths, question counts) across all 12 apps
- [x] Migrated all apps to derive `ChallengeCategory` types and category exports from the catalog
- [x] Replaced hand-maintained `SERIES_META` and `TOTAL_CHALLENGES` in the hub with catalog-derived values
- [x] Added `explanationWrong` to shared `BaseChallenge` type
- [x] Added cant-trust (18 categories, 106 challenges) to the catalog and hub

**Step 1: App and category selection**

- [x] Read available apps and their categories from the shared app catalog (`app-catalog.ts`)
- [x] Show apps as selectable cards (icon, name, description, category count)
- [x] Expanding an app reveals its categories as a checklist grouped by section
- [x] Selected categories are summarized in a sticky sidebar panel
- [x] Show total question count updating live as categories are toggled

**Step 2: Per-category configuration**

- [x] Global time limit for the entire assessment (optional, in minutes)
- [ ] Per-category question count (default: all available) -- UI placeholder, not yet wired
- [ ] Optional difficulty filter (easy, medium, hard) -- UI placeholder, not yet wired

**Step 3: Persistence**

- [x] `assessment` table extended with `timeLimitSeconds`
- [x] `assessment_category` junction table: assessmentId, appSlug, categorySlug, questionCount, difficulty
- [x] Save/update assessment with its selected categories via server action
- [x] SQLite null-prototype objects spread into plain objects for Server-to-Client serialization

**Step 4: Share**

- [x] Public `/s/:assessmentId` page shows assessment title, question count, topics, time estimate
- [x] Copy-to-clipboard button in the assessment Actions menu
- [x] Link only works when assessment status is "active"
- [ ] Candidate sign-in form (name + email) -- placeholder for Milestone 5

**Step 5: Duplicate**

- [x] "Duplicate" action on any existing assessment
- [x] Creates a new draft with the same categories and config, new title ("Copy of ...")

**Prerequisite for Milestone 5: Challenge data migration**

Challenge files need to move from each app's local directory to `packages/shared/src/lib/challenges/` so the hub can import them directly at build time. This avoids runtime API calls or database snapshots.

- [x] Proof of concept: cant-game challenges moved to `packages/shared/src/lib/challenges/cant-game/`
- [x] Migrate remaining 11 apps (cant-maintain, cant-resize, cant-type, cant-orchestrate, cant-seo, cant-ux, cant-explode, cant-branch, cant-query, cant-test, cant-trust)

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
- **Challenge data**: All challenge content lives in `packages/shared/src/lib/challenges/`. The hub imports challenges directly at build time, no need to run other apps.
