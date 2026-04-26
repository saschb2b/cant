import type { BaseChallenge } from "../../game/types";

export const bankingMechanicsChallenges: BaseChallenge[] = [
  {
    id: "bm-001",
    category: "banking-mechanics",
    difficulty: "easy",
    title: "Reserve models",
    prompt:
      "Which banking model ensures that every depositor can withdraw their funds at the same time?",
    content: {
      type: "visual",
      left: { componentId: "FullReserveBank" },
      right: { componentId: "FractionalReserveBank" },
    },
    correctSide: "left",
    explanationCorrect:
      "Full reserve banking keeps 100% of deposits on hand, so every depositor can withdraw simultaneously without the bank running short. This model eliminates the risk of a bank run because the bank never lends out deposited funds. The tradeoff is that banks cannot earn interest income by lending deposits.",
    explanationWrong:
      "Fractional reserve banking lends out a portion of deposits, meaning only a fraction is available for withdrawal at any given time. If too many depositors demand their money at once, the bank cannot pay. This is the structural vulnerability that makes bank runs possible.",
    sourceUrl:
      "https://www.investopedia.com/terms/f/fractionalreservebanking.asp",
    sourceLabel: "Investopedia: Fractional Reserve Banking",
  },
  {
    id: "bm-002",
    category: "banking-mechanics",
    difficulty: "easy",
    title: "What a deposit really is",
    prompt:
      "Which description more accurately reflects the legal relationship between you and your bank when you make a deposit?",
    content: {
      type: "visual",
      left: { componentId: "DepositAsProperty" },
      right: { componentId: "DepositAsIOU" },
    },
    correctSide: "right",
    explanationCorrect:
      "When you deposit money, it legally becomes the bank's property. You receive an IOU, a promise from the bank to pay you back on demand. You are an unsecured creditor of the bank, not an owner of the cash sitting in a vault. This distinction matters enormously during a bank failure.",
    explanationWrong:
      "Most people assume their deposit is stored safely in a vault with their name on it. In reality, the bank takes ownership the moment you deposit. What you hold is a claim, and that claim ranks below secured creditors if the bank becomes insolvent.",
    sourceUrl: "https://www.investopedia.com/terms/d/demand-deposit.asp",
    sourceLabel: "Investopedia: Demand Deposit",
  },
  {
    id: "bm-003",
    category: "banking-mechanics",
    difficulty: "medium",
    title: "Money creation through lending",
    prompt:
      "Which model correctly shows how commercial banks affect the total money supply when they issue loans?",
    content: {
      type: "visual",
      left: { componentId: "SingleDeposit" },
      right: { componentId: "MoneyMultiplier" },
    },
    correctSide: "right",
    explanationCorrect:
      "When a bank issues a loan, it creates new money by crediting the borrower's account. That new money gets deposited elsewhere, enabling further lending. A single $1,000 deposit can result in $10,000 of total money in the system with a 10% reserve requirement. Most of the money in circulation is created this way, not by printing physical cash.",
    explanationWrong:
      "If banks could only lend existing deposits without the multiplier effect, the money supply would remain fixed at the amount of base money created by the central bank. In reality, commercial bank lending is the primary mechanism of money creation in modern economies.",
    sourceUrl:
      "https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy",
    sourceLabel: "Bank of England: Money Creation in the Modern Economy",
  },
  {
    id: "bm-004",
    category: "banking-mechanics",
    difficulty: "medium",
    title: "Rehypothecation",
    prompt:
      "Which scenario better protects the original owner of a pledged asset?",
    content: {
      type: "visual",
      left: { componentId: "SingleClaim" },
      right: { componentId: "MultipleClaims" },
    },
    correctSide: "left",
    explanationCorrect:
      "When an asset has only a single claim against it, the owner's rights are clear and enforceable. Rehypothecation, where a bank re-pledges collateral that was pledged to it, creates multiple claims on the same asset. If the chain collapses, most claimants discover their collateral no longer exists.",
    explanationWrong:
      "Rehypothecation creates a chain of claims where the same asset backs multiple obligations simultaneously. This increases systemic risk because a single default can cascade through the chain. During the 2008 financial crisis, Lehman Brothers' rehypothecation of client assets left many counterparties unable to recover their collateral.",
    sourceUrl: "https://www.imf.org/external/pubs/ft/wp/2010/wp10172.pdf",
    sourceLabel: "IMF: The (Sizable) Role of Rehypothecation",
  },
  {
    id: "bm-005",
    category: "banking-mechanics",
    difficulty: "hard",
    title: "Cross-border payment routing",
    prompt:
      "Which method of sending money internationally introduces fewer intermediaries and trust dependencies?",
    content: {
      type: "visual",
      left: { componentId: "DirectTransfer" },
      right: { componentId: "CorrespondentChain" },
    },
    correctSide: "left",
    explanationCorrect:
      "A direct transfer between two parties requires trusting only one counterparty. Correspondent banking chains involve multiple intermediary banks, each adding fees, delays, and counterparty risk. A payment from Kenya to the Philippines might pass through four banks across three countries, taking 3-5 days and losing 5-10% in fees.",
    explanationWrong:
      "Correspondent banking is the current reality for most international transfers. Each intermediary bank in the chain must maintain trust relationships, comply with different regulations, and reconcile its own ledger. The complexity explains why international remittances are slow, expensive, and sometimes fail entirely.",
    sourceUrl: "https://www.bis.org/cpmi/publ/d173.pdf",
    sourceLabel: "BIS: Correspondent Banking",
  },
];
