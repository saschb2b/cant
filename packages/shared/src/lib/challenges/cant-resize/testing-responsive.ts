import type { BaseChallenge } from "../../game/types";

export const testingResponsiveChallenges: BaseChallenge[] = [
  {
    id: "tr-001",
    category: "testing-responsive",
    difficulty: "easy",
    title: "DevTools device mode vs real devices",
    prompt: "Which testing strategy catches more bugs?",
    content: {
      type: "code",

      left: `// Only tested in Chrome DevTools device mode
// "Looks good at iPhone 14 Pro dimensions"

// Issues missed:
// - Touch interactions (hover states)
// - Safe area insets (notch)
// - Mobile browser chrome (URL bar height)
// - Virtual keyboard behavior
// - Scroll performance`,

      right: `// Multi-layer testing strategy:
// 1. Chrome DevTools for quick iteration
// 2. Responsive viewer for side-by-side comparison
// 3. BrowserStack/real devices for:
//    - Touch interaction testing
//    - Safari-specific CSS bugs
//    - Virtual keyboard behavior
//    - Performance on low-end devices
//    - Safe area inset verification`,
    },

    correctSide: "right",
    explanationCorrect:
      "DevTools device mode is a viewport resizer, not a device emulator. It can't simulate touch physics, mobile browser chrome, virtual keyboards, or Safari's CSS quirks. A layered testing approach catches issues at each level before they reach production.",
    explanationWrong:
      "Chrome DevTools device mode doesn't simulate the mobile Safari rendering engine, touch events (hover states still fire), the dynamic viewport (URL bar), or the virtual keyboard pushing content up. Real device testing catches these.",
    sourceUrl: "https://developer.chrome.com/docs/devtools/device-mode/",
    sourceLabel: "Chrome: Device mode",
  },
  {
    id: "tr-002",
    category: "testing-responsive",
    difficulty: "easy",
    title: "Testing with the responsive viewer",
    prompt: "Which workflow gives faster visual feedback?",
    content: {
      type: "code",

      left: `// Manual testing workflow:
// 1. Open site in browser
// 2. Drag browser window to different widths
// 3. Try to remember what it looked like
//    at other sizes
// 4. Repeat for each change`,

      right: `// Responsive viewer workflow:
// 1. Open site in responsive viewer
// 2. Add target devices: iPhone SE, iPad, Desktop
// 3. See all viewports simultaneously
// 4. Scroll sync shows alignment issues
// 5. Test URL changes across all devices
// 6. Iterate with instant visual feedback`,
    },

    correctSide: "right",
    explanationCorrect:
      "A multi-device viewer shows all breakpoints at once, revealing issues you'd miss by manually resizing. Scroll sync helps verify that content alignment works across viewports. It's faster iteration and more thorough coverage.",
    explanationWrong:
      "Manually resizing a single browser window means you can only see one viewport at a time. You miss how changes at one breakpoint affect others, and the constant resizing is slow. Multi-device viewers solve both problems.",
    sourceUrl: "https://developer.chrome.com/docs/devtools/device-mode/",
    sourceLabel: "Chrome: Device mode testing",
  },
  {
    id: "tr-003",
    category: "testing-responsive",
    difficulty: "medium",
    title: "Viewport testing in Playwright",
    prompt: "Which test verifies mobile layout correctly?",
    content: {
      type: "code",

      left: `test("shows mobile layout", async ({ page }) => {
  await page.goto("/dashboard");

  const sidebar = page.locator(".sidebar");
  // This passes because sidebar exists in DOM
  // even when hidden with CSS display: none
  await expect(sidebar).toBeAttached();
});`,

      right: `test("shows mobile layout", async ({ page }) => {
  await page.setViewportSize({
    width: 375,
    height: 667,
  });
  await page.goto("/dashboard");

  const sidebar = page.locator(".sidebar");
  await expect(sidebar).not.toBeVisible();

  const hamburger = page.locator("[aria-label='Menu']");
  await expect(hamburger).toBeVisible();

  await hamburger.click();
  await expect(sidebar).toBeVisible();
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "`setViewportSize` sets the actual viewport, triggering media queries. `toBeVisible()` checks CSS visibility (including `display: none`), while `toBeAttached()` only checks DOM presence. The test verifies the full mobile flow: hidden sidebar, visible hamburger, click to reveal.",
    explanationWrong:
      "`toBeAttached()` passes as long as the element exists in the DOM and it doesn't check if it's visible. A CSS-hidden sidebar is still \"attached\". Without setting the viewport size, the test runs at Playwright's default (1280x720), testing desktop layout instead.",
    sourceUrl: "https://playwright.dev/docs/emulation#viewport",
    sourceLabel: "Playwright: Viewport emulation",
  },
  {
    id: "tr-004",
    category: "testing-responsive",
    difficulty: "medium",
    title: "Visual regression for responsive layouts",
    prompt: "Which catches breakpoint-specific regressions?",
    content: {
      type: "code",

      left: `// Only test at one viewport width
test("homepage looks correct", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("home.png");
});`,

      right: `const viewports = [
  { width: 375, height: 667, name: "mobile" },
  { width: 768, height: 1024, name: "tablet" },
  { width: 1440, height: 900, name: "desktop" },
];

for (const vp of viewports) {
  test(\`homepage - \${vp.name}\`, async ({ page }) => {
    await page.setViewportSize({
      width: vp.width,
      height: vp.height,
    });
    await page.goto("/");
    await expect(page).toHaveScreenshot(
      \`home-\${vp.name}.png\`,
    );
  });
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Visual regression tests at multiple viewports catch breakpoint-specific bugs. A CSS change that looks fine on desktop might break the mobile layout, and testing at one size misses this. Loop over viewports to get coverage without code duplication.",
    explanationWrong:
      "A single-viewport screenshot test gives you confidence at that one size. A padding change that fixes desktop alignment might overlap elements at 375px. Without mobile/tablet screenshots, the regression goes undetected until a user reports it.",
    sourceUrl: "https://playwright.dev/docs/test-snapshots",
    sourceLabel: "Playwright: Visual comparisons",
  },
  {
    id: "tr-005",
    category: "testing-responsive",
    difficulty: "hard",
    title: "Testing responsive behavior, not pixel values",
    prompt: "Which test is more resilient to CSS changes?",
    content: {
      type: "code",

      left: `test("sidebar is responsive", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/app");

  const sidebar = page.locator(".sidebar");
  const box = await sidebar.boundingBox();

  // Brittle: exact pixel assertions
  expect(box?.width).toBe(0);
  expect(box?.height).toBe(0);
});`,

      right: `test("sidebar is responsive", async ({ page }) => {
  // Mobile: sidebar hidden, hamburger visible
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/app");
  await expect(page.getByRole("complementary")).not.toBeVisible();
  await expect(page.getByRole("button", { name: /menu/i })).toBeVisible();

  // Desktop: sidebar visible, no hamburger
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.getByRole("complementary")).toBeVisible();
  await expect(page.getByRole("button", { name: /menu/i })).not.toBeVisible();
});`,
    },

    correctSide: "right",
    explanationCorrect:
      "Test the *behavior* (sidebar visible/hidden, hamburger appears/disappears) rather than pixel values. Using ARIA roles (`complementary` for sidebar) and accessible names makes the test resilient to CSS changes and meaningful because it verifies what the user actually experiences.",
    explanationWrong:
      "Asserting exact pixel values (width = 0, height = 0) is brittle, and a 1px padding change breaks the test. It also doesn't verify the user experience: is the hamburger menu there? Can the user open the sidebar? Behavioral assertions are more valuable and maintainable.",
    sourceUrl: "https://playwright.dev/docs/locators#locate-by-role",
    sourceLabel: "Playwright: Role-based locators",
  },
];
