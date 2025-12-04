import { Page, Locator, expect } from '@playwright/test';
import { CartItem } from '../components/CartItem';

export class CartPage {
    readonly page: Page;
    readonly cartItems: Locator;
    readonly title: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByText('Your Cart');
        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
      }

    async goto() {
        await this.page.goto('/cart.html');
    }

    async assertOnPage() {
        await expect(this.page).toHaveURL(/cart\.html$/);
        await expect(this.title).toBeVisible();
    }

    async getItemsCount() {
        return this.cartItems.count();
    }

    getItemByName(name: string): CartItem {
        const root = this.cartItems.filter({
            has: this.page.getByTestId('inventory-item-name').filter({ hasText: name })
        });

        return new CartItem(root);
    }

    async removeItemByName(name: string) {
        const item = this.getItemByName(name);
        await item.remove();
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
    }
}