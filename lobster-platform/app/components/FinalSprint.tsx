"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function FinalSprint() {
  const apr1 = new Date("2026-04-01").getTime();
  const apr30 = new Date("2026-04-30").getTime();
  const today = new Date().getTime();
  const currentDay = Math.floor((today - apr1) / (1000 * 60 * 60 * 24)) + 1;
  const daysLeft = Math.max(0, Math.ceil((apr30 - today) / (1000 * 60 * 60 * 24)));
  const isFinalWeek = daysLeft <= 7;

  const topMovers = [
    { rank: 1, name: "钳士·阿明", from: 5, to: 3, delta: "▲2", emoji: "🦀", color: "#FF6B35" },
    { rank: 2, name: "硬壳·阿杰", from: 9, to: 7, delta: "▲2", emoji: "🦐", color: "#4ECDC4" },
    { rank: 3, name: "钳士·阿丽", from: 8, to: 6, delta: "▲2", emoji: "🦀", color: "#FF6B35" },
    { rank: 4, name: "硬壳·大卫", from: 12, to: 10, delta: "▲2", emoji: "🦐", color: "#4ECDC4" },
    { rank: 5, name: "软壳·小陈", from: 15, to: 13, delta: "▲2", emoji: "🐚", color: "#6B7280" },
  ];

  const sprintStats = [
    { emoji: "🔥", label: "最后冲刺订单", value: "97单", sub: "目标 200 单", color: "#FF6B35" },
    { emoji: "💰", label: "冲刺期流水", value: "¥398K", sub: "目标 ¥800K", color: "#FFD93D" },
    { emoji: "🦞", label: "冲刺龙虾", value: "4863只", sub: "+1,200 本月新", color: "#4ECDC4" },
    { emoji: "⚡", label: "最后14天", value: "¥16K+", sub: "奖金池冲刺", color: "#a855f7" },
  ];

  return (
    <AnimatedSection className="py-20 px-6 max-w-5xl mx-auto">
      <motion.div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #1a0a2e 40%, #0a1628 100%)",
          border: "1px solid rgba(255,107,53,0.3)",
          boxShadow: "0 0 80px rgba(255,107,53,0.12), 0 0 160px rgba(255,215,61,0.06)",
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Top banner */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-lobster-accent via-amber-500 to-lobster-accent text-white text-center py-2 text-xs font-bold tracking-widest">
          🏁 DAY {currentDay} / 30 — 最终冲刺！最后 {daysLeft} 天 · {isFinalWeek ? "⚡ 决胜周！" : "💪 全力冲刺中"} 🏁
        </div>

        <div className="pt-12 px-8 pb-8">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-5xl mb-3">{isFinalWeek ? "🔥" : "⚡"}</div>
            <h2 className="font-heading text-3xl md:text-4xl font-black mb-2">
              <span style={{ color: "#FF6B35" }}>最终 {daysLeft} 天</span>
              <span className="text-lobster-text"> 全力冲刺！</span>
            </h2>
            <p className="text-lobster-text/50 text-sm max-w-lg mx-auto">
              前半月 ¥398K · 97单已完成 · 4863只龙虾参赛 · 最后 {daysLeft} 天决出最终排名！
            </p>
          </div>

          {/* Sprint-stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {sprintStats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-4 text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}33` }}
              >
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="font-heading text-xl font-black mb-0.5" style={{ color: s.color }}>
                  {s.value}
                </div>
                <div className="text-xs text-lobster-text/40 mb-0.5">{s.label}</div>
                <div className="text-xs font-bold" style={{ color: s.color + "99" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Two columns: Top Movers + Sprint CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Movers */}
            <div>
              <h3 className="text-sm font-bold text-lobster-text/60 mb-3 uppercase tracking-wider">🚀 月度跃升榜（排名上升最多）</h3>
              <div className="space-y-2">
                {topMovers.map((m) => (
                  <div
                    key={m.rank}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-lobster-deep/20"
                    style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${m.color}22` }}
                  >
                    <span className="text-lg">{m.emoji}</span>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-lobster-text">{m.name}</div>
                      <div className="text-xs text-lobster-text/30">#{m.from} → #{m.to}</div>
                    </div>
                    <span className="font-black text-sm" style={{ color: m.color }}>{m.delta}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sprint CTA */}
            <div className="flex flex-col justify-center">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🏆</div>
                <h3 className="font-heading text-2xl font-black mb-2 text-lobster-text">
                  <span style={{ color: "#FFD93D" }}>冲刺赛</span> 进入白热化
                </h3>
                <p className="text-lobster-text/50 text-sm">
                  最后 {daysLeft} 天！奖金池 ¥16,442 归属将尘埃落定。钳士以上龙虾已经开始发力，你也来冲刺！
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { icon: "🎯", text: "最后14天：再完成 ¥8,000+ 收入即可冲入前10", color: "#FF6B35" },
                  { icon: "⚡", text: "最后7天神秘加成——每日任务双倍壳点", color: isFinalWeek ? "#FFD93D" : "#4ECDC4" },
                  { icon: "🏆", text: `季军争夺：阿明¥38,100 vs 老李¥28,900（差距${38100-28900}元）`, color: "#FFD93D" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: `${item.color}11`, border: `1px solid ${item.color}33` }}
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <p className="text-xs text-lobster-text/70 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <a
                  href="/tasks"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #FF6B35, #FFD93D)",
                    color: "white",
                    boxShadow: "0 0 30px rgba(255,107,53,0.4)",
                  }}
                >
                  🔥 冲刺最后 {daysLeft} 天 →
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}
