const https = require('https');
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
  // Try with sha from existing test file
  const r1 = await api('GET', `/repos/${REPO}/contents/test-dp-1776407671511.txt?ref=gh-pages`);
  console.log('GET test file:', r1.status, 'sha:', r1.data.sha ? 'yes' : 'no');
  
  // Now try to create digital-products.html with a new SHA
  const content = Buffer.from('test content ' + Date.now());
  const encoded = content.toString('base64');
  
  // Try without sha
  const r2 = await api('PUT', `/repos/${REPO}/contents/test-new-file.txt`, {
    message: 'test new file',
    content: encoded,
    branch: 'gh-pages'
  });
  console.log('PUT without sha:', r2.status, r2.data.sha ? 'OK sha=' + r2.data.sha.slice(0,8) : 'ERROR: ' + (r2.data.message || JSON.stringify(r2.data).slice(0,100)));
}

main().catch(console.error);
