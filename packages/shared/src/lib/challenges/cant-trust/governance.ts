import type { BaseChallenge } from "../../game/types";

export const governanceChallenges: BaseChallenge[] = [
  {
    id: "gv-001",
    category: "governance",
    difficulty: "easy",
    title: "On-chain vs off-chain governance",
    prompt:
      "Which governance model makes protocol decisions transparent and verifiable?",
    content: {
      type: "visual",
      left: { componentId: "OffChainConsensus" },
      right: { componentId: "OnChainVoting" },
    },
    correctSide: "right",
    explanationCorrect:
      "On-chain governance makes every proposal, vote, and outcome transparent and permanently recorded on the blockchain. All stakeholders can participate, and results are enforced by the protocol itself. This creates accountability and legitimacy that informal off-chain processes cannot match.",
    explanationWrong:
      "Off-chain governance concentrates decision-making power in the hands of a few core developers and influential voices. Decisions are made through informal channels with no formal accountability. This can lead to contentious splits when the community disagrees with developer choices.",
    sourceUrl: "https://docs.cardano.org/about-cardano/governance/",
    sourceLabel: "Cardano Docs: Governance",
  },
  {
    id: "gv-002",
    category: "governance",
    difficulty: "medium",
    title: "Treasury systems",
    prompt:
      "Which funding model sustains protocol development without relying on external donors?",
    content: {
      type: "visual",
      left: { componentId: "DonationFunded" },
      right: { componentId: "ProtocolTreasury" },
    },
    correctSide: "right",
    explanationCorrect:
      "An on-chain treasury creates a self-sustaining funding mechanism controlled by the community. A portion of transaction fees or block rewards flows into the treasury, and token holders vote on how to allocate funds. This ensures continuous development funding without dependence on external parties with potentially misaligned incentives.",
    explanationWrong:
      "Donation-based funding creates fragile dependencies on external parties. Venture capitalists demand returns that may conflict with user interests. Corporate sponsors may push for features that benefit their products. Volunteerism is unsustainable for critical infrastructure that billions of dollars may depend on.",
    sourceUrl: "https://docs.cardano.org/about-cardano/governance/",
    sourceLabel: "Cardano Docs: Governance and Treasury",
  },
  {
    id: "gv-003",
    category: "governance",
    difficulty: "medium",
    title: "Voting mechanisms",
    prompt:
      "Which voting mechanism better prevents wealthy minorities from dominating governance?",
    content: {
      type: "visual",
      left: { componentId: "SimpleMajority" },
      right: { componentId: "StakeWeightedVoting" },
    },
    correctSide: "right",
    explanationCorrect:
      "Delegated voting (liquid democracy) allows small holders to pool their influence through trusted representatives. This counterbalances whale dominance while keeping voting stake-weighted. Delegation is always revocable, so representatives remain accountable. Cardano's DRep system implements this model.",
    explanationWrong:
      "Pure plutocratic voting inevitably concentrates governance power in the hands of the wealthiest token holders. Small holders are effectively disenfranchised because their votes are meaningless against large concentrations. Delegation mechanisms help distribute influence more broadly while maintaining the security benefits of stake-weighted voting.",
    sourceUrl: "https://docs.cardano.org/about-cardano/governance/",
    sourceLabel: "Cardano Docs: Delegated Representatives",
  },
  {
    id: "gv-004",
    category: "governance",
    difficulty: "medium",
    title: "Hard forks vs soft forks",
    prompt:
      "Which upgrade mechanism allows new features without splitting the network?",
    content: {
      type: "visual",
      left: { componentId: "HardFork" },
      right: { componentId: "SoftFork" },
    },
    correctSide: "right",
    explanationCorrect:
      "The hard fork combinator allows Cardano to introduce breaking changes through coordinated, on-chain signaling without splitting the network. Stake pool operators signal readiness, and the protocol transitions at a predetermined point. This has enabled major upgrades like adding smart contracts (Alonzo) and governance (Conway) without contentious chain splits.",
    explanationWrong:
      "Uncoordinated hard forks risk splitting the community and the chain. When nodes disagree on validity rules, two separate networks emerge, diluting security, liquidity, and developer attention. The Bitcoin/Bitcoin Cash split in 2017 demonstrated the cost of contentious hard forks.",
    sourceUrl:
      "https://docs.cardano.org/about-cardano/evolution/about-hard-forks/",
    sourceLabel: "Cardano Docs: About Hard Forks",
  },
  {
    id: "gv-005",
    category: "governance",
    difficulty: "hard",
    title: "Constitutional governance",
    prompt:
      "Which governance framework protects minority rights and protocol principles from majority override?",
    content: {
      type: "visual",
      left: { componentId: "SingleAuthority" },
      right: { componentId: "ThreePillarGovernance" },
    },
    correctSide: "right",
    explanationCorrect:
      "Constitutional governance creates a framework where certain principles cannot be overridden by simple majority vote. Cardano's on-chain constitution establishes guardrails, and a Constitutional Committee can block proposals that violate foundational principles. This three-body system (DReps, SPOs, Constitutional Committee) provides checks and balances similar to democratic nation-states.",
    explanationWrong:
      "Unconstrained majority rule is vulnerable to coordinated attacks and tyranny of the majority. Without constitutional boundaries, a 51% coalition can change any rule, including the supply cap, treasury distribution, or their own voting power. This makes the protocol's guarantees only as strong as the current majority's willingness to honor them.",
    sourceUrl: "https://docs.cardano.org/about-cardano/governance/",
    sourceLabel: "Cardano Docs: Constitutional Governance",
  },
];
