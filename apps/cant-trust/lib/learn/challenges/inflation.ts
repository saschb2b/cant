import type { Challenge } from "../types";

export const inflationChallenges: Challenge[] = [
  {
    id: "in-001",
    category: "inflation",
    difficulty: "easy",
    title: "CPI vs real-world costs",
    prompt:
      "Which measure of inflation more accurately reflects the cost increases people experience in daily life?",
    content: {
      type: "visual",
      left: { componentId: "CPIOfficialRate" },
      right: { componentId: "RealCostRate" },
    },
    correctSide: "right",
    explanationCorrect:
      "The official CPI understates real inflation by using substitution effects (replacing steak with chicken when steak gets expensive), hedonic adjustments (a more expensive computer counts as cheaper if it is faster), and by excluding volatile food and energy prices in 'core' CPI. Real-world costs for housing, education, and healthcare have risen far faster than the official 2-3% CPI suggests.",
    explanationWrong:
      "The CPI is a useful index but it is designed and adjusted by the same institutions that benefit from reporting low inflation. Lower CPI means lower cost-of-living adjustments for Social Security, lower inflation-indexed bond payouts, and less political pressure to change monetary policy. The incentives to understate inflation are significant.",
    sourceUrl: "http://www.shadowstats.com/alternate_data/inflation-charts",
    sourceLabel: "ShadowStats: Alternate Inflation Charts",
  },
  {
    id: "in-002",
    category: "inflation",
    difficulty: "easy",
    title: "Purchasing power erosion",
    prompt:
      "Which scenario better preserves the value of savings over a 50-year period?",
    content: {
      type: "visual",
      left: { componentId: "StablePurchasingPower" },
      right: { componentId: "ErodedPurchasingPower" },
    },
    correctSide: "left",
    explanationCorrect:
      "Stable purchasing power means a dollar saved today buys the same amount of goods in 50 years. Under the gold standard (1800-1913), this was approximately true. Since 1971, the dollar has lost over 85% of its purchasing power. A worker who saved $100,000 in 1971 would find it worth roughly $15,000 in today's purchasing power. Inflation is a hidden tax on savers.",
    explanationWrong:
      "Eroded purchasing power means that holding cash guarantees losing wealth over time. This forces savers into increasingly risky investments just to maintain value. The result is financialization: ordinary people must become investors not to grow wealth, but merely to avoid losing it. Sound money eliminates this forced speculation.",
    sourceUrl: "https://www.officialdata.org/us/inflation/1971",
    sourceLabel: "Official Data: US Dollar Purchasing Power Since 1971",
  },
  {
    id: "in-003",
    category: "inflation",
    difficulty: "easy",
    title: "Shrinkflation",
    prompt: "Which pricing practice is more transparent to consumers?",
    content: {
      type: "visual",
      left: { componentId: "HonestPricing" },
      right: { componentId: "ShrinkflationPricing" },
    },
    correctSide: "left",
    explanationCorrect:
      "Honest pricing raises the stated price when costs increase, making inflation visible. Shrinkflation hides inflation by keeping the price the same while reducing the quantity. A cereal box stays at $4.99 but shrinks from 16 oz to 13 oz. The per-unit cost rose 23% but most consumers never notice. This makes inflation psychologically invisible.",
    explanationWrong:
      "Shrinkflation is a response to consumer price sensitivity in an inflationary environment. Companies know that shoppers notice price increases but rarely notice quantity decreases. This strategy masks true inflation and makes it harder for consumers to make informed purchasing decisions. It is a symptom of monetary debasement, not a cause.",
    sourceUrl:
      "https://www.bls.gov/opub/btn/volume-6/pdf/the-economics-of-shrinkflation.pdf",
    sourceLabel: "BLS: The Economics of Shrinkflation",
  },
  {
    id: "in-004",
    category: "inflation",
    difficulty: "medium",
    title: "Who benefits from inflation",
    prompt: "Which group benefits most when the money supply is expanded?",
    content: {
      type: "visual",
      left: { componentId: "FirstReceivers" },
      right: { componentId: "LastReceivers" },
    },
    correctSide: "left",
    explanationCorrect:
      "The Cantillon Effect describes how new money benefits those who receive it first, primarily banks and financial institutions, at the expense of those who receive it last, primarily wage earners. First receivers spend new money at old prices. By the time it circulates to workers, prices have already adjusted upward. Inflation is a wealth transfer from the many to the few.",
    explanationWrong:
      "Last receivers of new money experience only the cost of inflation: higher prices with no corresponding increase in income. This is why inflation is often called a regressive tax. It hits the poorest hardest because they hold a larger proportion of their wealth in cash and have the least access to inflation-hedging assets.",
    sourceUrl:
      "https://fee.org/articles/the-cantillon-effect-because-of-inflation-we-re-financing-the-financiers/",
    sourceLabel: "FEE: The Cantillon Effect",
  },
  {
    id: "in-005",
    category: "inflation",
    difficulty: "medium",
    title: "Inflation as taxation",
    prompt:
      "Which form of taxation requires public approval and legislative process?",
    content: {
      type: "visual",
      left: { componentId: "ExplicitTax" },
      right: { componentId: "InflationTax" },
    },
    correctSide: "left",
    explanationCorrect:
      "Explicit taxation is transparent and subject to democratic accountability. Citizens can see what they pay, vote against representatives who raise taxes, and plan their finances accordingly. Inflation achieves the same wealth transfer, moving purchasing power from citizens to government, but without consent, visibility, or democratic process.",
    explanationWrong:
      "Inflation acts as a hidden tax that requires no legislation and faces no public resistance because most people do not understand the mechanism. Unlike income tax, inflation cannot be avoided through deductions or planning. It applies to every dollar held by every person, making it the most regressive form of taxation.",
    sourceUrl:
      "https://mises.org/articles-interest/inflation-taxation-without-legislation",
    sourceLabel: "Mises Institute: Inflation as Taxation",
  },
  {
    id: "in-006",
    category: "inflation",
    difficulty: "medium",
    title: "Savers vs borrowers",
    prompt:
      "Which monetary environment is more favorable for people who save their income rather than borrow?",
    content: {
      type: "visual",
      left: { componentId: "SoundMoneySavings" },
      right: { componentId: "InflationarySavings" },
    },
    correctSide: "left",
    explanationCorrect:
      "Sound money rewards savers by preserving or increasing the purchasing power of saved income over time. Under a gold standard, prices tended to fall gently as productivity improved, meaning saved money actually gained value. This allowed ordinary people to build wealth simply by working and saving, without needing to become sophisticated investors.",
    explanationWrong:
      "Inflationary money systematically punishes savers and rewards borrowers. If you borrow $100,000 today and inflation runs at 7%, you effectively repay only $93,000 in real terms after one year. This incentive structure encourages debt and consumption over saving and prudence, distorting economic behavior at every level.",
    sourceUrl: "https://saifedean.com/thebitcoinstandard",
    sourceLabel: "Saifedean Ammous: The Bitcoin Standard (Ch. 6)",
  },
  {
    id: "in-007",
    category: "inflation",
    difficulty: "medium",
    title: "Asset price inflation",
    prompt:
      "Which type of inflation do central banks typically include in their official measurements?",
    content: {
      type: "visual",
      left: { componentId: "ConsumerPrices" },
      right: { componentId: "AssetPrices" },
    },
    correctSide: "left",
    explanationCorrect:
      "Central banks measure and target consumer price inflation (CPI) while ignoring asset price inflation entirely. This creates a blind spot where enormous monetary expansion shows up as rising stock and real estate prices rather than rising consumer prices. Policymakers can claim inflation is low even as housing becomes unaffordable, because home prices are not in the CPI.",
    explanationWrong:
      "Asset price inflation is the hidden destination of most newly created money. When the Fed creates trillions, it enters the economy through financial markets. Asset prices soar, making owners wealthier on paper. This is not counted as inflation, yet it represents the same phenomenon: more money chasing the same assets, driving up prices for everyone who does not already own them.",
    sourceUrl: "https://www.bis.org/publ/work732.htm",
    sourceLabel: "BIS: Asset Price Inflation and Monetary Policy",
  },
  {
    id: "in-008",
    category: "inflation",
    difficulty: "medium",
    title: "Wage-price spiral",
    prompt:
      "Which explanation of rising wages during inflation is more accurate?",
    content: {
      type: "visual",
      left: { componentId: "WagesCauseInflation" },
      right: { componentId: "MoneySupplyCausesInflation" },
    },
    correctSide: "right",
    explanationCorrect:
      "The wage-price spiral narrative reverses cause and effect. Workers do not cause inflation by asking for raises. They respond to inflation that already eroded their purchasing power. The root cause is monetary expansion by the central bank. Blaming wages for inflation is like blaming a thermometer for a fever. The temperature reading is a symptom, not the disease.",
    explanationWrong:
      "The wage-price spiral framing conveniently shifts blame from monetary policy to workers. If wage growth caused inflation, then countries with strong unions and high wages (like 1960s America) would have had the highest inflation. Instead, the worst inflation episodes in history (Weimar Germany, Zimbabwe, Venezuela) were all caused by massive monetary expansion, not wage demands.",
    sourceUrl: "https://www.econlib.org/library/Enc/Inflation.html",
    sourceLabel: "EconLib: Inflation",
  },
  {
    id: "in-009",
    category: "inflation",
    difficulty: "medium",
    title: "Time preference",
    prompt:
      "Which monetary environment encourages longer-term thinking and planning?",
    content: {
      type: "visual",
      left: { componentId: "LowTimePreference" },
      right: { componentId: "HighTimePreference" },
    },
    correctSide: "left",
    explanationCorrect:
      "Hard money encourages low time preference: the willingness to sacrifice present consumption for future benefit. When money holds its value, saving is rational and long-term projects are viable. Civilizations built on sound money produced cathedrals, infrastructure, and institutions designed to last centuries. Sound money aligns individual incentives with long-term societal benefit.",
    explanationWrong:
      "Soft money increases time preference because holding cash is a losing proposition. When money depreciates, the rational choice is to spend it now before it loses more value. This produces a consumer culture oriented toward instant gratification, disposable goods, and short-term thinking. The quality of everything, from buildings to relationships, degrades when the future is systematically devalued.",
    sourceUrl: "https://saifedean.com/thebitcoinstandard",
    sourceLabel: "Saifedean Ammous: The Bitcoin Standard (Ch. 5)",
  },
  {
    id: "in-010",
    category: "inflation",
    difficulty: "hard",
    title: "Hyperinflation patterns",
    prompt:
      "Which description of hyperinflation correctly identifies its root cause?",
    content: {
      type: "visual",
      left: { componentId: "PrintingCausesHyperinflation" },
      right: { componentId: "HyperinflationBlameShift" },
    },
    correctSide: "left",
    explanationCorrect:
      "Every hyperinflation in history was caused by a government printing money to cover expenses it could not fund through taxation or borrowing. Supply shocks and speculation can cause temporary price spikes, but sustained, exponential price increases require sustained, exponential money creation. The pattern is identical across Weimar Germany, Zimbabwe, Venezuela, and dozens of other cases.",
    explanationWrong:
      "Blaming hyperinflation on greedy businesses or speculators is a common political deflection. Price controls, which are often imposed alongside this narrative, have never stopped hyperinflation because they address symptoms rather than the cause. They create shortages as producers cannot cover costs, ultimately making the situation worse while the money printer continues to run.",
    sourceUrl:
      "https://www.cato.org/sites/cato.org/files/pubs/pdf/workingpaper-8_1.pdf",
    sourceLabel: "Cato Institute: World Hyperinflations",
  },
  {
    id: "in-011",
    category: "inflation",
    difficulty: "hard",
    title: "Debt monetization",
    prompt:
      "Which method of funding government spending creates less inflationary pressure?",
    content: {
      type: "visual",
      left: { componentId: "TaxFundedSpending" },
      right: { componentId: "DebtMonetization" },
    },
    correctSide: "left",
    explanationCorrect:
      "Tax-funded spending does not increase the money supply. It redistributes existing money from citizens to government. While politically painful, it is transparent and accountable. Debt monetization, where the central bank buys government bonds with newly created money, is functionally equivalent to printing money to pay government bills. It creates inflation that acts as a hidden tax on all dollar holders.",
    explanationWrong:
      "Debt monetization allows governments to spend without the political cost of raising taxes. But the economic cost is identical: citizens lose purchasing power. The difference is visibility. With taxes, you see the deduction on your paycheck. With monetization, you notice it only when groceries cost more. Same transfer, different mechanism, zero accountability.",
    sourceUrl: "https://www.imf.org/external/pubs/ft/wp/2013/wp1332.pdf",
    sourceLabel: "IMF: The Central Bank's Balance Sheet and Monetary Policy",
  },
  {
    id: "in-012",
    category: "inflation",
    difficulty: "hard",
    title: "Real interest rates",
    prompt:
      "Which interest rate scenario actually grows the purchasing power of savings?",
    content: {
      type: "visual",
      left: { componentId: "PositiveRealRate" },
      right: { componentId: "NegativeRealRate" },
    },
    correctSide: "left",
    explanationCorrect:
      "Real interest rates (nominal rate minus inflation) determine whether savings actually grow in purchasing power. Positive real rates reward savers and encourage capital formation. Since 2008, central banks have kept nominal rates near zero while inflation has often exceeded those rates, creating negative real rates that systematically destroy the purchasing power of savings.",
    explanationWrong:
      "Negative real interest rates mean your savings buy less each year even when they earn interest. A 1% savings account with 6% inflation loses 5% of its real value annually. This is financial repression: the government reduces its real debt burden by ensuring the interest rate stays below inflation, at the direct expense of every saver in the economy.",
    sourceUrl: "https://fred.stlouisfed.org/series/REAINTRATREARAT10Y",
    sourceLabel: "FRED: 10-Year Real Interest Rate",
  },
  {
    id: "in-013",
    category: "inflation",
    difficulty: "hard",
    title: "CPI methodology changes",
    prompt:
      "Which approach to measuring inflation produces a higher and more consistent reading?",
    content: {
      type: "visual",
      left: { componentId: "CPI1980Method" },
      right: { componentId: "CPIModernMethod" },
    },
    correctSide: "left",
    explanationCorrect:
      "The 1980 CPI methodology measured the actual cost of maintaining the same standard of living. Modern methodology uses substitution (assuming people switch to cheaper alternatives), hedonic adjustments (claiming price increases are offset by quality improvements), and imputed rent instead of home prices. These changes systematically lower the reported inflation rate. Using the 1980 methodology, current inflation would read roughly 7-10%.",
    explanationWrong:
      "Modern CPI methodology was not changed to be more accurate. It was changed to report lower numbers. Lower CPI reduces government obligations tied to inflation (Social Security, TIPS bonds, federal pensions) by hundreds of billions per year. The government saves money every time the methodology is adjusted downward, creating a persistent incentive to understate inflation.",
    sourceUrl: "http://www.shadowstats.com/alternate_data/inflation-charts",
    sourceLabel: "ShadowStats: CPI Methodology Changes",
  },
  {
    id: "in-014",
    category: "inflation",
    difficulty: "hard",
    title: "Deflation as progress",
    prompt: "Which type of deflation reflects a healthy, growing economy?",
    content: {
      type: "visual",
      left: { componentId: "ProductivityDeflation" },
      right: { componentId: "CentralBankDeflationView" },
    },
    correctSide: "left",
    explanationCorrect:
      "Productivity-driven deflation is the natural result of economic progress. As technology improves and production becomes more efficient, goods and services cost less. This raises everyone's standard of living without requiring wage increases. The technology sector has experienced persistent deflation and is the most dynamic part of the economy, directly contradicting the claim that falling prices are harmful.",
    explanationWrong:
      "Central banks claim that deflation is dangerous because consumers will defer purchases. But the technology sector proves this wrong: people buy phones, computers, and TVs despite knowing prices will drop. The real reason central banks fear deflation is that it increases the real value of debt, making government borrowing more expensive. Inflation is preferred because it reduces the real burden of existing debt.",
    sourceUrl: "https://www.econlib.org/library/Enc/Deflation.html",
    sourceLabel: "EconLib: Deflation",
  },
  {
    id: "in-015",
    category: "inflation",
    difficulty: "hard",
    title: "Currency devaluation vs default",
    prompt:
      "Which method of resolving unsustainable government debt is more honest and transparent?",
    content: {
      type: "visual",
      left: { componentId: "ExplicitDefault" },
      right: { componentId: "SoftDefault" },
    },
    correctSide: "left",
    explanationCorrect:
      "An explicit default is economically devastating but honest. Creditors know they lost money, markets adjust, and the country can rebuild. Soft default through inflation achieves the same result, reducing the real value of debt, but spreads the cost silently across all holders of the currency. It is a default disguised as policy, and it is the method chosen by every major government today.",
    explanationWrong:
      "Inflating away debt is the preferred method because it avoids the political consequences of an explicit default. No government has to announce 'we are defaulting.' Instead, they print money, repay debts in nominal terms, and let inflation erode the real value. The losers are savers and wage earners who never agreed to lend money to the government in the first place.",
    sourceUrl:
      "https://www.imf.org/en/Publications/WP/Issues/2016/12/31/The-Liquidation-of-Government-Debt-42610",
    sourceLabel: "IMF: The Liquidation of Government Debt",
  },
  {
    id: "in-016",
    category: "inflation",
    difficulty: "hard",
    title: "Inflation targeting",
    prompt:
      "Which inflation target better serves the interests of ordinary savers?",
    content: {
      type: "visual",
      left: { componentId: "ZeroPercentTarget" },
      right: { componentId: "TwoPercentTarget" },
    },
    correctSide: "left",
    explanationCorrect:
      "A 0% inflation target would preserve purchasing power indefinitely, allowing simple savings to maintain value. The 2% target, adopted by most central banks, sounds modest but compounds to devastating effect over a lifetime. At 2% annual inflation, the dollar loses 45% of its purchasing power over 30 years. The target exists primarily because moderate inflation benefits governments by reducing the real value of their debt.",
    explanationWrong:
      "The 2% target is often justified by claiming that mild inflation encourages spending and prevents deflation. But this argument prioritizes consumption over saving and government debt management over citizen welfare. No saver has ever asked for their money to lose 2% of its value each year. The target was chosen to serve institutional interests, not individual ones.",
    sourceUrl: "https://www.federalreserve.gov/faqs/economy_14400.htm",
    sourceLabel: "Federal Reserve: Why Does the Fed Target 2% Inflation?",
  },
];
