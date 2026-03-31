# cant-trust — Planning Document

> "Can't Trust" — Why trust is the problem, and how we remove it.

## Concept

A hybrid app covering traditional finance AND cryptocurrency/blockchain.
The framing: trust is the weakness in every financial system. The learning path
starts with "here's why trust is the problem" and builds toward "here's how we
remove it."

The user is a Cardano/Midnight believer and Bitcoin maximalist-leaning, so the
content should reflect sound money principles and give Cardano ecosystem
specifics where relevant (Ouroboros, Plutus, Midnight/ZK).

## Learning Path (category flow)

The categories are ordered to tell a story. Each builds on the previous.

### Part 1: The Trust Problem (traditional finance)

#### 1. `money-origins` — What Is Money?

Why it matters: You need to understand what money is before you can see what is
broken. Crucially, wealth is not zero-sum. Wealth is created through production,
and money is just the scorecard.

| #   | Title                         | Difficulty | Type   | Description                                                                                                                           |
| --- | ----------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Barter vs medium of exchange  | easy       | visual | Animated diagram: direct barter (double coincidence of wants) vs using a medium                                                       |
| 2   | From shells to gold           | easy       | visual | Timeline: shells, cattle, salt, metal coins, gold. Show what properties made each succeed or fail                                     |
| 3   | Wealth through production     | easy       | visual | Wealth is NOT zero-sum: farmer turns seed into food, engineer turns materials into a house. Both sides of a trade win                 |
| 4   | Money as stored time          | easy       | visual | Every hour you work, you store your life energy in money. Money is a battery for human effort. If debased, your stored time is stolen |
| 5   | Properties of sound money     | easy       | visual | Score card: rate candidates (shells, beads, silver, gold, bitcoin) on durability, divisibility, portability, scarcity, fungibility    |
| 6   | Specialization and trade      | medium     | visual | Animated: generalist vs specialists. Division of labor makes production cheaper, competition drives prices down for everyone          |
| 7   | The rigged referee            | medium     | visual | Money is the points system for economic competition. Printing money is a referee handing out points to friends without earning them   |
| 8   | Why gold won                  | medium     | visual | Compare candidate moneys on the sound money properties, show why gold dominated for millennia                                         |
| 9   | Commodity money vs fiat money | medium     | visual | Gold-backed note vs unbacked fiat, show the trust assumption that enters when the backing disappears                                  |
| 10  | Gresham's Law                 | hard       | visual | "Bad money drives out good" — animated circulation simulation: people hoard sound money, spend debased money                          |

#### 2. `banking-mechanics` — How Banks Actually Work

Why it matters: Banks are the primary trust layer most people interact with.
Most people don't know how they actually operate.

| #   | Title                              | Difficulty | Type   | Description                                                                                    |
| --- | ---------------------------------- | ---------- | ------ | ---------------------------------------------------------------------------------------------- |
| 1   | Full reserve vs fractional reserve | easy       | visual | Animated vault: deposits in, loans out, show the reserve ratio                                 |
| 2   | It's not your money                | easy       | visual | Depositor as unsecured creditor: your "balance" is a bank's IOU, not money in a vault          |
| 3   | Money creation through lending     | medium     | visual | Flow diagram: deposit → loan → deposit → loan, money multiplier effect                         |
| 4   | Rehypothecation                    | medium     | visual | Your assets pledged as collateral for the bank's bets, chain of claims on the same asset       |
| 5   | Correspondent banking              | hard       | visual | SWIFT message flow across 3-4 banks for an international transfer, each one a trust dependency |

#### 3. `banking-failures` — When Banks Break Trust

Why it matters: These are not hypothetical risks. Every one of these has happened.
This is the "aha" category where the case for trustlessness becomes visceral.

| #   | Title                    | Difficulty | Type   | Description                                                                                                       |
| --- | ------------------------ | ---------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| 1   | Bank run dynamics        | easy       | visual | Simulation: depositors withdrawing, bank liquidity shrinking, first come first served                             |
| 2   | Deposit insurance limits | easy       | visual | FDIC fund size vs total deposits: the safety net is a fraction of a percent. SVB as case study                    |
| 3   | Bail-ins                 | medium     | visual | Cyprus 2013: deposits over 100k confiscated to recapitalize. Show the legal framework now in place                |
| 4   | Account freezing         | medium     | visual | Flow: government order → bank freezes account → no due process. Canada 2022, Operation Choke Point                |
| 5   | The unbanked             | hard       | visual | 1.4B people globally have no access to banking. Map: banking exclusion by region, requirements to open an account |

#### 4. `central-banks` — The Lender of Last Resort

Why it matters: Central banks are the ultimate trust anchor in fiat. Understanding
their tools reveals the tradeoffs.

| #   | Title                    | Difficulty | Type   | Description                                                                                                                            |
| --- | ------------------------ | ---------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Interest rate mechanism  | easy       | visual | Animated rate lever: borrowing cost up/down, effect on lending                                                                         |
| 2   | Quantitative easing      | medium     | visual | Balance sheet expansion diagram, money flowing into bond markets                                                                       |
| 3   | Money supply metrics     | medium     | visual | M0/M1/M2/M3 nested circles, show what each layer adds                                                                                  |
| 4   | Currency debasement      | medium     | visual | Coin clipping, devaluation, modern printing. Same trick across millennia, just different technology                                    |
| 5   | Why coins have ridges    | medium     | visual | Citizens clipped gold edges for profit. The king added ridges to stop them, but kept the right to debase for himself                   |
| 6   | The political blind spot | hard       | visual | Left says redistribute. Right says work harder. Neither addresses the money. Both "solutions" fail because the gap reopens in 10 years |

#### 5. `nixon-shock` — WTF Happened in 1971?

Why it matters: August 15, 1971 is the inflection point. Nixon closed the gold
window, ending Bretton Woods. Every chart on wtfhappenedin1971.com breaks at
this date. This category is the emotional core of Part 1.

| #   | Title                         | Difficulty | Type   | Description                                                                                                                                       |
| --- | ----------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Gold window closing           | easy       | visual | Timeline: Bretton Woods (1944) → gold drain → French warship → Nixon speech → floating rates                                                      |
| 2   | Productivity vs wages         | easy       | visual | Chart: productivity and wages track together until 1971, then diverge sharply                                                                     |
| 3   | Gold reserves vs money supply | medium     | visual | Dual-axis chart: gold reserves shrinking while M2 money supply explodes                                                                           |
| 4   | Federal debt trajectory       | medium     | visual | Debt-to-GDP ratio: flat for decades, then exponential post-1971                                                                                   |
| 5   | M2 growth vs wealth gap       | medium     | visual | Money supply growth tracks 1:1 with top 0.1% wealth while bottom 90% stagnates. The data proof                                                    |
| 6   | Capitalism needs hard money   | medium     | visual | Free markets can't function when money isn't scarce. The "capital" in capitalism matters. Same system, different outcomes with hard vs soft money |
| 7   | Housing affordability         | hard       | visual | Years of median salary to buy a house: 3 years then, 10+ now. Mortgage math at current rates                                                      |
| 8   | Savings rate collapse         | hard       | visual | Personal savings rate + dual-income necessity: one salary used to be enough                                                                       |

#### 6. `inflation` — The Hidden Tax

Why it matters: Inflation is the most direct way trust gets violated. You trusted
your money would hold value. The post-1971 era made it permanent. And the way
it's measured is designed to hide how bad it really is.

| #   | Title                              | Difficulty | Type   | Description                                                                                                                                |
| --- | ---------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | CPI basket vs real costs           | easy       | visual | Side-by-side: official CPI vs housing/education/healthcare (the gap widens post-71)                                                        |
| 2   | Purchasing power over time         | easy       | visual | Chart: what $100 buys in 1971 vs 2000 vs 2024, anchored to the Nixon shock                                                                 |
| 3   | Shrinkflation                      | easy       | visual | Same price, less product: chocolate bar 150g → 131g → 110g. The hidden price increase you don't notice                                     |
| 4   | The word "inflation" was redefined | easy       | visual | Originally meant "expansion of money supply" (cause). Redefined to "rising prices" (effect). The linguistic trick that hides the mechanism |
| 5   | Cumulative inflation               | medium     | visual | Price level since 1913: slow and steady, then hockey stick after 1971                                                                      |
| 6   | CPI manipulation methods           | medium     | visual | How the basket is rigged: substitution (steak → hamburger), geometric weighting, hedonic adjustment, tech deflation                        |
| 7   | 1980 basket vs current basket      | medium     | visual | Same goods, measured the old way: 5-15% inflation vs the reported 0-5%. Side-by-side chart                                                 |
| 8   | Inflation compounds                | medium     | visual | Inflation is velocity, not a one-time event. 2% sounds harmless but compounds: show 30-year purchasing power erosion                       |
| 9   | Asset inflation vs consumer        | medium     | visual | CPI only measures groceries. Money flows into assets first (stocks, real estate, art). Rich own assets, poor buy groceries                 |
| 10  | You can't print prosperity         | medium     | visual | If printing money created wealth, Zimbabwe would be richest. Printing redistributes, it doesn't produce                                    |
| 11  | The producer's dilemma             | medium     | visual | When money is printed, producers have 3 bad options: eat the loss, raise prices, or reduce quality. All three hurt                         |
| 12  | Progress happens despite printing  | medium     | visual | Technology improved living standards DESPITE money printing, not because of it. The gains would be even greater with sound money           |
| 13  | Hyperinflation patterns            | hard       | visual | Logarithmic price charts: Weimar, Zimbabwe, Venezuela                                                                                      |
| 14  | The fiat graveyard                 | hard       | visual | Average fiat currency lifespan ~27 years. Graveyard of dead currencies: French livre, German mark, Zimbabwe dollar. None survive           |
| 15  | Cantillon effect                   | hard       | visual | New money enters at the top, trickles down after prices already rose. First receivers win, last receivers lose                             |
| 16  | Retroactive theft of savings       | hard       | visual | 25% money supply increase in 5 years = a quarter of your life savings stolen. Your past labor is devalued after the fact                   |

#### 7. `settlement` — Moving Money Is Slow (and Expensive)

Why it matters: Settlement is where trust manifests as delay. Every intermediary
adds time and cost.

| #   | Title                       | Difficulty | Type   | Description                                                            |
| --- | --------------------------- | ---------- | ------ | ---------------------------------------------------------------------- |
| 1   | T+0 vs T+2 settlement       | easy       | visual | Timeline: trade executed vs actually settled, counterparty risk window |
| 2   | Wire transfer anatomy       | medium     | visual | Flow: your bank → correspondent → SWIFT → correspondent → their bank   |
| 3   | Remittance corridors        | medium     | visual | World map flow: cost/time for sending $200 to different countries      |
| 4   | Netting vs gross settlement | hard       | visual | Animated: bilateral netting reduces total transfers needed             |

### Part 2: The Bridge (cryptography fundamentals)

#### 8. `cryptography` — Trust Through Math

Why it matters: This is the bridge. Cryptography is what makes trustlessness
possible.

| #   | Title                         | Difficulty | Type   | Description                                                               |
| --- | ----------------------------- | ---------- | ------ | ------------------------------------------------------------------------- |
| 1   | Hash function properties      | easy       | visual | Input → hash output, show avalanche effect with tiny input changes        |
| 2   | Public/private key pairs      | easy       | visual | Animated: lock/unlock with key pairs, signing and verifying               |
| 3   | Digital signatures            | medium     | visual | Flow: sign with private key, anyone verifies with public key              |
| 4   | Merkle trees                  | medium     | visual | Animated tree: change one leaf, watch hashes propagate up                 |
| 5   | Zero-knowledge proofs (intro) | hard       | visual | "Prove you know the secret without revealing it" — cave analogy animation |

### Part 3: The Trust Solution (blockchain and crypto)

#### 9. `consensus` — Agreement Without Authority

Why it matters: Consensus replaces the central authority. This is the core
innovation.

| #   | Title                      | Difficulty | Type   | Description                                                           |
| --- | -------------------------- | ---------- | ------ | --------------------------------------------------------------------- |
| 1   | Byzantine Generals Problem | easy       | visual | Animated generals: traitors, honest nodes, reaching agreement         |
| 2   | Proof of Work              | medium     | visual | Mining simulation: nonce grinding, difficulty adjustment, block found |
| 3   | Proof of Stake             | medium     | visual | Validator selection animation, stake weighting, slot leaders          |
| 4   | Nakamoto vs Ouroboros      | hard       | visual | Side-by-side: probabilistic vs provable finality, energy comparison   |
| 5   | Finality models            | hard       | code   | Probabilistic (confirmations) vs deterministic (epoch boundary)       |

#### 10. `bitcoin` — Digital Sound Money

Why it matters: Bitcoin is the first successful implementation of trustless money.
It directly solves every problem from Part 1.

| #   | Title                    | Difficulty | Type   | Description                                                                                                          |
| --- | ------------------------ | ---------- | ------ | -------------------------------------------------------------------------------------------------------------------- |
| 1   | UTXO model               | easy       | visual | Transaction flow: inputs consumed, outputs created, change returned                                                  |
| 2   | Block structure          | easy       | visual | Animated block: header, merkle root, transactions, nonce                                                             |
| 3   | Halving and supply curve | medium     | visual | Chart: supply curve approaching 21M, halving events marked                                                           |
| 4   | Stock-to-flow            | medium     | visual | How scarce is bitcoin vs gold vs fiat? New supply relative to existing supply. Bitcoin becomes scarcer every halving |
| 5   | Difficulty adjustment    | medium     | visual | Feedback loop: hashrate up → difficulty up → block time stabilizes                                                   |
| 6   | Energy as security       | hard       | visual | "Bitcoin wastes energy" reframed: energy expenditure IS the security. Bridge between physical and digital scarcity   |
| 7   | Mining incentives        | hard       | visual | Game theory: fees vs subsidy over time, security budget                                                              |

#### 11. `wallets-keys` — Be Your Own Bank

Why it matters: Self-custody is where trustlessness becomes personal.

| #   | Title                      | Difficulty | Type   | Description                                              |
| --- | -------------------------- | ---------- | ------ | -------------------------------------------------------- |
| 1   | Custodial vs non-custodial | easy       | visual | Flow: who holds the keys in each model                   |
| 2   | HD wallet derivation       | medium     | visual | Tree diagram: seed → master key → child keys → addresses |
| 3   | Seed phrase security       | medium     | visual | BIP-39: entropy → mnemonic → seed, checksum validation   |
| 4   | Multisig setups            | hard       | visual | 2-of-3 signing flow, threshold visualization             |

#### 12. `smart-contracts` — Programmable Trust

Why it matters: Smart contracts extend trustlessness beyond money to agreements.

| #   | Title                      | Difficulty | Type   | Description                                                                   |
| --- | -------------------------- | ---------- | ------ | ----------------------------------------------------------------------------- |
| 1   | Contract vs smart contract | easy       | visual | Side-by-side: legal contract (needs court) vs smart contract (self-executing) |
| 2   | Account model vs eUTXO     | medium     | visual | Ethereum global state vs Cardano extended UTXO, concurrency                   |
| 3   | Common vulnerabilities     | medium     | code   | Reentrancy, integer overflow — pattern comparison                             |
| 4   | Formal verification        | hard       | visual | Plutus/Haskell approach: mathematical proof vs "test and hope"                |

#### 13. `defi` — Finance Without Intermediaries

Why it matters: DeFi rebuilds financial services without the trust layer.

| #   | Title               | Difficulty | Type   | Description                                                    |
| --- | ------------------- | ---------- | ------ | -------------------------------------------------------------- |
| 1   | AMM vs order book   | easy       | visual | Animated: constant product curve vs bid/ask book               |
| 2   | Liquidity pools     | medium     | visual | Pool diagram: provide liquidity, earn fees, impermanent loss   |
| 3   | Lending protocols   | medium     | visual | Collateral → borrow flow, liquidation threshold                |
| 4   | Yield farming risks | hard       | visual | Risk stack: smart contract, oracle, impermanent loss, rug pull |

#### 14. `privacy` — Selective Disclosure

Why it matters: Trustlessness without privacy is surveillance. Midnight brings
privacy to Cardano.

| #   | Title                                | Difficulty | Type   | Description                                                            |
| --- | ------------------------------------ | ---------- | ------ | ---------------------------------------------------------------------- |
| 1   | Transparent vs shielded transactions | easy       | visual | Two ledgers: everything visible vs selective disclosure                |
| 2   | Zero-knowledge proof applications    | medium     | visual | Prove age without revealing birthdate, prove solvency without balances |
| 3   | Midnight's approach                  | medium     | visual | Diagram: public/private state split, ZK compiler flow                  |
| 4   | On-chain analytics                   | hard       | visual | Graph: clustering heuristics, address linkage, why privacy matters     |

#### 15. `scaling` — Growing Without Trust Tradeoffs

Why it matters: Scaling without sacrificing decentralization is an open problem.

| #   | Title               | Difficulty | Type   | Description                                                      |
| --- | ------------------- | ---------- | ------ | ---------------------------------------------------------------- |
| 1   | Blockchain trilemma | easy       | visual | Triangle: decentralization, security, scalability — pick two     |
| 2   | Layer 1 vs Layer 2  | easy       | visual | Base chain vs rollup/sidechain/channel, trust assumptions        |
| 3   | State channels      | medium     | visual | Animated: open channel → off-chain txs → settle on-chain (Hydra) |
| 4   | Rollups             | hard       | visual | Optimistic vs ZK rollups: fraud proofs vs validity proofs        |

#### 16. `cbdcs` — The Dystopian Alternative

Why it matters: CBDCs are governments' response to crypto. They take everything
wrong with the current system and make it worse: programmable control over what
you can buy, when money expires, and who gets cut off.

| #   | Title                       | Difficulty | Type   | Description                                                                                          |
| --- | --------------------------- | ---------- | ------ | ---------------------------------------------------------------------------------------------------- |
| 1   | CBDC vs cryptocurrency      | easy       | visual | Side-by-side: centralized digital fiat vs decentralized crypto. Same technology, opposite philosophy |
| 2   | Programmable restrictions   | easy       | visual | Money that expires, can only be spent at approved merchants, or is geofenced to your region          |
| 3   | Financial surveillance      | medium     | visual | Every transaction visible to the state. No cash, no privacy. KYC on steroids                         |
| 4   | Social credit integration   | medium     | visual | CBDC + social scoring: low score → restricted spending. China's system as case study                 |
| 5   | The cash elimination agenda | hard       | visual | Cash is freedom. Removing cash removes the exit. Timeline of cash restrictions across countries      |

#### 17. `governance` — Decisions Without a King

Why it matters: Trustless systems still need to evolve. How do you make
collective decisions without a central authority? Cardano's approach through
Catalyst and on-chain governance is one of the most ambitious experiments.

| #   | Title                            | Difficulty | Type   | Description                                                                                         |
| --- | -------------------------------- | ---------- | ------ | --------------------------------------------------------------------------------------------------- |
| 1   | On-chain vs off-chain governance | easy       | visual | Bitcoin's rough consensus vs Cardano's formal voting. Tradeoffs: speed, legitimacy, participation   |
| 2   | Treasury systems                 | medium     | visual | Cardano's treasury: block rewards fund development. Community votes on proposals via Catalyst       |
| 3   | Voting mechanisms                | medium     | visual | Stake-weighted voting, quadratic voting, conviction voting. How to prevent plutocracy               |
| 4   | Hard forks vs soft forks         | medium     | visual | Animated: chain splits, node upgrades, backward compatibility. Bitcoin block size war as case study |
| 5   | Constitutional governance        | hard       | visual | Cardano's on-chain constitution: DReps, constitutional committee, SPOs. Three pillars of governance |

#### 18. `fix-the-money` — Connecting the Dots

Why it matters: This is the payoff. Every problem from Part 1 maps to a solution
in Part 3. "Fix the money, fix the world" is not a slogan, it's a thesis.

| #   | Title                                  | Difficulty | Type   | Description                                                                                                       |
| --- | -------------------------------------- | ---------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| 1   | Trust in banks → self-custody          | easy       | visual | Side-by-side: "it's not your money" (Part 1) vs "not your keys, not your coins" solved by wallets (Part 3)        |
| 2   | Central bank → fixed supply            | easy       | visual | Money printer vs halving schedule. Infinite supply vs 21 million. The core contrast                               |
| 3   | Settlement delay → instant finality    | medium     | visual | SWIFT (3-5 days, 6 intermediaries) vs Lightning/blockchain (seconds, peer-to-peer)                                |
| 4   | Cantillon effect → fair distribution   | medium     | visual | First receivers win in fiat. In bitcoin, no one gets new coins for free. Mining requires real energy input        |
| 5   | The fiat graveyard vs the Lindy effect | hard       | visual | Every fiat currency dies. Bitcoin has survived 15+ years of attacks. The longer it lives, the longer it will live |

## Visual Component Ideas

Reusable components to build for `@cant/shared` or app-local:

- **FlowDiagram** — animated node-and-arrow flows (banking, transactions, signing)
- **SupplyCurve** — interactive chart with marked events (halvings, QE periods)
- **ConsensusSimulation** — animated nodes reaching agreement (configurable for PoW/PoS)
- **MerkleTree** — interactive tree with hash propagation
- **WalletDerivation** — HD tree visualization
- **LedgerComparison** — side-by-side transparent vs shielded

## Challenge Count Summary

| Part                  | Categories | Challenges |
| --------------------- | ---------- | ---------- |
| 1. The Trust Problem  | 7          | 58         |
| 2. The Bridge         | 1          | 5          |
| 3. The Trust Solution | 10         | 46         |
| **Total**             | **18**     | **109**    |

## Inspiration

- [wtfhappenedin1971.com](https://wtfhappenedin1971.com/) — the `nixon-shock`
  category is directly inspired by this site. Many of its charts (productivity
  vs wages, savings rate, debt trajectory, cumulative inflation) serve as
  visual reference for challenge animations.
- **Der Bitcoin Podcast (Florian)** — German Bitcoin podcast. Key themes
  integrated: wealth creation is not zero-sum, the Cantillon effect as THE
  wealth redistribution mechanism, CPI basket manipulation (substitution,
  geometric weighting, hedonic adjustment), shrinkflation, inflation as
  compounding velocity, the producer's dilemma (3 bad options), retroactive
  theft of savings, housing affordability collapse, M2 correlation with top
  0.1% wealth. His framing: "Fix the money, fix the world."

## Open Questions

- [x] ~~Should there be a category on governance?~~ Yes, added as category 17
- [x] ~~Cardano-specific content~~ — Woven throughout, not its own category. Appears naturally where relevant: Ouroboros (consensus), eUTXO/Plutus (smart-contracts), Midnight (privacy), Catalyst/DReps (governance), Hydra (scaling)
- [x] ~~App theme colors~~ — Bitcoin gold/amber. Sound money, warmth, trust through scarcity.
- [x] ~~App icon~~ — Bitcoin-inspired. The "B" with vertical strokes, adapted for the cant series style.
