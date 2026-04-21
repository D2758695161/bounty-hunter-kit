"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const stats = [
  { label: "龙虾总数", value: "4,401", icon: "🦞", color: "#FF6B35" },
  { label: "今日新增", value: "+28", icon: "📈", color: "#4ECDC4" },
  { label: "开放Bounty", value: "186", icon: "💰", color: "#FFE66D" },
  { label: "今日完成", value: "47", icon: "✅", color: "#95E881" },
  { label: "总发放赏金", value: "¥2.8M+", icon: "🏆", color: "#FF6B35" },
  { label: "平台可用率", value: "99.9%", icon: "⚡", color: "#4ECDC4" },
];

const recentActivity = [
  { text: "钳神·阿强 完成了 RAG Pipeline 优化", time: "11分钟前", type: "win" },
  { text: "新Bounty开放: AI Code Review GitHub App", time: "刚刚", type: "new" },
  { text: "钳士·王五 完成了 WebAgent 开发", time: "1小时前", type: "win" },
  { text: "kcolbchain/muzix: 3个新 bounty 开放", time: "刚刚", type: "new" },
  { text: "钳豪·老李 完成了 Llama 4 集成", time: "4小时前", type: "win" },
];

export default function PlatformLiveStats() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => (p + 1) % stats.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-sm text-lobster-accent mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lobster-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-lobster-accent" />
            </span>
            平台实时状态
          </div>
          <h2 className="text-3xl font-heading font-bold text-lobster-text mb-2">
            平台健康度
          </h2>
          <p className="text-lobster-text/50 text-sm">
            实时数据 · 每30秒自动刷新
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`glass-card rounded-2xl p-4 text-center transition-all duration-300 ${
                pulse === i ? "border-lobster-accent shadow-lg shadow-lobster-accent/20" : ""
              }`}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div
                className="text-xl font-bold mb-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-lobster-text/50">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="font-heading font-bold text-lobster-text mb-4 flex items-center gap-2">
            <span className="text-lobster-accent">🔥</span> 最新动态
          </h3>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 text-sm"
              >
                <span
                  className={`mt-0.5 text-xs px-2 py-0.5 rounded-full shrink-0 ${
                    item.type === "win"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-lobster-accent/20 text-lobster-accent"
                  }`}
                >
                  {item.type === "win" ? "✅到账" : "🆕新"}
                </span>
                <span className="text-lobster-text/70 flex-1">{item.text}</span>
                <span className="text-lobster-text/30 text-xs shrink-0">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
