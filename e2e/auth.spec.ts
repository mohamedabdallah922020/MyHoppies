import { expect, test } from "@playwright/test";

const EMAIL =
  process.env.SEED_USER_EMAIL ??
  process.env.PLAYWRIGHT_TEST_EMAIL ??
  "dev@myhoppies.local";
const PASSWORD =
  process.env.SEED_USER_PASSWORD ??
  process.env.PLAYWRIGHT_TEST_PASSWORD ??
  "devpassword123";

test.describe("login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("shows validation for empty submit", async ({ page }) => {
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText(/Email is required/i).first()).toBeVisible();
    await expect(page.getByText(/Password is required/i).first()).toBeVisible();
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill("definitely_wrong_pass_999");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(
      page
        .getByRole("alert")
        .filter({ hasText: /Invalid email or password/i }),
    ).toBeVisible();
  });

  test("redirects to dashboard after successful sign-in", async ({ page }) => {
    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/dashboard**");
    await expect(
      page.getByRole("heading", { level: 1, name: "Dashboard" }),
    ).toBeVisible();
  });
});
