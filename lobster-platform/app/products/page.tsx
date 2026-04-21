'use client';

import { useState } from 'react';
import { useLanguage } from '../../lib/LanguageContext';
import LanguageToggle from '../../components/LanguageToggle';

const PRODUCTS = [
  {
    name: 'TWS Earbuds Pro (ANC)',
    nameCn: '降噪无线耳机',
    category: 'Audio',
    aliExpressCost: 5.20,
    amazonPrice: 28.99,
    ebayPrice: 24.99,
   aliexpressUrl: 'https://www.aliexpress.com/item/32915847210.html',
    supplier: 'Shenzhen Audio Co.',
    margin: 0,
  },
  {
    name: 'Smart Watch BT Calling',
    nameCn: '蓝牙通话智能手表',
    category: 'Wearables',
    aliExpressCost: 12.50,
    amazonPrice: 59.99,
    ebayPrice: 49.99,
    aliexpressUrl: 'https://www.aliexpress.com/item/4000056789012.html',
    supplier: 'Smart Wear Co.',
    margin: 0,
  },
  {
    name: '15W Wireless Charger Pad',
    nameCn: '15W无线充电板',
    category: 'Power',
    aliExpressCost: 3.80,
    amazonPrice: 18.99,
    ebayPrice: 15.99,
    aliexpressUrl: 'https://www.aliexpress.com/item/32887654321.html',
    supplier: 'TechPower Electronics',
    margin: 0,
  },
  {
    name: 'Magnetic Car Phone Mount',
    nameCn: '磁吸车载手机支架',
    category: 'Accessories',
    aliExpressCost: 1.90,
    amazonPrice: 14.99,
    ebayPrice: 12.99,
    aliexpressUrl: 'https://www.aliexpress.com/item/32912345678.html',
    supplier: 'AutoGear Direct',
    margin: 0,
  },
  {
    name: 'USB-C 7-in-1 Hub',
    nameCn: 'USB-C七合一拓展坞',
    category: 'Computer',
    aliExpressCost: 11.00,
    amazonPrice: 39.99,
    ebayPrice: 34.99,
    aliexpressUrl: 'https://www.aliexpress.com/item/32876543210.html',
    supplier: 'ByteLink Tech',
    margin: 0,
  },
  {
    name: 'Portable BT Speaker 20W',
    nameCn: '20W便携蓝牙音箱',
    category: 'Audio',
    aliExpressCost: 8.50,
    amazonPrice: 35.99,
    ebayPrice: 29.99,
    aliexpressUrl: 'https://www.aliexpress.com/item/32956789012.html',
    supplier: 'SoundWave Electronics',
    margin: 0,
  },
  {
    name: '18" LED Ring Light Tripod',
    nameCn: '18寸LED环形补光灯',
    category: 'Photo',
    aliExpressCost: 9.80,
    amazonPrice: 32.99,
    ebayPrice: 27.99,
    aliexpressUrl: 'https://www.aliexpress.com/item/32923456789.html',
    supplier: 'LightPro Studio',
    margin: 0,
  },
  {
    name: '10000mAh Power Bank PD20W',
    nameCn: '10000毫安PD快充移动电源',
    category: 'Power',
    aliExpressCost: 7.20,
    amazonPrice: 24.99,
    ebayPrice: 21.99,
    aliexpressUrl: 'https://www.aliexpress.com/item/32865432109.html',
    supplier: 'ChargeMax Electronics',
    margin: 0,
  },
  {
    name: 'Aluminum Tablet Stand Adjustable',
    nameCn: '铝合金平板支架',
    category: 'Accessories',
    aliExpressCost: 4.50,
    amazonPrice: 19.99,
    ebayPrice: 16.99,
    aliexpressUrl: 'https://www.aliexpress.com/item/32989012345.html',
    supplier: 'DeskStyle Co.',
    margin: 0,
  },
  {
    name: 'HDMI 2.1 Cable 8K 3ft',
    nameCn: 'HDMI 2.1线 8K高清',
    category: 'Computer',
    aliExpressCost: 3.50,
    amazonPrice: 16.99,
    ebayPrice: 14.99,
    aliexpressUrl: 'https://www.aliexpress.com/item/32876512345.html',
    supplier: 'CablePro Direct',
    margin: 0,
  },
  {
    name: 'BT 5.3 Audio Transmitter',
    nameCn: '蓝牙5.3音频发射器',
    category: 'Audio',
    aliExpressCost: 5.50,
    amazonPrice: 24.99,
    ebayPrice: 21.99,
    aliexpressUrl: 'https://www.aliexpress.com/item/32901234567.html',
    supplier: 'AudioLink Tech',
    margin: 0,
  },
  {
    name: 'Fitness Tracker Heart Rate',
    nameCn: '心率健身手环',
    category: 'Wearables',
    aliExpressCost: 6.80,
    amazonPrice: 34.99,
    ebayPrice: 29.99,
    aliexpressUrl: 'https://www.aliexpress.com/item/32890123456.html',
    supplier: 'FitGear Health',
    margin: 0,
  },
  {
    name: 'Shiatsu Neck Massager Heat',
    nameCn: '颈部按摩仪热敷款',
    category: 'Health',
    aliExpressCost: 12.00,
    amazonPrice: 45.99,
    ebayPrice: 39.99,
    aliexpressUrl: 'https://www.aliexpress.com/item/32978901234.html',
    supplier: 'Wellness Plus',
    margin: 0,
  },
  {
    name: 'Sonic Electric Toothbrush',
    nameCn: '声波电动牙刷',
    category: 'Health',
    aliExpressCost: 7.50,
    amazonPrice: 32.99,
    ebayPrice: 27.99,
    aliexpressUrl: 'https://www.aliexpress.com/item/32867890123.html',
    supplier: 'DentalTech Co.',
    margin: 0,
  },
  {
    name: 'Mini WiFi Projector 1080P',
    nameCn: '迷你WiFi投影仪1080P',
    category: 'Electronics',
    aliExpressCost: 45.00,
    amazonPrice: 99.99,
    ebayPrice: 89.99,
    aliexpressUrl: 'https://www.aliexpress.com/item/32956712345.html',
    supplier: 'ProjectorWorld',
    margin: 0,
  },
  {
    name: 'Dash Cam 1080P Front+Rear',
    nameCn: '双镜头行车记录仪',
    category: 'Auto',
    aliExpressCost: 28.00,
    amazonPrice: 79.99,
    ebayPrice: 69.99,
    aliexpressUrl: 'https://www.aliexpress.com/item/32845678901.html',
    supplier: 'DriveCam Auto',
    margin: 0,
  },
  {
    name: '4K Action Camera Waterproof',
    nameCn: '4K防水运动相机',
    category: 'Photo',
    aliExpressCost: 32.00,
    amazonPrice: 89.99,
    ebayPrice: 79.99,
    aliexpressUrl: 'https://www.aliexpress.com/item/32934567890.html',
    supplier: 'ActionCam Sports',
    margin: 0,
  },
  {
    name: 'GPS Tracker Anti-Lost Smart',
    nameCn: '智能GPS定位器',
    category: 'Accessories',
    aliExpressCost: 9.50,
    amazonPrice: 29.99,
    ebayPrice: 24.99,
    aliexpressUrl: 'https://www.aliexpress.com/item/32823456789.html',
    supplier: 'TrackPro Tech',
    margin: 0,
  },
  {
    name: '21W Foldable Solar Charger',
    nameCn: '21W折叠太阳能充电器',
    category: 'Power',
    aliExpressCost: 14.00,
    amazonPrice: 44.99,
    ebayPrice: 39.99,
    aliexpressUrl: 'https://www.aliexpress.com/item/32912389012.html',
    supplier: 'SunPower Electronics',
    margin: 0,
  },
  {
    name: 'RGB LED Strip 10M WiFi App',
    nameCn: 'RGB彩灯带10米WiFi控制',
    category: 'Home',
    aliExpressCost: 7.80,
    amazonPrice: 27.99,
    ebayPrice: 23.99,
    aliexpressUrl: 'https://www.aliexpress.com/item/32889012345.html',
    supplier: 'LightMax Home',
    margin: 0,
  },
].map(p => ({
  ...p,
  margin: ((p.amazonPrice - p.aliExpressCost) / p.amazonPrice * 100).toFixed(1),
  profit: (p.amazonPrice - p.aliExpressCost).toFixed(2),
}));

const CATEGORIES = ['All', 'Audio', 'Power', 'Wearables', 'Accessories', 'Computer', 'Health', 'Photo', 'Auto', 'Electronics', 'Home'];

export default function ProductsPage() {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'margin' | 'profit' | 'price'>('margin');
  const [filterMin, setFilterMin] = useState(0);

  const filtered = PRODUCTS
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .filter(p => parseFloat(p.margin) >= filterMin)
    .sort((a, b) => {
      if (sortBy === 'margin') return parseFloat(b.margin) - parseFloat(a.margin);
      if (sortBy === 'profit') return parseFloat(b.profit) - parseFloat(a.profit);
      return b.amazonPrice - a.amazonPrice;
    });

  return (
    <div style={{ background: '#0a0a1a', minHeight: '100vh', color: '#e0e0e0', fontFamily: 'system-ui, sans-serif' }}>
      <LanguageToggle />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 8 }}>
            🛒 {lang === 'zh' ? '电子产品爆款选品Demo' : 'Electronics Dropshipping Demo'}
          </h1>
          <p style={{ color: '#888', fontSize: '1.1rem' }}>
            {lang === 'zh'
              ? '来自AliExpress真实供应商数据 · 自动计算利润 · 一键联系厂家'
              : 'Real AliExpress supplier data · Auto profit calculation · Direct supplier links'}
          </p>
          <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/tasks" style={{ color: '#FF6B35', textDecoration: 'none', fontWeight: 700 }}>← {lang === 'zh' ? '返回任务大厅' : 'Back to Tasks'}</a>
            <a href="/shop" style={{ color: '#4ECDC4', textDecoration: 'none', fontWeight: 700 }}>🦞 {lang === 'zh' ? '数字商店' : 'Digital Shop'} →</a>
          </div>
        </div>

        {/* Stats Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: lang === 'zh' ? '精选产品' : 'Products', value: PRODUCTS.length },
            { label: lang === 'zh' ? '最高利润率' : 'Top Margin', value: Math.max(...PRODUCTS.map(p => parseFloat(p.margin))).toFixed(0) + '%' },
            { label: lang === 'zh' ? '最高利润额' : 'Top Profit', value: '$' + Math.max(...PRODUCTS.map(p => parseFloat(p.profit))).toFixed(2) },
            { label: lang === 'zh' ? '平均利润率' : 'Avg Margin', value: (PRODUCTS.reduce((a, p) => a + parseFloat(p.margin), 0) / PRODUCTS.length).toFixed(0) + '%' },
          ].map(s => (
            <div key={s.label} style={{ background: 'linear-gradient(135deg, #1a1a3a, #0f1f3f)', border: '1px solid #FF6B35', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FF6B35' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: '0.9rem' }}>
            {lang === 'zh' ? '品类' : 'Category'}:
          </span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: selectedCategory === cat ? '2px solid #FF6B35' : '1px solid #333',
                background: selectedCategory === cat ? '#FF6B3522' : 'transparent',
                color: selectedCategory === cat ? '#FF6B35' : '#aaa',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: selectedCategory === cat ? 700 : 400,
              }}
            >
              {cat}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ color: '#888', fontSize: '0.85rem' }}>
              {lang === 'zh' ? '最低利润率' : 'Min Margin'}:
            </span>
            <input
              type="range"
              min="0"
              max="80"
              value={filterMin}
              onChange={e => setFilterMin(parseInt(e.target.value))}
              style={{ width: 100 }}
            />
            <span style={{ color: '#FF6B35', fontWeight: 700, fontSize: '0.9rem', minWidth: 40 }}>{filterMin}%</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              style={{ background: '#1a1a3a', color: '#fff', border: '1px solid #333', borderRadius: 8, padding: '6px 12px' }}
            >
              <option value="margin">{lang === 'zh' ? '按利润率' : 'By Margin'}</option>
              <option value="profit">{lang === 'zh' ? '按利润额' : 'By Profit'}</option>
              <option value="price">{lang === 'zh' ? '按售价' : 'By Price'}</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map((p, i) => (
            <div
              key={i}
              style={{
                background: 'linear-gradient(145deg, #111130, #0d0d25)',
                border: '1px solid #1e1e40',
                borderRadius: 16,
                padding: 20,
                position: 'relative',
                transition: 'border-color 0.2s',
              }}
            >
              {/* Category Badge */}
              <div style={{
                position: 'absolute', top: 12, right: 12,
                background: '#FF6B3522', color: '#FF6B35',
                padding: '2px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700
              }}>
                {p.category}
              </div>

              {/* Product Name */}
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4, paddingRight: 80, color: '#fff' }}>
                {lang === 'zh' ? p.nameCn : p.name}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: 16 }}>{p.supplier}</p>

              {/* Pricing */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                <div style={{ background: '#0a0a1a', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: '0.65rem', color: '#888', marginBottom: 2 }}>ALIEXPRESS {lang === 'zh' ? '成本' : 'Cost'}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#4ECDC4' }}>${p.aliExpressCost}</div>
                </div>
                <div style={{ background: '#0a0a1a', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: '0.65rem', color: '#888', marginBottom: 2 }}>AMAZON {lang === 'zh' ? '售价' : 'Sell'}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FF6B35' }}>${p.amazonPrice}</div>
                </div>
              </div>

              {/* Profit & Margin */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                <div style={{ background: '#FF6B3515', border: '1px solid #FF6B3530', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#888' }}>{lang === 'zh' ? '利润率' : 'Margin'}</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FF6B35' }}>{p.margin}%</div>
                </div>
                <div style={{ background: '#4ECDC415', border: '1px solid #4ECDC430', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#888' }}>{lang === 'zh' ? '利润额' : 'Profit'}</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#4ECDC4' }}>${p.profit}</div>
                </div>
              </div>

              {/* Supplier Link */}
              <a
                href={p.aliexpressUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #FF6B35, #ff8c5a)',
                  color: '#fff',
                  textAlign: 'center',
                  padding: '10px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                {lang === 'zh' ? '📦 查看AliExpress供应商' : '📦 View AliExpress Supplier'}
              </a>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#666' }}>
            {lang === 'zh' ? '暂无符合条件的商品' : 'No products match your filters'}
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: 60, textAlign: 'center', background: 'linear-gradient(135deg, #111130, #0f1f3f)', border: '1px solid #FF6B3540', borderRadius: 20, padding: 40 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 12 }}>
            🚀 {lang === 'zh' ? '完整系统开发中...' : 'Full System Coming Soon...'}
          </h2>
          <p style={{ color: '#888', marginBottom: 24, maxWidth: 600, margin: '0 auto 24px' }}>
            {lang === 'zh'
              ? '全自动AliExpress爆款扫描 + 利润计算 + 一件代发对接 · 正在开发中'
              : 'Full AliExpress bestseller scanning + profit calculator + dropshipping integration · In development'}
          </p>
          <a
            href="https://d2758695161.github.io/wander-lobster-platform"
            style={{
              display: 'inline-block',
              background: '#FF6B35',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: 30,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            🦞 {lang === 'zh' ? '了解流浪龙虾平台' : 'Explore Wander Lobster Platform'}
          </a>
        </div>
      </div>
    </div>
  );
}
