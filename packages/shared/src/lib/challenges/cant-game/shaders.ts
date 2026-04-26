import type { BaseChallenge } from "../../game/types";

export const shadersChallenges: BaseChallenge[] = [
  {
    id: "shd-001",
    category: "shaders",
    difficulty: "medium",
    title: "Computation placement",
    prompt: "Which shader distributes computation more efficiently?",
    content: {
      type: "visual",
      left: { componentId: "ShadingPhong" },
      right: { componentId: "ShadingGouraud" },
    },

    correctSide: "right",
    explanationCorrect:
      "Moving the lighting calculation to the vertex shader means it runs once per vertex (hundreds or thousands of times) instead of once per pixel (hundreds of thousands of times). The GPU hardware interpolates the result across the triangle for free. For diffuse lighting the visual difference is minimal, but the performance gain is significant, especially on mobile GPUs.",
    explanationWrong:
      "Per-pixel (Phong) shading gives more accurate lighting, especially on large, low-poly triangles. But for simple diffuse lighting on reasonably tessellated meshes, the quality difference is negligible while the cost difference is orders of magnitude. Per-pixel computation should be reserved for effects that genuinely need it, like specular highlights and normal mapping.",
    sourceUrl: "https://learnopengl.com/Lighting/Basic-Lighting",
    sourceLabel: "LearnOpenGL: Basic Lighting",
  },
  {
    id: "shd-002",
    category: "shaders",
    difficulty: "hard",
    title: "Conditional execution",
    prompt:
      "Which shader handles conditional logic more efficiently on the GPU?",
    content: {
      type: "code",

      left: `// Dynamic branching in fragment shader
precision mediump float;
uniform bool uEnableFog;
uniform float uFogDensity;
varying float vDepth;

void main() {
  vec4 color = texture2D(uTexture, vUV);

  if (uEnableFog) {
    float fogFactor = exp(-uFogDensity * vDepth);
    color.rgb = mix(uFogColor, color.rgb, fogFactor);
  }

  gl_FragColor = color;
}`,

      right: `// Branchless: always compute, use step/mix
precision mediump float;
uniform float uFogEnabled; // 0.0 or 1.0
uniform float uFogDensity;
varying float vDepth;

void main() {
  vec4 color = texture2D(uTexture, vUV);

  float fogFactor = exp(-uFogDensity * vDepth);
  vec3 fogged = mix(uFogColor, color.rgb, fogFactor);
  color.rgb = mix(color.rgb, fogged, uFogEnabled);

  gl_FragColor = color;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "GPUs execute fragments in warps/wavefronts of 32-64 threads. A branch that diverges within a warp forces both paths to execute, with inactive threads masked off. Using mix() with a 0/1 uniform avoids divergence entirely. The extra multiply is cheaper than the branch penalty, especially on older mobile GPUs where branching is particularly expensive.",
    explanationWrong:
      "Uniform-based branches (where all fragments in a draw call take the same path) are often well-predicted by modern desktop GPUs, but on mobile GPUs and older hardware the branch can still introduce pipeline stalls. The branchless version is consistently fast across all hardware and avoids subtle performance cliffs when the branch becomes data-dependent later.",
    sourceUrl:
      "https://developer.nvidia.com/gpugems/gpugems2/part-iv-general-purpose-computation-gpus-primer/chapter-34-gpu-flow-control-idioms",
    sourceLabel: "GPU Gems 2: GPU Flow Control",
  },
];
