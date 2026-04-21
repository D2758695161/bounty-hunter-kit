const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' });

  const results = {};

  // Try Guru main
  try {
    await page.goto('https://www.guru.com/', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const signupLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="join"], a[href*="signup"], a[href*="register"]'));
      return links.map(l => l.href).slice(0, 10);
    });
    results.guru = { title: await page.title(), signup_links: signupLinks, text: (await page.evaluate(() => document.body.innerText)).substring(0, 2000) };
  } catch(e) { results.guru = { error: e.message }; }

  // Try Toptal careers/apply page
  try {
    await page.goto('https://www.toptal.com/careers', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.toptal_careers = { title: await page.title(), text: (await page.evaluate(() => document.body.innerText)).substring(0, 3000) };
  } catch(e) { results.toptal_careers = { error: e.message }; }

  // Try Upwork freelance signup
  try {
    await page.goto('https://www.upwork.com/signup/', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.upwork_signup = { title: await page.title(), text: (await page.evaluate(() => document.body.innerText)).substring(0, 2000) };
  } catch(e) { results.upwork_signup = { error: e.message }; }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(e => console.error('Fatal Error:', e.message));
