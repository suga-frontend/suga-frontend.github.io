// @ts-check
const { test, expect } = require("@playwright/test");

test("トップページから作品に移動できる", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/ポートフォリオ/);
  const link = page.locator('a[href="cafe/"]');
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/cafe\/$/);
});

test("トップページから2件目の作品にも移動できる", async ({ page }) => {
  await page.goto("/");
  const link = page.locator('a[href="mentor/"]');
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/mentor\/$/);
});

test("制作実績カードにプレビュー画像とタグがある", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator(".work-card");
  await expect(cards).toHaveCount(2);
  for (let i = 0; i < 2; i++) {
    await expect(cards.nth(i).locator("img")).toBeVisible();
    await expect(cards.nth(i).locator(".tags li").first()).toBeVisible();
  }
});

test("画像にはすべてalt属性がある", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("img:not([alt])")).toHaveCount(0);
});

for (const vp of [
  { name: "スマホ", width: 375, height: 812 },
  { name: "PC", width: 1280, height: 800 },
]) {
  test(`トップページは${vp.name}（幅${vp.width}px）で横スクロールが出ない`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
