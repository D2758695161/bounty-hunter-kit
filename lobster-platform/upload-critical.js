const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = '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';
const OWNER = 'D2758695161';
const REPO = 'wander-lobster-platform';
const OUT = 'out';

function getFilePaths(dir) {
  const results = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      if (item === '.next' || item === 'node_modules') continue;
      results.push(...getFilePaths(full));
    } else {
      results.push(full.slice(OUT.length + 1));
    }
  }
  return results;
}

const files = getFilePaths(OUT);
console.log('Found', files.length, 'files to upload');

// Upload first 10 critical ones
const critical = files.slice(0, 10);
console.log('Critical files:', critical);

let idx = 0;
let ok = 0;
let fail = 0;

function uploadOne(file, cb) {
  const filePath = path.join(OUT, file);
  if (!fs.existsSync(filePath)) { cb(); return; }
  const content = fs.readFileSync(filePath);
  const b64 = content.toString('base64');

  // Get SHA first
  const getOpts = {
    hostname: 'api.github.com',
    path: '/repos/' + OWNER + '/' + REPO + '/contents/' + file,
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + TOKEN, 'User-Agent': 'yitong', 'Accept': 'application/vnd.github.v3+json' }
  };
  let sha = null;
  const getReq = https.get(getOpts, (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      try {
        const j = JSON.parse(d);
        sha = j.sha;
      } catch(e) {}
      doPut(sha);
    });
  });
  getReq.on('error', () => doPut(null));

  function doPut(sha) {
    const body = JSON.stringify({
      message: 'upload ' + file,
      content: b64,
      sha: sha || undefined
    });
    const putOpts = {
      hostname: 'api.github.com',
      path: '/repos/' + OWNER + '/' + REPO + '/contents/' + file,
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + TOKEN, 'User-Agent': 'yitong', 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    };
    const req = https.request(putOpts, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          ok++;
          console.log('OK', ok + '/' + files.length, file);
        } else {
          fail++;
          console.log('FAIL', file, res.statusCode, d.slice(0, 100));
        }
        cb();
      });
    });
    req.on('error', (e) => {
      fail++;
      console.log('ERR', file, e.message);
      cb();
    });
    req.write(body);
    req.end();
  }
}

function runNext() {
  if (idx >= critical.length) {
    console.log('\nCritical upload done. OK:', ok, 'Fail:', fail);
    console.log('Now uploading remaining', files.length - critical.length, 'files in background...');
    // Continue with rest in background
    let i2 = critical.length;
    function uploadRest() {
      if (i2 >= files.length) {
        console.log('\nAll done. Total OK:', ok, 'Fail:', fail);
        return;
      }
      uploadOne(files[i2++], uploadRest);
    }
    uploadRest();
    return;
  }
  uploadOne(critical[idx++], runNext);
}

runNext();
