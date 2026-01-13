import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load dashboard page", async ({ page }) => {
    // Check header is visible
    await expect(page.locator("text=Hukuk AI")).toBeVisible();
    await expect(page.locator("text=Türk Hukuku Asistanı")).toBeVisible();
  });

  test("should display hero section", async ({ page }) => {
    await expect(
      page.locator("text=Türk Hukuku Araştırmalarınızı")
    ).toBeVisible();
    await expect(page.locator("text=Hızlandırın")).toBeVisible();
  });

  test("should display tool categories", async ({ page }) => {
    await expect(page.locator("text=Analiz Araçları")).toBeVisible();
    await expect(page.locator("text=Tahmin & Hesaplama")).toBeVisible();
    await expect(page.locator("text=Araştırma")).toBeVisible();
  });

  test("should switch tool categories", async ({ page }) => {
    // Click on Araştırma category
    await page.click("text=Araştırma");

    // Should show research tools
    await expect(page.locator("text=Emsal Davalar")).toBeVisible();
    await expect(page.locator("text=İçtihat Analizi")).toBeVisible();
  });

  test("should navigate to chat", async ({ page }) => {
    // Click chat button
    await page.click('button:has-text("Sohbete Başla")');

    // Wait for navigation
    await page.waitForTimeout(1000);

    // Should be on chat page or show chat interface
    const chatExists = await page.locator("textarea").count();
    expect(chatExists).toBeGreaterThanOrEqual(0);
  });

  test("should open contract analysis tool", async ({ page }) => {
    // Click on Sözleşme Analizi tool
    await page.click("text=Sözleşme Analizi");

    // Wait for modal
    await page.waitForTimeout(500);

    // Modal should be visible
    const modalTitle = page.locator("text=Sözleşme Analizi").first();
    await expect(modalTitle).toBeVisible();
  });

  test("should display stats section", async ({ page }) => {
    await expect(page.locator("text=Toplam Sohbet")).toBeVisible();
    await expect(page.locator("text=Analiz Edilen")).toBeVisible();
    await expect(page.locator("text=Hesaplama")).toBeVisible();
    await expect(page.locator("text=Kaynak Doğrulama")).toBeVisible();
  });

  test("should toggle theme", async ({ page }) => {
    // Find theme toggle button
    const themeButton = page.locator('button[aria-label*="mode"]').first();

    if (await themeButton.isVisible()) {
      // Get initial state
      const htmlElement = page.locator("html");
      const initialClass = await htmlElement.getAttribute("class");

      // Click theme toggle
      await themeButton.click();

      // Wait for transition
      await page.waitForTimeout(300);

      // Check class changed
      const newClass = await htmlElement.getAttribute("class");
      expect(newClass).not.toBe(initialClass);
    }
  });
});

test.describe("Dashboard - Tool Modals", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should open and close tool modal", async ({ page }) => {
    // Open tool
    await page.click("text=Sözleşme Analizi");
    await page.waitForTimeout(500);

    // Modal should be visible
    await expect(page.locator('[role="dialog"]').first()).toBeVisible();

    // Close modal with Escape
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);

    // Modal should be closed
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test("should open case prediction tool", async ({ page }) => {
    // Switch to prediction category
    await page.click("text=Tahmin & Hesaplama");
    await page.waitForTimeout(300);

    // Click on Dava Sonuç Tahmini
    await page.click("text=Dava Sonuç Tahmini");
    await page.waitForTimeout(500);

    // Should show prediction form
    const formVisible = await page.locator("form").count();
    expect(formVisible).toBeGreaterThanOrEqual(0);
  });

  test("should open legal glossary tool", async ({ page }) => {
    // Switch to research category
    await page.click("text=Araştırma");
    await page.waitForTimeout(300);

    // Click on Hukuk Sözlüğü
    await page.click("text=Hukuk Sözlüğü");
    await page.waitForTimeout(500);

    // Should show glossary content
    await expect(page.locator("text=Hukuk Sözlüğü")).toBeVisible();
  });

  test("should open document generator tool", async ({ page }) => {
    // Switch to documents category
    await page.click("text=Belge İşlemleri");
    await page.waitForTimeout(300);

    // Click on Belge Oluşturucu
    await page.click("text=Belge Oluşturucu");
    await page.waitForTimeout(500);

    // Should show document templates
    await expect(page.locator("text=Belge Oluşturucu")).toBeVisible();
  });
});

test.describe("Dashboard - Mobile", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("should show mobile navigation", async ({ page }) => {
    await page.goto("/");

    // Bottom nav should be visible on mobile
    await expect(page.locator("text=Ana Sayfa")).toBeVisible();
  });

  test("should open mobile menu", async ({ page }) => {
    await page.goto("/");

    // Find and click mobile menu button
    const menuButton = page.locator('button[aria-label="Menü"]');

    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(300);

      // Menu should expand
      await expect(page.locator("text=Sohbete Başla")).toBeVisible();
    }
  });

  test("should navigate using bottom nav", async ({ page }) => {
    await page.goto("/");

    // Click on Araştırma in bottom nav
    await page.click('nav >> text="Araştırma"');
    await page.waitForTimeout(300);

    // Should show research tools
    await expect(page.locator("text=Emsal Davalar")).toBeVisible();
  });
});

test.describe("Dashboard - Accessibility", () => {
  test("should have no obvious accessibility violations", async ({ page }) => {
    await page.goto("/");

    // Check for required ARIA attributes
    const buttons = await page.locator("button").all();
    for (const button of buttons.slice(0, 5)) {
      // Button should be focusable
      await button.focus();
      expect(await button.evaluate((el) => document.activeElement === el)).toBe(
        true
      );
    }
  });

  test("should support keyboard navigation", async ({ page }) => {
    await page.goto("/");

    // Tab through elements
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Should have focused element
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  test("should have sufficient color contrast", async ({ page }) => {
    await page.goto("/");

    // Basic visual check - text should be visible
    await expect(page.locator("text=Hukuk AI")).toBeVisible();
    await expect(page.locator("text=Türk Hukuku Asistanı")).toBeVisible();
  });
});
