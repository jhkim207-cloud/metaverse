$ErrorActionPreference = "Stop"

param(
    [Parameter(Mandatory = $true)]
    [string]$Title,
    [string]$Status = "Proposed",
    [string]$Author = $env:USERNAME,
    [string]$Confidence = "Medium"
)

function To-Kebab([string]$value) {
    $lower = $value.ToLowerInvariant()
    $replaced = $lower -replace "[^a-z0-9]+", "-"
    return $replaced.Trim("-")
}

$adrDir = Join-Path $PSScriptRoot "..\\docs\\adr"
$templatePath = Join-Path $adrDir "0000-template.md"

if (-not (Test-Path $templatePath)) {
    Write-Error "ADR template not found: $templatePath"
    exit 1
}

$existing = Get-ChildItem $adrDir -Filter "*.md" | Where-Object { $_.Name -match "^(\\d{4})-" }
$numbers = @()
foreach ($file in $existing) {
    if ($file.Name -match "^(\\d{4})-") {
        $numbers += [int]$matches[1]
    }
}
$nextNumber = 1
if ($numbers.Count -gt 0) {
    $nextNumber = ($numbers | Measure-Object -Maximum).Maximum + 1
}
$numberText = "{0:D4}" -f $nextNumber
$slug = To-Kebab $Title
if ([string]::IsNullOrWhiteSpace($slug)) {
    Write-Error "Title must contain alphanumeric characters."
    exit 1
}

$newFileName = "$numberText-$slug.md"
$newFilePath = Join-Path $adrDir $newFileName
if (Test-Path $newFilePath) {
    Write-Error "ADR already exists: $newFilePath"
    exit 1
}

$today = (Get-Date).ToString("yyyy-MM-dd")
$content = Get-Content $templatePath -Raw
$content = $content -replace "ADR-NNNN: \\[제목\\]", ("ADR-{0}: {1}" -f $numberText, $Title)
$content = [regex]::Replace(
    $content,
    "^\\[Proposed \\| Accepted \\| Deprecated \\| Superseded by ADR-XXXX\\]$",
    $Status,
    [System.Text.RegularExpressions.RegexOptions]::Multiline
)
$content = $content -replace "\\*\\*작성자\\*\\*: \\[이름\\]", ("**작성자**: {0}" -f $Author)
$content = $content -replace "\\*\\*날짜\\*\\*: YYYY-MM-DD", ("**날짜**: {0}" -f $today)
$content = $content -replace "\\*\\*신뢰도\\*\\*: \\[High \\| Medium \\| Low\\]", ("**신뢰도**: {0}" -f $Confidence)

Set-Content -Path $newFilePath -Value $content -Encoding UTF8

$indexPath = Join-Path $adrDir "index.md"
if (Test-Path $indexPath) {
    $indexContent = Get-Content $indexPath
    $newRow = "| [$numberText](./$newFileName) | $Title | $Status | $today |"
    $inserted = $false
    $updated = @()
    foreach ($line in $indexContent) {
        $updated += $line
        if (-not $inserted -and $line -match "^\\| \\[0000\\]\\(\\.\\/0000-template\\.md\\) \\|") {
            $updated += $newRow
            $inserted = $true
        }
    }
    if (-not $inserted) {
        $updated += $newRow
    }
    Set-Content -Path $indexPath -Value $updated -Encoding UTF8
}

Write-Host "ADR created: $newFilePath"
