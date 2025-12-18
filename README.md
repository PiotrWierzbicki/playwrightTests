# Saucedemo Playwright E2E Tests

End-to-end tests written in Playwright + TypeScript for the demo application
[https://www.saucedemo.com/](https://www.saucedemo.com/).

The project demonstrates a professional approach to UI test automation:

* Page Object Model (POM)
* Reusable UI components (InventoryItem, CartItem, SelectContainer)
* Business-focused scenarios (flows)
* GitHub Actions CI pipeline (API job + UI matrix + reports artifacts)

---

## ✅ What this project demonstrates

- Playwright E2E automation using TypeScript
- Page Object Model (POM) and reusable UI components
- API test automation using Playwright `request`
- Separation of API and UI test layers
- GitHub Actions CI with:
  - separate API and UI jobs
  - browser matrix (Chromium, Firefox, WebKit)
  - HTML reports and test artifacts

--- 

## 📁 Project structure

```text
saucedemo-playwright/
  ├─ src/
  │   ├─ pages/
  │   │   ├─ LoginPage.ts
  │   │   ├─ InventoryPage.ts
  │   │   ├─ CartPage.ts
  │   │   ├─ CheckoutStepOnePage.ts
  │   │   └─ CheckoutStepTwoPage.ts
  │   └─ components/
  │       ├─ InventoryItem.ts
  │       ├─ CartItem.ts
  │       └─ SelectContainer.ts
  ├─ tests/
  |   ├─ api/
  │   │   └─ booking-crud.spec.ts  
  |   └─ e2e/
  │       ├─ examples.spec.ts
  │       └─ fixtures.ts
  ├─ playwright.config.ts
  └─ package.json
```

---

## 🚀 How to run tests

Install dependencies once:

```bash
npm ci
```

Run all tests in headless mode:

```bash
npm test
```

Run tests in headed mode (browser visible):

```bash
npm run test:headed
```

Open the Playwright Test UI:

```bash
npm run test:ui
```

You can also use the Playwright CLI directly:

```bash
npx playwright test
npx playwright test tests/e2e/examples.spec.ts --project=chromium
```

Run only UI (E2E) tests:

```bash
npx playwright test --project=chromium --project=firefox --project=webkit
```

---

## 🧪 Main test scenarios

### ✓ 1. Full purchase flow (happy path)

* login
* add product to cart
* proceed through checkout step one
* proceed through checkout step two
* verify order confirmation

### ✓ 2. Add and remove product from cart

* add product
* verify it appears in the cart
* remove product
* verify it no longer appears in the cart

### ✓ 3. Product sorting

* verify sorting by name (A → Z / Z → A)
* verify sorting by price (low → high / high → low)

### ✓ 4. Negative login

* invalid credentials → error message

---

## 🧠 Architecture

The project is structured into three main layers:

### 1. Page Objects (`/pages`)

Encapsulate page-specific actions and selectors (Login, Inventory, Cart, Checkout, etc.).

### 2. Components (`/components`)

Reusable UI elements that can appear on multiple pages, such as `InventoryItem`, `CartItem` and `SelectContainer`.

### 3. Tests (`/tests`)

High-level business scenarios that use pages and components. Test files focus on **what** is being tested, not **how** the UI is implemented.

---

## 🔌 API Tests

API tests use project: api in playwright.config.ts

This project also includes API tests for the Restful Booker API, located in:
```bash
tests/api/
```
API tests run in a dedicated Playwright project (`api`). They use Playwright’s built‑in `request` fixture and cover:

* authentication (`POST /auth`)

* booking creation (`POST /booking`)

* booking retrieval (`GET /booking/{id}`)

* booking update (`PUT /booking/{id}`)

* booking deletion (`DELETE /booking/{id}`)

* negative scenarios (e.g., update without authentication)

Run only the API tests:
```bash
npx playwright test --project=api
```

Run a specific API test:
```bash
npx playwright test tests/api/booking-crud.spec.ts --project=api
```

---

## 🔄 CI / CD (GitHub Actions)

The project includes a full CI pipeline implemented with GitHub Actions.

The pipeline consists of two separate jobs:

### API Tests
- Runs Playwright API tests (Restful Booker)
- Fast feedback layer
- Executed before UI tests

### UI E2E Tests
- Runs Playwright E2E tests against Saucedemo
- Executed in a browser matrix:
  - Chromium
  - Firefox
  - WebKit
- Runs only if API tests pass

### Reports
- Playwright HTML reports are uploaded as GitHub Actions artifacts
- Test traces and screenshots are also available for failed runs

---

### Fixtures

The project uses a custom Playwright fixture (`loggedPage`) defined in `tests/e2e/fixtures.ts` to provide a pre-authenticated page instance for multiple tests.  
This keeps test code clean and demonstrates knowledge of Playwright's fixture system.

---

## 🧰 Useful npm scripts

Run all tests:
```bash
npm test
```

Run only API tests:
```bash
npm run test:api
```

Run only UI tests (Chromium):
```bash
npm run test:e2e
```