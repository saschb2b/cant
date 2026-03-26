/** Instructions that create a new filesystem layer in the image. */
const LAYER_INSTRUCTIONS = new Set(["FROM", "RUN", "COPY", "ADD"]);

export function createsLayer(instruction: string): boolean {
  return LAYER_INSTRUCTIONS.has(instruction.toUpperCase());
}
