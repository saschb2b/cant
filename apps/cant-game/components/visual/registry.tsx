import type { ComponentType } from "react";
import {
  CollisionBruteForce,
  CollisionSpatialHash,
} from "./collision-detection";
import { CollisionDiscrete, CollisionContinuous } from "./fast-collision";
import { JumpStrict, JumpCoyoteTime } from "./jump-responsiveness";
import { NetcodeSnapping, NetcodeInterpolation } from "./netcode-interpolation";
import { PathfindingManhattan, PathfindingOctile } from "./pathfinding";
import { TimestepVariable, TimestepFixed } from "./timestep";
import { RenderAll, RenderCulled } from "./frustum-culling";
import { ShadingGouraud, ShadingPhong } from "./shading";
import { RopeEuler, RopeVerlet } from "./rope-physics";
import { CameraSnap, CameraSmooth } from "./camera-follow";
import { SteerSeek, SteerArrive } from "./steering";
import { StateBooleanFlags, StateFiniteMachine } from "./state-machine";
import { DeadzoneRaw, DeadzoneCircular } from "./analog-deadzone";
import { JumpFixed, JumpVariable } from "./variable-jump";
import { AimRaw, AimAssist } from "./aim-assist";

/** Maps componentId strings to their React components. */
export const visualRegistry: Record<string, ComponentType> = {
  CollisionBruteForce,
  CollisionSpatialHash,
  CollisionDiscrete,
  CollisionContinuous,
  JumpStrict,
  JumpCoyoteTime,
  NetcodeSnapping,
  NetcodeInterpolation,
  PathfindingManhattan,
  PathfindingOctile,
  TimestepVariable,
  TimestepFixed,
  RenderAll,
  RenderCulled,
  ShadingGouraud,
  ShadingPhong,
  RopeEuler,
  RopeVerlet,
  CameraSnap,
  CameraSmooth,
  SteerSeek,
  SteerArrive,
  StateBooleanFlags,
  StateFiniteMachine,
  DeadzoneRaw,
  DeadzoneCircular,
  JumpFixed,
  JumpVariable,
  AimRaw,
  AimAssist,
};
