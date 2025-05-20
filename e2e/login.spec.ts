import { test, expect, Page } from '@playwright/test';

test('should allow a user to complete a purchase with credit card', async ({ page }: { page: Page }) => {
  // --- Login Flow ---
  await test.step('Login', async () => {
    // Navigate to the home page
    await page.goto('/'); 

    // Click the "Get Started" button/link to go to the login page
    // TODO: Verify selector for "Get Started" button/link on the home page.
    await page.locator('button:has-text("Get Started")').click(); 
    await page.waitForURL('/login');

    // We are now on the /login page, which initially shows options.
    // Click the "Be a Member" button to show the login form.
    // TODO: Verify selector for "Be a Member" button on the login page.
    await page.locator('button:has-text("Be a Member")').click();

    // Wait for the login form title to appear
    await expect(page.locator('text="Member Login"')).toBeVisible();

    // Fill in the login form using IDs
    // TODO: Verify IDs for username/email and password input fields.
    await page.fill('input#username', 'dineth'); // Use provided username and actual ID
    await page.fill('input#password', 'dineth123'); // Use provided password and actual ID

    // Click the login button
    // TODO: Verify selector for the "Sign In" button on the login form.
    await page.locator('button[type="submit"]:has-text("Sign In")').click(); 

    // Assert that the user is redirected to the products page after successful login
    await page.waitForURL('/products');
    await expect(page).toHaveURL('http://localhost:3000/products'); 
  });

  // --- Add Product to Wishlist ---
  await test.step('Add Product to Wishlist', async () => {
    // Assuming we are now on the /products page
    // Select the first product card and click its Wishlist button
    // TODO: Verify this selector matches a single product card element on the products page.
    // A more robust selector might target a div with a specific product card class.
    await page.locator('.grid a').first().locator('button:has-text("Wishlist")').click();

    // Wait for confirmation (e.g., a toast or alert) - Playwright handles alerts.
    // If using a toast, you might need a more specific wait (e.g., wait for toast element to be visible).
    await page.waitForTimeout(500); // Small pause after clicking (adjust if needed)
  });

  // --- Move from Wishlist to Cart ---
  await test.step('Move from Wishlist to Cart', async () => {
    // Navigate to the wishlist page
    await page.goto('/wishlist');
    await page.waitForURL('/wishlist');

    // Wait for the wishlist items to load
    await expect(page.locator('text="Your Wishlist"')).toBeVisible();
    // Wait for at least one wishlist item to be visible
    // TODO: Verify this selector matches a single wishlist item element.
    // It likely targets a div wrapping the wishlist item content.
    await expect(page.locator('.grid > div').first()).toBeVisible();

    // Add the first item in the wishlist to the cart
    // TODO: Verify selector for the "Add to Cart" button within a wishlist item.
    await page.locator('.grid > div').first().locator('button:has-text("Add to Cart")').click();

    // Wait for confirmation (e.g., a toast or alert)
    await page.waitForTimeout(500); // Small pause after clicking (adjust if needed)
  });

  // --- Proceed to Checkout ---
  await test.step('Proceed to Checkout', async () => {
    // Navigate to the cart page
    await page.goto('/cart');
    await page.waitForURL('/cart');

    // Wait for the cart items/summary to load
    await expect(page.locator('text="Your Cart"')).toBeVisible();
    // Wait for at least one item in the cart using a simpler selector.
    // TODO: Verify this selector matches a common element within a cart item.
    await expect(page.locator('.flex.items-center.justify-between.mt-4').first()).toBeVisible();

    // Proceed to Checkout button
    // TODO: Verify this selector for the "Proceed to Checkout" button.
    await page.locator('button:has-text("Proceed to Checkout")').click();
    await page.waitForURL('/checkout');

    // Assert that the user is on the checkout page
    await expect(page).toHaveURL('http://localhost:3000/checkout');
  });

  // --- Checkout and Payment ---
  await test.step('Complete Payment', async () => {
    // Fill in Shipping Address
    // TODO: Verify IDs for shipping address input fields.
    await page.fill('input#street', '123 Test St');
    await page.fill('input#city', 'Test City');
    await page.fill('input#state', 'Test State');
    await page.fill('input#zipCode', '12345');
    await page.fill('input#country', 'Test Country');

    // Wait for the Payment Method section to be visible
    await expect(page.locator('text="Payment Method"')).toBeVisible();

    // Select Credit Card payment method (already selected by default, but good to explicitly select in test)
    // Based on the Select component structure in app/checkout/page.tsx
    // If Credit Card is not the default or you have multiple options, uncomment and adjust these lines:
    // await page.locator('button[role="combobox"]').click(); // Click the select trigger
    // await page.locator('div[role="option"]:has-text("Credit Card")').click(); // Select the option

    // Wait for the client secret to be fetched and the Stripe Payment Element iframe to appear
    // This requires the /api/create-payment-intent call to complete successfully.
    await page.waitForResponse(response => 
      response.url().includes('/api/create-payment-intent') && response.status() === 200
    , { timeout: 25000 }); // Increased timeout for API response wait

    // Wait for the Stripe Payment Element iframe to appear after the API response
    // Increased timeout further as the iframe might take longer to render.
    await expect(page.locator('.stripe-elements-iframe')).toBeVisible({ timeout: 20000 }); // Increased timeout again

    // Fill in Stripe test card details in the iframe
    // Note: Interacting with iframes requires using frameLocator
    const cardDetailsFrame = page.frameLocator('.stripe-elements-iframe'); // Selector for the iframe containing card inputs

    // TODO: Verify selectors for card number, expiry date, CVC, and zip in the Stripe iframe if default ones don't work.
    // These are standard Stripe Elements selectors.
    await cardDetailsFrame.locator('input[name="cardnumber"]').fill('4242424242424242'); // Test card number (Visa)
    await cardDetailsFrame.locator('input[name="exp-date"]').fill('12/25'); // Test expiry date
    await cardDetailsFrame.locator('input[name="cvc"]').fill('123'); // Test CVC
    await cardDetailsFrame.locator('input[name="postal-code"]').fill('12345'); // Test Zip Code

    // Click the Pay Now button to submit the Stripe payment
    // TODO: Verify selector for the "Pay Now" button on the checkout page (within the Stripe form section).
    await page.locator('button[type="button"]:has-text("Pay Now")').click(); 

    // Wait for the redirect to the orders page after successful payment
    // The confirmation page logic creates the order and then redirects to /orders.
    await page.waitForURL('/orders', { timeout: 40000 }); // Increased timeout for backend processing/redirect
    await expect(page).toHaveURL('http://localhost:3000/orders', { timeout: 5000 }); // Final assertion on URL

    // --- Verification on Orders Page (Optional) ---
    // You could add assertions here to verify the new order appears in the list.
    // await expect(page.locator('text=Order #')).toBeVisible(); // Example: Look for an order number identifier
  });

}); 