import type { Challenge } from "../types";

export const cbdcsChallenges: Challenge[] = [
  {
    id: "cd-001",
    category: "cbdcs",
    difficulty: "easy",
    title: "CBDC vs cryptocurrency",
    prompt:
      "Which digital currency model gives the issuer control over individual transactions?",
    content: {
      type: "visual",
      left: { componentId: "CbdcCentralized" },
      right: { componentId: "CryptoDecentralized" },
    },
    correctSide: "right",
    explanationCorrect:
      "Cryptocurrency is governed by transparent protocol rules rather than institutional discretion. No central authority can freeze accounts, impose spending restrictions, or change the supply schedule. Users control their own keys and can transact without permission from any third party.",
    explanationWrong:
      "CBDCs give central banks unprecedented control over individual financial activity. Unlike physical cash, digital currency can be programmed with restrictions, monitored in real-time, and revoked remotely. While pitched as 'modernization,' CBDCs represent a significant expansion of government financial surveillance capabilities.",
    sourceUrl: "https://www.bis.org/about/bisih/topics/cbdc.htm",
    sourceLabel: "BIS: Central Bank Digital Currencies",
  },
  {
    id: "cd-002",
    category: "cbdcs",
    difficulty: "easy",
    title: "Programmable restrictions",
    prompt:
      "Which money system allows the issuer to dictate how and when you can spend?",
    content: {
      type: "visual",
      left: { componentId: "ProgrammableMoney" },
      right: { componentId: "FreeMoney" },
    },
    correctSide: "right",
    explanationCorrect:
      "Non-programmable money treats all holders equally and places no restrictions on how it is spent. This is a fundamental property of sound money: it is fungible, universal, and controlled by its holder. Programmable restrictions turn money from a tool of freedom into a tool of control.",
    explanationWrong:
      "Programmable money gives the issuer granular control over every transaction. While proponents argue it could prevent fraud or enforce policy, the same mechanism enables authoritarian restrictions on purchasing categories, geographic movement, and saving behavior. This transforms money from a neutral medium into a behavioral control mechanism.",
    sourceUrl: "https://www.coindesk.com/learn/what-is-a-cbdc/",
    sourceLabel: "CoinDesk: What is a CBDC?",
  },
  {
    id: "cd-003",
    category: "cbdcs",
    difficulty: "medium",
    title: "Financial surveillance",
    prompt:
      "Which monetary system gives authorities the ability to monitor all transactions in real-time?",
    content: {
      type: "visual",
      left: { componentId: "DigitalSurveillance" },
      right: { componentId: "CashPrivacy" },
    },
    correctSide: "right",
    explanationCorrect:
      "Cash and cryptocurrency preserve financial privacy as a default. Authorities can still investigate specific suspects through traditional means, but mass surveillance of all transactions is not possible. This protects lawful activity from chilling effects and preserves the presumption of innocence.",
    explanationWrong:
      "A CBDC with full visibility creates a comprehensive surveillance infrastructure. While the stated purpose is combating crime, the same system can monitor lawful but sensitive activities: political donations, religious contributions, therapy payments, or purchases of controversial books. The chilling effect on legal behavior is a form of soft censorship.",
    sourceUrl:
      "https://www.eff.org/deeplinks/2022/03/defending-financial-privacy-age-cbdcs",
    sourceLabel: "EFF: Defending Financial Privacy in the Age of CBDCs",
  },
  {
    id: "cd-004",
    category: "cbdcs",
    difficulty: "medium",
    title: "Social credit integration",
    prompt:
      "Which monetary system is resistant to being integrated with a social scoring mechanism?",
    content: {
      type: "visual",
      left: { componentId: "ScoreBasedAccess" },
      right: { componentId: "UnrestrictedAccess" },
    },
    correctSide: "right",
    explanationCorrect:
      "Decentralized cryptocurrency validates transactions based solely on cryptographic signatures and balance sufficiency. There is no mechanism to integrate social scores, behavioral criteria, or identity-based restrictions. The protocol treats all valid transactions equally, making it structurally resistant to authoritarian control.",
    explanationWrong:
      "A CBDC under centralized control can be integrated with any government database, including social credit scores. China's social credit system already restricts travel and services based on behavior scores. Linking this to programmable money would create the most powerful behavioral control system in history.",
    sourceUrl:
      "https://www.hrw.org/news/2019/05/01/chinas-global-threat-privacy",
    sourceLabel: "Human Rights Watch: China's Global Threat to Privacy",
  },
  {
    id: "cd-005",
    category: "cbdcs",
    difficulty: "hard",
    title: "The cash elimination agenda",
    prompt:
      "Which monetary system preserves the ability to transact without digital intermediaries?",
    content: {
      type: "visual",
      left: { componentId: "CashlessTrapped" },
      right: { componentId: "CashAsExit" },
    },
    correctSide: "right",
    explanationCorrect:
      "Maintaining multiple payment methods, including physical cash and cryptocurrency, ensures that no single entity can completely exclude someone from the economy. Financial diversity provides resilience against system failures, overreach, and emergencies. A cashless CBDC-only world creates total dependence on centralized digital infrastructure.",
    explanationWrong:
      "Eliminating cash removes the last form of money that works without permission, identity verification, or digital infrastructure. In a CBDC-only system, a frozen wallet means complete financial exclusion. This gives the issuing authority life-or-death power over individuals, with no fallback option available.",
    sourceUrl:
      "https://www.imf.org/en/Topics/fintech/central-bank-digital-currency",
    sourceLabel: "IMF: Central Bank Digital Currency",
  },
];
