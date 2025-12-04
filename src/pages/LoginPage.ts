import { Page, Locator, expect } from '@playwright/test';

export class LoginPage{
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly loginCredentials: Locator;
    readonly passwordCredentials: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByTestId('username');
        this.passwordInput = page.getByTestId('password');
        this.loginButton = page.getByTestId('login-button');
        this.errorMessage = page.locator('.error-message-container');
        this.loginCredentials = page.getByTestId('login-credentials');
        this.passwordCredentials = page.getByTestId('login-password');
    }

    async goTo() {
        await this.page.goto('/');
    }

    get isVisible() {
        return this.page.isVisible;
    }

    async fillUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }

    async login(username: string, password: string) {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLoginButton();
    }

    async getErrorMessageText() {
        return this.errorMessage.innerText();
    }

    async getLoginUsers() {
        const logins = await this.loginCredentials.innerText();

        return logins.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.includes('Accepted usernames')); 
    }

    async getPasswords() {
        const passwords = await this.passwordCredentials.innerText();
        
        return passwords.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.includes('Password for all users')); 
    }
}