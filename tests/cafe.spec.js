// @ts-check
const { test, expect } = require("@playwright/test");

const VIEWPORTS = [
  { name: "スマホ", width: 375, height: 812 },
  { name: "タブレット", width: 768, height: 1024 },
  { name: "PC", width: 1280, height: 800 },
];

test.describe("サンプル① カフェLP", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cafe/");
  });

  test("タイトルと見出しがある", async ({ page }) => {
    await expect(page).toHaveTitle(/喫茶こもれび/);
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("必要なセクションがそろっている", async ({ page }) => {
    for (const id of ["about", "menu", "access"]) {
      await expect(page.locator(`section#${id}`)).toHaveCount(1);
    }
    await expect(page.locator("#menu .menu-item")).toHaveCount(6);
    await expect(page.locator("#access")).toContainText("営業時間");
    await expect(page.locator("footer")).toContainText("架空の店舗");
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

  test("スマホではメニューボタンでナビが開閉する", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const button = page.locator(".menu-toggle");
    const nav = page.locator("#global-nav");
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(nav).toBeHidden();
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(nav).toBeVisible();
    await nav.locator("a").first().click();
    await expect(nav).toBeHidden();
  });

  test("PCではメニューボタンが出ず、ナビが常に見える", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator(".menu-toggle")).toBeHidden();
    await expect(page.locator("#global-nav")).toBeVisible();
  });
});
