# Can't Hub: Vision Document

## The Problem

Today the six Can't apps (Maintain, Resize, Type, Orchestrate, SEO, UX) are isolated islands. Each has its own domain, its own landing page, and cross-links to siblings via the series grid. A visitor who finishes one series has no guided path to the next. There is no shared identity, no progress tracking, and no way for a third party to use the platform for structured assessments.

## The Vision

**Can't Hub** is a central portal at `cant.saschb2b.com` that serves two audiences with one product:

### Audience 1: Learners (free)

A student or developer visits the Hub and sees every Can't series in one place. They can:

- Browse all series, read descriptions, see challenge/category counts, and jump into any one
- Return to the Hub after completing a session and pick the next topic
- Track progress across all series (categories completed, scores, streaks) (Phase 2)
- Follow a suggested learning path or build their own (Phase 2)

The Hub is a portal, not a replacement. Each series keeps its own domain, learn/play experience, and unique tools (Viewer, Sandbox, Inspector, Explorer). The Hub links out to them. Individual apps link back to the Hub via cross-promo.

### Audience 2: Recruiters (paid)

A recruiter or hiring manager signs up for a paid account. They can:

- **Build custom screenings** by selecting which series (UX, Type, Orchestrate, ...) to include
- **Narrow by category** within each series (e.g., only "generics" and "narrowing" from Can't Type)
- **Set difficulty and length** (number of questions, time limit, difficulty mix)
- **Generate a shareable screening link** that candidates open in their browser
- **Review results in a dashboard**: per-candidate scores, time spent, category breakdowns, comparison across candidates
- **Manage candidate pools**: invite via email, track completion status, export results

This turns the existing quiz engine into a lightweight technical screening tool, without changing the core game mechanic.

---

## Architecture Overview

```
apps/cant-hub/           <-- new Next.js app (the central portal)
apps/cant-maintain/      <-- existing, unchanged
apps/cant-resize/
apps/cant-type/
apps/cant-orchestrate/
apps/cant-seo/
apps/cant-ux/
packages/shared/         <-- existing shared components and game logic
```

The Hub is a portal. It does not host learn/play experiences itself. Challenge data stays in each app. The Hub reads series metadata (name, description, colors, challenge counts) from the shared app registry and links out to each app's live domain.

---

## Design Identity

The Hub has its own visual identity, distinct from the per-app template:

- **Icon**: compass rose (gold north needle, slate background). Represents "find your direction."
- **Layout**: centered intro with a color spectrum bar (one segment per series), followed by large gradient-tinted series cards as the main content
- **No shared Hero component**: the Hub does not reuse the left-text/right-visual hero pattern from individual apps
- **Header**: compass icon + "Can't Hub" title, theme toggle, GitHub link. No Learn/Play nav (those belong to individual apps).
- **Theme**: neutral slate palette (light: #475569, dark: #94A3B8) so the series cards bring the color

---

## Goals and Milestones

### Phase 1: Foundation (Hub as portal) [done]

The Hub exists and links out to all six series.

- [x] **1.1 Create the `cant-hub` app** in the monorepo (Next.js, MUI, same stack)
- [x] **1.2 Design the Hub landing page**: centered intro, series grid with stats (challenge/category counts, unique tools), open source banner
- [x] **1.3 Update cross-promo**: replace the `CantSeriesGrid` links in existing apps to point to the Hub instead of each other's domains

### Phase 2: User Accounts and Progress

Users can sign in, and their activity is persisted.

- [ ] **2.1 Authentication**: add sign-up/login (email, GitHub OAuth, or similar)
- [ ] **2.2 Database**: set up a database (Postgres via Coolify or similar) for user profiles, game history, and scores
- [ ] **2.3 Progress tracking**: store completed games, per-category scores, streaks, and activity graphs per user
- [ ] **2.4 User dashboard**: a personal page showing progress across all series, strengths/weaknesses, and suggested next topics
- [ ] **2.5 Learning paths**: curated or auto-generated sequences (e.g., "Frontend Fundamentals" covering Resize + Maintain + UX)

### Phase 3: Recruiter Platform (paid tier)

The screening and assessment features that generate revenue.

- [ ] **3.1 Recruiter accounts**: separate sign-up flow for recruiters with organization/team support
- [ ] **3.2 Screening builder UI**: multi-step form to select series, categories, difficulty, question count, and time limits
- [ ] **3.3 Screening links**: generate unique, shareable URLs for each screening configuration
- [ ] **3.4 Candidate experience**: candidates open the link, optionally enter their name/email, and take the screening (same game UI, branded for the recruiter's screening)
- [ ] **3.5 Results storage**: persist candidate answers, scores, time per question, and overall performance
- [ ] **3.6 Recruiter dashboard**: view all screenings, see candidate results, compare candidates side-by-side, filter/sort by score
- [ ] **3.7 Candidate management**: invite candidates via email, track who has completed the screening, send reminders
- [ ] **3.8 Export**: download results as CSV/PDF for offline review or ATS integration
- [ ] **3.9 Billing**: Stripe integration for subscription plans (free tier with limits, paid tier for full access)

### Phase 4: Polish and Scale

- [ ] **4.1 Analytics for recruiters**: aggregate stats (average score per category, pass rates, time distributions)
- [ ] **4.2 Anti-cheating measures**: randomized question order (already exists), time tracking, optional proctoring signals
- [ ] **4.3 White-label options**: let recruiters add their company logo and customize the screening landing page
- [ ] **4.4 API access**: programmatic screening creation and result retrieval for ATS integrations
- [ ] **4.5 Candidate self-service**: candidates can opt in to share their screening results as a public profile/badge

---

## Key Decisions to Make

| Decision                         | Options                                    | Notes                                         |
| -------------------------------- | ------------------------------------------ | --------------------------------------------- |
| **Hub domain**                   | `cant.saschb2b.com`                        | Central branding matters for recruiter trust  |
| **Keep individual app domains?** | Yes, the Hub is a portal that links out    | Each app keeps its own domain and experience  |
| **Auth provider**                | NextAuth.js, Clerk, Auth.js, Supabase Auth | Needs to support email + OAuth                |
| **Database**                     | Postgres (Coolify), Supabase, PlanetScale  | Self-hosted aligns with current Coolify setup |
| **Payments**                     | Stripe, Lemon Squeezy                      | Stripe is the standard for SaaS               |

---

## What Changes for Existing Apps

- **Cross-promo links** update to point to the Hub (Phase 1.3)
- **No other breaking changes**. Challenge data stays in each app. Existing apps continue to work as-is.
- Individual apps keep their own domains, learn/play experiences, and unique tools

---

## Revenue Model

| Tier                    | Price    | Includes                                                       |
| ----------------------- | -------- | -------------------------------------------------------------- |
| **Free (learner)**      | $0       | Full access to all series, progress tracking, learning paths   |
| **Starter (recruiter)** | ~$49/mo  | 5 active screenings, 50 candidates/mo, basic dashboard         |
| **Pro (recruiter)**     | ~$149/mo | Unlimited screenings, unlimited candidates, exports, analytics |
| **Enterprise**          | Custom   | White-label, API access, SSO, dedicated support                |

Learner access stays free. The game content is the moat, and recruiter tooling is the monetization layer.

---

## Success Metrics

- **Learners**: monthly active users across all series, session count, cross-series engagement (users who play 2+ series)
- **Recruiters**: sign-ups, screenings created, candidates assessed, conversion from free trial to paid, MRR
- **Platform**: uptime, response times, candidate completion rate (started vs. finished a screening)
