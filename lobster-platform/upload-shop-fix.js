const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = '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';
const OWNER = 'D2758695161';
const REPO = 'wander-lobster-platform';
const OUT = 'out';

function getFilePaths(dir, arr) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) getFilePaths(full, arr);
    else arr.push(full.slice(OUT.length + 1));
  }
  return arr;
}

const files = getFilePaths(OUT, []);
console.log('Found', files.length, 'files');

let idx = 0;
let fail = 0;
let ok = 0;

function uploadNext() {
  if (idx >= files.length) {
    console.log('DONE. ok=' + ok + ' fail=' + fail);
    return;
  }
  const file = files[idx++];
  const filePath = path.join(OUT, file);
  const content = fs.readFileSync(filePath);
  const data = JSON.stringify({
    message: 'upload ' + file,
    content: content.toString('base64'),
    encoding: 'base64'
  });
  const opts = {
    hostname: 'api.github.com',
    path: '/repos/' + OWNER + '/' + REPO + '/contents/' + file,
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + TOKEN,
      'User-Agent': 'yitong',
      'Content-Type': 'application/json'
    }
  };
  const req = https.request(opts, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        ok++;
        console.log('OK  ' + ok + '/' + files.length + ' ' + file);
      } else {
        fail++;
        console.log('FAIL' + ' ' + fail + '/' + files.length + ' ' + file + ' [' + res.statusCode + '] ' + (d.slice(0, 80)));
      }
      uploadNext();
    });
  });
  req.on('error', e => {
    fail++;
    console.log('ERR ' + fail + '/' + files.length + ' ' + file + ' ' + e.message);
    uploadNext();
  });
  req.write(data);
  req.end();
}

// Upload first 30 files as a test
console.log('Starting upload (first 30 files)...');
