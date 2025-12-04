import { Page, Locator, expect } from '@playwright/test';

export class CheckoutStepOnePage {
    readonly page: Page;
    readonly title: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByText('Checkout: Your Information');
        this.firstNameInput = page.getByTestId('firstName');
        this.lastNameInput = page.getByTestId('lastName');
        this.postalCodeInput = page.getByTestId('postalCode');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    }

    async assertOnPage() {
        await expect(this.page).toHaveURL(/checkout-step-one\.html$/);
        await expect(this.title).toBeVisible();
    }

    async fillForm(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async continue() {
        await this.continueButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    async completeStep(firstName: string, lastName: string, postalCode: string) {
        await this.fillForm(firstName, lastName, postalCode);
        await this.continue();
    }
}