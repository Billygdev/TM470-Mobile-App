import { expect, test } from '@playwright/test';

test.describe('Cancel Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Always start from login page
    await page.goto('http://localhost:8081/login');

    // Log in
    await page.getByLabel('Email').fill('email@example.com');
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByRole('button', { name: 'Log In' }).click();

    // Expect redirect to home screen
    await page.waitForURL('**/');
    console.log(await page.content());
    await expect(page.getByTestId('home-screen-root').first()).toBeVisible();

    // Navigate to my bookings (expo-router tab)
    await page.getByRole('tab', { name: 'My Bookings' }).click();
    await expect(page.getByTestId('my-bookings-screen-root')).toBeVisible();
  });

  // Success Tests
  test('should allow cancelling booking directly from card', async ({ page }) => {
    // Listen for confirm dialog and accept
    page.on('dialog', dialog => dialog.accept());

    // Cancel from the first event card
    const firstCard = page.getByTestId(/card/).first();
    await firstCard.getByRole('button', { name: 'Cancel Booking' }).click();

    // Expect success snackbar
    await expect(page.getByText(/Your booking for/i)).toBeVisible();
  });

  test('should allow cancelling booking from event details screen', async ({ page }) => {
    // Click the first event card
    const firstCard = page.getByTestId(/card/).first();
    await firstCard.click();

    await expect(page.getByTestId('event-details-screen-root')).toBeVisible();

    // Listen for confirm dialog and accept
    page.on('dialog', dialog => dialog.accept());

    // Cancel from details screen
    await page.getByRole('button', { name: 'Cancel Booking' }).click();

    // Expect success snackbar
    await expect(page.getByText(/Your booking for/i)).toBeVisible();
  });

  // Negative Tests
  test('should not cancel booking if dialog is dismissed', async ({ page }) => {
    // Listen for confirm dialog and dismiss
    page.on('dialog', dialog => dialog.dismiss());

    // Attempt to cancel booking
    const firstCard = page.getByTestId(/card/).first();
    await firstCard.getByRole('button', { name: 'Cancel Booking' }).click();

    // Expect no cancellation snackbar
    await expect(page.getByText(/Your booking for/i)).not.toBeVisible();

    // Still on My Bookings screen
    await expect(page.getByTestId('my-bookings-screen-root')).toBeVisible();
  });
});
