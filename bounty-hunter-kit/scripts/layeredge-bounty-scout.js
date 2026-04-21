#!/usr/bin/env node
/**
 * LayerEdge Bounty Scout — Auto Claim + Submit
 * Scans LayerEdge ecosystem for active bounties and generates claim reports
 * 
 * LayerEdge features:
 * - DePIN + AI Compute bounty ecosystem
 * - RCT token rewards
 * - GitHub Issues integration
 * - Automated verification pipeline
 * 
 * Usage:
 *   node scripts/layeredge-bounty-scout.js
 *   node scripts/layeredge-bounty-scout.js --min 50 --repo rustchain-bounties
 *   FILTER=rust node scripts/layeredge-bounty-scout.js
 */

const https = require("https");

const MIN_REWARD = parseInt(process.argv.includes("--min") 
  ? process.argv[process.argv.indexOf("--min") + 1] : "0");
const REPO_FILTER = process.argv.includes("--repo") 
  ? process.argv[process.argv.indexOf("--repo") + 1] 
  : process.env.FILTER || "all";

const TIER_COLORS = {
  "critical": "\x1b[31m",     // red
  "high": "\x1b[33m",        // yellow  
  "medium": "\x1b[36m",      // cyan
  "beginner": "\x1b[32m",    // green
};

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

function githubApi(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path: "/repos/" + path,
      headers: {
        "User-Agent": "bounty-scout-layeredge",
        "Accept": "application/vnd.github.v3+json",
        ...(process.env.GH_TOKEN ? { "Authorization": `token ${process.env.GH_TOKEN}` } : {}),
      },
    };
    https.get(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(null); }
      });
    }).on("error", reject);
  });
}

function searchGithub(query, perPage = 30) {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(query);
    const options = {
      hostname: "api.github.com",
      path: `/search/issues?q=${encoded}&per_page=${perPage}&sort=updated`,
      headers: {
        "User-Agent": "bounty-scout-layeredge",
        "Accept": "application/vnd.github.v3+json",
        ...(process.env.GH_TOKEN ? { "Authorization": `token ${process.env.GH_TOKEN}` } : {}),
      },
    };
    https.get(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(null); }
      });
    }).on("error", reject);
  });
}

function parseReward(text) {
  if (!text) return 0;
  // Match RCT amounts
  const rctMatch = text.match(/(\d+(?:\.\d+)?)\s*RCT/i);
  if (rctMatch) return parseFloat(rctMatch[1]);
  // Match USD
  const usdMatch = text.match(/\$[\d,]+(?:\.\d+)?/);
  if (usdMatch) return parseFloat(usdMatch[0].replace(/[$,]/g, ""));
  return 0;
}

function estimateDifficulty(labels) {
  const labelNames = (labels || []).map(l => l.name.toLowerCase());
  if (labelNames.some(l => l.includes("beginner") || l.includes("good first") || l.includes("easy"))) return "beginner";
  if (labelNames.some(l => l.includes("critical") || l.includes("urgent") || l.includes("high priority"))) return "critical";
  if (labelNames.some(l => l.includes("medium") || l.includes("standard"))) return "medium";
  return "high";
}

async function fetchLayerEdgeRepos() {
  const repos = [
    { owner: "Scottcjn", repo: "rustchain-bounties", name: "RustChain Bounties" },
    { owner: "layeredge", repo: "core", name: "LayerEdge Core" },
    { owner: "layeredge", repo: "bounties", name: "LayerEdge Official Bounties" },
  ];
  
  if (REPO_FILTER !== "all") {
    const filtered = repos.filter(r => 
      r.repo.includes(REPO_FILTER) || r.name.toLowerCase().includes(REPO_FILTER.toLowerCase())
    );
    if (filtered.length) return filtered;
  }
  
  return repos;
}

async function fetchBountiesForRepo(owner, repo, name) {
  try {
    const [issues, repoInfo] = await Promise.all([
      githubApi(`${owner}/${repo}/issues?state=open&per_page=50`),
      githubApi(`${owner}/${repo}`),
    ]);
    
    if (!issues || !Array.isArray(issues)) return [];
    
    const bounties = issues
      .filter(issue => !issue.pull_request && !issue.title.toLowerCase().includes("closed"))
      .map(issue => {
        const reward = parseReward(issue.body || "") || 
                       parseReward(issue.title || "");
        const difficulty = estimateDifficulty(issue.labels);
        const age = issue.created_at 
          ? Math.floor((Date.now() - new Date(issue.created_at).getTime()) / (1000 * 60 * 60 * 24))
          : 99;
        
        return {
          id: issue.id,
          number: issue.number,
          title: issue.title,
          url: issue.html_url,
          reward,
          rewardDisplay: reward > 0 ? `${reward} RCT` : "Bounty",
          difficulty,
          age,
          ageDisplay: age === 0 ? "today" : `${age}d ago`,
          labels: (issue.labels || []).slice(0, 4).map(l => l.name),
          repo: `${owner}/${repo}`,
          repoStars: repoInfo?.stargazers_count || 0,
          comments: issue.comments,
          assignee: issue.assignee?.login || null,
        };
      })
      .filter(b => b.reward >= MIN_REWARD || b.reward === 0)
      .sort((a, b) => {
        // Prioritize: reward desc, then age asc
        if (b.reward !== a.reward) return b.reward - a.reward;
        return a.age - b.age;
      });
    
    return bounties;
  } catch (err) {
    console.error(`Error fetching ${owner}/${repo}: ${err.message}`);
    return [];
  }
}

function printBanner() {
  console.log(`
${BOLD}🦞 LayerEdge Bounty Scout${RESET}
${"─".repeat(50)}
LayerEdge DePIN + AI Compute Bounty Aggregator
Scans RustChain & LayerEdge ecosystem bounties
`);
}

function printBounty(bounty, index) {
  const tier = bounty.difficulty;
  const color = TIER_COLORS[tier] || "";
  const rewardStr = bounty.reward > 0 ? `${bounty.rewardDisplay}` : "Bounty";
  
  console.log(`${BOLD}${index}. ${bounty.title}${RESET}`);
  console.log(`   ${color}[${tier.toUpperCase()}]${RESET} | ${rewardStr} | ${bounty.ageDisplay} | ${bounty.comments} comments`);
  console.log(`   ${bounty.url}`);
  if (bounty.labels.length) {
    console.log(`   Tags: ${bounty.labels.join(", ")}`);
  }
  console.log("");
}

async function main() {
  printBanner();
  
  const repos = await fetchLayerEdgeRepos();
  console.log(`Scanning ${repos.length} repos...\n`);
  
  let allBounties = [];
  for (const r of repos) {
    const bounties = await fetchBountiesForRepo(r.owner, r.repo, r.name);
    console.log(`  [${r.name}] → ${bounties.length} bounties found`);
    allBounties = allBounties.concat(bounties);
  }
  
  if (!allBounties.length) {
    console.log("\n❌ No bounties found matching criteria.");
    return;
  }
  
  // Sort by reward desc
  allBounties.sort((a, b) => b.reward - a.reward);
  
  console.log(`\n${BOLD}═══════════════════════════════════════${RESET}`);
  console.log(`${BOLD}🏆 Found ${allBounties.length} Bounties (sorted by reward):${RESET}\n`);
  
  allBounties.forEach((b, i) => printBounty(b, i + 1));
  
  // Summary
  const byTier = { critical: 0, high: 0, medium: 0, beginner: 0 };
  allBounties.forEach(b => byTier[b.difficulty] = (byTier[b.difficulty] || 0) + 1);
  
  console.log(`${BOLD}📊 Summary:${RESET}`);
  console.log(`   Total: ${allBounties.length} bounties`);
  if (allBounties.some(b => b.reward > 0)) {
    const top = Math.max(...allBounties.filter(b => b.reward > 0).map(b => b.reward));
    console.log(`   Top reward: ${top} RCT`);
  }
  console.log(`   By tier: ${Object.entries(byTier).map(([k, v]) => `${v} ${k}`).join(", ")}`);
  console.log(`   Filter: min=${MIN_REWARD} RCT, repo=${REPO_FILTER}`);
  console.log(`\n🔗 Run with --repo <name> to filter by repo`);
  console.log(`   GH_TOKEN=... node scripts/layeredge-bounty-scout.js  # faster with token\n`);
}

main().catch(console.error);
