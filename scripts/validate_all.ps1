$ErrorActionPreference = "Stop"

Write-Host "=================================="
Write-Host "  AGENT AUTOMATION: VALIDATE ALL  "
Write-Host "=================================="
Write-Host ""

# ----------------------------
# 0. Traceability Check (Optional)
# ----------------------------
Write-Host "[0/3] Checking Traceability (PRD/ADR/Tests)..."
$traceabilityScript = Join-Path $PSScriptRoot "check_traceability.ps1"
if ((Test-Path $traceabilityScript) -and $env:PR_BODY -and $env:BASE_REF) {
    try {
        & $traceabilityScript -PrBody $env:PR_BODY -BaseRef $env:BASE_REF
        if ($LASTEXITCODE -ne 0) { throw "Traceability Check Failed" }
    }
    catch {
        Write-Error $_
        exit 1
    }
}
else {
    Write-Host "  > Skipped (PR_BODY/BASE_REF not set)"
}
Write-Host ""

# ----------------------------
# 1. Frontend Validation
# ----------------------------
Write-Host "[1/3] Validating Frontend..."
Push-Location "$PSScriptRoot/../frontend"

try {
    Write-Host "  > Type Checking..."
    npm run typecheck
    if ($LASTEXITCODE -ne 0) { throw "Frontend Typecheck Failed" }

    Write-Host "  > Linting..."
    npm run lint
    if ($LASTEXITCODE -ne 0) { throw "Frontend Lint Failed" }

    Write-Host "  > Testing..."
    npm run test:run
    if ($LASTEXITCODE -ne 0) { throw "Frontend Tests Failed" }

    Write-Host "  > Building..."
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Frontend Build Failed" }
}
catch {
    Write-Error $_
    Pop-Location
    exit 1
}
Pop-Location
Write-Host "Frontend ✅ OK"
Write-Host ""

# ----------------------------
# 2. Backend Validation
# ----------------------------
Write-Host "[2/3] Validating Backend..."
Push-Location "$PSScriptRoot/../backend"

try {
    Write-Host "  > Building & Testing (Maven)..."
    ./mvnw.cmd clean package -DskipTests=false
    if ($LASTEXITCODE -ne 0) { throw "Backend Build/Test Failed" }
}
catch {
    Write-Error $_
    Pop-Location
    exit 1
}
Pop-Location
Write-Host "Backend ✅ OK"
Write-Host ""

Write-Host "🎉 ALL VALIDATION CHECKS PASSED!"
