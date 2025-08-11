import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OtpVerificationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async waitForOtpVerificationPageToBeVisible() {
    await this.waitUntilVisible('xpath=//h1[text()="OTP Verification"]');
  }

  async fillOtp(otp: string) {
    const otpLocator = this.page.getByPlaceholder('Enter OTP code');
    await this.fill(otpLocator, otp);
  }

  async clickVerifyOtp() {
    const verifyButton = this.page.getByRole('button', { name: 'Verify OTP Code' });
    await this.click(verifyButton);
  }
}
