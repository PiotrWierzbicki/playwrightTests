import { Locator, expect } from '@playwright/test';

export class InventoryItem {
    readonly root: Locator;
    readonly name: Locator;
    readonly addToCartButton: Locator;
    readonly removeFromCartButton: Locator;
    readonly price: Locator;

    constructor(root: Locator) {
        this.root = root;
        this.name = root.locator('.inventory_item_name');
        this.addToCartButton = root.getByRole('button', { name: 'Add to cart' });
        this.removeFromCartButton = root.getByRole('button', { name: 'Remove' });
        this.price = root.locator('.inventory_item_price');
    }

    async getName(): Promise<string | null> {
        return this.name.textContent();
    }

    async getPrice(): Promise<string | null> {
        return this.price.textContent();
    }

    async addToCart() {
        await this.addToCartButton.click();
    }

    async removeFromCart() {
        await this.removeFromCartButton.click();
    }

    async expectInCart() {
        await expect(this.removeFromCartButton).toBeVisible();
    }
}