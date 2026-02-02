$ErrorActionPreference = "Stop"

param(
    [string]$PrBody = $env:PR_BODY,
    [string]$BaseRef = $env:BASE_REF
)

Write-Host "=================================="
Write-Host "  TRACEABILITY CHECK (PRD/ADR/TEST)"
Write-Host "=================================="

if ([string]::IsNullOrWhiteSpace($PrBody)) {
    Write-Error "PR_BODY is missing. This script should run in PR context."
    exit 1
}

if ([string]::IsNullOrWhiteSpace($BaseRef)) {
    Write-Error "BASE_REF is missing. Set BASE_REF to the PR base branch."
    exit 1
}

function Get-FieldValue([string]$body, [string]$fieldName) {
    $regex = "(?im)^\s*$fieldName\s*:\s*(.+?)\s*$"
    $match = [regex]::Match($body, $regex)
    if ($match.Success) {
        return $match.Groups[1].Value.Trim()
    }
    return $null
}

function Is-NA([string]$value) {
    if ($null -eq $value) { return $true }
    $normalized = $value.Trim().ToLowerInvariant()
    return $normalized -in @("n/a", "na", "none", "-")
}

function Any-Match([string[]]$files, [string[]]$patterns) {
    foreach ($file in $files) {
        foreach ($pattern in $patterns) {
            if ($file -match $pattern) { return $true }
        }
    }
    return $false
}

Write-Host "Fetching base branch origin/$BaseRef ..."
git fetch origin $BaseRef --depth=1 | Out-Host

$changedFiles = git diff --name-only ("origin/{0}...HEAD" -f $BaseRef)
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to compute diff against origin/$BaseRef."
    exit 1
}

if (-not $changedFiles) {
    Write-Host "No changed files detected. Skipping traceability checks."
    exit 0
}

$prdValue = Get-FieldValue -body $PrBody -fieldName "PRD"
$adrValue = Get-FieldValue -body $PrBody -fieldName "ADR"
$testsValue = Get-FieldValue -body $PrBody -fieldName "Tests"

$missingFields = @()
if (-not $prdValue) { $missingFields += "PRD" }
if (-not $adrValue) { $missingFields += "ADR" }
if (-not $testsValue) { $missingFields += "Tests" }

if ($missingFields.Count -gt 0) {
    Write-Error ("Missing required fields in PR body: {0}" -f ($missingFields -join ", "))
    exit 1
}

$prdRequiredPatterns = @(
    "^(backend/src/|frontend/src/|e2e/|db_dic/|docker/|assets/)",
    "^backend/pom\.xml$",
    "^frontend/package\.json$",
    "^frontend/package-lock\.json$"
)

$adrRequiredPatterns = @(
    "^docs/adr/",
    "^backend/pom\.xml$",
    "^frontend/package\.json$",
    "^frontend/package-lock\.json$",
    "^backend/src/main/resources/application.*\.yml$",
    "^docker/",
    "^docs/api-standards/"
)

$testsRequiredPatterns = @(
    "^(backend/src/|frontend/src/|e2e/)",
    "^backend/src/test/",
    "^frontend/src/"
)

$needsPrd = Any-Match -files $changedFiles -patterns $prdRequiredPatterns
$needsAdr = Any-Match -files $changedFiles -patterns $adrRequiredPatterns
$needsTests = Any-Match -files $changedFiles -patterns $testsRequiredPatterns

$errors = @()
if ($needsPrd -and (Is-NA $prdValue)) {
    $errors += "PRD is N/A but changes indicate a PRD should exist."
}
if ($needsAdr -and (Is-NA $adrValue)) {
    $errors += "ADR is N/A but changes indicate an ADR should exist."
}
if ($needsTests -and (Is-NA $testsValue)) {
    $errors += "Tests is N/A but changes indicate tests evidence should exist."
}

if ($errors.Count -gt 0) {
    foreach ($err in $errors) { Write-Error $err }
    exit 1
}

Write-Host "Traceability checks passed."
