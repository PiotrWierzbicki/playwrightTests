import { Page, Locator, expect } from '@playwright/test';
import { InventoryItem } from '../components/InventoryItem.ts';
import { SelectContainer } from '../components/SelectContainer';

export enum sortLabels {
    nameAZ = 'Name (A to Z)',
    nameZA = 'Name (Z to A)',
    priceLowToHigh = 'Price (low to high)',
    priceHighToLow = 'Price (high to low)'
}

export class InventoryPage {
    readonly page: Page;
    readonly items: Locator;
    readonly sort: SelectContainer;
    readonly cartLogo: Locator;

    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('.inventory_item');

        const sortRoot = page.locator('.select_container');
        this.sort = new SelectContainer(sortRoot);
        this.cartLogo = page.getByTestId('shopping-cart-link');
    }

    async assertOnPage() {
        await expect(this.page).toHaveURL(/inventory\.html/);
    }

    getItemByName(name: string): InventoryItem {
        const itemRoot = this.items.filter({
            has: this.page.locator('.inventory_item_name', { hasText: name }),
        });

        return new InventoryItem(itemRoot);
    }

    async addToCart(name: string) {
        const item = this.getItemByName(name);
        await item.addToCart();
    }

    async removeFromCart(name: string) {
        const item = this.getItemByName(name);
        await item.removeFromCart();
    }

    async openYourCart() {
        await this.cartLogo.click();
    }

    async getNumberOfSelectedItems() {
        return this.cartLogo.textContent();
    }
}