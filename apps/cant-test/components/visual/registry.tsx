import type { ComponentType } from "react";
import { FileTreeColocated, FileTreeSeparate } from "./file-tree";

/** Maps componentId strings to their React components. */
export const visualRegistry: Record<string, ComponentType> = {
  FileTreeColocated,
  FileTreeSeparate,
};
