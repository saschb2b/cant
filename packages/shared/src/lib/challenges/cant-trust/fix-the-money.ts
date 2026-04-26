import type { BaseChallenge } from "../../game/types";

export const fixTheMoneyChallenges: BaseChallenge[] = [
  {
    id: "fm-001",
    category: "fix-the-money",
    difficulty: "easy",
    title: "Self-custody",
    prompt:
      "Which approach to holding value gives the owner unconditional access to their wealth?",
    content: {
      type: "visual",
      left: { componentId: "BankCustody" },
      right: { componentId: "SelfCustody" },
    },
    correctSide: "right",
    explanationCorrect:
      "Self-custody means holding your own private keys, giving you unconditional access to your funds 24/7. No bank holiday, government order, or institutional insolvency can prevent you from transacting. This is the core value proposition of cryptocurrency: true ownership rather than a claim on someone else's promise.",
    explanationWrong:
      "Bank deposits are IOUs. The bank does not hold your money in a vault; it lends most of it out. You own a legal claim to withdraw, but that claim is subject to the bank's solvency, government regulations, and operational hours. During crises, these access limitations become painfully apparent.",
    sourceUrl: "https://bitcoin.org/en/secure-your-wallet",
    sourceLabel: "Bitcoin.org: Secure Your Wallet",
  },
  {
    id: "fm-002",
    category: "fix-the-money",
    difficulty: "easy",
    title: "Monetary policy",
    prompt:
      "Which monetary system provides a supply schedule that cannot be changed by any individual or committee?",
    content: {
      type: "visual",
      left: { componentId: "InfiniteSupply" },
      right: { componentId: "FixedSupply" },
    },
    correctSide: "right",
    explanationCorrect:
      "A fixed supply algorithm removes human discretion from monetary policy. Bitcoin's 21 million cap and halving schedule were set at inception and are enforced by every node on the network. No committee, government, or majority of miners can increase the supply. This predictability allows long-term economic planning.",
    explanationWrong:
      "Central bank committees face constant political pressure to expand the money supply. Even well-intentioned officials make mistakes, and the incentive structure rewards short-term stimulus over long-term stability. The 40% increase in M2 money supply during 2020-2021 demonstrated how quickly purchasing power can be eroded by discretionary policy.",
    sourceUrl: "https://www.investopedia.com/terms/m/m2.asp",
    sourceLabel: "Investopedia: M2 Money Supply",
  },
  {
    id: "fm-003",
    category: "fix-the-money",
    difficulty: "medium",
    title: "Settlement finality",
    prompt:
      "Which settlement system resolves payments without depending on intermediary banks?",
    content: {
      type: "visual",
      left: { componentId: "SwiftSettlement" },
      right: { componentId: "BlockchainSettlement" },
    },
    correctSide: "right",
    explanationCorrect:
      "Blockchain settlement is peer-to-peer and final. There are no intermediary banks, no correspondent routing, and no multi-day delays. A transaction from the US to Japan costs the same as one across the street and settles in minutes. This eliminates the friction, cost, and counterparty risk of the traditional correspondent banking system.",
    explanationWrong:
      "Traditional cross-border settlement involves multiple intermediary banks, each adding fees and delays. The SWIFT network is a messaging system, not a settlement system. Actual funds move through a chain of correspondent bank relationships, each introducing counterparty risk and processing time. Weekends and holidays add further delays.",
    sourceUrl: "https://www.investopedia.com/terms/s/swift.asp",
    sourceLabel: "Investopedia: SWIFT",
  },
  {
    id: "fm-004",
    category: "fix-the-money",
    difficulty: "medium",
    title: "Cantillon effect",
    prompt:
      "Which monetary system distributes new money more fairly across participants?",
    content: {
      type: "visual",
      left: { componentId: "CantillonUnfair" },
      right: { componentId: "MiningFair" },
    },
    correctSide: "right",
    explanationCorrect:
      "Cryptocurrency distributes new issuance through transparent, permissionless protocol rules. There is no first-receiver advantage because everyone competes under the same rules. This eliminates the Cantillon effect, where those closest to new money creation benefit at the expense of everyone else.",
    explanationWrong:
      "The Cantillon effect is a hidden tax on everyone who is not first in line to receive new money. Banks and government-connected entities receive fresh currency at pre-inflation prices, while wage earners and savers absorb the resulting price increases. This is one of the most insidious forms of wealth transfer in the modern economy.",
    sourceUrl:
      "https://fee.org/articles/the-cantillon-effect-because-of-inflation-we-re-financing-the-financiers/",
    sourceLabel: "FEE: The Cantillon Effect",
  },
  {
    id: "fm-005",
    category: "fix-the-money",
    difficulty: "hard",
    title: "Fiat track record vs the Lindy effect",
    prompt:
      "Which monetary property better predicts a currency's long-term survival?",
    content: {
      type: "visual",
      left: { componentId: "FiatGraveyardScroll" },
      right: { componentId: "BitcoinLindy" },
    },
    correctSide: "right",
    explanationCorrect:
      "The Lindy effect suggests that the future life expectancy of a non-perishable thing is proportional to its current age. Gold's 5,000-year track record as money is the strongest endorsement possible. Bitcoin, while young, has survived every test thrown at it and gains Lindy credibility with each passing year. Sound money endures because its properties resist the degradation that destroys fiat currencies.",
    explanationWrong:
      "Every fiat currency in history has either collapsed or been reformed. The US dollar has lost roughly 98% of its purchasing power since leaving the gold standard in 1971. The pattern is consistent: governments face short-term incentives to inflate, and over sufficient time, they always do. Sound money with immutable properties breaks this cycle.",
    sourceUrl: "https://saifedean.com/thebitcoinstandard",
    sourceLabel: "Saifedean Ammous: The Bitcoin Standard (Ch. 8)",
  },
];
