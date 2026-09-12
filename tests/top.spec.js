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
