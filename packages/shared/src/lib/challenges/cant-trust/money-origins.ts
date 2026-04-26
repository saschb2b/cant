import type { BaseChallenge } from "../../game/types";

export const moneyOriginsChallenges: BaseChallenge[] = [
  {
    id: "mo-001",
    category: "money-origins",
    difficulty: "easy",
    title: "Trading systems",
    prompt:
      "Which system makes trade easier between people who want different things?",
    content: {
      type: "visual",
      left: { componentId: "BarterDirect" },
      right: { componentId: "MediumOfExchange" },
    },
    correctSide: "right",
    explanationCorrect:
      "A medium of exchange eliminates the need for a double coincidence of wants. Instead of finding someone who both has what you want AND wants what you have, you simply sell for money and buy what you need. This is the foundational reason money exists.",
    explanationWrong:
      "Direct barter requires both parties to want exactly what the other has at the same time. This is called the 'double coincidence of wants' problem. In practice, this makes trade extremely difficult and limits economic activity to small, local groups.",
    sourceUrl: "https://www.econlib.org/library/Enc/Money.html",
    sourceLabel: "EconLib: Money",
  },
  {
    id: "mo-002",
    category: "money-origins",
    difficulty: "easy",
    title: "Views on total wealth",
    prompt:
      "Which view of wealth better explains how societies become richer over time?",
    content: {
      type: "visual",
      left: { componentId: "WealthZeroSum" },
      right: { componentId: "WealthCreation" },
    },
    correctSide: "right",
    explanationCorrect:
      "Wealth is created when someone combines knowledge and resources to produce something more valuable than the inputs. A farmer turns seeds into food. An engineer turns steel into bridges. Both sides of a voluntary trade feel they gained, because they did. This is why global wealth has grown enormously over centuries.",
    explanationWrong:
      "If wealth were truly zero-sum, total global wealth would never change, only who holds it. But we clearly have vastly more wealth than in the Stone Age. Wealth is created through production, innovation, and voluntary exchange. Treating it as a fixed pie leads to destructive policies focused on redistribution rather than growth.",
    sourceUrl: "https://fee.org/articles/economics-in-one-lesson/",
    sourceLabel: "FEE: Economics in One Lesson",
  },
  {
    id: "mo-003",
    category: "money-origins",
    difficulty: "medium",
    title: "What money represents",
    prompt:
      "Which description of money better captures what your savings actually represent?",
    content: {
      type: "visual",
      left: { componentId: "MoneyJustNumbers" },
      right: { componentId: "MoneyStoredEnergy" },
    },
    correctSide: "right",
    explanationCorrect:
      "Money represents stored human effort. When you work, you convert your time, energy, and skill into money. Good money preserves that stored effort indefinitely. When money is debased through printing, your past labor is retroactively devalued, as if someone reached back in time and stole hours from your life.",
    explanationWrong:
      "Viewing money as 'just numbers' misses the human cost. Every unit of money was earned by someone through real work. When that money loses purchasing power, the hours of life spent earning it are partially erased. This is why sound money matters: it respects the time and energy people invested to earn it.",
    sourceUrl: "https://saifedean.com/thebitcoinstandard",
    sourceLabel: "Saifedean Ammous: The Bitcoin Standard",
  },
  {
    id: "mo-004",
    category: "money-origins",
    difficulty: "easy",
    title: "History of monetary goods",
    prompt:
      "Which view of money's history better explains how gold became dominant?",
    content: {
      type: "visual",
      left: { componentId: "MoneyTimelineScatter" },
      right: { componentId: "MoneyTimelineProgression" },
    },
    correctSide: "right",
    explanationCorrect:
      "Money evolved through a selection process over thousands of years. Societies tried shells, beads, cattle, salt, and metals. Each form was tested by trade, and those that lacked durability, portability, or scarcity were gradually abandoned. Gold survived because it best satisfied the properties needed for long-term monetary use.",
    explanationWrong:
      "Money did not appear randomly or without pattern. Viewing monetary history as chaotic misses the competitive selection process that filtered out inferior forms. Understanding the progression reveals why certain properties matter and why gold emerged as the dominant monetary good across civilizations.",
    sourceUrl: "https://nakamotoinstitute.org/shelling-out/",
    sourceLabel: "Nick Szabo: Shelling Out",
  },
  {
    id: "mo-005",
    category: "money-origins",
    difficulty: "medium",
    title: "Evaluating monetary quality",
    prompt:
      "Which method of comparing monetary goods gives a more accurate picture?",
    content: {
      type: "visual",
      left: { componentId: "SoundMoneyFewTraits" },
      right: { componentId: "SoundMoneyAllTraits" },
    },
    correctSide: "right",
    explanationCorrect:
      "Sound money must satisfy multiple properties simultaneously: durability (survives time), divisibility (splits into small units), portability (easy to transport), scarcity (limited supply), and fungibility (each unit is interchangeable). Evaluating only one or two properties leads to misleading conclusions, like concluding glass beads are comparable to gold.",
    explanationWrong:
      "Comparing money on just two properties is incomplete and misleading. Glass beads are shiny, but they shatter, are easy to produce in unlimited quantities, and vary in appearance. A full scorecard across all five key properties reveals why gold and bitcoin score far above alternatives.",
    sourceUrl: "https://saifedean.com/thebitcoinstandard",
    sourceLabel: "Saifedean Ammous: The Bitcoin Standard (Ch. 1)",
  },
  {
    id: "mo-006",
    category: "money-origins",
    difficulty: "medium",
    title: "Division of labor",
    prompt: "Which economic structure produces more wealth over time?",
    content: {
      type: "visual",
      left: { componentId: "GeneralistEconomy" },
      right: { componentId: "SpecialistEconomy" },
    },
    correctSide: "right",
    explanationCorrect:
      "Specialization and trade produce far more output than generalism. When each person focuses on what they do best, they develop expertise and efficiency. Money makes this possible by letting specialists trade their output for anything they need, without requiring a double coincidence of wants. Adam Smith identified the division of labor as the primary driver of wealth creation.",
    explanationWrong:
      "When everyone tries to do everything, nobody becomes expert at anything. Output per person is low because switching between tasks wastes time and prevents skill development. This is subsistence living. Money and trade unlock specialization, which is the engine of economic growth.",
    sourceUrl: "https://www.econlib.org/library/Smith/smWN.html",
    sourceLabel: "Adam Smith: The Wealth of Nations (Book I, Ch. 1-3)",
  },
  {
    id: "mo-007",
    category: "money-origins",
    difficulty: "medium",
    title: "Competition scoring systems",
    prompt:
      "Which scoring system produces outcomes based on actual contribution?",
    content: {
      type: "visual",
      left: { componentId: "FairScoring" },
      right: { componentId: "RiggedScoring" },
    },
    correctSide: "left",
    explanationCorrect:
      "When the rules are neutral and consistently applied, outcomes reflect actual production and effort. Fair competition incentivizes everyone to produce more, because they know they will keep what they earn. This is what sound money provides: a neutral ledger that nobody can manipulate.",
    explanationWrong:
      "When a central authority can arbitrarily change scores, effort is no longer the primary path to success. Players learn that influencing the referee is more profitable than producing. This is the Cantillon effect: those closest to new money creation benefit at the expense of everyone else.",
    sourceUrl:
      "https://fee.org/articles/the-cantillon-effect-because-of-inflation-we-re-financing-the-financiers/",
    sourceLabel: "FEE: The Cantillon Effect",
  },
  {
    id: "mo-008",
    category: "money-origins",
    difficulty: "medium",
    title: "Backing and trust requirements",
    prompt:
      "Which monetary system requires less trust in a third party to maintain value?",
    content: {
      type: "visual",
      left: { componentId: "GoldBackedNote" },
      right: { componentId: "UnbackedFiat" },
    },
    correctSide: "left",
    explanationCorrect:
      "A gold-backed note requires less trust because the holder can redeem it for physical gold. The issuer is constrained by actual gold reserves. Fiat money, by contrast, requires trust that the government will not print excessively, run unsustainable deficits, or devalue the currency. History shows this trust has been broken repeatedly.",
    explanationWrong:
      "Unbacked fiat money requires the highest level of trust. The holder must trust that the government will exercise restraint in money creation, that political incentives will not lead to inflation, and that future administrations will honor the same commitments. Since the end of gold convertibility in 1971, every major fiat currency has lost significant purchasing power.",
    sourceUrl: "https://wtfhappenedin1971.com/",
    sourceLabel: "WTF Happened in 1971?",
  },
  {
    id: "mo-009",
    category: "money-origins",
    difficulty: "medium",
    title: "Gold vs silver as money",
    prompt:
      "Which metal has properties better suited for long-term monetary use?",
    content: {
      type: "visual",
      left: { componentId: "SilverComparison" },
      right: { componentId: "GoldComparison" },
    },
    correctSide: "right",
    explanationCorrect:
      "Gold outcompetes silver as money on several critical dimensions. Gold does not tarnish or corrode, maintaining its appearance and purity indefinitely. Gold is rarer, with a higher stock-to-flow ratio, meaning new supply dilutes existing holdings less. Gold's higher value density means large amounts of wealth can be stored and transported in small volumes.",
    explanationWrong:
      "Silver served as money for centuries, but its drawbacks became more apparent over time. It tarnishes, requiring maintenance. Its greater abundance means new mining supply dilutes existing holders more than gold does. Silver's lower value per weight makes large transactions and long-distance trade less practical compared to gold.",
    sourceUrl: "https://saifedean.com/thebitcoinstandard",
    sourceLabel: "Saifedean Ammous: The Bitcoin Standard (Ch. 2)",
  },
  {
    id: "mo-010",
    category: "money-origins",
    difficulty: "hard",
    title: "Gresham's Law",
    prompt:
      "Which simulation correctly demonstrates what happens when two monies of different quality coexist at a fixed exchange rate?",
    content: {
      type: "visual",
      left: { componentId: "GreshamNoEffect" },
      right: { componentId: "GreshamCirculation" },
    },
    correctSide: "right",
    explanationCorrect:
      "Gresham's Law states that 'bad money drives out good.' When a government fixes the exchange rate between two monies, people hoard the undervalued (good) money and spend the overvalued (bad) money. Rational actors save gold and pay with debased coins. Over time, only the inferior money remains in circulation while the better money disappears into savings.",
    explanationWrong:
      "If both monies circulated equally, people would have no incentive to prefer spending one over the other. But when one money is artificially overvalued by decree, rational people will always spend the overvalued money and save the undervalued money. This is why debased coins always drove gold out of circulation throughout history.",
    sourceUrl: "https://www.econlib.org/library/Enc/GreshamsLaw.html",
    sourceLabel: "EconLib: Gresham's Law",
  },
];
