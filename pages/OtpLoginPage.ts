import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { OtpVerificationPage } from './OtpVerificationPage';

export class OtpLoginPage extends BasePage {
  
  constructor(page: Page) {
    super(page);
  }

  async waitForOtpLoginPageToBeVisible() {
    await this.waitUntilVisible('xpath=//h1[text()="OTP Login page for Automation Testing Practice"]');
  }

  async fillEmail(email: string) {
    const emailLocator = this.page.getByRole('textbox', { name: 'Your Email Address' });
    await this.fill(emailLocator, email);
  }

  async clickSendOtpCode() {
    await this.click('role=button[name="Send OTP Code"]');
    const otpVerificationPage = new OtpVerificationPage(this.page);
    await otpVerificationPage.waitForOtpVerificationPageToBeVisible();
    return otpVerificationPage;
  }
}
