'use client';

import { useState } from 'react';

const SERVICES = [
  { id: 'smart-contract', name: '智能合约开发', price: '¥3,000起', desc: 'Solidity智能合约 ERC-20/ERC-4626/DeFi协议', days: '3-7天交付' },
  { id: 'telegram-bot', name: 'Telegram Bot开发', price: '¥2,000起', desc: 'Python Bot + 支付集成 + 防封策略', days: '1-3天交付' },
  { id: 'github-automation', name: 'GitHub自动化', price: '¥500起', desc: 'Actions / CI流程 / PR脚本 / Bot开发', days: '1-2天交付' },
  { id: 'python-script', name: 'Python脚本', price: '¥1,000起', desc: '数据爬虫 / 自动化工具 / API集成', days: '1-3天交付' },
  { id: 'security-audit', name: '智能合约安全审计', price: '¥5,000起', desc: 'Reentrancy/重入 + 权限漏洞 + 闪电贷', days: '5-10天交付' },
  { id: 'web3-dapp', name: 'Web3 DApp开发', price: '¥8,000起', desc: '前端 + 合约 + 钱包集成 + 合约部署', days: '7-14天交付' },
];

const USDT_ADDR = 'TPAPC39xtYjVNj1CQnqftXzJfi7BqCRnaN';
const WECHAT = 'DriftLobster';

export default function ServicesPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const handleSubmit = () => {
    const text = encodeURIComponent(
      `🦀 服务咨询\n\n需求: ${selected || '未选择'}\n\n补充说明:\n${msg}`
    );
    window.open(`https://wa.me/8613510221939?text=${text}`, '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e0e0e0', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '60px 20px 40px', background: 'linear-gradient(180deg, #1a0a00 0%, #0a0a0f 100%)' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🦀</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#FF6B35', marginBottom: 8 }}>
          一筒技术服务
        </h1>
        <p style={{ color: '#888', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
          7×24小时接单 · 区块链开发专长 · USDT/微信收款
        </p>
        <div style={{ marginTop: 16, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ background: '#111', padding: '6px 16px', borderRadius: 20, fontSize: 13, border: '1px solid #333' }}>
            ⚡ 最快当天交付
          </span>
          <span style={{ background: '#111', padding: '6px 16px', borderRadius: 20, fontSize: 13, border: '1px solid #333' }}>
            🔒 满意后再付款
          </span>
          <span style={{ background: '#111', padding: '6px 16px', borderRadius: 20, fontSize: 13, border: '1px solid #333' }}>
            💎 源码交付
          </span>
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 24 }}>📋 服务项目</h2>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {SERVICES.map(s => (
            <div
              key={s.id}
              onClick={() => setSelected(s.id === selected ? null : s.id)}
              style={{
                background: selected === s.id ? 'linear-gradient(135deg, #FF6B35 15%, #1a1a2e 100%)' : '#111118',
                borderRadius: 16,
                padding: 24,
                border: selected === s.id ? '2px solid #FF6B35' : '1px solid #222',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', flex: 1 }}>{s.name}</h3>
                <span style={{ background: '#FF6B35', color: '#fff', fontWeight: 900, fontSize: 14, padding: '3px 10px', borderRadius: 16 }}>{s.price}</span>
              </div>
              <p style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>{s.desc}</p>
              <p style={{ color: '#4ECDC4', fontSize: 12 }}>⏱ {s.days}</p>
              {selected === s.id && <p style={{ color: '#FFD93D', fontSize: 12, marginTop: 8 }}>✅ 已选择此服务</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ background: '#111118', borderRadius: 20, padding: 32, border: '1px solid #FF6B3544' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20, textAlign: 'center' }}>
            📬 立刻咨询 / 下单
          </h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#888', fontSize: 13, display: 'block', marginBottom: 6 }}>你的需求:</label>
            <textarea
              value={msg}
              onChange={e => setMsg(e.target.value)}
              placeholder='描述你的项目需求...'
              rows={4}
              style={{ width: '100%', padding: '12px 16px', background: '#0d0d14', border: '1px solid #333', borderRadius: 10, color: '#fff', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ background: '#0d0d14', borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <p style={{ color: '#FFD93D', fontSize: 12, marginBottom: 8 }}>💰 收款方式:</p>
            <p style={{ color: '#4ECDC4', fontSize: 12, wordBreak: 'break-all', fontFamily: 'monospace', marginBottom: 4 }}>USDT (TRC20): {USDT_ADDR}</p>
            <p style={{ color: '#888', fontSize: 12 }}>微信: {WECHAT}</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selected && !msg.trim()}
            style={{
              width: '100%',
              padding: '14px',
              background: selected || msg.trim() ? '#FF6B35' : '#333',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              cursor: selected || msg.trim() ? 'pointer' : 'not-allowed',
              opacity: selected || msg.trim() ? 1 : 0.5
            }}
          >
            📱 加微信 DriftLobster 下单
          </button>

          <p style={{ color: '#555', fontSize: 11, textAlign: 'center', marginTop: 12 }}>
            也可直接转账到 USDT 地址，转账后联系 DriftLobster 确认
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: '#0d0d14', padding: '30px 20px', borderTop: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, textAlign: 'center' }}>
          {[['200+', '完成项目'], ['50+', '活跃客户'], ['7×24h', '接单时间'], ['99%', '好评率']].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#FF6B35' }}>{n}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '20px', color: '#333', fontSize: 12 }}>
        🦀 一筒技术服务 · 接单赚收入 · USDT/微信均可
      </div>
    </div>
  );
}
