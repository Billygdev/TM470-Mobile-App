import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Always start from login page
  await page.goto('http://localhost:8081/login');
});

test.describe('Edit Travel Event Flow', () => {
  test('should allow organizer to edit an event successfully', async ({ page }) => {
    // Login
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

    // Update fields
    await page.getByLabel('Event Title').fill('Updated Title');
    await page.getByLabel('Destination').fill('Berlin');
    await page.getByLabel('Pickup Location').fill('Airport');
    await page.getByLabel('Pickup Date').fill('11/12/2025');
    await page.getByLabel('Pickup Time').fill('08:30');
    await page.getByLabel('Price').fill('180');
    await page.getByLabel('Seats Available').fill('45');

    // Submit update
    await page.getByRole('button', { name: 'Update' }).click();

    // Back on details screen with updated values
    await expect(page.getByTestId('event-details-screen-root')).toBeVisible();
    
    await expect(
      page.getByTestId('event-details-screen-root').getByText('Updated Title')
    ).toBeVisible();

    await expect(
      page.getByTestId('event-details-screen-root').getByText('Berlin')
    ).toBeVisible();
  });

  test('should show error if required fields are empty when updating', async ({ page }) => {
    // Login
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

    // Click edit (pencil)
    await page.getByRole('button', { name: 'Edit Event' }).click();
    await expect(page.getByTestId('event-form-screen-root')).toBeVisible();

    // Clear fields
    await page.getByLabel('Event Title').fill('');
    await page.getByLabel('Destination').fill('');
    await page.getByLabel('Pickup Location').fill('');
    await page.getByLabel('Pickup Date').fill('');
    await page.getByLabel('Pickup Time').fill('');
    await page.getByLabel('Price').fill('');
    await page.getByLabel('Seats Available').fill('');

    // Submit update
    await page.getByRole('button', { name: 'Update' }).click();

    // Expect validation error
    await expect(page.getByText(/All fields are required./i)).toBeVisible();

    // Still on form
    await expect(page.getByTestId('event-form-screen-root')).toBeVisible();
  });
});
