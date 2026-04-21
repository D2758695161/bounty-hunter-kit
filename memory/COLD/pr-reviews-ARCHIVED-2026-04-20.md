# PR Reviews Tracker
Last updated: 2026-03-27 14:53 GMT+8

## Summary
- 3 PRs are **open and active**
- 3 PRs from claude-builders-bounty do **not exist** (404)
- No PRs have been merged yet

---

## PR Details

### 1. googleworkspace/cli PR #633
- **Title:** feat(auth): re-add service account impersonation via --subject flag
- **State:** open | Merged: false
- **URL:** https://github.com/googleworkspace/cli/pull/633
- **Author:** D2758695161
- **Comments:** 4 | Review comments: 2

**Reviews:**
- `gemini-code-assist[bot]` (2026-03-27 06:37 UTC): Found bug in `extract_global_flag` - it incorrectly parses a subsequent flag as the value for the current flag. **Status: PENDING (was fixed by D2758695161 in commit 34f0d80)**
- `D2758695161` (2026-03-27 06:52 UTC): Fixed! Added `!args[i + 1].starts_with("-")` guard. Also updated doc comment.
- `gemini-code-assist[bot]` (2026-03-27 06:55 UTC): Follow-up review (COMMENTED)
- `googleworkspace-bot` (2026-03-27 06:52 UTC): Triggered `/gemini review` command

**Recent activity:** Reviewer found a parsing bug → author fixed it immediately → follow-up review pending.

**Actions needed:** None currently. Waiting for final review/approval from gemini-code-assist.

---

### 2. illbnm/homelab-stack PR #359
- **Title:** feat(backup): add Backup & DR stack ( bounty #12)
- **State:** open | Merged: false
- **URL:** https://github.com/illbnm/homelab-stack/pull/359
- **Author:** D2758695161
- **Comments:** 1 | Review comments: 0

**Issue comments:**
- `zhuzhushiwojia` (2026-03-27 05:33 UTC): Bounty claim from "bigeye" with wallet address TMLkvEDrjvHEUbWYU1jfqyUKmbLNZkx6T1 (USDT TRC20). No actual code review yet.

**Actions needed:** None currently. PR is awaiting review.

---

### 3. TechGuyTest/FunWebGames PR #24
- **Title:** feat: PWA icons and landing page sound toggle
- **State:** open | Merged: false
- **URL:** https://github.com/TechGuyTest/FunWebGames/pull/24
- **Author:** D2758695161
- **Comments:** 0 | Review comments: 0

**Activity:** No comments or reviews yet.

**Actions needed:** None currently. Awaiting review.

---

### 4-6. claude-builders-bounty PRs #40, #41, #42
- **Status:** NOT FOUND (404)
- These PRs do not exist in the D2758695161/claude-builders-bounty repo (which has 0 PRs total).
- **Action needed:** Verify correct repo/PR numbers.

---

## History Log
- 2026-03-27 14:53 GMT+8: Initial scan. PRs #633, #359, #24 are open. claude-builders-bounty PRs #40-42 don't exist.
