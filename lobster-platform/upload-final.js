const https = require('https');
const fs = require('fs');
const TOKEN = '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';
const REPO = 'D2758695161/wander-lobster-platform';

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

async function uploadWithShaCheck(localPath, repoPath) {
  // First, try to get existing SHA
  let existingSha = undefined;
  try {
    const getR = await api('GET', `/repos/${REPO}/contents/${repoPath}?ref=gh-pages`);
    if (getR.status === 200 && getR.data && typeof getR.data === 'object' && getR.data.sha) {
      existingSha = getR.data.sha;
      console.log('  Found existing SHA:', existingSha.slice(0, 8));
    } else if (getR.status !== 404) {
      console.log('  GET status:', getR.status, JSON.stringify(getR.data).slice(0, 80));
    } else {
      console.log('  File does not exist, will create');
    }
  } catch(e) {
    console.log('  GET error:', e.message);
  }

  const content = fs.readFileSync(localPath);
  const encoded = content.toString('base64');
  
  const payload = {
    message: 'Update ' + repoPath,
    content: encoded,
    branch: 'gh-pages'
  };
  if (existingSha) {
    payload.sha = existingSha;
  }

  const r = await api('PUT', `/repos/${REPO}/contents/${repoPath}`, payload);
  
  if (r.status === 200 || r.status === 201) {
    console.log('✓', repoPath, '(SHA:', r.data.content?.sha?.slice(0, 8), ')');
    return true;
  } else {
    console.log('✗', repoPath + ':', r.status, (r.data.message || '').slice(0, 150));
    return false;
  }
}

async function main() {
  const base = 'C:/Users/Administrator/.openclaw/workspace/lobster-platform/out';
  
  console.log('--- digital-products.html ---');
  await uploadWithShaCheck(base + '/digital-products.html', 'digital-products.html');
  
  console.log('--- products/ai-bounty-blueprint.md ---');
  await uploadWithShaCheck(base + '/products/ai-bounty-blueprint.md', 'products/ai-bounty-blueprint.md');
  
  console.log('--- products/payment-proof-demo.png ---');
  await uploadWithShaCheck(base + '/products/payment-proof-demo.png', 'products/payment-proof-demo.png');
}

main().catch(console.error);
