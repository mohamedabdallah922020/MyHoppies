import { expect, test } from "@playwright/test";

const uniqueEmail = () =>
  `register-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@myhoppies.local`;

test.describe("register", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("shows validation for empty submit", async ({ page }) => {
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText(/Name is required/i).first()).toBeVisible();
    await expect(page.getByText(/Email is required/i).first()).toBeVisible();
    await expect(page.getByText(/Password is required/i).first()).toBeVisible();
    await expect(
      page.getByText(/Please confirm your password/i).first(),
    ).toBeVisible();
  });

  test("shows error when passwords do not match", async ({ page }) => {
    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill(uniqueEmail());
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await page.getByLabel("Confirm password").fill("different123");
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText(/Passwords do not match/i).first()).toBeVisible();
  });

  test("shows password strength indicator while typing", async ({ page }) => {
    await page.getByLabel("Password", { exact: true }).fill("abc");
    await expect(page.getByText(/Password strength:/i)).toBeVisible();
    await page.getByLabel("Password", { exact: true }).fill("Str0ng!Pass");
    await expect(page.getByText(/Strong|Good|Fair|Weak/i).first()).toBeVisible();
  });

  test("registers a new user and redirects to login with success", async ({
    page,
  }) => {
    const email = uniqueEmail();
    const password = "NewUserPass123!";

    await page.getByLabel("Name").fill("Playwright User");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByLabel("Confirm password").fill(password);
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(
      page.getByText(/account was created successfully/i),
    ).toBeVisible();

    await page.waitForURL("**/login?registered=1**");
    await expect(
      page.getByText(/Account created successfully/i),
    ).toBeVisible();

    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/dashboard**");
    await expect(
      page.getByRole("heading", { level: 1, name: "Dashboard" }),
    ).toBeVisible();
  });

  test("links back to login", async ({ page }) => {
    await page.getByRole("link", { name: "Sign in" }).click();
    await page.waitForURL("**/login**");
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });
});
