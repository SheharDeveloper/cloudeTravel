import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });

  try {
    await page.goto('http://127.0.0.1:8000/', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Wait for any React/dynamic content
    try {
      await page.waitForLoadState('networkidle');
    } catch (e) {
      // networkidle might timeout, that's ok
    }
    await page.waitForTimeout(2000);

    // Ensure page is visible
    await page.evaluate(() => {
      document.documentElement.style.opacity = '1';
      document.body.style.opacity = '1';
      document.querySelector('body').style.opacity = '1';
    });

    await page.screenshot({ path: 'home.png' });
    console.log('Screenshot saved');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
})();
