import { Page, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class Logger {
  private static page: Page;

  static init(page: Page) {
    Logger.page = page;
  }

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

  private static async captureScreenshot(fileNamePrefix: string) {
    if (!Logger.page) return;
    const dir = path.resolve('test-results/screenshots');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, `${fileNamePrefix}-${Date.now()}.png`);
    await Logger.page.screenshot({ path: filePath, fullPage: true });
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

  static async fail(message: string): Promise<void> {
    console.error(Logger.formatMessage('fail', message));
    await Logger.captureScreenshot('fail');
  }

  static async error(message: string): Promise<void> {
    console.error(Logger.formatMessage('error', message));
    await Logger.captureScreenshot('error');
  }

  static async verify(actual: any, expected: any, message: string): Promise<void> {
    try {
      expect(actual).toEqual(expected);
      Logger.pass(message);
    } catch (e) {
      await Logger.fail(`${message} | Expected: ${expected}, Got: ${actual}`);
      throw e;
    }
  }
}
