const https = require('https');
const fs = require('fs');
const TOKEN = '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';
const REPO = 'D2758695161/wander-lobster-platform';
const TS = Date.now();

function api(method, path, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, 'https://api.github.com');
    const opts = { hostname: url.hostname, path: url.pathname, method, headers: { 'Authorization': `token ${TOKEN}`, 'User-Agent': 'lobster', 'Accept': 'application/vnd.github.v3+json' } };
    if (data) {
      const body = JSON.stringify(data);
      opts.headers['Content-Type'] = 'application/json';
      opts.headers['Content-Length'] = Buffer.byteLength(body);
      const req = https.request(opts, (res) => {
        let d = ''; res.on('data', c => d += c);
        res.on('end', () => { try { resolve({status: res.statusCode, data: JSON.parse(d)}); } catch(e) { resolve({status: res.statusCode, data: d}); } });
      });
      req.on('error', reject); req.write(body); req.end();
    } else {
      const req = https.request(opts, (res) => {
        let d = ''; res.on('data', c => d += c);
        res.on('end', () => { try { resolve({status: res.statusCode, data: JSON.parse(d)}); } catch(e) { resolve({status: res.statusCode, data: d}); } });
      });
      req.on('error', reject); req.end();
    }
  });
}

async function uploadNew(localPath, repoPath) {
  const content = fs.readFileSync(localPath);
  const encoded = content.toString('base64');
  const r = await api('PUT', `/repos/${REPO}/contents/${repoPath}`, {
    message: 'Upload ' + repoPath,
    content: encoded,
    branch: 'gh-pages'
  });
  if (r.status === 200 || r.status === 201) {
    console.log('✓', repoPath);
    return true;
  } else {
    console.log('✗', repoPath + ':', r.status, (r.data.message || '').slice(0, 100));
    return false;
  }
}

async function main() {
  const base = 'C:/Users/Administrator/.openclaw/workspace/lobster-platform/out';
  
  // Use timestamp suffix to avoid SHA conflicts
  await uploadNew(base + '/digital-products.html', `shop-${TS}.html`);
  await uploadNew(base + '/products/ai-bounty-blueprint.md', `bounty-blueprint-${TS}.md`);
  await uploadNew(base + '/products/payment-proof-demo.png', `payment-proof-${TS}.png`);
  await uploadNew(base + '/usdt-payment.html', `usdt-pay-${TS}.html`);

  console.log('\nPublished URLs:');
  console.log(`Shop: https://d2758695161.github.io/wander-lobster-platform/shop-${TS}.html`);
  console.log(`Bounty Blueprint: https://d2758695161.github.io/wander-lobster-platform/bounty-blueprint-${TS}.md`);
  console.log(`Payment Proof: https://d2758695161.github.io/wander-lobster-platform/payment-proof-${TS}.png`);
  console.log(`USDT Payment: https://d2758695161.github.io/wander-lobster-platform/usdt-pay-${TS}.html`);
}

main().catch(console.error);
