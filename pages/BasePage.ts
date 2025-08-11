import { expect, Locator, Page } from '@playwright/test';
import { Logger } from '../utils/logger';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async click(locator: string | Locator) {
    Logger.step(`Clicking on element: ${locator}`);
    if (typeof locator === 'string') {
      await this.page.click(locator);
    } else {
      await locator.click();
    }
  }

  async fill(locator: string | Locator, text: string) {
    Logger.step(`Filling element: ${locator} with text: ${text}`);
    if (typeof locator === 'string') {
      await this.page.fill(locator, text);
    } else {
      await locator.fill(text);
    }
  }

  async isVisible(locator: string | Locator): Promise<boolean> {
    Logger.step(`Checking visibility of element: ${locator}`);
    if (typeof locator === 'string') {
      return await this.page.isVisible(locator);
    } else {
      return await locator.isVisible();
    }
  }

  async goto(url: string) {
    Logger.step(`Navigating to URL: ${url}`);
    await this.page.goto(url);
  }

  async waitUntilVisible(locator: string | Locator) {
    Logger.step(`Waiting until element is visible: ${locator}`);
    if (typeof locator === 'string') {
      await this.page.waitForSelector(locator, { state: 'visible' });
    } else {
      await locator.waitFor({ state: 'visible' });
    }
  }

    async assertVisible(locator: string | Locator, message: string): Promise<void> {
        Logger.step(`Asserting visibility of element: ${locator}`);
        try {
        if (typeof locator === 'string') {
            // Wait for selector to exist up to 10 seconds
            await this.page.waitForSelector(locator, { timeout: 10000 });
            const isVisible = await this.page.isVisible(locator);
            expect(isVisible).toBe(true);
        } else {
            // Wait for locator to exist up to 10 seconds
            await locator.waitFor({ state: 'visible', timeout: 10000 });
            const isVisible = await locator.isVisible();
            expect(isVisible).toBe(true);
        }
        Logger.pass(message);
        } catch (e) {
        await Logger.fail(`${message} | Expected: visible, Got: hidden`, this.page);
        throw e;
        }
    }
}
