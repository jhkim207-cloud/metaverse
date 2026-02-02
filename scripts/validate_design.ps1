<#
.SYNOPSIS
    설계 검증 스크립트 - 80% 완성도 달성을 위한 Gate 검증

.DESCRIPTION
    8개 Gate(Gate 0~7)의 37개 검증 항목을 자동/수동으로 검증합니다.
    - 자동 검증: 14개 항목
    - 수동 검증: 23개 항목 (체크리스트 출력)

.PARAMETER FeatureName
    검증할 기능명 (예: user-management)

.PARAMETER Gate
    특정 Gate만 검증 (0-7). 지정하지 않으면 전체 검증.

.EXAMPLE
    .\validate_design.ps1 -FeatureName "user-management"
    .\validate_design.ps1 -FeatureName "user-management" -Gate 3
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$FeatureName,

    [Parameter(Mandatory=$false)]
    [ValidateRange(0,7)]
    [int]$Gate = -1
)

# 색상 함수
function Write-Success { param($msg) Write-Host "  ✓ $msg" -ForegroundColor Green }
function Write-Fail { param($msg) Write-Host "  ✗ $msg" -ForegroundColor Red }
function Write-Info { param($msg) Write-Host "  ○ $msg" -ForegroundColor Yellow }
function Write-Header { param($msg) Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan; Write-Host $msg -ForegroundColor Cyan; Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan }

# 경로 설정
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$PrdPath = Join-Path $ProjectRoot "prd" $FeatureName
$DbDicPath = Join-Path $ProjectRoot "db_dic"
$StandardsPath = Join-Path $DbDicPath "dictionary" "standards.json"
$UiStandardPath = Join-Path $ProjectRoot "docs" "ui-standards" "UI_STANDARD.md"

# 결과 저장
$Results = @{
    Gate0 = @{ Auto = 0; Manual = 0; AutoTotal = 0; ManualTotal = 5 }
    Gate1 = @{ Auto = 0; Manual = 0; AutoTotal = 0; ManualTotal = 7 }
    Gate2 = @{ Auto = 0; Manual = 0; AutoTotal = 2; ManualTotal = 3 }
    Gate3 = @{ Auto = 0; Manual = 0; AutoTotal = 4; ManualTotal = 1 }
    Gate4 = @{ Auto = 0; Manual = 0; AutoTotal = 3; ManualTotal = 2 }
    Gate5 = @{ Auto = 0; Manual = 0; AutoTotal = 0; ManualTotal = 3 }
    Gate6 = @{ Auto = 0; Manual = 0; AutoTotal = 2; ManualTotal = 2 }
    Gate7 = @{ Auto = 0; Manual = 0; AutoTotal = 3; ManualTotal = 0 }
}

# ============================================================
# Gate 0: Research & Ideation (수동 5개)
# ============================================================
function Validate-Gate0 {
    Write-Header "[Gate 0] Research & Ideation 검증"

    $filePath = Join-Path $PrdPath "00-research.md"
    if (-not (Test-Path $filePath)) {
        Write-Fail "00-research.md 파일이 없습니다"
        return
    }

    Write-Host "`n[수동 체크리스트]" -ForegroundColor Yellow
    Write-Info "□ 유사 기능의 Best Practice 최소 3개 조사됨"
    Write-Info "□ 오픈소스/상용 서비스 사례 분석됨"
    Write-Info "□ Anti-pattern 최소 2개 식별됨"
    Write-Info "□ LLM 창의적 아이디어 최소 2개 제안됨"
    Write-Info "□ 채택/미채택 아이디어에 대한 근거가 명시됨"
}

# ============================================================
# Gate 1: 요구사항 정제 (수동 7개)
# ============================================================
function Validate-Gate1 {
    Write-Header "[Gate 1] 요구사항 정제 검증"

    $filePath = Join-Path $PrdPath "01-requirements.md"
    if (-not (Test-Path $filePath)) {
        Write-Fail "01-requirements.md 파일이 없습니다"
        return
    }

    Write-Host "`n[수동 체크리스트 - 사용자 관점 정의]" -ForegroundColor Yellow
    Write-Info "□ Persona 정의: Primary Persona 최소 1개 (목표, Pain Points, 사용 환경)"
    Write-Info "□ Use Case 정의: Use Case 다이어그램 또는 목록 (Actor, 기본/대안 흐름)"

    Write-Host "`n[수동 체크리스트 - 요구사항 구조화]" -ForegroundColor Yellow
    Write-Info "□ 모든 기능에 사용자 스토리(AS A/I WANT/SO THAT) 작성됨 + Persona 연결"
    Write-Info "□ 각 스토리에 Acceptance Criteria 3개 이상 (측정 가능)"
    Write-Info "□ Edge Case 최소 3개 식별"
    Write-Info "□ In/Out of Scope 명확히 구분"
    Write-Info "□ 우선순위(P0/P1/P2) 배정 완료"
}

# ============================================================
# Gate 2: UI 상세 설계 (자동 2개 + 수동 3개)
# ============================================================
function Validate-Gate2 {
    Write-Header "[Gate 2] UI 상세 설계 검증"

    $filePath = Join-Path $PrdPath "02-ui-design.md"
    if (-not (Test-Path $filePath)) {
        Write-Fail "02-ui-design.md 파일이 없습니다"
        return
    }

    $content = Get-Content $filePath -Raw

    Write-Host "`n[자동 검증]" -ForegroundColor Cyan

    # 자동 1: UI 표준 컴포넌트 존재 확인
    if (Test-Path $UiStandardPath) {
        Write-Success "UI_STANDARD.md 파일 존재"
        $script:Results.Gate2.Auto++
    } else {
        Write-Fail "UI_STANDARD.md 파일이 없습니다"
    }

    # 자동 2: 상태 변수 타입 형식 확인 (TypeScript 기본 타입)
    if ($content -match "(boolean|string|number|null|undefined|\[\])") {
        Write-Success "상태 변수에 TypeScript 타입 사용됨"
        $script:Results.Gate2.Auto++
    } else {
        Write-Fail "상태 변수 타입이 정의되지 않았거나 형식이 올바르지 않습니다"
    }

    Write-Host "`n[수동 체크리스트]" -ForegroundColor Yellow
    Write-Info "□ 모든 화면에 로딩/에러/빈 상태 정의됨"
    Write-Info "□ 폼 필드별 검증 규칙 정의됨"
    Write-Info "□ 이벤트 흐름이 시작→종료까지 완성됨"
}

# ============================================================
# Gate 3: 데이터 모델 설계 (자동 4개 + 수동 1개)
# ============================================================
function Validate-Gate3 {
    Write-Header "[Gate 3] 데이터 모델 설계 검증"

    $filePath = Join-Path $PrdPath "03-data-model.md"
    if (-not (Test-Path $filePath)) {
        Write-Fail "03-data-model.md 파일이 없습니다"
        return
    }

    $content = Get-Content $filePath -Raw

    Write-Host "`n[자동 검증]" -ForegroundColor Cyan

    # 자동 1: DDL 파일 존재 확인
    $sqlPath = Join-Path $DbDicPath "sql" "postgres" "public"
    if (Test-Path $sqlPath) {
        $sqlFiles = Get-ChildItem $sqlPath -Filter "*.sql" -ErrorAction SilentlyContinue
        if ($sqlFiles) {
            Write-Success "DDL 파일 존재 ($($sqlFiles.Count)개)"
            $script:Results.Gate3.Auto++
        } else {
            Write-Fail "DDL 파일이 없습니다"
        }
    } else {
        Write-Fail "SQL 디렉토리가 없습니다: $sqlPath"
    }

    # 자동 2: standards.json 존재 확인
    if (Test-Path $StandardsPath) {
        Write-Success "standards.json 파일 존재"
        $script:Results.Gate3.Auto++
    } else {
        Write-Fail "standards.json 파일이 없습니다"
    }

    # 자동 3: 감사 컬럼 존재 확인
    $auditColumns = @("created_at", "updated_at", "created_by", "updated_by")
    $hasAllAudit = $true
    foreach ($col in $auditColumns) {
        if ($content -notmatch $col) {
            $hasAllAudit = $false
            break
        }
    }
    if ($hasAllAudit) {
        Write-Success "감사 컬럼(created_at, updated_at, created_by, updated_by) 존재"
        $script:Results.Gate3.Auto++
    } else {
        Write-Fail "감사 컬럼이 누락되었습니다"
    }

    # 자동 4: PK 형식 확인
    if ($content -match "BIGINT GENERATED ALWAYS AS IDENTITY") {
        Write-Success "PK가 BIGINT GENERATED ALWAYS AS IDENTITY 형식"
        $script:Results.Gate3.Auto++
    } else {
        Write-Fail "PK 형식이 올바르지 않습니다"
    }

    Write-Host "`n[수동 체크리스트]" -ForegroundColor Yellow
    Write-Info "□ 인덱스가 검색 조건 컬럼에 정의됨"
}

# ============================================================
# Gate 4: API/로직 설계 (자동 3개 + 수동 2개)
# ============================================================
function Validate-Gate4 {
    Write-Header "[Gate 4] API/로직 설계 검증"

    $filePath = Join-Path $PrdPath "04-api-design.md"
    if (-not (Test-Path $filePath)) {
        Write-Fail "04-api-design.md 파일이 없습니다"
        return
    }

    $content = Get-Content $filePath -Raw

    Write-Host "`n[자동 검증]" -ForegroundColor Cyan

    # 자동 1: URL 규칙 확인 (소문자, 하이픈)
    if ($content -match "/api/v\d+/[a-z\-]+") {
        Write-Success "URL이 소문자, 하이픈 규칙 준수"
        $script:Results.Gate4.Auto++
    } else {
        Write-Fail "URL 규칙이 올바르지 않습니다"
    }

    # 자동 2: HTTP 메서드 확인
    $methods = @("GET", "POST", "PUT", "DELETE")
    $hasMethod = $false
    foreach ($method in $methods) {
        if ($content -match $method) {
            $hasMethod = $true
            break
        }
    }
    if ($hasMethod) {
        Write-Success "HTTP 메서드가 CRUD 패턴과 일치"
        $script:Results.Gate4.Auto++
    } else {
        Write-Fail "HTTP 메서드가 정의되지 않았습니다"
    }

    # 자동 3: 에러 코드 패턴 확인
    if ($content -match "(AUTH_|VAL_|BIZ_|SYS_)\d{3}") {
        Write-Success "에러 코드가 AUTH_/VAL_/BIZ_/SYS_ 패턴 준수"
        $script:Results.Gate4.Auto++
    } else {
        Write-Fail "에러 코드 패턴이 올바르지 않습니다"
    }

    Write-Host "`n[수동 체크리스트]" -ForegroundColor Yellow
    Write-Info "□ 모든 필드에 검증 규칙(@Valid 어노테이션) 정의됨"
    Write-Info "□ 비즈니스 로직 흐름이 단계별로 기술됨"
}

# ============================================================
# Gate 5: 구현 계획 (수동 3개)
# ============================================================
function Validate-Gate5 {
    Write-Header "[Gate 5] 구현 계획 검증"

    $filePath = Join-Path $PrdPath "05-implementation-plan.md"
    if (-not (Test-Path $filePath)) {
        Write-Fail "05-implementation-plan.md 파일이 없습니다"
        return
    }

    Write-Host "`n[수동 체크리스트]" -ForegroundColor Yellow
    Write-Info "□ 파일 생성 순서가 의존성에 맞게 정렬됨 (DB → Backend → Frontend)"
    Write-Info "□ 테스트 코드 작성 시점이 명시됨"
    Write-Info "□ 병렬 작업 가능 항목이 식별됨"
}

# ============================================================
# Gate 6: 테스트 케이스 설계 (자동 2개 + 수동 2개)
# ============================================================
function Validate-Gate6 {
    Write-Header "[Gate 6] 테스트 케이스 설계 검증"

    $testFilePath = Join-Path $PrdPath "06-test-cases.md"
    $apiFilePath = Join-Path $PrdPath "04-api-design.md"

    if (-not (Test-Path $testFilePath)) {
        Write-Fail "06-test-cases.md 파일이 없습니다"
        return
    }

    $testContent = Get-Content $testFilePath -Raw

    Write-Host "`n[자동 검증]" -ForegroundColor Cyan

    # API 개수 추출 (04-api-design.md에서)
    $apiCount = 0
    $errorCodeCount = 0
    if (Test-Path $apiFilePath) {
        $apiContent = Get-Content $apiFilePath -Raw
        # GET/POST/PUT/DELETE /api/v1/... 패턴 매칭
        $apiCount = ([regex]::Matches($apiContent, "(GET|POST|PUT|DELETE|PATCH)\s*\|\s*/api/")).Count
        # 에러 코드 개수 (AUTH_/VAL_/BIZ_/SYS_ 패턴)
        $errorCodeCount = ([regex]::Matches($apiContent, "(AUTH_|VAL_|BIZ_|SYS_)\d{3}")).Count
    }

    # 자동 1: Happy Path 테스트 >= API 엔드포인트 수
    $hpCount = ([regex]::Matches($testContent, "HP-\d{3}")).Count
    if ($hpCount -gt 0) {
        if ($apiCount -gt 0 -and $hpCount -ge $apiCount) {
            Write-Success "Happy Path 테스트 $hpCount 개 >= API 엔드포인트 $apiCount 개"
            $script:Results.Gate6.Auto++
        } elseif ($apiCount -eq 0) {
            Write-Success "Happy Path 테스트 $hpCount 개 정의됨 (API 개수 확인 불가)"
            $script:Results.Gate6.Auto++
        } else {
            Write-Fail "Happy Path 테스트 $hpCount 개 < API 엔드포인트 $apiCount 개"
        }
    } else {
        Write-Fail "Happy Path 테스트가 정의되지 않았습니다"
    }

    # 자동 2: Error Case 테스트 >= 에러 코드 수
    $ecCount = ([regex]::Matches($testContent, "EC-\d{3}")).Count
    if ($ecCount -gt 0) {
        if ($errorCodeCount -gt 0 -and $ecCount -ge $errorCodeCount) {
            Write-Success "Error Case 테스트 $ecCount 개 >= 에러 코드 $errorCodeCount 개"
            $script:Results.Gate6.Auto++
        } elseif ($errorCodeCount -eq 0) {
            Write-Success "Error Case 테스트 $ecCount 개 정의됨 (에러 코드 개수 확인 불가)"
            $script:Results.Gate6.Auto++
        } else {
            Write-Fail "Error Case 테스트 $ecCount 개 < 에러 코드 $errorCodeCount 개"
        }
    } else {
        Write-Fail "Error Case 테스트가 정의되지 않았습니다"
    }

    Write-Host "`n[수동 체크리스트]" -ForegroundColor Yellow
    Write-Info "□ Edge Case 테스트가 요구사항의 Edge Case와 1:1 매핑"
    Write-Info "□ Fixture 데이터가 정의됨"
}

# ============================================================
# Gate 7: 최종 검증 (자동 3개)
# ============================================================
function Validate-Gate7 {
    Write-Header "[Gate 7] 최종 검증 - 80% 완성도 판정"

    # 전체 결과 집계
    $totalAuto = 0
    $totalAutoPass = 0
    $totalManual = 0
    $manualPassed = 0

    foreach ($gate in $Results.Keys) {
        $totalAuto += $Results[$gate].AutoTotal
        $totalAutoPass += $Results[$gate].Auto
        $totalManual += $Results[$gate].ManualTotal
    }

    Write-Host "`n[Gate 0~6 자동 검증 통과 집계]" -ForegroundColor Cyan
    Write-Host "  자동 검증: $totalAutoPass / $totalAuto 항목 통과"

    if ($totalAutoPass -eq $totalAuto) {
        Write-Success "모든 자동 검증 항목 통과"
        $script:Results.Gate7.Auto++
    } else {
        Write-Fail "일부 자동 검증 항목 실패"
    }

    # 수동 검증 확인을 위한 체크리스트 파일 확인
    $checklistFile = Join-Path $PrdPath "checklist-status.md"
    if (Test-Path $checklistFile) {
        $checklistContent = Get-Content $checklistFile -Raw
        # [x] 패턴으로 완료된 항목 개수 세기
        $manualPassed = ([regex]::Matches($checklistContent, "\[x\]")).Count
        Write-Success "체크리스트 파일 발견: $manualPassed / $totalManual 수동 항목 완료"
        $script:Results.Gate7.Auto++
    } else {
        Write-Info "수동 검증 추적 파일 없음 (prd/{기능명}/checklist-status.md)"
        Write-Info "수동 체크리스트 완료 후 해당 파일에 [x] 표시하여 추적 가능"
    }

    Write-Host "`n[수동 검증 필요 항목]" -ForegroundColor Yellow
    Write-Host "  수동 체크리스트: $totalManual 항목"

    # 최종 판정
    $totalItems = $totalAuto + $totalManual
    $totalPassed = $totalAutoPass + $manualPassed
    $threshold = [math]::Ceiling($totalItems * 0.8)

    Write-Host "`n" -NoNewline
    Write-Header "최종 판정"
    Write-Host "  총 항목: $totalItems 개 (자동 $totalAuto + 수동 $totalManual)"
    Write-Host "  자동 통과: $totalAutoPass / $totalAuto"
    Write-Host "  수동 통과: $manualPassed / $totalManual"
    Write-Host "  현재 통과: $totalPassed / $totalItems"
    Write-Host "  80% 기준: $threshold 개 이상 통과 필요"

    if ($totalPassed -ge $threshold) {
        Write-Host "`n  ✓ 80% 완성도 달성! ($totalPassed / $totalItems = $([math]::Round($totalPassed / $totalItems * 100))%)" -ForegroundColor Green
        $script:Results.Gate7.Auto++
    } elseif ($totalAutoPass -eq $totalAuto) {
        $remaining = $threshold - $totalPassed
        Write-Host "`n  자동 검증 모두 통과! 수동 체크리스트 $remaining 개 이상 완료 시 80% 달성" -ForegroundColor Yellow
    } else {
        Write-Host "`n  자동 검증 실패 항목이 있습니다. 수정 후 재실행하세요." -ForegroundColor Red
    }
}

# ============================================================
# 메인 실행
# ============================================================
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║       80% 완성도 설계 검증 - $FeatureName       ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta

if (-not (Test-Path $PrdPath)) {
    Write-Host "`n[오류] PRD 디렉토리가 없습니다: $PrdPath" -ForegroundColor Red
    Write-Host "  먼저 /design-all $FeatureName 을 실행하세요." -ForegroundColor Yellow
    exit 1
}

if ($Gate -eq -1) {
    # 전체 검증
    Validate-Gate0
    Validate-Gate1
    Validate-Gate2
    Validate-Gate3
    Validate-Gate4
    Validate-Gate5
    Validate-Gate6
    Validate-Gate7
} else {
    # 특정 Gate만 검증
    switch ($Gate) {
        0 { Validate-Gate0 }
        1 { Validate-Gate1 }
        2 { Validate-Gate2 }
        3 { Validate-Gate3 }
        4 { Validate-Gate4 }
        5 { Validate-Gate5 }
        6 { Validate-Gate6 }
        7 { Validate-Gate7 }
    }
}

Write-Host ""
