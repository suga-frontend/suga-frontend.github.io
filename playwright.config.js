// @ts-check
const { defineConfig, devices } = require("@playwright/test");

// BASE_URL を指定すると公開中のサイトをテストする。指定がなければ手元でサーバーを立てる
const baseURL = process.env.BASE_URL || "http://localhost:4173";

module.exports = defineConfig({
  testDir: "./tests",
  use: { baseURL },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npx http-server . -p 4173 -c-1 --silent",
        url: "http://localhost:4173",
        reuseExistingServer: true,
      },
});
