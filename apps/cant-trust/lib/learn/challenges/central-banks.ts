import type { Challenge } from "../types";

export const centralBanksChallenges: Challenge[] = [
  {
    id: "cb-001",
    category: "central-banks",
    difficulty: "easy",
    title: "Interest rate mechanism",
    prompt:
      "Which interest rate environment makes borrowing cheaper and encourages more spending?",
    content: {
      type: "visual",
      left: { componentId: "LowInterestRate" },
      right: { componentId: "HighInterestRate" },
    },
    correctSide: "left",
    explanationCorrect:
      "Low interest rates reduce the cost of borrowing, encouraging consumers and businesses to take on more debt. This stimulates short-term economic activity but also inflates asset prices and punishes savers. Central banks use rate cuts as their primary tool during recessions, but prolonged low rates create dependency and distort capital allocation.",
    explanationWrong:
      "High interest rates make borrowing expensive, which slows spending and cools inflation. While this sounds painful, higher rates also reward savers and encourage more careful investment decisions. The tension between these two modes is at the heart of central bank policy.",
    sourceUrl: "https://www.federalreserve.gov/monetarypolicy/openmarket.htm",
    sourceLabel: "Federal Reserve: Open Market Operations",
  },
  {
    id: "cb-002",
    category: "central-banks",
    difficulty: "medium",
    title: "Quantitative easing",
    prompt:
      "Which scenario shows the effect of a central bank purchasing financial assets with newly created money?",
    content: {
      type: "visual",
      left: { componentId: "NormalMoneySupply" },
      right: { componentId: "QEExpansion" },
    },
    correctSide: "right",
    explanationCorrect:
      "Quantitative easing (QE) is when a central bank creates new money to buy government bonds and other financial assets. This expands the money supply, lowers long-term interest rates, and pushes investors into riskier assets. The Fed's balance sheet grew from $900 billion in 2008 to over $8.9 trillion by 2022, representing an enormous expansion of base money.",
    explanationWrong:
      "A stable money supply reflects an economy where the central bank is not actively intervening through asset purchases. In a QE environment, the new money flows first to financial institutions and asset holders, raising stock and real estate prices before (if ever) reaching the broader economy. This is the Cantillon effect in action.",
    sourceUrl:
      "https://www.federalreserve.gov/monetarypolicy/bst_recenttrends.htm",
    sourceLabel: "Federal Reserve: Recent Balance Sheet Trends",
  },
  {
    id: "cb-003",
    category: "central-banks",
    difficulty: "medium",
    title: "Money supply metrics",
    prompt:
      "Which way of measuring money gives a more complete picture of the total money supply?",
    content: {
      type: "visual",
      left: { componentId: "SimpleMoney" },
      right: { componentId: "MoneyLayers" },
    },
    correctSide: "right",
    explanationCorrect:
      "Money exists in layers of decreasing liquidity. M0 is physical currency and bank reserves. M1 adds checking accounts. M2 adds savings accounts and money market funds. M3 (no longer published by the Fed) included large time deposits and institutional funds. Understanding these layers reveals that most 'money' is actually credit created by commercial banks, not printed by the government.",
    explanationWrong:
      "Viewing money as a single, simple quantity misses the critical distinction between base money and credit money. The vast majority of what we call money is M2 and beyond, created through bank lending. When people say 'the government printed money,' they usually mean the central bank expanded the monetary base, which is only a fraction of the total supply.",
    sourceUrl: "https://www.federalreserve.gov/releases/h6/current/",
    sourceLabel: "Federal Reserve: Money Stock Measures",
  },
  {
    id: "cb-004",
    category: "central-banks",
    difficulty: "medium",
    title: "Currency debasement",
    prompt:
      "Which coinage practice better preserves the purchasing power of money over time?",
    content: {
      type: "visual",
      left: { componentId: "HonestCoinage" },
      right: { componentId: "DebasedCoinage" },
    },
    correctSide: "left",
    explanationCorrect:
      "Honest coinage maintains its stated metal content, preserving purchasing power across generations. When a Roman denarius contained its full weight of silver, prices remained relatively stable for centuries. Debasement, mixing in cheaper metals while keeping the face value, is one of the oldest forms of inflation and has been practiced by governments for over two thousand years.",
    explanationWrong:
      "Debased coinage allows rulers to mint more coins from the same amount of precious metal, effectively taxing holders through dilution. The Roman Empire progressively reduced the silver content of the denarius from 95% to less than 5% over three centuries. Prices rose accordingly, and trust in the currency collapsed.",
    sourceUrl: "https://www.econlib.org/library/Enc/Inflation.html",
    sourceLabel: "EconLib: Inflation",
  },
  {
    id: "cb-005",
    category: "central-banks",
    difficulty: "medium",
    title: "Why coins have ridges",
    prompt:
      "Which explanation better captures the historical reason coins were given ridged edges?",
    content: {
      type: "visual",
      left: { componentId: "CoinClipping" },
      right: { componentId: "RoyalDebasement" },
    },
    correctSide: "right",
    explanationCorrect:
      "Coin ridges were introduced to prevent citizens from clipping precious metal from coins. But the deeper insight is the double standard: rulers criminalized private debasement while continuing to debase the currency themselves through official means. Modern monetary inflation is the same principle, expanding the money supply dilutes everyone's purchasing power, but only the issuer benefits directly.",
    explanationWrong:
      "While coin clipping was a real problem that ridges solved, focusing only on the anti-counterfeiting measure misses the larger pattern. Governments have always reserved the exclusive right to debase the currency. The ridges protected the government's monopoly on monetary dilution, not the citizens' purchasing power.",
    sourceUrl: "https://www.usmint.gov/learn/history/fun-facts",
    sourceLabel: "US Mint: Fun Facts About Coins",
  },
  {
    id: "cb-006",
    category: "central-banks",
    difficulty: "hard",
    title: "The political blind spot",
    prompt:
      "Which proposed solution addresses the root cause of widening economic inequality?",
    content: {
      type: "visual",
      left: { componentId: "PoliticalDebate" },
      right: { componentId: "MonetaryRootCause" },
    },
    correctSide: "right",
    explanationCorrect:
      "Both mainstream political positions debate how to distribute wealth without questioning the monetary system that concentrates it. Since 1971, money creation has disproportionately benefited asset holders over wage earners. The Cantillon effect means new money reaches Wall Street before Main Street. Until the money itself is fixed, redistribution and growth policies both treat symptoms while the cause accelerates.",
    explanationWrong:
      "The left focuses on redistribution and the right focuses on production, but both assume the monetary system is neutral. It is not. When central banks create trillions in new money, it flows first to financial institutions and inflates asset prices. Those who own assets get richer. Those who earn wages fall behind. The money is the root issue neither side addresses.",
    sourceUrl: "https://wtfhappenedin1971.com/",
    sourceLabel: "WTF Happened in 1971?",
  },
];
