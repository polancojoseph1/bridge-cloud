import { test, expect } from '@playwright/test';

test('Empty state interactions', async ({ page }) => {
  await page.goto('http://localhost:3000/chat');
  await expect(page.getByRole('heading', { name: 'Bridge Cloud' })).toBeVisible();

  // Find chat input
  const input = page.getByRole('textbox', { name: 'Chat input' });
  await expect(input).toBeVisible();

  // Should have suggestions
  await expect(page.getByRole('button', { name: 'Explain a concept' })).toBeVisible();
});
