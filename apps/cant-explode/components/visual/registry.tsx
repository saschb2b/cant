import type { ComponentType } from "react";

import {
  BenzeneKekule,
  BenzeneDelocalized,
  EthanolStructure,
  DimethylEtherStructure,
  Cis2Butene,
  Trans2Butene,
  GlucoseOpenChain,
  GlucoseRingForm,
} from "./structural-formulas";

import {
  ElectronegativityCorrectTrend,
  ElectronegativityWrongTrend,
  AtomicRadiusCorrectTrend,
  AtomicRadiusWrongTrend,
  IonizationEnergyCorrect,
  IonizationEnergyWrong,
  ElectronAffinityCorrect,
  ElectronAffinityWrong,
} from "./periodic-trends";

import {
  NitrogenCorrectConfig,
  NitrogenWrongConfig,
  ChromiumCorrectConfig,
  ChromiumWrongConfig,
  OxygenCorrectConfig,
  OxygenWrongConfig,
  IronCorrectConfig,
  IronWrongConfig,
} from "./electron-configuration";

import {
  ExothermicProfile,
  EndothermicProfile,
  CatalyzedReaction,
  UncatalyzedReaction,
  SN1EnergyProfile,
  SN2EnergyProfile,
  LowActivationEnergy,
  HighActivationEnergy,
} from "./energy-diagrams";

import {
  NewmanStaggered,
  NewmanEclipsed,
  FischerR,
  FischerS,
  ChairAxialMethyl,
  ChairEquatorialMethyl,
  CisDecalin,
  TransDecalin,
} from "./stereochemistry";

import {
  WaterBent,
  WaterLinear,
  MethaneTetrahedral,
  MethaneSquarePlanar,
  AmmoniaPyramidal,
  AmmoniaPlanar,
  SF6Octahedral,
  SF6Trigonal,
} from "./molecular-geometry";

import {
  WaterChargeMap,
  MethaneChargeMap,
  HClPolarBond,
  Cl2NoPolar,
  CO2NoNetDipole,
  H2ONetDipole,
  NaClIonic,
  HFCovalent,
} from "./electrostatic-maps";

import {
  CarboxylicAcidStructure,
  AlcoholStructure,
  AldehydeStructure,
  KetoneStructure,
  AmineStructure,
  AmideStructure,
} from "./functional-groups";

import {
  BenzeneAromatic,
  CyclohexadieneNonAromatic,
  TertButylCation,
  MethylCation,
  CyclohexaneRing,
  CyclopropaneRing,
} from "./molecular-stability";

import {
  AlphaHelixStructure,
  BetaSheetStructure,
  DnaDoubleHelix,
  DnaSingleStrand,
  TertiaryStructure,
  PrimaryStructure,
  ProteinCartoon,
  ProteinSphereFill,
} from "./protein-structure";

export const visualRegistry: Record<string, ComponentType> = {
  // Structural Formulas
  BenzeneKekule,
  BenzeneDelocalized,
  EthanolStructure,
  DimethylEtherStructure,
  Cis2Butene,
  Trans2Butene,
  GlucoseOpenChain,
  GlucoseRingForm,

  // Periodic Trends
  ElectronegativityCorrectTrend,
  ElectronegativityWrongTrend,
  AtomicRadiusCorrectTrend,
  AtomicRadiusWrongTrend,
  IonizationEnergyCorrect,
  IonizationEnergyWrong,
  ElectronAffinityCorrect,
  ElectronAffinityWrong,

  // Electron Configuration
  NitrogenCorrectConfig,
  NitrogenWrongConfig,
  ChromiumCorrectConfig,
  ChromiumWrongConfig,
  OxygenCorrectConfig,
  OxygenWrongConfig,
  IronCorrectConfig,
  IronWrongConfig,

  // Energy Diagrams
  ExothermicProfile,
  EndothermicProfile,
  CatalyzedReaction,
  UncatalyzedReaction,
  SN1EnergyProfile,
  SN2EnergyProfile,
  LowActivationEnergy,
  HighActivationEnergy,

  // Stereochemistry
  NewmanStaggered,
  NewmanEclipsed,
  FischerR,
  FischerS,
  ChairAxialMethyl,
  ChairEquatorialMethyl,
  CisDecalin,
  TransDecalin,

  // Molecular Geometry
  WaterBent,
  WaterLinear,
  MethaneTetrahedral,
  MethaneSquarePlanar,
  AmmoniaPyramidal,
  AmmoniaPlanar,
  SF6Octahedral,
  SF6Trigonal,

  // Electrostatic Maps
  WaterChargeMap,
  MethaneChargeMap,
  HClPolarBond,
  Cl2NoPolar,
  CO2NoNetDipole,
  H2ONetDipole,
  NaClIonic,
  HFCovalent,

  // Functional Groups
  CarboxylicAcidStructure,
  AlcoholStructure,
  AldehydeStructure,
  KetoneStructure,
  AmineStructure,
  AmideStructure,

  // Molecular Stability
  BenzeneAromatic,
  CyclohexadieneNonAromatic,
  TertButylCation,
  MethylCation,
  CyclohexaneRing,
  CyclopropaneRing,

  // Protein Structure
  AlphaHelixStructure,
  BetaSheetStructure,
  DnaDoubleHelix,
  DnaSingleStrand,
  TertiaryStructure,
  PrimaryStructure,
  ProteinCartoon,
  ProteinSphereFill,
};
