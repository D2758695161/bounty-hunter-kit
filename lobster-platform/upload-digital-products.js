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
  const repoPath = 'digital-products.html';
  const localPath = 'C:/Users/Administrator/.openclaw/workspace/lobster-platform/out/digital-products.html';
  
  // Check if exists
  let sha;
  try {
    const existing = await apiRequest('GET', `https://api.github.com/repos/${OWNER}/${REPO}/contents/${repoPath}?ref=${BRANCH}`);
    sha = existing.sha;
    console.log('File exists, SHA:', sha);
  } catch(e) {
    console.log('File does not exist, creating new');
  }
  
  const content = fs.readFileSync(localPath);
  const encoded = content.toString('base64');
  
  const data = { message: 'Update digital products page', content: encoded, branch: BRANCH };
  if (sha) data.sha = sha;
  
  const result = await apiRequest('PUT', `https://api.github.com/repos/${OWNER}/${REPO}/contents/${repoPath}`, data);
  if (result.commit) {
    console.log('Done!');
    console.log('URL: https://d2758695161.github.io/wander-lobster-platform/digital-products.html');
  } else {
    console.log('Error:', result.message || JSON.stringify(result).slice(0, 200));
  }
}

main().catch(console.error);
