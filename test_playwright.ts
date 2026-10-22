import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Disable Clerk authentication locally to test easier
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    if (url.includes('api.clerk.com') || url.includes('/sign-in') || url.includes('/sign-up')) {
      await route.continue(); // Handle clerk correctly
    } else {
      await route.continue();
    }
  });

  // Inject a mock auth state if needed, or bypass auth via Clerk configuration
  // For local tests, auth might be disabled or bypassable
  await page.goto('http://localhost:3000/chat');

  console.log("Page loaded");

  await browser.close();
})();
