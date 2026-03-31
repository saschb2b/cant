import type { ChallengeCategory } from "./types";

/** Canonical display order of challenge categories. */
export const CATEGORY_ORDER: ChallengeCategory[] = [
  // Part 1: The Trust Problem
  "money-origins",
  "banking-mechanics",
  "banking-failures",
  "central-banks",
  "nixon-shock",
  "inflation",
  "settlement",
  // Part 2: The Bridge
  "cryptography",
  // Part 3: The Trust Solution
  "consensus",
  "bitcoin",
  "wallets-keys",
  "smart-contracts",
  "defi",
  "privacy",
  "scaling",
  "cbdcs",
  "governance",
  "fix-the-money",
];

/** Human-readable labels for each challenge category. */
export const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  "money-origins": "What Is Money?",
  "banking-mechanics": "How Banks Work",
  "banking-failures": "When Banks Break Trust",
  "central-banks": "Central Banks",
  "nixon-shock": "WTF Happened in 1971?",
  inflation: "The Hidden Tax",
  settlement: "Moving Money",
  cryptography: "Trust Through Math",
  consensus: "Agreement Without Authority",
  bitcoin: "Digital Sound Money",
  "wallets-keys": "Be Your Own Bank",
  "smart-contracts": "Programmable Trust",
  defi: "Finance Without Intermediaries",
  privacy: "Selective Disclosure",
  scaling: "Scaling",
  cbdcs: "The Dystopian Alternative",
  governance: "Decisions Without a King",
  "fix-the-money": "Fix the Money",
};

/** Logical grouping of categories for sidebar navigation. */
export interface CategorySection {
  label: string;
  categories: ChallengeCategory[];
}

export const CATEGORY_SECTIONS: CategorySection[] = [
  {
    label: "The Trust Problem",
    categories: [
      "money-origins",
      "banking-mechanics",
      "banking-failures",
      "central-banks",
      "nixon-shock",
      "inflation",
      "settlement",
    ],
  },
  {
    label: "The Bridge",
    categories: ["cryptography"],
  },
  {
    label: "The Trust Solution",
    categories: [
      "consensus",
      "bitcoin",
      "wallets-keys",
      "smart-contracts",
      "defi",
      "privacy",
      "scaling",
      "cbdcs",
      "governance",
      "fix-the-money",
    ],
  },
];

/** Recommended category order for newcomers starting from scratch. */
export const LEARNING_PATH: ChallengeCategory[] = [
  "money-origins",
  "nixon-shock",
  "inflation",
  "cryptography",
  "bitcoin",
];

/** Short description for each category, shown on the learn overview. */
export const CATEGORY_DESCRIPTIONS: Record<ChallengeCategory, string> = {
  "money-origins":
    "What is money, how is wealth created, and why did gold win? You need to understand what money is before you can see what is broken. Crucially, wealth is not zero-sum.",
  "banking-mechanics":
    "Fractional reserves, money creation through lending, rehypothecation, and correspondent banking. Most people don't know how banks actually operate.",
  "banking-failures":
    "Bank runs, bail-ins, account freezing, and the unbanked. These are not hypothetical risks. Every one of these has happened.",
  "central-banks":
    "Interest rates, quantitative easing, money supply metrics, and currency debasement. Central banks are the ultimate trust anchor in fiat.",
  "nixon-shock":
    "August 15, 1971: Nixon closed the gold window. Every chart breaks at this date. Productivity vs wages, debt, savings, housing, wealth inequality.",
  inflation:
    "CPI manipulation, shrinkflation, the Cantillon effect, and the compound erosion of purchasing power. Inflation is the most direct way trust gets violated.",
  settlement:
    "T+2 settlement, SWIFT, remittance corridors, and netting. Settlement is where trust manifests as delay. Every intermediary adds time and cost.",
  cryptography:
    "Hash functions, public/private keys, digital signatures, Merkle trees, and zero-knowledge proofs. Cryptography is the bridge that makes trustlessness possible.",
  consensus:
    "Byzantine fault tolerance, Proof of Work, Proof of Stake, Ouroboros, and finality models. Consensus replaces the central authority.",
  bitcoin:
    "UTXOs, block structure, halving, stock-to-flow, difficulty adjustment, and energy as security. Bitcoin is the first successful trustless money.",
  "wallets-keys":
    "Custodial vs non-custodial, HD wallets, seed phrases, and multisig. Self-custody is where trustlessness becomes personal.",
  "smart-contracts":
    "Legal contracts vs smart contracts, account model vs eUTXO, vulnerabilities, and formal verification. Programmable trust beyond money.",
  defi: "AMMs, liquidity pools, lending protocols, and yield farming. DeFi rebuilds financial services without the trust layer.",
  privacy:
    "Transparent vs shielded transactions, zero-knowledge applications, and Midnight. Trustlessness without privacy is surveillance.",
  scaling:
    "The blockchain trilemma, Layer 1 vs Layer 2, state channels (Hydra), and rollups. Scaling without sacrificing decentralization.",
  cbdcs:
    "CBDCs vs cryptocurrency, programmable restrictions, financial surveillance, and the cash elimination agenda. The dystopian alternative to bitcoin.",
  governance:
    "On-chain vs off-chain governance, treasury systems, voting mechanisms, hard forks, and Cardano's constitutional governance.",
  "fix-the-money":
    "Every problem from Part 1 maps to a solution in Part 3. Trust in banks to self-custody, central bank printing to fixed supply, settlement delays to instant finality.",
};
