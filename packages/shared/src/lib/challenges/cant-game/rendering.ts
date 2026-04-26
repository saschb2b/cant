import type { BaseChallenge } from "../../game/types";

export const renderingChallenges: BaseChallenge[] = [
  {
    id: "rend-001",
    category: "rendering",
    difficulty: "easy",
    title: "Draw call strategy",
    prompt:
      "Which rendering approach is more efficient for many similar objects?",
    content: {
      type: "code",

      left: `// One draw call per sprite
function render(sprites: Sprite[]) {
  for (const sprite of sprites) {
    gl.bindTexture(gl.TEXTURE_2D, sprite.texture);
    gl.uniformMatrix4fv(uModel, false, sprite.matrix);
    gl.drawElements(
      gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0,
    );
  }
}
// 1000 sprites = 1000 draw calls
// Each call has CPU overhead for
// state changes and driver validation`,

      right: `// Batch sprites into one draw call
function render(sprites: Sprite[]) {
  // Sort by texture to minimize binds
  sprites.sort((a, b) => a.textureId - b.textureId);

  let currentTex = -1;
  let offset = 0;

  for (const sprite of sprites) {
    if (sprite.textureId !== currentTex) {
      if (offset > 0) flush(offset);
      gl.bindTexture(gl.TEXTURE_2D, sprite.texture);
      currentTex = sprite.textureId;
      offset = 0;
    }
    writeQuad(batchBuffer, offset, sprite);
    offset++;
  }
  if (offset > 0) flush(offset);
}
// 1000 sprites with 4 textures = 4 draw calls`,
    },

    correctSide: "right",
    explanationCorrect:
      "Batching groups sprites that share the same texture into a single draw call. Each draw call has fixed CPU overhead from driver validation and state changes, so reducing 1,000 calls to 4 can be the difference between 30 and 60 FPS. Sorting by texture minimizes the number of batches. Modern 2D engines do this automatically.",
    explanationWrong:
      "One draw call per sprite ignores the fact that GPU state changes are expensive on the CPU side. The GPU itself can handle millions of triangles, but the CPU bottleneck of issuing thousands of individual draw calls with texture binds and uniform uploads dominates. This is the single most common performance problem in 2D rendering.",
    sourceUrl: "https://www.khronos.org/opengl/wiki/Performance",
    sourceLabel: "Khronos: OpenGL Performance",
  },
  {
    id: "rend-002",
    category: "rendering",
    difficulty: "medium",
    title: "Off-screen geometry",
    prompt: "Which approach to rendering handles off-screen objects better?",
    content: {
      type: "visual",
      left: { componentId: "RenderAll" },
      right: { componentId: "RenderCulled" },
    },

    correctSide: "right",
    explanationCorrect:
      "Frustum culling tests each object's bounding volume against the camera's view frustum before issuing a draw call. A bounding sphere test costs a handful of multiplies, while skipping a draw call saves the entire pipeline: vertex transforms, rasterization, and CPU-side state setup. In a scene with 10,000 objects where only 500 are visible, this cuts 95% of the work.",
    explanationWrong:
      "Relying on the GPU to clip off-screen triangles still pays the CPU cost of setting up each draw call, uploading uniforms, and binding resources. The GPU will discard the clipped geometry, but the driver overhead of issuing the command remains. For complex scenes this CPU bottleneck is often more limiting than the GPU itself.",
    sourceUrl:
      "https://learnopengl.com/Guest-Articles/2021/Scene/Frustum-Culling",
    sourceLabel: "LearnOpenGL: Frustum Culling",
  },
];
