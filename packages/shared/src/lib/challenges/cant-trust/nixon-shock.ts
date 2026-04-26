import type { BaseChallenge } from "../../game/types";

export const nixonShockChallenges: BaseChallenge[] = [
  {
    id: "ns-001",
    category: "nixon-shock",
    difficulty: "easy",
    title: "Gold window closing",
    prompt:
      "Which monetary arrangement places a harder constraint on government spending and money creation?",
    content: {
      type: "visual",
      left: { componentId: "GoldWindowOpen" },
      right: { componentId: "GoldWindowClosed" },
    },
    correctSide: "left",
    explanationCorrect:
      "When the gold window was open, foreign governments could redeem US dollars for gold at $35 per ounce. This constrained the US from printing more dollars than it had gold to back them. When Nixon closed the window on August 15, 1971, the dollar became purely fiat, backed by nothing but government promise, and the constraint on money creation was removed.",
    explanationWrong:
      "Closing the gold window freed the government to create money without limit. While this provided short-term flexibility, it removed the discipline that gold convertibility imposed. Every fiat currency in history that lost its hard-money anchor has eventually been inflated significantly. The dollar has lost over 85% of its purchasing power since 1971.",
    sourceUrl:
      "https://www.federalreservehistory.org/essays/gold-convertibility-ends",
    sourceLabel: "Federal Reserve History: Gold Convertibility Ends",
  },
  {
    id: "ns-002",
    category: "nixon-shock",
    difficulty: "easy",
    title: "Productivity vs wages",
    prompt:
      "Which relationship between productivity and wages is healthier for workers?",
    content: {
      type: "visual",
      left: { componentId: "ProductivityWagesLinked" },
      right: { componentId: "ProductivityWagesDiverged" },
    },
    correctSide: "left",
    explanationCorrect:
      "From 1948 to 1971, productivity and wages rose together. Workers shared in the gains of economic growth. After 1971, productivity continued to rise but median wages stagnated in real terms. The gap between what workers produce and what they are paid has widened every decade since. The decoupling coincides precisely with the end of gold-backed money.",
    explanationWrong:
      "When productivity and wages diverge, the surplus value goes somewhere. Since 1971, it has flowed disproportionately to capital owners and financial asset holders. Workers produce more but buy less in real terms. This is not a coincidence. Monetary inflation erodes wages faster than employers adjust compensation.",
    sourceUrl: "https://www.epi.org/productivity-pay-gap/",
    sourceLabel: "EPI: The Productivity-Pay Gap",
  },
  {
    id: "ns-003",
    category: "nixon-shock",
    difficulty: "medium",
    title: "Gold reserves vs money supply",
    prompt:
      "Which relationship between gold reserves and money supply provides more monetary stability?",
    content: {
      type: "visual",
      left: { componentId: "GoldBackedSupply" },
      right: { componentId: "UnbackedSupply" },
    },
    correctSide: "left",
    explanationCorrect:
      "When the money supply is linked to gold reserves, expansion is limited by the physical supply of gold. This prevents governments from creating money at will and provides a natural brake on inflation. The gold standard era saw relatively stable prices over long periods, with the dollar's purchasing power roughly constant from 1800 to 1913.",
    explanationWrong:
      "An unbacked money supply can expand without physical constraint. Since 1971, the US money supply (M2) has grown from $700 billion to over $21 trillion. This expansion is only possible because there is no requirement to back dollars with gold or any other scarce asset. The result is persistent inflation and currency devaluation.",
    sourceUrl: "https://www.goldstandardinstitute.net/",
    sourceLabel: "Gold Standard Institute",
  },
  {
    id: "ns-004",
    category: "nixon-shock",
    difficulty: "medium",
    title: "Federal debt trajectory",
    prompt:
      "Which trajectory of federal debt is more sustainable for a nation's long-term fiscal health?",
    content: {
      type: "visual",
      left: { componentId: "DebtConstrained" },
      right: { componentId: "DebtExponential" },
    },
    correctSide: "left",
    explanationCorrect:
      "When debt growth is constrained, governments must balance spending with revenue. Under the gold standard, excessive borrowing was limited because creditors demanded gold-redeemable dollars. Since 1971, US federal debt has grown from $398 billion to over $34 trillion, an exponential increase enabled by the ability to print money to service debt.",
    explanationWrong:
      "Exponential debt growth is only possible when a government can create the currency in which the debt is denominated. This creates a dangerous cycle: borrow, print money to pay interest, devalue the currency, need to borrow more. The constraint of gold convertibility made this cycle impossible. Its removal made it inevitable.",
    sourceUrl: "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/",
    sourceLabel: "US Treasury: Debt to the Penny",
  },
  {
    id: "ns-005",
    category: "nixon-shock",
    difficulty: "medium",
    title: "M2 growth and wealth distribution",
    prompt:
      "Which monetary environment produces a more equitable distribution of wealth?",
    content: {
      type: "visual",
      left: { componentId: "WealthWithoutPrinting" },
      right: { componentId: "WealthWithPrinting" },
    },
    correctSide: "left",
    explanationCorrect:
      "When the money supply is stable, wealth differences reflect differences in productivity, saving, and innovation. When money is rapidly expanded, new money enters the economy through financial institutions and asset markets first. Asset owners see their wealth inflate while wage earners see their purchasing power decline. This is the Cantillon effect operating at national scale.",
    explanationWrong:
      "Rapid M2 expansion creates a wealth transfer from savers to borrowers and from wage earners to asset holders. Since 2008, the top 10% of households have captured nearly all the gains from rising asset prices, while the bottom 50% have seen their real purchasing power stagnate or decline. The money printer is not neutral.",
    sourceUrl: "https://fred.stlouisfed.org/series/M2SL",
    sourceLabel: "FRED: M2 Money Supply",
  },
  {
    id: "ns-006",
    category: "nixon-shock",
    difficulty: "medium",
    title: "Capitalism and monetary hardness",
    prompt:
      "Which type of monetary system allows capitalism to function as intended?",
    content: {
      type: "visual",
      left: { componentId: "SoftMoneyCap" },
      right: { componentId: "HardMoneyCap" },
    },
    correctSide: "right",
    explanationCorrect:
      "Capitalism requires accurate price signals, honest accounting, and consequences for bad investments. Hard money provides these by preventing artificial manipulation of the money supply. When money is sound, interest rates reflect real savings, prices reflect real supply and demand, and failed businesses actually fail instead of being bailed out with newly printed money.",
    explanationWrong:
      "Soft money capitalism distorts every signal the free market relies on. Artificially low interest rates encourage malinvestment. Bailouts reward recklessness. Asset price inflation is mistaken for genuine wealth creation. Many criticisms of capitalism are actually criticisms of what happens when the monetary foundation is unsound.",
    sourceUrl: "https://saifedean.com/thebitcoinstandard",
    sourceLabel: "Saifedean Ammous: The Bitcoin Standard (Ch. 7)",
  },
  {
    id: "ns-007",
    category: "nixon-shock",
    difficulty: "hard",
    title: "Housing affordability",
    prompt:
      "Which housing market reflects a healthier relationship between wages and home prices?",
    content: {
      type: "visual",
      left: { componentId: "HousingThen" },
      right: { componentId: "HousingNow" },
    },
    correctSide: "left",
    explanationCorrect:
      "In 1971, the median home cost roughly 2.5 times the median annual income. By the 2020s, that ratio exceeded 7 times in many markets. When money is sound, housing prices track wages because both are measured in a stable unit. When money is debased, hard assets like real estate absorb the excess liquidity and become unaffordable for wage earners.",
    explanationWrong:
      "Today's housing market reflects decades of monetary expansion. Low interest rates fuel mortgage lending, which drives up home prices. Wages, however, do not benefit equally from money creation. The result is that each generation must work significantly more hours to afford the same house. This is not a natural market outcome but a monetary policy consequence.",
    sourceUrl: "https://wtfhappenedin1971.com/",
    sourceLabel: "WTF Happened in 1971?",
  },
  {
    id: "ns-008",
    category: "nixon-shock",
    difficulty: "hard",
    title: "Household savings capacity",
    prompt:
      "Which scenario better reflects the purchasing power of a single household income over time?",
    content: {
      type: "visual",
      left: { componentId: "SingleIncomeSufficient" },
      right: { componentId: "DualIncomeRequired" },
    },
    correctSide: "left",
    explanationCorrect:
      "In the 1960s, a single income could support a family, buy a home, and build savings. Today, many households require two incomes just to maintain a similar standard of living, with less savings. This is not because workers are less productive. Productivity has more than doubled. The difference is that monetary debasement has eroded the purchasing power of each dollar earned.",
    explanationWrong:
      "The shift from single-income sufficiency to dual-income necessity happened gradually over decades and is often attributed to lifestyle inflation or rising expectations. But the data shows that core costs (housing, education, healthcare) have risen far faster than wages since 1971. Two incomes now buy what one income used to, which is a direct consequence of currency debasement.",
    sourceUrl:
      "https://www.pewresearch.org/social-trends/2015/11/04/raising-kids-and-running-a-household-how-working-parents-share-the-load/",
    sourceLabel: "Pew Research: Dual-Income Households",
  },
];
