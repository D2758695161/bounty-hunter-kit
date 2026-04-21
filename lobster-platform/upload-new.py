import os, json, base64, http.client, time

TOKEN = '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'
OWNER = 'D2758695161'
REPO = 'wander-lobster-platform'
BASE = 'C:/Users/Administrator/.openclaw/workspace/lobster-platform/out'

def upload_file(rel_path):
    full = os.path.join(BASE, rel_path.replace('/', os.sep))
    if not os.path.exists(full):
        print('NOT FOUND:', rel_path)
        return False
    with open(full, 'rb') as f:
        data = f.read()
    b64 = base64.b64encode(data).decode()
    conn = http.client.HTTPSConnection('api.github.com', timeout=15)
    sha = None
    try:
        conn.request('GET', f'/repos/{OWNER}/{REPO}/contents/{rel_path}',
            headers={'Authorization': f'Bearer {TOKEN}', 'User-Agent': 'yitong'})
        r = conn.getresponse()
        if r.status == 200:
            sha = json.loads(r.read()).get('sha')
    except:
        pass
    conn.close()
    body = json.dumps({'message': 'fix ' + rel_path, 'content': b64, 'sha': sha})
    conn2 = http.client.HTTPSConnection('api.github.com', timeout=20)
    try:
        conn2.request('PUT', f'/repos/{OWNER}/{REPO}/contents/{rel_path}',
            body=body, headers={'Authorization': f'Bearer {TOKEN}', 'User-Agent': 'yitong',
            'Content-Type': 'application/json'})
        r = conn2.getresponse()
        ok = 200 <= r.status < 300
        if not ok:
            print(f'FAIL {rel_path} {r.status} {r.read()[:80]}')
        return ok
    except Exception as e:
        print(f'ERR {rel_path} {e}')
        return False
    finally:
        conn2.close()

# Get all files
all_files = []
for root, dirs, files in os.walk(BASE):
    dirs[:] = [x for x in dirs if x not in ('.next', 'node_modules')]
    for f in files:
        full = os.path.join(root, f)
        rel = full[len(BASE)+1:].replace(os.sep, '/')
        all_files.append(rel)

print(f'Total files: {len(all_files)}')

ok = 0
fail = 0
for rel in all_files:
    if upload_file(rel):
        ok += 1
    else:
        fail += 1
    if (ok + fail) % 10 == 0:
        print(f'Progress: {ok} ok, {fail} fail')
    time.sleep(0.1)

print(f'DONE: {ok} ok, {fail} fail, total {len(all_files)}')
