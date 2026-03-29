import type { ReactNode } from "react";

type LottieAnimationData = Record<string, unknown>;

interface AppThemeLabels {
  /** Game panel: shown when the user picks the correct option. */
  betterLabel: ReactNode;
  /** Game panel: shown when the user picks the wrong option. */
  worseLabel: ReactNode;
  /** Learn pages: header label for the "bad" side. */
  badLabel: string;
  /** Learn pages: header label for the "good" side. */
  goodLabel: string;
}

interface AppThemeStyling {
  /** MUI theme path for panel header backgrounds (game + lobby). */
  headerBackground: string;
  /** MUI theme path for code area backgrounds. */
  codeBackground: string;
}

interface AppThemeSlots {
  /** Extra overlay rendered on correct answer (e.g. sparkle effects). */
  overlaySlot?: ReactNode;
  /** Lottie animation JSON for the checkmark. */
  checkmarkAnimation?: LottieAnimationData;
}

export interface AppTheme {
  labels: AppThemeLabels;
  styling: AppThemeStyling;
  slots: AppThemeSlots;
}

export const defaultAppTheme: AppTheme = {
  labels: {
    betterLabel: "Better",
    worseLabel: "Worse",
    badLabel: "Avoid",
    goodLabel: "Prefer",
  },
  styling: {
    headerBackground: "action.selected",
    codeBackground: "background.paper",
  },
  slots: {},
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export function createAppTheme(
  overrides: DeepPartial<AppTheme> = {},
): AppTheme {
  return {
    labels: { ...defaultAppTheme.labels, ...overrides.labels },
    styling: { ...defaultAppTheme.styling, ...overrides.styling },
    slots: { ...defaultAppTheme.slots, ...overrides.slots },
  };
}
