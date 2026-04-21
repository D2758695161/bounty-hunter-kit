const token = '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';
const owner = 'D2758695161';
const repo = 'wander-lobster-platform';
const outDir = require('path').join(__dirname, 'out');
const fs = require('fs');
const path = require('path');

async function getFiles(dir) {
  const files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      files.push(...await getFiles(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function uploadTree() {
  // Get current main SHA
  const mainRef = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/main`, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
  }).then(r => r.json());
  const baseSha = mainRef.object.sha;
  console.log('Base SHA:', baseSha);

  // Get current commit
  const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits/${baseSha}`, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
  });
  const baseCommit = await commitRes.json();
  const baseTreeSha = baseCommit.tree.sha;

  // Read all files and create blobs
  const files = await getFiles(outDir);
  console.log(`Found ${files.length} files`);

  // Filter out very large files (> 1MB)
  const MAX_SIZE = 1024 * 1024;
  const smallFiles = files.filter(f => {
    const size = fs.statSync(f).size;
    if (size > MAX_SIZE) console.log(`[SKIP LARGE] ${path.relative(outDir, f)} (${(size/1024).toFixed(0)}KB)`);
    return size <= MAX_SIZE;
  });

  // Create blobs
  const blobs = [];
  for (const file of smallFiles) {
    const content = fs.readFileSync(file);
    const relativePath = path.relative(outDir, file).replace(/\\/g, '/');
    const encoded = content.toString('base64');
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
      method: 'POST',
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/vnd.github.v3+json' },
      body: JSON.stringify({ content: encoded, encoding: 'base64' })
    });
    const blob = await res.json();
    blobs.push({ path: relativePath, sha: blob.sha, mode: '100644', type: 'blob' });
  }
  console.log(`Created ${blobs.length} blobs`);

  // Create tree
  const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
    method: 'POST',
    headers: { Authorization: `token ${token}`, 'Content-Type': 'application/vnd.github.v3+json' },
    body: JSON.stringify({ tree: blobs, base_tree: baseTreeSha })
  });
  const newTree = await treeRes.json();
  console.log('New tree:', newTree.sha);

  // Create commit
  const commitRes2 = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
    method: 'POST',
    headers: { Authorization: `token ${token}`, 'Content-Type': 'application/vnd.github.v3+json' },
    body: JSON.stringify({
      message: 'Deploy: add language toggle + i18n infrastructure',
      tree: newTree.sha,
      parents: [baseSha]
    })
  });
  const newCommit = await commitRes2.json();
  console.log('New commit:', newCommit.sha);

  // Update main ref
  await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`, {
    method: 'PATCH',
    headers: { Authorization: `token ${token}`, 'Content-Type': 'application/vnd.github.v3+json' },
    body: JSON.stringify({ sha: newCommit.sha })
  });
  console.log('Deployed!');
  console.log('Site: https://d2758695161.github.io/wander-lobster-platform/');
}

uploadTree().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
