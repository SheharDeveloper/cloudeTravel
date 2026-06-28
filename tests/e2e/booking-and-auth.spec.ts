import { test, expect } from '@playwright/test';

test.describe('CloudTravel - Booking and Authentication', () => {
  const testUser = {
    email: 'admin@example.com',
    password: 'password',
  };

  test.beforeEach(async ({ page }) => {
    // Clear storage before each test
    await page.context().clearCookies();
  });

  test('Login flow and authentication', async ({ page }) => {
    // Navigate to login
    await page.goto('/auth/login');
    await expect(page).toHaveTitle(/Login/i);

    // Take screenshot of login page
    await page.screenshot({ path: 'D:\\AIproject\\cloudtravel\\testcaseandimage\\01-login-page.png' });

    // Fill login form
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);

    // Take screenshot before submitting
    await page.screenshot({ path: 'D:\\AIproject\\cloudtravel\\testcaseandimage\\02-login-form-filled.png' });

    // Submit login
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard');

    // Verify auth token is in localStorage
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(token).toBeTruthy();

    console.log('✓ Login successful, token saved:', token?.substring(0, 20) + '...');

    // Take screenshot of dashboard
    await page.screenshot({ path: 'D:\\AIproject\\cloudtravel\\testcaseandimage\\03-dashboard-after-login.png' });
  });

  test('Admin bookings page access and API authentication', async ({ page, context }) => {
    // Login first
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // Navigate to admin bookings
    await page.goto('/admin/bookings');

    // Wait for bookings page to load
    await page.waitForURL('**/admin/bookings');
    await expect(page).toHaveTitle(/Booking/i);

    // Take screenshot of bookings page
    await page.screenshot({ path: 'D:\\AIproject\\cloudtravel\\testcaseandimage\\04-admin-bookings-page.png' });

    // Check if API is called with authentication
    const apiCallPromise = context.waitForEvent('request', request =>
      request.url().includes('/api/bookings')
    );

    // Reload to trigger API call
    await page.reload();

    const request = await apiCallPromise;

    // Verify Authorization header is present
    const authHeader = request.headerValue('Authorization');
    expect(authHeader).toBeTruthy();
    expect(authHeader).toMatch(/^Bearer /);

    console.log('✓ API called with Authorization header:', authHeader?.substring(0, 30) + '...');

    // Take screenshot of bookings with data
    await page.waitForSelector('table', { timeout: 5000 }).catch(() => null);
    await page.screenshot({ path: 'D:\\AIproject\\cloudtravel\\testcaseandimage\\05-bookings-table.png' });
  });

  test('Visa booking modal and form submission', async ({ page, context }) => {
    // Navigate to visa services
    await page.goto('/visa-services');
    await expect(page).toHaveTitle(/Visa/i);

    // Take screenshot of visa services
    await page.screenshot({ path: 'D:\\AIproject\\cloudtravel\\testcaseandimage\\06-visa-services.png' });

    // Click on a visa card
    const visaCard = page.locator('[data-testid="visa-card"]').first();
    if (await visaCard.isVisible()) {
      await visaCard.click();
      await page.waitForURL('**/visa/**');

      // Take screenshot of visa detail page
      await page.screenshot({ path: 'D:\\AIproject\\cloudtravel\\testcaseandimage\\07-visa-detail-page.png' });

      // Scroll to search form
      await page.locator('text=Search & Get Quote').scrollIntoViewIfNeeded();
      await page.screenshot({ path: 'D:\\AIproject\\cloudtravel\\testcaseandimage\\08-visa-search-form.png' });

      // Fill visa booking form
      const destinationSelect = page.locator('select, [role="combobox"]').first();
      if (await destinationSelect.isVisible()) {
        await destinationSelect.click();
        const option = page.locator('option, [role="option"]').first();
        await option.click();
      }

      // Submit the form
      await page.click('button:has-text("Submit"), button:has-text("Search")');

      // Wait for booking modal
      await page.waitForTimeout(1000);
      const modal = page.locator('[role="dialog"], .modal');
      if (await modal.isVisible()) {
        // Take screenshot of booking modal
        await page.screenshot({ path: 'D:\\AIproject\\cloudtravel\\testcaseandimage\\09-booking-modal.png' });

        // Fill contact form
        await page.fill('input[name="firstName"]', 'Test User');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('input[name="phone"]', '9876543210');

        // Take screenshot of filled form
        await page.screenshot({ path: 'D:\\AIproject\\cloudtravel\\testcaseandimage\\10-booking-form-filled.png' });

        // Intercept booking API call
        const bookingRequest = context.waitForEvent('request', request =>
          request.url().includes('/api/bookings') && request.method() === 'POST'
        );

        // Submit booking
        await page.click('button:has-text("Submit Booking")');

        try {
          const request = await bookingRequest;
          const postData = await request.postDataJSON();

          console.log('✓ Booking submitted with data:', {
            service: postData.service,
            name: postData.formData?.firstName,
            email: postData.formData?.email,
          });

          // Take screenshot of success message
          await page.waitForTimeout(2000);
          await page.screenshot({ path: 'D:\\AIproject\\cloudtravel\\testcaseandimage\\11-booking-success.png' });
        } catch (e) {
          console.log('Booking modal might have closed:', e);
        }
      }
    }
  });

  test('Sidebar navigation and route protection', async ({ page }) => {
    // Try to access admin page without login
    await page.goto('/admin/bookings');

    // Should redirect to login
    await page.waitForURL('**/auth/login');

    console.log('✓ Protected route correctly redirects to login');

    // Take screenshot of login redirect
    await page.screenshot({ path: 'D:\\AIproject\\cloudtravel\\testcaseandimage\\12-protected-route-redirect.png' });

    // Login
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // Now access admin page
    await page.goto('/admin/bookings');
    await expect(page).toHaveTitle(/Booking/i);

    console.log('✓ After login, admin page is accessible');

    // Take screenshot of successful access
    await page.screenshot({ path: 'D:\\AIproject\\cloudtravel\\testcaseandimage\\13-admin-access-granted.png' });
  });

  test('Verify API requires authentication', async ({ page, context }) => {
    // Make API request without auth
    const response = await page.request.get('/api/bookings');

    // Should get 302 redirect (not 200)
    expect(response.status()).toBe(302);

    console.log('✓ Unauthenticated API request returns 302 (redirect)');

    // Now login and retry
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // Get token from localStorage
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));

    // Make authenticated API request
    const authResponse = await page.request.get('/api/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    expect(authResponse.status()).toBe(200);

    console.log('✓ Authenticated API request returns 200 (success)');

    // Take screenshot showing API success
    await page.screenshot({ path: 'D:\\AIproject\\cloudtravel\\testcaseandimage\\14-api-auth-success.png' });
  });
});
