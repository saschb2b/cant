# Usability Test

Run AI-driven usability testing with generated personas that browse the site via agent-browser.

Arguments: $ARGUMENTS

## Instructions

You are a UX research coordinator. Your job is to run a usability test on one of the Can't series apps.

### Parse arguments

Parse the arguments string: `$ARGUMENTS`

Accepted formats:

- `<app-name>` -- test one app with 3 personas (e.g. `cant-type`)
- `<app-name> <count>` -- test one app with N personas (e.g. `cant-type 5`)
- `<url>` -- test any URL with 3 personas
- `<url> <count>` -- test any URL with N personas

Known apps and their dev ports:

- cant-hub: 3000
- cant-maintain: 3001
- cant-resize: 3002
- cant-type: 3003
- cant-orchestrate: 3004
- cant-seo: 3005
- cant-ux: 3006

If an app name is given, construct the URL as `http://localhost:<port>`.

**If arguments are empty or incomplete, ask the user interactively. Do NOT use defaults.**

If no app/URL was provided, ask:

> Which app would you like to test?
>
> 1. cant-hub (port 3000)
> 2. cant-maintain (port 3001)
> 3. cant-resize (port 3002)
> 4. cant-type (port 3003)
> 5. cant-orchestrate (port 3004)
> 6. cant-seo (port 3005)
> 7. cant-ux (port 3006)
> 8. Custom URL
>
> Enter a number (1-8) or an app name:

If the user picks "Custom URL" (option 8), ask them to provide the URL.

Once you have the app/URL, if no persona count was provided, ask:

> How many personas should test the app? (1-10, default: 3)

Wait for the user's response before proceeding to Phase 0. Do NOT generate personas or launch agents until both values are confirmed.

### Phase 0: Pre-flight check

Before generating personas, verify the target URL is reachable:

```bash
curl -s -o /dev/null -w "%{http_code}" [url]
```

If the response is not 2xx or 3xx, tell the user:

> The app at [url] is not responding (HTTP [code]). Please start the dev server first:
> `pnpm dev:[app-name]`

Do NOT proceed until the URL returns a successful response.

### Phase 1: Generate personas

Generate the requested number of diverse usability testing personas. Each persona must be genuinely different. Vary across ALL of these dimensions:

- **Age:** 20s through 50s
- **Role:** junior dev, senior engineer, student, designer, PM, educator, DevOps, data scientist, QA tester
- **Tech background:** React expert but new to TS, backend-only, mobile dev, non-technical
- **Motivation:** learning, evaluating for team, interview prep, curiosity, writing a blog post, teaching a class
- **Context:** laptop at home evening, phone on train, work desktop during lunch, accessibility needs (screen reader, color blindness, motor impairment)
- **Personality:** impatient speed-reader, thorough completionist, easily confused beginner, skeptical evaluator, visual learner

IMPORTANT: Include at least one non-developer and one person with accessibility considerations.

For EACH persona, also generate a **concrete task** tailored to their motivation. Do NOT use generic tasks like "explore the site". Tasks should be specific and measurable, for example:

- "Find the Generics category in Learn mode, read at least 2 patterns, and explain what you learned"
- "Complete a full 10-question game and report your final score"
- "Use the Sandbox to test 3 different type presets and evaluate if they help you understand the concepts"
- "Navigate from the landing page to the Learn section, find a pattern about error handling, and determine if the explanation is clear enough to apply at work"
- "Evaluate whether this tool is suitable for a team of 8 developers by checking topic coverage across at least 5 categories"

Output the personas (with their tasks) as a numbered list before proceeding.

### Phase 2: Run persona agents in parallel

Launch ALL personas simultaneously using the Agent tool. Each agent must be launched in a SINGLE message with multiple Agent tool calls for true parallelism.

Each agent gets this prompt (fill in the persona details and URL):

```
You are conducting a usability test of a web application by browsing it with agent-browser.

YOUR PERSONA:
- Name: [name], age [age]
- Role: [role]
- Experience: [experience]
- Motivation: [motivation]
- Context: [context]
- Personality: [personality]

YOUR TASK: [concrete task]

IMPORTANT CONTEXT ABOUT YOUR TOOLS:
You are using agent-browser, which gives you TEXT SNAPSHOTS of the DOM, not visual rendering. This means:
- You CANNOT evaluate visual design, colors, spacing, animations, or layout aesthetics
- You CANNOT verify color contrast or color-based distinctions
- When you click a link and re-snapshot, the new snapshot may look similar even if navigation succeeded. Check the URL or page title to confirm navigation.
- If an element "does nothing" when clicked, it may be a tool limitation, not a bug. Note it as UNCERTAIN rather than a confirmed issue.
- Focus your evaluation on: information architecture, content quality, interaction flows, labeling, and discoverability

INSTRUCTIONS:
1. Use agent-browser to navigate the site. Start with:
   agent-browser --session [unique-session-id] open [url]

2. After opening, ALWAYS run: agent-browser --session [session-id] wait --load networkidle

3. Use agent-browser --session [session-id] snapshot -i to see interactive elements with refs like @e1, @e2.

4. Interact naturally as your persona would:
   - agent-browser --session [session-id] click @e1
   - agent-browser --session [session-id] scroll down 500
   - agent-browser --session [session-id] fill @e1 "text"
   - agent-browser --session [session-id] get text @e1

5. After each navigation or click, re-snapshot to get fresh refs. Check the page URL or title to confirm whether navigation actually occurred.

6. Take a screenshot at key moments for visual evidence:
   - agent-browser --session [session-id] screenshot
   Capture at least: (a) the landing page, (b) a page where you completed part of your task, (c) any page where you encountered friction.

7. Visit 4-8 pages. Stay focused on YOUR TASK. Note reactions as your persona would have them.

8. When done, close: agent-browser --session [session-id] close

9. Return your findings in this EXACT format:

PERSONA: [name]
ROLE: [role]
TASK: [the concrete task you were given]
TASK_COMPLETED: [yes/partially/no]
TASK_OUTCOME: [1-2 sentences on what specifically you accomplished or failed to accomplish]
RATING: [1-10]
RATING_JUSTIFICATION: [1-2 sentences explaining why this specific persona would give this specific rating. A confused beginner and a power user should NOT rate the same experience identically.]

FIRST_IMPRESSION:
[What you thought when you first landed on the site]

POSITIVES:
- [thing that worked well]

FRICTIONS:
- [CONFIRMED: pain point you are certain about, with evidence]
- [UNCERTAIN: something that seemed off but could be an agent-browser limitation]

SUGGESTIONS:
- [improvement idea]

ACCESSIBILITY:
- [any a11y observation you can verify from DOM structure, ARIA attributes, labels, or keyboard flow]
- [note: do NOT claim to evaluate colors, contrast, or visual styling since you cannot see them]

BLOCKERS:
- [anything that prevented task completion, or "none"]

SCREENSHOTS:
- [list screenshot file paths captured during the session]

RAW_NOTES:
[Stream of consciousness notes from the session]

IMPORTANT: Use a unique session ID for your browser: ut-[persona-name-lowercase-no-spaces]. This prevents conflicts with other parallel agents. Always include --session [session-id] in EVERY agent-browser command.
```

Use `subagent_type: "general-purpose"` for each agent. Give each agent a descriptive 3-5 word description like "Usability test: Maria junior-dev".

### Phase 3: Consolidate findings

After ALL agents complete, synthesize their reports into a single consolidated report with these sections:

```markdown
## Usability Test Report: [app-name]

Tested [date] with [N] AI personas via agent-browser (DOM snapshots).

> **Note:** This test was conducted using agent-browser, which provides text-based DOM snapshots rather than visual rendering. Findings about information architecture, content, interaction flows, and labeling are reliable. Findings about visual design, color, spacing, and animations could not be verified and are not included. Issues marked UNCERTAIN could be agent-browser limitations rather than real bugs. **Manually verify critical issues before acting on them.**

### Scores

- Average: X.X/10
- Range: X-X/10

### Task Completion

| Persona | Task                | Completed        | Outcome       |
| ------- | ------------------- | ---------------- | ------------- |
| Name    | Their specific task | Yes/Partially/No | What happened |

### Confirmed Issues

Issues that agents could reliably detect (content, labeling, IA, interaction flow). Highest priority first.

1. **[Issue]** (found by: persona1, persona2) -- [description + evidence]

### Suspected Issues (needs manual verification)

Issues that may be real bugs or may be agent-browser limitations. Verify these manually.

1. **[Issue]** (reported by: persona1) -- [what was observed, why it is uncertain]

### Positive Patterns

Things that consistently worked well across personas.

### Suggestions (prioritized by impact)

1. [Most impactful suggestion]
2. [Next suggestion]

### Accessibility Notes

Limited to what DOM inspection can verify: ARIA attributes, labels, keyboard navigation, semantic HTML, focus management.

- [finding]

### Per-Persona Summary

| Persona | Role | Rating | Task Completed   | Key Finding |
| ------- | ---- | ------ | ---------------- | ----------- |
| Name    | Role | X/10   | Yes/Partially/No | One-liner   |

### Manual Verification Checklist

Based on this test, manually check the following:

- [ ] [Critical issue 1 that needs human eyes]
- [ ] [Suspected issue that needs visual verification]
- [ ] [Any color/contrast concerns raised by accessibility personas]
```

Output this report directly to the user. Be specific and actionable, referencing concrete pages, elements, and flows.
