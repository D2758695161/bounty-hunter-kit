# Upload all out/ files to GitHub Pages
cd C:/Users/Administrator/.openclaw/workspace/lobster-platform

# First, let's just upload the shop.html which is the key file we changed
$shopContent = Get-Content out/shop.html -Raw -Encoding UTF8
$b64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($shopContent))
$body = @{
    message = "upload shop.html with mystery box fix"
    content = $b64
    encoding = "base64"
} | ConvertTo-Json -Compress

$headers = @{
    "Authorization" = "Bearer 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"
    "User-Agent" = "yitong"
    "Content-Type" = "application/json"
}

# Get current SHA
$getResp = Invoke-WebRequest -Uri "https://api.github.com/repos/D2758695161/wander-lobster-platform/contents/out/shop.html" -Headers $headers -UseBasicParsing
$getJson = $getResp.Content | ConvertFrom-Json
$sha = $getJson.sha
Write-Host "Current shop.html SHA: $sha"

# Upload
$bodyUpdated = @{
    message = "upload shop.html with mystery box fix"
    content = $b64
    encoding = "base64"
    sha = $sha
} | ConvertTo-Json -Compress

$uploadResp = Invoke-WebRequest -Uri "https://api.github.com/repos/D2758695161/wander-lobster-platform/contents/out/shop.html" -Method PUT -Headers $headers -Body $bodyUpdated -UseBasicParsing
Write-Host "Upload status: $($uploadResp.StatusCode)"

# Now upload all files in background using node script
Start-Process -FilePath "node" -ArgumentList "upload-shop-fix.js" -WorkingDirectory "C:/Users/Administrator/.openclaw/workspace/lobster-platform" -NoNewWindow -PassThru
Write-Host "Node upload started in background"
