// Upload usdt-payment.html to GitHub Pages
const https = require('https');
const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = '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';
const REPO = 'D2758695161/wander-lobster-platform';
const BRANCH = 'gh-pages';
const FILE_PATH = 'usdt-payment.html';
const LOCAL_FILE = path.join(__dirname, 'out', FILE_PATH);

const fileContent = fs.readFileSync(LOCAL_FILE);
const encodedContent = fileContent.toString('base64');

function apiRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, `https://api.github.com`);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method,
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'lobster-uploader',
        'Accept': 'application/vnd.github.v3+json',
      }
    };
    if (data) {
      const body = JSON.stringify(data);
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(body);
      const req = https.request(options, (res) => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => {
          try { resolve(JSON.parse(d)); }
          catch(e) { resolve(d); }
        });
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    } else {
      const req = https.request(options, (res) => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => {
          try { resolve(JSON.parse(d)); }
          catch(e) { resolve(d); }
        });
      });
      req.on('error', reject);
      req.end();
    }
  });
}

async function main() {
  // Check if file exists
  let existingSha;
  try {
    const existing = await apiRequest('GET', `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`);
    if (existing.sha) {
      existingSha = existing.sha;
      console.log('File exists, SHA:', existingSha);
    }
  } catch(e) {
    console.log('File does not exist yet, will create new');
  }

  // Upload
  const data = {
    message: 'Add USDT payment page',
    content: encodedContent,
    branch: BRANCH,
  };
  if (existingSha) data.sha = existingSha;

  const result = await apiRequest('PUT', `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, data);
  if (result.commit) {
    console.log('✅ Uploaded usdt-payment.html');
    console.log('URL: https://d2758695161.github.io/wander-lobster-platform/usdt-payment.html');
  } else {
    console.log('❌ Error:', result.message || result);
  }
}

main().catch(console.error);
