const https = require('https');
const fs = require('fs');

const TOKEN = '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';

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

async function upload(localPath, repoPath) {
  if (!fs.existsSync(localPath)) { console.log('MISSING:', localPath); return; }
  const content = fs.readFileSync(localPath);
  const encoded = content.toString('base64');
  
  // Check if exists
  let sha;
  try {
    const r = await api('GET', `/repos/D2758695161/wander-lobster-platform/contents/${repoPath}?ref=gh-pages`);
    if (r.status === 200 && r.data.sha) sha = r.data.sha;
  } catch(e) {}
  
  const data = { message: 'Upload ' + repoPath, content: encoded, branch: 'gh-pages' };
  if (sha) data.sha = sha;
  
  const r = await api('PUT', `/repos/D2758695161/wander-lobster-platform/contents/${repoPath}`, data);
  if (r.status === 200 || r.status === 201) {
    console.log('✓', repoPath, r.data.content?.sha ? '(SHA:' + r.data.content.sha.slice(0,8) + ')' : '');
  } else {
    console.log('✗', repoPath + ':', r.data.message || JSON.stringify(r.data).slice(0, 150));
  }
}

async function main() {
  const base = 'C:/Users/Administrator/.openclaw/workspace/lobster-platform/out';
  await upload(base + '/digital-products.html', 'digital-products.html');
  await upload(base + '/products/ai-bounty-blueprint.md', 'products/ai-bounty-blueprint.md');
  await upload(base + '/products/payment-proof-demo.png', 'products/payment-proof-demo.png');
  await upload(base + '/usdt-payment.html', 'usdt-payment.html');
  console.log('\nAll URLs:');
  console.log('Products: https://d2758695161.github.io/wander-lobster-platform/digital-products.html');
  console.log('USDT Pay: https://d2758695161.github.io/wander-lobster-platform/usdt-payment.html');
}

main().catch(console.error);
