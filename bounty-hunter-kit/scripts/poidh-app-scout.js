/**
 * POIDH App Bounty Scout v1.0
 * Scans poidh.app bounty listings — zero门槛入门 Bounty 平台
 * 
 * poidh.app features:
 * - Beginner-friendly bounty platform
 * - Albums Bug Fix 系列适合新手入门
 * - GitHub Issues integration
 * - Fast payout via GitHub Sponsors
 * 
 * Usage:
 *   node scripts/poidh-app-scout.js [minReward] [maxReward]
 *   node scripts/poidh-app-scout.js 10 500
 *   node scripts/poidh-app-scout.js 50   # show bounties >= $50
 */

const MIN_REWARD = parseInt(process.argv[2] || '0');
const MAX_REWARD = parseInt(process.argv[3] || '999999');

const TIER_COLORS = {
  'beginner': '#4ECDC4',   // cyan — good first issues
  'standard': '#FF6B35',   // orange — regular bounties
  'premium': '#FFD93D',    // gold — high value
  'albums': '#a855f7',      // purple — albums series
};

function formatReward(reward) {
  if (reward >= 1000) return `$${(reward/1000).toFixed(1)}K`;
  return `$${reward}`;
}

function scoreBounty(bounty) {
  let score = 0;
  // Reward score (normalized)
  score += Math.min(rewardUSD / 50, 30);
  // Age bonus — newer bounties are hotter
  if (bounty.createdAt) {
    const daysAgo = (Date.now() - new Date(bounty.createdAt).getTime()) / (1000*60*60*24);
    if (daysAgo < 1) score += 20;
    else if (daysAgo < 3) score += 15;
    else if (daysAgo < 7) score += 10;
    else if (daysAgo < 14) score += 5;
  }
  // Zero-assignee bonus
  if (!bounty.assignee) score += 10;
  // Low competition bonus (few comments = less competition)
  if (bounty.commentCount === 0) score += 8;
  else if (bounty.commentCount <= 2) score += 4;
  // Beginner-friendly tag bonus
  if (bounty.tags && bounty.tags.some(t => t.toLowerCase().includes('beginner') || t.toLowerCase().includes('good-first'))) {
    score += 5;
  }
  return Math.round(score * 10) / 10;
}

async function fetchPoidhBounties() {
  const results = [];
  
  // poidh.app API endpoints
  // Note: poidh.app uses GitHub Issues as backend, so we query via GitHub API
  const sources = [
    { name: 'poidh-app-issues', url: 'https://api.github.com/repos/poidh-app/poidh-app/issues?state=open&per_page=50&sort=created&direction=desc' },
    { name: 'poidh-app-bounties', url: 'https://api.github.com/repos/poidh-app/bounties/issues?state=open&per_page=50' },
  ];

  for (const source of sources) {
    try {
      const res = await fetch(source.url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'BountyHunterKit/1.0',
          'Authorization': `token ${process.env.GH_TOKEN || ''}`
        }
      });
      
      if (!res.ok) {
        // Fallback: try unauthenticated
        const fallbackRes = await fetch(source.url.replace('?state=open', '?state=open&labels=bounty'), {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'BountyHunterKit/1.0'
          }
        });
        if (!fallbackRes.ok) {
          console.log(`[SKIP] ${source.name}: HTTP ${fallbackRes.status}`);
          continue;
        }
        const data = await fallbackRes.json();
        processBounties(data, results, source.name);
      } else {
        const data = await res.json();
        processBounties(data, results, source.name);
      }
    } catch (e) {
      console.log(`[WARN] ${source.name}: ${e.message}`);
    }
  }

  return results;
}

function processBounties(issues, results, sourceName) {
  let count = 0;
  for (const issue of issues) {
    // Skip PRs
    if (issue.pullRequest) continue;
    
    // Look for reward amount in title or body
    const rewardMatch = issue.title.match(/\$?\s*(\d+)\s*(USD|FNDRY|RTC|OP|SOL)?/i) ||
                        issue.body.match(/\$?\s*(\d+)\s*(USD|FNDRY|RTC|OP|SOL|USDT)?/i);
    
    let rewardUSD = 0;
    let rewardText = '';
    let currency = 'USD';
    
    if (rewardMatch) {
      rewardUSD = parseInt(rewardMatch[1]) || 0;
      rewardText = formatReward(rewardUSD);
      if (rewardMatch[2]) currency = rewardMatch[2].toUpperCase();
      // Normalize different currencies to USD equivalent
      if (currency === 'FNDRY') rewardUSD = rewardUSD * 0.0001; // rough estimate
      else if (currency === 'RTC') rewardUSD = rewardUSD * 0.05;
      else if (currency === 'OP') rewardUSD = rewardUSD * 3;
      else if (currency === 'SOL') rewardUSD = rewardUSD * 150;
    }
    
    if (rewardUSD < MIN_REWARD || rewardUSD > MAX_REWARD) continue;
    
    const labels = issue.labels || [];
    const tags = labels.map(l => l.name);
    const isAlbums = tags.some(t => t.toLowerCase().includes('albums') || t.toLowerCase().includes('bug-fix'));
    const tier = isAlbums ? 'albums' : 
                 rewardUSD >= 200 ? 'premium' : 
                 rewardUSD >= 50 ? 'standard' : 'beginner';
    
    results.push({
      source: 'poidh.app',
      id: issue.id,
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
      repo: 'poidh-app/poidh-app',
      description: (issue.body || '').slice(0, 300),
      rewardUSD: Math.round(rewardUSD * 100) / 100,
      reward: rewardText || 'negotiable',
      tier,
      tags,
      language: null,
      commentCount: issue.comments || 0,
      assignee: issue.assignee?.login || null,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      difficulty: tier === 'beginner' || tier === 'albums' ? 'easy' : tier === 'premium' ? 'hard' : 'medium',
      score: 0,
      isAlbums,
    });
    count++;
  }
  console.log(`[OK] ${sourceName}: ${count} bounties found`);
}

async function main() {
  console.log('\n�搜查 POIDH App Bounty...\n');
  
  const bounties = await fetchPoidhBounties();
  
  // Calculate scores
  for (const bounty of bounties) {
    bounty.score = scoreBounty(bounty);
  }
  
  // Sort by score descending
  bounties.sort((a, b) => b.score - a.score);
  
  if (bounties.length === 0) {
    console.log('\n⚠️  未找到符合条件的 Bounty');
    console.log('💡 提示: poidh.app 使用 GitHub Issues 作为 bounty 前端');
    console.log('   直接访问: https://github.com/poidh-app/poidh-app/issues\n');
    return;
  }
  
  console.log(`\n📋 找到 ${bounties.length} 个 Bounty ($${MIN_REWARD}+):\n`);
  
  // Group by tier
  const groups = {
    albums: { label: '📚 Albums 系列（新手入门）', items: [] },
    beginner: { label: '🐚 零门槛（适合练手）', items: [] },
    standard: { label: '🦐 中等难度', items: [] },
    premium: { label: '🦀 高价值', items: [] },
  };
  
  for (const b of bounties) {
    if (groups[b.tier]) groups[b.tier].items.push(b);
  }
  
  for (const [tier, group] of Object.entries(groups)) {
    if (group.items.length === 0) continue;
    console.log(`\n${group.label} (${group.items.length}个):\n`);
    for (const b of group.items.slice(0, 8)) {
      const status = b.assignee ? '🔴 已认领' : '🟢 可抢';
      const difficulty = b.difficulty === 'easy' ? '🐚' : b.difficulty === 'medium' ? '🦐' : '🦀';
      console.log(`  ${status} ${difficulty} [#${b.number}] ${b.title.slice(0, 60)}`);
      console.log(`      💰 ${b.reward} | 💬 ${b.commentCount} comments | ${b.tier === 'albums' ? '📚 Albums' : '🏷️ ' + b.tags.slice(0,2).join(', ')}`);
      console.log(`      🔗 ${b.url}`);
      console.log();
    }
  }
  
  // Top picks
  console.log('\n🏆 推荐优先认领（TOP 3）:\n');
  const top3 = bounties.filter(b => !b.assignee).slice(0, 3);
  for (let i = 0; i < top3.length; i++) {
    const b = top3[i];
    console.log(`  ${i+1}. ${b.title}`);
    console.log(`     💰 ${b.reward} | 🏷️ ${b.tags.slice(0, 3).join(', ')} | 📅 ${b.createdAt ? new Date(b.createdAt).toLocaleDateString('zh-CN') : 'unknown'}`);
    console.log(`     🔗 ${b.url}\n`);
  }
  
  console.log(`\n总奖励池: $${bounties.reduce((sum, b) => sum + b.rewardUSD, 0).toFixed(0)} USD-equiv`);
  console.log(`数据来源: poidh.app + GitHub Issues\n`);
}

main().catch(console.error);
