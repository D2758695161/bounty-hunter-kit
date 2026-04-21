#!/usr/bin/env node
/**
 * 🦞 Labmain Bounty Scout v1.0
 * 
 * Scans kcolbchain/labmain for open bounties with USDT rewards.
 * Labmain pays REAL USDT (on-chain) for merged PRs — no vaporware.
 * 
 * Usage:
 *   node scripts/labmain-scout.js
 *   node scripts/labmain-scout.js --min 100 --max 500
 *   node scripts/labmain-scout.js --claim 33
 * 
 * Rewards are tracked in the repo's bounty board.
 * Payment: USDT on Ethereum/BSC after PR merge
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.GH_TOKEN || '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';
const OWNER = 'kcolbchain';
const REPO = 'labmain';
const OUTFILE = path.join(__dirname, '..', 'labmain-bounties.json');

// CLI args
const args = process.argv.slice(2);
const minBounty = parseInt(args.find(a => a.startsWith('--min'))?.split('=')[1] || '0');
const maxBounty = parseInt(args.find(a => a.startsWith('--max'))?.split('=')[1] || '9999');
const claimArg = args.find(a => a.startsWith('--claim'));
const claimNum = claimArg ? parseInt(claimArg.split('=')[1] || claimArg.replace('--claim', '')) : null;

// Known bounty labels in labmain
const BOUNTY_LABELS = ['bounty', 'bounty-easy', 'bounty-medium', 'bounty-hard', 'bounty-critical'];
const USD_SYMBOL = '$';

function api(method, urlPath, body) {
    return new Promise((resolve, reject) => {
        const data = body ? JSON.stringify(body) : undefined;
        const opts = {
            hostname: 'api.github.com',
            path: urlPath,
            method,
            headers: {
                'Authorization': `token ${TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'labmain-scout',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        };
        if (data) opts.headers['Content-Length'] = Buffer.byteLength(data);
        
        const req = https.request(opts, res => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => {
                try { resolve(JSON.parse(d)); }
                catch { resolve({ raw: d }); }
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

function parseReward(text) {
    if (!text) return null;
    // Match $XXX or $X,XXX patterns
    const match = text.match(/\$([0-9,]+)/);
    if (match) return parseInt(match[1].replace(/,/g, ''));
    return null;
}

function scoreIssue(issue) {
    let score = 0;
    
    // Label-based scoring
    if (issue.labels.some(l => l.name === 'bounty-critical')) score += 30;
    else if (issue.labels.some(l => l.name === 'bounty-hard')) score += 20;
    else if (issue.labels.some(l => l.name === 'bounty-medium')) score += 12;
    else if (issue.labels.some(l => l.name === 'bounty-easy')) score += 8;
    else if (issue.labels.some(l => l.name === 'bounty')) score += 5;
    
    // Recency bonus
    const daysOld = (Date.now() - new Date(issue.created_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysOld < 1) score += 15;
    else if (daysOld < 3) score += 10;
    else if (daysOld < 7) score += 5;
    else if (daysOld > 30) score -= 10;
    
    // Low competition (no assignees)
    if (!issue.assignee) score += 8;
    if (issue.comments === 0) score += 5;
    else if (issue.comments < 3) score += 3;
    
    // Extract reward from body
    const reward = parseReward(issue.body) || parseReward(issue.title);
    if (reward) {
        score += Math.min(reward / 50, 30);
    }
    
    return score;
}

function formatReward(reward) {
    if (!reward) return 'TBD';
    return `$${reward}`;
}

async function getIssuesForRepo(owner, repo) {
    console.log(`\n🔍 Scanning ${owner}/${repo} for bounty issues...\n`);
    
    let page = 1;
    let allIssues = [];
    let hasMore = true;
    
    while (hasMore) {
        const data = await api('GET', `/repos/${owner}/${repo}/issues?state=open&per_page=100&page=${page}&sort=created&direction=desc`);
        
        if (data.message) {
            console.error(`❌ API Error: ${data.message}`);
            process.exit(1);
        }
        
        if (data.length === 0) {
            hasMore = false;
        } else {
            // Filter out PRs and pull requests
            const issues = data.filter(i => !i.pull_request);
            allIssues = allIssues.concat(issues);
            page++;
            
            if (data.length < 100) hasMore = false;
            
            // Rate limit protection
            await new Promise(r => setTimeout(r, 100));
        }
    }
    
    return allIssues;
}

async function getLabelsForRepo(owner, repo) {
    const data = await api('GET', `/repos/${owner}/${repo}/labels?per_page=100`);
    if (Array.isArray(data)) {
        return data.map(l => l.name);
    }
    return [];
}

async function main() {
    console.log('═══════════════════════════════════════════════');
    console.log('🦞 Labmain Bounty Scout — USDT Rewards');
    console.log('═══════════════════════════════════════════════');
    console.log(`Target: ${OWNER}/${REPO}`);
    console.log(`Filter: $${minBounty} - $${maxBounty}`);
    console.log('');
    
    // If --claim mode, fetch specific issue
    if (claimNum) {
        console.log(`\n🎯 Direct claim mode: Issue #${claimNum}\n`);
        const data = await api('GET', `/repos/${OWNER}/${REPO}/issues/${claimNum}`);
        
        if (data.message) {
            console.error(`❌ Issue #${claimNum} not found: ${data.message}`);
            process.exit(1);
        }
        
        if (data.pull_request) {
            console.error(`❌ Issue #${claimNum} is a PR, not an issue`);
            process.exit(1);
        }
        
        const reward = parseReward(data.body) || parseReward(data.title);
        const hasBountyLabel = data.labels.some(l => 
            BOUNTY_LABELS.includes(l.name.toLowerCase())
        );
        
        console.log(`#${data.number}: ${data.title}`);
        console.log(`  URL: ${data.html_url}`);
        console.log(`  Reward: ${formatReward(reward)}`);
        console.log(`  Bounty Label: ${hasBountyLabel ? '✅ Yes' : '❌ No'}`);
        console.log(`  Assignee: ${data.assignee ? data.assignee.login : 'None (available!)'}`);
        console.log(`  Comments: ${data.comments}`);
        console.log(`  Created: ${new Date(data.created_at).toLocaleDateString()}`);
        console.log(`  Labels: ${data.labels.map(l => l.name).join(', ')}`);
        
        if (hasBountyLabel && reward >= minBounty && reward <= maxBounty && !data.assignee) {
            console.log('\n✅ CLAIMABLE! Use this comment template:');
            console.log('─'.repeat(50));
            console.log(`I'd like to claim this bounty! 🎯\nCan you assign it to me so I can get started?`);
            console.log('─'.repeat(50));
        }
        
        return;
    }
    
    // Full scan mode
    const issues = await getIssuesForRepo(OWNER, REPO);
    console.log(`📋 Total open issues found: ${issues.length}\n`);
    
    // Filter for bounty-related issues
    const bountyIssues = issues.filter(issue => {
        const labelNames = issue.labels.map(l => l.name.toLowerCase());
        const hasBountyLabel = labelNames.some(l => BOUNTY_LABELS.includes(l));
        const hasReward = parseReward(issue.body) || parseReward(issue.title);
        return hasBountyLabel || hasReward;
    });
    
    console.log(`💰 Bounty-labeled issues: ${bountyIssues.length}\n`);
    
    if (bountyIssues.length === 0) {
        console.log('No bounty-labeled issues found. Showing all issues with $ in body...\n');
        const withReward = issues.filter(i => parseReward(i.body) || parseReward(i.title));
        if (withReward.length > 0) {
            bountyIssues.push(...withReward);
        }
    }
    
    // Score and rank
    const scored = bountyIssues.map(issue => ({
        ...issue,
        reward: parseReward(issue.body) || parseReward(issue.title) || 0,
        score: scoreIssue(issue)
    })).filter(issue => {
        // Filter by reward range
        if (issue.reward === 0) return true; // Include if no explicit reward but has bounty label
        return issue.reward >= minBounty && issue.reward <= maxBounty;
    }).sort((a, b) => b.score - a.score);
    
    if (scored.length === 0) {
        console.log('❌ No matching bounties found in this range.');
        console.log(`   Try: node scripts/labmain-scout.js --min 0 --max 9999`);
        return;
    }
    
    // Display ranked list
    console.log('🏆 Top Bounties (ranked by ROI):\n');
    console.log('─'.repeat(80));
    
    scored.forEach((issue, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : ` ${i + 1}.`;
        const availability = issue.assignee ? '🔒' : '🟢';
        const age = Math.floor((Date.now() - new Date(issue.created_at).getTime()) / (1000 * 60 * 60 * 24));
        const reward = issue.reward > 0 ? `$${issue.reward}` : 'TBD';
        const bountyLabel = issue.labels.find(l => BOUNTY_LABELS.includes(l.name.toLowerCase()))?.name || 'bounty';
        
        console.log(`${medal} #${issue.number}: ${issue.title.substring(0, 60)}${issue.title.length > 60 ? '...' : ''}`);
        console.log(`   💵 Reward: ${reward} | Label: ${bountyLabel} | ${availability} ${issue.assignee ? issue.assignee.login : 'UNCLAIMED'}`);
        console.log(`   💬 ${issue.comments} comments | 📅 ${age}d ago | Score: ${issue.score}`);
        console.log(`   🔗 ${issue.html_url}`);
        console.log('');
    });
    
    console.log('─'.repeat(80));
    
    // Save to file
    const output = scored.map(issue => ({
        id: issue.id,
        number: issue.number,
        title: issue.title,
        url: issue.html_url,
        reward: issue.reward,
        bountyLabel: issue.labels.find(l => BOUNTY_LABELS.includes(l.name.toLowerCase()))?.name || 'bounty',
        assignee: issue.assignee?.login || null,
        comments: issue.comments,
        score: issue.score,
        createdAt: issue.created_at,
        labels: issue.labels.map(l => l.name)
    }));
    
    fs.writeFileSync(OUTFILE, JSON.stringify(output, null, 2));
    console.log(`💾 Saved ${output.length} bounties to ${OUTFILE}`);
    
    // Show top pick
    if (scored[0]) {
        const top = scored[0];
        if (!top.assignee && top.reward >= minBounty) {
            console.log('\n🎯 TOP PICK:');
            console.log(`   Claim #${top.number} — ${top.title.substring(0, 50)}...`);
            console.log(`   Reward: $${top.reward} USDT | Score: ${top.score}`);
            console.log(`   Comment to claim:`);
            console.log(`   "I'd like to work on this! Can you assign it to me? 🎯"`);
        }
    }
}

main().catch(console.error);
