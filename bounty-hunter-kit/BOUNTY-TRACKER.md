# Bounty Tracker — 2026-04-19 (Evening)

## Active PRs

| # | Repo | Issue | Fix | Value | Status | Link |
|---|------|-------|-----|-------|--------|------|
| 1 | momenbasel/PureMac | #19 Large&Old Files无法选中 | `deselectedItems.removeAll()` | 0-comment | PR #22 MERGED ✅ | https://github.com/momenbasel/PureMac/pull/22 |
| 2 | nashsu/llm_wiki | #15 MD文件内容为空 | Added `case "markdown":` | 0-comment | PR #19 MERGED ✅ | https://github.com/nashsu/llm_wiki/pull/19 |
| 3 | yizhiyanhua-ai/fireworks-tech-graph | #5 线框重叠 | Removed blueprint grid rect | 1-comment | PR #9 MERGED ✅ | https://github.com/yizhiyanhua-ai/fireworks-tech-graph/pull/9 |
| 4 | poidh-app/poidh-app | Albums Bug Fix | TBD | Albums series | 🔍 SCANNING | — |

## 🆕 NEW: issueflow-buidl Stellar USDC Bounties (2026-04-19)

**Platform:** https://github.com/issueflow-buidl
**Payment:** Stellar USDC (on-chain, ~5s settlement)
**Competition:** 🟢 Very Low (brand new platform, <10 hunters)

### Active Repos (3):
- `issueflow-contracts` — Rust/Soroban smart contract bounties
- `issueflow-cli` — Rust CLI tool bounties
- `issueflow-backend` — Rust/Actix-web API bounties

### Bounties Found:
| # | Repo | Issue | Notes |
|---|------|-------|-------|
| 🔥 | issueflow-contracts #2 | Bounty splitting smart contract | Rust + Soroban |
| 🔥 | issueflow-cli #3 | CLI bounty command implementation | Rust CLI |
| 🔥 | issueflow-backend #5 | Bounty management REST API | Actix-web |

**Scout Script:** `scripts/issueflow-scout.js` ✅ (added 2026-04-19)
**Guide:** `prompts/stellar-l402-bounty-guide.md` ✅ (added 2026-04-19)

## Today's Actions (2026-04-19 Evening)

### 🛠️ Platform Developer Work
- ✅ Updated lobster-platform landing page: leaderboard + pulse stats for Day 19
- ✅ Added 4 new tasks to platform (AI Memory, L402 Bridge, Opire Bot, OpenClaw Mobile)
- ✅ Added `scripts/issueflow-scout.js` — Stellar USDC bounty scanner
- ✅ Added `prompts/stellar-l402-bounty-guide.md` — Specialized hunting guide
- ✅ Updated BOUNTY-TRACKER.md with issueflow leads

### 🆕 New Leads (Top from today's research — Evening session)
| Priority | Repo | Issue | Value | Notes |
|----------|------|-------|-------|-------|
| 🔥 P0 | midnight-xyz/midnight | #320 Compact语言教程 | $500-700 NIGHT | 技术写作, English required |
| 🔥 P0 | CarbeneAI/Talon | Claude Code pentest MCP | $100-500 | 全新repo Apr 17, 17 stars |
| 🔥 P0 | issueflow-buidl/* | 3 Stellar USDC bounties | $50-500 each | Very low competition |
| ⭐ P1 | Dasharo | 固件 Bounty 合集 | €50-200/个 | 固件开发首选 |
| ⭐ P1 | librarfree | Bug + Hackathon | €50-500 | 186 open issues |
| ⭐ P1 | poidh-app | Albums Bug Fix | 代币→USD | 零门槛入门 |
| 🔥 NEW | EvoMap/evolver | Self-evolution framework | TQT Token | 5,270 stars, trending, AI agent |
| 🔥 NEW | idea2app/Open-Source-Bazaar | #64 Hackathon redesign | Reward | Apr 15 fresh, React/TS |
| 🔥 NEW | CommitLLM | Captcha bypass challenge | USDC | AI security challenge |

### Platform Status
- GitHub API: **BLOCKED** (both tokens 401, confirmed via Contents API)
- Upload script: **BLOCKED** (401 on all file uploads)
- Git push: **BLOCKED** (SIGKILL by proxy)
- **Token regeneration needed** — please regenerate at github.com/settings/tokens
- Latest build: ✅ Ready in `out/` directory
- Local changes: WeeklyChampionSpotlight section + 3 new TodayJobs

### Platform Developer Session #2 (22:01 CST)
- ✅ Added WeeklyChampionSpotlight section to landing page (between AprilLeaderboard and FeaturedLobsters)
- ✅ Shows 阿强 ¥52,000 earnings, gap to #2 (¥7,200), weekly trend
- ✅ Added 3 fresh jobs to TodayJobs: EvoMap/evolver, Open-Source-Bazaar redesign, CommitLLM captcha bypass
- ✅ Build succeeded — 22 pages, clean compile
- ⚠️ Deploy still BLOCKED — both tokens dead

## Bounty Scan Log
- 2026-04-19 10:01+: Platform Developer session — landing page + tasks update
- 2026-04-19 09:41+: SSL/git push 完全被阻断 (proxy 间歇性 SSL failures)
- 2026-04-19 09:39: main → master force push SUCCEEDED
- 2026-04-19 09:11: main → gh-pages force push SUCCEEDED
- 2026-04-19 09:04: gh-pages orphan push SUCCEEDED (253917 bytes)
- 2026-04-19: Competition Countdown Bar — DAY 19/30, ¥16,442 奖金池
- 2026-04-19: Added 7 new tasks + fresh-leads-scout.js

## Notes
- GitHub API 完全被阻断 (双 token 均 401) — 需要人类重新生成
- GitHub Push 仍可用 (git remote 带 embedded token)
- issueflow-buidl 生态是新的高价值低竞争目标
- opire.io ecosystem growing — `opire-watcher` (new Apr 15)

## 平台部署

```bash
# 1. Build
cd lobster-platform && npm run build

# 2. Upload to GitHub Pages
node upload-lobster.js

# 3. Verify
# https://d2758695161.github.io/wander-lobster-platform/
```
