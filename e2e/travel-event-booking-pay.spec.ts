import { expect, test } from '@playwright/test';

test.describe('Pay for Booking Flow', () => {
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
    await expect(page.getByTestId('home-screen-root')).toBeVisible();

    // Navigate to my bookings (expo-router tab)
    await page.getByRole('tab', { name: 'My Bookings' }).click();
    await expect(page.getByTestId('my-bookings-screen-root')).toBeVisible();
  });

  // Success Tests
  test('should allow paying directly from booking card', async ({ page }) => {
    // Pay from the first event card
    const firstCard = page.getByTestId(/card/).first();
    await firstCard.getByRole('button', { name: 'Pay Now' }).click();

    // Wait for payment modal
    await expect(page.getByTestId('payment-modal-root')).toBeVisible();

    // Fill out valid payment details
    await page.getByLabel('Name on Card').fill('Test User');
    await page.getByLabel('Card Number').fill('4242424242424242');
    await page.getByLabel('Expiry (MM/YY)').fill('12/30');
    await page.getByLabel('Security Code').fill('123');

    // Click pay
    await page.getByRole('button', { name: 'Pay' }).last().click();
    await expect(page.getByText(/Payment successful/i)).toBeVisible();
  });

  test('should allow paying from event details screen', async ({ page }) => {
    // Click the first event card
    const firstCard = page.getByTestId(/card/).first();
    await firstCard.click();

    await expect(page.getByTestId('event-details-screen-root')).toBeVisible();

    // Click pay now and wait for payment modal
    await page.getByRole('button', { name: 'Pay Now' }).click();
    await expect(page.getByTestId('payment-modal-root')).toBeVisible();

    // Fill out valid payment details
    await page.getByLabel('Name on Card').fill('Test User');
    await page.getByLabel('Card Number').fill('4242424242424242');
    await page.getByLabel('Expiry (MM/YY)').fill('12/30');
    await page.getByLabel('Security Code').fill('123');

    // Click pay
    await page.getByRole('button', { name: 'Pay' }).last().click();
    await expect(page.getByText(/Payment successful/i)).toBeVisible();
  });

  // Negative Tests
  test('should show error if fields are empty', async ({ page }) => {
    // Pay from the first event card
    const firstCard = page.getByTestId(/card/).first();
    await firstCard.getByRole('button', { name: 'Pay Now' }).click();

    // Wait for payment modal
    await expect(page.getByTestId('payment-modal-root')).toBeVisible();

    // Click pay without filling out any payment details
    await page.getByRole('button', { name: 'Pay' }).last().click();
    await expect(page.getByText(/All fields are required./i)).toBeVisible();
  });

  test('should show error if card number is invalid', async ({ page }) => {
    // Pay from the first event card
    const firstCard = page.getByTestId(/card/).first();
    await firstCard.getByRole('button', { name: 'Pay Now' }).click();

    // Wait for payment modal
    await expect(page.getByTestId('payment-modal-root')).toBeVisible();

    // Fill out invalid payment details
    await page.getByLabel('Name on Card').fill('Test User');
    await page.getByLabel('Card Number').fill('111'); // invalid
    await page.getByLabel('Expiry (MM/YY)').fill('12/30');
    await page.getByLabel('Security Code').fill('123');

    // Click pay
    await page.getByRole('button', { name: 'Pay' }).last().click();
    await expect(page.getByText(/Card number must be 16 digits./i)).toBeVisible();
  });

  test('should allow cancelling the modal', async ({ page }) => {
    // Pay from the first event card
    const firstCard = page.getByTestId(/card/).first();
    await firstCard.getByRole('button', { name: 'Pay Now' }).click();

    // Wait for payment modal
    await expect(page.getByTestId('payment-modal-root')).toBeVisible();

    // Click cancel on modal
    await page.getByRole('button', { name: 'Cancel' }).last().click();
    await expect(page.getByText(/Payment cancelled./i)).toBeVisible();
  });
});
