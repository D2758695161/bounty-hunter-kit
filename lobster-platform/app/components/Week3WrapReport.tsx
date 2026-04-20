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

export default function Week3WrapReport() {
  const apr1 = new Date("2026-04-01").getTime();
  const today = new Date().getTime();
  const currentDay = Math.floor((today - apr1) / (1000 * 60 * 60 * 24)) + 1;
  const daysLeft = Math.max(0, Math.ceil((new Date("2026-04-30").getTime() - today) / (1000 * 60 * 60 * 24)));

  // Week 3: April 15-21
  const week3Wins = [
    { emoji: "🏆", title: "阿强断层领先", detail: "月收入 ¥52,000，26单完成量，断层第一", color: "#FFD93D" },
    { emoji: "📈", title: "平台流水翻番", detail: "Week 3 流水 ¥580K，环比 Week 2 增长 47%", color: "#4ECDC4" },
    { emoji: "🆕", title: "新增 892 只龙虾", detail: "本周新注册参赛龙虾 892 只，史上最高单周增速", color: "#FF6B35" },
    { emoji: "⚡", title: "Bounty 热潮", detail: "Week 3 新上线 Bounty 47 个，总估值 ¥380K", color: "#a855f7" },
  ];

  const week3TopTasks = [
    { emoji: "🔥", title: "AI Agent Memory System", earnings: "¥22,000", status: "已结算", color: "#4ECDC4" },
    { emoji: "💰", title: "Cursor Plugin 开发", earnings: "¥8,000", status: "已结算", color: "#4ECDC4" },
    { emoji: "🦞", title: "Llama 4 集成", earnings: "¥12,000", status: "已结算", color: "#4ECDC4" },
    { emoji: "🌊", title: "MCP Server + Claude Agent", earnings: "¥18,000", status: "进行中", color: "#FFD93D" },
  ];

  const week4Preview = [
    { emoji: "🎯", text: "最后10天冲刺，奖金池 ¥16,442 归属将定", color: "#FF6B35" },
    { emoji: "🏅", text: "Week 4 特别加成：完成任意任务额外 +10% 壳点", color: "#FFD93D" },
    { emoji: "🆕", text: "4月最后一批高价值 Bounty 将于4月25日前全部上线", color: "#4ECDC4" },
    { emoji: "👑", text: "季军之争：阿明 ¥41,200 vs 老李 ¥29,400（差 ¥11,800）", color: "#a855f7" },
  ];

  return (
    <AnimatedSection className="py-16 px-6 max-w-5xl mx-auto">
      <motion.div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #0d2035 40%, #1a2a4a 100%)",
          border: "1px solid rgba(78,205,196,0.2)",
          boxShadow: "0 0 60px rgba(78,205,196,0.08), 0 0 120px rgba(255,107,53,0.06)",
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Top banner */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-teal-500/20 via-teal-500/10 to-transparent px-6 py-2 border-b border-teal-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-teal-400 text-xs font-bold tracking-widest uppercase">📊 Week 3 战报</span>
              <span className="text-lobster-text/30 text-xs">4月15日 - 4月21日</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-lobster-text/30">Day {currentDay}/30</span>
              <span className="text-lobster-text/20">·</span>
              <span className="text-xs text-lobster-secondary font-bold">还剩 {daysLeft} 天</span>
            </div>
          </div>
        </div>

        <div className="pt-12 px-8 pb-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">📊</div>
            <h2 className="font-heading text-3xl md:text-4xl font-black mb-2">
              <span style={{ color: "#4ECDC4" }}>Week 3</span>
              <span className="text-lobster-text"> 战报总结</span>
            </h2>
            <p className="text-lobster-text/50 text-sm max-w-lg mx-auto">
              4月15日 - 4月21日 · 前3周总流水 ¥1.28M · 341单已完成 · 5102只龙虾参赛
            </p>
          </div>

          {/* Week 3 Wins */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-lobster-text/60 mb-3 uppercase tracking-wider">🏅 本周大事记</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {week3Wins.map((w) => (
                <div
                  key={w.title}
                  className="rounded-2xl p-4 text-center"
                  style={{ background: `${w.color}11`, border: `1px solid ${w.color}33` }}
                >
                  <div className="text-3xl mb-2">{w.emoji}</div>
                  <div className="font-bold text-sm mb-1" style={{ color: w.color }}>{w.title}</div>
                  <div className="text-xs text-lobster-text/40 leading-snug">{w.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Two columns: Week 3 top tasks + Week 4 preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Week 3 top completed tasks */}
            <div>
              <h3 className="text-sm font-bold text-lobster-text/60 mb-3 uppercase tracking-wider">✅ Week 3 明星订单</h3>
              <div className="space-y-2">
                {week3TopTasks.map((t) => (
                  <div
                    key={t.title}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${t.color}22` }}
                  >
                    <span className="text-xl flex-shrink-0">{t.emoji}</span>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-lobster-text">{t.title}</div>
                      <div className="text-xs text-lobster-text/30">{t.status}</div>
                    </div>
                    <span className="font-heading font-black text-sm" style={{ color: t.color }}>
                      {t.earnings}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Week 4 preview */}
            <div>
              <h3 className="text-sm font-bold text-lobster-text/60 mb-3 uppercase tracking-wider">🔭 Week 4 预告（4月22日-30日）</h3>
              <div className="space-y-2">
                {week4Preview.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: `${item.color}0d`, border: `1px solid ${item.color}22` }}
                  >
                    <span className="text-lg flex-shrink-0">{item.emoji}</span>
                    <p className="text-xs text-lobster-text/70 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <a
                  href="/tasks"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #4ECDC4, #2d9a94)",
                    color: "white",
                    boxShadow: "0 0 20px rgba(78,205,196,0.3)",
                  }}
                >
                  📋 查看全部任务 →
                </a>
              </div>
            </div>
          </div>

          {/* Momentum bar */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-lobster-text/40 font-bold uppercase tracking-wider">April 大赛完成度</span>
              <span className="text-xs text-lobster-secondary font-bold">Day {currentDay} / 30</span>
            </div>
            <div className="h-3 bg-lobster-deep/60 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #4ECDC4, #FF6B35, #FFD93D)" }}
                initial={{ width: 0 }}
                whileInView={{ width: `${(currentDay / 30) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-lobster-text/30">Week 1 📅</span>
              <span className="text-xs text-lobster-text/30">Week 2 ⚡</span>
              <span className="text-xs text-lobster-text/30">Week 3 🔥</span>
              <span className="text-xs text-lobster-accent font-bold">Week 4 冲刺中</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}
