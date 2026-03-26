# Can't Orchestrate - App Rules

See the root [CLAUDE.md](../../CLAUDE.md) for monorepo-wide rules.

## App-specific notes

- Categories and challenges live in `lib/learn/categories.ts` and `lib/learn/challenges/`
- `lib/shiki.ts` adds Dockerfile, YAML, Bash, XML, JSON, and TOML language support for syntax highlighting
- Challenge `lang` field determines which Shiki language is used for highlighting (e.g. "dockerfile", "yaml", "bash", "xml")
- `getRank()` in `lib/game/share.ts` returns plain strings (not objects like cant-type)
- Umami website ID: `placeholder-cant-orchestrate` (needs to be updated with a real ID)
