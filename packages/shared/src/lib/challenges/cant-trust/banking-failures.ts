import type { BaseChallenge } from "../../game/types";

export const bankingFailuresChallenges: BaseChallenge[] = [
  {
    id: "bf-001",
    category: "banking-failures",
    difficulty: "easy",
    title: "Bank run dynamics",
    prompt: "Which scenario results in a more stable outcome for depositors?",
    content: {
      type: "visual",
      left: { componentId: "StableBank" },
      right: { componentId: "BankRunSimulation" },
    },
    correctSide: "left",
    explanationCorrect:
      "A stable bank maintains depositor confidence so that withdrawals remain orderly. Bank runs are self-fulfilling prophecies: once enough people fear the bank will fail, the rush to withdraw causes the very failure they feared. Even a solvent bank can collapse if it cannot liquidate assets fast enough to meet sudden demand.",
    explanationWrong:
      "Bank runs demonstrate a fundamental fragility in fractional reserve banking. Because the bank has lent out most deposits, it cannot honor all withdrawal requests simultaneously. The rational individual choice (withdraw early) produces a collectively devastating outcome. This is a classic coordination failure.",
    sourceUrl: "https://www.journals.uchicago.edu/doi/10.1086/261155",
    sourceLabel:
      "Diamond and Dybvig: Bank Runs, Deposit Insurance, and Liquidity (1983)",
  },
  {
    id: "bf-002",
    category: "banking-failures",
    difficulty: "easy",
    title: "Deposit insurance coverage",
    prompt:
      "Which model more accurately reflects how deposit insurance works in practice?",
    content: {
      type: "visual",
      left: { componentId: "FullInsurance" },
      right: { componentId: "PartialInsurance" },
    },
    correctSide: "right",
    explanationCorrect:
      "Deposit insurance covers only up to a limit, typically $250,000 in the US (FDIC). Amounts above that threshold are uninsured and may be lost in a bank failure. During the 2023 Silicon Valley Bank collapse, many businesses had deposits far exceeding the insured limit and faced potential total loss until regulators intervened.",
    explanationWrong:
      "Full insurance for all deposits regardless of amount does not exist in any major banking system. The insurance fund itself holds only a fraction of total insured deposits. If multiple large banks failed simultaneously, the fund would be insufficient without government intervention or money creation.",
    sourceUrl: "https://www.fdic.gov/resources/deposit-insurance/",
    sourceLabel: "FDIC: Deposit Insurance",
  },
  {
    id: "bf-003",
    category: "banking-failures",
    difficulty: "medium",
    title: "Bail-in mechanisms",
    prompt:
      "Which resolution method better protects depositors' funds during a bank failure?",
    content: {
      type: "visual",
      left: { componentId: "ExternalBailout" },
      right: { componentId: "DepositBailIn" },
    },
    correctSide: "left",
    explanationCorrect:
      "An external bailout uses taxpayer funds or central bank support to make depositors whole, preserving their savings. While controversial because it socializes bank losses, it at least protects individual depositors from direct loss. Bail-ins, by contrast, convert depositor funds into bank equity to recapitalize the failing institution.",
    explanationWrong:
      "Bail-ins were introduced after 2008 to avoid using taxpayer money for bank rescues. Instead, depositors above the insurance limit have their funds seized and converted to bank shares. Cyprus demonstrated this in 2013 when deposits above 100,000 euros were forcibly converted. Your savings can be used to rescue the bank that lost them.",
    sourceUrl:
      "https://www.reuters.com/article/us-eurozone-cyprus-deal-idUSBREA2P0WE20140326",
    sourceLabel: "Reuters: Cyprus Bail-In",
  },
  {
    id: "bf-004",
    category: "banking-failures",
    difficulty: "medium",
    title: "Account access restrictions",
    prompt:
      "Which scenario better describes the level of control you have over funds in your bank account?",
    content: {
      type: "visual",
      left: { componentId: "FreeAccess" },
      right: { componentId: "FrozenAccount" },
    },
    correctSide: "left",
    explanationCorrect:
      "Free access to your own funds is the ideal, but it is not guaranteed. Banks, courts, and government agencies can freeze accounts without prior notice for reasons including suspected fraud, tax disputes, divorce proceedings, or political sanctions. In these cases, you cannot access your own money until the hold is resolved.",
    explanationWrong:
      "Account freezing reveals that bank deposits are permissioned access, not ownership. In 2022, Canadian authorities froze the bank accounts of protesters and their donors without court orders. Greece imposed capital controls in 2015, limiting ATM withdrawals to 60 euros per day. Access to your money depends on third-party permission.",
    sourceUrl: "https://www.bbc.com/news/world-us-canada-60383385",
    sourceLabel: "BBC: Canada Freezes Protester Bank Accounts",
  },
  {
    id: "bf-005",
    category: "banking-failures",
    difficulty: "hard",
    title: "Financial exclusion",
    prompt:
      "Which view of global banking access more accurately reflects reality?",
    content: {
      type: "visual",
      left: { componentId: "BankedPopulation" },
      right: { componentId: "UnbankedReality" },
    },
    correctSide: "right",
    explanationCorrect:
      "Roughly 1.4 billion adults worldwide remain unbanked, lacking access to basic financial services. They cannot save securely, receive remittances cheaply, or build credit history. The barriers are often structural: no government ID, no nearby bank branch, minimum balance requirements, or political exclusion. The banking system is not universally accessible by design.",
    explanationWrong:
      "Assuming that most of the world has reliable bank access ignores the reality in developing regions. In Sub-Saharan Africa, over half of adults lack a bank account. Even in banked populations, many are underbanked, meaning they rely on expensive alternatives like check cashing services and payday lenders.",
    sourceUrl: "https://www.worldbank.org/en/publication/globalfindex",
    sourceLabel: "World Bank: Global Findex Database",
  },
];
