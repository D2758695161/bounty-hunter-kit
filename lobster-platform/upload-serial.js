const token = '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';
const owner = 'D2758695161';
const repo = 'wander-lobster-platform';
const path = require('path');
const fs = require('fs');
const outDir = path.join(__dirname, 'out');

async function uploadFile(filePath) {
  const relativePath = path.relative(outDir, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath);
  const contentBase64 = Buffer.from(content).toString('base64');

  let sha = null;
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${relativePath}`, {
      headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
    });
    if (res.ok) {
      const data = await res.json();
      sha = data.sha;
    }
  } catch (e) {}

  const body = { message: `Update ${relativePath}`, content: contentBase64 };
  if (sha) body.sha = sha;

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${relativePath}`, {
    method: 'PUT',
    headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    return `[OK] ${relativePath}`;
  } else {
    const data = await res.json().catch(() => ({}));
    return `[FAIL] ${relativePath}: ${res.status} ${data.message || ''}`;
  }
}

async function run() {
  const files = [];
  function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) walk(full);
      else files.push(full);
    }
  }
  walk(outDir);
  console.log(`Uploading ${files.length} files...`);

  let done = 0, ok = 0, fail = 0;
  const fails = [];

  for (const file of files) {
    const result = await uploadFile(file);
    done++;
    if (result.includes('[OK]')) {
      ok++;
    } else {
      fail++;
      fails.push(result);
    }
    process.stdout.write(`\r[${done}/${files.length}] OK:${ok} FAIL:${fail}  `);
  }

  console.log(`\n\nDone! ${ok} uploaded, ${fail} failed.`);
  if (fails.length > 0) {
    console.log('\nFailures (first 10):');
    fails.slice(0, 10).forEach(f => console.log(' ', f));
  }
  console.log('\nSite: https://d2758695161.github.io/wander-lobster-platform/');
}

run().catch(console.error);
