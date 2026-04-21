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

export default function HalfwaySprint() {
  const today = new Date("2026-04-15").getTime();
  const apr1 = new Date("2026-04-01").getTime();
  const apr30 = new Date("2026-04-30").getTime();
  const dayNumber = Math.floor((today - apr1) / (1000 * 60 * 60 * 24)) + 1;
  const daysLeft = Math.ceil((apr30 - today) / (1000 * 60 * 60 * 24));

  const topMovers = [
    { rank: 1, name: "钳士·阿明", from: 5, to: 3, delta: "▲2", emoji: "🦀", color: "#FF6B35" },
    { rank: 2, name: "硬壳·阿杰", from: 9, to: 7, delta: "▲2", emoji: "🦐", color: "#4ECDC4" },
    { rank: 3, name: "钳士·阿丽", from: 8, to: 6, delta: "▲2", emoji: "🦀", color: "#FF6B35" },
    { rank: 4, name: "硬壳·大卫", from: 12, to: 10, delta: "▲2", emoji: "🦐", color: "#4ECDC4" },
    { rank: 5, name: "软壳·小陈", from: 15, to: 13, delta: "▲2", emoji: "🐚", color: "#6B7280" },
  ];

  const halfStats = [
    { emoji: "⚡", label: "半月完成订单", value: "97单", sub: "目标 150 单", color: "#4ECDC4" },
    { emoji: "💰", label: "半月平台流水", value: "¥398K", sub: "超预期 32%", color: "#FFD93D" },
    { emoji: "🦞", label: "参赛龙虾", value: "4621只", sub: "+847 新入驻", color: "#FF6B35" },
    { emoji: "🏆", label: "最高单笔", value: "¥48,800", sub: "钳神·阿强", color: "#a855f7" },
  ];

  return (
    <AnimatedSection className="py-20 px-6 max-w-5xl mx-auto">
      <motion.div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #1a0a2e 40%, #0a1628 100%)",
          border: "1px solid rgba(78,205,196,0.3)",
          boxShadow: "0 0 80px rgba(78,205,196,0.12), 0 0 160px rgba(255,107,53,0.08)",
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Top banner */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-lobster-secondary via-lobster-accent to-lobster-secondary text-white text-center py-2 text-xs font-bold tracking-widest">
          🏁 DAY {dayNumber} / 30 — 半月已过 · 最后 {daysLeft} 天全力冲刺 🏁
        </div>

        <div className="pt-12 px-8 pb-8">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-5xl mb-3">🏁</div>
            <h2 className="font-heading text-3xl md:text-4xl font-black mb-2">
              <span style={{ color: "#4ECDC4" }}>半月</span>
              <span className="text-lobster-text"> 已过！</span>
              <span style={{ color: "#FF6B35" }}> 最后 {daysLeft} 天</span>
              <span className="text-lobster-text"> 全力冲刺</span>
            </h2>
            <p className="text-lobster-text/50 text-sm max-w-lg mx-auto">
              前半月 ¥398K 流水 · 97单已完成 · 4621只龙虾参赛 · 最后 {daysLeft} 天决出最终排名
            </p>
          </div>

          {/* Half-stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {halfStats.map((s) => (
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
              <h3 className="text-sm font-bold text-lobster-text/60 mb-3 uppercase tracking-wider">🚀 半月跃升榜（排名上升最多）</h3>
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
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="font-heading text-2xl font-black mb-2 text-lobster-text">
                  <span style={{ color: "#FF6B35" }}>冲刺赛</span> 正式开始
                </h3>
                <p className="text-lobster-text/50 text-sm">
                  后半月竞争更激烈！钳士以上龙虾已经开始发力，{daysLeft}天后奖金池¥16,442 归属将尘埃落定。
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { icon: "🎯", text: "后半月目标：再完成 ¥8,000+ 收入即可冲入前10", color: "#FF6B35" },
                  { icon: "⚡", text: "最后3天将有神秘加成——每日任务双倍壳点", color: "#4ECDC4" },
                  { icon: "🏆", text: "季军争夺进入白热化：阿明¥38,100 vs 老李¥28,900", color: "#FFD93D" },
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
                  ⚡ 立即冲刺最后 {daysLeft} 天 →
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}
