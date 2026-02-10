-- ============================================
-- 수주 마이그레이션 데이터 INSERT (2025년 1~4월 샘플)
-- ============================================
-- 출처: ref/수주마이그20251.xlsx
-- 생성일시: 2026-02-09
-- 설명: 2025-01~04 수주 데이터 15건 (거래처 15곳, 상세 90라인)
-- ============================================

-- ============================================
-- STEP 1: 수주 헤더 INSERT (15건)
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
    -- 25-0002: 현대엔지니어링(주) - 시흥장현지구 업무시설 (8라인)
    ('25-0002', '2025-01-02'::DATE, NULL::DATE, '현대엔지니어링(주)', '완제품', 'P', NULL, '시흥장현지구 업무시설', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-0018: 대우건설 - 평택포승지식산업센터 (9라인)
    ('25-0018', '2025-01-02'::DATE, NULL::DATE, '대우건설', '완제품', 'P', NULL, '평택포승지식산업센터', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-0031: 주식회사 케이씨씨글라스 여주공장 - (없음) (4라인)
    ('25-0031', '2025-01-06'::DATE, NULL::DATE, '주식회사 케이씨씨글라스 여주공장', '완제품', 'FL', NULL, NULL, 612565, FALSE, NULL, 'COMPLETED'),
    -- 25-0042: PL창호 - (없음) (4라인)
    ('25-0042', '2025-01-06'::DATE, NULL::DATE, 'PL창호', '완제품', 'P', NULL, NULL, 0, FALSE, NULL, 'COMPLETED'),
    -- 25-0053: 디엘이앤씨(주) - 판교G2업무시설 1공구 (9라인)
    ('25-0053', '2025-01-06'::DATE, NULL::DATE, '디엘이앤씨(주)', '하자분', '생산하자분', NULL, '판교G2업무시설 1공구', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-0156: 주식회사 폴딩엠텍 - (없음) (3라인)
    ('25-0156', '2025-01-09'::DATE, NULL::DATE, '주식회사 폴딩엠텍', '완제품', 'P', NULL, NULL, 1642270, FALSE, NULL, 'COMPLETED'),
    -- 25-0183: 중흥토건 - 천호1지구 (5라인)
    ('25-0183', '2025-01-14'::DATE, NULL::DATE, '중흥토건', '하자분', '시공하자분', NULL, '천호1지구', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-0357: (주)한양 - 남양주 도곡2 주택재개발 (4라인)
    ('25-0357', '2025-02-05'::DATE, NULL::DATE, '(주)한양', '완제품', 'FL', NULL, '남양주 도곡2 주택재개발', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-0383: (주)포스코이앤씨 - 천호4구역 (4라인)
    ('25-0383', '2025-02-10'::DATE, NULL::DATE, '(주)포스코이앤씨', '하자분', '생산하자분', NULL, '천호4구역', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-0536: (주)서해종합건설 - 병점역 스카이팰리스 (4라인)
    ('25-0536', '2025-02-18'::DATE, NULL::DATE, '(주)서해종합건설', '완제품', 'P', NULL, '병점역 스카이팰리스', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-0550: 디엘건설(주) - 대전역 센텀비스타 (3라인)
    ('25-0550', '2025-02-18'::DATE, NULL::DATE, '디엘건설(주)', '완제품', 'P', NULL, '대전역 센텀비스타', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-0579: 동부건설 - 대전기초과학연구원 (9라인)
    ('25-0579', '2025-02-21'::DATE, NULL::DATE, '동부건설', '완제품', 'P', NULL, '대전기초과학연구원', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-0615: (주)KCC건설 - 안성 방초2지구 물류센터 (6라인)
    ('25-0615', '2025-02-25'::DATE, NULL::DATE, '(주)KCC건설', '완제품', 'P', NULL, '안성 방초2지구 물류센터', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-0674: LX하우시스 - 음성자이 센트럴시티 (8라인)
    ('25-0674', '2025-03-05'::DATE, NULL::DATE, 'LX하우시스', '완제품', 'P', NULL, '음성자이 센트럴시티', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-0716: (주)동일토건 - 청주 개신2지구 (10라인)
    ('25-0716', '2025-03-11'::DATE, NULL::DATE, '(주)동일토건', '완제품', 'P', NULL, '청주 개신2지구', 0, FALSE, NULL, 'COMPLETED')
) AS v(order_no, order_date, delivery_date, customer_nm, order_type, order_kind, site_cd, site_nm, total_amount, tax_separate, remarks, order_status)
LEFT JOIN hkgn.business_partner bp ON bp.bp_nm = v.customer_nm;

-- ============================================
-- STEP 2: 수주 상세 INSERT (90라인)
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
    -- 25-0002: 현대엔지니어링(주) - 시흥장현지구 업무시설 (8라인)
    ('25-0002', 1, '5SKG149T(HS)+14A(단열)+5CL(HS)', 'P', 1042, 1250, 24, 'mm', 4, 5.21, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5-3차5F그레이존-2코어정배면 ICAW2-05.9A써믹스단열,982,엣지'),
    ('25-0002', 2, '5SKG149T(HS)+14A(단열)+5CL(HS)', 'P', 1185, 1245, 24, 'mm', 2, 2.95, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5-3차5F그레이존-2코어우측 ICAW2-01써믹스단열,982,엣지'),
    ('25-0002', 3, '5SKG149T(HS)+14A(단열)+5CL(HS)', 'P', 1085, 1245, 24, 'mm', 2, 2.7, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5-3차5F그레이존-2코어정,배면 IAW2-07써믹스단열,982,엣지'),
    ('25-0002', 4, '5SKG149T(HS)+14A(단열)+5CL(HS)', 'P', 1185, 795, 24, 'mm', 2, 1.89, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5-3차5F그레이존-2코어우측 ICAW2-01써믹스단열,982,엣지'),
    ('25-0002', 5, '5SKG149T(HS)+14A(단열)+5CL(HS)', 'P', 1122, 790, 24, 'mm', 4, 3.55, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5-3차5F그레이존-2코어좌우측 IAW2-06A,B2써믹스단열,982,엣지'),
    ('25-0002', 6, '5SKG149T(HS)+14A(단열)+5CL(HS)', 'P', 722, 800, 24, 'mm', 4, 2.31, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5-3차5F그레이존-2코어정,배면 IAW2-07써믹스단열,982,엣지'),
    ('25-0002', 7, '5SKG149T(HS)+14A(단열)+5CL(HS)', 'P', 745, 795, 24, 'mm', 1, 0.59, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5-3차5F그레이존-2코어우측 ICAW2-01써믹스단열,982,엣지'),
    ('25-0002', 8, '5SKG149T(HS)+14A(단열)+5CL(HS)', 'P', 740, 795, 24, 'mm', 1, 0.59, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5-3차5F그레이존-2코어우측 ICAW2-01써믹스단열,982,엣지'),

    -- 25-0018: 대우건설 - 평택포승지식산업센터 (9라인)
    ('25-0018', 1, '5SKG144T(HS)+6TPS+5CL(HS)', 'P', 1385, 1775, 16, 'mm', 5, 12.3, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'A-25(계단)-A동정면10F 4SIDETPS,982,엣지'),
    ('25-0018', 2, '5SKG144T(HS)+6TPS+5CL(HS)', 'P', 422, 1775, 16, 'mm', 1, 0.75, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'A-25(계단)-A동정면10F 4SIDETPS,982,엣지'),
    ('25-0018', 3, '5SKG144T(HS)+6TPS+5CL(HS)', 'P', 1385, 685, 16, 'mm', 3, 2.85, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'A-25(계단)-A동정면10F 4SIDETPS,982,엣지'),
    ('25-0018', 4, '5SKG144T(HS)+6TPS+5CL(HS)', 'P', 1385, 565, 16, 'mm', 5, 3.92, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'A-25(계단)-A동정면10F 4SIDETPS,982,엣지'),
    ('25-0018', 5, '5SKG144T(HS)+6TPS+5CL(HS)', 'P', 1360, 532, 16, 'mm', 5, 3.62, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'A-25(계단)-A동정면10F PJTPS,982,엣지'),
    ('25-0018', 6, '5SKG144T(HS)+6TPS+5CL(HS)', 'P', 1385, 185, 16, 'mm', 2, 0.56, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'A-25(계단)-A동정면10F 4SIDETPS,982,엣지'),
    ('25-0018', 7, '5SKG144T(HS)+6TPS+5CL(HS)', 'P', 422, 685, 16, 'mm', 1, 0.29, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'A-25(계단)-A동정면10F 4SIDETPS,982,엣지'),
    ('25-0018', 8, '5SKG144T(HS)+6TPS+5CL(HS)', 'P', 422, 575, 16, 'mm', 1, 0.28, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'A-25(계단)-A동정면10F 4SIDETPS,982,엣지'),
    ('25-0018', 9, '5SKG144T(HS)+6TPS+5CL(HS)', 'P', 422, 565, 16, 'mm', 1, 0.28, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'A-25(계단)-A동정면10F 4SIDETPS,982,엣지'),

    -- 25-0031: 주식회사 케이씨씨글라스 여주공장 - (없음) (4라인)
    ('25-0031', 1, '5SKS143II', 'FL', 2438, 3048, 5, 'mm', 2, 14.86, 'M2', 29700::NUMERIC, 441402::NUMERIC, '원판-'),
    ('25-0031', 2, '5SKS143II', 'FL', 810, 1000, 5, 'mm', 18, 14.58, 'M2', 2200::NUMERIC, 32076::NUMERIC, '가공비(재단)-'),
    ('25-0031', 3, '5DURAplus', 'FL', 1981, 3353, 5, 'mm', 1, 6.64, 'M2', 19000::NUMERIC, 126217::NUMERIC, '원판-'),
    ('25-0031', 4, '5DURAplus', 'FL', 650, 1000, 5, 'mm', 9, 5.85, 'M2', 2200::NUMERIC, 12870::NUMERIC, '가공비(재단)-'),

    -- 25-0042: PL창호 - (없음) (4라인)
    ('25-0042', 1, '5CL+12A+5LE', 'P', 1119, 1875, 22, 'mm', 1, 2.1, 'M2', NULL::NUMERIC, NULL::NUMERIC, '한양-전주시험용-'),
    ('25-0042', 2, '5CL+12A+5LE', 'P', 763, 1875, 22, 'mm', 2, 2.86, 'M2', NULL::NUMERIC, NULL::NUMERIC, '한양-전주시험용-'),
    ('25-0042', 3, '5GN+12A+5LE', 'P', 1119, 1875, 22, 'mm', 1, 2.1, 'M2', NULL::NUMERIC, NULL::NUMERIC, '한양-전주시험용-'),
    ('25-0042', 4, '5GN+12A+5LE', 'P', 763, 1875, 22, 'mm', 2, 2.86, 'M2', NULL::NUMERIC, NULL::NUMERIC, '한양-전주시험용-'),

    -- 25-0053: 디엘이앤씨(주) - 판교G2업무시설 1공구 (9라인)
    ('25-0053', 1, '5CL(HS)+5MCT148(HS)(#3)+5EHD176(#5)', '생산하자분', 1425, 1155, 39, 'mm', 7, 11.52, 'M2', NULL::NUMERIC, NULL::NUMERIC, '부족분-5차C동-다중오류분-2차 .TPS,아르곤,982,엣지5+12ar+5+12ar+5'),
    ('25-0053', 2, '5MCT150(HS)+5CL(HS)+5EHD176', '생산하자분', 1405, 2885, 39, 'mm', 2, 8.11, 'M2', NULL::NUMERIC, NULL::NUMERIC, '부족분-5차A동-14층 미입고TPS,아르곤,982,엣지5+12ar+5+12ar+5'),
    ('25-0053', 3, '5MCT150(HS)+5CL(HS)+5EHD176', '시공하자분', 1405, 2865, 39, 'mm', 1, 4.03, 'M2', NULL::NUMERIC, NULL::NUMERIC, '부족분-5차A동-9층 파손분TPS,아르곤,982,엣지5+12ar+5+12ar+5'),
    ('25-0053', 4, '5MCT150(HS)+5CL(HS)+5EHD176', '시공하자분', 1040, 2865, 39, 'mm', 1, 2.98, 'M2', NULL::NUMERIC, NULL::NUMERIC, '부족분-5차A동-5층 파손분TPS,아르곤,982,엣지5+12ar+5+12ar+5'),
    ('25-0053', 5, '5MCT150(HS)+5CL(HS)+5EHD176', '시공하자분', 725, 2865, 39, 'mm', 1, 2.08, 'M2', NULL::NUMERIC, NULL::NUMERIC, '부족분-5차A동-6층 파손분TPS,아르곤,982,엣지5+12ar+5+12ar+5'),
    ('25-0053', 6, '5MCT150(HS)+5CL(HS)+5EHD176', '시공하자분', 725, 2865, 39, 'mm', 1, 2.08, 'M2', NULL::NUMERIC, NULL::NUMERIC, '부족분-5차A동-5층 파손분TPS,아르곤,982,엣지5+12ar+5+12ar+5'),
    ('25-0053', 7, '5MCT150(HS)+5CL(HS)+5EHD176', '생산하자분', 1405, 1605, 39, 'mm', 1, 2.26, 'M2', NULL::NUMERIC, NULL::NUMERIC, '부족분-5차A동-13층 미입고TPS,아르곤,982,엣지5+12ar+5+12ar+5'),
    ('25-0053', 8, '5MCT150(HS)+5CL(HS)+5EHD176', '시공하자분', 1405, 685, 39, 'mm', 1, 0.96, 'M2', NULL::NUMERIC, NULL::NUMERIC, '부족분-5차A동-14층 파손분TPS,아르곤,982,엣지5+12ar+5+12ar+5'),
    ('25-0053', 9, '5MCT150(HS)+5CL(HS)+5EHD176', '시공하자분', 1405, 685, 39, 'mm', 1, 0.96, 'M2', NULL::NUMERIC, NULL::NUMERIC, '부족분-5차A동-5층 파손분TPS,아르곤,982,엣지5+12ar+5+12ar+5'),

    -- 25-0156: 주식회사 폴딩엠텍 - (없음) (3라인)
    ('25-0156', 1, '5LE+12TPS+5CL+12TPS+5LE', 'P', 812, 2652, 39, 'mm', 1, 2.15, 'M2', 94423::NUMERIC, 203387::NUMERIC, '새암천안-13일아침출고예정 .TPS'),
    ('25-0156', 2, '5LE+12TPS+5CL+12TPS+5LE', 'P', 520, 2652, 39, 'mm', 8, 11.03, 'M2', 94423::NUMERIC, 1041675::NUMERIC, '새암천안-13일아침출고예정 .TPS'),
    ('25-0156', 3, '5CL+8TPS+5CL', 'P', 485, 2646, 18, 'mm', 8, 10.27, 'M2', 38669::NUMERIC, 397208::NUMERIC, '새암천안-13일아침출고예정 .TPS'),

    -- 25-0183: 중흥토건 - 천호1지구 (5라인)
    ('25-0183', 1, '10CL(TF)', '시공하자분', 915, 418, 10, 'mm', 1, 0.38, 'M2', NULL::NUMERIC, NULL::NUMERIC, '하자점검-10차-근생 ..'),
    ('25-0183', 2, '5CL(HS)+14TPS,AR+5ECI173', '시공하자분', 873, 2365, 24, 'mm', 1, 2.07, 'M2', NULL::NUMERIC, NULL::NUMERIC, '하자점검-10차-근생 .TPS,아르곤,엣지'),
    ('25-0183', 3, '5CL(HS)+14TPS,AR+5ECI173', '시공하자분', 829, 1134, 24, 'mm', 1, 0.94, 'M2', NULL::NUMERIC, NULL::NUMERIC, '하자점검-10차-근생 .TPS,아르곤,엣지'),
    ('25-0183', 4, '5CL(HS)+14TPS,AR+5ECI173', '시공하자분', 925, 290, 24, 'mm', 1, 0.28, 'M2', NULL::NUMERIC, NULL::NUMERIC, '하자점검-10차-근생 .TPS,아르곤,엣지'),
    ('25-0183', 5, '5CL+12A+5CL', '시공하자분', 1010, 600, 22, 'mm', 1, 0.61, 'M2', NULL::NUMERIC, NULL::NUMERIC, '하자점검-10차-계단창 ..'),

    -- 25-0357: (주)한양 - 남양주 도곡2 주택재개발 (4라인)
    ('25-0357', 1, '10CL(TF)', 'FL', 1462, 1383, 10, 'mm', 1, 2.02, 'M2', NULL::NUMERIC, NULL::NUMERIC, '공동시설 키즈짐-'),
    ('25-0357', 2, '10CL(TF)', 'FL', 1457, 1383, 10, 'mm', 1, 2.02, 'M2', NULL::NUMERIC, NULL::NUMERIC, '공동시설 키즈짐-'),
    ('25-0357', 3, '10CL(TF)', 'FL', 697, 1383, 10, 'mm', 1, 0.96, 'M2', NULL::NUMERIC, NULL::NUMERIC, '공동시설 키즈짐-'),
    ('25-0357', 4, '5CL', 'FL', 882, 390, 5, 'mm', 3, 1.03, 'M2', NULL::NUMERIC, NULL::NUMERIC, '12동1호라인계단2층-'),

    -- 25-0383: (주)포스코이앤씨 - 천호4구역 (4라인)
    ('25-0383', 1, '5CL(HS)+12A+5CL', '생산하자분', 598, 1857, 22, 'mm', 4, 4.44, 'M2', NULL::NUMERIC, NULL::NUMERIC, '부족분-1차-3동6.7호59B-조합 발코니1'),
    ('25-0383', 2, '5CL(HS)+12A+5CL', '생산하자분', 598, 1857, 22, 'mm', 2, 2.22, 'M2', NULL::NUMERIC, NULL::NUMERIC, '부족분-1차-3동2호59C 발코니1'),
    ('25-0383', 3, '5CL(HS)+12A+5CL', '생산하자분', 598, 1857, 22, 'mm', 1, 1.11, 'M2', NULL::NUMERIC, NULL::NUMERIC, '부족분-1차-3동4호84A 발코니1'),
    ('25-0383', 4, '5CL(HS)+12A+5CL', '생산하자분', 548, 1857, 22, 'mm', 8, 8.14, 'M2', NULL::NUMERIC, NULL::NUMERIC, '부족분-1차-3동5호84B 발코니1'),

    -- 25-0536: (주)서해종합건설 - 병점역 스카이팰리스 (4라인)
    ('25-0536', 1, '5CL+12A+5CL', 'P', 1360, 917, 22, 'mm', 30, 37.44, 'M2', NULL::NUMERIC, NULL::NUMERIC, '6차-호이스트-1동84A6거실,4호'),
    ('25-0536', 2, '5CL+12A+5CL', 'P', 763, 982, 22, 'mm', 30, 22.5, 'M2', NULL::NUMERIC, NULL::NUMERIC, '6차-호이스트-1동84A6침실1,4호'),
    ('25-0536', 3, '5LE+12A+5CL', 'P', 1364, 1976, 22, 'mm', 30, 45.6, 'M2', NULL::NUMERIC, NULL::NUMERIC, '6차-호이스트-1동84A6거실,4호'),
    ('25-0536', 4, '5LE+12A+5CL', 'P', 767, 1981, 22, 'mm', 30, 45.6, 'M2', NULL::NUMERIC, NULL::NUMERIC, '6차-호이스트-1동84A6침실1,4호'),

    -- 25-0550: 디엘건설(주) - 대전역 센텀비스타 (3라인)
    ('25-0550', 1, '8.76(5GN+0.76+3CL)+12TPS+5LE', 'P', 1515, 855, 25.76, 'mm', 6, 7.78, 'M2', NULL::NUMERIC, NULL::NUMERIC, '104동10-12층3,4호-거실픽스84B .TPS'),
    ('25-0550', 2, '8.76(5GN+0.76+3CL)+12TPS+5LE', 'P', 740, 855, 25.76, 'mm', 12, 7.6, 'M2', NULL::NUMERIC, NULL::NUMERIC, '104동10-12층3,4호-거실픽스84B .TPS'),
    ('25-0550', 3, '8.76(5GN+0.76+3CL)+12TPS+5LE', 'P', 625, 855, 25.76, 'mm', 6, 3.21, 'M2', NULL::NUMERIC, NULL::NUMERIC, '104동10-12층3,4호-발코니1픽스84B .TPS'),

    -- 25-0579: 동부건설 - 대전기초과학연구원 (9라인)
    ('25-0579', 1, '5MZT135(HS)+6A+5CL(HS)', 'P', 895, 705, 16, 'mm', 8, 5.05, 'M2', NULL::NUMERIC, NULL::NUMERIC, '1차대전A동3F북-스펜드럴구간 포장3-1엣지'),
    ('25-0579', 2, '5MZT135(HS)+6A+5CL(HS)', 'P', 875, 705, 16, 'mm', 15, 9.26, 'M2', NULL::NUMERIC, NULL::NUMERIC, '1차대전A동3F북-스펜드럴구간 포장3-1엣지'),
    ('25-0579', 3, '5MZT135(HS)+6A+5CL(HS)', 'P', 865, 705, 16, 'mm', 1, 0.61, 'M2', NULL::NUMERIC, NULL::NUMERIC, '1차대전A동3F북-스펜드럴구간 포장3-1엣지'),
    ('25-0579', 4, '5MZT135(HS)+14AR(단열)+5CL', 'P', 895, 1405, 24, 'mm', 8, 10.06, 'M2', NULL::NUMERIC, NULL::NUMERIC, '1차대전A동3F북-FIX구간 포장3-1eno,아르곤,982,엣지'),
    ('25-0579', 5, '5MZT135(HS)+14AR(단열)+5CL', 'P', 875, 1405, 24, 'mm', 15, 18.45, 'M2', NULL::NUMERIC, NULL::NUMERIC, '1차대전A동3F북-FIX구간 포장3-1eno,아르곤,982,엣지'),
    ('25-0579', 6, '5MZT135(HS)+14AR(단열)+5CL', 'P', 865, 1405, 24, 'mm', 1, 1.22, 'M2', NULL::NUMERIC, NULL::NUMERIC, '1차대전A동3F북-FIX구간 포장3-1eno,아르곤,982,엣지'),
    ('25-0579', 7, '5MZT135(HS)+14AR(단열)+5CL', 'P', 835, 645, 24, 'mm', 8, 4.31, 'M2', NULL::NUMERIC, NULL::NUMERIC, '1차대전A동3F북-PJ구간 포장3-1eno,아르곤,982,엣지'),
    ('25-0579', 8, '5MZT135(HS)+14AR(단열)+5CL', 'P', 815, 645, 24, 'mm', 15, 7.89, 'M2', NULL::NUMERIC, NULL::NUMERIC, '1차대전A동3F북-PJ구간 포장3-1eno,아르곤,982,엣지'),
    ('25-0579', 9, '5MZT135(HS)+14AR(단열)+5CL', 'P', 805, 645, 24, 'mm', 1, 0.52, 'M2', NULL::NUMERIC, NULL::NUMERIC, '1차대전A동3F북-PJ구간 포장3-1eno,아르곤,982,엣지'),

    -- 25-0615: (주)KCC건설 - 안성 방초2지구 물류센터 (6라인)
    ('25-0615', 1, '5MCT154S(HS)+14AR(단열)+5CL', 'P', 1365, 2315, 24, 'mm', 1, 3.16, 'M2', NULL::NUMERIC, NULL::NUMERIC, '4차분정면좌측-계단실-13커튼월 ACW04eno,아르곤,엣지,982'),
    ('25-0615', 2, '5MCT154S(HS)+14AR(단열)+5CL', 'P', 1365, 2305, 24, 'mm', 3, 9.44, 'M2', NULL::NUMERIC, NULL::NUMERIC, '4차분정면좌측-계단실-13커튼월 ACW04eno,아르곤,엣지,982'),
    ('25-0615', 3, '5MCT154S(HS)+14AR(단열)+5CL', 'P', 1365, 1760, 24, 'mm', 1, 2.4, 'M2', NULL::NUMERIC, NULL::NUMERIC, '4차분정면좌측-계단실-13커튼월 ACW04eno,아르곤,엣지,982'),
    ('25-0615', 4, '5MCT154S(HS)+14AR(단열)+5CL', 'P', 1365, 1565, 24, 'mm', 1, 2.14, 'M2', NULL::NUMERIC, NULL::NUMERIC, '4차분정면좌측-계단실-13커튼월 ACW04eno,아르곤,엣지,982'),
    ('25-0615', 5, '5MCT154S(HS)+14AR(단열)+5CL', 'P', 1365, 1545, 24, 'mm', 1, 2.11, 'M2', NULL::NUMERIC, NULL::NUMERIC, '4차분정면좌측-계단실-13커튼월 ACW04eno,아르곤,엣지,982'),
    ('25-0615', 6, '5MCT154S(HS)+14AR(단열)+5CL', 'P', 602, 887, 24, 'mm', 14, 7.48, 'M2', NULL::NUMERIC, NULL::NUMERIC, '4차분정면좌측-계단실-13커튼월PJ ACW04eno,아르곤,엣지,982'),

    -- 25-0674: LX하우시스 - 음성자이 센트럴시티 (8라인)
    ('25-0674', 1, '5CL+12TPS+5CL', 'P', 758, 2234, 22, 'mm', 4, 6.78, 'M2', NULL::NUMERIC, NULL::NUMERIC, '분합창1차4동-101A1층 외창이중창TPS'),
    ('25-0674', 2, '5CL+12TPS+5CL', 'P', 758, 2234, 22, 'mm', 4, 6.78, 'M2', NULL::NUMERIC, NULL::NUMERIC, '분합창1차4동-101A1층 내창이중창TPS'),
    ('25-0674', 3, '5CL+12TPS+5CL', 'P', 608, 2234, 22, 'mm', 4, 5.44, 'M2', NULL::NUMERIC, NULL::NUMERIC, '분합창1차4동-기본1층 외창이중창TPS'),
    ('25-0674', 4, '5CL+12TPS+5CL', 'P', 608, 2234, 22, 'mm', 4, 5.44, 'M2', NULL::NUMERIC, NULL::NUMERIC, '분합창1차4동-기본1층 내창이중창TPS'),
    ('25-0674', 5, '5CL+12TPS+5CL', 'P', 758, 2134, 22, 'mm', 64, 103.55, 'M2', NULL::NUMERIC, NULL::NUMERIC, '분합창1차4동-101A2층이상 외창이중창TPS'),
    ('25-0674', 6, '5CL+12TPS+5CL', 'P', 758, 2134, 22, 'mm', 64, 103.55, 'M2', NULL::NUMERIC, NULL::NUMERIC, '분합창1차4동-101A2층이상 내창이중창TPS'),
    ('25-0674', 7, '5CL+12TPS+5CL', 'P', 608, 2134, 22, 'mm', 60, 77.88, 'M2', NULL::NUMERIC, NULL::NUMERIC, '분합창1차4동-기본2층이상 외창이중창TPS'),
    ('25-0674', 8, '5CL+12TPS+5CL', 'P', 608, 2134, 22, 'mm', 60, 77.88, 'M2', NULL::NUMERIC, NULL::NUMERIC, '분합창1차4동-기본2층이상 내창이중창TPS'),

    -- 25-0716: (주)동일토건 - 청주 개신2지구 (10라인)
    ('25-0716', 1, '6CL(HS)+16AR+6LE(HS)', 'P', 1354, 550, 28, 'mm', 1, 0.75, 'M2', NULL::NUMERIC, NULL::NUMERIC, '근생.1번-근생2차 .아르곤'),
    ('25-0716', 2, '6CL(HS)+16AR+6LE(HS)', 'P', 1354, 550, 28, 'mm', 1, 0.75, 'M2', NULL::NUMERIC, NULL::NUMERIC, '근생.3번-근생2차 .아르곤'),
    ('25-0716', 3, '6CL(HS)+16AR+6LE(HS)', 'P', 1349, 550, 28, 'mm', 6, 4.45, 'M2', NULL::NUMERIC, NULL::NUMERIC, '근생.3번-근생2차 .아르곤'),
    ('25-0716', 4, '6CL(HS)+16AR+6LE(HS)', 'P', 1274, 550, 28, 'mm', 3, 2.1, 'M2', NULL::NUMERIC, NULL::NUMERIC, '근생.2번-근생2차 .아르곤'),
    ('25-0716', 5, '6CL(HS)+16AR+6LE(HS)', 'P', 1404, 540, 28, 'mm', 2, 1.52, 'M2', NULL::NUMERIC, NULL::NUMERIC, '근생.1번-근생2차 .아르곤'),
    ('25-0716', 6, '6CL(HS)+16AR+6LE(HS)', 'P', 489, 540, 28, 'mm', 1, 0.28, 'M2', NULL::NUMERIC, NULL::NUMERIC, '근생.3번-근생2차 .아르곤'),
    ('25-0716', 7, '6CL(HS)+16AR+6LE(HS)', 'P', 532, 550, 28, 'mm', 2, 0.59, 'M2', NULL::NUMERIC, NULL::NUMERIC, '근생.1번-근생2차 .아르곤'),
    ('25-0716', 8, '6CL+16AR+6LE', 'P', 1404, 2192, 28, 'mm', 4, 12.31, 'M2', NULL::NUMERIC, NULL::NUMERIC, '근생.1번-근생2차 .아르곤'),
    ('25-0716', 9, '6CL+16AR+6LE', 'P', 1367, 2192, 28, 'mm', 7, 20.98, 'M2', NULL::NUMERIC, NULL::NUMERIC, '근생.3번-근생2차 .아르곤'),
    ('25-0716', 10, '6CL+16AR+6LE', 'P', 1292, 2192, 28, 'mm', 3, 8.5, 'M2', NULL::NUMERIC, NULL::NUMERIC, '근생.2번-근생2차 .아르곤')

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
WHERE h.order_no IN ('25-0002', '25-0018', '25-0031', '25-0042', '25-0053', '25-0156', '25-0183', '25-0357', '25-0383', '25-0536', '25-0550', '25-0579', '25-0615', '25-0674', '25-0716')
  AND (SELECT COALESCE(SUM(amount), 0) FROM hkgn.sales_order_detail d WHERE d.order_header_id = h.id) > 0;

-- 완료 메시지
SELECT
    '수주 헤더 ' || COUNT(DISTINCT h.id) || '건, ' ||
    '수주 상세 ' || COUNT(d.id) || '건 INSERT 완료' AS result
FROM hkgn.sales_order_header h
LEFT JOIN hkgn.sales_order_detail d ON d.order_header_id = h.id
WHERE h.order_no IN ('25-0002', '25-0018', '25-0031', '25-0042', '25-0053', '25-0156', '25-0183', '25-0357', '25-0383', '25-0536', '25-0550', '25-0579', '25-0615', '25-0674', '25-0716');
