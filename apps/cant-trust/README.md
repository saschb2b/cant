# Can't Trust

Don't trust. Verify. A finance and Bitcoin education app with a pattern quiz, a reference library, and 106 challenges across 18 categories.

## Play

Pick the better approach in 10 side-by-side challenges at `/play`.

- **Daily and weekly seeds** for shared challenges
- **Streak tracking** with rank system
- **Activity graph** showing your practice history
- **Shareable results** with encoded URLs

## Learn

106 challenges across 18 categories at `/learn`, organized in three parts.

### Part 1: The Trust Problem (traditional finance)

- **What Is Money?**: Barter, wealth creation, sound money properties, Gresham's Law
- **How Banks Work**: Fractional reserve, money creation, rehypothecation, correspondent banking
- **When Banks Break Trust**: Bank runs, bail-ins, account freezing, the unbanked
- **Central Banks**: Interest rates, QE, money supply, debasement, coin ridges
- **WTF Happened in 1971?**: Nixon shock, productivity-wages divergence, M2 vs wealth gap, housing affordability
- **The Hidden Tax**: CPI manipulation, shrinkflation, Cantillon effect, compounding inflation, fiat graveyard
- **Moving Money**: Settlement delays, SWIFT, remittance corridors, netting

### Part 2: The Bridge (cryptography)

- **Trust Through Math**: Hash functions, key pairs, digital signatures, Merkle trees, zero-knowledge proofs

### Part 3: The Trust Solution (blockchain and crypto)

- **Agreement Without Authority**: Byzantine fault tolerance, Proof of Work, Proof of Stake, Ouroboros
- **Digital Sound Money**: UTXO, block structure, halving, stock-to-flow, difficulty adjustment, energy as security
- **Be Your Own Bank**: Custodial vs non-custodial, HD wallets, seed phrases, multisig
- **Programmable Trust**: Smart contracts, eUTXO, vulnerabilities, formal verification
- **Finance Without Intermediaries**: AMMs, liquidity pools, lending protocols, yield farming
- **Selective Disclosure**: Transparent vs shielded, ZK proofs, Midnight
- **Scaling**: Blockchain trilemma, Layer 2, state channels (Hydra), rollups
- **The Dystopian Alternative**: CBDCs, programmable restrictions, financial surveillance
- **Decisions Without a King**: On-chain governance, Catalyst, voting mechanisms, Cardano's constitution
- **Fix the Money**: Connecting every Part 1 problem to its Part 3 solution

Each challenge shows an Avoid/Prefer comparison with animated Canvas 2D visualizations (flow diagrams, simulations, charts) and explanations linking to authoritative sources.

## Inspiration

- [wtfhappenedin1971.com](https://wtfhappenedin1971.com/) for the Nixon shock category
- [Der Bitcoin Podcast](https://www.youtube.com/@DerBitcoinPodcast) (Florian) for the Cantillon effect framing, CPI manipulation, and "Fix the money, fix the world" thesis
- [The Bitcoin Standard](https://saifedean.com/thebitcoinstandard) by Saifedean Ammous for sound money properties

## Search

Fuzzy search across all pages, categories, and challenges with Ctrl+K / Cmd+K. Powered by Fuse.js.

## Tech Stack

- Next.js 16 (App Router, View Transitions)
- React 19
- Material UI 7 + Emotion
- Canvas 2D (animated visual challenges)
- Shiki (syntax highlighting for the few code challenges)
- Fuse.js (search)
- Umami (analytics)
- TypeScript, pnpm

## Development

```bash
pnpm install
pnpm dev:trust
```

Runs on port 3012.

### Quality checks

```bash
pnpm turbo lint --filter=cant-trust
pnpm turbo typecheck --filter=cant-trust
pnpm turbo format:check --filter=cant-trust
```

## Project Structure

```
app/
  page.tsx                    # Landing page
  play/page.tsx               # Game page
  play/results/page.tsx       # Shareable results page
  learn/
    page.tsx                  # Category overview
    [category]/page.tsx       # Category detail

components/
  site-header.tsx             # Shared header (search, nav, theme)
  site-footer.tsx             # Shared footer
  hero-animation.tsx          # Bitcoin-inspired SVG hero
  search-palette.tsx          # Ctrl+K search dialog
  game/
    game.tsx                  # Main game loop
    lobby-screen.tsx          # Game setup and history
    results-screen.tsx        # Results with ranks
    explanation-panel.tsx     # Post-answer explanation
    visual-panel.tsx          # Visual challenge wrapper
  visual/
    registry.tsx              # componentId -> React component map
    barter-vs-medium.tsx      # Trading systems visualization
    reserve-banking.tsx       # Fractional reserve animation
    bank-run.tsx              # Bank run simulation
    ...                       # 100+ visual component files

lib/
  theme.ts                    # MUI Bitcoin-gold theme (light/dark)
  shiki.ts                    # Syntax highlighter
  learn/
    types.ts                  # Challenge types (18 categories)
    categories.ts             # Category metadata and learning path
    challenges/               # 106 challenges across 18 files
  game/
    share.ts                  # Ranks, encoding, share URLs
    use-game.ts               # Game state machine
```

## Part of the Can't series

- **Can't Trust** - Money, banking, and Bitcoin (this project)
- [Can't Type](https://cant-type.saschb2b.com) - TypeScript patterns
- [Can't Game](https://cant-game.saschb2b.com) - Game development patterns
- [Can't Maintain](https://cant-maintain.saschb2b.com) - React component API design
- [Can't Resize](https://cant-resize.saschb2b.com) - Responsive design patterns
