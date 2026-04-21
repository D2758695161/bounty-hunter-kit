# Bounty Hunting Log

## 2026-03-27

### illbnm/homelab-stack

| # | Bounty | 标题 | 技术栈 | 状态 | 备注 |
|---|--------|------|--------|------|------|
| 14 | $280 | Integration Testing — 全栈集成测试 | Bash/Docker | **跳过** | 纯bash但需要真实Docker环境运行测试 |
| 13 | $80 | Notifications Stack | Bash/Docker | **跳过** | Docker + bash，需要运行容器 |
| 12 | $150 | Backup & DR | Bash/Docker | **跳过** | 需要Docker环境 |
| 11 | $100 | Database Layer | Bash/Docker | **跳过** | 需要Docker环境 |
| 10 | $280 | Observability Stack | YAML/Bash/Docker | **跳过** | Prometheus/Grafana配置，需要运行环境 |
| 9 | $300 | SSO — Authentik | Bash/Docker | **跳过** | 复杂认证栈，需要真实硬件 |
| 8 | $250 | Robustness — 国内网络适配 | Bash/Docker | **跳过** | 需要Docker网络环境 |
| 7 | $130 | Home Automation | Bash/Docker | **跳过** | 需要Zigbee硬件 |
| 6 | $220 | AI Stack | Bash/Docker | **跳过** | 需要GPU |
| 5 | $160 | Productivity Stack | Bash/Docker | **跳过** | 需要Docker环境 |

**结论**: 所有 homelab-stack bounty 都需要在真实 homelab 环境（Docker + 硬件）运行，纯代码提交无法验收。不适合远程提交PR。

### Scottcjn/rustchain-bounties

| # | Bounty | 标题 | 类型 | 状态 |
|---|--------|------|------|------|
| 2451 | 5,000 RTC | Founding 100 Antiquity Miners | 挖矿/硬件 | **跳过** - 非代码任务，需要真实老旧硬件 |
| 2322 | 1 RTC | Retro Screenshot Gallery | 社区活动 | **跳过** - 非代码 |
| 2321 | 2 RTC | Install sophia-edge-node | 测试报告 | **跳过** - 非代码PR |
| 2320 | 1-10 RTC | Cabinet Hunt Bosses | 游戏成就 | **跳过** - 非代码 |
| 2319 | 8 RTC | System Crown Challenge | 游戏成就 | **跳过** - 非代码 |
| 2318 | 3 RTC | First Cartridge Relic | 游戏成就 | **跳过** - 非代码 |
| 2317 | 5 RTC | Saturday Morning Speedrun | 游戏成就 | **跳过** - 非代码 |
| 2316 | 10 RTC | Play-Test sophia-edge-node | 测试报告 | **跳过** - 非代码 |
| 2312 | 150 RTC | Rent-a-Relic Market | 代码 | **可做** - 但需要Rust/区块链知识 |
| 2311 | 75 RTC | Fossil Record Visualizer | D3.js/可视化 | **可做** - 但数据源(RustChain DB)不可用 |

**结论**: rustchain-bounties 主要是游戏成就/挖矿活动 bounty，无真实代码PR机会。

### AncientBeast/AncientBeast

**结果**: 404 Not Found - 仓库不存在或无bounty标签issues

---

## 总结

本轮扫描结果：**无可提交的代码类 bounty**

原因：
1. homelab-stack 所有 bounty 需要真实 Docker/硬件环境，无法远程验证
2. rustchain-bounties 是游戏/挖矿活动 bounty，不是代码贡献
3. AncientBeast 仓库不存在

下次扫描时间：30分钟后
