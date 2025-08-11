import test, { Page, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class Logger {

  private static getTimestamp(): string {
    const now = new Date();
    const date = now.toLocaleDateString('en-GB'); // dd/mm/yyyy
    const time = now.toLocaleTimeString('en-GB'); // HH:MM:SS
    return `${date} ${time}`;
  }

  private static formatMessage(type: string, message: string): string {
    // Mask sensitive information such as email and OTP
    message = message.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
    message = message.replace(/\b\d{6}\b/g, '[OTP]');

    return `${Logger.getTimestamp()} [${type.toUpperCase()}] ${message}`;
  }

  private static async captureScreenshot(fileNamePrefix: string, page: Page) {
    if (!page) return;
    const dir = path.resolve('test-results/screenshots');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, `${fileNamePrefix}-${Date.now()}.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    // Attach screenshot to Playwright report if testInfo is available
    try {
      // Dynamically get testInfo from the current test context
      const testInfo = test.info();
      if (testInfo && typeof testInfo.attach === 'function') {
        await testInfo.attach('Screenshot', { path: filePath, contentType: 'image/png' });
      }
      console.debug(Logger.formatMessage('screenshot', `Attached to test report: ${filePath}`));
    } catch (err) {
      console.warn('Failed to attach screenshot to test report:', err);
      // Ignore if not in test context
    }
    console.log(Logger.formatMessage('screenshot', `Saved at ${filePath}`));
  }

  static debug(message: string): void {
    console.debug(Logger.formatMessage('debug', message));
  }

  static step(message: string): void {
    console.log(Logger.formatMessage('step', message));
  }

  static info(message: string): void {
    console.info(Logger.formatMessage('info', message));
  }

  static warning(message: string): void {
    console.warn(Logger.formatMessage('warning', message));
  }

  static pass(message: string): void {
    console.log(Logger.formatMessage('pass', message));
  }

  static async fail(message: string, page: Page): Promise<void> {
    await Logger.captureScreenshot('fail', page);
    console.error(Logger.formatMessage('fail', message));
  }

  static async error(message: string, page: Page): Promise<void> {
    await Logger.captureScreenshot('error', page);
    console.error(Logger.formatMessage('error', message));
  }

  static async compare(actual: any, expected: any, message: string, page: Page): Promise<void> {
    try {
      expect(actual).toEqual(expected);
      Logger.pass(message);
    } catch (e) {
      await Logger.fail(`${message} | Expected: ${expected}, Got: ${actual}`, page);
      throw e;
    }
  }
}
