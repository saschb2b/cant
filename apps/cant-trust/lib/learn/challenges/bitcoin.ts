import type { Challenge } from "../types";

export const bitcoinChallenges: Challenge[] = [
  {
    id: "bt-001",
    category: "bitcoin",
    difficulty: "easy",
    title: "Transaction model",
    prompt:
      "Which transaction model tracks ownership by referencing previous outputs?",
    content: {
      type: "visual",
      left: { componentId: "AccountBalance" },
      right: { componentId: "UtxoModel" },
    },
    correctSide: "right",
    explanationCorrect:
      "Bitcoin uses the UTXO model where each transaction consumes previous outputs and creates new ones, like spending a banknote and receiving change. This design avoids mutable global state, enables simple verification (check that inputs exist and are unspent), and allows parallel transaction processing.",
    explanationWrong:
      "The account model maintains mutable balances that must be updated atomically. While simpler to understand, it requires careful state management and locking to prevent double-spends. Bitcoin chose the UTXO model specifically because it maps cleanly to the concept of digital cash.",
    sourceUrl: "https://bitcoin.org/bitcoin.pdf",
    sourceLabel: "Satoshi Nakamoto: Bitcoin Whitepaper (Section 2)",
  },
  {
    id: "bt-002",
    category: "bitcoin",
    difficulty: "easy",
    title: "Block structure",
    prompt:
      "Which block structure allows efficient verification of transaction inclusion?",
    content: {
      type: "visual",
      left: { componentId: "UnstructuredTxns" },
      right: { componentId: "BlockStructured" },
    },
    correctSide: "right",
    explanationCorrect:
      "Bitcoin blocks include a Merkle root in the header that summarizes all transactions in the block. This allows SPV (Simplified Payment Verification) clients to verify a transaction's inclusion with just a small proof path, without downloading the entire block. For a block with 4,000 transactions, only about 12 hashes are needed.",
    explanationWrong:
      "A flat list of transactions requires downloading every transaction to verify inclusion. This makes light clients impractical, because they would need the same bandwidth as full nodes. The Merkle tree structure is what enables mobile wallets and other lightweight Bitcoin clients.",
    sourceUrl: "https://bitcoin.org/bitcoin.pdf",
    sourceLabel: "Satoshi Nakamoto: Bitcoin Whitepaper (Section 8)",
  },
  {
    id: "bt-003",
    category: "bitcoin",
    difficulty: "medium",
    title: "Halving and supply curve",
    prompt:
      "Which issuance schedule creates predictable, diminishing new supply over time?",
    content: {
      type: "visual",
      left: { componentId: "UnlimitedSupply" },
      right: { componentId: "HalvingSupply" },
    },
    correctSide: "right",
    explanationCorrect:
      "Bitcoin's halving schedule reduces the block reward by 50% approximately every four years. This creates a disinflationary supply curve that asymptotically approaches 21 million coins. By 2140, all bitcoins will have been mined, and miners will be compensated entirely through transaction fees.",
    explanationWrong:
      "Constant issuance creates perpetual inflation with no scarcity guarantee. Holders are diluted at the same rate forever, and there is no supply ceiling to anchor long-term value. Bitcoin's halving schedule was designed to mimic the extraction curve of a finite natural resource like gold.",
    sourceUrl: "https://www.investopedia.com/bitcoin-halving-4843769",
    sourceLabel: "Investopedia: Bitcoin Halving",
  },
  {
    id: "bt-004",
    category: "bitcoin",
    difficulty: "medium",
    title: "Stock-to-flow ratio",
    prompt:
      "Which asset has a higher stock-to-flow ratio, indicating greater relative scarcity?",
    content: {
      type: "visual",
      left: { componentId: "LowStockToFlow" },
      right: { componentId: "HighStockToFlow" },
    },
    correctSide: "right",
    explanationCorrect:
      "Stock-to-flow measures scarcity by comparing existing supply to new production. Bitcoin's S2F ratio surpassed gold's after the 2024 halving and continues doubling every four years. Unlike commodities, Bitcoin's supply schedule is completely inelastic to price: higher prices do not produce more bitcoin, only more competition among miners.",
    explanationWrong:
      "Silver has a moderate S2F ratio, but it is undermined by industrial consumption and supply elasticity. When silver prices rise, mining becomes more profitable and new supply enters the market, suppressing the price. Bitcoin's programmatic scarcity makes it the first asset with a permanently increasing S2F ratio.",
    sourceUrl: "https://www.investopedia.com/terms/s/stock-to-flow-ratio.asp",
    sourceLabel: "Investopedia: Stock-to-Flow Ratio",
  },
  {
    id: "bt-005",
    category: "bitcoin",
    difficulty: "medium",
    title: "Difficulty adjustment",
    prompt:
      "Which difficulty mechanism maintains a consistent block production rate?",
    content: {
      type: "visual",
      left: { componentId: "FixedDifficulty" },
      right: { componentId: "AdaptiveDifficulty" },
    },
    correctSide: "right",
    explanationCorrect:
      "Bitcoin adjusts mining difficulty every 2,016 blocks to maintain the 10-minute target. If blocks arrive too quickly, the puzzle gets harder. If too slowly, it gets easier. This feedback loop ensures the supply schedule remains predictable regardless of how much hash power joins or leaves the network.",
    explanationWrong:
      "Fixed difficulty would cause block times to fluctuate wildly with changes in hash power. During mining booms, blocks would arrive too fast, accelerating issuance and breaking the halving schedule. During downturns, the network would slow to a crawl. The difficulty adjustment is one of Bitcoin's most elegant design decisions.",
    sourceUrl: "https://en.bitcoin.it/wiki/Difficulty",
    sourceLabel: "Bitcoin Wiki: Difficulty",
  },
  {
    id: "bt-006",
    category: "bitcoin",
    difficulty: "hard",
    title: "Energy as security",
    prompt:
      "Which view of Bitcoin mining's energy use better explains its role in network security?",
    content: {
      type: "visual",
      left: { componentId: "FreeBlockProduction" },
      right: { componentId: "EnergyBackedBlocks" },
    },
    correctSide: "right",
    explanationCorrect:
      "Bitcoin's energy expenditure is not a bug but the core security mechanism. The cost of attacking the network is directly proportional to the energy spent defending it. This creates an unforgeable physical barrier: to rewrite even a single block, an attacker must outspend all honest miners combined. No other digital system achieves this level of settlement assurance.",
    explanationWrong:
      "Viewing Bitcoin's energy use as pure waste ignores what it purchases: trustless, immutable settlement that no government or corporation can reverse. A 'simple database' could process more transactions, but it requires trusting whoever controls it. Bitcoin's energy cost is the price of removing that trust requirement.",
    sourceUrl: "https://bitcoin.org/bitcoin.pdf",
    sourceLabel: "Satoshi Nakamoto: Bitcoin Whitepaper (Section 4)",
  },
  {
    id: "bt-007",
    category: "bitcoin",
    difficulty: "hard",
    title: "Mining incentives",
    prompt: "Which incentive structure keeps miners honest over the long term?",
    content: {
      type: "visual",
      left: { componentId: "SubsidyOnlyMining" },
      right: { componentId: "SubsidyPlusFees" },
    },
    correctSide: "right",
    explanationCorrect:
      "Bitcoin was designed with a two-phase incentive model. The block subsidy bootstraps early security by paying miners with new coins. As halvings reduce the subsidy, transaction fees gradually take over. This transition ensures miners always have economic incentive to secure the network, even after all 21 million coins are mined.",
    explanationWrong:
      "A system relying solely on block subsidies has an expiration date. Once the subsidy reaches zero, miners have no reason to continue. Bitcoin avoids this by including a transaction fee market where users compete for limited block space, creating a sustainable revenue stream for miners indefinitely.",
    sourceUrl: "https://bitcoin.org/bitcoin.pdf",
    sourceLabel: "Satoshi Nakamoto: Bitcoin Whitepaper (Section 6)",
  },
];
