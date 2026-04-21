import os
import json
import base64
import http.client
import time

TOKEN = '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'
OWNER = 'D2758695161'
REPO = 'wander-lobster-platform'
OUT = 'out'

def get_file_paths(directory):
    results = []
    for root, dirs, files in os.walk(directory):
        dirs[:] = [d for d in dirs if d not in ('.next', 'node_modules')]
        for f in files:
            full = os.path.join(root, f)
            rel = full[len(OUT)+1:]
            results.append(rel)
    return results

def upload_file(file_path):
    full = os.path.join(OUT, file_path)
    if not os.path.exists(full):
        return True, None
    
    with open(full, 'rb') as f:
        content = f.read()
    b64 = base64.b64encode(content).decode('ascii')
    
    # Get SHA
    conn = http.client.HTTPSConnection('api.github.com', timeout=10)
    headers = {
        'Authorization': f'Bearer {TOKEN}',
        'User-Agent': 'yitong',
        'Accept': 'application/vnd.github.v3+json'
    }
    sha = None
    try:
        conn.request('GET', f'/repos/{OWNER}/{REPO}/contents/{file_path}', headers=headers)
        r = conn.getresponse()
        if r.status == 200:
            data = json.loads(r.read())
            sha = data.get('sha')
    except:
        pass
    finally:
        conn.close()
    
    # Upload
    body = json.dumps({
        'message': f'upload {file_path}',
        'content': b64,
        'sha': sha
    })
    
    conn2 = http.client.HTTPSConnection('api.github.com', timeout=15)
    try:
        conn2.request('PUT', f'/repos/{OWNER}/{REPO}/contents/{file_path}', body=body, headers={
            **headers,
            'Content-Type': 'application/json'
        })
        r = conn2.getresponse()
        data = r.read()
        if 200 <= r.status < 300:
            return True, None
        else:
            return False, f'{r.status} {data[:100].decode()}'
    except Exception as e:
        return False, str(e)
    finally:
        conn2.close()

files = get_file_paths(OUT)
print(f'Found {len(files)} files')

# Critical first
critical = [f for f in files if any(x in f for x in ['index.html', 'shop.html', 'aiwallet', 'kyc'])]
print(f'Critical: {critical[:10]}')

ok = 0
fail = 0
for i, f in enumerate(critical[:15]):
    ok2, err = upload_file(f)
    if ok2:
        ok += 1
        print(f'OK {ok}/{len(files)} {f}')
    else:
        fail += 1
        print(f'FAIL {f} {err}')
    time.sleep(0.3)

print(f'\nCritical done: OK={ok} Fail={fail}')
print('Uploading rest in background...')

# Upload rest in batches of 5
rest = [f for f in files if f not in critical[:15]]
batch_size = 5
for batch_start in range(0, len(rest), batch_size):
    batch = rest[batch_start:batch_start+batch_size]
    for f in batch:
        ok2, err = upload_file(f)
        if ok2:
            ok += 1
        else:
            fail += 1
        print(f'OK={ok} FAIL={fail} {f}')
        time.sleep(0.2)
    time.sleep(1)

print(f'\nAll done: OK={ok} Fail={fail}')
