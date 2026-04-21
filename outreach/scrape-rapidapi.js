const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  // Check search results for "beta" or "new" - use general search
  await page.goto('https://rapidapi.com/search?sortBy=ByRelevance&q=ai&h=true', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(3000);

  const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 15000));
  console.log('SEARCH_AI:', bodyText);

  const apiLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href*="/api/"]')).map(a => ({
      text: a.innerText.trim().substring(0, 100),
      href: a.href
    })).filter(x => x.text && x.href.includes('rapidapi.com/') && x.href.includes('/api/'));
  });
  console.log('API_LINKS:', JSON.stringify(apiLinks.slice(0, 30), null, 2));

  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
