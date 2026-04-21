const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' });

  const results = {};

  // Toptal talent apply
  try {
    await page.goto('https://www.toptal.com/talent/apply', { timeout: 20000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    results.toptal_apply = { 
      title: await page.title(), 
      text: (await page.evaluate(() => document.body.innerText)).substring(0, 5000)
    };
  } catch(e) { results.toptal_apply = { error: e.message }; }

  // Arc.dev for talent (freelance/apply)
  try {
    await page.goto('https://arc.dev/talent/apply', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    results.arc_apply = { 
      title: await page.title(), 
      text: (await page.evaluate(() => document.body.innerText)).substring(0, 3000)
    };
  } catch(e) { results.arc_apply = { error: e.message }; }

  // Lemon.io for developers
  try {
    await page.goto('https://lemon.io/developers/', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.lemonio_apply = { 
      title: await page.title(), 
      text: (await page.evaluate(() => document.body.innerText)).substring(0, 3000)
    };
  } catch(e) { results.lemonio_apply = { error: e.message }; }

  // Check Turing
  try {
    await page.goto('https://turing.com/jobs', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.turing_jobs = { title: await page.title(), text: (await page.evaluate(() => document.body.innerText)).substring(0, 2000) };
  } catch(e) { results.turing_jobs = { error: e.message }; }

  // Check another AI-focused platform - Codersera
  try {
    await page.goto('https://codersera.com/', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.codersera = { title: await page.title(), text: (await page.evaluate(() => document.body.innerText)).substring(0, 2000) };
  } catch(e) { results.codersera = { error: e.message }; }

  // Check Relance
  try {
    await page.goto('https://relance.com/', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.relance = { title: await page.title(), text: (await page.evaluate(() => document.body.innerText)).substring(0, 2000) };
  } catch(e) { results.relance = { error: e.message }; }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(e => console.error('Fatal Error:', e.message));
