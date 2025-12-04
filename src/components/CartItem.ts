import { Locator, expect } from '@playwright/test';

export class CartItem {
    readonly root: Locator;
    readonly name: Locator;
    readonly description: Locator;
    readonly price: Locator;
    readonly removeButton: Locator;

    constructor(root: Locator) {
        this.root = root;
        this.name = root.getByTestId('inventory-item-name');
        this.description = root.getByTestId('inventory-item-desc');
        this.price = root.getByTestId('inventory-item-price');
        this.removeButton = root.getByRole('button', { name: 'Remove' });
    }

    async getName() {
        return this.name.textContent();
    }

    async getDescription() {
        return this.description.textContent();
    }

    async getPriceText() {
        return this.price.textContent();
    }

    async getPriceValue() {
        const text = await this.getPriceText();
        if (!text) return NaN;
        return parseFloat(text.replace('$', '').trim());
    }

    async remove() {
        await this.removeButton.click();
      }

    async expectVisible() {
        await expect(this.root).toBeVisible();
    }

    async expectName(expected: string) {
        await expect(this.name).toHaveText(expected);
    }
}