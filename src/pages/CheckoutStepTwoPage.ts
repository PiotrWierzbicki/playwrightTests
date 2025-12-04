import { Page, Locator, expect } from '@playwright/test';
import { CartItem } from '../components/CartItem';

export class CheckoutStepTwoPage {
    readonly page: Page;
    readonly title: Locator;
    readonly cartItems: Locator;
    readonly subtotalLabel: Locator;
    readonly taxLabel: Locator;
    readonly totalLabel: Locator;
    readonly finishButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByText('Checkout: Overview');
        this.cartItems = page.locator('.cart_item');
        this.subtotalLabel = page.locator('.summary_subtotal_label');
        this.taxLabel = page.locator('.summary_tax_label');
        this.totalLabel = page.locator('.summary_total_label');
        this.finishButton = page.getByRole('button', { name: 'Finish' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    }

    async assertOnPage() {
        await expect(this.page).toHaveURL(/checkout-step-two\.html$/);
        await expect(this.title).toBeVisible();
    }

    getItemByName(name: string): CartItem {
        const root = this.cartItems.filter({
            has: this.page.getByTestId('inventory-item-name').filter({hasText: name}),
        });

        return new CartItem(root);
    }

    async getTotalText(): Promise<string | null> {
        return this.totalLabel.textContent();
    }

    async finish() {
        await this.finishButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }
}