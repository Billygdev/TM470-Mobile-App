import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Always start from login page
  await page.goto('http://localhost:8081/login');
});

test.describe('Create Travel Event Flow', () => {
  test('should allow organizer to log in and create a travel event', async ({ page }) => {
    // Log in
    await page.getByLabel('Email').fill('email@example.com');
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByRole('button', { name: 'Log In' }).click();

    // Expect redirect to home screen
    await page.waitForURL('**/');
    console.log(await page.content());
    await expect(page.getByTestId('home-screen-root')).toBeVisible();

    // Navigate to Create Event screen
    await page.getByRole('button', { name: 'Create Event' }).click();
    await expect(page.getByTestId('event-form-screen-root')).toBeVisible();

    // Fill event form
    await page.getByLabel('Event Title').fill('Champions League Away Trip');
    await page.getByLabel('Destination').fill('Madrid');
    await page.getByLabel('Pickup Location').fill('Old Trafford');
    await page.getByLabel('Pickup Date').fill('12/10/2025');
    await page.getByLabel('Pickup Time').fill('08:00');
    await page.getByLabel('Price').fill('150');
    await page.getByLabel('Seats Available').fill('40');
    await page.getByTestId('require-payment-checkbox').click();

    // Submit
    await page.getByTestId('create-button').click();

    // Expect success snackbar and back to home screen
    await expect(page.getByText(/Event created successfully!/i)).toBeVisible();
    await expect(page.getByTestId('home-screen-root')).toBeVisible();
  });

  test('should show error if required fields are empty', async ({ page }) => {
    // Log in
    await page.getByLabel('Email').fill('email@example.com');
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByRole('button', { name: 'Log In' }).click();

    // Expect redirect to home screen
    await page.waitForURL('**/');
    await expect(page.getByTestId('home-screen-root')).toBeVisible();

    // Navigate to Create Event screen
    await page.getByRole('button', { name: 'Create Event' }).click();
    await expect(page.getByTestId('event-form-screen-root')).toBeVisible();

    // Leave fields empty and submit
    await page.getByTestId('create-button').click();

    // Expect error message
    await expect(page.getByText(/All fields are required./i)).toBeVisible();
  });

  test('should show error if price is not a number', async ({ page }) => {
    // Log in
    await page.getByLabel('Email').fill('email@example.com');
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByRole('button', { name: 'Log In' }).click();

    // Expect redirect to home screen
    await page.waitForURL('**/');
    await expect(page.getByTestId('home-screen-root')).toBeVisible();

    // Navigate to Create Event screen
    await page.getByRole('button', { name: 'Create Event' }).click();
    await expect(page.getByTestId('event-form-screen-root')).toBeVisible();

    // Fill event form (invalid)
    await page.getByLabel('Event Title').fill('Friendly Match');
    await page.getByLabel('Destination').fill('London');
    await page.getByLabel('Pickup Location').fill('Etihad Stadium');
    await page.getByLabel('Pickup Date').fill('01/09/2025');
    await page.getByLabel('Pickup Time').fill('10:00');
    await page.getByLabel('Price').fill('free'); // invalid
    await page.getByLabel('Seats Available').fill('20');

    // Submit
    await page.getByTestId('create-button').click();

    // Expect error message
    await expect(page.getByText(/Price must be a number./i)).toBeVisible();
  });

  test('should show error if seats available is not a whole number', async ({ page }) => {
    // Log in
    await page.getByLabel('Email').fill('email@example.com');
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByRole('button', { name: 'Log In' }).click();

    // Expect redirect to home screen
    await page.waitForURL('**/');
    await expect(page.getByTestId('home-screen-root')).toBeVisible();

    // Navigate to Create Event screen
    await page.getByRole('button', { name: 'Create Event' }).click();
    await expect(page.getByTestId('event-form-screen-root')).toBeVisible();

    // Fill event form (invalid)
    await page.getByLabel('Event Title').fill('League Away Day');
    await page.getByLabel('Destination').fill('Liverpool');
    await page.getByLabel('Pickup Location').fill('Anfield');
    await page.getByLabel('Pickup Date').fill('05/11/2025');
    await page.getByLabel('Pickup Time').fill('09:30');
    await page.getByLabel('Price').fill('50');
    await page.getByLabel('Seats Available').fill('20.5'); // invalid decimal

    // Submit
    await page.getByTestId('create-button').click();

    // Expect error message
    await expect(page.getByText(/Seats available must be a whole number./i)).toBeVisible();
  });
});
