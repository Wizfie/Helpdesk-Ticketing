import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// Pastikan folder screenshot tersedia
const screenshotDir = path.resolve('tests/e2e-screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

test.describe('E2E Browser Automation — PT Glotra Helpdesk System', () => {

  test('1. Otentikasi & Login Admin ke Dashboard', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Helpdesk|GTT/i);

    // Isi formulir login admin
    await page.locator('input[type="email"]').fill('admin@glotratech.com');
    await page.locator('input[type="password"]').fill('password123');
    await page.screenshot({ path: `${screenshotDir}/01-login-page.png` });

    // Submit form login
    await page.locator('button[type="submit"]').click();

    // Tunggu navigasi ke halaman beranda/dashboard
    await page.waitForURL((url) => url.pathname === '/' || url.pathname === '/tickets', { timeout: 10000 });
    await expect(page.locator('body')).toContainText(/Dashboard|Tiket|Helpdesk/i);
    await page.screenshot({ path: `${screenshotDir}/02-dashboard-view.png` });
  });

  test('2. Halaman Pembuatan Tiket Baru (Create Ticket)', async ({ page }) => {
    // Login terlebih dahulu untuk mendapatkan session
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('admin@glotratech.com');
    await page.locator('input[type="password"]').fill('password123');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL((url) => url.pathname === '/' || url.pathname === '/tickets');

    // Buka formulir pembuatan tiket
    await page.goto('/tickets/create');
    await expect(page.locator('body')).toContainText(/Terbitkan Tiket|Formulir Tiket|Buat Tiket/i);

    // Verifikasi label proteksi batas upload & auto-kompresi gambar
    await expect(page.locator('body')).toContainText(/Auto-kompres gambar|5 MB/i);
    await page.screenshot({ path: `${screenshotDir}/03-create-ticket-view.png` });
  });

  test('3. Halaman Daftar Tiket & Pelacakan SLA (Ticket List)', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('admin@glotratech.com');
    await page.locator('input[type="password"]').fill('password123');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL((url) => url.pathname === '/' || url.pathname === '/tickets');

    // Buka daftar tiket
    await page.goto('/tickets');
    await expect(page.locator('body')).toContainText(/Daftar Tiket|Semua Tiket/i);
    await page.screenshot({ path: `${screenshotDir}/04-ticket-list-view.png` });
  });

  test('4. Portal SOP & Runbook Knowledge Base', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('admin@glotratech.com');
    await page.locator('input[type="password"]').fill('password123');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL((url) => url.pathname === '/' || url.pathname === '/tickets');

    // Buka Knowledge Base
    await page.goto('/knowledge-base');
    await expect(page.locator('body')).toContainText(/Knowledge Base|SOP|Runbook/i);
    await page.screenshot({ path: `${screenshotDir}/05-knowledge-base-view.png` });
  });

  test('5. Pengaturan Gateway Email SMTP Universal', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('admin@glotratech.com');
    await page.locator('input[type="password"]').fill('password123');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL((url) => url.pathname === '/' || url.pathname === '/tickets');

    // Buka Gateway Email
    await page.goto('/admin/email-gateway');
    await expect(page.locator('body')).toContainText(/Pengaturan Gateway Email|SMTP/i);
    await expect(page.locator('body')).toContainText(/Simpan Pengaturan/i);
    await page.screenshot({ path: `${screenshotDir}/06-email-gateway-view.png` });
  });

  test('6. Portal Pelacakan Mandiri Pelanggan (Customer Self-Service)', async ({ page }) => {
    // Pelanggan mengakses portal publik tanpa login menggunakan token rahasia
    await page.goto('/track/TK-26001?token=sec_demo_token_123');
    await expect(page.locator('body')).toContainText(/Pelacakan|Tracking|Tiket/i);
    await page.screenshot({ path: `${screenshotDir}/07-customer-tracking-portal.png` });
  });

});
