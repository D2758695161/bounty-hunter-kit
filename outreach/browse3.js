const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' });

  const results = {};

  // Toptal apply - follow the link
  try {
    await page.goto('https://www.toptal.com/apply', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    results.toptal_apply = { 
      title: await page.title(), 
      text: (await page.evaluate(() => document.body.innerText)).substring(0, 5000),
      has_apply_btn: await page.evaluate(() => !!document.querySelector('a[href*="apply"], button')),
      links: await page.evaluate(() => Array.from(document.querySelectorAll('a')).map(a => a.href).filter(h => h.includes('toptal')).slice(0, 10))
    };
  } catch(e) { results.toptal_apply = { error: e.message }; }

  // Try Indeed (freelance section)
  try {
    await page.goto('https://www.indeed.com/freelance-jobs', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.indeed = { title: await page.title(), text: (await page.evaluate(() => document.body.innerText)).substring(0, 2000) };
  } catch(e) { results.indeed = { error: e.message }; }

  // Check Arc.dev (AI-focused dev platform)
  try {
    await page.goto('https://arc.dev/', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.arcdev = { title: await page.title(), text: (await page.evaluate(() => document.body.innerText)).substring(0, 2000) };
  } catch(e) { results.arcdev = { error: e.message }; }

  // Check Turing (remote dev jobs)
  try {
    await page.goto('https://turing.com/', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.turing = { title: await page.title(), text: (await page.evaluate(() => document.body.innerText)).substring(0, 2000) };
  } catch(e) { results.turing = { error: e.message }; }

  // Check Lemon.io (AI-matched freelance)
  try {
    await page.goto('https://lemon.io/', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.lemonio = { title: await page.title(), text: (await page.evaluate(() => document.body.innerText)).substring(0, 2000) };
  } catch(e) { results.lemonio = { error: e.message }; }

  // Check Gun.io via their freelance page
  try {
    await page.goto('https://gun.io/freelance', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.gunio_freelance = { title: await page.title(), text: (await page.evaluate(() => document.body.innerText)).substring(0, 2000) };
  } catch(e) { results.gunio_freelance = { error: e.message }; }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(e => console.error('Fatal Error:', e.message));
