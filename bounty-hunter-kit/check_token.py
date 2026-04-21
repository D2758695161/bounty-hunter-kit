import urllib.request
import json

def check_token(token, repo="D2758695161/wander-lobster-platform"):
    url = f"https://api.github.com/repos/{repo}"
    req = urllib.request.Request(url, headers={
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "lobster-upload"
    })
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read())
            print(f"[OK] Token works! Repo: {data['full_name']}")
            return True
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"[FAIL] Token: {token[:15]}... -> {e.code} {body[:100]}")
        return False

# Check old token
print("Checking old token...")
old_ok = check_token("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")

print("\nChecking new token...")
new_ok = check_token("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")
