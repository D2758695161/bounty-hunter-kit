/**
 * issueflow-scout.js — Scout for issueflow-buidl Stellar USDC bounties
 * 
 * issueflow-buidl is a new bounty platform on Stellar:
 *   - issueflow-contracts  → Smart contract bounties (Rust/Stellar SDK)
 *   - issueflow-cli        → CLI tool bounties (Rust)
 *   - issueflow-backend    → Backend API bounties (Rust/Actix-web)
 * 
 * Payment: Stellar USDC (on-chain, fast settlement)
 * Competition: LOW (brand new platform, few hunters)
 * 
 * Usage: node issueflow-scout.js
 */

const GITHUB_TOKEN = process.env.GH_TOKEN || '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';
const HEADERS = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
  'User-Agent': 'BountyHunter-Scout/1.0'
};

async function ghRest(endpoint) {
  const res = await fetch(`https://api.github.com${endpoint}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`GH API error: ${res.status}`);
  return res.json();
}

// ── Target Repos ─────────────────────────────────────────────────────────────
const TARGETS = [
  { owner: 'issueflow-buidl', repo: 'issueflow-contracts',   notes: 'Rust/Stellar smart contracts', stars: null },
  { owner: 'issueflow-buidl', repo: 'issueflow-cli',         notes: 'Rust CLI tools',               stars: null },
  { owner: 'issueflow-buidl', repo: 'issueflow-backend',     notes: 'Rust/Actix-web API',          stars: null },
];

// ── Score an issue ─────────────────────────────────────────────────────────
function scoreIssue(issue) {
  const title = (issue.title || '').toLowerCase();
  const body  = (issue.body  || '').toLowerCase();
  const labels = (issue.labels || []).map(l => l.name.toLowerCase());

  let score = 50; // base
  let value = 'Stellar USDC';

  // High-value keywords
  if (/bounty|reward|payment|\$[\d,]+|usdc|stellar/i.test(title + body)) score += 30;
  if (/rust|soroban|smart.?contract/i.test(title)) score += 20;
  if (/cli|command.?line|tool/i.test(title)) score += 15;
  if (/api|rest|endpoint|server/i.test(title + body)) score += 15;

  // Competition penalty
  if (issue.comments === 0) score += 25;
  else if (issue.comments < 3) score += 10;
  else if (issue.comments > 10) score -= 20;

  // Freshness bonus
  const age = Date.now() - new Date(issue.created_at).getTime();
  if (age < 2 * 24 * 60 * 60 * 1000) score += 20;  // < 2 days old
  else if (age < 7 * 24 * 60 * 60 * 1000) score += 10; // < 7 days

  // Assigned penalty
  if (issue.assignee) score -= 50;

  // Priority keywords
  if (/good first issue|help wanted|beginner/i.test(labels.join(' '))) score += 10;
  if (/urgent|hotfix|critical|security/i.test(title)) score += 15;

  return { score: Math.max(0, score), value };
}

// ── Scan a single repo ──────────────────────────────────────────────────────
async function scanRepo(owner, repo, notes) {
  const results = [];
  try {
    // Get repo info
    const repoInfo = await ghRest(`/repos/${owner}/${repo}`).catch(() => ({}));
    const stars = repoInfo.stargazers_count || 0;

    // Get all open issues
    const issues = await ghRest(`/repos/${owner}/${repo}/issues?state=open&per_page=100`).catch(() => []);
    
    for (const issue of issues) {
      if (issue.pull_request) continue; // skip PRs
      if (issue.assignee) continue;      // skip assigned

      const scored = scoreIssue(issue);
      results.push({
        owner,
        repo,
        notes,
        stars,
        number: issue.number,
        title: issue.title,
        state: issue.state,
        comments: issue.comments,
        labels: (issue.labels || []).map(l => l.name),
        assignees: (issue.assignees || []).map(a => a.login),
        created: issue.created_at,
        updated: issue.updated_at,
        url: issue.html_url,
        score: scored.score,
        value: scored.value,
        body_preview: (issue.body || '').slice(0, 300),
      });
    }
  } catch (e) {
    console.error(`  ERROR ${owner}/${repo}: ${e.message}`);
  }
  return results;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== 🦞 issueflow-scout — Stellar USDC Bounty Hunter ===\n');
  console.log('Platform: https://github.com/issueflow-buidl');
  console.log('Payment:  Stellar USDC (on-chain, fast)\n');

  const allResults = [];

  for (const t of TARGETS) {
    process.stdout.write(`Scanning ${t.owner}/${t.repo}...`);
    const results = await scanRepo(t.owner, t.repo, t.notes);
    console.log(` ${results.length} unassigned issues`);
    allResults.push(...results);
  }

  // Sort by score
  const sorted = allResults
    .filter(r => r.score > 50)
    .sort((a, b) => b.score - a.score);

  // Report
  console.log(`\n=== ${sorted.length} qualified issues (score > 50) ===\n`);

  for (const r of sorted.slice(0, 15)) {
    const age = Math.round((Date.now() - new Date(r.created).getTime()) / (1000 * 60 * 60));
    const ageStr = age < 24 ? `${age}h ago` : `${Math.round(age / 24)}d ago`;
    console.log(`[${r.score.toString().padStart(3)}] ${r.owner}/${r.repo}#${r.number}`);
    console.log(`  ${r.title}`);
    console.log(`  💬 ${r.comments} · ${r.labels.slice(0, 3).join(', ') || 'no label'} · ${ageStr}`);
    console.log(`  🔗 ${r.url}`);
    if (r.body_preview) {
      const clean = r.body_preview.replace(/\n/g, ' ').replace(/\r/g, '').slice(0, 120);
      console.log(`  📝 ${clean}...`);
    }
    console.log('');
  }

  // Save report
  const fs = require('fs');
  const report = {
    platform: 'issueflow-buidl',
    payment: 'Stellar USDC',
    scannedAt: new Date().toISOString(),
    totalFound: sorted.length,
    issues: sorted.slice(0, 20),
  };
  fs.writeFileSync('reports/issueflow-report.json', JSON.stringify(report, null, 2));
  console.log(`Report saved: reports/issueflow-report.json`);
}

main().catch(console.error);
