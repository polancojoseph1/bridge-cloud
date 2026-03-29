const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('Navigating to http://localhost:3000/chat');
    await page.goto('http://localhost:3000/chat');

    // Flow 1: Suggestions
    console.log('Testing Flow 1: Suggestions');
    const suggestions = await page.locator('button:has-text("Explain a concept")').count();
    console.log(`Suggestions found: ${suggestions}`);
    if (suggestions > 0) {
      await page.click('button:has-text("Explain a concept")');
      await page.waitForTimeout(1000);
      const url = page.url();
      console.log(`URL after click: ${url}`);
      const messages = await page.locator('.animate-message-in').count();
      console.log(`Messages after click: ${messages}`);
    }

  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();
