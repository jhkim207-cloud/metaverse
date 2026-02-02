$ErrorActionPreference = "Stop"

param(
    [Parameter(Mandatory = $true)]
    [string]$Title,
    [string]$Author = $env:USERNAME
)

function To-Kebab([string]$value) {
    $lower = $value.ToLowerInvariant()
    $replaced = $lower -replace "[^a-z0-9]+", "-"
    return $replaced.Trim("-")
}

$templatePath = Join-Path $PSScriptRoot "..\\prd\\TEMPLATE.md"
$prdDir = Join-Path $PSScriptRoot "..\\prd"

if (-not (Test-Path $templatePath)) {
    Write-Error "PRD template not found: $templatePath"
    exit 1
}

$slug = To-Kebab $Title
if ([string]::IsNullOrWhiteSpace($slug)) {
    Write-Error "Title must contain alphanumeric characters."
    exit 1
}

$fileName = "$slug-prd.md"
$filePath = Join-Path $prdDir $fileName
if (Test-Path $filePath) {
    Write-Error "PRD already exists: $filePath"
    exit 1
}

$today = (Get-Date).ToString("yyyy-MM-dd")
$content = Get-Content $templatePath -Raw
$content = [regex]::Replace(
    $content,
    "^# \\[기능명\\] PRD$",
    ("# {0} PRD" -f $Title),
    [System.Text.RegularExpressions.RegexOptions]::Multiline
)
$content = $content -replace "YYYY-MM-DD", $today
$content = [regex]::Replace(
    $content,
    "^\\| \\*\\*작성자\\*\\* \\| \\|$",
    ("| **작성자** | {0} |" -f $Author),
    [System.Text.RegularExpressions.RegexOptions]::Multiline
)

Set-Content -Path $filePath -Value $content -Encoding UTF8

$statusPath = Join-Path $PSScriptRoot "..\\prd\\implementation-status.md"
if (Test-Path $statusPath) {
    $statusLines = Get-Content $statusPath
    $newEntry = "- [ ] PRD: [{0}](./{1})" -f $Title, $fileName

    $updated = @()
    $inserted = $false
    foreach ($line in $statusLines) {
        $updated += $line
        if (-not $inserted -and $line -match "^### \\[도메인명\\]") {
            $updated += $newEntry
            $inserted = $true
        }
    }
    if (-not $inserted) {
        $updated += ""
        $updated += "### [도메인명]"
        $updated += $newEntry
    }

    $today = (Get-Date).ToString("yyyy-MM-dd")
    for ($i = 0; $i -lt $updated.Count; $i++) {
        if ($updated[$i] -match "^\\*마지막 업데이트:") {
            $updated[$i] = "*마지막 업데이트: $today*"
        }
    }

    $done = ($updated | Where-Object { $_ -match "^\\- \\[x\\]" }).Count
    $total = ($updated | Where-Object { $_ -match "^\\- \\[[x ]\\]" }).Count
    for ($i = 0; $i -lt $updated.Count; $i++) {
        if ($updated[$i] -match "^\\| \\*\\*전체\\*\\* \\|") {
            $percent = if ($total -gt 0) { [math]::Round(($done / $total) * 100) } else { 0 }
            $updated[$i] = "| **전체** | **$done** | **$total** | **$percent%** |"
        }
    }

    Set-Content -Path $statusPath -Value $updated -Encoding UTF8
}

Write-Host "PRD created: $filePath"
