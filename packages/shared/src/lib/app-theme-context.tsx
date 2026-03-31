"use client";

import { createContext, useContext } from "react";
import type { AppTheme } from "./app-theme";
import { defaultAppTheme } from "./app-theme";

export type { AppTheme } from "./app-theme";
export { createAppTheme } from "./app-theme";

const AppThemeContext = createContext(defaultAppTheme);

export const AppThemeProvider = AppThemeContext.Provider;

export function useAppTheme(): AppTheme {
  return useContext(AppThemeContext);
}
