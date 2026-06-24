import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
await page.goto('http://127.0.0.1:8000/', { waitUntil: 'networkidle' });
await page.screenshot({ path: 'home.png' });
await browser.close();
console.log('Screenshot saved to home.png');
