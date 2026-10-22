const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000/chat');

  await page.click('button:has-text("Write some code")');
  await page.waitForTimeout(1000);

  console.log('Sending message to get response...');
  await page.fill('textarea', 'Give me a very long response about quantum physics');

  // Wait for the response to start streaming
  await page.click('button[aria-label="Send message"]');
  await page.waitForTimeout(500);

  // Verify stop button appears and we can click it
  const isStopVisible = await page.isVisible('button[aria-label="Stop generation"]');
  console.log('Is stop button visible?', isStopVisible);

  await page.click('button[aria-label="Stop generation"]');
  await page.waitForTimeout(1000);

  // Verify it stops generating
  const isSendVisible = await page.isVisible('button[aria-label="Send message"]');
  console.log('Is send button visible after stopping?', isSendVisible);

  await browser.close();
})();
