const https = require('https');
const fs = require('fs');

const TOKEN = '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';
const OWNER = 'D2758695161';
const REPO = 'wander-lobster-platform';
const BRANCH = 'gh-pages';

function apiRequest(method, urlPath, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, 'https://api.github.com');
    const options = { hostname: url.hostname, path: url.pathname, method,
      headers: { 'Authorization': `token ${TOKEN}`, 'User-Agent': 'lobster-uploader', 'Accept': 'application/vnd.github.v3+json' } };
    if (data) {
      const body = JSON.stringify(data);
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(body);
      const req = https.request(options, (res) => {
        let d = ''; res.on('data', c => d += c);
        res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve(d); } });
      });
      req.on('error', reject); req.write(body); req.end();
    } else {
      const req = https.request(options, (res) => {
        let d = ''; res.on('data', c => d += c);
        res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve(d); } });
      });
      req.on('error', reject); req.end();
    }
  });
}

async function main() {
  // Check existing
  try {
    const existing = await apiRequest('GET', `https://api.github.com/repos/${OWNER}/${REPO}/contents/products.html?ref=${BRANCH}`);
    console.log('Existing SHA:', existing.sha);
    console.log('Existing size:', existing.size);
  } catch(e) {
    console.log('File does not exist yet');
  }
  
  // Upload
  const content = fs.readFileSync('C:/Users/Administrator/.openclaw/workspace/lobster-platform/out/products.html');
  const encoded = content.toString('base64');
  const shaResult = await apiRequest('GET', `https://api.github.com/repos/${OWNER}/${REPO}/contents/products.html?ref=${BRANCH}`);
  const sha = shaResult.sha;
  
  const data = { message: 'Update products page', content: encoded, branch: BRANCH, sha };
  const result = await apiRequest('PUT', `https://api.github.com/repos/${OWNER}/${REPO}/contents/products.html`, data);
  if (result.commit) {
    console.log('✓ Uploaded products.html');
    console.log('URL: https://d2758695161.github.io/wander-lobster-platform/products.html');
  } else {
    console.log('Error:', JSON.stringify(result));
  }
}

main().catch(console.error);
