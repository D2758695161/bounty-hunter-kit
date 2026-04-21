const https = require('https');

const TOKEN = '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';

function api(method, path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, 'https://api.github.com');
    const opts = { hostname: url.hostname, path: url.pathname, method, headers: { 'Authorization': `token ${TOKEN}`, 'User-Agent': 'test', 'Accept': 'application/vnd.github.v3+json' } };
    const req = https.request(opts, (res) => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => { try { resolve({status: res.statusCode, data: JSON.parse(d)}); } catch(e) { resolve({status: res.statusCode, data: d}); } });
    });
    req.on('error', reject); req.end();
  });
}

async function main() {
  const files = ['digital-products.html', 'products/ai-bounty-blueprint.md', 'products/payment-proof-demo.png'];
  for (const f of files) {
    const r = await api('GET', `/repos/D2758695161/wander-lobster-platform/contents/${f}?ref=gh-pages`);
    console.log(f + ':', r.status, r.data.sha ? 'SHA=' + r.data.sha.slice(0,8) : 'NO SHA - ' + JSON.stringify(r.data).slice(0,100));
  }
}

main().catch(console.error);
