import type { BaseChallenge } from "../../game/types";

export const privacyChallenges: BaseChallenge[] = [
  {
    id: "pr-001",
    category: "privacy",
    difficulty: "easy",
    title: "Transparent vs shielded transactions",
    prompt:
      "Which transaction model protects the sender's financial information from public view?",
    content: {
      type: "visual",
      left: { componentId: "TransparentLedger" },
      right: { componentId: "ShieldedLedger" },
    },
    correctSide: "right",
    explanationCorrect:
      "Shielded transactions use zero-knowledge proofs to encrypt transaction details while still allowing the network to verify validity. This provides the privacy that most users expect from financial transactions: others cannot see your balance, spending patterns, or counterparties.",
    explanationWrong:
      "Transparent blockchains create a permanent public record of every transaction. While addresses are pseudonymous, chain analysis firms routinely link addresses to identities. Once linked, your entire financial history is exposed. This level of transparency exceeds even traditional banking.",
    sourceUrl: "https://z.cash/learn/what-are-zk-snarks/",
    sourceLabel: "Zcash: What are zk-SNARKs?",
  },
  {
    id: "pr-002",
    category: "privacy",
    difficulty: "medium",
    title: "Zero-knowledge proof applications",
    prompt:
      "Which compliance approach allows regulatory verification without exposing personal data?",
    content: {
      type: "visual",
      left: { componentId: "RevealAllToProve" },
      right: { componentId: "ZkProveWithout" },
    },
    correctSide: "right",
    explanationCorrect:
      "Zero-knowledge proofs enable a new paradigm for compliance: proving you satisfy regulatory requirements without revealing the underlying data. This protects individuals from data breaches while satisfying regulators. The proof is mathematically verifiable, so it is more reliable than document-based checks.",
    explanationWrong:
      "Full disclosure compliance works but creates honeypots of personal data at every checkpoint. Each entity that receives your documents becomes a data breach risk. ZK proofs solve this by separating the proof of compliance from the personal information that establishes it.",
    sourceUrl: "https://ethereum.org/en/zero-knowledge-proofs/",
    sourceLabel: "Ethereum.org: Zero-Knowledge Proofs",
  },
  {
    id: "pr-003",
    category: "privacy",
    difficulty: "medium",
    title: "Selective disclosure",
    prompt:
      "Which blockchain privacy model better balances individual privacy with regulatory needs?",
    content: {
      type: "visual",
      left: { componentId: "FullyPublicChain" },
      right: { componentId: "MidnightSplit" },
    },
    correctSide: "right",
    explanationCorrect:
      "Selective disclosure gives users privacy by default while allowing them to prove specific facts to specific parties when required. This approach satisfies regulatory needs without creating a surveillance panopticon. Midnight, built on Cardano technology, pioneers this model with ZK proofs for selective revelation.",
    explanationWrong:
      "Complete opacity makes a blockchain unusable in regulated economies. If no disclosure is possible, institutions cannot use it, governments will ban it, and legitimate users are deterred. Selective disclosure provides a pragmatic middle ground that enables both privacy and compliance.",
    sourceUrl: "https://midnight.network/",
    sourceLabel: "Midnight Network",
  },
  {
    id: "pr-004",
    category: "privacy",
    difficulty: "hard",
    title: "On-chain analytics",
    prompt:
      "Which user behavior makes it harder for chain analysis to link transactions to a real identity?",
    content: {
      type: "visual",
      left: { componentId: "PseudonymousAddresses" },
      right: { componentId: "ClusteredAddresses" },
    },
    correctSide: "right",
    explanationCorrect:
      "Using a new address for each transaction and mixing techniques like CoinJoin make it significantly harder for chain analysis to build a complete financial profile. While not perfect on transparent chains, these practices reduce the amount of information any single party can learn about your activity.",
    explanationWrong:
      "Address reuse is the single biggest privacy mistake on transparent blockchains. Once any one transaction is linked to your identity (through an exchange, merchant, or payment), every other transaction using that address is also exposed. Chain analysis firms specialize in exactly this kind of clustering.",
    sourceUrl: "https://en.bitcoin.it/wiki/Privacy",
    sourceLabel: "Bitcoin Wiki: Privacy",
  },
];
