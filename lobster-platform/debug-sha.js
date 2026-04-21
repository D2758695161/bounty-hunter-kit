const https = require('https');
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

async function main() {
  const files = ['digital-products.html', 'products/ai-bounty-blueprint.md', 'products/payment-proof-demo.png'];
  for (const f of files) {
    const r = await api('GET', `/repos/D2758695161/wander-lobster-platform/contents/${f}?ref=gh-pages`);
    console.log(f + ':', r.status, r.data && typeof r.data === 'object' ? 'sha=' + (r.data.sha || 'NULL') + ' name=' + (r.data.name || 'NULL') : JSON.stringify(r.data).slice(0,80));
  }
}

main().catch(console.error);
