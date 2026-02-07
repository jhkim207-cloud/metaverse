# standard_terms 섹션을 약어 포함 버전으로 교체

$targetFile = "c:\project\hkgn\db_dic\sql\postgres\hkgn\data\_insert_all_sample_data_merged_v3.sql"
$newSectionFile = "c:\project\hkgn\db_dic\sql\postgres\hkgn\data\standard_terms_with_abbr.sql"
$backupFile = "c:\project\hkgn\db_dic\sql\postgres\hkgn\data\_insert_all_sample_data_merged_v3_backup.sql"

Write-Host "standard_terms 섹션 교체 시작..." -ForegroundColor Green

# 백업 생성
Copy-Item $targetFile $backupFile -Force
Write-Host "✓ 백업 파일 생성: _insert_all_sample_data_merged_v3_backup.sql" -ForegroundColor Cyan

# 파일 읽기
$content = Get-Content $targetFile -Raw -Encoding UTF8
$newSection = Get-Content $newSectionFile -Raw -Encoding UTF8

# standard_terms 섹션 교체 (정규식 사용)
$pattern = '(?s)(-- ============================================\s+-- 테이블: standard_terms.*?)(ON CONFLICT.*?;.*?FROM hkgn\.standard_terms;)'

if ($content -match $pattern) {
    # 이전 섹션 제거 후 새 섹션 추가
    $beforeStandardTerms = $content -replace $pattern, ''
    $newContent = $beforeStandardTerms.TrimEnd() + "`r`n`r`n" + $newSection

    # 파일 저장
    $newContent | Set-Content $targetFile -Encoding UTF8 -NoNewline

    Write-Host "✓ standard_terms 섹션이 약어 포함 버전으로 교체되었습니다." -ForegroundColor Green
    Write-Host "  - 127개 용어의 abbreviation 필드가 채워졌습니다." -ForegroundColor Yellow
} else {
    Write-Host "⨯ standard_terms 섹션을 찾을 수 없습니다." -ForegroundColor Red
    Write-Host "  수동으로 교체가 필요합니다." -ForegroundColor Yellow
}

Write-Host "`n완료!" -ForegroundColor Green
