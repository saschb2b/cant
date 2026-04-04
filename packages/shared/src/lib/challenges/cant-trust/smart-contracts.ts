import type { BaseChallenge } from "../../game/types";

export const smartContractsChallenges: BaseChallenge[] = [
  {
    id: "sc-001",
    category: "smart-contracts",
    difficulty: "easy",
    title: "Contract enforcement",
    prompt:
      "Which contract type executes automatically without relying on a third party?",
    content: {
      type: "visual",
      left: { componentId: "LegalContract" },
      right: { componentId: "SmartContract" },
    },
    correctSide: "right",
    explanationCorrect:
      "Smart contracts are self-executing programs on a blockchain. Once deployed, they run exactly as coded without relying on courts, lawyers, or enforcement agencies. This removes the cost, delay, and jurisdictional uncertainty of traditional contract enforcement.",
    explanationWrong:
      "Traditional contracts depend on trusted intermediaries for interpretation and enforcement. Ambiguous language, jurisdictional differences, and enforcement costs create friction. Smart contracts replace this with deterministic code execution, though they introduce the challenge of accurately representing intent in code.",
    sourceUrl: "https://ethereum.org/en/smart-contracts/",
    sourceLabel: "Ethereum.org: Smart Contracts",
  },
  {
    id: "sc-002",
    category: "smart-contracts",
    difficulty: "medium",
    title: "Account model vs eUTXO",
    prompt:
      "Which smart contract execution model allows more predictable transaction outcomes?",
    content: {
      type: "visual",
      left: { componentId: "AccountModel" },
      right: { componentId: "EutxoModel" },
    },
    correctSide: "right",
    explanationCorrect:
      "The extended UTXO model determines transaction outcomes entirely at build time. Because each transaction references specific inputs and declares exact outputs, the result is predictable before submission. If conditions change, the transaction simply fails rather than producing an unexpected outcome.",
    explanationWrong:
      "The account model's global mutable state means transaction outcomes depend on execution order. Between when you build a transaction and when it executes, other transactions can change the state you depend on. This enables front-running and sandwich attacks, where bots profit by manipulating transaction ordering.",
    sourceUrl: "https://docs.cardano.org/about-cardano/learn/eutxo-explainer/",
    sourceLabel: "Cardano Docs: eUTXO Explainer",
  },
  {
    id: "sc-003",
    category: "smart-contracts",
    difficulty: "medium",
    title: "Common vulnerabilities",
    prompt:
      "Which withdrawal pattern prevents the contract from being drained by recursive calls?",
    content: {
      type: "code",
      lang: "tsx",
      left: `// Withdraw function
// (vulnerable pattern)

function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);

    // Send ETH to caller
    (bool sent, ) = msg.sender.call{
        value: amount
    }("");
    require(sent);

    // Update balance AFTER sending
    balances[msg.sender] -= amount;
}

// Attacker's receive() calls
// withdraw() again before balance
// is updated. Drains entire contract.`,

      right: `// Withdraw function
// (checks-effects-interactions)

function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);

    // Update balance BEFORE sending
    balances[msg.sender] -= amount;

    // Send ETH to caller
    (bool sent, ) = msg.sender.call{
        value: amount
    }("");
    require(sent);
}

// Even if attacker's receive() calls
// withdraw() again, balance is already
// updated. Second call reverts.`,
    },
    correctSide: "right",
    explanationCorrect:
      "The checks-effects-interactions pattern updates state before making external calls. This prevents reentrancy attacks because recursive calls see the already-updated balance. The 2016 DAO hack exploited exactly this vulnerability, draining $60 million by calling withdraw() recursively before the balance was updated.",
    explanationWrong:
      "Updating state after an external call creates a window where the contract's balance variable does not reflect reality. A malicious contract can re-enter the function during that window and withdraw repeatedly. This is the most infamous vulnerability in smart contract history.",
    sourceUrl:
      "https://docs.soliditylang.org/en/latest/security-considerations.html",
    sourceLabel: "Solidity Docs: Security Considerations",
  },
  {
    id: "sc-004",
    category: "smart-contracts",
    difficulty: "hard",
    title: "Formal verification",
    prompt:
      "Which approach to smart contract correctness provides the strongest guarantees?",
    content: {
      type: "visual",
      left: { componentId: "TestAndHope" },
      right: { componentId: "MathematicalProof" },
    },
    correctSide: "right",
    explanationCorrect:
      "Formal verification uses mathematical proofs to demonstrate that a contract behaves correctly for ALL possible inputs and states, not just the ones a developer thought to test. This is critical for smart contracts that manage significant value, because bugs are irreversible once deployed. Cardano's Plutus platform was designed with formal methods in mind.",
    explanationWrong:
      "Testing can only verify the cases a developer writes. It proves the presence of correct behavior in tested scenarios but cannot prove the absence of bugs. For financial code handling millions in value, this is insufficient. Formal verification closes the gap between 'we tested a lot' and 'we proved it correct.'",
    sourceUrl: "https://iohk.io/en/research/library/",
    sourceLabel: "IOHK Research Library: Formal Methods",
  },
];
