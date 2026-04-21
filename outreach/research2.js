const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const results = {
    researchDate: '2026-04-20',
    researchTime: '22:19 UTC',
    leads: [],
    errors: []
  };

  // 1. GitHub bounty issues (last 7 days)
  try {
    console.log('1. GitHub bounty issues...');
    await page.goto('https://github.com/search?q=label%3Abounty+created%3A%3E%3D2026-04-14&type=issues&per_page=30', { timeout: 20000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    const html = await page.content();
    const issueMatches = [...html.matchAll(/href="\/([^"]+)\/issues\/(\d+)">([^<]+)<\/a/g)].slice(0, 10);
    if (issueMatches.length > 0) {
      results.leads.push({ category: 'github-bounty-issues', count: issueMatches.length, sample: issueMatches.map(m => ({ repo: m[1], id: m[2], title: m[3] })) });
    }
  } catch(e) { results.errors.push('GitHub bounty: ' + e.message); }

  // 2. GitHub repos created in last 7 days with "bounty" or "reward" in name
  try {
    console.log('2. GitHub bounty repos...');
    await page.goto('https://github.com/search?q=bounty+created%3A%3E%3D2026-04-14&type=repositories&per_page=15', { timeout: 20000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    const reposMatches = [...(await page.content()).matchAll(/href="\/([^"]+)"[^>]*>([^<]+)<\/a/g)].slice(0, 15);
    const cleanRepos = reposMatches.filter(m => !m[1].includes('/issues') && !m[1].includes('/pulls') && m[1].split('/').length === 2);
    results.leads.push({ category: 'github-bounty-repos', repos: cleanRepos.slice(0, 8).map(m => m[1]) });
  } catch(e) { results.errors.push('GitHub repos: ' + e.message); }

  // 3. Opire bounty platform
  try {
    console.log('3. Opire bounty platform...');
    await page.goto('https://opire.dev/developers', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const pageText = await page.evaluate(() => document.body.innerText.substring(0, 3000));
    results.leads.push({ category: 'opire-bounty', data: pageText.substring(0, 1000) });
  } catch(e) { results.errors.push('Opire: ' + e.message); }

  // 4. GitHub Sponsors popular
  try {
    console.log('4. GitHub Sponsors...');
    await page.goto('https://github.com/sponsors/explore?sort=most-popular', { timeout: 20000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const sponsorMatches = [...(await page.content()).matchAll(/"name":"([^"]+)"/g)].slice(0, 10);
    results.leads.push({ category: 'github-sponsors', data: sponsorMatches.map(m => m[1]) });
  } catch(e) { results.errors.push('GitHub sponsors: ' + e.message); }

  // 5. Product Hunt AI/Developer tools
  try {
    console.log('5. Product Hunt...');
    await page.goto('https://www.producthunt.com/', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);
    const phMatches = [...(await page.content()).matchAll(/<h3[^>]*>([^<]+)<\/h3>/g)].slice(0, 15);
    results.leads.push({ category: 'product-hunt', count: phMatches.length, samples: phMatches.map(m => m[1]).filter(t => t.length > 3 && t.length < 100) });
  } catch(e) { results.errors.push('Product Hunt: ' + e.message); }

  // 6. Freelance platforms - Upwork
  try {
    console.log('6. Upwork...');
    await page.goto('https://www.upwork.com/freelance-jobs/software-development/', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const upworkMatches = [...(await page.content()).matchAll(/class="job-title[^"]*"[^>]*>([^<]+)<\/span/g)].slice(0, 10);
    results.leads.push({ category: 'upwork', count: upworkMatches.length, titles: upworkMatches.map(m => m[1]) });
  } catch(e) { results.errors.push('Upwork: ' + e.message); }

  console.log('\n=== FINAL RESULTS ===');
  console.log(JSON.stringify(results, null, 2));
  
  fs.writeFileSync('C:\\Users\\Administrator\\.openclaw\\workspace\\outreach\\research-results.json', JSON.stringify(results, null, 2));
  
  await browser.close();
})().catch(e => {
  console.error('FATAL:' + e.message);
  process.exit(1);
});