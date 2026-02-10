-- ============================================
-- 수주 마이그레이션 데이터 INSERT (2024년 샘플 10건)
-- ============================================
-- 출처: ref/수주마이그2024.xlsx
-- 생성일시: 2026-02-09
-- 설명: 2024-07~09 수주 데이터 10건 (거래처 10곳, 상세 57라인)
-- ============================================

-- ============================================
-- STEP 1: 수주 헤더 INSERT (10건)
-- ============================================
INSERT INTO hkgn.sales_order_header (
    order_no, order_date, delivery_date, customer_cd,
    order_type, order_kind, site_cd, site_nm,
    total_amount, tax_separate, remarks,
    order_status
)
SELECT
    v.order_no,
    v.order_date,
    v.delivery_date,
    COALESCE(bp.bp_cd, v.customer_nm) AS customer_cd,
    v.order_type,
    v.order_kind,
    v.site_cd,
    v.site_nm,
    v.total_amount,
    v.tax_separate,
    v.remarks,
    v.order_status
FROM (VALUES
    ('24-1892', '2024-07-02'::DATE, NULL::DATE, '디엘이앤씨(주)',       '완제품', 'P', NULL, '판교G2업무시설 1공구',       0, FALSE, NULL, 'COMPLETED'),
    ('24-1917', '2024-07-04'::DATE, NULL::DATE, '현대엔지니어링(주)',    '완제품', 'P', NULL, '시흥장현지구 업무시설',      0, FALSE, NULL, 'COMPLETED'),
    ('24-1923', '2024-07-05'::DATE, NULL::DATE, '중흥토건',             '완제품', 'P', NULL, '수원제115-10구역',          0, FALSE, NULL, 'COMPLETED'),
    ('24-1944', '2024-07-08'::DATE, NULL::DATE, '(주)태영건설',         '완제품', 'P', NULL, '마곡지구CP4(SITE1)',        0, FALSE, NULL, 'COMPLETED'),
    ('24-1956', '2024-07-09'::DATE, NULL::DATE, '(주)포스코이앤씨',     '완제품', 'P', NULL, '천호4구역',                 0, FALSE, NULL, 'COMPLETED'),
    ('24-2110', '2024-07-19'::DATE, NULL::DATE, '(주)한양',             '완제품', 'P', NULL, '남양주 도곡2 주택재개발',    0, FALSE, NULL, 'COMPLETED'),
    ('24-2368', '2024-08-13'::DATE, NULL::DATE, '제일하우징',           '완제품', 'P', NULL, '세종건설 평택',             4833662, FALSE, NULL, 'COMPLETED'),
    ('24-2395', '2024-08-19'::DATE, NULL::DATE, '대우건설',             '완제품', 'P', NULL, '경서북청라',                0, FALSE, NULL, 'COMPLETED'),
    ('24-2419', '2024-08-23'::DATE, NULL::DATE, '(주)대원',             '완제품', 'P', NULL, '오산세교아파트',             0, FALSE, NULL, 'COMPLETED'),
    ('24-2571', '2024-09-05'::DATE, NULL::DATE, 'LX하우시스',           '완제품', 'P', NULL, '음성자이 센트럴시티',        0, FALSE, NULL, 'COMPLETED')
) AS v(order_no, order_date, delivery_date, customer_nm, order_type, order_kind, site_cd, site_nm, total_amount, tax_separate, remarks, order_status)
LEFT JOIN hkgn.business_partner bp ON bp.bp_nm = v.customer_nm;

-- ============================================
-- STEP 2: 수주 상세 INSERT (57라인)
-- ============================================
INSERT INTO hkgn.sales_order_detail (
    order_header_id, order_no, line_seq,
    material_cd, material_nm, product_category,
    width, height, thickness, unit_type,
    quantity, area, unit, unit_price, amount,
    remarks,
    production_status, delivery_status
)
SELECT
    h.id AS order_header_id,
    v.order_no,
    v.line_seq,
    im.material_cd,
    v.material_nm,
    v.product_category,
    v.width,
    v.height,
    v.thickness,
    v.unit_type,
    v.quantity,
    v.area,
    v.unit,
    v.unit_price,
    v.amount,
    v.remarks,
    'COMPLETED' AS production_status,
    'DELIVERED' AS delivery_status
FROM (VALUES
    -- 24-1892: 디엘이앤씨(주) - 판교G2업무시설 1공구 (5라인)
    ('24-1892', 1, '5SkinCoat40mm#2(HS)+5MCT148(HS)+5EHD176', 'P', 1390, 850, 39, 'mm', 7, 8.27, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'B동8층B-16-스킨코트40mm, 배연창TPS,아르곤,982,엣지'),
    ('24-1892', 2, '5SkinCoat40mm#2(HS)+5MCT148(HS)+5EHD176', 'P', 1390, 530, 39, 'mm', 4, 2.95, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'B동8층B-13-스킨코트40mm, PJTPS,아르곤,982,엣지'),
    ('24-1892', 3, '5SkinCoat40mm#2(HS)+5MCT148(HS)+5EHD176', 'P', 1390, 530, 39, 'mm', 8, 5.90, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'B동8층B-14-스킨코트40mm, PJTPS,아르곤,982,엣지'),
    ('24-1892', 4, '5SkinCoat40mm#2(HS)+5MCT148(HS)+5EHD176', 'P', 1390, 530, 39, 'mm', 6, 4.42, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'B동8층B-15-스킨코트40mm, PJTPS,아르곤,982,엣지'),
    ('24-1892', 5, '5SkinCoat40mm#2(HS)+5MCT148(HS)+5EHD176', 'P', 1390, 530, 39, 'mm', 5, 3.69, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'B동8층B-16-스킨코트40mm, PJTPS,아르곤,982,엣지'),

    -- 24-1917: 현대엔지니어링(주) - 시흥장현지구 업무시설 (3라인)
    ('24-1917', 1, '5CL(HS)+14TPS+5CL(HS)', 'P', 1170, 1150, 24, 'mm', 1, 1.35, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'pmu2차-AL업체오시공 .TPS,982'),
    ('24-1917', 2, '5CL(HS)+14TPS+5CL(HS)', 'P', 1290, 705, 24, 'mm', 1, 0.91, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'pmu2차-AL업체오시공 .TPS,982'),
    ('24-1917', 3, '5CL(HS)+14TPS+5CL(HS)', 'P', 1220, 705, 24, 'mm', 1, 0.86, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'pmu2차-AL업체오시공 .TPS,982'),

    -- 24-1923: 중흥토건 - 수원제115-10구역 (5라인)
    ('24-1923', 1, '8.76(5GN+0.76+3CL)+12A+5LE', 'P', 2020, 1975, 25.76, 'mm', 1, 3.99, 'M2', NULL::NUMERIC, NULL::NUMERIC, '126동106-거실외창대판'),
    ('24-1923', 2, '8.76(5GN+0.76+3CL)+12A+5LE', 'P', 742, 1975, 25.76, 'mm', 1, 1.47, 'M2', NULL::NUMERIC, NULL::NUMERIC, '126동106-침실1픽스'),
    ('24-1923', 3, '8.76(5GN+0.76+3CL)+12A+5LE', 'P', 742, 1975, 25.76, 'mm', 1, 1.47, 'M2', NULL::NUMERIC, NULL::NUMERIC, '126동106-발코니1픽스'),
    ('24-1923', 4, '8.76(5GN+0.76+3CL)+12A+5LE', 'P', 742, 1325, 25.76, 'mm', 1, 0.98, 'M2', NULL::NUMERIC, NULL::NUMERIC, '126동106-침실2픽스'),
    ('24-1923', 5, '8.76(5GN+0.76+3CL)+12A+5LE', 'P', 592, 1325, 25.76, 'mm', 1, 0.79, 'M2', NULL::NUMERIC, NULL::NUMERIC, '126동106-침실3픽스'),

    -- 24-1944: (주)태영건설 - 마곡지구CP4(SITE1) (4라인)
    ('24-1944', 1, '5ECT145(HS)+14AR(단열)+5CL(HS)', 'P', 1882, 1922, 24, 'mm', 1, 3.62, 'M2', NULL::NUMERIC, NULL::NUMERIC, '열관류율시험체(1번)-직접외기.FIX AR.단열eno,아르곤,982,엣지'),
    ('24-1944', 2, '6저철분(HS)+12AR(단열)+6ECT173(HS)', 'P', 1825, 1922, 24, 'mm', 1, 3.51, 'M2', NULL::NUMERIC, NULL::NUMERIC, '열관류율시험체(3번)-직접외기.FIX AR.단열eno,아르곤,982,엣지'),
    ('24-1944', 3, '6ECT145(HS)+12AR(단열)+6CL(HS)', 'P', 1882, 955, 24, 'mm', 1, 1.80, 'M2', NULL::NUMERIC, NULL::NUMERIC, '열관류율시험체(2번)-직접외기.FIX AR.단열eno,아르곤,982,엣지'),
    ('24-1944', 4, '6ECT145(HS)+12AR(단열)+6CL(HS)', 'P', 1835, 905, 24, 'mm', 1, 1.66, 'M2', NULL::NUMERIC, NULL::NUMERIC, '열관류율시험체2번PJ-직접외기.환기창 AR.단열eno,아르곤,982,엣지'),

    -- 24-1956: (주)포스코이앤씨 - 천호4구역 (8라인)
    ('24-1956', 1, '5CL(HS)+12A+5CL', 'P', 598, 1857, 22, 'mm', 8, 8.89, 'M2', NULL::NUMERIC, NULL::NUMERIC, '2동-4차17~20층7호-59A조합 발코니1외창'),
    ('24-1956', 2, '5CL(HS)+12A+5CL', 'P', 265, 995, 22, 'mm', 8, 2.24, 'M2', NULL::NUMERIC, NULL::NUMERIC, '2동-4차17~20층7호-59A조합 대피공간외창'),
    ('24-1956', 3, '5CL(HS)+12A+5LE', 'P', 608, 915, 22, 'mm', 8, 4.46, 'M2', NULL::NUMERIC, NULL::NUMERIC, '2동-4차17~20층7호-59A조합 침실2외창'),
    ('24-1956', 4, '5CL(HS)+12A+5LE', 'P', 608, 915, 22, 'mm', 8, 4.46, 'M2', NULL::NUMERIC, NULL::NUMERIC, '2동-4차17~20층7호-59A조합 침실3외창'),
    ('24-1956', 5, '5CL(HS)+12A+5LE', 'P', 308, 520, 22, 'mm', 8, 2.24, 'M2', NULL::NUMERIC, NULL::NUMERIC, '2동-4차17~20층7호-59A조합 다용도실외창'),
    ('24-1956', 6, '5CL+12A+5LE', 'P', 608, 915, 22, 'mm', 8, 4.46, 'M2', NULL::NUMERIC, NULL::NUMERIC, '2동-4차17~20층7호-59A조합 침실2내창'),
    ('24-1956', 7, '5CL+12A+5LE', 'P', 608, 915, 22, 'mm', 8, 4.46, 'M2', NULL::NUMERIC, NULL::NUMERIC, '2동-4차17~20층7호-59A조합 침실3내창'),
    ('24-1956', 8, '5CL+12A+5LE', 'P', 308, 520, 22, 'mm', 8, 2.24, 'M2', NULL::NUMERIC, NULL::NUMERIC, '2동-4차17~20층7호-59A조합 다용도실내창'),

    -- 24-2110: (주)한양 - 남양주 도곡2 주택재개발 (4라인)
    ('24-2110', 1, '5CL+12A+5CL', 'P', 1430, 1656, 22, 'mm', 1, 2.37, 'M2', NULL::NUMERIC, NULL::NUMERIC, '어린이집 보육실3-'),
    ('24-2110', 2, '5CL+12A+5CL', 'P', 749, 1656, 22, 'mm', 2, 2.48, 'M2', NULL::NUMERIC, NULL::NUMERIC, '어린이집 보육실3-'),
    ('24-2110', 3, '5GN+12A+5CL', 'P', 1430, 1656, 22, 'mm', 1, 2.37, 'M2', NULL::NUMERIC, NULL::NUMERIC, '어린이집 보육실3-'),
    ('24-2110', 4, '5GN+12A+5CL', 'P', 749, 1656, 22, 'mm', 2, 2.48, 'M2', NULL::NUMERIC, NULL::NUMERIC, '어린이집 보육실3-'),

    -- 24-2368: 제일하우징 - 세종건설 평택 (7라인)
    ('24-2368', 1, '5CL+12A+5SP2.0', 'P', 1389, 1867, 22, 'mm', 26, 67.44, 'M2', 10347::NUMERIC, 697843::NUMERIC, '103-2-카자리'),
    ('24-2368', 2, '5CL+12A+5SP2.0', 'P', 1389, 1867, 22, 'mm', 26, 67.44, 'M2', 10347::NUMERIC, 697843::NUMERIC, '103-2-카자리'),
    ('24-2368', 3, '5CL+12A+5SP2.0', 'P', 753, 1867, 22, 'mm', 50, 70.30, 'M2', 10347::NUMERIC, 727394::NUMERIC, '102-4-카자리'),
    ('24-2368', 4, '5CL+12A+5SP2.0', 'P', 753, 1867, 22, 'mm', 50, 70.30, 'M2', 10347::NUMERIC, 727394::NUMERIC, '101-3-카자리'),
    ('24-2368', 5, '5CL+12A+5SP2.0', 'P', 753, 1867, 22, 'mm', 50, 70.30, 'M2', 10347::NUMERIC, 727394::NUMERIC, '102-4-카자리'),
    ('24-2368', 6, '5CL+12A+5SP2.0', 'P', 625, 1867, 22, 'mm', 52, 60.68, 'M2', 10347::NUMERIC, 627897::NUMERIC, '103-2-카자리'),
    ('24-2368', 7, '5CL+12A+5SP2.0', 'P', 625, 1867, 22, 'mm', 52, 60.68, 'M2', 10347::NUMERIC, 627897::NUMERIC, '103-2-카자리'),

    -- 24-2395: 대우건설 - 경서북청라 (6라인)
    ('24-2395', 1, '5CL+12A+5LE', 'P', 1515, 1700, 22, 'mm', 3, 7.73, 'M2', NULL::NUMERIC, NULL::NUMERIC, '1동21층피난층-'),
    ('24-2395', 2, '5CL+12A+5LE', 'P', 1515, 1700, 22, 'mm', 3, 7.73, 'M2', NULL::NUMERIC, NULL::NUMERIC, '2동21층피난층-'),
    ('24-2395', 3, '5CL+12A+5LE', 'P', 1515, 1700, 22, 'mm', 3, 7.73, 'M2', NULL::NUMERIC, NULL::NUMERIC, '3동21층피난층-'),
    ('24-2395', 4, '5CL+12A+5LE', 'P', 1515, 1700, 22, 'mm', 3, 7.73, 'M2', NULL::NUMERIC, NULL::NUMERIC, '4동21층피난층-'),
    ('24-2395', 5, '5CL+12A+5LE', 'P', 1515, 1700, 22, 'mm', 3, 7.73, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5동21층피난층-'),
    ('24-2395', 6, '5CL+12A+5LE', 'P', 1515, 1700, 22, 'mm', 2, 5.15, 'M2', NULL::NUMERIC, NULL::NUMERIC, '6동21층피난층-'),

    -- 24-2419: (주)대원 - 오산세교아파트 (8라인)
    ('24-2419', 1, '5CL+12TPS+5LE', 'P', 1730, 1768, 22, 'mm', 1, 3.06, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5동.4-최상층-거실대판(내) 파손및누락분TPS'),
    ('24-2419', 2, '5CL+12TPS+5LE', 'P', 760, 1768, 22, 'mm', 1, 1.34, 'M2', NULL::NUMERIC, NULL::NUMERIC, '7동.4-최상층-거실날개(내) 파손및누락분TPS'),
    ('24-2419', 3, '5GN+12TPS+5LE', 'P', 1730, 1768, 22, 'mm', 4, 12.24, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5동.4-최상층-거실대판(외) 파손및누락분TPS'),
    ('24-2419', 4, '5GN+12TPS+5LE', 'P', 1720, 1738, 22, 'mm', 1, 2.99, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5동.1-3층-거실대판(외) 파손및누락분TPS'),
    ('24-2419', 5, '5GN+12TPS+5LE', 'P', 1720, 1738, 22, 'mm', 1, 2.99, 'M2', NULL::NUMERIC, NULL::NUMERIC, '6동.1-3층-거실대판(내) 파손및누락분TPS'),
    ('24-2419', 6, '5GN+12TPS+5LE', 'P', 760, 1768, 22, 'mm', 2, 2.69, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5동.4-최상층-거실날개(외) 파손및누락분TPS'),
    ('24-2419', 7, '5GN+12TPS+5LE', 'P', 455, 166, 22, 'mm', 36, 10.08, 'M2', NULL::NUMERIC, NULL::NUMERIC, '7동.4-최상층-주방(외) 파손및누락분TPS'),
    ('24-2419', 8, '5GN+12TPS+5LE', 'P', 450, 136, 22, 'mm', 2, 0.56, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5동.1-3층-주방(내) 파손및누락분TPS'),

    -- 24-2571: LX하우시스 - 음성자이 센트럴시티 (7라인)
    ('24-2571', 1, '5CL+12TPS+5SP2.0', 'P', 1598, 2185, 22, 'mm', 3, 10.48, 'M2', NULL::NUMERIC, NULL::NUMERIC, '3동1층84T-거실내창이중창 .TPS'),
    ('24-2571', 2, '5CL+12TPS+5SP2.0', 'P', 797, 2185, 22, 'mm', 6, 10.45, 'M2', NULL::NUMERIC, NULL::NUMERIC, '3동1층84T-거실내창이중창 .TPS'),
    ('24-2571', 3, '5CL+12TPS+5SP2.0', 'P', 630, 1125, 22, 'mm', 6, 4.25, 'M2', NULL::NUMERIC, NULL::NUMERIC, '3동1층84T-침실2내창이중창 .TPS'),
    ('24-2571', 4, '5CL+12TPS+5SP2.0', 'P', 630, 1125, 22, 'mm', 6, 4.25, 'M2', NULL::NUMERIC, NULL::NUMERIC, '3동1층84T-침실3내창이중창 .TPS'),
    ('24-2571', 5, '5CL+12TPS+5SP2.0', 'P', 280, 1125, 22, 'mm', 6, 1.89, 'M2', NULL::NUMERIC, NULL::NUMERIC, '3동1층84T-침실1내창이중창 .TPS'),
    ('24-2571', 6, '5CL+12TPS+5SP2.0', 'P', 280, 1125, 22, 'mm', 6, 1.89, 'M2', NULL::NUMERIC, NULL::NUMERIC, '3동1층84T-드레스룸내창이중창 .TPS'),
    ('24-2571', 7, '5CL+12TPS+5SP2.0', 'P', 430, 925, 22, 'mm', 6, 2.39, 'M2', NULL::NUMERIC, NULL::NUMERIC, '3동1층84T-주방내창이중창 .TPS')
) AS v(order_no, line_seq, material_nm, product_category, width, height, thickness, unit_type, quantity, area, unit, unit_price, amount, remarks)
JOIN hkgn.sales_order_header h ON h.order_no = v.order_no
LEFT JOIN hkgn.item_master im ON im.material_nm = v.material_nm;

-- ============================================
-- STEP 3: 총액 업데이트 (상세 금액 합산)
-- ============================================
UPDATE hkgn.sales_order_header h
SET total_amount = (
    SELECT COALESCE(SUM(amount), 0)
    FROM hkgn.sales_order_detail d
    WHERE d.order_header_id = h.id
)
WHERE h.order_no IN ('24-1892','24-1917','24-1923','24-1944','24-1956','24-2110','24-2368','24-2395','24-2419','24-2571')
  AND (SELECT COALESCE(SUM(amount), 0) FROM hkgn.sales_order_detail d WHERE d.order_header_id = h.id) > 0;

-- 완료 메시지
SELECT
    '수주 헤더 ' || COUNT(DISTINCT h.id) || '건, ' ||
    '수주 상세 ' || COUNT(d.id) || '건 INSERT 완료' AS result
FROM hkgn.sales_order_header h
LEFT JOIN hkgn.sales_order_detail d ON d.order_header_id = h.id
WHERE h.order_no IN ('24-1892','24-1917','24-1923','24-1944','24-1956','24-2110','24-2368','24-2395','24-2419','24-2571');
