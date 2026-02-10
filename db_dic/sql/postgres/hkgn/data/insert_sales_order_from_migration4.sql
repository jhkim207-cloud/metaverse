-- ============================================
-- 수주 마이그레이션 데이터 INSERT (2025년 9~12월 샘플)
-- ============================================
-- 출처: ref/수주마이그20253.xlsx
-- 생성일시: 2026-02-09
-- 설명: 2025-09~12 수주 데이터 14건 (거래처 14곳, 상세 79라인)
-- ============================================

-- ============================================
-- STEP 1: 수주 헤더 INSERT (14건)
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
    -- 25-1944: PL창호 - (없음) (9라인)
    ('25-1944', '2025-09-01'::DATE, NULL::DATE, 'PL창호', '완제품', 'P', NULL, NULL, 1489956, FALSE, NULL, 'COMPLETED'),
    -- 25-1970: (주)HK 지앤텍 - (없음) (3라인)
    ('25-1970', '2025-09-03'::DATE, NULL::DATE, '(주)HK 지앤텍', '완제품', 'P', NULL, NULL, 0, FALSE, NULL, 'COMPLETED'),
    -- 25-1999: 디엘건설(주) - 대전역 센텀비스타 (4라인)
    ('25-1999', '2025-09-04'::DATE, NULL::DATE, '디엘건설(주)', '완제품', 'P', NULL, '대전역 센텀비스타', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-2007: 대우건설 - 운정3지구A-8BL (8라인)
    ('25-2007', '2025-09-04'::DATE, NULL::DATE, '대우건설', '완제품', 'P', NULL, '운정3지구A-8BL', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-2041: 디엘이앤씨(주) - e편한세상 검단웰카운티 (3라인)
    ('25-2041', '2025-09-10'::DATE, NULL::DATE, '디엘이앤씨(주)', '완제품', 'FL', NULL, 'e편한세상 검단웰카운티', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-2058: 현대엔지니어링(주) - 시흥장현지구 업무시설 (3라인)
    ('25-2058', '2025-09-15'::DATE, NULL::DATE, '현대엔지니어링(주)', '완제품', 'P', NULL, '시흥장현지구 업무시설', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-2095: 중흥토건 - 평택브레인시티1BL(1공구) (4라인)
    ('25-2095', '2025-09-24'::DATE, NULL::DATE, '중흥토건', '완제품', 'FL', NULL, '평택브레인시티1BL(1공구)', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-2221: 주식회사 폴딩엠텍 - (없음) (5라인)
    ('25-2221', '2025-10-14'::DATE, NULL::DATE, '주식회사 폴딩엠텍', '완제품', 'P', NULL, NULL, 960700, FALSE, NULL, 'COMPLETED'),
    -- 25-2254: 금호건설 - 강릉회산동 공동주택 (4라인)
    ('25-2254', '2025-10-20'::DATE, NULL::DATE, '금호건설', '완제품', 'P', NULL, '강릉회산동 공동주택', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-2355: 동부건설 - 인천검단AA-21BL(7공구) (10라인)
    ('25-2355', '2025-10-31'::DATE, NULL::DATE, '동부건설', '완제품', 'FL', NULL, '인천검단AA-21BL(7공구)', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-2372: LX하우시스 - 음성자이 센트럴시티 (10라인)
    ('25-2372', '2025-11-03'::DATE, NULL::DATE, 'LX하우시스', '하자분', '생산하자분', NULL, '음성자이 센트럴시티', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-2467: (주)포스코이앤씨 - 의정부시 캠프라과디아 (9라인)
    ('25-2467', '2025-11-17'::DATE, NULL::DATE, '(주)포스코이앤씨', '완제품', 'P', NULL, '의정부시 캠프라과디아', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-2624: (주)창희씨앤에스 - 롯데바이오로직스 (3라인)
    ('25-2624', '2025-12-04'::DATE, NULL::DATE, '(주)창희씨앤에스', '완제품', 'P', NULL, '롯데바이오로직스', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-2701: 주식회사 엘엑스글라스 - 서초동 JK타워 (4라인)
    ('25-2701', '2025-12-17'::DATE, NULL::DATE, '주식회사 엘엑스글라스', '하자분', '생산하자분', NULL, '서초동 JK타워', 0, FALSE, NULL, 'COMPLETED')
) AS v(order_no, order_date, delivery_date, customer_nm, order_type, order_kind, site_cd, site_nm, total_amount, tax_separate, remarks, order_status)
LEFT JOIN hkgn.business_partner bp ON bp.bp_nm = v.customer_nm;

-- ============================================
-- STEP 2: 수주 상세 INSERT (79라인)
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
    -- 25-1944: PL창호 - (없음) (9라인)
    ('25-1944', 1, '5CL+12A+5CL', 'P', 1719, 1940, 22, 'mm', 2, 6.67, 'M2', 41066::NUMERIC, 273910::NUMERIC, '일신-천안모델하우스-거실,84A'),
    ('25-1944', 2, '5CL+12A+5CL', 'P', 904, 1940, 22, 'mm', 4, 7.02, 'M2', 41066::NUMERIC, 288119::NUMERIC, '일신-천안모델하우스-침실3,84A'),
    ('25-1944', 3, '5CL+12A+5CL', 'P', 763, 1940, 22, 'mm', 4, 5.92, 'M2', 41066::NUMERIC, 243275::NUMERIC, '일신-천안모델하우스-거실,84A'),
    ('25-1944', 4, '5CL+12A+5CL', 'P', 754, 1940, 22, 'mm', 4, 5.85, 'M2', 41066::NUMERIC, 240318::NUMERIC, '일신-천안모델하우스-침실2,84A'),
    ('25-1944', 5, '5CL+12A+5CL', 'P', 754, 1940, 22, 'mm', 4, 5.85, 'M2', 41066::NUMERIC, 240318::NUMERIC, '일신-천안모델하우스-식당,84A'),
    ('25-1944', 6, '5CL+12A+5CL', 'P', 644, 1926, 22, 'mm', 2, 2.48, 'M2', 41066::NUMERIC, 101926::NUMERIC, '일신-천안모델하우스-침실1(외),84A'),
    ('25-1944', 7, '5CL+12A+5CL', 'P', 444, 906, 22, 'mm', 2, 0.81, 'M2', 41066::NUMERIC, 33099::NUMERIC, '일신-천안모델하우스-피난구,84A'),
    ('25-1944', 8, '5CL+12A+5CL', 'P', 294, 906, 22, 'mm', 2, 0.56, 'M2', 41066::NUMERIC, 22997::NUMERIC, '일신-천안모델하우스-발코니2,84A'),
    ('25-1944', 9, '5CL+12A+5CL', 'P', 454, 370, 22, 'mm', 4, 1.12, 'M2', 41066::NUMERIC, 45994::NUMERIC, '일신-천안모델하우스-주방,84A'),

    -- 25-1970: (주)HK 지앤텍 - (없음) (3라인)
    ('25-1970', 1, '5CL+14TPS,AR+5CL', 'P', 500, 800, 24, 'mm', 1, 0.4, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'TPS샘플-프레스까지만 오토실링XTPS,아르곤,오토실링X'),
    ('25-1970', 2, '5CL+14TPS+5CL', 'P', 500, 800, 24, 'mm', 2, 0.8, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'TPS샘플-프레스까지만 오토실링XTPS,오토실링X'),
    ('25-1970', 3, '5CL+14TPS+5CL', 'P', 500, 800, 24, 'mm', 3, 1.2, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'TPS샘플-TPS간봉만 프레스X,오토실링XTPS,프레스X,오토실링X'),

    -- 25-1999: 디엘건설(주) - 대전역 센텀비스타 (4라인)
    ('25-1999', 1, '5GN+16TPS,AR+5LE(HS)+14TPS,AR+5LE', 'P', 645, 1845, 45, 'mm', 17, 20.23, 'M2', NULL::NUMERIC, NULL::NUMERIC, '101동84B-개방형발코니터닝 .TPS,아르곤'),
    ('25-1999', 2, '5GN+16TPS,AR+5LE(HS)+14TPS,AR+5LE', 'P', 645, 1845, 45, 'mm', 17, 20.23, 'M2', NULL::NUMERIC, NULL::NUMERIC, '102동84C-개방형발코니터닝 .TPS,아르곤'),
    ('25-1999', 3, '5GN+16TPS,AR+5LE(HS)+14TPS,AR+5LE', 'P', 645, 1845, 45, 'mm', 17, 20.23, 'M2', NULL::NUMERIC, NULL::NUMERIC, '103동84B-개방형발코니터닝 .TPS,아르곤'),
    ('25-1999', 4, '5GN+16TPS,AR+5LE(HS)+14TPS,AR+5LE', 'P', 645, 1845, 45, 'mm', 13, 15.47, 'M2', NULL::NUMERIC, NULL::NUMERIC, '104동84B-개방형발코니터닝 .TPS,아르곤'),

    -- 25-2007: 대우건설 - 운정3지구A-8BL (8라인)
    ('25-2007', 1, '5CL+12A+5CL', 'P', 625, 2205, 22, 'mm', 58, 79.98, 'M2', NULL::NUMERIC, NULL::NUMERIC, '8동1,2호-79A분합내창'),
    ('25-2007', 2, '5CL+12A+5CL', 'P', 625, 2205, 22, 'mm', 30, 41.37, 'M2', NULL::NUMERIC, NULL::NUMERIC, '8동3,4호-79A분합내창'),
    ('25-2007', 3, '5CL+12A+5CL', 'P', 625, 2205, 22, 'mm', 30, 41.37, 'M2', NULL::NUMERIC, NULL::NUMERIC, '8동3,4호-79B분합내창'),
    ('25-2007', 4, '5CL+12A+5CL', 'P', 625, 2205, 22, 'mm', 26, 35.85, 'M2', NULL::NUMERIC, NULL::NUMERIC, '8동3,4호-84A분합내창'),
    ('25-2007', 5, '5CL+12A+5LE', 'P', 625, 2205, 22, 'mm', 58, 79.98, 'M2', NULL::NUMERIC, NULL::NUMERIC, '8동1,2호-79A분합외창'),
    ('25-2007', 6, '5CL+12A+5LE', 'P', 625, 2205, 22, 'mm', 30, 41.37, 'M2', NULL::NUMERIC, NULL::NUMERIC, '8동3,4호-79A분합외창'),
    ('25-2007', 7, '5CL+12A+5LE', 'P', 625, 2205, 22, 'mm', 30, 41.37, 'M2', NULL::NUMERIC, NULL::NUMERIC, '8동3,4호-79B분합외창'),
    ('25-2007', 8, '5CL+12A+5LE', 'P', 625, 2205, 22, 'mm', 26, 35.85, 'M2', NULL::NUMERIC, NULL::NUMERIC, '8동3,4호-84A분합외창'),

    -- 25-2041: 디엘이앤씨(주) - e편한세상 검단웰카운티 (3라인)
    ('25-2041', 1, '5CL', 'FL', 1074, 1123, 5, 'mm', 24, 28.97, 'M2', NULL::NUMERIC, NULL::NUMERIC, '9-3차-6동1코어2-25F A타입'),
    ('25-2041', 2, '5CL', 'FL', 1074, 388, 5, 'mm', 24, 10.01, 'M2', NULL::NUMERIC, NULL::NUMERIC, '9-3차-6동1코어2-25F A타입'),
    ('25-2041', 3, '5CL', 'FL', 970, 445, 5, 'mm', 24, 10.37, 'M2', NULL::NUMERIC, NULL::NUMERIC, '9-3차-6동1코어2-25F A타입'),

    -- 25-2058: 현대엔지니어링(주) - 시흥장현지구 업무시설 (3라인)
    ('25-2058', 1, '5SKG149T(HS)+14A(단열)+5CL(HS)', 'P', 1075, 545, 24, 'mm', 3, 1.76, 'M2', NULL::NUMERIC, NULL::NUMERIC, 'PIT.PJ신규발주-. .써믹스단열,982,엣지'),
    ('25-2058', 2, '6SKG149T(HS)+12AR(단열)+6CL', '생산하자분', 885, 2370, 24, 'mm', 1, 2.1, 'M2', NULL::NUMERIC, NULL::NUMERIC, '1층.부족분-. .써믹스단열,아르곤,982,엣지'),
    ('25-2058', 3, '6SKG149T(HS)+14AR(단열)+6CL', '시공하자분', 965, 2210, 26, 'mm', 1, 2.13, 'M2', NULL::NUMERIC, NULL::NUMERIC, '도어파손분-. .써믹스단열,아르곤,982,엣지'),

    -- 25-2095: 중흥토건 - 평택브레인시티1BL(1공구) (4라인)
    ('25-2095', 1, '5GN+6A+5CL', 'FL', 1105, 922, 16, 'mm', 14, 14.27, 'M2', NULL::NUMERIC, NULL::NUMERIC, '1동25-최상층-계단,EV홀 AW1'),
    ('25-2095', 2, '5GN+6A+5CL', 'FL', 1105, 407, 16, 'mm', 6, 2.7, 'M2', NULL::NUMERIC, NULL::NUMERIC, '1동25-최상층-계단,EV홀 AW2'),
    ('25-2095', 3, '5GN+6A+5CL', 'FL', 575, 575, 16, 'mm', 6, 1.99, 'M2', NULL::NUMERIC, NULL::NUMERIC, '1동25-최상층-EV홀 AW4'),
    ('25-2095', 4, '5GN+6A+5CL', 'FL', 975, 335, 16, 'mm', 6, 1.96, 'M2', NULL::NUMERIC, NULL::NUMERIC, '1동25-최상층-계단,EV홀 AW2'),

    -- 25-2221: 주식회사 폴딩엠텍 - (없음) (5라인)
    ('25-2221', 1, '5CL+6TPS+5CL', 'P', 561, 2305, 16, 'mm', 6, 7.76, 'M2', 37471::NUMERIC, 290925::NUMERIC, '아이에스포천-16일출고 .TPS'),
    ('25-2221', 2, '5GN+6TPS+5CL', 'P', 586, 1318, 16, 'mm', 8, 6.18, 'M2', 38690::NUMERIC, 239259::NUMERIC, '창대17일출고-. .TPS'),
    ('25-2221', 3, '5GN+6TPS+5CL', 'P', 531, 1318, 16, 'mm', 4, 2.8, 'M2', 38690::NUMERIC, 108332::NUMERIC, '창대17일출고-. .TPS'),
    ('25-2221', 4, '5CL+14TPS+5CL', 'P', 446, 2058, 24, 'mm', 5, 4.59, 'M2', 43462::NUMERIC, 199491::NUMERIC, '유지문사장-16일출고 .TPS'),
    ('25-2221', 5, '5CL+14TPS+5CL', 'P', 457, 2058, 24, 'mm', 3, 2.82, 'M2', 43462::NUMERIC, 122693::NUMERIC, '유지문사장-16일출고 .TPS'),

    -- 25-2254: 금호건설 - 강릉회산동 공동주택 (4라인)
    ('25-2254', 1, '10.76그린접합+14TPS,AR+5LE+14TPS,AR+5LE', 'P', 1190, 510, 48.76, 'mm', 10, 6.07, 'M2', NULL::NUMERIC, NULL::NUMERIC, '2동1-2호11-15F-주방식당(픽스) 84Bm2픽스창TPS,AR'),
    ('25-2254', 2, '10.76그린접합+14TPS,AR+5LE+14TPS,AR+5LE', 'P', 1190, 510, 48.76, 'mm', 5, 3.04, 'M2', NULL::NUMERIC, NULL::NUMERIC, '2동3호11-15F-주방식당(픽스) 84Bm2픽스창TPS,AR'),
    ('25-2254', 3, '10.76그린접합+14TPS,AR+5LE+14TPS,AR+5LE', 'P', 1190, 510, 48.76, 'mm', 5, 3.04, 'M2', NULL::NUMERIC, NULL::NUMERIC, '2동4호11-15F-주방식당(픽스) 84Cm2픽스창TPS,AR'),
    ('25-2254', 4, '10.76그린접합+14TPS,AR+5LE+14TPS,AR+5LE', 'P', 1190, 510, 48.76, 'mm', 5, 3.04, 'M2', NULL::NUMERIC, NULL::NUMERIC, '2동5호11-15F-주방식당(픽스) 99m2픽스창TPS,AR'),

    -- 25-2355: 동부건설 - 인천검단AA-21BL(7공구) (10라인)
    ('25-2355', 1, '5CL', 'FL', 1485, 442, 5, 'mm', 22, 14.45, 'M2', NULL::NUMERIC, NULL::NUMERIC, '9동 복도창1-동별포장'),
    ('25-2355', 2, '5CL', 'FL', 1395, 442, 5, 'mm', 44, 27.15, 'M2', NULL::NUMERIC, NULL::NUMERIC, '9동 복도창2-동별포장'),
    ('25-2355', 3, '5CL', 'FL', 1095, 442, 5, 'mm', 22, 10.65, 'M2', NULL::NUMERIC, NULL::NUMERIC, '9동 복도창1-동별포장'),
    ('25-2355', 4, '5CL', 'FL', 718, 442, 5, 'mm', 22, 7, 'M2', NULL::NUMERIC, NULL::NUMERIC, '9동 계단창1-동별포장'),
    ('25-2355', 5, '5CL', 'FL', 695, 442, 5, 'mm', 22, 6.78, 'M2', NULL::NUMERIC, NULL::NUMERIC, '9동 계단창2-동별포장'),
    ('25-2355', 6, '5CL', 'FL', 674, 442, 5, 'mm', 44, 13.11, 'M2', NULL::NUMERIC, NULL::NUMERIC, '9동 복도창2-동별포장'),
    ('25-2355', 7, '5CL', 'FL', 970, 315, 5, 'mm', 22, 6.73, 'M2', NULL::NUMERIC, NULL::NUMERIC, '9동 복도창1-동별포장'),
    ('25-2355', 8, '5CL', 'FL', 593, 315, 5, 'mm', 22, 6.16, 'M2', NULL::NUMERIC, NULL::NUMERIC, '9동 계단창1-동별포장'),
    ('25-2355', 9, '5CL', 'FL', 570, 315, 5, 'mm', 22, 6.16, 'M2', NULL::NUMERIC, NULL::NUMERIC, '9동 계단창2-동별포장'),
    ('25-2355', 10, '5CL', 'FL', 548, 315, 5, 'mm', 44, 12.32, 'M2', NULL::NUMERIC, NULL::NUMERIC, '9동 복도창2-동별포장'),

    -- 25-2372: LX하우시스 - 음성자이 센트럴시티 (10라인)
    ('25-2372', 1, '5CL+12TPS+5SP2.0', '생산하자분', 1598, 1825, 22, 'mm', 1, 2.92, 'M2', NULL::NUMERIC, NULL::NUMERIC, '105동504호-거실대판내창 재성검수스크래치TPS'),
    ('25-2372', 2, '5CL+12TPS+5SP2.0', '생산하자분', 1412, 1825, 22, 'mm', 1, 2.58, 'M2', NULL::NUMERIC, NULL::NUMERIC, '116동1403호-거실대판내창 재성검수스크래치TPS'),
    ('25-2372', 3, '5CL+12TPS+5SP2.0', '생산하자분', 847, 1925, 22, 'mm', 1, 1.63, 'M2', NULL::NUMERIC, NULL::NUMERIC, '116동2301호-거실날개내창 재성검수스크래치TPS'),
    ('25-2372', 4, '5CL+12TPS+5SP2.0', '생산하자분', 630, 925, 22, 'mm', 1, 0.58, 'M2', NULL::NUMERIC, NULL::NUMERIC, '111동2204호-침실2내창내창 재성검수스크래치TPS'),
    ('25-2372', 5, '5CL+12TPS+5SP2.0', '생산하자분', 330, 925, 22, 'mm', 1, 0.31, 'M2', NULL::NUMERIC, NULL::NUMERIC, '109동2503호-주방내창내창 재성검수스크래치TPS'),
    ('25-2372', 6, '5CL+12TPS+5SP2.0', '생산하자분', 330, 925, 22, 'mm', 1, 0.31, 'M2', NULL::NUMERIC, NULL::NUMERIC, '109동1903호-주방내창내창 재성검수스크래치TPS'),
    ('25-2372', 7, '5CL+12TPS+5SP2.0', '생산하자분', 280, 925, 22, 'mm', 1, 0.28, 'M2', NULL::NUMERIC, NULL::NUMERIC, '101동1001호-드레스룸내창내창 재성검수스크래치TPS'),
    ('25-2372', 8, '5UGA156+12TPS+5CL', '생산하자분', 580, 1825, 22, 'mm', 1, 1.06, 'M2', NULL::NUMERIC, NULL::NUMERIC, '101동1002호-안방발코니외창외창 재성검수스크래치TPS,엣지'),
    ('25-2372', 9, '5UGA156+12TPS+5CL', '생산하자분', 580, 1825, 22, 'mm', 1, 1.06, 'M2', NULL::NUMERIC, NULL::NUMERIC, '115동2301호-안방발코니외창외창 재성검수스크래치TPS,엣지'),
    ('25-2372', 10, '5UGA156+12TPS+5CL', '생산하자분', 580, 1825, 22, 'mm', 1, 1.06, 'M2', NULL::NUMERIC, NULL::NUMERIC, '115동702호-안방발코니외창외창 재성검수스크래치TPS,엣지'),

    -- 25-2467: (주)포스코이앤씨 - 의정부시 캠프라과디아 (9라인)
    ('25-2467', 1, '8.76(4CL+0.76+4CL)+10AR+5LE', 'P', 1519, 1870, 23.76, 'mm', 5, 14.21, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5동5호112-거실외창 4차(16~20층)아르곤'),
    ('25-2467', 2, '8.76(4CL+0.76+4CL)+10AR+5LE', 'P', 1519, 1870, 23.76, 'mm', 5, 14.21, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5동6호112-거실외창 4차(16~20층)아르곤'),
    ('25-2467', 3, '8.76(4CL+0.76+4CL)+10AR+5LE', 'P', 1419, 1870, 23.76, 'mm', 5, 13.27, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5동1호84B-거실외창 4차(16~20층)아르곤'),
    ('25-2467', 4, '8.76(4CL+0.76+4CL)+10AR+5LE', 'P', 1419, 1870, 23.76, 'mm', 5, 13.27, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5동2호84A-거실외창 4차(16~20층)아르곤'),
    ('25-2467', 5, '8.76(4CL+0.76+4CL)+10AR+5LE', 'P', 1419, 1870, 23.76, 'mm', 5, 13.27, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5동3호84C-거실외창 4차(16~20층)아르곤'),
    ('25-2467', 6, '8.76(4CL+0.76+4CL)+10AR+5LE', 'P', 1419, 1870, 23.76, 'mm', 5, 13.27, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5동4호84D-거실외창 4차(16~20층)아르곤'),
    ('25-2467', 7, '8.76(4CL+0.76+4CL)+10AR+5LE', 'P', 594, 1856, 23.76, 'mm', 5, 5.52, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5동2호84A-발코니1단창 4차(16~20층)아르곤'),
    ('25-2467', 8, '8.76(4CL+0.76+4CL)+10AR+5LE', 'P', 594, 1856, 23.76, 'mm', 5, 5.52, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5동3호84C-발코니1단창 4차(16~20층)아르곤'),
    ('25-2467', 9, '8.76(4CL+0.76+4CL)+10AR+5LE', 'P', 594, 1856, 23.76, 'mm', 5, 5.52, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5동6호112-발코니1단창 4차(16~20층)아르곤'),

    -- 25-2624: (주)창희씨앤에스 - 롯데바이오로직스 (3라인)
    ('25-2624', 1, '6SKS143II(HS)+16TPS,AR+6CL(HS)', 'P', 1940, 1835, 28, 'mm', 3, 10.68, 'M2', NULL::NUMERIC, NULL::NUMERIC, '2-3차ACW1-5F .TPS,아르곤,982,엣지'),
    ('25-2624', 2, '6SKS143II(HS)+16TPS,AR+6CL(HS)', 'P', 1940, 1685, 28, 'mm', 9, 29.42, 'M2', NULL::NUMERIC, NULL::NUMERIC, '2-3차ACW1-5F .TPS,아르곤,982,엣지'),
    ('25-2624', 3, '6SKS143II(HS)+16TPS,AR+6CL(HS)', 'P', 1940, 1585, 28, 'mm', 3, 9.23, 'M2', NULL::NUMERIC, NULL::NUMERIC, '2-3차ACW1-5F .TPS,아르곤,982,엣지'),

    -- 25-2701: 주식회사 엘엑스글라스 - 서초동 JK타워 (4라인)
    ('25-2701', 1, '5SKG139T(HS)+16AR(단열)+5CL', '생산하자분', 1260, 1685, 26, 'mm', 5, 10.62, 'M2', NULL::NUMERIC, NULL::NUMERIC, '-유리내부이물질 25-2487-34SWS,아르곤,982,엣지'),
    ('25-2701', 2, '5SKG139T(HS)+16AR(단열)+5CL', '생산하자분', 1240, 1685, 26, 'mm', 2, 4.18, 'M2', NULL::NUMERIC, NULL::NUMERIC, '-유리내부이물질 25-2487-35SWS,아르곤,982,엣지'),
    ('25-2701', 3, '5SKG139T(HS)+16AR(단열)+5CL', '생산하자분', 1160, 1685, 26, 'mm', 7, 13.69, 'M2', NULL::NUMERIC, NULL::NUMERIC, '-유리내부이물질 25-2487-45SWS,아르곤,982,엣지'),
    ('25-2701', 4, '5SKG139T(HS)+16AR(단열)+5CL', '생산하자분', 1085, 1685, 26, 'mm', 1, 1.83, 'M2', NULL::NUMERIC, NULL::NUMERIC, '-유리내부이물질 25-2487-46SWS,아르곤,982,엣지')

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
WHERE h.order_no IN ('25-1944', '25-1970', '25-1999', '25-2007', '25-2041', '25-2058', '25-2095', '25-2221', '25-2254', '25-2355', '25-2372', '25-2467', '25-2624', '25-2701')
  AND (SELECT COALESCE(SUM(amount), 0) FROM hkgn.sales_order_detail d WHERE d.order_header_id = h.id) > 0;

-- 완료 메시지
SELECT
    '수주 헤더 ' || COUNT(DISTINCT h.id) || '건, ' ||
    '수주 상세 ' || COUNT(d.id) || '건 INSERT 완료' AS result
FROM hkgn.sales_order_header h
LEFT JOIN hkgn.sales_order_detail d ON d.order_header_id = h.id
WHERE h.order_no IN ('25-1944', '25-1970', '25-1999', '25-2007', '25-2041', '25-2058', '25-2095', '25-2221', '25-2254', '25-2355', '25-2372', '25-2467', '25-2624', '25-2701');
