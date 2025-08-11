import { test, expect } from '@playwright/test';
import { OtpDockClient } from '@otpdock/client';
import { OtpLoginPage } from '../pages/OtpLoginPage';

const apiKey = process.env.OTPDOCK_API_KEY;
if (!apiKey) {
  throw new Error('API key is required');
}

const client = new OtpDockClient(apiKey);

test('OTP login with OTPDock', async ({ page }) => {
  const inbox = await client.generateTemporaryInbox();

  const otpLoginPage = new OtpLoginPage(page);
  await otpLoginPage.goto('https://practice.expandtesting.com/otp-login');
  await otpLoginPage.waitForOtpLoginPageToBeVisible();
  await otpLoginPage.fillEmail(inbox.email);

  const otpVerificationPage = await otpLoginPage.clickSendOtpCode();
  const otp = await inbox.getOtp({ timeout: 20000, interval: 1000 });
  await otpVerificationPage.fillOtp(otp);
  await otpVerificationPage.clickVerifyOtp();

  await expect(page.locator('//b[text()="You logged into a secure area!"]')).toBeVisible();
});
