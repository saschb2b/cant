# Claude Code Rules

## Before committing

Run all three checks and fix any issues before every commit:

```bash
pnpm run lint
pnpm run typecheck
pnpm run format:check
```

If formatting fails, run `npx prettier --write .` and include the changes in the commit.

Do not commit code that fails any of these checks.

## Code style

- Use pnpm, not npm
- No em dashes in any text (user-facing, comments, JSDoc, metadata). Use commas, periods, colons, or "and" instead.
- Don't override MUI's default `borderRadius` unless there's a specific visual reason (0 for sharp edges, 0.5 for compact inline elements, 2 for floating pills, 100 for full pills)
- Prefer MUI's `sx` breakpoint objects over `useMediaQuery` for responsive styling
- Keep challenge explanations factually accurate and natural-sounding
