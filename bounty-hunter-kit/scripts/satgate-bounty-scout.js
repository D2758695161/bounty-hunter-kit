#!/usr/bin/env node
/**
 * SatGate Bounty Scout
 * Scans satgatexyz/satgate for L402 Lightning Bridge bounties
 * 
 * Usage: node satgate-bounty-scout.js
 */

const GITHUB_API = 'https://api.github.com';
const TOKEN = process.env.GH_TOKEN || '';
const HEADERS = {
  'Accept': 'application/vnd.github.v3+json',
  ...(TOKEN ? { 'Authorization': `Bearer ${TOKEN}` } : {}),
};

const REPOS = [
  'satgatexyz/satgate',
  'satgatexyz/l402',
];

function api(url) {
  return fetch(url, { headers: HEADERS }).then(r => r.json());
}

async function scanRepo(owner, repo) {
  console.log(`🔍 Scanning ${owner}/${repo}...`);
  
  // Get open issues with bounty labels
  const issues = await api(
    `${GITHUB_API}/repos/${owner}/${repo}/issues?state=open&labels=bounty,enhancement&per_page=30`
  );

  if (!Array.isArray(issues)) {
    console.log(`⚠️  ${owner}/${repo}: rate limited or error`);
    return [];
  }

  const bounties = issues
    .filter(i => !i.pull_request)
    .map(issue => {
      const bountyLabel = issue.labels.find(l => 
        l.name.toLowerCase().includes('bounty') || 
        l.name.toLowerCase().includes('reward') ||
        l.name.toLowerCase().includes('l402') ||
        l.name.toLowerCase().includes('lightning')
      );
      const rewardMatch = issue.body?.match(/\$?([\d,]+)\s*(FNDRY|SatGPT|USD|USDT|RTC|Token)/i);
      const reward = rewardMatch ? rewardMatch[0] : 'TBD';
      
      return {
        repo: `${owner}/${repo}`,
        number: issue.number,
        title: issue.title,
        url: issue.html_url,
        labels: issue.labels.map(l => l.name),
        reward,
        difficulty: issue.labels.find(l => l.name.toLowerCase().includes('easy') || l.name.toLowerCase().includes('beginner'))
          ? 'easy'
          : issue.labels.find(l => l.name.toLowerCase().includes('hard') || l.name.toLowerCase().includes('expert'))
          ? 'hard'
          : 'medium',
        created: issue.created_at,
        comments: issue.comments,
        body: (issue.body || '').slice(0, 500),
      };
    });

  console.log(`   ✅ Found ${bounties.length} bounty issues`);
  return bounties;
}

async function main() {
  console.log('🎯 SatGate Bounty Scout starting...\n');
  
  const allBounties = [];
  
  for (const repo of REPOS) {
    const [owner, name] = repo.split('/');
    const bounties = await scanRepo(owner, name);
    allBounties.push(...bounties);
    await new Promise(r => setTimeout(r, 1000)); // rate limit protection
  }

  // Sort by reward potential
  allBounties.sort((a, b) => {
    const aVal = parseFloat(a.reward.replace(/[^\d]/g, '')) || 0;
    const bVal = parseFloat(b.reward.replace(/[^\d]/g, '')) || 0;
    return bVal - aVal;
  });

  console.log('\n══════════════════════════════════════════════');
  console.log(`  🦞 SatGate Bounty Scout Results`);
  console.log(`  Total: ${allBounties.length} opportunities`);
  console.log('══════════════════════════════════════════════\n');

  if (allBounties.length === 0) {
    console.log('No bounties found. Try setting GH_TOKEN for higher rate limits.');
    console.log('Also check: https://github.com/satgatexyz/satgate/issues\n');
  } else {
    allBounties.forEach((b, i) => {
      console.log(`${i + 1}. [${b.repo}] #${b.number}`);
      console.log(`   Title: ${b.title}`);
      console.log(`   Reward: ${b.reward} | Difficulty: ${b.difficulty}`);
      console.log(`   🔗 ${b.url}`);
      console.log(`   Labels: ${b.labels.slice(0, 4).join(', ')}`);
      if (b.body) console.log(`   💬 ${b.comments} comments`);
      console.log('');
    });
  }

  // Save results
  const fs = require('fs');
  const path = require('path');
  const outFile = path.join(__dirname, 'reports', `satgate-bounties-${Date.now()}.json`);
  require('fs').mkdirSync(path.dirname(outFile), { recursive: true });
  require('fs').writeFileSync(outFile, JSON.stringify(allBounties, null, 2));
  console.log(`📁 Results saved to ${outFile}`);
}

main().catch(console.error);
