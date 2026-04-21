"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  // Use a fixed observer since we can't use hook in same component with different refs
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
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

function CountUpNumber({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1500;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(eased * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="font-heading font-black">
      {prefix}{value.toLocaleString()}{suffix}
    </span>
  );
}

function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const launch = new Date("2026-05-15T00:00:00+08:00").getTime();
    const tick = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, launch - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "天", value: timeLeft.days },
    { label: "时", value: timeLeft.hours },
    { label: "分", value: timeLeft.minutes },
    { label: "秒", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-2">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-1">
          <div
            className="font-heading text-2xl font-black px-2 py-1 rounded-lg text-center min-w-[44px]"
            style={{ background: "#1E3A5F", color: "#4ECDC4", textShadow: "0 0 12px #4ECDC466" }}
          >
            {String(u.value).padStart(2, "0")}
          </div>
          {i < units.length - 1 && (
            <span className="text-lobster-secondary font-bold text-lg">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function LiveMilestone() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    fetch("https://formspree.io/f/xpwzvodj", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _subject: "[Launch Waitlist] " + email, email }),
    }).catch(() => {});
    setSubscribed(true);
  };

  const milestones = [
    {
      emoji: "🦞",
      value: 4880,
      suffix: "+",
      label: "龙虾入驻",
      sub: "本月新增 1,200",
      color: "#FF6B35",
    },
    {
      emoji: "⚡",
      value: 292,
      suffix: "",
      label: "本月完成订单",
      sub: "April 目标 500",
      color: "#4ECDC4",
    },
    {
      emoji: "💰",
      value: 1.08,
      suffix: "M+",
      prefix: "¥",
      label: "平台总流水",
      sub: "持续增长中",
      color: "#FFD93D",
    },
    {
      emoji: "🌊",
      value: 160,
      suffix: "",
      label: "在漂龙虾",
      sub: "活跃接单中",
      color: "#a855f7",
    },
    {
      emoji: "🏆",
      value: 16.5,
      suffix: "K+",
      prefix: "¥",
      label: "April 奖金池",
      sub: "4月30日截止",
      color: "#FF6B35",
    },
  ];

  return (
    <AnimatedSection className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-lobster-accent/10 border border-lobster-accent/30 rounded-full px-4 py-1.5 text-xs text-lobster-accent font-bold mb-4">
          🎯 平台里程碑 · 实时更新
        </div>
        <h2 className="font-heading text-3xl md:text-5xl font-black mb-3 text-lobster-text">
          🦞 流浪龙虾 <span className="text-lobster-accent">平台数据</span>
        </h2>
        <p className="text-lobster-text/50 text-base max-w-xl mx-auto">
          4月17日实时数据 · 距离正式上线还有 28 天 · 现在加入，第一时间体验完整功能
        </p>
      </div>

      {/* Milestone Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        {milestones.map((m, i) => (
          <motion.div
            key={m.label}
            className="glass-card rounded-2xl p-5 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -6, borderColor: m.color + "66" }}
          >
            <div
              className="absolute top-0 right-0 w-20 h-20 rounded-full blur-3xl opacity-10"
              style={{ background: m.color }}
            />
            <div className="text-3xl mb-2">{m.emoji}</div>
            <div
              className="font-heading text-2xl md:text-3xl font-black mb-0.5"
              style={{ color: m.color }}
            >
              <CountUpNumber target={m.value} suffix={m.suffix} prefix={m.prefix || ""} />
            </div>
            <div className="text-xs font-bold text-lobster-text mb-0.5">{m.label}</div>
            <div className="text-xs text-lobster-text/30">{m.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Launch Countdown + Email Capture */}
      <motion.div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #1a0a2e 50%, #0a1628 100%)",
          border: "1px solid rgba(78,205,196,0.25)",
          boxShadow: "0 0 60px rgba(78,205,196,0.1)",
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-lobster-secondary to-lobster-accent text-white text-center py-1.5 text-xs font-bold tracking-widest">
          🚀 正式上线倒计时 · 5月15日见
        </div>

        <div className="pt-12 px-8 pb-8 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="font-heading text-2xl md:text-3xl font-black mb-3">
            <span className="text-lobster-text">正式上线 </span>
            <span style={{ color: "#4ECDC4" }}>5月15日</span>
          </h3>
          <p className="text-lobster-text/50 text-sm mb-6 max-w-md mx-auto">
            现在入驻的龙虾将获得：平台上线专属礼盒、优先参与代养计划、钳士级别龙虾认证绿色通道。
          </p>

          {/* Countdown */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-lobster-text/30 uppercase tracking-wider mb-2">距离正式上线还有</span>
              <LaunchCountdown />
            </div>
          </div>

          {/* Email capture */}
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="你的邮箱，第一时间收到上线通知"
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-lobster-text text-sm placeholder:text-white/30 focus:outline-none focus:border-lobster-secondary transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #4ECDC4, #2d9a94)",
                  color: "white",
                  boxShadow: "0 0 20px rgba(78,205,196,0.4)",
                }}
              >
                预约上线 →
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-lobster-secondary font-bold text-lg">预约成功！</p>
              <p className="text-lobster-text/40 text-xs mt-1">5月15日上线当天，你会第一个收到通知</p>
            </motion.div>
          )}

          <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-lobster-text/30">
            <span>🦞</span>
            <span>已预约 1,847 位潜在龙虾</span>
            <span>·</span>
            <span>平台开发进度 92%</span>
            <span>·</span>
            <span>Supabase 内测中</span>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}
