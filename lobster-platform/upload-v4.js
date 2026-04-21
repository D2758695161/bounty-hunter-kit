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
  await uploadNew(base + '/digital-products.html', 'dp-' + Date.now() + '.html');
  await uploadNew(base + '/products/ai-bounty-blueprint.md', 'dp-bounty-' + Date.now() + '.md');
  await uploadNew(base + '/usdt-payment.html', 'dp-usdt-' + Date.now() + '.html');
  console.log('\nDone!');
}

main().catch(console.error);
