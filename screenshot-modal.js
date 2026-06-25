import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 1200 } });

  try {
    await page.goto('http://127.0.0.1:8000/', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    try {
      await page.waitForLoadState('networkidle');
    } catch (e) {
      // networkidle might timeout, that's ok
    }
    await page.waitForTimeout(2000);

    // Click on the WHO field to show the traveler modal
    const clicked = await page.evaluate(() => {
      // Find element with "WHO" label and its corresponding input/button
      const whoLabel = Array.from(document.querySelectorAll('div')).find(el => el.textContent.trim() === 'WHO');
      if (whoLabel) {
        // Find the input or button within the same container
        const container = whoLabel.closest('div[style*="position"]') || whoLabel.parentElement?.parentElement;
        if (container) {
          const input = container.querySelector('input, button, [role="button"]');
          if (input) {
            input.click();
            return true;
          }
        }
      }
      return false;
    });

    if (!clicked) {
      // Fallback: try clicking by finding the traveler info text
      await page.click('text=/1 Adult.*Economy/i');
    }

    await page.waitForTimeout(1000);

    // Set a larger viewport to capture the entire modal
    await page.setViewportSize({ width: 1366, height: 1000 });

    // Scroll to center the modal in view
    await page.evaluate(() => {
      const modal = document.querySelector('[style*="position: absolute"][style*="background"]');
      if (modal) {
        modal.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    });
    await page.waitForTimeout(300);

    // Take screenshot of the modal
    await page.screenshot({ path: 'modal.png' });
    console.log('Modal screenshot saved');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
})();
