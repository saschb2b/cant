import type { BaseChallenge } from "../../game/types";

export const settlementChallenges: BaseChallenge[] = [
  {
    id: "se-001",
    category: "settlement",
    difficulty: "easy",
    title: "Settlement finality timing",
    prompt:
      "Which settlement model gives the sender certainty that a payment is complete sooner?",
    content: {
      type: "visual",
      left: { componentId: "SettlementT0" },
      right: { componentId: "SettlementT2" },
    },
    correctSide: "left",
    explanationCorrect:
      "T+0 settlement means the transaction is final immediately. The sender knows the payment is complete with no risk of reversal or failure. T+2 settlement, used in traditional stock and bond markets, means final settlement occurs two business days later. During that gap, both parties face counterparty risk: the other side might fail to deliver before settlement completes.",
    explanationWrong:
      "T+2 settlement introduces a two-day window where the transaction is pending but not final. During this period, either party could default, the intermediary could fail, or market conditions could change. This delay exists because legacy systems rely on batch processing and multiple intermediaries to reconcile their books. It is a limitation of infrastructure, not a feature.",
    sourceUrl: "https://www.sec.gov/rules/final/2023/34-97142.pdf",
    sourceLabel: "SEC: Shortening the Securities Transaction Settlement Cycle",
  },
  {
    id: "se-002",
    category: "settlement",
    difficulty: "medium",
    title: "Wire transfer anatomy",
    prompt:
      "Which wire transfer path involves fewer intermediaries between sender and receiver?",
    content: {
      type: "visual",
      left: { componentId: "WireTransferDirect" },
      right: { componentId: "WireTransferChain" },
    },
    correctSide: "left",
    explanationCorrect:
      "A direct wire transfer moves funds straight from sender to receiver with minimal intermediaries. In reality, most wire transfers pass through multiple correspondent banks, each adding processing time, fees, and potential points of failure. A domestic wire in the US often takes hours, and international wires can take 1-5 business days due to the chain of intermediaries involved.",
    explanationWrong:
      "The multi-hop wire transfer chain is the current reality of international payments. Each bank in the chain must verify the transaction, check compliance requirements, and update its own ledger before passing the payment along. Fees accumulate at each hop, often totaling 3-7% for international transfers. Each intermediary also represents a point where the transfer can be delayed or blocked.",
    sourceUrl:
      "https://www.swift.com/about-us/discover-swift/messaging-standards",
    sourceLabel: "SWIFT: Messaging Standards",
  },
  {
    id: "se-003",
    category: "settlement",
    difficulty: "medium",
    title: "Remittance costs",
    prompt:
      "Which remittance corridor charges lower fees for workers sending money home to their families?",
    content: {
      type: "visual",
      left: { componentId: "RemittanceCheap" },
      right: { componentId: "RemittanceExpensive" },
    },
    correctSide: "left",
    explanationCorrect:
      "Low-cost remittance corridors charge 1-3% in fees, but these are the exception. The global average cost of sending $200 is around 6.2%, and many corridors in Sub-Saharan Africa exceed 8-9%. For migrant workers sending $200-500 per month, these fees represent a significant portion of their income. The high costs stem from regulatory compliance overhead, correspondent banking chains, and lack of competition.",
    explanationWrong:
      "High-cost remittance corridors disproportionately affect the world's poorest workers. A migrant worker sending $200 home through an 8% corridor loses $16 to intermediaries. Over a year of monthly remittances, that is $192 in fees, nearly a full month of transfers lost to the system. The World Bank's target is to bring the global average below 3%, a goal that remains unmet after decades of effort.",
    sourceUrl: "https://remittanceprices.worldbank.org/",
    sourceLabel: "World Bank: Remittance Prices Worldwide",
  },
  {
    id: "se-004",
    category: "settlement",
    difficulty: "hard",
    title: "Netting vs gross settlement",
    prompt:
      "Which settlement approach requires less total liquidity to process the same volume of payments?",
    content: {
      type: "visual",
      left: { componentId: "NettingGross" },
      right: { componentId: "NettingBilateral" },
    },
    correctSide: "right",
    explanationCorrect:
      "Netting consolidates multiple payments between parties and settles only the net difference. If Bank A owes Bank B $10 million and Bank B owes Bank A $8 million, only $2 million actually moves. This dramatically reduces the liquidity needed to settle all obligations. Real-time gross settlement (RTGS) processes each payment individually, requiring far more liquidity but providing immediate finality for each transaction.",
    explanationWrong:
      "Gross settlement processes every transaction individually at full value, requiring banks to maintain large reserve balances. While this provides certainty for each payment, it ties up enormous amounts of capital. Netting reduces the total value that must move but introduces credit risk during the netting period. The tradeoff between efficiency and risk is central to payment system design.",
    sourceUrl: "https://www.bis.org/cpmi/publ/d105.pdf",
    sourceLabel: "BIS: Principles for Financial Market Infrastructures",
  },
];
