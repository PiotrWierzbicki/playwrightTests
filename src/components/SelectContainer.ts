import { Locator, expect } from '@playwright/test';

export class SelectContainer {
    readonly root: Locator;
    readonly activeOption: Locator;
    readonly select: Locator;

    constructor(root: Locator) {
        this.root = root;
        this.activeOption = root.getByTestId('active-option');
        this.select = root.getByTestId('product-sort-container');
    }

    async selectByValue(value: string) {
        await this.select.selectOption(value);
    }

    async selectByLabel(label: string) {
        await this.select.selectOption({ label });
    }

    async getActiveOption(): Promise<string | null> {
        return this.activeOption.textContent();
    }

    async expectActiveOption(expected: string) {
        await expect(this.activeOption).toHaveText(expected);
    }
}