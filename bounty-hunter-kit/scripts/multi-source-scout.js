/**
 * Multi-Source Bounty Scout v1.0
 * Scans multiple bounty sources simultaneously and merges results
 * Sources: GitHub (bounty labels), RemoteOK, Develancer, Stariob
 */

const token = process.argv[2] || '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';

const GITHUB_ORGS = [
  'solfoundry', 'latterfix', 'claude-builders-bounty',
  'openai', 'anthropic', 'modelcontextprotocol'
];

const BOUNTY_KEYWORDS = ['bounty', 'reward', '$', 'usd', 'eur', 'prize', 'grant', 'compensation'];

async function fetchGitHubIssues(org) {
  const results = [];
  try {
    const res = await fetch(
      `https://api.github.com/orgs/${org}/issues?labels=bounty&state=open&per_page=20`,
      { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } }
    );
    if (!res.ok) return results;
    const issues = await res.json();
    for (const issue of issues) {
      if (issue.pull_request) continue;
      const body = (issue.body || '').toLowerCase();
      const hasReward = BOUNTY_KEYWORDS.some(k => body.includes(k));
      const labels = issue.labels.map(l => l.name);
      const rewardMatch = (issue.body || '').match(/(\$|USD|EUR|¥)\s*([0-9,]+)/i);
      results.push({
        source: 'github',
        org,
        title: issue.title,
        url: issue.html_url,
        body: (issue.body || '').slice(0, 300),
        labels,
        hasReward,
        reward: rewardMatch ? rewardMatch[0] : null,
        updated: issue.updated_at,
        comments: issue.comments,
        state: 'open'
      });
    }
  } catch (e) {
    console.log(`[WARN] GitHub ${org}: ${e.message}`);
  }
  return results;
}

async function fetchRemoteOK() {
  const results = [];
  try {
    const res = await fetch('https://remoteok.com/api?tag=python&tag=backend&tag=ai');
    if (!res.ok) return results;
    const jobs = await res.json();
    for (const job of jobs.slice(0, 15)) {
      if (!job.id) continue;
      const salary = job.salary || '';
      results.push({
        source: 'remoteok',
        title: job.position || job.h1 || 'Unknown',
        url: job.url || `https://remoteok.com/remote-${job.id}`,
        company: job.company || '',
        body: `${job.tags?.join(', ') || ''} ${job.description || ''}`.slice(0, 300),
        labels: job.tags || [],
        hasReward: salary.includes('$') || salary.includes('USD'),
        reward: salary || null,
        updated: job.date ? new Date(job.date * 1000).toISOString() : null,
        state: 'open'
      });
    }
  } catch (e) {
    console.log(`[WARN] RemoteOK: ${e.message}`);
  }
  return results;
}

async function fetchDevelancer() {
  const results = [];
  try {
    const res = await fetch('https://develancer.com/api/jobs?category=development&limit=20');
    if (!res.ok) return results;
    const data = await res.json();
    const jobs = data.jobs || data || [];
    for (const job of jobs.slice(0, 10)) {
      results.push({
        source: 'develancer',
        title: job.title || job.name || 'Unknown',
        url: job.url || job.link || '#',
        company: job.company || job.name || '',
        body: (job.description || job.skills || '').slice(0, 300),
        labels: job.skills || [],
        hasReward: !!(job.budget || job.price),
        reward: job.budget || job.price || null,
        updated: job.created_at || job.posted || null,
        state: 'open'
      });
    }
  } catch (e) {
    console.log(`[WARN] Develancer: ${e.message}`);
  }
  return results;
}

async function scanAll() {
  console.log('🎯 Multi-Source Bounty Scout starting...\n');
  const start = Date.now();

  // Fetch all sources in parallel
  const [ghResults, remoteOKResults] = await Promise.all([
    Promise.all(GITHUB_ORGS.map(org => fetchGitHubIssues(org))),
    fetchRemoteOK().catch(() => [])
  ]);

  const githubBounties = ghResults.flat().filter(b => b.hasReward || b.comments > 0);
  const remoteOKJobs = remoteOKResults.filter(j => j.hasReward);

  // Sort by reward value (descending)
  const allBounties = [...githubBounties, ...remoteOKJobs].sort((a, b) => {
    const aVal = parseFloat((a.reward || '0').replace(/[^0-9.]/g, '')) || 0;
    const bVal = parseFloat((b.reward || '0').replace(/[^0-9.]/g, '')) || 0;
    return bVal - aVal;
  });

  console.log(`\n✅ Scan complete in ${((Date.now() - start) / 1000).toFixed(1)}s`);
  console.log(`📊 Total: ${allBounties.length} opportunities found\n`);

  // Top 10 by reward
  console.log('=== 🏆 TOP 10 BY REWARD ===');
  allBounties.slice(0, 10).forEach((b, i) => {
    console.log(`\n[${i + 1}] ${b.source.toUpperCase()} | ${b.reward || 'TBD'}`);
    console.log(`  ${b.title}`);
    console.log(`  ${b.url}`);
    if (b.company) console.log(`  Company: ${b.company}`);
  });

  // Save results
  const output = { timestamp: new Date().toISOString(), total: allBounties.length, bounties: allBounties };
  const fs = require('fs');
  fs.writeFileSync('./multi-source-bounties.json', JSON.stringify(output, null, 2));
  console.log('\n💾 Saved to multi-source-bounties.json');

  return allBounties;
}

scanAll().catch(console.error);
