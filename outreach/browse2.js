const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' });

  const results = {};

  // Toptal apply as freelancer
  try {
    await page.goto('https://www.toptal.com/freelance', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.toptal_freelance = { title: await page.title(), text: (await page.evaluate(() => document.body.innerText)).substring(0, 3000) };
  } catch(e) { results.toptal_freelance = { error: e.message }; }

  // Try to find the apply/join page via toptal careers
  try {
    await page.goto('https://www.toptal.com/apply', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.toptal_apply = { title: await page.title(), text: (await page.evaluate(() => document.body.innerText)).substring(0, 3000) };
  } catch(e) { results.toptal_apply = { error: e.message }; }

  // Check Flexjobs
  try {
    await page.goto('https://www.flexjobs.com/', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.flexjobs = { title: await page.title(), text: (await page.evaluate(() => document.body.innerText)).substring(0, 2000) };
  } catch(e) { results.flexjobs = { error: e.message }; }

  // Check SolidGigs
  try {
    await page.goto('https://solidgigs.com/', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.solidgigs = { title: await page.title(), text: (await page.evaluate(() => document.body.innerText)).substring(0, 2000) };
  } catch(e) { results.solidgigs = { error: e.message }; }

  // Check Gun.io (AI-focused-ish)
  try {
    await page.goto('https://gun.io/', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.gunio = { title: await page.title(), text: (await page.evaluate(() => document.body.innerText)).substring(0, 2000) };
  } catch(e) { results.gunio = { error: e.message }; }

  // Check Contra
  try {
    await page.goto('https://contra.com/', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.contra = { title: await page.title(), text: (await page.evaluate(() => document.body.innerText)).substring(0, 2000) };
  } catch(e) { results.contra = { error: e.message }; }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(e => console.error('Fatal Error:', e.message));
