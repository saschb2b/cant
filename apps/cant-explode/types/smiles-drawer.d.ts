declare module "smiles-drawer" {
  interface DrawerOptions {
    width?: number;
    height?: number;
    bondThickness?: number;
    bondLength?: number;
    shortBondLength?: number;
    bondSpacing?: number;
    atomVisualization?: string;
    isomeric?: boolean;
    debug?: boolean;
    terminalCarbons?: boolean;
    explicitHydrogens?: boolean;
    overlapSensitivity?: number;
    overlapResolutionIterations?: number;
    compactDrawing?: boolean;
    fontSizeLarge?: number;
    fontSizeSmall?: number;
    padding?: number;
    experimentalSSSR?: boolean;
    kkThreshold?: number;
    kkInnerThreshold?: number;
    kkMaxIteration?: number;
    kkMaxInnerIteration?: number;
    kkMaxEnergy?: number;
    themes?: Record<string, Record<string, string>>;
  }

  class Drawer {
    constructor(options?: DrawerOptions);
    draw(
      tree: unknown,
      canvas: HTMLCanvasElement | string,
      theme?: string,
      infoOnly?: boolean,
    ): void;
  }

  class SvgDrawer {
    constructor(options?: DrawerOptions);
    draw(
      tree: unknown,
      svg: SVGElement | string,
      theme?: string,
      infoOnly?: boolean,
    ): void;
  }

  class SmiDrawer {
    constructor(options?: DrawerOptions);
    draw(
      smiles: string,
      target: HTMLCanvasElement | SVGElement | string,
      theme?: string,
      successCallback?: () => void,
      errorCallback?: (err: unknown) => void,
    ): void;
  }

  function parse(
    smiles: string,
    successCallback: (tree: unknown) => void,
    errorCallback?: (err: unknown) => void,
  ): void;

  function clean(smiles: string): string;

  const Version: string;
}
