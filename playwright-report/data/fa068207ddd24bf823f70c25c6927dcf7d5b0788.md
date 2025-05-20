# Test info

- Name: should allow a user to complete a purchase with credit card
- Location: C:\Users\Cooray\Downloads\mandalapppp\New folder\mandala-frontend\e2e\login.spec.ts:3:5

# Error details

```
Error: expect(locator).toBeVisible()

Locator: locator('.stripe-elements-iframe')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 20000ms
  - waiting for locator('.stripe-elements-iframe')

    at C:\Users\Cooray\Downloads\mandalapppp\New folder\mandala-frontend\e2e\login.spec.ts:118:59
    at C:\Users\Cooray\Downloads\mandalapppp\New folder\mandala-frontend\e2e\login.spec.ts:92:3
```

# Page snapshot

```yaml
- button "Open Next.js Dev Tools":
  - img
- alert
- img
- paragraph: Shipping
- img
- paragraph: Payment
- img
- paragraph: Confirmation
- img
- heading "Shipping Address" [level=3]
- text: Street Address
- textbox "Street Address": 123 Test St
- text: City
- textbox "City": Test City
- text: State
- textbox "State": Test State
- text: ZIP Code
- textbox "ZIP Code": "12345"
- text: Country
- textbox "Country": Test Country
- img
- heading "Payment Method" [level=3]
- text: Select Payment Method
- combobox:
  - img
  - text: Credit Card
- paragraph: Your payment information is encrypted and secure
- iframe
- button "Pay Now":
  - text: Pay Now
  - img
- img
- paragraph: Your information is protected with secure encryption
```

# Test source

```ts
   18 |
   19 |     // Wait for the login form title to appear
   20 |     await expect(page.locator('text="Member Login"')).toBeVisible();
   21 |
   22 |     // Fill in the login form using IDs
   23 |     // TODO: Verify IDs for username/email and password input fields.
   24 |     await page.fill('input#username', 'dineth'); // Use provided username and actual ID
   25 |     await page.fill('input#password', 'dineth123'); // Use provided password and actual ID
   26 |
   27 |     // Click the login button
   28 |     // TODO: Verify selector for the "Sign In" button on the login form.
   29 |     await page.locator('button[type="submit"]:has-text("Sign In")').click(); 
   30 |
   31 |     // Assert that the user is redirected to the products page after successful login
   32 |     await page.waitForURL('/products');
   33 |     await expect(page).toHaveURL('http://localhost:3000/products'); 
   34 |   });
   35 |
   36 |   // --- Add Product to Wishlist ---
   37 |   await test.step('Add Product to Wishlist', async () => {
   38 |     // Assuming we are now on the /products page
   39 |     // Select the first product card and click its Wishlist button
   40 |     // TODO: Verify this selector matches a single product card element on the products page.
   41 |     // A more robust selector might target a div with a specific product card class.
   42 |     await page.locator('.grid a').first().locator('button:has-text("Wishlist")').click();
   43 |
   44 |     // Wait for confirmation (e.g., a toast or alert) - Playwright handles alerts.
   45 |     // If using a toast, you might need a more specific wait (e.g., wait for toast element to be visible).
   46 |     await page.waitForTimeout(500); // Small pause after clicking (adjust if needed)
   47 |   });
   48 |
   49 |   // --- Move from Wishlist to Cart ---
   50 |   await test.step('Move from Wishlist to Cart', async () => {
   51 |     // Navigate to the wishlist page
   52 |     await page.goto('/wishlist');
   53 |     await page.waitForURL('/wishlist');
   54 |
   55 |     // Wait for the wishlist items to load
   56 |     await expect(page.locator('text="Your Wishlist"')).toBeVisible();
   57 |     // Wait for at least one wishlist item to be visible
   58 |     // TODO: Verify this selector matches a single wishlist item element.
   59 |     // It likely targets a div wrapping the wishlist item content.
   60 |     await expect(page.locator('.grid > div').first()).toBeVisible();
   61 |
   62 |     // Add the first item in the wishlist to the cart
   63 |     // TODO: Verify selector for the "Add to Cart" button within a wishlist item.
   64 |     await page.locator('.grid > div').first().locator('button:has-text("Add to Cart")').click();
   65 |
   66 |     // Wait for confirmation (e.g., a toast or alert)
   67 |     await page.waitForTimeout(500); // Small pause after clicking (adjust if needed)
   68 |   });
   69 |
   70 |   // --- Proceed to Checkout ---
   71 |   await test.step('Proceed to Checkout', async () => {
   72 |     // Navigate to the cart page
   73 |     await page.goto('/cart');
   74 |     await page.waitForURL('/cart');
   75 |
   76 |     // Wait for the cart items/summary to load
   77 |     await expect(page.locator('text="Your Cart"')).toBeVisible();
   78 |     // Wait for at least one item in the cart using a simpler selector.
   79 |     // TODO: Verify this selector matches a common element within a cart item.
   80 |     await expect(page.locator('.flex.items-center.justify-between.mt-4').first()).toBeVisible();
   81 |
   82 |     // Proceed to Checkout button
   83 |     // TODO: Verify this selector for the "Proceed to Checkout" button.
   84 |     await page.locator('button:has-text("Proceed to Checkout")').click();
   85 |     await page.waitForURL('/checkout');
   86 |
   87 |     // Assert that the user is on the checkout page
   88 |     await expect(page).toHaveURL('http://localhost:3000/checkout');
   89 |   });
   90 |
   91 |   // --- Checkout and Payment ---
   92 |   await test.step('Complete Payment', async () => {
   93 |     // Fill in Shipping Address
   94 |     // TODO: Verify IDs for shipping address input fields.
   95 |     await page.fill('input#street', '123 Test St');
   96 |     await page.fill('input#city', 'Test City');
   97 |     await page.fill('input#state', 'Test State');
   98 |     await page.fill('input#zipCode', '12345');
   99 |     await page.fill('input#country', 'Test Country');
  100 |
  101 |     // Wait for the Payment Method section to be visible
  102 |     await expect(page.locator('text="Payment Method"')).toBeVisible();
  103 |
  104 |     // Select Credit Card payment method (already selected by default, but good to explicitly select in test)
  105 |     // Based on the Select component structure in app/checkout/page.tsx
  106 |     // If Credit Card is not the default or you have multiple options, uncomment and adjust these lines:
  107 |     // await page.locator('button[role="combobox"]').click(); // Click the select trigger
  108 |     // await page.locator('div[role="option"]:has-text("Credit Card")').click(); // Select the option
  109 |
  110 |     // Wait for the client secret to be fetched and the Stripe Payment Element iframe to appear
  111 |     // This requires the /api/create-payment-intent call to complete successfully.
  112 |     await page.waitForResponse(response => 
  113 |       response.url().includes('/api/create-payment-intent') && response.status() === 200
  114 |     , { timeout: 25000 }); // Increased timeout for API response wait
  115 |
  116 |     // Wait for the Stripe Payment Element iframe to appear after the API response
  117 |     // Increased timeout further as the iframe might take longer to render.
> 118 |     await expect(page.locator('.stripe-elements-iframe')).toBeVisible({ timeout: 20000 }); // Increased timeout again
      |                                                           ^ Error: expect(locator).toBeVisible()
  119 |
  120 |     // Fill in Stripe test card details in the iframe
  121 |     // Note: Interacting with iframes requires using frameLocator
  122 |     const cardDetailsFrame = page.frameLocator('.stripe-elements-iframe'); // Selector for the iframe containing card inputs
  123 |
  124 |     // TODO: Verify selectors for card number, expiry date, CVC, and zip in the Stripe iframe if default ones don't work.
  125 |     // These are standard Stripe Elements selectors.
  126 |     await cardDetailsFrame.locator('input[name="cardnumber"]').fill('4242424242424242'); // Test card number (Visa)
  127 |     await cardDetailsFrame.locator('input[name="exp-date"]').fill('12/25'); // Test expiry date
  128 |     await cardDetailsFrame.locator('input[name="cvc"]').fill('123'); // Test CVC
  129 |     await cardDetailsFrame.locator('input[name="postal-code"]').fill('12345'); // Test Zip Code
  130 |
  131 |     // Click the Pay Now button to submit the Stripe payment
  132 |     // TODO: Verify selector for the "Pay Now" button on the checkout page (within the Stripe form section).
  133 |     await page.locator('button[type="button"]:has-text("Pay Now")').click(); 
  134 |
  135 |     // Wait for the redirect to the orders page after successful payment
  136 |     // The confirmation page logic creates the order and then redirects to /orders.
  137 |     await page.waitForURL('/orders', { timeout: 40000 }); // Increased timeout for backend processing/redirect
  138 |     await expect(page).toHaveURL('http://localhost:3000/orders', { timeout: 5000 }); // Final assertion on URL
  139 |
  140 |     // --- Verification on Orders Page (Optional) ---
  141 |     // You could add assertions here to verify the new order appears in the list.
  142 |     // await expect(page.locator('text=Order #')).toBeVisible(); // Example: Look for an order number identifier
  143 |   });
  144 |
  145 | }); 
```