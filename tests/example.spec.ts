import { test, expect } from '@playwright/test';
import { OtpDockClient } from '@otpdock/client';
import { OtpLoginPage } from '../pages/OtpLoginPage';
import { Logger } from '../utils/logger';

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
  // await otpVerificationPage.fillOtp("123456");
  // INFO: Enable above line and disable below line to test incorrect password case
  await otpVerificationPage.fillOtp(otp);
  await otpVerificationPage.clickVerifyOtp();

  await otpVerificationPage.assertVisible(page.locator('//b[text()="You logged into a secure area!"]'), 'User shall be logged in');
});

test('Incorrect OTP login', async ({ page }) => {
  const otpLoginPage = new OtpLoginPage(page);
  await otpLoginPage.goto('https://practice.expandtesting.com/otp-login');
  await otpLoginPage.waitForOtpLoginPageToBeVisible();
  await otpLoginPage.fillEmail("inbox.email@email.com");
  
  const otpVerificationPage = await otpLoginPage.clickSendOtpCode();
  await otpVerificationPage.fillOtp("123456");
  await otpVerificationPage.clickVerifyOtp();

  await otpVerificationPage.assertVisible(page.locator('//p[text()="The provided OTP code is incorrect. Please check your code and try again."]'), 'User shall see incorrect OTP message');
});
