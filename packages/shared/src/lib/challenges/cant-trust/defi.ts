import type { BaseChallenge } from "../../game/types";

export const defiChallenges: BaseChallenge[] = [
  {
    id: "df-001",
    category: "defi",
    difficulty: "easy",
    title: "Trade execution models",
    prompt:
      "Which trading mechanism allows exchanges to operate without a centralized order matcher?",
    content: {
      type: "visual",
      left: { componentId: "OrderBookTrading" },
      right: { componentId: "AmmCurve" },
    },
    correctSide: "right",
    explanationCorrect:
      "AMMs replace centralized order matching with a mathematical formula and liquidity pools. Anyone can trade at any time without an intermediary, and anyone can earn fees by providing liquidity. This removes the trust requirement and single point of failure inherent in centralized exchanges.",
    explanationWrong:
      "Order books work well but require a trusted operator to run the matching engine. That operator can front-run trades, halt markets, or restrict access. AMMs achieve decentralized trading at the cost of slippage on large orders, but they eliminate the need to trust a centralized party.",
    sourceUrl: "https://docs.uniswap.org/concepts/introduction/what-is-uniswap",
    sourceLabel: "Uniswap Docs: What is Uniswap",
  },
  {
    id: "df-002",
    category: "defi",
    difficulty: "medium",
    title: "Liquidity pools",
    prompt:
      "Which liquidity provision model better accounts for the risk providers actually face?",
    content: {
      type: "visual",
      left: { componentId: "SingleSidedLiquidity" },
      right: { componentId: "PooledLiquidity" },
    },
    correctSide: "right",
    explanationCorrect:
      "Impermanent loss occurs because AMM pools automatically rebalance as prices move, effectively selling appreciated assets and buying depreciating ones. A profitable liquidity position requires that trading fees exceed this impermanent loss. Understanding this trade-off is essential before committing capital.",
    explanationWrong:
      "Looking at fees alone gives a misleadingly positive picture. Impermanent loss is the hidden cost of liquidity provision. For volatile asset pairs, this loss can easily exceed fee income. Many liquidity providers have lost money without realizing it because they only tracked their fee earnings.",
    sourceUrl:
      "https://docs.uniswap.org/concepts/introduction/liquidity-user-guide",
    sourceLabel: "Uniswap Docs: Liquidity User Guide",
  },
  {
    id: "df-003",
    category: "defi",
    difficulty: "medium",
    title: "Lending protocols",
    prompt:
      "Which lending model allows borrowing without trusting a centralized institution?",
    content: {
      type: "visual",
      left: { componentId: "BankLending" },
      right: { componentId: "ProtocolLending" },
    },
    correctSide: "right",
    explanationCorrect:
      "DeFi lending replaces credit checks and human approval with overcollateralization and automated liquidation. Loans are granted instantly to anyone with sufficient collateral, regardless of identity or geography. The smart contract enforces repayment mathematically, eliminating the need for collections or courts.",
    explanationWrong:
      "Traditional lending requires extensive trust infrastructure: credit bureaus, identity verification, legal enforcement. This excludes billions of people worldwide who lack credit history or identity documents. DeFi's collateral-based model trades this for capital inefficiency (overcollateralization) but provides permissionless access.",
    sourceUrl: "https://docs.aave.com/faq/",
    sourceLabel: "Aave Docs: FAQ",
  },
  {
    id: "df-004",
    category: "defi",
    difficulty: "hard",
    title: "Yield farming risks",
    prompt:
      "Which yield farming evaluation approach better protects against common pitfalls?",
    content: {
      type: "visual",
      left: { componentId: "SimpleStaking" },
      right: { componentId: "YieldFarmStack" },
    },
    correctSide: "right",
    explanationCorrect:
      "Sustainable yield in DeFi comes from real economic activity: trading fees, lending interest, or liquidation penalties. Extremely high APYs are almost always funded by token emissions that dilute value faster than rewards accumulate. Evaluating the source of yield, contract security, and team credibility is essential before committing funds.",
    explanationWrong:
      "Chasing headline APY numbers without understanding the source is the most common way to lose money in DeFi. If the yield comes from printing new tokens, you are being paid in an asset that is constantly being devalued. Many yield farms with astronomical rates have ended in total loss for depositors.",
    sourceUrl: "https://www.investopedia.com/terms/y/yield-farming.asp",
    sourceLabel: "Investopedia: Yield Farming",
  },
];
