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
