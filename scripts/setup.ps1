# 프로젝트 초기 설정 스크립트 (Windows PowerShell)

$ErrorActionPreference = "Stop"

Write-Host "=== BizManagement 프로젝트 설정 ===" -ForegroundColor Cyan

# 1. Backend 설정
Write-Host "[1/4] Backend 의존성 설치..." -ForegroundColor Yellow
Set-Location backend
if (Test-Path "mvnw.cmd") {
    & ./mvnw.cmd dependency:resolve -q
    Write-Host "✓ Backend 의존성 설치 완료" -ForegroundColor Green
} else {
    Write-Host "Maven wrapper가 없습니다." -ForegroundColor Red
}
Set-Location ..

# 2. Frontend 설정
Write-Host "[2/4] Frontend 의존성 설치..." -ForegroundColor Yellow
Set-Location frontend
npm install
Write-Host "✓ Frontend 의존성 설치 완료" -ForegroundColor Green
Set-Location ..

# 3. 환경 설정 파일 확인
Write-Host "[3/4] 환경 설정 파일 확인..." -ForegroundColor Yellow
$localYml = "backend/src/main/resources/application-local.yml"
if (-not (Test-Path $localYml)) {
    Write-Host "application-local.yml을 생성하고 DB 정보를 설정하세요." -ForegroundColor Yellow
} else {
    Write-Host "✓ application-local.yml 존재" -ForegroundColor Green
}

# 4. Docker 확인
Write-Host "[4/4] Docker 확인..." -ForegroundColor Yellow
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "✓ Docker 설치됨" -ForegroundColor Green
    Write-Host "  PostgreSQL 시작: cd docker; docker-compose up -d postgres"
} else {
    Write-Host "Docker가 설치되지 않았습니다." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== 설정 완료 ===" -ForegroundColor Green
Write-Host ""
Write-Host "다음 단계:"
Write-Host "1. backend/src/main/resources/application-local.yml에서 DB 정보 설정"
Write-Host "2. docker-compose up -d postgres (또는 외부 DB 사용)"
Write-Host "3. Backend: cd backend; ./mvnw.cmd spring-boot:run -D'spring-boot.run.profiles=local'"
Write-Host "4. Frontend: cd frontend; npm run dev"
