import type { BaseChallenge } from "../../game/types";

export const consensusChallenges: BaseChallenge[] = [
  {
    id: "co-001",
    category: "consensus",
    difficulty: "easy",
    title: "Byzantine Generals Problem",
    prompt:
      "Which communication strategy allows generals to reach agreement even if some are traitors?",
    content: {
      type: "visual",
      left: { componentId: "ByzantineTrustAll" },
      right: { componentId: "ByzantineBFT" },
    },
    correctSide: "right",
    explanationCorrect:
      "Byzantine Fault Tolerance (BFT) allows a distributed system to reach consensus even when some participants are malicious or unreliable. By requiring a supermajority (typically 2/3+1) to agree, the system can tolerate up to 1/3 faulty nodes. This is the foundational problem that blockchain consensus mechanisms solve.",
    explanationWrong:
      "Trusting all participants blindly fails when even a single node is dishonest. In a network without BFT, one traitor can send conflicting messages to different generals, causing the group to split and act incoherently. This is exactly the problem that existed before Nakamoto consensus.",
    sourceUrl: "https://lamport.azurewebsites.net/pubs/byz.pdf",
    sourceLabel: "Lamport, Shostak, Pease: The Byzantine Generals Problem",
  },
  {
    id: "co-002",
    category: "consensus",
    difficulty: "medium",
    title: "Proof of Work",
    prompt:
      "Which block proposal mechanism makes it costly to produce invalid blocks?",
    content: {
      type: "visual",
      left: { componentId: "PowNoCost" },
      right: { componentId: "PowEnergyCost" },
    },
    correctSide: "right",
    explanationCorrect:
      "Proof of Work requires miners to expend real energy finding a hash below a target value. This cost makes it economically irrational to produce invalid blocks, because the energy is wasted if the network rejects them. The difficulty adjusts so blocks arrive roughly every 10 minutes regardless of total hash power.",
    explanationWrong:
      "Without a real-world cost attached to block production, anyone could flood the network with blocks for free. There would be no way to determine which chain is legitimate, because creating an alternative history costs nothing. Proof of Work anchors digital scarcity to physical energy expenditure.",
    sourceUrl: "https://bitcoin.org/bitcoin.pdf",
    sourceLabel: "Satoshi Nakamoto: Bitcoin Whitepaper",
  },
  {
    id: "co-003",
    category: "consensus",
    difficulty: "medium",
    title: "Proof of Stake",
    prompt:
      "Which staking mechanism better aligns validator incentives with network security?",
    content: {
      type: "visual",
      left: { componentId: "PosRandomSelection" },
      right: { componentId: "PosStakeWeighted" },
    },
    correctSide: "right",
    explanationCorrect:
      "Slashing conditions make dishonest behavior economically painful. If a validator signs conflicting blocks or goes offline, they lose a portion of their staked tokens. This creates a direct financial incentive to act honestly, because the cost of cheating exceeds the potential gain.",
    explanationWrong:
      "Without slashing, validators face no consequences for misbehavior. They can attempt double-spends or equivocate between forks risk-free. Slashing is what makes Proof of Stake secure: it ensures that attacking the network is more expensive than following the rules.",
    sourceUrl:
      "https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/",
    sourceLabel: "Ethereum.org: Proof of Stake",
  },
  {
    id: "co-004",
    category: "consensus",
    difficulty: "hard",
    title: "Nakamoto consensus vs Ouroboros",
    prompt:
      "Which consensus design provides mathematically proven security guarantees?",
    content: {
      type: "visual",
      left: { componentId: "NakamotoFinality" },
      right: { componentId: "OuroborosFinality" },
    },
    correctSide: "right",
    explanationCorrect:
      "Ouroboros was the first Proof of Stake protocol with a formal security proof published at a top cryptography conference. Its parameters are mathematically derived rather than empirically chosen. While Nakamoto consensus has proven robust in practice, Ouroboros provides provable guarantees about safety and liveness under clearly stated assumptions.",
    explanationWrong:
      "Nakamoto consensus is a breakthrough invention that works well in practice, but its security parameters (block time, confirmation depth) were chosen empirically rather than derived from formal proofs. Ouroboros demonstrates that it is possible to achieve similar security guarantees with mathematical rigor and far less energy.",
    sourceUrl:
      "https://iohk.io/en/research/library/papers/ouroboros-a-provably-secure-proof-of-stake-blockchain-protocol/",
    sourceLabel: "IOHK: Ouroboros - A Provably Secure PoS Protocol",
  },
  {
    id: "co-005",
    category: "consensus",
    difficulty: "hard",
    title: "Finality models",
    prompt:
      "Which finality model gives users certainty that their transaction cannot be reversed?",
    content: {
      type: "visual",
      left: { componentId: "FinalityProbabilistic" },
      right: { componentId: "FinalityDeterministic" },
    },
    correctSide: "right",
    explanationCorrect:
      "Deterministic finality means that once a transaction is finalized, it cannot be reversed without destroying a significant portion of staked value. This gives users and merchants absolute certainty. Probabilistic finality, while practical, only offers increasing confidence as more blocks are added, never reaching 100%.",
    explanationWrong:
      "Probabilistic finality requires users to choose a confidence threshold and wait accordingly. For small purchases, one confirmation may suffice, but large transactions may require an hour or more. Deterministic finality eliminates this guesswork by providing a clear, protocol-enforced point of no return.",
    sourceUrl:
      "https://docs.cardano.org/about-cardano/learn/consensus-explained/",
    sourceLabel: "Cardano Docs: Consensus Explained",
  },
];
