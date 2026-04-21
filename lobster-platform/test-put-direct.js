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

async function main() {
  // Try direct PUT without GET first
  const content = fs.readFileSync('C:/Users/Administrator/.openclaw/workspace/lobster-platform/out/digital-products.html');
  const encoded = content.toString('base64');
  const r = await api('PUT', `/repos/${REPO}/contents/digital-products.html`, {
    message: 'Upload digital products page v2',
    content: encoded,
    branch: 'gh-pages'
  });
  console.log('Status:', r.status);
  if (r.status !== 200 && r.status !== 201) {
    console.log('Error:', JSON.stringify(r.data));
  } else {
    console.log('Success! SHA:', r.data.content?.sha);
  }
}

main().catch(console.error);
