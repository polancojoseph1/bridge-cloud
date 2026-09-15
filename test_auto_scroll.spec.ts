import { test, expect } from '@playwright/test';

test('Auto scroll stops on interaction', async ({ page }) => {
  await page.goto('http://localhost:3000/chat');
  await expect(page.getByRole('heading', { name: 'Bridge Cloud' })).toBeVisible();

  // Find chat input
  const input = page.getByRole('textbox', { name: 'Chat input' });

  // Fill first message
  await input.fill('Write a long text');
  await page.getByRole('button', { name: 'Send message' }).click();

  // Wait for streaming to start
  await page.waitForTimeout(1000);
});
