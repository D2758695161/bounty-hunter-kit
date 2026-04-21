'use client';

import { useState } from 'react';
import { useLanguage } from '../../lib/LanguageContext';
import LanguageToggle from '../../components/LanguageToggle';

const BUNDLES = [
  {
    id: 'python-master',
    title: 'Python Master Bundle',
    titleCn: 'Python 编程全集',
    topics: ['Python', 'Django', 'Flask', 'Data Science', 'ML', 'APIs'],
    price: 29.99,
    originalPrice: 199.99,
    books: 12,
    color: '#306998',
    badge: '🔥 畅销',
  },
  {
    id: 'javascript-full',
    title: 'JavaScript & Web Dev Bundle',
    titleCn: 'JavaScript 全栈合集',
    topics: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Vue', 'MongoDB'],
    price: 24.99,
    originalPrice: 179.99,
    books: 9,
    color: '#F7DF1E',
    badge: '⚡ 全栈',
  },
  {
    id: 'devops-pro',
    title: 'DevOps & Cloud Pro Bundle',
    titleCn: 'DevOps 云工程师全集',
    topics: ['Docker', 'Kubernetes', 'Linux', 'AWS', 'Terraform', 'CI/CD'],
    price: 34.99,
    originalPrice: 249.99,
    books: 8,
    color: '#2496ED',
    badge: '💎 高价值',
  },
  {
    id: 'security-essentials',
    title: 'Cybersecurity Essentials Bundle',
    titleCn: '网络安全全集',
    topics: ['Web Security', 'Cryptography', 'CTF', 'Penetration Testing', 'OWASP'],
    price: 39.99,
    originalPrice: 299.99,
    books: 7,
    color: '#DC143C',
    badge: '🛡️ 安全',
  },
  {
    id: 'ai-ml-foundation',
    title: 'AI & Machine Learning Bundle',
    titleCn: 'AI 机器学习全集',
    topics: ['ML', 'Deep Learning', 'PyTorch', 'NLP', 'LLM', 'Prompt Engineering'],
    price: 44.99,
    originalPrice: 349.99,
    books: 10,
    color: '#FF6F00',
    badge: '🤖 AI',
  },
  {
    id: 'golang-backend',
    title: 'Go & Backend Engineering Bundle',
    titleCn: 'Go 后端工程全集',
    topics: ['Go', 'gRPC', 'Microservices', 'PostgreSQL', 'Redis', 'APIs'],
    price: 27.99,
    originalPrice: 199.99,
    books: 8,
    color: '#00ADD8',
    badge: '⚙️ 后端',
  },
];

const PREVIEWS: Record<string, string[][]> = {
  'python-master': [
    ['# Chapter 1: Getting Started with Python\n\nPython is a powerful, readable, and versatile programming language. In this chapter, you will install Python and write your first program.\n\n## Installing Python\n\nDownload Python from python.org. Choose version 3.10 or later.\n\n```python\n# Your first Python program\nprint("Hello, World!")\n```\n\n## Variables\n\nVariables in Python are dynamically typed:\n\n```python\nname = "Alice"\nage = 30\nis_student = False\n```'],
    ['# Chapter 2: Data Structures\n\nPython has four built-in collection types: lists, tuples, sets, and dictionaries.\n\n## Lists\n\n```python\nfruits = ["apple", "banana", "cherry"]\nfruits.append("date")\nprint(fruits[0])  # apple\n```\n\n## Dictionaries\n\n```python\nperson = {"name": "Bob", "age": 25}\nprint(person["name"])  # Bob\n```'],
    ['# Chapter 3: Functions\n\nFunctions are reusable blocks of code. Define them with `def`.\n\n```python\ndef greet(name):\n    return f"Hello, {name}!"\n\nmessage = greet("Python Learner")\nprint(message)  # Hello, Python Learner!\n```'],
  ],
  'javascript-full': [
    ['# Chapter 1: JavaScript Fundamentals\n\nJavaScript is the language of the web.\n\n## Variables\n\n```javascript\nlet name = "Alice";\nconst age = 30;\n```\n\n## Functions\n\n```javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\nconst greetArrow = (name) => `Hello, ${name}!`;\n```'],
    ['# Chapter 2: The DOM\n\nThe DOM lets JavaScript interact with HTML.\n\n```javascript\ndocument.getElementById("myButton").addEventListener("click", () => {\n  alert("Button clicked!");\n});\n```'],
    ['# Chapter 3: Async JavaScript\n\nCallbacks, Promises, and async/await:\n\n```javascript\nasync function fetchData(url) {\n  try {\n    const res = await fetch(url);\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error("Error:", err);\n  }\n}\n```'],
  ],
  'devops-pro': [
    ['# Chapter 1: Docker Basics\n\nDocker packages your application with its environment.\n\n## Images and Containers\n\n```dockerfile\nFROM python:3.11-slim\nWORKDIR /app\nCOPY . .\nRUN pip install -r requirements.txt\nCMD ["python", "main.py"]\n```\n\n```bash\ndocker build -t myapp .\ndocker run -p 3000:3000 myapp\n```'],
    ['# Chapter 2: Kubernetes Essentials\n\nKubernetes orchestrates containers at scale.\n\n```yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: myapp\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: myapp\n```'],
    ['# Chapter 3: CI/CD Pipelines\n\nAutomate your workflow from code to production:\n\n```yaml\nname: CI\non:\n  push:\n    branches: [main]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm test\n```'],
  ],
  'security-essentials': [
    ['# Chapter 1: Web Security Fundamentals\n\nUnderstanding attacks is the first step to defense.\n\n## SQL Injection\n\n```python\n# Vulnerable:\nquery = "SELECT * FROM users WHERE id = " + userId\n\n# Safe (parameterized):\ncursor.execute("SELECT * FROM users WHERE id = %s", (userId,))\n```'],
    ['# Chapter 2: XSS Attacks\n\nCross-Site Scripting injects malicious scripts:\n\n```javascript\n// BAD:\ndocument.write(userInput);\n\n// GOOD:\nelement.textContent = userInput;\n```'],
    ['# Chapter 3: Authentication\n\nSecure password storage:\n\n```python\nfrom passlib.hash import bcrypt\n\nhashed = bcrypt.hash("mypassword")\nbcrypt.verify("mypassword", hashed)  # True\n```'],
  ],
  'ai-ml-foundation': [
    ['# Chapter 1: What is Machine Learning?\n\nML lets computers learn from data without explicit programming.\n\n## Types of Learning\n- Supervised: labeled data\n- Unsupervised: no labels\n- Reinforcement: learn from rewards\n\n## Your First ML Model\n\n```python\nfrom sklearn.ensemble import RandomForestClassifier\nmodel = RandomForestClassifier()\nmodel.fit(X_train, y_train)\n```'],
    ['# Chapter 2: Neural Networks\n\nInspired by the brain, neural networks learn complex patterns.\n\n```python\nimport torch.nn as nn\n\nclass SimpleNN(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.fc1 = nn.Linear(784, 128)\n```'],
    ['# Chapter 3: Prompt Engineering\n\nThe art of communicating with LLMs effectively.\n\n```python\nsystem = "You are a Python tutor. Be concise."\n\nprompt = """\nQ: What is a list?\nA: An ordered, mutable collection.\n\nQ: What is a dict?\nA:\n"""\n```'],
  ],
  'golang-backend': [
    ['# Chapter 1: Go Basics\n\nGo is a fast, simple, and reliable language built by Google.\n\n## Your First Program\n\n```go\npackage main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}\n```\n\n## Variables\n\n```go\nname := "Alice"  // type inferred\nvar age int = 30\n```'],
    ['# Chapter 2: Concurrency\n\nGo makes concurrency simple with goroutines and channels.\n\n```go\nfunc worker(id int, jobs <-chan int, results chan<- int) {\n    for j := range jobs {\n        results <- j * 2\n    }\n}\n\ngo worker(1, jobs, results)\n```'],
    ['# Chapter 3: Building APIs\n\n```go\nimport "github.com/gin-gonic/gin"\n\nfunc main() {\n    r := gin.Default()\n    r.GET("/health", func(c *gin.Context) {\n        c.JSON(200, gin.H{"status": "ok"})\n    })\n    r.Run()\n}\n```'],
  ],
};

const WALLET_ADDRESS = '0x417fd2884CdCF751EDF351eeC07a9f3f06f8Fd32';

function PreviewModal({ bundleId, onClose }: { bundleId: string; onClose: () => void }) {
  const { lang } = useLanguage();
  const pages = PREVIEWS[bundleId] || [];
  const bundle = BUNDLES.find(b => b.id === bundleId);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      zIndex: 1000, padding: 20, overflowY: 'auto',
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #0f0f2a, #1a1a3a)',
        border: '1px solid #FF6B35',
        borderRadius: 20, padding: 32, maxWidth: 680, width: '100%', margin: '20px 0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ color: '#FF6B35', fontSize: '1.2rem' }}>
            📖 {lang === 'zh' ? '免费预览（前3页）' : 'Free Preview (First 3 Pages)'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', fontSize: 24, cursor: 'pointer' }}>×</button>
        </div>
        {pages.map((page, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', color: '#ccc', lineHeight: 1.65, fontFamily: 'monospace', margin: 0 }}>
              {page}
            </pre>
            {i < pages.length - 1 && <div style={{ borderBottom: '1px dashed #333', margin: '16px 0' }} />}
          </div>
        ))}
        <div style={{ textAlign: 'center', marginTop: 24, padding: 20, background: '#0a0a1a', borderRadius: 12 }}>
          <p style={{ color: '#FF6B35', fontWeight: 700, marginBottom: 8 }}>
            {lang === 'zh' ? '💡 觉得有用？购买完整版！' : '💡 Found this useful? Buy the full version!'}
          </p>
          <p style={{ color: '#666', fontSize: '0.8rem' }}>
            📧 {lang === 'zh' ? '购买后完整版发送到你的邮箱' : 'Full version delivered to your email after purchase'}
          </p>
        </div>
      </div>
    </div>
  );
}

function OrderModal({ bundle, onClose }: { bundle: typeof BUNDLES[0]; onClose: () => void }) {
  const { lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'payment' | 'done'>('form');
  const [txHash, setTxHash] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStep('payment');
  }

  function handlePaid() {
    setStep('done');
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20,
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #0f0f2a, #1a1a3a)',
        border: '1px solid #FF6B35',
        borderRadius: 20, padding: 32, maxWidth: 480, width: '100%',
      }}>
        <button onClick={onClose} style={{
          float: 'right', background: 'none', border: 'none', color: '#888',
          fontSize: 24, cursor: 'pointer',
        }}>×</button>

        {step === 'form' && (
          <>
            <h2 style={{ color: '#FF6B35', marginBottom: 8, fontSize: '1.3rem' }}>
              📦 {lang === 'zh' ? '立即购买' : 'Order Now'}
            </h2>
            <p style={{ color: '#888', marginBottom: 24 }}>
              {lang === 'zh' ? '填写邮箱，收到USDT支付地址，付款后自动发货' : 'Enter email, receive USDT address, instant delivery'}
            </p>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder={lang === 'zh' ? '你的邮箱（用于接收书籍）' : 'Your email (for book delivery)'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 10,
                  background: '#0a0a1a', border: '1px solid #333',
                  color: '#fff', fontSize: '1rem', marginBottom: 16,
                }}
              />
              <div style={{ background: '#1a1a3a', borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#888' }}>{lang === 'zh' ? '商品' : 'Item'}</span>
                  <span style={{ color: '#fff' }}>{lang === 'zh' ? bundle.titleCn : bundle.title}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888' }}>{lang === 'zh' ? '应付' : 'Total'}</span>
                  <span style={{ color: '#FF6B35', fontWeight: 900, fontSize: '1.3rem' }}>${bundle.price} USDT</span>
                </div>
              </div>
              <button type="submit" style={{
                width: '100%', padding: '14px', background: 'linear-gradient(135deg, #FF6B35, #ff8c5a)',
                border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700,
                fontSize: '1rem', cursor: 'pointer',
              }}>
                {lang === 'zh' ? '获取支付地址 →' : 'Get Payment Address →'}
              </button>
            </form>
          </>
        )}

        {step === 'payment' && (
          <>
            <h2 style={{ color: '#FF6B35', marginBottom: 8 }}>💰 USDT {lang === 'zh' ? '支付' : 'Payment'}</h2>
            <p style={{ color: '#888', marginBottom: 24 }}>
              {lang === 'zh' ? '向以下地址转账，然后输入TxHash:' : 'Transfer to the address below, then enter TxHash:'}
            </p>
            <div style={{
              background: '#0a0a1a', border: '2px dashed #FF6B35',
              borderRadius: 12, padding: 16, marginBottom: 16, textAlign: 'center',
            }}>
              <p style={{ color: '#888', fontSize: '0.75rem', marginBottom: 8 }}>USDT (TRC-20)</p>
              <p style={{ color: '#4ECDC4', fontSize: '0.8rem', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                {WALLET_ADDRESS}
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(WALLET_ADDRESS)}
                style={{
                  marginTop: 8, background: '#FF6B3522', border: '1px solid #FF6B35',
                  color: '#FF6B35', padding: '4px 12px', borderRadius: 6,
                  cursor: 'pointer', fontSize: '0.8rem',
                }}
              >
                📋 {lang === 'zh' ? '复制地址' : 'Copy Address'}
              </button>
            </div>
            <div style={{ background: '#1a1a3a', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: 4 }}>{lang === 'zh' ? '应付金额' : 'Amount to pay'}</p>
              <p style={{ color: '#FF6B35', fontWeight: 900, fontSize: '1.8rem' }}>${bundle.price} USDT</p>
            </div>
            <input
              type="text"
              placeholder={lang === 'zh' ? '输入交易TxHash（转账后复制）' : 'Enter TxHash (from your wallet)'}
              value={txHash}
              onChange={e => setTxHash(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 10,
                background: '#0a0a1a', border: '1px solid #333',
                color: '#fff', fontSize: '0.9rem', marginBottom: 16,
              }}
            />
            <button
              onClick={handlePaid}
              disabled={!txHash}
              style={{
                width: '100%', padding: '14px',
                background: txHash ? 'linear-gradient(135deg, #4ECDC4, #2db8ad)' : '#333',
                border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700,
                fontSize: '1rem', cursor: txHash ? 'pointer' : 'not-allowed',
              }}
            >
              ✅ {lang === 'zh' ? '已付款，确认发货' : 'Paid — Confirm & Get Books'}
            </button>
          </>
        )}

        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>📚</div>
            <h2 style={{ color: '#4ECDC4', marginBottom: 12 }}>🎉 {lang === 'zh' ? '购买成功！' : 'Order Confirmed!'}</h2>
            <p style={{ color: '#888', marginBottom: 24 }}>
              {lang === 'zh' ? `书籍已发送到 ${email}，请查收。` : `Books sent to ${email}. Check your inbox (and spam).`}
            </p>
            <button onClick={onClose} style={{
              padding: '12px 32px', background: 'linear-gradient(135deg, #FF6B35, #ff8c5a)',
              border: 'none', borderRadius: 30, color: '#fff', fontWeight: 700, cursor: 'pointer',
            }}>
              ← {lang === 'zh' ? '返回商店' : 'Back to Store'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BooksPage() {
  const { lang } = useLanguage();
  const [orderBundle, setOrderBundle] = useState<typeof BUNDLES[0] | null>(null);
  const [previewBundle, setPreviewBundle] = useState<string | null>(null);

  return (
    <div style={{ background: '#06060f', minHeight: '100vh', color: '#e0e0e0', fontFamily: 'system-ui, sans-serif' }}>
      <LanguageToggle />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 50, paddingTop: 40 }}>
          <div style={{ fontSize: '0.8rem', color: '#FF6B35', fontWeight: 700, marginBottom: 12, letterSpacing: 2 }}>
            {lang === 'zh' ? '数字产品 · 即时发货' : 'DIGITAL PRODUCTS · INSTANT DELIVERY'}
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: 16, color: '#fff' }}>
            📚 {lang === 'zh' ? '编程电子书商店' : 'Programming E-Book Store'}
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto 24px' }}>
            {lang === 'zh' ? '精选编程技术书合集 · 数字版直接发货 · USDT支付即刻到手' : 'Curated programming book bundles · Instant digital delivery · USDT payment'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/tasks" style={{ color: '#FF6B35', textDecoration: 'none', fontWeight: 700 }}>← {lang === 'zh' ? '返回任务大厅' : 'Back to Tasks'}</a>
            <a href="/products" style={{ color: '#4ECDC4', textDecoration: 'none', fontWeight: 700 }}>📦 {lang === 'zh' ? '电子爆款选品' : 'Electronics Dropshipping'} →</a>
          </div>
        </div>

        {/* Trust Bar */}
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 50, flexWrap: 'wrap' }}>
          {[
            { icon: '⚡', zh: '即时发货', en: 'Instant Delivery' },
            { icon: '🔒', zh: '安全USDT支付', en: 'Secure USDT Payment' },
            { icon: '📧', zh: 'Email直接送达', en: 'Direct Email Delivery' },
            { icon: '♾️', zh: '永久更新', en: 'Lifetime Updates' },
          ].map(item => (
            <div key={item.zh} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#888', fontSize: '0.9rem' }}>
              <span>{item.icon}</span>
              <span>{lang === 'zh' ? item.zh : item.en}</span>
            </div>
          ))}
        </div>

        {/* Bundle Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24, marginBottom: 60 }}>
          {BUNDLES.map(b => (
            <div key={b.id} style={{
              background: 'linear-gradient(145deg, #0f0f2a, #1a1a35)',
              border: '1px solid #222',
              borderRadius: 20, padding: 28,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 16, right: 16,
                background: b.color + '22', color: b.color,
                padding: '4px 12px', borderRadius: 20,
                fontSize: '0.75rem', fontWeight: 700,
                border: `1px solid ${b.color}44`,
              }}>
                {b.badge}
              </div>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: b.color }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: 8, paddingRight: 80 }}>
                {lang === 'zh' ? b.titleCn : b.title}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {b.topics.map(topic => (
                  <span key={topic} style={{
                    background: b.color + '15', color: b.color,
                    padding: '3px 10px', borderRadius: 20,
                    fontSize: '0.7rem', fontWeight: 600,
                  }}>
                    {topic}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 20, color: '#666', fontSize: '0.8rem' }}>
                <span>📖 {b.books} {lang === 'zh' ? '本书' : 'books'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#FF6B35' }}>${b.price}</span>
                <span style={{ color: '#555', textDecoration: 'line-through', fontSize: '0.9rem' }}>${b.originalPrice}</span>
                <span style={{ color: '#4ECDC4', fontSize: '0.8rem', fontWeight: 600 }}>
                  {Math.round((1 - b.price / b.originalPrice) * 100)}% OFF
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setPreviewBundle(b.id)}
                  style={{
                    flex: 1, padding: '10px',
                    background: b.color + '22', border: `1px solid ${b.color}55`,
                    borderRadius: 10, color: b.color, fontWeight: 700, fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  📖 {lang === 'zh' ? '预览' : 'Preview'}
                </button>
                <button
                  onClick={() => setOrderBundle(b)}
                  style={{
                    flex: 1.5, padding: '10px',
                    background: `linear-gradient(135deg, ${b.color}, ${b.color}cc)`,
                    border: 'none', borderRadius: 10,
                    color: '#fff', fontWeight: 700, fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  📦 {lang === 'zh' ? '购买' : 'Buy'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{ background: 'linear-gradient(145deg, #0f0f2a, #0d0d20)', border: '1px solid #1e1e3a', borderRadius: 20, padding: 40, marginBottom: 40 }}>
          <h2 style={{ textAlign: 'center', marginBottom: 32, fontSize: '1.5rem', fontWeight: 800 }}>
            ⚙️ {lang === 'zh' ? '如何购买' : 'How It Works'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { step: '1', zh: '选择书集', en: 'Choose Bundle', icon: '📚' },
              { step: '2', zh: '填写邮箱', en: 'Enter Email', icon: '📧' },
              { step: '3', zh: 'USDT转账', en: 'Transfer USDT', icon: '💰' },
              { step: '4', zh: '即时收到', en: 'Instant Delivery', icon: '🚀' },
            ].map(item => (
              <div key={item.step} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 50, height: 50, borderRadius: '50%',
                  background: '#FF6B3522', border: '2px solid #FF6B35',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px', fontSize: '1.3rem', fontWeight: 900, color: '#FF6B35',
                }}>
                  {item.step}
                </div>
                <p style={{ fontWeight: 700, marginBottom: 4 }}>{item.icon} {lang === 'zh' ? item.zh : item.en}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <a href="https://d2758695161.github.io/wander-lobster-platform" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #FF6B35, #ff8c5a)',
            color: '#fff', padding: '14px 32px', borderRadius: 30,
            textDecoration: 'none', fontWeight: 700,
          }}>
            🦞 {lang === 'zh' ? '探索流浪龙虾平台' : 'Explore Wander Lobster Platform'}
          </a>
        </div>
      </div>

      {orderBundle && <OrderModal bundle={orderBundle} onClose={() => setOrderBundle(null)} />}
      {previewBundle && <PreviewModal bundleId={previewBundle} onClose={() => setPreviewBundle(null)} />}
    </div>
  );
}
