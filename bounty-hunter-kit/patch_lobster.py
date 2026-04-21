with open(r"C:\Users\Administrator\.openclaw\workspace\lobster-platform\app\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Find TodayJobs start
marker = 'function TodayJobs() {'
idx = content.index(marker)
print(f"Found TodayJobs at index: {idx}")

# Define the new BountyRadar component
bounty_radar = '''// ─── Bounty Radar ───────────────────────────────────────────────────────────
function BountyRadar() {
  const [keyword, setKeyword] = useState("");
  const [skillFilter, setSkillFilter] = useState("All");

  const bounties = [
    { repo: "claude-builders-bounty", title: "🤖 AGENT: PR Reviewer with Structured Markdown Output", reward: "$150", skills: ["TypeScript", "Claude Code", "AI Agent", "PR Review"], difficulty: "Medium", url: "https://github.com/claude-builders-bounty/claude-builders-bounty/issues/600", color: "#FF6B35" },
    { repo: "claude-builders-bounty", title: "🔒 Pre-Tool-Use Hook: Block Destructive Bash Commands", reward: "$100", skills: ["TypeScript", "Claude Code", "Security", "Hook"], difficulty: "Medium", url: "https://github.com/claude-builders-bounty/claude-builders-bounty/issues/597", color: "#4ECDC4" },
    { repo: "claude-builders-bounty", title: "📝 TEMPLATE: CLAUDE.md for Next.js + SQLite SaaS", reward: "$75", skills: ["Next.js", "SQLite", "SaaS", "Template"], difficulty: "Easy", url: "https://github.com/claude-builders-bounty/claude-builders-bounty/issues/599", color: "#6B7280" },
    { repo: "claude-builders-bounty", title: "⚡ SKILL: Structured PR Reviewer Agent", reward: "Bounty", skills: ["Claude Code", "Skill", "PR Review", "Agent"], difficulty: "Medium", url: "https://github.com/claude-builders-bounty/claude-builders-bounty/issues/593", color: "#FFD93D" },
    { repo: "tari-project/tari", title: "💾 JMT Data Optimization · Wallet Spooling (#7738)", reward: "E-bounty", skills: ["Rust", "Blockchain", "Wallet", "Optimization"], difficulty: "Medium", url: "https://github.com/tari-project/tari/issues/7738", color: "#4ECDC4" },
    { repo: "tari-project/tari", title: "🔐 Offline Signing Cucumber Test · Merge Mining (#7736)", reward: "E-bounty", skills: ["Rust", "Cucumber", "Testing", "Security"], difficulty: "Medium", url: "https://github.com/tari-project/tari/issues/7736", color: "#4ECDC4" },
    { repo: "Scottcjn/rustchain-bounties", title: "⛓️ AgentFolio ↔ Beacon Integration Spec", reward: "100 RTC", skills: ["Rust", "Blockchain", "DePIN", "Agent"], difficulty: "Medium", url: "https://github.com/Scottcjn/rustchain-bounties/issues/2890", color: "#dea584" },
    { repo: "poidh-app", title: "📸 Albums Bug Fix · Display History Issue", reward: "Bounty", skills: ["Go", "Bug Fix", "UI", "Web3"], difficulty: "Easy", url: "https://github.com/picsoritdidnthappen/poidh-app/issues/1296", color: "#6B7280" },
    { repo: "algora-io/algora", title: "📡 Real-Time Bounty Activity Signals via WebSocket (#224)", reward: "EVM+SOL", skills: ["TypeScript", "WebSocket", "SSE", "Bounty Platform"], difficulty: "Medium", url: "https://github.com/algora-io/algora/issues/224", color: "#a855f7" },
    { repo: "moff-station14", title: "🥔 Potato Bounty · C# Game Dev", reward: "Bounty", skills: ["C#", "Game Dev", "Unity", "Bug Fix"], difficulty: "Easy", url: "https://github.com/moff-station14/moff-station14/issues", color: "#6B7280" },
    { repo: "openai/codex-plugin-cc", title: "🪲 codex app-server NULL SCDynamicStore Panic Fix", reward: "Bounty", skills: ["TypeScript", "macOS", "Bug Fix", "Sandbox"], difficulty: "Medium", url: "https://github.com/openai/codex-plugin-cc/issues", color: "#FFD93D" },
    { repo: "daydreamsai/agent-bounties", title: "🧠 GasRoute Oracle Bounty #4 · DeFi Integration", reward: "$500", skills: ["Python", "DeFi", "Blockchain", "Agent"], difficulty: "Medium", url: "https://github.com/daydreamsai/agent-bounties/issues", color: "#FF6B35" },
    { repo: "SatGate/satgate-bounties", title: "⚡ L402 Lightning Bridge PoC Development", reward: "$300", skills: ["Lightning", "L402", "Bitcoin", "PoC"], difficulty: "Hard", url: "https://github.com/SatGate/satgate-bounties/issues", color: "#FF6B35" },
    { repo: "layeredge/layeredge-bounties", title: "🌐 ZK Prover Integration · LayerEdge Bounty", reward: "Bounty", skills: ["Rust", "ZK", "Blockchain", "Prover"], difficulty: "Hard", url: "https://github.com/layeredge/layeredge-bounties/issues", color: "#FF6B35" },
  ];

  const allSkills = ["All", ...Array.from(new Set(bounties.flatMap(b => b.skills)))].sort((a, b) => a === "All" ? -1 : 0);

  const filtered = bounties.filter(b => {
    const matchKw = keyword === "" || b.title.toLowerCase().includes(keyword.toLowerCase()) || b.skills.some(s => s.toLowerCase().includes(keyword.toLowerCase()));
    const matchSkill = skillFilter === "All" || b.skills.includes(skillFilter);
    return matchKw && matchSkill;
  });

  const diffColors: Record<string, string> = { Easy: "#4ECDC4", Medium: "#FFD93D", Hard: "#FF6B35" };

  return (
    <AnimatedSection className="py-20 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-lobster-secondary/10 border border-lobster-secondary/30 rounded-full px-4 py-1.5 text-xs text-lobster-secondary font-bold mb-4">
          🛸 AI 驱动
        </div>
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-3 text-lobster-text">
          🔭 <span className="text-lobster-secondary">Bounty</span> 雷达
        </h2>
        <p className="text-lobster-text/50 text-base max-w-lg mx-auto">
          输入你的技术栈关键词，AI 帮你找到最匹配的 Bounty 机会
        </p>
      </div>

      <div className="glass-card rounded-2xl p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lobster-text/30">🔍</span>
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="输入技术栈关键词，如：rust, typescript, ai agent..."
              className="w-full bg-lobster-deep/60 border border-lobster-deep/50 rounded-xl pl-10 pr-4 py-3 text-lobster-text text-sm placeholder:text-lobster-text/20 focus:outline-none focus:border-lobster-accent transition-colors"
            />
          </div>
          <select
            value={skillFilter}
            onChange={e => setSkillFilter(e.target.value)}
            className="bg-lobster-deep/60 border border-lobster-deep/50 rounded-xl px-4 py-3 text-lobster-text text-sm focus:outline-none focus:border-lobster-accent transition-colors cursor-pointer"
          >
            {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {["Rust", "TypeScript", "AI Agent", "Blockchain", "Security", "Bug Fix"].map(tag => (
            <button
              key={tag}
              onClick={() => setKeyword(tag)}
              className="text-xs px-3 py-1 rounded-full border border-lobster-deep/40 text-lobster-text/50 hover:border-lobster-accent hover:text-lobster-accent transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-lobster-text/40">找到</span>
        <span className="text-xs font-bold text-lobster-accent">{filtered.length}</span>
        <span className="text-xs text-lobster-text/40">个匹配的 Bounty</span>
        {keyword && <span className="text-xs text-lobster-secondary ml-2">关键词: "{keyword}"</span>}
        {(keyword || skillFilter !== "All") && (
          <button onClick={() => { setKeyword(""); setSkillFilter("All"); }} className="text-xs text-lobster-text/30 hover:text-lobster-accent ml-auto">✕ 清除筛选</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">🦞</div>
          <p className="text-lobster-text/50 text-sm">没有找到匹配的 Bounty，试试其他关键词</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["rust", "typescript", "ai agent", "security", "python"].map(k => (
              <button key={k} onClick={() => setKeyword(k)} className="text-xs px-3 py-1 rounded-full bg-lobster-deep/40 text-lobster-text/50 hover:text-lobster-accent">搜索: {k}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((b, i) => (
            <motion.a
              key={i}
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-2xl p-5 block group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ borderColor: b.color + "33" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-mono text-lobster-secondary group-hover:text-lobster-accent transition-colors">{b.repo}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0" style={{ background: diffColors[b.difficulty] + "22", color: diffColors[b.difficulty] }}>{b.difficulty}</span>
              </div>
              <h3 className="font-bold text-lobster-text text-sm leading-snug mb-3 group-hover:text-lobster-accent transition-colors">{b.title}</h3>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {b.skills.slice(0, 4).map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-lobster-deep/60 text-lobster-text/60">{s}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-black text-base" style={{ color: b.color }}>{b.reward}</span>
                <span className="text-xs text-lobster-text/30 group-hover:text-lobster-accent">GitHub →</span>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </AnimatedSection>
  );
}

'''

# Insert before TodayJobs
new_content = content[:idx] + bounty_radar + content[idx:]
print(f"Inserted BountyRadar. Total length: {len(new_content)}")

with open(r"C:\Users\Administrator\.openclaw\workspace\lobster-platform\app\page.tsx", "w", encoding="utf-8") as f:
    f.write(new_content)
print("Written successfully")
