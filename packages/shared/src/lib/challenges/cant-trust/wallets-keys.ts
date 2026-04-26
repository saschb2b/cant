import type { BaseChallenge } from "../../game/types";

export const walletsKeysChallenges: BaseChallenge[] = [
  {
    id: "wk-001",
    category: "wallets-keys",
    difficulty: "easy",
    title: "Custodial vs non-custodial wallets",
    prompt: "Which wallet type gives the user full control over their funds?",
    content: {
      type: "visual",
      left: { componentId: "CustodialWallet" },
      right: { componentId: "NonCustodialWallet" },
    },
    correctSide: "right",
    explanationCorrect:
      "A non-custodial wallet means you hold your own private keys and no third party can prevent you from transacting. This is the fundamental promise of cryptocurrency: self-sovereign ownership. The trade-off is personal responsibility for key management and backup.",
    explanationWrong:
      "Custodial wallets recreate the same trust dependency that cryptocurrency was designed to eliminate. When an exchange holds your keys, you are trusting them exactly like you trust a bank. The collapses of Mt. Gox and FTX demonstrated the catastrophic risk of custodial solutions.",
    sourceUrl: "https://bitcoin.org/en/secure-your-wallet",
    sourceLabel: "Bitcoin.org: Secure Your Wallet",
  },
  {
    id: "wk-002",
    category: "wallets-keys",
    difficulty: "medium",
    title: "HD wallet derivation",
    prompt:
      "Which wallet structure makes it practical to manage many addresses from a single backup?",
    content: {
      type: "visual",
      left: { componentId: "SingleKeyReuse" },
      right: { componentId: "HdDerivation" },
    },
    correctSide: "right",
    explanationCorrect:
      "HD wallets derive an entire tree of key pairs from a single master seed. This means one 12 or 24-word mnemonic phrase backs up unlimited future addresses. The derivation is deterministic: the same seed always produces the same sequence of keys, making wallet recovery straightforward.",
    explanationWrong:
      "Managing independent keys does not scale. Each new address requires a new backup, and losing any single key file means losing the associated funds permanently. HD wallets solved this by introducing a hierarchical derivation structure standardized in BIP-32 and BIP-44.",
    sourceUrl: "https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki",
    sourceLabel: "BIP-32: Hierarchical Deterministic Wallets",
  },
  {
    id: "wk-003",
    category: "wallets-keys",
    difficulty: "medium",
    title: "Seed phrase security",
    prompt:
      "Which seed phrase storage method better protects against both theft and loss?",
    content: {
      type: "visual",
      left: { componentId: "RawKeyStorage" },
      right: { componentId: "BipMnemonic" },
    },
    correctSide: "right",
    explanationCorrect:
      "Offline physical storage eliminates the entire digital attack surface. Malware, cloud breaches, and SIM swaps cannot reach a metal plate in a safe. Splitting the phrase across locations adds redundancy against physical theft while maintaining recoverability. This is the recommended approach for significant holdings.",
    explanationWrong:
      "Storing seed phrases digitally is convenient but creates numerous attack vectors. Any device connected to the internet is a potential entry point for malware. Cloud backups can be accessed through compromised accounts. The irreversibility of cryptocurrency transactions makes digital storage a high-risk choice for seed phrases.",
    sourceUrl: "https://bitcoin.org/en/secure-your-wallet",
    sourceLabel: "Bitcoin.org: Secure Your Wallet",
  },
  {
    id: "wk-004",
    category: "wallets-keys",
    difficulty: "hard",
    title: "Multisig setups",
    prompt:
      "Which key management approach better protects high-value holdings against a single point of failure?",
    content: {
      type: "visual",
      left: { componentId: "SingleSignature" },
      right: { componentId: "MultisigThreshold" },
    },
    correctSide: "right",
    explanationCorrect:
      "Multisig requires multiple keys to authorize a transaction, eliminating single points of failure. In a 2-of-3 setup, you can lose one key and still access funds, while an attacker who steals one key cannot spend anything. This is the gold standard for securing significant cryptocurrency holdings.",
    explanationWrong:
      "A single-signature wallet concentrates all risk in one key. If that key is lost, stolen, or compromised through coercion, the funds are gone with no recourse. Multisig distributes trust across multiple keys and locations, providing resilience against the most common failure modes.",
    sourceUrl: "https://en.bitcoin.it/wiki/Multi-signature",
    sourceLabel: "Bitcoin Wiki: Multi-signature",
  },
];
