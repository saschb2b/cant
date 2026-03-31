import type { ComponentType } from "react";

import { FreeAccess, FrozenAccount } from "./account-freezing";
import { AccountModel, EutxoModel } from "./account-vs-eutxo";
import { OrderBookTrading, AmmCurve } from "./amm";
import { ConsumerPrices, AssetPrices } from "./asset-vs-consumer";
import { ExternalBailout, DepositBailIn } from "./bail-in";
import { StableBank, BankRunSimulation } from "./bank-run";
import { BarterDirect, MediumOfExchange } from "./barter-vs-medium";
import { UnstructuredTxns, BlockStructured } from "./block-structure";
import { ByzantineTrustAll, ByzantineBFT } from "./byzantine";
import { FirstReceivers, LastReceivers } from "./cantillon-effect";
import { CashAsExit, CashlessTrapped } from "./cash-elimination";
import { CbdcCentralized, CryptoDecentralized } from "./cbdc-vs-crypto";
import { PseudonymousAddresses, ClusteredAddresses } from "./chain-analytics";
import { CoinClipping, RoyalDebasement } from "./coin-ridges";
import { SingleAuthority, ThreePillarGovernance } from "./constitution";
import { DirectTransfer, CorrespondentChain } from "./correspondent-banking";
import { CPI1980Method, CPIModernMethod } from "./cpi-methodology";
import { CPIOfficialRate, RealCostRate } from "./cpi-vs-real";
import { CustodialWallet, NonCustodialWallet } from "./custody";
import { HonestCoinage, DebasedCoinage } from "./debasement";
import { TaxFundedSpending, DebtMonetization } from "./debt-monetization";
import {
  ProductivityDeflation,
  CentralBankDeflationView,
} from "./deflation-progress";
import { FullInsurance, PartialInsurance } from "./deposit-insurance";
import { DepositAsProperty, DepositAsIOU } from "./deposit-ownership";
import { FixedDifficulty, AdaptiveDifficulty } from "./difficulty";
import { SignatureUnsigned, SignatureSigned } from "./digital-signatures";
import { FreeBlockProduction, EnergyBackedBlocks } from "./energy-security";
import { DebtConstrained, DebtExponential } from "./federal-debt";
import {
  FinalityProbabilistic,
  FinalityDeterministic,
} from "./finality-models";
import { BankCustody, SelfCustody } from "./fix-custody";
import { CantillonUnfair, MiningFair } from "./fix-distribution";
import { FiatGraveyardScroll, BitcoinLindy } from "./fix-lindy";
import { SwiftSettlement, BlockchainSettlement } from "./fix-settlement";
import { InfiniteSupply, FixedSupply } from "./fix-supply";
import { HardFork, SoftFork } from "./forks";
import { TestAndHope, MathematicalProof } from "./formal-verification";
import { GoldBackedNote, UnbackedFiat } from "./gold-vs-fiat";
import { GoldBackedSupply, UnbackedSupply } from "./gold-vs-supply";
import { GoldWindowOpen, GoldWindowClosed } from "./gold-window";
import { OffChainConsensus, OnChainVoting } from "./governance-models";
import { GreshamNoEffect, GreshamCirculation } from "./greshams-law";
import { UnlimitedSupply, HalvingSupply } from "./halving";
import { SoftMoneyCap, HardMoneyCap } from "./hard-money-capitalism";
import { HashWeak, HashStrong } from "./hash-functions";
import { SingleKeyReuse, HdDerivation } from "./hd-wallet";
import { HousingThen, HousingNow } from "./housing-affordability";
import {
  PrintingCausesHyperinflation,
  HyperinflationBlameShift,
} from "./hyperinflation";
import { ZeroPercentTarget, TwoPercentTarget } from "./inflation-targeting";
import { ExplicitTax, InflationTax } from "./inflation-tax";
import { LowInterestRate, HighInterestRate } from "./interest-rates";
import { KeySharedSecret, KeyPairAsymmetric } from "./key-pairs";
import { EverythingOnL1, L1PlusL2 } from "./layer2";
import { BankLending, ProtocolLending } from "./lending";
import { SingleSidedLiquidity, PooledLiquidity } from "./liquidity-pool";
import { WealthWithoutPrinting, WealthWithPrinting } from "./m2-wealth-gap";
import { MerkleFlat, MerkleTree } from "./merkle-tree";
import { FullyPublicChain, MidnightSplit } from "./midnight";
import { SubsidyOnlyMining, SubsidyPlusFees } from "./mining-incentives";
import { SingleDeposit, MoneyMultiplier } from "./money-creation";
import { SimpleMoney, MoneyLayers } from "./money-supply";
import { SingleSignature, MultisigThreshold } from "./multisig";
import { NakamotoFinality, OuroborosFinality } from "./nakamoto-ouroboros";
import { NettingGross, NettingBilateral } from "./netting";
import { PoliticalDebate, MonetaryRootCause } from "./political-blind-spot";
import {
  ProductivityWagesLinked,
  ProductivityWagesDiverged,
} from "./productivity-wages";
import { FreeMoney, ProgrammableMoney } from "./programmable-money";
import { PosRandomSelection, PosStakeWeighted } from "./proof-of-stake";
import { PowNoCost, PowEnergyCost } from "./proof-of-work";
import {
  StablePurchasingPower,
  ErodedPurchasingPower,
} from "./purchasing-power";
import { NormalMoneySupply, QEExpansion } from "./quantitative-easing";
import { PositiveRealRate, NegativeRealRate } from "./real-interest-rates";
import { SingleClaim, MultipleClaims } from "./rehypothecation";
import { RemittanceExpensive, RemittanceCheap } from "./remittance";
import { FullReserveBank, FractionalReserveBank } from "./reserve-banking";
import { FairScoring, RiggedScoring } from "./rigged-referee";
import { OptimisticRollup, ZkRollup } from "./rollups";
import { SoundMoneySavings, InflationarySavings } from "./savers-vs-borrowers";
import { SingleIncomeSufficient, DualIncomeRequired } from "./savings-collapse";
import { RawKeyStorage, BipMnemonic } from "./seed-phrase";
import { SettlementT2, SettlementT0 } from "./settlement-timeline";
import {
  MoneyTimelineScatter,
  MoneyTimelineProgression,
} from "./shells-to-gold";
import { HonestPricing, ShrinkflationPricing } from "./shrinkflation";
import { LegalContract, SmartContract } from "./smart-vs-legal";
import { UnrestrictedAccess, ScoreBasedAccess } from "./social-credit";
import { ExplicitDefault, SoftDefault } from "./soft-default";
import { SoundMoneyFewTraits, SoundMoneyAllTraits } from "./sound-money";
import { GeneralistEconomy, SpecialistEconomy } from "./specialization";
import { EveryTxOnChain, ChannelOpenClose } from "./state-channels";
import { LowStockToFlow, HighStockToFlow } from "./stock-to-flow";
import { MoneyJustNumbers, MoneyStoredEnergy } from "./stored-time";
import { CashPrivacy, DigitalSurveillance } from "./surveillance";
import { LowTimePreference, HighTimePreference } from "./time-preference";
import { TransparentLedger, ShieldedLedger } from "./transparency";
import { DonationFunded, ProtocolTreasury } from "./treasury";
import { CentralizedFast, TrilemmaBalanced } from "./trilemma";
import { BankedPopulation, UnbankedReality } from "./unbanked";
import { AccountBalance, UtxoModel } from "./utxo";
import { SimpleMajority, StakeWeightedVoting } from "./voting";
import {
  WagesCauseInflation,
  MoneySupplyCausesInflation,
} from "./wage-price-spiral";
import { WealthZeroSum, WealthCreation } from "./wealth-production";
import { SilverComparison, GoldComparison } from "./why-gold-won";
import { WireTransferChain, WireTransferDirect } from "./wire-transfer";
import { SimpleStaking, YieldFarmStack } from "./yield-farming";
import { RevealAllToProve, ZkProveWithout } from "./zk-applications";
import { ZkpRevealAll, ZkpZeroKnowledge } from "./zkp";

export const visualRegistry: Record<string, ComponentType> = {
  FreeAccess,
  FrozenAccount,
  AccountModel,
  EutxoModel,
  OrderBookTrading,
  AmmCurve,
  ConsumerPrices,
  AssetPrices,
  ExternalBailout,
  DepositBailIn,
  StableBank,
  BankRunSimulation,
  BarterDirect,
  MediumOfExchange,
  UnstructuredTxns,
  BlockStructured,
  ByzantineTrustAll,
  ByzantineBFT,
  FirstReceivers,
  LastReceivers,
  CashAsExit,
  CashlessTrapped,
  CbdcCentralized,
  CryptoDecentralized,
  PseudonymousAddresses,
  ClusteredAddresses,
  CoinClipping,
  RoyalDebasement,
  SingleAuthority,
  ThreePillarGovernance,
  DirectTransfer,
  CorrespondentChain,
  CPI1980Method,
  CPIModernMethod,
  CPIOfficialRate,
  RealCostRate,
  CustodialWallet,
  NonCustodialWallet,
  HonestCoinage,
  DebasedCoinage,
  TaxFundedSpending,
  DebtMonetization,
  ProductivityDeflation,
  CentralBankDeflationView,
  FullInsurance,
  PartialInsurance,
  DepositAsProperty,
  DepositAsIOU,
  FixedDifficulty,
  AdaptiveDifficulty,
  SignatureUnsigned,
  SignatureSigned,
  FreeBlockProduction,
  EnergyBackedBlocks,
  DebtConstrained,
  DebtExponential,
  FinalityProbabilistic,
  FinalityDeterministic,
  BankCustody,
  SelfCustody,
  CantillonUnfair,
  MiningFair,
  FiatGraveyardScroll,
  BitcoinLindy,
  SwiftSettlement,
  BlockchainSettlement,
  InfiniteSupply,
  FixedSupply,
  HardFork,
  SoftFork,
  TestAndHope,
  MathematicalProof,
  GoldBackedNote,
  UnbackedFiat,
  GoldBackedSupply,
  UnbackedSupply,
  GoldWindowOpen,
  GoldWindowClosed,
  OffChainConsensus,
  OnChainVoting,
  GreshamNoEffect,
  GreshamCirculation,
  UnlimitedSupply,
  HalvingSupply,
  SoftMoneyCap,
  HardMoneyCap,
  HashWeak,
  HashStrong,
  SingleKeyReuse,
  HdDerivation,
  HousingThen,
  HousingNow,
  PrintingCausesHyperinflation,
  HyperinflationBlameShift,
  ZeroPercentTarget,
  TwoPercentTarget,
  ExplicitTax,
  InflationTax,
  LowInterestRate,
  HighInterestRate,
  KeySharedSecret,
  KeyPairAsymmetric,
  EverythingOnL1,
  L1PlusL2,
  BankLending,
  ProtocolLending,
  SingleSidedLiquidity,
  PooledLiquidity,
  WealthWithoutPrinting,
  WealthWithPrinting,
  MerkleFlat,
  MerkleTree,
  FullyPublicChain,
  MidnightSplit,
  SubsidyOnlyMining,
  SubsidyPlusFees,
  SingleDeposit,
  MoneyMultiplier,
  SimpleMoney,
  MoneyLayers,
  SingleSignature,
  MultisigThreshold,
  NakamotoFinality,
  OuroborosFinality,
  NettingGross,
  NettingBilateral,
  PoliticalDebate,
  MonetaryRootCause,
  ProductivityWagesLinked,
  ProductivityWagesDiverged,
  FreeMoney,
  ProgrammableMoney,
  PosRandomSelection,
  PosStakeWeighted,
  PowNoCost,
  PowEnergyCost,
  StablePurchasingPower,
  ErodedPurchasingPower,
  NormalMoneySupply,
  QEExpansion,
  PositiveRealRate,
  NegativeRealRate,
  SingleClaim,
  MultipleClaims,
  RemittanceExpensive,
  RemittanceCheap,
  FullReserveBank,
  FractionalReserveBank,
  FairScoring,
  RiggedScoring,
  OptimisticRollup,
  ZkRollup,
  SoundMoneySavings,
  InflationarySavings,
  SingleIncomeSufficient,
  DualIncomeRequired,
  RawKeyStorage,
  BipMnemonic,
  SettlementT2,
  SettlementT0,
  MoneyTimelineScatter,
  MoneyTimelineProgression,
  HonestPricing,
  ShrinkflationPricing,
  LegalContract,
  SmartContract,
  UnrestrictedAccess,
  ScoreBasedAccess,
  ExplicitDefault,
  SoftDefault,
  SoundMoneyFewTraits,
  SoundMoneyAllTraits,
  GeneralistEconomy,
  SpecialistEconomy,
  EveryTxOnChain,
  ChannelOpenClose,
  LowStockToFlow,
  HighStockToFlow,
  MoneyJustNumbers,
  MoneyStoredEnergy,
  CashPrivacy,
  DigitalSurveillance,
  LowTimePreference,
  HighTimePreference,
  TransparentLedger,
  ShieldedLedger,
  DonationFunded,
  ProtocolTreasury,
  CentralizedFast,
  TrilemmaBalanced,
  BankedPopulation,
  UnbankedReality,
  AccountBalance,
  UtxoModel,
  SimpleMajority,
  StakeWeightedVoting,
  WagesCauseInflation,
  MoneySupplyCausesInflation,
  WealthZeroSum,
  WealthCreation,
  SilverComparison,
  GoldComparison,
  WireTransferChain,
  WireTransferDirect,
  SimpleStaking,
  YieldFarmStack,
  RevealAllToProve,
  ZkProveWithout,
  ZkpRevealAll,
  ZkpZeroKnowledge,
};
