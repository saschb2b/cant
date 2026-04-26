# Review Challenges

Review challenges in a Can't series app for quality, neutrality, and visual correctness.

Arguments: $ARGUMENTS

## Instructions

You are a challenge quality reviewer for the Can't series educational apps. Your job is to audit challenges for correctness, neutrality, and visual quality.

### Parse arguments

Parse the arguments string: `$ARGUMENTS`

Accepted formats:

- (empty / no arguments) -- auto-detect the app from the working directory, show a numbered list of categories, and ask the user to pick
- `<number>` -- if a numbered list was already shown, select that category
- `<category>` -- review all challenges in one category (e.g. `unit-testing`)
- `<category> <challenge-id>` -- review a single challenge (e.g. `unit-testing ut-003`)
- `<app-name> <category>` -- review a category in a specific app (e.g. `cant-test unit-testing`)

### Auto-detection (no arguments or just a number)

If no arguments are provided or the argument is just a number:

1. Look at the current working directory to determine which monorepo this is
2. Find all apps that have challenge files by globbing `apps/*/lib/learn/categories.ts`
3. If only one app has challenges, use that app. If multiple, ask the user to pick.
4. Read the app's `lib/learn/categories.ts` to get `CATEGORY_ORDER` and `CATEGORY_LABELS`
5. Display a numbered list:

```
Which category to review?

 1. What Is Money?          (money-origins)
 2. How Banks Work          (banking-mechanics)
 3. When Banks Break Trust  (banking-failures)
 ...
```

6. Wait for the user to reply with a number or category name

If the argument is a number, map it to the category at that position in `CATEGORY_ORDER` (1-indexed).

### What to review

For each challenge, spawn a dedicated Agent to review it. The agent should read:

1. The challenge definition in `lib/learn/challenges/<category>.ts`
2. The visual component files referenced by `componentId` in `components/visual/`

Each agent evaluates these criteria:

#### Challenge definition

- **Title neutrality**: Does the title hint at which side is correct? Titles must describe the topic, not name the solution. No value-laden words like "proper", "robust", "fair", "rigged".
- **Prompt neutrality**: Does the prompt give away the answer? It should ask a question that requires thought, not restate the definition of the correct answer.
- **Difficulty accuracy**: Is the difficulty rating (easy/medium/hard) appropriate for the concept?
- **correctSide**: Is the correct side actually correct? Is the educational claim factually accurate?
- **Explanations**: Are both explanationCorrect and explanationWrong accurate, educational, and 2-4 sentences? No emotionally loaded language.
- **Source**: Is the sourceUrl a real, authoritative source?

#### Visual components (if type: "visual")

- **Canvas labels**: Are the `CanvasSimulation` label props neutral? Neither should say "good", "bad", "fair", "rigged", etc.
- **On-canvas text**: Does any text drawn on the canvas hint at which side is correct? Red/green color coding on labels, value judgments ("stable"/"declining", "misleading"), or conclusion text that only appears on one side are all violations.
- **Visual parity**: Are both sides equally polished? The correct side should not be visually richer, more animated, or more appealing than the wrong side. Both must look equally plausible at first glance.
- **Color neutrality**: Neither side should use red (danger/fail) or green (success/correct) to signal correctness. Both should use the same neutral colors for equivalent elements.
- **Animation quality**: Do animations loop cleanly? Is there unbounded state growth (counters that increment forever, arrays that grow without limit)?

### Output format

For each challenge, the agent returns a structured report:

```
## <challenge-id>: <title>
- Challenge: [pass / needs-fix]
- Visual: [pass / needs-fix / n/a]
- Issues: [numbered list of specific issues with file paths, or "none"]
```

### After all agents complete

Compile all reports into a summary table:

| Challenge | Title           | Challenge | Visual    | Issues   |
| --------- | --------------- | --------- | --------- | -------- |
| mo-001    | Trading systems | pass      | needs-fix | 2 issues |

Then list all issues that need fixing, grouped by file, with specific line references where possible.

Ask the user if they want you to fix the issues automatically.

### Important rules

- Spawn one agent per challenge for parallel review
- Each agent reads the actual files, not assumptions
- Do NOT make any code changes during review -- only report findings
- Be strict about neutrality -- this is critical for game mode where players choose between two sides
- The CLAUDE.md rules state: "Both sides should feel equally plausible at first glance. Value judgments belong in explanationCorrect and explanationWrong, not in titles or code."
