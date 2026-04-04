import type { BaseChallenge } from "../../game/types";

export const scalingChallenges: BaseChallenge[] = [
  {
    id: "sl-001",
    category: "scaling",
    difficulty: "easy",
    title: "Blockchain trilemma",
    prompt:
      "Which design philosophy acknowledges the fundamental trade-offs in blockchain architecture?",
    content: {
      type: "visual",
      left: { componentId: "CentralizedFast" },
      right: { componentId: "TrilemmaBalanced" },
    },
    correctSide: "right",
    explanationCorrect:
      "The blockchain trilemma (coined by Vitalik Buterin) states that it is very difficult to simultaneously maximize decentralization, security, and scalability. Mature blockchain designs prioritize decentralization and security at the base layer, then use Layer 2 solutions and protocol upgrades to scale without compromising the foundation.",
    explanationWrong:
      "Maximizing throughput by raising hardware requirements reduces decentralization. When only data centers can run nodes, the network can be censored, seized, or pressured by governments. This recreates the centralization problems that blockchain was designed to solve, just with a faster database.",
    sourceUrl: "https://ethereum.org/en/roadmap/vision/",
    sourceLabel: "Ethereum.org: Ethereum Vision",
  },
  {
    id: "sl-002",
    category: "scaling",
    difficulty: "easy",
    title: "Layer 1 vs Layer 2",
    prompt:
      "Which scaling approach increases throughput without increasing base layer complexity?",
    content: {
      type: "visual",
      left: { componentId: "EverythingOnL1" },
      right: { componentId: "L1PlusL2" },
    },
    correctSide: "right",
    explanationCorrect:
      "Layer 2 solutions process transactions off the main chain while inheriting its security guarantees. The base layer handles settlement and dispute resolution, while Layer 2 handles volume. This preserves decentralization at Layer 1 while enabling thousands of transactions per second at Layer 2.",
    explanationWrong:
      "Scaling Layer 1 by increasing block size or frequency is the simplest approach but has diminishing returns. Each increase raises the cost of running a node, reducing the number of independent validators. Eventually, only a few powerful entities can participate, undermining the decentralization that makes blockchain valuable.",
    sourceUrl: "https://lightning.network/",
    sourceLabel: "Lightning Network",
  },
  {
    id: "sl-003",
    category: "scaling",
    difficulty: "medium",
    title: "State channels",
    prompt:
      "Which payment channel design provides trustless off-chain transactions?",
    content: {
      type: "visual",
      left: { componentId: "EveryTxOnChain" },
      right: { componentId: "ChannelOpenClose" },
    },
    correctSide: "right",
    explanationCorrect:
      "Trustless state channels lock funds in an on-chain multisig and allow unlimited off-chain updates signed by both parties. Either party can settle on-chain at any time by submitting the latest state. The smart contract enforces fairness, so no intermediary is needed and neither party can cheat.",
    explanationWrong:
      "Using a trusted intermediary for off-chain payments recreates the exact problems of traditional finance: counterparty risk, censorship, and insolvency. State channels achieve the same speed and cost benefits while keeping trust anchored to the blockchain rather than a company.",
    sourceUrl:
      "https://ethereum.org/en/developers/docs/scaling/state-channels/",
    sourceLabel: "Ethereum.org: State Channels",
  },
  {
    id: "sl-004",
    category: "scaling",
    difficulty: "hard",
    title: "Rollups",
    prompt:
      "Which rollup design provides stronger security guarantees for off-chain execution?",
    content: {
      type: "visual",
      left: { componentId: "OptimisticRollup" },
      right: { componentId: "ZkRollup" },
    },
    correctSide: "right",
    explanationCorrect:
      "ZK rollups provide cryptographic proof that every transaction in a batch was executed correctly. The Layer 1 contract verifies this proof mathematically, so there is no need to trust any party or wait for a challenge period. This provides faster finality and stronger security guarantees than optimistic rollups.",
    explanationWrong:
      "Optimistic rollups assume transactions are valid and rely on at least one honest party to catch fraud within a 7-day window. While simpler to implement and EVM-compatible, the security model is weaker: it depends on active monitoring and introduces significant withdrawal delays. ZK rollups eliminate these trade-offs with mathematical proofs.",
    sourceUrl: "https://ethereum.org/en/developers/docs/scaling/zk-rollups/",
    sourceLabel: "Ethereum.org: ZK Rollups",
  },
];
