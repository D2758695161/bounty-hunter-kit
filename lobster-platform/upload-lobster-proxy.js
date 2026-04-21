process.env.https_proxy = 'http://127.0.0.1:7897';
process.env.HTTP_PROXY = 'http://127.0.0.1:7897';

const token = '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';
const owner = 'D2758695161';
const repo = 'wander-lobster-platform';
const path = require('path');
const fs = require('fs');

const outDir = path.join(__dirname, 'out');

async function uploadFile(filePath, content) {
  const relativePath = path.relative(outDir, filePath).replace(/\\/g, '/');
  const contentBase64 = Buffer.from(content).toString('base64');

  let sha = null;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${relativePath}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'lobster-uploader/1.0',
        }
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.sha) sha = data.sha;
    }
  } catch (e) {}

  const body = {
    message: `Deploy: ${relativePath}`,
    content: contentBase64,
    ...(sha ? { sha } : {}),
  };

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${relativePath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'lobster-uploader/1.0',
      },
      body: JSON.stringify(body),
    }
  );

  if (res.ok) {
    console.log(`[OK] ${relativePath}`);
    return true;
  } else {
    const err = await res.text();
    console.log(`[FAIL] ${relativePath}: HTTP ${res.status} - ${err.slice(0, 100)}`);
    return false;
  }
}

async function run() {
  const files = [];
  function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      try {
        if (fs.statSync(full).isDirectory()) walk(full);
        else files.push(full);
      } catch {}
    }
  }
  walk(outDir);

  console.log(`Uploading ${files.length} files via proxy...`);
  let ok = 0, fail = 0;
  for (const file of files) {
    const content = fs.readFileSync(file);
    const ok2 = await uploadFile(file, content);
    if (ok2) ok++; else fail++;
  }
  console.log(`\nDone! OK: ${ok}, Failed: ${fail}`);
  console.log('Site: https://d2758695161.github.io/wander-lobster-platform/');
}

run().catch(console.error);
