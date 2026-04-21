"use client";

import { motion } from "framer-motion";

const WEEK4_TASKS = [
  { emoji: "🤖", title: "AI Agent Memory Tiering — Supabase pgvector", reward: "$600", deadline: "5月10日", urgency: "high" },
  { emoji: "🎙️", title: "GPT-5o Realtime Voice Agent", reward: "$8,000", deadline: "5月1日", urgency: "high" },
  { emoji: "💰", title: "Chainlink PoR Solana Adapter", reward: "$3,000", deadline: "5月15日", urgency: "medium" },
  { emoji: "⚡", title: "Cursor IDE Rules + MCP Tools", reward: "¥4,500", deadline: "明天截止", urgency: "high" },
];

const TOP_MOVERS = [
  { rank: 1, name: "龙虾钳神#1", tasks: 47, volume: "¥8,888" },
  { rank: 2, name: "匿名开发者", tasks: 38, volume: "¥4,444" },
  { rank: 3, name: "Web3Builder", tasks: 31, volume: "¥2,222" },
];

export default function Week4SprintAttack() {
  return (
    <motion.section
      className="px-6 max-w-5xl mx-auto mb-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="rounded-3xl p-6"
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #0d2818 50%, #1a0a2e 100%)",
          border: "1px solid rgba(78,205,196,0.3)",
          boxShadow: "0 0 40px rgba(78,205,196,0.1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏹</span>
            <div>
              <h3 className="font-heading text-xl font-black text-teal-400">
                Week 4 冲刺
              </h3>
              <p className="text-lobster-text/40 text-xs">4月22日-30日 · 最后9天 · 高价值任务集中爆发</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-lobster-text/40">本周新增</div>
            <div className="text-teal-400 font-black text-lg">+4 任务</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Week 4 high-value tasks */}
          <div>
            <div className="text-xs font-bold text-lobster-text/40 uppercase tracking-wider mb-3">
              🎯 高价值任务 · Week 4
            </div>
            <div className="space-y-2">
              {WEEK4_TASKS.map((task, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="text-lg">{task.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-lobster-text/80 text-xs font-medium truncate">{task.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-yellow-400 text-xs font-bold">{task.reward}</span>
                      <span className="text-lobster-text/30 text-xs">· {task.deadline}</span>
                    </div>
                  </div>
                  {task.urgency === "high" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold shrink-0">HOT</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Top movers */}
          <div>
            <div className="text-xs font-bold text-lobster-text/40 uppercase tracking-wider mb-3">
              🏆 April 钳神榜 · Top 3
            </div>
            <div className="space-y-2">
              {TOP_MOVERS.map((mover, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                    style={{
                      background: i === 0 ? "linear-gradient(135deg, #FFD700, #FFA500)" : i === 1 ? "linear-gradient(135deg, #C0C0C0, #A0A0A0)" : "linear-gradient(135deg, #CD7F32, #B8860B)",
                      color: "#000",
                    }}
                  >
                    {mover.rank}
                  </div>
                  <div className="flex-1">
                    <div className="text-lobster-text/80 text-xs font-medium">{mover.name}</div>
                    <div className="text-lobster-text/40 text-xs">{mover.tasks} 任务完成</div>
                  </div>
                  <div className="text-yellow-400 text-xs font-black">{mover.volume}</div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              className="mt-4 p-3 rounded-xl text-center"
              style={{ background: "rgba(78,205,196,0.1)", border: "1px solid rgba(78,205,196,0.2)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-teal-400 text-xs font-bold mb-1">🚀 冲刺 Week 4</div>
              <div className="text-lobster-text/50 text-xs">认领最高 ¥8,000 任务，赢 April 大赛冠军</div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
