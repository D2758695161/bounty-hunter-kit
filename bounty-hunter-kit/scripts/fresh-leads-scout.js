/**
 * fresh-leads-scout.js — Targeted scout for 2026-04-21 high-value leads
 * Focus: thunderbird/thunderbolt, openai-agents-python v0.14.0, fresh bounty repos
 * 
 * Usage: node fresh-leads-scout.js
 */

const GITHUB_TOKEN = process.env.GH_TOKEN || 'ghp_REDACTED_TOKEN';
const HEADERS = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
  'User-Agent': 'BountyHunter-Scout/1.0'
};

async function ghGraphql(query, variables = {}) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ query, variables })
  });
  if (!res.ok) throw new Error(`GH GraphQL error: ${res.status} ${await res.text()}`);
  return res.json();
}

async function ghRest(endpoint) {
  const res = await fetch(`https://api.github.com${endpoint}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`GH API error: ${res.status}`);
  return res.json();
}

// ── High-Priority Target Repos (April 21, 2026 research) ─────────────────
const TARGET_REPOS = [
  { owner: 'thunderbird', repo: 'thunderbolt', notes: 'AI Agent框架，2.7k stars，Mozilla支持，TypeScript AI工具' },
  { owner: 'openai', repo: 'openai-agents-python', notes: 'v0.14.0新发布，MCP集成机会，Official OpenAI多Agent SDK' },
  { owner: 'arkadiyt', repo: 'bounty-targets-data', notes: 'Bug bounty范围数据，Hourly更新，HackerOne/Bugcrowd/Intigriti' },
  { owner: 'FinceptTerminal', repo: 'FinceptTerminal', notes: 'Python金融分析，Claude内置，9k stars今日+3k' },
  { owner: 'algora-io', repo: 'algora', notes: 'Hire top 1% OSS工程师，bounty/hiring平台' },
  { owner: 'midnight-xyz', repo: 'midnight', notes: 'Midnight #320 Compact tutorial, $500-700 NIGHT' },
  { owner: 'poidh-app', repo: 'poidh-app', notes: 'Albums bug fix, beginner friendly' },
  { owner: 'solfoundry', repo: 'solfoundry', notes: 'FNDRY代币，400K T3高价值Bounty' },
];

// ── Scan a single repo for bounty issues ────────────────────────────────────
async function scanRepo(owner, repo, notes) {
  const results = [];
  try {
    // Get repo basic info
    const repoInfo = await ghRest(`/repos/${owner}/${repo}`).catch(() => null);
    const stars = repoInfo?.stargazers_count || 0;
    const created = repoInfo?.created_at || '';
    const isFresh = (Date.now() - new Date(created).getTime()) < 7 * 24 * 60 * 60 * 1000;

    // Search for open bounty/paid issues in this repo
    const queries = [
      `repo:${owner}/${repo} is:issue is:open no:assignee "bounty" in:title`,
      `repo:${owner}/${repo} is:issue is:open no:assignee "paid" in:title`,
      `repo:${owner}/${repo} is:issue is:open no:assignee "reward" in:title`,
      `repo:${owner}/${repo} is:issue is:open no:assignee label:bounty`,
      `repo:${owner}/${repo} is:issue is:open no:assignee "good first issue"`,
    ];

    for (const q of queries) {
      try {
        const searchRes = await ghRest(`/search/issues?q=${encodeURIComponent(q)}&per_page=10`);
        if (searchRes.items && searchRes.items.length > 0) {
          for (const issue of searchRes.items) {
            results.push({
              owner,
              repo,
              notes,
              stars,
              isFresh,
              number: issue.number,
              title: issue.title,
              labels: issue.labels.map(l => l.name),
              comments: issue.comments,
              url: issue.html_url,
              created: issue.created_at,
              updated: issue.updated_at,
              body_preview: (issue.body || '').slice(0, 200),
            });
          }
        }
      } catch (e) {
        // Rate limited or error, skip
      }
    }
  } catch (e) {
    console.error(`  ERROR scanning ${owner}/${repo}: ${e.message}`);
  }
  return results;
}

// ── Scan for brand new repos with bounty labels ─────────────────────────────
async function findFreshBountyRepos() {
  const queries = [
    'created:>2026-04-15 stars:>5 is:public',
    'pushed:>2026-04-15 stars:>3 is:public',
  ];
  
  const newRepos = [];
  // Check recent activity in known bounty-friendly orgs
  const bountyOrgs = [
    'midnight-xyz', 'solfoundry', 'opire', 'algora-io', 
    'Caballerog', 'Labyrinth-HQ', 'labmain', 'poidh-app',
    'flashbots', 'optimism', 'base-org', 'a16z', 'Coinbase'
  ];
  
  for (const org of bountyOrgs.slice(0, 8)) {
    try {
      const orgRepos = await ghRest(`/orgs/${org}/repos?sort=pushed&per_page=10&type=public`);
      for (const r of (orgRepos || []).slice(0, 5)) {
        const pushed = new Date(r.pushed_at);
        if (Date.now() - pushed.getTime() < 5 * 24 * 60 * 60 * 1000) {
          newRepos.push({ owner: org, repo: r.name, pushed: r.pushed_at, stars: r.stargazers_count });
        }
      }
    } catch (e) {
      // Skip orgs we can't access
    }
  }
  
  return newRepos;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== 🦞 Fresh Leads Scout — 2026-04-21 ===\n');
  
  const allResults = [];
  
  // 1. Scan target repos
  console.log(`Scanning ${TARGET_REPOS.length} target repos...`);
  for (const t of TARGET_REPOS) {
    process.stdout.write(`  ${t.owner}/${t.repo}...`);
    const results = await scanRepo(t.owner, t.repo, t.notes);
    console.log(` found ${results.length} issues`);
    allResults.push(...results);
  }
  
  // 2. Find fresh repos from known bounty orgs
  console.log('\nScanning for fresh repos from bounty orgs...');
  const freshRepos = await findFreshBountyRepos();
  console.log(`Found ${freshRepos.length} recently pushed repos`);
  
  for (const fr of freshRepos.slice(0, 5)) {
    process.stdout.write(`  ${fr.owner}/${fr.repo} (${fr.stars} stars)...`);
    const results = await scanRepo(fr.owner, fr.repo, `Recently pushed repo, ${fr.stars} stars`);
    console.log(` found ${results.length} issues`);
    allResults.push(...results);
  }
  
  // 3. Deduplicate and score
  const seen = new Set();
  const unique = allResults.filter(r => {
    const key = `${r.owner}/${r.repo}#${r.number}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  // Score: fewer comments = better (less competition)
  const scored = unique.map(r => ({
    ...r,
    competitionScore: r.comments === 0 ? 1.0 : r.comments < 3 ? 0.6 : r.comments < 10 ? 0.3 : 0.1,
  })).sort((a, b) => b.competitionScore - a.competitionScore);
  
  // 4. Report
  console.log(`\n=== Results: ${scored.length} unique issues ===\n`);
  
  const fs = require('fs');
  const report = {
    scannedAt: new Date().toISOString(),
    targetRepos: TARGET_REPOS,
    freshReposFound: freshRepos.length,
    totalIssues: scored.length,
    topIssues: scored.slice(0, 20).map(r => ({
      repo: `${r.owner}/${r.repo}`,
      number: r.number,
      title: r.title,
      labels: r.labels,
      comments: r.comments,
      competition: r.comments === 0 ? '🟢 Zero' : r.comments < 3 ? '🟡 Low' : r.comments < 10 ? '🟠 Medium' : '🔴 High',
      notes: r.notes,
      url: r.url,
      isFresh: r.isFresh,
    }))
  };
  
  fs.writeFileSync('fresh-leads-report.json', JSON.stringify(report, null, 2));
  
  // Print top 10
  console.log('Top 10 Opportunities:\n');
  for (const r of scored.slice(0, 10)) {
    const competition = r.comments === 0 ? '🟢' : r.comments < 3 ? '🟡' : r.comments < 10 ? '🟠' : '🔴';
    console.log(`${competition} [${r.owner}/${r.repo}#${r.number}]`);
    console.log(`   ${r.title}`);
    console.log(`   💬 ${r.comments} comments | ${r.labels.join(', ')}`);
    console.log(`   🔗 ${r.url}`);
    console.log('');
  }
  
  console.log(`\nFull report saved to: fresh-leads-report.json`);
  console.log(`Total: ${scored.length} unique issues from ${TARGET_REPOS.length} target repos`);
}

main().catch(console.error);
