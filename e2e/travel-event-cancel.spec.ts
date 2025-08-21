import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Start from login page
  await page.goto('http://localhost:8081/login');

  /// Login
  await page.getByLabel('Email').fill('email@example.com');
  await page.getByLabel('Password', { exact: true }).fill('password123');
  await page.getByRole('button', { name: 'Log In' }).click();

  // Wait for home screen
  await page.waitForURL('**/');
  console.log(await page.content());
  await expect(page.getByTestId('home-screen-root')).toBeVisible();

  // Navigate to search events (expo-router tab)
  await page.getByRole('tab', { name: 'Search Travel Events' }).click();
  await expect(page.getByTestId('travel-events-search-root')).toBeVisible();

  // Click the first event card
  const firstEvent = page.getByTestId(/event-card-/).first();
  await firstEvent.click();

  // Wait for details screen
  await page.waitForURL('**/');
  await expect(page.getByTestId('event-details-screen-root')).toBeVisible();

  // Click edit (pencil)
  await page.getByRole('button', { name: 'Edit Event' }).click();
  await expect(page.getByTestId('event-form-screen-root')).toBeVisible();
});

test.describe('Cancel Travel Event Flow', () => {
  test('should not cancel if confirmation dialog is dismissed', async ({ page }) => {
    // Press cancel event button
    await page.getByTestId('cancel-button').click();

    // NOTE - dialog defaults to cancel in Playwright

    // Still on edit form
    await expect(page.getByTestId('event-form-screen-root')).toBeVisible();

    // No cancellation snackbar visible
    await expect(
      page.getByText(/Your event has been cancelled./i)
    ).not.toBeVisible();
  });

  test('should allow organizer to cancel a travel event', async ({ page }) => {
    // Register dialog to accept
    page.on('dialog', dialog => dialog.accept());

    // Press cancel event button
    await page.getByTestId('cancel-button').click();

    // Show cancellation success snackbar
    await expect(page.getByText(/Your event has been cancelled./i)).toBeVisible();

    // Redirect back to home screen
    await page.waitForURL('**/');
    console.log(await page.content());
    await expect(page.getByTestId('home-screen-root').first()).toBeVisible();
  });
});
