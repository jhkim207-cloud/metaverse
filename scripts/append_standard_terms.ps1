# standard_terms INSERT를 _insert_all_sample_data_merged_v3.sql에 추가하는 스크립트

$sourceFile = "c:\project\hkgn\db_dic\sql\postgres\hkgn\data\standard_terms_from_excel.sql"
$targetFile = "c:\project\hkgn\db_dic\sql\postgres\hkgn\data\_insert_all_sample_data_merged_v3.sql"

Write-Host "standard_terms INSERT 추가 시작..." -ForegroundColor Green

# 소스 파일에서 INSERT 섹션만 추출 (-- 테이블: standard_terms부터 끝까지)
$sourceContent = Get-Content $sourceFile -Raw -Encoding UTF8
$pattern = '(?s)(-- ============================================\s+-- 테이블: standard_terms.*$)'
if ($sourceContent -match $pattern) {
    $insertSection = "`n" + $matches[1]

    # 대상 파일에 추가
    Add-Content -Path $targetFile -Value $insertSection -Encoding UTF8 -NoNewline

    Write-Host "✓ standard_terms INSERT가 성공적으로 추가되었습니다." -ForegroundColor Green
    Write-Host "  파일: $targetFile" -ForegroundColor Cyan
} else {
    Write-Host "⨯ standard_terms 섹션을 찾을 수 없습니다." -ForegroundColor Red
}
