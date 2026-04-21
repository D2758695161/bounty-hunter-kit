# Fix upload-lobster.js token
upload_path = r"C:\Users\Administrator\.openclaw\workspace\lobster-platform\upload-lobster.js"
with open(upload_path, "r", encoding="utf-8") as f:
    upload_content = f.read()

new_token = "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"
old_token_match = "const token = 'ghp_"
if old_token_match in upload_content:
    start = upload_content.index(old_token_match)
    end = upload_content.index("'", start + len(old_token_match))
    print(f"Found token: {upload_content[start:end+1]}")
    upload_content = upload_content[:start] + f"const token = '{new_token}'" + upload_content[end+1:]
    with open(upload_path, "w", encoding="utf-8") as f:
        f.write(upload_content)
    print("Updated upload-lobster.js token")
else:
    print("Token not found in expected format, checking...")
    print(upload_content[:200])
