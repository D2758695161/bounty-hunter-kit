const https = require('https');
const fs = require('fs');

const TOKEN = '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';

function api(method, path, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, 'https://api.github.com');
    const opts = { hostname: url.hostname, path: url.pathname, method, headers: { 'Authorization': `token ${TOKEN}`, 'User-Agent': 'test', 'Accept': 'application/vnd.github.v3+json' } };
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
  // Test: upload a simple file
  const content = Buffer.from('test content ' + Date.now()).toString('base64');
  const r = await api('PUT', `/repos/D2758695161/wander-lobster-platform/contents/test-upload.txt`, {
    message: 'test upload',
    content,
    branch: 'gh-pages'
  });
  console.log('Status:', r.status);
  console.log('Data:', JSON.stringify(r.data).slice(0, 300));
}

main().catch(console.error);
