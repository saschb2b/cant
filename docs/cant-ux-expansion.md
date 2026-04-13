# Can't UX Expansion Plan

## Current State

7 categories, 32 challenges (4 per category), 64 visual components.
All challenges are `type: "visual"` with side-by-side MUI component comparisons.

**Existing categories:** Typography, Spacing, Color, Hierarchy, Layout, Forms, Feedback

---

## New Categories

### 1. Navigation (nav)

Wayfinding, menus, and information architecture patterns.

| ID      | Title                 | Difficulty | Left (wrong)                                                     | Right (correct)                                          | Prompt                                      |
| ------- | --------------------- | ---------- | ---------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------- |
| nav-001 | Navigation labels     | easy       | Vague labels ("Services", "Solutions", "Resources") in a top nav | Specific labels ("Pricing", "Docs", "Blog") in a top nav | Which navigation is easier to use?          |
| nav-002 | Breadcrumb wayfinding | easy       | Deep page with no breadcrumbs, just a back button                | Deep page with breadcrumb trail showing full path        | Which page helps users know where they are? |
| nav-003 | Menu depth            | medium     | Three-level nested dropdown menu with tiny targets               | Flat mega-menu showing all options in grouped columns    | Which menu structure is easier to navigate? |
| nav-004 | Mobile navigation     | medium     | Desktop nav squeezed into mobile with horizontal scroll          | Hamburger menu with clear grouping and large tap targets | Which mobile navigation works better?       |

**Section:** Interaction Design
**Sources:** NN/G navigation guidelines, WCAG 2.4 Navigable

---

### 2. Accessibility (a11y)

Visual accessibility patterns beyond color contrast.

| ID       | Title                | Difficulty | Left (wrong)                                                | Right (correct)                              | Prompt                                     |
| -------- | -------------------- | ---------- | ----------------------------------------------------------- | -------------------------------------------- | ------------------------------------------ |
| a11y-001 | Focus indicators     | easy       | Interactive elements with `outline: none`, no visible focus | Visible focus rings on buttons and links     | Which interface is more keyboard-friendly? |
| a11y-002 | Icon labeling        | easy       | Toolbar of icon-only buttons (ambiguous glyphs)             | Same toolbar with icon + text labels         | Which toolbar is easier to understand?     |
| a11y-003 | Status communication | medium     | Status badges using only color (red/yellow/green dots)      | Status badges with color + icon + text label | Which status display is more accessible?   |
| a11y-004 | Link distinction     | medium     | Links styled same as body text (only color difference)      | Links with underline + color difference      | Which text makes links easier to find?     |

**Section:** Interaction Design
**Sources:** WCAG 2.1 AA, Deque University, WebAIM

---

### 3. Micro-interactions (micro)

Subtle feedback that builds confidence and delight.

| ID        | Title                  | Difficulty | Left (wrong)                                                  | Right (correct)                                          | Prompt                                   |
| --------- | ---------------------- | ---------- | ------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------- |
| micro-001 | Button feedback        | easy       | Button that does nothing visually on click, then page changes | Button with press state, spinner, then success checkmark | Which button gives better feedback?      |
| micro-002 | Toggle response        | easy       | Toggle switch that snaps instantly with no animation          | Toggle with smooth slide animation and color transition  | Which toggle feels more responsive?      |
| micro-003 | Content entrance       | medium     | List items that appear all at once (pop in)                   | List items that stagger in with subtle fade-up           | Which list feels more polished?          |
| micro-004 | Progress communication | medium     | Indeterminate spinner with no context                         | Step progress bar with labels ("Uploading... 3 of 5")    | Which upload gives more useful feedback? |

**Section:** Interaction Design
**Sources:** NN/G microinteractions, Material Design motion guidelines

---

### 4. Data Display (data)

Presenting structured information clearly.

| ID       | Title             | Difficulty | Left (wrong)                                        | Right (correct)                                            | Prompt                                   |
| -------- | ----------------- | ---------- | --------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------- |
| data-001 | Number alignment  | easy       | Table with left-aligned numbers, no row distinction | Table with right-aligned numbers and subtle row striping   | Which table is easier to scan?           |
| data-002 | Text overflow     | easy       | Table cells with text abruptly cut off mid-word     | Cells with ellipsis and tooltip on hover showing full text | Which table handles long content better? |
| data-003 | Data density      | medium     | Dense table cramming 8 columns into a narrow space  | Prioritized table with 4 key columns and expandable rows   | Which data view is more usable?          |
| data-004 | Empty data states | medium     | Table showing "No data" in a bare cell              | Table with illustrated empty state, explanation, and CTA   | Which empty state helps users more?      |

**Section:** Content
**Sources:** NN/G table design, Edward Tufte data-ink ratio

---

### 5. Content & Copy (copy)

Microcopy, scannability, and plain language.

| ID       | Title             | Difficulty | Left (wrong)                                                              | Right (correct)                                                                | Prompt                               |
| -------- | ----------------- | ---------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------ |
| copy-001 | Error language    | easy       | "Error 422: Unprocessable Entity" in a red banner                         | "Please check your email address and try again" in a friendly banner           | Which error message is more helpful? |
| copy-002 | Scannable content | easy       | Wall of unformatted paragraph text                                        | Same content broken into headings, short paragraphs, and bullet points         | Which content is easier to scan?     |
| copy-003 | Link text         | medium     | Paragraph with "Click here" and "Read more" links                         | Paragraph with descriptive links ("View pricing details", "Read the API docs") | Which links are more useful?         |
| copy-004 | Onboarding copy   | medium     | Setup wizard with technical jargon ("Configure your OAuth2 callback URI") | Same wizard in plain language ("Where should we send users after login?")      | Which onboarding is clearer?         |

**Section:** Content
**Sources:** NN/G writing for the web, GOV.UK content design guide, WCAG 2.4.4 Link Purpose

---

### 6. Modals & Overlays (modal)

Dialog patterns, interruptions, and overlay behavior.

| ID        | Title                | Difficulty | Left (wrong)                                                          | Right (correct)                                                       | Prompt                                       |
| --------- | -------------------- | ---------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------- |
| modal-001 | Confirmation scope   | easy       | Full-screen modal for a simple "Are you sure?" confirmation           | Inline confirmation near the trigger button                           | Which confirmation feels proportionate?      |
| modal-002 | Dismissibility       | easy       | Modal with no X button, no backdrop click, only a small "Cancel" link | Modal with X button, backdrop click to close, and clear Cancel button | Which dialog is easier to dismiss?           |
| modal-003 | Information overload | medium     | Modal crammed with a long form (8+ fields, scrolling inside modal)    | Multi-step flow that replaces page content instead of overlaying      | Which approach handles complex input better? |
| modal-004 | Interruption timing  | medium     | Cookie banner + newsletter popup + chat widget all on first visit     | Clean first visit, cookie banner only, other prompts after engagement | Which first impression is less intrusive?    |

**Section:** Interaction Design
**Sources:** NN/G modal dialog guidelines, WCAG 2.4.11 Focus Not Obscured

---

### 7. Lists & Cards (card)

Content collection patterns and visual consistency.

| ID       | Title                   | Difficulty | Left (wrong)                                      | Right (correct)                                                   | Prompt                                        |
| -------- | ----------------------- | ---------- | ------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------- |
| card-001 | Card height consistency | easy       | Grid of cards with wildly different heights       | Grid of cards with uniform height and consistent layout           | Which card grid looks more professional?      |
| card-002 | Clickable affordance    | easy       | Cards that look static but are actually clickable | Cards with hover elevation, cursor pointer, and subtle arrow icon | Which cards signal that they are interactive? |
| card-003 | Information density     | medium     | Card crammed with every available data point      | Focused card with key info and "View details" link                | Which card is easier to process?              |
| card-004 | List grouping           | medium     | Flat list of 20+ items with no visual grouping    | Same items grouped into labeled sections with dividers            | Which list is easier to browse?               |

**Section:** Content
**Sources:** NN/G card design, Material Design cards spec

---

### 8. Icons & Imagery (icon)

Visual communication and consistency.

| ID       | Title              | Difficulty | Left (wrong)                                                 | Right (correct)                                                   | Prompt                                 |
| -------- | ------------------ | ---------- | ------------------------------------------------------------ | ----------------------------------------------------------------- | -------------------------------------- |
| icon-001 | Icon consistency   | easy       | Toolbar mixing outlined, filled, and hand-drawn icon styles  | Toolbar with all icons from the same family and weight            | Which icon set looks more cohesive?    |
| icon-002 | Meaningful imagery | easy       | Hero section with a generic stock photo (handshake, skyline) | Hero with a relevant illustration that explains the product       | Which hero image communicates more?    |
| icon-003 | Icon ambiguity     | medium     | Settings screen using abstract/novel icons with no labels    | Same screen using universally recognized icons (gear, bell, user) | Which icon set is easier to interpret? |
| icon-004 | Image quality      | medium     | Page with stretched, pixelated, or poorly cropped images     | Same page with properly sized and sharp images                    | Which page looks more trustworthy?     |

**Section:** Visual Design
**Sources:** NN/G icon usability, Material Design iconography guidelines

---

## Updated Category Sections

```
Visual Design:     typography, spacing, color, hierarchy, icons-imagery
Interaction Design: layout, forms, feedback, navigation, accessibility, micro-interactions, modals-overlays
Content:           data-display, content-copy, lists-cards
```

## Implementation Order

1. **Navigation** - fundamental UX topic, high impact, pairs well with existing layout/forms
2. **Accessibility** - critical topic underrepresented in current set
3. **Micro-interactions** - engaging visual demos, good variety
4. **Content & Copy** - fills a text/writing gap the current set lacks entirely
5. **Data Display** - practical topic for anyone building dashboards or admin UIs
6. **Modals & Overlays** - common pattern with well-known anti-patterns
7. **Lists & Cards** - extends existing layout and hierarchy categories
8. **Icons & Imagery** - visual design complement to typography and color

## Per-Category Checklist

For each new category:

- [ ] Add category to `ChallengeCategory` type in `lib/learn/types.ts`
- [ ] Add to `CATEGORY_ORDER`, `CATEGORY_LABELS`, `CATEGORY_DESCRIPTIONS` in `lib/learn/categories.ts`
- [ ] Add to appropriate section in `CATEGORY_SECTIONS`
- [ ] Create challenge file in `lib/learn/challenges/<category>.ts`
- [ ] Import and spread into `lib/learn/challenges/index.ts`
- [ ] Create visual components in `components/visual/<category>.tsx`
- [ ] Register all components in `components/visual/registry.tsx`
- [ ] Update hub challenge count in `apps/cant-hub/components/hub-series-grid.tsx`
- [ ] Update `TOTAL_CHALLENGES` in `apps/cant-hub/components/hero.tsx`
- [ ] Verify with `pnpm turbo lint typecheck --filter=cant-ux`
