import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Always start from login page
  await page.goto('http://localhost:8081/login');
});

test.describe('Travel Event Booking Flow', () => {
  test('should show error if no seats entered', async ({ page }) => {
    // Login as traveller
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
    await expect(page.getByTestId('event-details-screen-root')).toBeVisible();

    // Click Join without seats
    await page.getByRole('button', { name: 'Join Event' }).click();

    // Expect validation error
    await expect(page.getByText(/Number of seats is required./i)).toBeVisible();
  });

  test('should show error if seats is not a number', async ({ page }) => {
    // Login as traveller
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
    await expect(page.getByTestId('event-details-screen-root')).toBeVisible();

    // Fill invalid seats
    await page.getByLabel('Number of Seats Required').fill('two');

    // Click Join
    await page.getByRole('button', { name: 'Join Event' }).click();

    // Expect validation error
    await expect(page.getByText(/Number of seats must be a whole number./i)).toBeVisible();
  });

  test('should show error if seats is zero or negative', async ({ page }) => {
    // Login as traveller
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
    await expect(page.getByTestId('event-details-screen-root')).toBeVisible();

    // Fill invalid seats
    await page.getByLabel('Number of Seats Required').fill('0');
    await page.getByRole('button', { name: 'Join Event' }).click();

    // Expect error
    await expect(page.getByText(/You must book at least 1 seat./i)).toBeVisible();
  });

  test('should allow traveller to log in and book seats on a travel event', async ({ page }) => {
    // Login as traveller
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
    await expect(page.getByTestId('event-details-screen-root')).toBeVisible();

    // Fill seats required
    await page.getByLabel('Number of Seats Required').fill('2');

    // Click Join Event
    await page.getByRole('button', { name: 'Join Event' }).click();

    // Expect success feedback (snackbar, or booking showing)
    await expect(
      page.getByText(/Booking saved, pending payment.|Instant payment is required.|Payment successful/i)
    ).toBeVisible();
  });
});