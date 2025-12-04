import { test, expect } from './fixtures';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage, sortLabels } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutStepOnePage } from '../../src/pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../src/pages/CheckoutStepTwoPage';
import { InventoryItem } from '../../src/components/InventoryItem';

test('User Can Buy an Item - Happy Path', async ({ loggedPage }) => {
  const loginPage = new LoginPage(loggedPage);
  const inventoryPage = new InventoryPage(loggedPage);
  const cartPage = new CartPage(loggedPage);
  const checkoutStepOne = new CheckoutStepOnePage(loggedPage);
  const checkoutStepTwo = new CheckoutStepTwoPage(loggedPage);

  await inventoryPage.assertOnPage();

  // Add item to the cart
  const productName = 'Sauce Labs Backpack';
  await inventoryPage.addToCart(productName);

  // Go to cart and check there is selected item in it
  await inventoryPage.openYourCart();
  await cartPage.assertOnPage();
  const cartItem = cartPage.getItemByName(productName);
  await cartItem.expectVisible();
  await cartItem.expectName(productName);

  // Checkout – step 1 
  await cartPage.proceedToCheckout();
  await checkoutStepOne.assertOnPage();
  await checkoutStepOne.completeStep('Jan', 'Kowalski', '00-001');

  // Checkout – step 2
  await checkoutStepTwo.assertOnPage();
  const summaryItem = checkoutStepTwo.getItemByName(productName);
  await summaryItem.expectVisible();

  await checkoutStepTwo.finish();

  // Checkout Complete
  await expect(loggedPage).toHaveURL(/checkout-complete\.html$/);
  await expect(loggedPage.getByText('Thank you for your order!')).toBeVisible();
});

test('User Can Add and Remove Item From Cart', async ({ loggedPage }) => {
  const loginPage = new LoginPage(loggedPage);
  const inventoryPage = new InventoryPage(loggedPage);
  const cartPage = new CartPage(loggedPage);
  const productName = 'Sauce Labs Bike Light';

  // Login + Move To Inventory
  await loginPage.goTo();
  const users = await loginPage.getLoginUsers();
  const password= await loginPage.getPasswords();
  await loginPage.login(users[0], password[0]);
  await inventoryPage.assertOnPage();

  // Add to Cart and Move To It
  await inventoryPage.addToCart(productName);
  await inventoryPage.openYourCart();
  await cartPage.assertOnPage();

  // Make Sure That Item is In Cart
  let count = await cartPage.getItemsCount();
  expect(count).toBeGreaterThan(0);

  const cartItem = cartPage.getItemByName(productName);
  await cartItem.expectVisible();

  // Remove And Check It is Removed
  await cartItem.remove();
  count = await cartPage.getItemsCount();
  expect(count).toEqual(0)

  const allItemsText = await cartPage.cartItems.allTextContents();
  for (const text of allItemsText) {
    expect(text).not.toContain(productName);
  }
});


test('Sort By Z -> A Works Good', async ({ loggedPage }) => {
  const loginPage = new LoginPage(loggedPage);
  const inventoryPage = new InventoryPage(loggedPage);

  await loginPage.goTo();
  const users = await loginPage.getLoginUsers();
  const password= await loginPage.getPasswords();
  await loginPage.login(users[0], password[0]);
  await inventoryPage.assertOnPage();

  const itemCount = await inventoryPage.items.count();

  // We collect the name as follows (A -> Z)
  const namesDefault: string[] = [];
  for (let i = 0; i < itemCount; i++) {
    const item = new InventoryItem(inventoryPage.items.nth(i));
    const name = await item.getName();
    if (name) {
      namesDefault.push(name.trim());
    }
  }

  // Sort and Save Expected Result
  const expectedDesc = [...namesDefault].sort().reverse();

  // Change sorting
  await inventoryPage.sort.selectByValue(sortLabels.nameZA);

  // Zbieramy nazwy po sortowaniu
  const namesAfter: string[] = [];
  for (let i = 0; i < itemCount; i++) {
    const item = new InventoryItem(inventoryPage.items.nth(i));
    const name = await item.getName();
    if (name) {
      namesAfter.push(name.trim());
    }
  }

  expect(namesAfter).toEqual(expectedDesc);
});

test('There is Error During Login With Wrong Data', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goTo();
  await loginPage.login('wrong_user', 'wrong_password');

  const errorMessage = await loginPage.getErrorMessageText();
  expect(errorMessage).toContain('Username and password do not match any user in this service');
});