const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' });

  const results = {};

  // Arc.dev talent apply
  try {
    await page.goto('https://arc.dev/developers', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.arc_talent = { 
      title: await page.title(), 
      text: (await page.evaluate(() => document.body.innerText)).substring(0, 3000),
      links: await page.evaluate(() => Array.from(document.querySelectorAll('a')).map(a => a.href).filter(h => h.includes('apply') || h.includes('join') || h.includes('signup')).slice(0, 10))
    };
  } catch(e) { results.arc_talent = { error: e.message }; }

  // Lemon.io apply as dev
  try {
    await page.goto('https://lemon.io/apply/', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.lemon_apply = { 
      title: await page.title(), 
      text: (await page.evaluate(() => document.body.innerText)).substring(0, 3000)
    };
  } catch(e) { results.lemon_apply = { error: e.message }; }

  // Codersera apply as freelancer
  try {
    await page.goto('https://codersera.com/freelancer/', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    results.codersera_apply = { 
      title: await page.title(), 
      text: (await page.evaluate(() => document.body.innerText)).substring(0, 3000)
    };
  } catch(e) { results.codersera_apply = { error: e.message }; }

  // Toptal talent apply form (already found at /talent/apply)
  try {
    await page.goto('https://www.toptal.com/talent/apply', { timeout: 20000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const formFields = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
      return inputs.map(i => ({ name: i.name, type: i.type, placeholder: i.placeholder, required: i.required }));
    });
    results.toptal_form = { 
      title: await page.title(), 
      text: (await page.evaluate(() => document.body.innerText)).substring(0, 3000),
      form_fields: formFields
    };
  } catch(e) { results.toptal_form = { error: e.message }; }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(e => console.error('Fatal Error:', e.message));
