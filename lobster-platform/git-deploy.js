/**
 * git-deploy.js — Push built static files to GitHub Pages via git
 * Uses stored git credentials (git:https://github.com)
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const repoDir = __dirname;
const outDir = path.join(repoDir, 'out');

console.log('=== Git Deploy for 流浪龙虾 Platform ===\n');

// Check git status
console.log('1. Checking git remote...');
try {
  const remote = execSync('git -C lobster-platform remote get-url lob-platform', { encoding: 'utf8' }).trim();
  console.log('   Remote:', remote);
} catch (e) {
  console.error('   FAIL: Cannot get remote:', e.message);
  process.exit(1);
}

// Check if out/ exists
if (!fs.existsSync(outDir)) {
  console.error('FAIL: out/ directory not found. Run npm run build first.');
  process.exit(1);
}

console.log('\n2. Checking out/ contents...');
const outFiles = execSync(`Get-ChildItem -Path "${outDir}" -Recurse -File | Measure-Object | Select-Object -ExpandProperty Count`, { encoding: 'utf8', shell: 'powershell' }).trim();
console.log(`   ${outFiles} files in out/`);

// Stage out/ directory contents
console.log('\n3. Staging out/ directory contents...');
try {
  // Use git add with the out directory
  execSync(`git -C lobster-platform add out/`, { cwd: repoDir });
  const staged = execSync('git -C lobster-platform diff --cached --stat', { encoding: 'utf8' });
  console.log('   Staged:\n' + staged);
} catch (e) {
  console.error('   FAIL staging:', e.message);
  process.exit(1);
}

// Commit
console.log('\n4. Committing...');
const commitMsg = `Deploy: Update landing page + tasks (RecentWins section) + fresh job listings | ${new Date().toISOString()}`;
try {
  execSync(`git -C lobster-platform commit -m "${commitMsg}"`, { cwd: repoDir });
  console.log('   Committed successfully');
} catch (e) {
  // Check if there are actually changes to commit
  const status = execSync('git -C lobster-platform status --short', { encoding: 'utf8' });
  if (status.trim() === '') {
    console.log('   Nothing to commit (out/ unchanged)');
  } else {
    console.error('   FAIL commit:', e.message);
    console.log('   Status:', status);
    process.exit(1);
  }
}

// Push
console.log('\n5. Pushing to GitHub Pages...');
try {
  execSync(`git -C lobster-platform push lob-platform main`, { cwd: repoDir });
  console.log('   Pushed successfully!');
} catch (e) {
  console.error('   FAIL push:', e.message);
  process.exit(1);
}

console.log('\n=== Deployment Complete ===');
console.log('Site: https://d2758695161.github.io/wander-lobster-platform/');
