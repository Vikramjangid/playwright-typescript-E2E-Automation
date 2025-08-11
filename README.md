
# Playwright TypeScript E2E Automation

End-to-end test automation framework using [Playwright](https://playwright.dev/) and TypeScript. Includes OTP login automation via [OTPDock](https://otpdock.com/).

## Features
- Playwright-based E2E tests in TypeScript
- OTP login flow using OTPDock API
- Page Object Model structure
- HTML test reports
- Example tests for web apps

## Folder Structure

```
├── pages/                # Page Object Model classes
│   ├── BasePage.ts
│   ├── OtpLoginPage.ts
│   └── OtpVerificationPage.ts
├── tests/                # Main test specs
│   └── example.spec.ts
├── utils/                # Utility classes (e.g., logger)
│   └── logger.ts
├── playwright.config.ts  # Playwright configuration
├── package.json          # Project metadata and dependencies
├── .github/workflows/    # GitHub Actions CI config
├── test-results/         # Test result artifacts (gitignored)
├── playwright-report/    # HTML test reports (gitignored)
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)

### Installation
1. Clone the repository:
	```sh
	git clone https://github.com/Vikramjangid/playwright-typescript-E2E-Automation.git
	cd playwright-typescript-E2E-Automation
	```
2. Install dependencies:
	```sh
	npm install
	```

### Environment Variables
Some tests require an OTPDock API key. Set it via environment variable:

#### Option 1: Using `.env` file
Create a `.env` file in the project root:
```
OTPDOCK_API_KEY=your_otpdock_api_key
```
Uncomment the dotenv lines in `playwright.config.ts` if you want to use `.env` automatically.

#### Option 2: Set in terminal (PowerShell)
```powershell
$env:OTPDOCK_API_KEY="your_otpdock_api_key"
npx playwright test
```

## Running Tests

Run all tests:
```sh
npx playwright test
```

Run a specific test file:
```sh
npx playwright test tests/example.spec.ts
```

View HTML test report:
```sh
npx playwright show-report
```

## Example: OTP Login Test
See `tests/example.spec.ts` for a full OTP login flow using OTPDock.

## Utilities
- `utils/logger.ts`: Custom logger for test steps, errors, and screenshots.

## Continuous Integration
GitHub Actions workflow is provided in `.github/workflows/playwright.yml`.
Set the `OTPDOCK_API_KEY` secret in your repository for CI OTP tests.
