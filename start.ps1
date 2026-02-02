param(
    [Parameter(Position=0)]
    [ValidateSet("all", "backend", "frontend")]
    [string]$Mode = "all"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================"
Write-Host "  BizManagement - Development Server"
Write-Host "========================================"
Write-Host ""

$projectRoot = $PSScriptRoot

function Start-Backend {
    Write-Host "Starting backend..." -ForegroundColor Cyan
    $backendPath = Join-Path $projectRoot "backend"
    Set-Location $backendPath
    & ./mvnw.cmd spring-boot:run
}

function Start-Frontend {
    Write-Host "Starting frontend..." -ForegroundColor Cyan
    $frontendPath = Join-Path $projectRoot "frontend"
    Set-Location $frontendPath
    npm install
    npm run dev
}

switch ($Mode) {
    "all" {
        Write-Host "Starting both backend and frontend..." -ForegroundColor Green

        # Start backend in new window
        $backendPath = Join-Path $projectRoot "backend"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; ./mvnw.cmd spring-boot:run" -WindowStyle Normal

        # Wait for backend to start
        Start-Sleep -Seconds 5

        # Start frontend in new window
        $frontendPath = Join-Path $projectRoot "frontend"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; npm install; npm run dev" -WindowStyle Normal

        Write-Host ""
        Write-Host "Backend: http://localhost:8083" -ForegroundColor Yellow
        Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
    }
    "backend" {
        Start-Backend
    }
    "frontend" {
        Start-Frontend
    }
}
