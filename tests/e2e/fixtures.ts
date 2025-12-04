import { test as base } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';

export const test = base.extend<{
  loggedPage: import('@playwright/test').Page;
}>({
  loggedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.goTo();
    const users = await loginPage.getLoginUsers();
    const password= await loginPage.getPasswords();
    await loginPage.login(users[0], password[0]);

    await use(page);
  },
});

export const expect = test.expect;