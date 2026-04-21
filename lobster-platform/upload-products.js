const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = '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';
const OWNER = 'D2758695161';
const REPO = 'wander-lobster-platform';
const BRANCH = 'gh-pages';

function apiRequest(method, urlPath, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, 'https://api.github.com');
    const options = {
      hostname: url.hostname, path: url.pathname, method,
      headers: { 'Authorization': `token ${TOKEN}`, 'User-Agent': 'lobster-uploader', 'Accept': 'application/vnd.github.v3+json' }
    };
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

async function uploadFile(filePath, repoPath) {
  const content = fs.readFileSync(filePath);
  const encoded = content.toString('base64');
  let sha;
  try {
    const existing = await apiRequest('GET', `https://api.github.com/repos/${OWNER}/${REPO}/contents/${repoPath}?ref=${BRANCH}`);
    if (existing.sha) sha = existing.sha;
  } catch(e) {}
  const data = { message: 'Upload ' + repoPath, content: encoded, branch: BRANCH };
  if (sha) data.sha = sha;
  const result = await apiRequest('PUT', `https://api.github.com/repos/${OWNER}/${REPO}/contents/${repoPath}`, data);
  console.log(result.commit ? '✓ ' + repoPath : '✗ ' + repoPath + ': ' + (result.message || ''));
}

async function main() {
  const base = 'C:/Users/Administrator/.openclaw/workspace/lobster-platform/out';
  const files = [
    'products/ai-bounty-blueprint.md',
    'products/payment-proof-demo.png',
  ];
  for (const f of files) {
    await uploadFile(path.join(base, f), f);
  }
}

main().catch(console.error);
