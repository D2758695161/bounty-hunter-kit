# Stellar USDC & L402 Lightning Bridge — Bounty Hunting Guide

> How to hunt and win bounties on issueflow-buidl (Stellar USDC), SatGate, and L402 platforms.

## Why Stellar USDC Bounties?

- **On-chain settlement** — Payment goes directly to your Stellar wallet (no middleman)
- **Low competition** — New platform, few hunters yet
- **Fast payout** — Stellarconfirmations in ~3-5 seconds
- **Growing ecosystem** — New repos added weekly

## Platform Targets

| Platform | Repos | Payment | Competition | Start Here |
|----------|-------|---------|-------------|------------|
| issueflow-buidl | issueflow-contracts, -cli, -backend | Stellar USDC | 🟢 Very Low | ✅ Start here |
| SatGate | satgate-core, satgate-sdk | Stellar USDC | 🟢 Low | ⭐ Next |
| L402 Protocol | lumen-chain, l402-sdk | XLM + USDC | 🟡 Medium | Advanced |

## Claiming Stellar Bounties (Step by Step)

### 1. Set Up Your Stellar Wallet

```bash
# Option A: Albedo (web wallet) — https://albedo.link/
# Option B: Freighter (browser extension) — https://freighter.app/
# Option C: Rabet wallet — https://rabet.io/

# Get a Stellar public key (starts with G...)
# Example: GDFJ3KJK3HFGJHKJHGKJHGJKHGJKHGKJHGKJHGKJHGKJHG=
```

### 2. Find Bounties

```bash
# Scan issueflow-buidl repos
node scripts/issueflow-scout.js

# Scan SatGate bounties  
node scripts/satgate-bounty-scout.js

# Filter by score > 70 for best opportunities
```

### 3. Claim the Bounty

Post this comment on the issue:

```
🏴 Claiming this bounty!

I've reviewed the requirements and I'm confident I can deliver.
Stellar wallet for payment: YOUR_STELLAR_PUBLIC_KEY (e.g., G...)

Delivery timeline: 24-72 hours
Relevant experience: [brief note on similar work]
```

### 4. Implement (Rust/Soroban Focus)

issueflow-buidl repos use:
- **Rust** as the main language
- **Soroban SDK** for smart contracts
- **Stellar SDK** for token operations
- **Actix-web** for backend APIs

```bash
# Install Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add x86_64-unknown-linux-gnu

# Clone and set up
gh repo fork issueflow-buidl/issueflow-contracts
cd issueflow-contracts
cargo build

# Run tests
cargo test

# Create your branch
git checkout -b fix/issue-123
```

### 5. For L402 / Lightning Bridge Work

L402 is a protocol for Lightning Network payments over HTTP:
- **HTLC** (Hashed Timelock Contracts) for atomic swaps
- **Payment channels** for microtransactions
- **Bolt 11 invoices** for payment requests

```rust
// Example: Creating an HTLC in Soroban/Rust
use soroban_sdk::{Contract, Env, Symbol, Vec};

pub struct HtlcContract;

#[Contract]
impl HtlcContract {
    pub fn create_htlc(
        env: Env,
        recipient: Address,
        hash_preimage: BytesN<32>,
        timelock: u32,
    ) -> u32 {
        // Store HTLC details
        let key = Symbol::short(&"htlc");
        // ... implementation
    }
}
```

## L402 Bounty Keywords to Watch For

| Keyword | Means | Action |
|---------|-------|--------|
| `htlc` | Hash Timelock Contract | Study Lightning spec |
| `lnurl` | Lightning URL payment | Check lnurl-pay spec |
| `bolt11` | Invoice format | Parse bolt11 library |
| `scb` | Static channel backup | Stellar specific |
| `claim` | Time-locked claim | HTLC redemption |

## Issue Templates for Stellar Bounties

### Claim Comment
```
🏴 Bounty Claim — Stellar USDC

**Stellar Address:** YOUR_G_PUBLIC_KEY
**Estimated Delivery:** 48-72 hours
**Approach:** [1-2 sentences on how you'll solve it]

I've built similar [Rust/Soroban] projects before:
- [Link to relevant repo or PR]
```

### PR Description Template
```markdown
## Bounty: [Issue #XXX] — [Title]

**Payment:** Stellar USDC → GXXXXXXXXXXXXX

### What This Fixes
[Clear description of the bug/feature]

### Changes Made
- [List of specific changes]
- [Files modified]

### Testing
- [ ] Test case 1
- [ ] Test case 2

### Screenshots (if UI)
[Add screenshots here]
```

## Competition Scoring

When evaluating a Stellar bounty opportunity:

```
Total Score = Base(50) 
            + Value Keywords(+30) 
            + Rust/Soroban(+20)  
            + CLI/SDK Tool(+15)
            + 0 Comments(+25) | Low Comments(+10)
            + Fresh(<2 days)(+20) | <7 days(+10)
            - Already Assigned(-50)
            + Beginner-Friendly(+10)
```

**Target: Score > 70 = High-value opportunity**

## Pro Tips for Stellar Bounties

1. **Set up Albedo or Freighter** before you start — you'll need the wallet ready for payment
2. **Join the Stellar Discord** — many bounties are posted there first before GitHub
3. **Look for "help wanted" issues** in the issueflow repos — these are explicitly asking for help
4. **Read the Soroban docs** at soroban.stellar.org — it's the smart contract platform
5. **Check recent commits** to understand code style before submitting
6. **Engage early** — comment on issues before implementing to avoid duplicate work

## Quick Links

- Stellar Docs: https://developers.stellar.org
- Soroban Smart Contracts: https://soroban.stellar.org
- Stellar SDK (Rust): https://github.com/stellar/rs-soroban-sdk
- Albedo Wallet: https://albedo.link
- Freighter Wallet: https://freighter.app
- issueflow-buidl: https://github.com/issueflow-buidl

---

**Remember:** Stellar USDC bounties settle in ~5 seconds. Once your PR is merged, payment is near-instant.
