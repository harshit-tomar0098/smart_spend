const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://style-zipper-28690293.figma.site/');
  
  // Wait for the specific container that Figma sites use
  await page.waitForSelector('.tailwind');
  // Wait an extra 3 seconds for full React hydration and animation completion
  await page.waitForTimeout(3000);
  
  const html = await page.content();
  fs.writeFileSync('figma_scraped.html', html);
  
  await browser.close();
})();
