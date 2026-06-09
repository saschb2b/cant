// smiles-drawer ships no type declarations. The runtime shape this package
// relies on is modeled by the SmilesDrawerModule interface in
// components/smiles-canvas.tsx, which casts the dynamically imported module.
// This ambient declaration just lets that `import("smiles-drawer")` resolve.
declare module "smiles-drawer";
