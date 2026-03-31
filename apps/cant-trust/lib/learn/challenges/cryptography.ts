import type { Challenge } from "../types";

export const cryptographyChallenges: Challenge[] = [
  {
    id: "cr-001",
    category: "cryptography",
    difficulty: "easy",
    title: "Hash function properties",
    prompt:
      "Which hash function design makes it practical to verify data integrity?",
    content: {
      type: "visual",
      left: { componentId: "HashWeak" },
      right: { componentId: "HashStrong" },
    },
    correctSide: "right",
    explanationCorrect:
      "A cryptographic hash function must be deterministic (same input always gives same output), fast to compute, and practically irreversible. These properties let anyone verify that data has not been tampered with by simply re-hashing and comparing. SHA-256, used in Bitcoin, produces a fixed 256-bit output regardless of input size.",
    explanationWrong:
      "A weak or reversible hash defeats the purpose of data integrity checks. If an attacker can reverse the hash to find the original input, or if the same input sometimes produces different outputs, the hash cannot serve as a reliable fingerprint for data verification.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Glossary/Cryptographic_hash_function",
    sourceLabel: "MDN: Cryptographic Hash Function",
  },
  {
    id: "cr-002",
    category: "cryptography",
    difficulty: "easy",
    title: "Public and private key pairs",
    prompt:
      "Which key exchange model allows two strangers to communicate securely without a shared secret?",
    content: {
      type: "visual",
      left: { componentId: "KeySharedSecret" },
      right: { componentId: "KeyPairAsymmetric" },
    },
    correctSide: "right",
    explanationCorrect:
      "Asymmetric cryptography uses mathematically linked key pairs. Anyone can encrypt a message with the recipient's public key, but only the recipient's private key can decrypt it. This solves the key distribution problem: you never need to share a secret over an insecure channel.",
    explanationWrong:
      "Symmetric encryption requires both parties to already share a secret key. This creates a chicken-and-egg problem: how do you securely share the key in the first place? Over the internet, where strangers transact constantly, this approach does not scale without asymmetric cryptography to bootstrap the connection.",
    sourceUrl: "https://en.wikipedia.org/wiki/Public-key_cryptography",
    sourceLabel: "Wikipedia: Public-key Cryptography",
  },
  {
    id: "cr-003",
    category: "cryptography",
    difficulty: "medium",
    title: "Digital signatures",
    prompt:
      "Which method lets a recipient verify both the sender's identity and that the message was not altered?",
    content: {
      type: "visual",
      left: { componentId: "SignatureUnsigned" },
      right: { componentId: "SignatureSigned" },
    },
    correctSide: "right",
    explanationCorrect:
      "A digital signature is created by hashing a message and encrypting that hash with the sender's private key. The recipient decrypts the signature with the sender's public key and compares the hash. If they match, the message is authentic and unaltered. This is how Bitcoin transactions prove ownership without revealing private keys.",
    explanationWrong:
      "Without a digital signature, there is no way to verify who sent a message or whether it was modified in transit. An attacker could change a payment amount, forge the sender, or replay an old message. Digital signatures provide authentication, integrity, and non-repudiation in a single mechanism.",
    sourceUrl: "https://en.wikipedia.org/wiki/Digital_signature",
    sourceLabel: "Wikipedia: Digital Signature",
  },
  {
    id: "cr-004",
    category: "cryptography",
    difficulty: "medium",
    title: "Merkle trees",
    prompt:
      "Which data structure allows efficient verification that a single transaction is included in a large set?",
    content: {
      type: "visual",
      left: { componentId: "MerkleFlat" },
      right: { componentId: "MerkleTree" },
    },
    correctSide: "right",
    explanationCorrect:
      "A Merkle tree hashes pairs of data recursively until a single root hash remains. To prove a transaction is included, you only need to provide the sibling hashes along the path to the root, not the entire dataset. This makes verification logarithmic: proving inclusion in a block of 1,000 transactions requires only about 10 hashes.",
    explanationWrong:
      "A flat list of hashes requires checking every entry to verify inclusion. If the block contains 1,000 transactions, you must download and hash all 1,000. Merkle trees reduce this to roughly log2(n) hashes, which is why they are used in Bitcoin, Ethereum, and nearly every blockchain.",
    sourceUrl: "https://en.wikipedia.org/wiki/Merkle_tree",
    sourceLabel: "Wikipedia: Merkle Tree",
  },
  {
    id: "cr-005",
    category: "cryptography",
    difficulty: "hard",
    title: "Zero-knowledge proofs",
    prompt:
      "Which proof method allows someone to demonstrate knowledge without revealing the knowledge itself?",
    content: {
      type: "visual",
      left: { componentId: "ZkpRevealAll" },
      right: { componentId: "ZkpZeroKnowledge" },
    },
    correctSide: "right",
    explanationCorrect:
      "A zero-knowledge proof lets a prover convince a verifier that a statement is true without revealing any information beyond the truth of the statement. For example, you can prove you are over 18 without revealing your birthdate, or prove you have sufficient funds without revealing your balance. This technology underpins privacy-focused blockchains and scaling solutions like zk-rollups.",
    explanationWrong:
      "Revealing all information to prove a claim works but destroys privacy. If you must show your entire bank statement to prove you can afford a purchase, you expose far more than necessary. Zero-knowledge proofs solve this by mathematically proving statements without disclosing the underlying data.",
    sourceUrl: "https://ethereum.org/en/zero-knowledge-proofs/",
    sourceLabel: "Ethereum.org: Zero-Knowledge Proofs",
  },
];
