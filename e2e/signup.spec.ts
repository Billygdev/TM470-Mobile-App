import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Always start from login page
  await page.goto('http://localhost:8081/login');
});

test.describe('Sign Up Flow', () => {
  test('should allow user to create an account', async ({ page }) => {
    // Navigate to signup screen
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await expect(page.getByTestId('signup-screen-root')).toBeVisible();

    // Generate unique email to avoid failing on subsequent runs
    const uniqueEmail = `testuser_${Date.now()}@example.com`;

    // Fill out valid signup form
    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel('Confirm Password', { exact: true }).fill('password123');

    // Submit
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Expect redirect to login page (router.push is done)
    await page.waitForURL('**/login');
    
    // Assert that the user lands on the home screen (auto redirected as authenticated)
    await expect(page.getByTestId('home-screen-root')).toBeVisible();
    await expect(page.getByText(/Welcome testuser/i)).toBeVisible();

    // Expect snackbar success message
    await expect(page.getByText(/Account created successfully!/i)).toBeVisible();
  });

  test('should show error if required fields are empty', async ({ page }) => {
    // Navigate to signup screen
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await expect(page.getByTestId('signup-screen-root')).toBeVisible();

    // Leave fields empty and click "Create Account"
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Expect validation error
    await expect(page.getByText(/All fields are required./i)).toBeVisible();

    // Ensure we remain on signup screen
    await expect(page.getByTestId('signup-screen-root')).toBeVisible();
  });

  test('should show error if passwords do not match', async ({ page }) => {
    // Navigate to signup screen
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await expect(page.getByTestId('signup-screen-root')).toBeVisible();

    // Fill mismatched passwords
    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Email').fill('testuser@example.com');
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByLabel('Confirm Password', { exact: true }).fill('differentpass');

    // Submit
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Expect error
    await expect(page.getByText(/Passwords do not match./i)).toBeVisible();

    // Ensure we remain on signup screen
    await expect(page.getByTestId('signup-screen-root')).toBeVisible();
  });
});