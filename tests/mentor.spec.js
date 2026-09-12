// @ts-check
const { test, expect } = require("@playwright/test");

const VIEWPORTS = [
  { name: "スマホ", width: 375, height: 812 },
  { name: "タブレット", width: 768, height: 1024 },
  { name: "PC", width: 1280, height: 800 },
];

test.describe("サンプル② CodeAsk LP（デザインカンプ再現）", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/mentor/");
  });

  test("タイトルと見出しがある", async ({ page }) => {
    await expect(page).toHaveTitle(/CodeAsk/);
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("必要なセクションがそろっている", async ({ page }) => {
    for (const id of ["about", "how-to", "skills"]) {
      await expect(page.locator(`section#${id}`)).toHaveCount(1);
    }
    await expect(page.locator("#about .feature-item")).toHaveCount(2);
    await expect(page.locator("#how-to .step-item")).toHaveCount(3);
    await expect(page.locator("#skills .skill-tag").first()).toBeVisible();
    await expect(page.locator("footer")).toContainText("架空の");
  });

  test("ページ内リンクの行き先が存在する", async ({ page }) => {
    const hrefs = await page
      .locator('a[href^="#"]:not([href="#"])')
      .evaluateAll((links) => links.map((a) => a.getAttribute("href")));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      await expect(page.locator(String(href))).toHaveCount(1);
    }
  });

  test("画像にはすべてalt属性がある", async ({ page }) => {
    await expect(page.locator("img:not([alt])")).toHaveCount(0);
  });

  for (const vp of VIEWPORTS) {
    test(`${vp.name}（幅${vp.width}px）で横スクロールが出ない`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("ヘッダーのロゴとナビがスマホでもPCでも表示される", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator(".logo")).toBeVisible();
    await expect(page.locator(".global-nav")).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator(".logo")).toBeVisible();
    await expect(page.locator(".global-nav")).toBeVisible();
  });

  test("使い方の3ステップに順番どおりの番号がある", async ({ page }) => {
    const steps = page.locator("#how-to .step-item");
    await expect(steps).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await expect(steps.nth(i)).toContainText(String(i + 1));
    }
  });

  test("スキル一覧に主要な言語が含まれる", async ({ page }) => {
    for (const skill of ["HTML", "CSS", "JavaScript"]) {
      await expect(page.locator("#skills")).toContainText(skill);
    }
  });
});
