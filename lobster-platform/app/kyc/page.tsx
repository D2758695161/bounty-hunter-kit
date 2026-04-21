'use client';

import { useState } from 'react';

export default function KYCBridgePage() {
  const [queryId, setQueryId] = useState('');
  const [queryResult, setQueryResult] = useState<{ id: string; level: string; name: string; status: string } | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('lv1');

  const levels = [
    {
      id: 'lv1',
      name: 'KYC Lv1',
      color: '#4ECDC4',
      badge: '🔵',
      requirement: 'GitHub OAuth',
      features: ['身份验证', 'AI Agent ID', '日限额 $100', '基础 API'],
      price: '免费',
    },
    {
      id: 'lv2',
      name: 'KYC Lv2',
      color: '#FF6B35',
      badge: '🟠',
      requirement: '身份证 + 手机验证',
      features: ['人脸识别', 'KYC Lv1 全部', '日限额 $5000', '商业 API', '信任徽章'],
      price: '$19/月',
    },
    {
      id: 'lv3',
      name: 'KYC Lv3',
      color: '#FFD93D',
      badge: '🟡',
      requirement: '护照 + 视频验证',
      features: ['视频认证', 'KYC Lv2 全部', '无限额', '企业 API', '高级信任徽章', '专属客服'],
      price: '$99/月',
    },
  ];

  const handleVerify = () => {
    if (!queryId.trim()) return;
    setVerifying(true);
    setTimeout(() => {
      // Mock verification
      if (queryId.includes('TEST')) {
        setQueryResult({ id: queryId, level: 'Lv2', name: 'verified-user', status: 'VALID' });
      } else {
        setQueryResult({ id: queryId, level: 'Lv1', name: 'github-user', status: 'VALID' });
      }
      setVerifying(false);
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e0e0e0', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '60px 20px 40px', background: 'linear-gradient(180deg, #0d0d1a 0%, #0a0a0f 100%)' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🆔</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, background: 'linear-gradient(135deg, #FF6B35, #FFD93D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 12 }}>
          AI KYC Bridge — 信用身份桥
        </h1>
        <p style={{ color: '#888', fontSize: 16, maxWidth: 550, margin: '0 auto' }}>
          人类做一次 KYC，AI 获得信用身份。<br />让外部 AI 系统信任你的 Agent。
        </p>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px 60px' }}>
        {/* Problem + Solution */}
        <div style={{ background: '#111118', borderRadius: 20, padding: 32, border: '1px solid #222', marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16 }}>🎯 解决什么问题</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <p style={{ color: '#ff4444', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>❌ AI Agent 的困境</p>
              <ul style={{ color: '#888', fontSize: 13, paddingLeft: 16, lineHeight: 2 }}>
                <li>AI 没有身份证，银行不认</li>
                <li>AI 的钱包地址没有信任背书</li>
                <li>对方不知道这个 AI 背后是谁</li>
                <li>AI 无法通过 KYC 认证</li>
              </ul>
            </div>
            <div>
              <p style={{ color: '#4ECDC4', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>✅ AITrust KYC Bridge</p>
              <ul style={{ color: '#888', fontSize: 13, paddingLeft: 16, lineHeight: 2 }}>
                <li>人类做 KYC，AI 获得映射身份</li>
                <li>每个 AI Agent 有唯一可验证 ID</li>
                <li>外部 API 查询：谁是这个 AI 背后的人类</li>
                <li>信用等级决定 AI 权限和限额</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Verification Demo */}
        <div style={{ background: '#111118', borderRadius: 20, padding: 32, border: '1px solid #222', marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>🔍 验证Demo</h2>
          <p style={{ color: '#666', fontSize: 13, marginBottom: 20 }}>输入任意 Agent ID，查询其 KYC 状态（测试用）</p>

          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <input
              type="text"
              placeholder="输入 Agent ID，如 AITrust_abc123"
              value={queryId}
              onChange={(e) => setQueryId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              style={{ flex: 1, padding: '12px 16px', background: '#0d0d14', border: '1px solid #333', borderRadius: 10, color: '#fff', fontSize: 14 }}
            />
            <button
              onClick={handleVerify}
              disabled={verifying}
              style={{ padding: '12px 24px', background: verifying ? '#333' : '#FF6B35', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: verifying ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
            >
              {verifying ? '验证中...' : '验证'}
            </button>
          </div>

          {queryResult && (
            <div style={{ background: '#0d0d14', borderRadius: 12, padding: 20, border: '1px solid #4ECDC444' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>{queryResult.status === 'VALID' ? '✅' : '❌'}</span>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{queryResult.id}</div>
                  <div style={{ color: '#888', fontSize: 13 }}>状态: {queryResult.status}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div style={{ textAlign: 'center', background: '#111118', borderRadius: 8, padding: 12 }}>
                  <div style={{ color: '#888', fontSize: 11, marginBottom: 4 }}>KYC 等级</div>
                  <div style={{ color: '#4ECDC4', fontWeight: 900, fontSize: 18 }}>{queryResult.level}</div>
                </div>
                <div style={{ textAlign: 'center', background: '#111118', borderRadius: 8, padding: 12 }}>
                  <div style={{ color: '#888', fontSize: 11, marginBottom: 4 }}>对应人类</div>
                  <div style={{ color: '#FF6B35', fontWeight: 700, fontSize: 14 }}>{queryResult.name}</div>
                </div>
                <div style={{ textAlign: 'center', background: '#111118', borderRadius: 8, padding: 12 }}>
                  <div style={{ color: '#888', fontSize: 11, marginBottom: 4 }}>信任分数</div>
                  <div style={{ color: '#FFD93D', fontWeight: 900, fontSize: 18 }}>92/100</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* KYC Levels */}
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 20 }}>📋 KYC 等级</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
          {levels.map((l) => (
            <div
              key={l.id}
              onClick={() => setSelectedLevel(l.id)}
              style={{
                background: selectedLevel === l.id ? '#1a1a2e' : '#111118',
                borderRadius: 16,
                padding: 24,
                border: selectedLevel === l.id ? `2px solid ${l.color}` : '1px solid #222',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: l.color, opacity: 0.08 }} />
              <div style={{ fontSize: 28, marginBottom: 8 }}>{l.badge}</div>
              <div style={{ fontWeight: 900, fontSize: 16, color: '#fff', marginBottom: 4 }}>{l.name}</div>
              <div style={{ color: l.color, fontWeight: 900, fontSize: 20, marginBottom: 8 }}>{l.price}</div>
              <div style={{ color: '#888', fontSize: 12, marginBottom: 12 }}>{l.requirement}</div>
              {l.features.map((f) => (
                <div key={f} style={{ color: '#666', fontSize: 12, marginBottom: 3 }}>✓ {f}</div>
              ))}
            </div>
          ))}
        </div>

        {/* Use Cases */}
        <div style={{ background: '#111118', borderRadius: 20, padding: 32, border: '1px solid #222', marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16 }}>💡 应用场景</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {[
              { title: 'DeFi 借贷', desc: 'AI Agent 抵押资产时，协议需要知道这个 AI 背后是否有可信人类，防止恶意清算', icon: '🏦' },
              { title: '预测市场', desc: '预测市场需要验证：押注的 AI Agent 是否真实，KYC 等级决定可信度权重', icon: '📊' },
              { title: '代码审计', desc: '审计结果需要背书：证明这个 AI 背后有真实开发者，通过 KYC Lv2 验证', icon: '🔍' },
              { title: 'AI Agent 协作', desc: '两个 AI Agent 合作时，需要验证对方背后是否有可信人类作为担保', icon: '🤝' },
            ].map((uc) => (
              <div key={uc.title} style={{ background: '#0d0d14', borderRadius: 12, padding: 16, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{uc.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 4 }}>{uc.title}</div>
                  <div style={{ color: '#888', fontSize: 13, lineHeight: 1.5 }}>{uc.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Example */}
        <div style={{ background: '#111118', borderRadius: 20, padding: 32, border: '1px solid #222' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 12 }}>🔌 验证 API</h2>
          <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>外部系统调用 AITrust API，验证任意 Agent ID 的 KYC 状态</p>
          <div style={{ background: '#0d0d14', borderRadius: 10, padding: 16 }}>
            <div style={{ color: '#888', fontSize: 12, marginBottom: 8, fontFamily: 'monospace' }}>GET /api/v1/verify?agent_id=AITrust_abc123</div>
            <div style={{ background: '#111118', borderRadius: 8, padding: 12, fontFamily: 'monospace', fontSize: 12, color: '#4ECDC4' }}>
              {`{
  "agent_id": "AITrust_abc123",
  "kyc_level": "Lv2",
  "human_name": "verified-user",
  "trust_score": 92,
  "verified_at": "2026-04-17T10:30:00Z",
  "status": "VALID"
}`}
            </div>
            <div style={{ color: '#555', fontSize: 11, marginTop: 8, fontFamily: 'monospace' }}>
              查询费用: 0.01 USDT / 次
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <a
            href="/aiwallet"
            style={{ display: 'inline-block', padding: '14px 40px', background: 'linear-gradient(135deg, #FF6B35, #FFD93D)', color: '#0a0a0f', borderRadius: 14, fontWeight: 900, textDecoration: 'none' }}
          >
            开始 KYC 认证 →
          </a>
        </div>
      </div>
    </div>
  );
}
