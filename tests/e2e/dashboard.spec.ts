import { expect, test } from "@playwright/test";

test.describe("dashboard smoke", () => {
  test("redirects /dashboard to /dashboard/default and renders the shell", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard\/default$/);
    // Sidebar trigger is part of the shared dashboard chrome.
    await expect(page.getByRole("button", { name: /toggle sidebar/i })).toBeVisible();
  });

  test("theme attribute is applied before hydration (no FOUC)", async ({ page }) => {
    await page.goto("/dashboard/default");
    const html = page.locator("html");
    // ThemeBootScript should have set these data attributes before React hydrates.
    await expect(html).toHaveAttribute("data-theme-preset", /.+/);
    await expect(html).toHaveAttribute("data-sidebar-variant", /.+/);
  });
});
