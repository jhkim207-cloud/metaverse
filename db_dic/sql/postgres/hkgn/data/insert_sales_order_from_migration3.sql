-- ============================================
-- 수주 마이그레이션 데이터 INSERT (2025년 5~8월 샘플)
-- ============================================
-- 출처: ref/수주마이그20252.xlsx
-- 생성일시: 2026-02-09
-- 설명: 2025-05~08 수주 데이터 14건 (거래처 14곳, 상세 91라인)
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
    -- 25-1138: (주)포스코이앤씨 - 천호4구역 (6라인)
    ('25-1138', '2025-05-07'::DATE, NULL::DATE, '(주)포스코이앤씨', '완제품', 'P', NULL, '천호4구역', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-1139: 개인(견적용) - (없음) (5라인)
    ('25-1139', '2025-05-07'::DATE, NULL::DATE, '개인(견적용)', '하자분', '생산하자분', NULL, NULL, 0, FALSE, NULL, 'COMPLETED'),
    -- 25-1150: (주)대원 - 오산세교아파트 (8라인)
    ('25-1150', '2025-05-08'::DATE, NULL::DATE, '(주)대원', '하자분', '생산하자분', NULL, '오산세교아파트', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-1210: (주)동일토건 - 청주 개신2지구 (4라인)
    ('25-1210', '2025-05-13'::DATE, NULL::DATE, '(주)동일토건', '완제품', 'P', NULL, '청주 개신2지구', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-1228: 중흥토건 - 평택브레인시티1BL(1공구) (4라인)
    ('25-1228', '2025-05-14'::DATE, NULL::DATE, '중흥토건', '완제품', 'P', NULL, '평택브레인시티1BL(1공구)', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-1249: 대우건설 - 운정3지구A-8BL (8라인)
    ('25-1249', '2025-05-15'::DATE, NULL::DATE, '대우건설', '완제품', 'FL', NULL, '운정3지구A-8BL', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-1258: 디엘건설(주) - 대전역 센텀비스타 (5라인)
    ('25-1258', '2025-05-15'::DATE, NULL::DATE, '디엘건설(주)', '완제품', 'P', NULL, '대전역 센텀비스타', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-1296: 동부건설 - 대전기초과학연구원 (10라인)
    ('25-1296', '2025-05-21'::DATE, NULL::DATE, '동부건설', '완제품', 'FL', NULL, '대전기초과학연구원', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-1320: 디엘이앤씨(주) - e편한세상 부평그랑힐스 (10라인)
    ('25-1320', '2025-05-23'::DATE, NULL::DATE, '디엘이앤씨(주)', '하자분', '생산하자분', NULL, 'e편한세상 부평그랑힐스', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-1322: (주)한양 - 남양주 도곡2 주택재개발 (4라인)
    ('25-1322', '2025-05-23'::DATE, NULL::DATE, '(주)한양', '하자분', '생산하자분', NULL, '남양주 도곡2 주택재개발', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-1392: PL창호 - 대광건영-평택브레인 (4라인)
    ('25-1392', '2025-06-05'::DATE, NULL::DATE, 'PL창호', '완제품', 'P', NULL, '대광건영-평택브레인', 74658, FALSE, NULL, 'COMPLETED'),
    -- 25-1559: 롯데건설 - 광명2R (4라인)
    ('25-1559', '2025-06-30'::DATE, NULL::DATE, '롯데건설', '하자분', '시공하자분', NULL, '광명2R', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-1667: 현대엔지니어링(주) - 시흥장현지구 업무시설 (9라인)
    ('25-1667', '2025-07-14'::DATE, NULL::DATE, '현대엔지니어링(주)', '하자분', '시공하자분', NULL, '시흥장현지구 업무시설', 0, FALSE, NULL, 'COMPLETED'),
    -- 25-1876: 대성유리창호(주) - 용산 유엔사 (10라인)
    ('25-1876', '2025-08-20'::DATE, NULL::DATE, '대성유리창호(주)', '완제품', 'P', NULL, '용산 유엔사', 2021726, FALSE, NULL, 'COMPLETED')
) AS v(order_no, order_date, delivery_date, customer_nm, order_type, order_kind, site_cd, site_nm, total_amount, tax_separate, remarks, order_status)
LEFT JOIN hkgn.business_partner bp ON bp.bp_nm = v.customer_nm;

-- ============================================
-- STEP 2: 수주 상세 INSERT (91라인)
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
    -- 25-1138: (주)포스코이앤씨 - 천호4구역 (6라인)
    ('25-1138', 1, '5MZT152(HS)+14SWS,AR+5CL', 'P', 1146, 1174, 24, 'mm', 2, 2.69, 'M2', NULL::NUMERIC, NULL::NUMERIC, '판매시설B8차-101동지상1층 창호변경SWS,아르곤,982,엣지'),
    ('25-1138', 2, '5MZT152(HS)+14SWS,AR+5CL', 'P', 1024, 964, 24, 'mm', 3, 2.96, 'M2', NULL::NUMERIC, NULL::NUMERIC, '판매시설B8차-102동지상1층 창호변경SWS,아르곤,982,엣지'),
    ('25-1138', 3, '5MZT152(HS)+14SWS,AR+5CL', 'P', 984, 910, 24, 'mm', 2, 1.79, 'M2', NULL::NUMERIC, NULL::NUMERIC, '판매시설B8차-102동지GK1층 창호변경SWS,아르곤,982,엣지'),
    ('25-1138', 4, '5MZT152(HS)+14SWS,AR+5CL', 'P', 802, 910, 24, 'mm', 3, 2.19, 'M2', NULL::NUMERIC, NULL::NUMERIC, '판매시설B8차-102동지상1층 창호변경SWS,아르곤,982,엣지'),
    ('25-1138', 5, '5MZT152(HS)+14SWS,AR+5CL', 'P', 1077, 435, 24, 'mm', 2, 0.94, 'M2', NULL::NUMERIC, NULL::NUMERIC, '판매시설B8차-101동지상1층 창호변경SWS,아르곤,982,엣지'),
    ('25-1138', 6, '5MZT152(HS)+14SWS,AR+5CL', 'P', 955, 435, 24, 'mm', 3, 1.25, 'M2', NULL::NUMERIC, NULL::NUMERIC, '판매시설B8차-102동지하1층 창호변경SWS,아르곤,982,엣지'),

    -- 25-1139: 개인(견적용) - (없음) (5라인)
    ('25-1139', 1, '5Eurogray+14AR+5LE', '생산하자분', 825, 2245, 24, 'mm', 2, 3.71, 'M2', NULL::NUMERIC, NULL::NUMERIC, '생산불량-시흥대야동305-30 .아르곤'),
    ('25-1139', 2, '5Eurogray+14AR+5LE', '생산하자분', 815, 2245, 24, 'mm', 1, 1.83, 'M2', NULL::NUMERIC, NULL::NUMERIC, '생산불량-시흥대야동305-30 .아르곤'),
    ('25-1139', 3, '5Eurogray+14AR+5LE', '생산하자분', 805, 2245, 24, 'mm', 1, 1.81, 'M2', NULL::NUMERIC, NULL::NUMERIC, '생산불량-시흥대야동305-30 .아르곤'),
    ('25-1139', 4, '5Eurogray+14AR+5LE', '생산하자분', 725, 2245, 24, 'mm', 2, 3.26, 'M2', NULL::NUMERIC, NULL::NUMERIC, '생산불량-시흥대야동305-30 .아르곤'),
    ('25-1139', 5, '5Eurogray+14AR+5LE', '생산하자분', 835, 2235, 24, 'mm', 1, 1.87, 'M2', NULL::NUMERIC, NULL::NUMERIC, '생산불량-시흥대야동305-30 .아르곤'),

    -- 25-1150: (주)대원 - 오산세교아파트 (8라인)
    ('25-1150', 1, '5CL+6A+5CL', '생산하자분', 672, 2128, 16, 'mm', 1, 1.43, 'M2', NULL::NUMERIC, NULL::NUMERIC, '3동.1804호-안방분합(내) 생산불량.'),
    ('25-1150', 2, '5CL+6A+5CL', '생산하자분', 672, 2128, 16, 'mm', 1, 1.43, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5동.1205호-안방분합(외) 시공하자분.'),
    ('25-1150', 3, '5CL+6A+5CL', '생산하자분', 672, 2128, 16, 'mm', 1, 1.43, 'M2', NULL::NUMERIC, NULL::NUMERIC, '3동.1001호-안방분합(내) 시공하자분.'),
    ('25-1150', 4, '5CL+6A+5CL', '생산하자분', 672, 2128, 16, 'mm', 1, 1.43, 'M2', NULL::NUMERIC, NULL::NUMERIC, '4동.1001호-안방분합(내) 시공하자분.'),
    ('25-1150', 5, '5CL+12TPS+5LE', '생산하자분', 760, 1768, 22, 'mm', 1, 1.34, 'M2', NULL::NUMERIC, NULL::NUMERIC, '6동.801호-거실날개(내) 생산불량TPS'),
    ('25-1150', 6, '5CL+12TPS+5LE', '생산하자분', 755, 918, 22, 'mm', 1, 0.69, 'M2', NULL::NUMERIC, NULL::NUMERIC, '1동.601호-침실3(내) 시공하자분TPS'),
    ('25-1150', 7, '5GN+12TPS+5LE', '생산하자분', 760, 1768, 22, 'mm', 1, 1.34, 'M2', NULL::NUMERIC, NULL::NUMERIC, '3동.804호-거실날개(외) 시공하자분TPS'),
    ('25-1150', 8, '5GN+12TPS+5LE', '생산하자분', 305, 266, 22, 'mm', 2, 0.56, 'M2', NULL::NUMERIC, NULL::NUMERIC, '4동.903호-다용도실(단) 시공하자분TPS'),

    -- 25-1210: (주)동일토건 - 청주 개신2지구 (4라인)
    ('25-1210', 1, '5CL+12AR+5LE', 'P', 1727, 2008, 22, 'mm', 56, 194.21, 'M2', NULL::NUMERIC, NULL::NUMERIC, '10동2호카자리-거실대판(이중창) 84Bm2아르곤'),
    ('25-1210', 2, '5CL+12AR+5LE', 'P', 1727, 2008, 22, 'mm', 56, 194.21, 'M2', NULL::NUMERIC, NULL::NUMERIC, '10동3호카자리-거실대판(이중창) 84Cm2아르곤'),
    ('25-1210', 3, '5CL+12AR+5LE', 'P', 758, 2008, 22, 'mm', 112, 170.58, 'M2', NULL::NUMERIC, NULL::NUMERIC, '10동2호카자리-거실날개(이중창) 84Bm2아르곤'),
    ('25-1210', 4, '5CL+12AR+5LE', 'P', 758, 2008, 22, 'mm', 112, 170.58, 'M2', NULL::NUMERIC, NULL::NUMERIC, '10동3호카자리-거실날개(이중창) 84Cm2아르곤'),

    -- 25-1228: 중흥토건 - 평택브레인시티1BL(1공구) (4라인)
    ('25-1228', 1, '5GN+6A+5CL', 'P', 1105, 922, 16, 'mm', 7, 7.13, 'M2', NULL::NUMERIC, NULL::NUMERIC, '9동.1-10F-계단,EV홀 AW1'),
    ('25-1228', 2, '5GN+6A+5CL', 'P', 1105, 407, 16, 'mm', 3, 1.35, 'M2', NULL::NUMERIC, NULL::NUMERIC, '9동.1-10F-계단,EV홀 AW2'),
    ('25-1228', 3, '5GN+6A+5CL', 'P', 805, 722, 16, 'mm', 10, 5.82, 'M2', NULL::NUMERIC, NULL::NUMERIC, '9동.1-10F-계단,EV홀 AW3'),
    ('25-1228', 4, '5GN+6A+5CL', 'P', 975, 335, 16, 'mm', 3, 0.98, 'M2', NULL::NUMERIC, NULL::NUMERIC, '9동.1-10F-계단,EV홀 AW2'),

    -- 25-1249: 대우건설 - 운정3지구A-8BL (8라인)
    ('25-1249', 1, '5CL', 'FL', 1100, 625, 5, 'mm', 12, 8.26, 'M2', NULL::NUMERIC, NULL::NUMERIC, '3동1코어-계단창 일반'),
    ('25-1249', 2, '5CL', 'FL', 1100, 625, 5, 'mm', 3, 2.06, 'M2', NULL::NUMERIC, NULL::NUMERIC, '3동1코어-계단창 배연'),
    ('25-1249', 3, '5CL', 'FL', 1100, 525, 5, 'mm', 14, 8.09, 'M2', NULL::NUMERIC, NULL::NUMERIC, '3동1코어-EV홀'),
    ('25-1249', 4, '5CL', 'FL', 1100, 525, 5, 'mm', 16, 9.25, 'M2', NULL::NUMERIC, NULL::NUMERIC, '3동2코어-EV홀'),
    ('25-1249', 5, '5CL', 'FL', 1100, 515, 5, 'mm', 12, 6.8, 'M2', NULL::NUMERIC, NULL::NUMERIC, '3동1코어-계단창 일반'),
    ('25-1249', 6, '5CL', 'FL', 1000, 390, 5, 'mm', 3, 1.17, 'M2', NULL::NUMERIC, NULL::NUMERIC, '3동1코어-계단창 배연'),
    ('25-1249', 7, '5CL', 'FL', 1000, 390, 5, 'mm', 14, 5.46, 'M2', NULL::NUMERIC, NULL::NUMERIC, '3동1코어-EV홀'),
    ('25-1249', 8, '5CL', 'FL', 1000, 390, 5, 'mm', 16, 6.24, 'M2', NULL::NUMERIC, NULL::NUMERIC, '3동2코어-EV홀'),

    -- 25-1258: 디엘건설(주) - 대전역 센텀비스타 (5라인)
    ('25-1258', 1, '8.76(5GN+0.76+3CL)+12TPS+5LE', 'P', 1515, 855, 25.76, 'mm', 8, 10.37, 'M2', NULL::NUMERIC, NULL::NUMERIC, '102동31-34층1,2호-84C거실픽스 .TPS'),
    ('25-1258', 2, '8.76(5GN+0.76+3CL)+12TPS+5LE', 'P', 1515, 855, 25.76, 'mm', 4, 5.18, 'M2', NULL::NUMERIC, NULL::NUMERIC, '102동31-34층3호-84E거실픽스 .TPS'),
    ('25-1258', 3, '8.76(5GN+0.76+3CL)+12TPS+5LE', 'P', 740, 855, 25.76, 'mm', 16, 10.13, 'M2', NULL::NUMERIC, NULL::NUMERIC, '102동31-34층1,2호-84C거실픽스 .TPS'),
    ('25-1258', 4, '8.76(5GN+0.76+3CL)+12TPS+5LE', 'P', 740, 855, 25.76, 'mm', 8, 5.06, 'M2', NULL::NUMERIC, NULL::NUMERIC, '102동31-34층3호-84E거실픽스 .TPS'),
    ('25-1258', 5, '8.76(5GN+0.76+3CL)+12TPS+5LE', 'P', 625, 855, 25.76, 'mm', 8, 4.28, 'M2', NULL::NUMERIC, NULL::NUMERIC, '102동31-34층3호-84E발코니1픽스 .TPS'),

    -- 25-1296: 동부건설 - 대전기초과학연구원 (10라인)
    ('25-1296', 1, '10CL(TF)', 'FL', 1173, 2353, 10, 'mm', 1, 2.76, 'M2', NULL::NUMERIC, NULL::NUMERIC, '연구C동-1FAW11 FIX구간'),
    ('25-1296', 2, '10CL(TF)', 'FL', 543, 2353, 10, 'mm', 1, 1.28, 'M2', NULL::NUMERIC, NULL::NUMERIC, '연구C동-1FAW11 FIX구간'),
    ('25-1296', 3, '10CL(TF)', 'FL', 413, 2353, 10, 'mm', 1, 0.97, 'M2', NULL::NUMERIC, NULL::NUMERIC, '연구C동-1FAW11 FIX구간'),
    ('25-1296', 4, '10CL(TF)', 'FL', 383, 2353, 10, 'mm', 1, 0.9, 'M2', NULL::NUMERIC, NULL::NUMERIC, '연구C동-1FAW11 FIX구간'),
    ('25-1296', 5, '10CL(TF)', 'FL', 3253, 1563, 10, 'mm', 1, 5.09, 'M2', NULL::NUMERIC, NULL::NUMERIC, '연구C동-1FAW11 FIX구간'),
    ('25-1296', 6, '10CL(TF)', 'FL', 1173, 1563, 10, 'mm', 1, 1.83, 'M2', NULL::NUMERIC, NULL::NUMERIC, '연구C동-1FAW11 FIX구간'),
    ('25-1296', 7, '10CL(TF)', 'FL', 1053, 1563, 10, 'mm', 1, 1.65, 'M2', NULL::NUMERIC, NULL::NUMERIC, '연구C동-1FAW11 FIX구간'),
    ('25-1296', 8, '10CL(TF)', 'FL', 543, 1563, 10, 'mm', 1, 0.85, 'M2', NULL::NUMERIC, NULL::NUMERIC, '연구C동-1FAW11 FIX구간'),
    ('25-1296', 9, '10CL(TF)', 'FL', 413, 1563, 10, 'mm', 1, 0.65, 'M2', NULL::NUMERIC, NULL::NUMERIC, '연구C동-1FAW11 FIX구간'),
    ('25-1296', 10, '10CL(TF)', 'FL', 383, 1563, 10, 'mm', 1, 0.6, 'M2', NULL::NUMERIC, NULL::NUMERIC, '연구C동-1FAW11 FIX구간'),

    -- 25-1320: 디엘이앤씨(주) - e편한세상 부평그랑힐스 (10라인)
    ('25-1320', 1, '5CL(HS)', '생산하자분', 802, 1202, 5, 'mm', 1, 0.96, 'M2', NULL::NUMERIC, NULL::NUMERIC, '231동807호-스크래치중문 하자점검11차'),
    ('25-1320', 2, '5CL(HS)', '생산하자분', 802, 1202, 5, 'mm', 1, 0.96, 'M2', NULL::NUMERIC, NULL::NUMERIC, '231동2908호-스크래치 하자점검11차'),
    ('25-1320', 3, '5CL(HS)', '생산하자분', 802, 1202, 5, 'mm', 5, 4.82, 'M2', NULL::NUMERIC, NULL::NUMERIC, '231동여유분-. 하자점검11차'),
    ('25-1320', 4, '5CL(HS)', '생산하자분', 802, 590, 5, 'mm', 1, 0.47, 'M2', NULL::NUMERIC, NULL::NUMERIC, '231동3308호-스크래치중문 하자점검11차'),
    ('25-1320', 5, '5CL(HS)', '생산하자분', 802, 590, 5, 'mm', 5, 2.37, 'M2', NULL::NUMERIC, NULL::NUMERIC, '231동여유분-. 하자점검11차'),
    ('25-1320', 6, '5CL+12A+5CL', '생산하자분', 759, 2278, 22, 'mm', 1, 1.73, 'M2', NULL::NUMERIC, NULL::NUMERIC, '216동2601호-이물질침실1 하자점검11차'),
    ('25-1320', 7, '5CL+12A+5CL', '생산하자분', 759, 2278, 22, 'mm', 2, 3.46, 'M2', NULL::NUMERIC, NULL::NUMERIC, '225동803호-습기침실1 하자점검11차'),
    ('25-1320', 8, '5CL+12A+5CL', '생산하자분', 759, 2278, 22, 'mm', 2, 3.46, 'M2', NULL::NUMERIC, NULL::NUMERIC, '227동1804호-유리 붙음침실1 하자점검11차'),
    ('25-1320', 9, '5CL+12A+5CL', '생산하자분', 709, 2278, 22, 'mm', 2, 3.23, 'M2', NULL::NUMERIC, NULL::NUMERIC, '223동2901호-스크래치침실1 하자점검11차'),
    ('25-1320', 10, '5CL+12A+5CL', '생산하자분', 609, 2278, 22, 'mm', 2, 2.78, 'M2', NULL::NUMERIC, NULL::NUMERIC, '222동2805호-스크래치침실3 하자점검11차'),

    -- 25-1322: (주)한양 - 남양주 도곡2 주택재개발 (4라인)
    ('25-1322', 1, '10.76그린접합(5GN+0.76+5CL)+8A+5LE', '생산하자분', 1650, 1878, 23.76, 'mm', 1, 3.1, 'M2', NULL::NUMERIC, NULL::NUMERIC, '5동 1004호-거실외창대판'),
    ('25-1322', 2, '10.76그린접합(5GN+0.76+5CL)+8A+5LE', '생산하자분', 1150, 1878, 23.76, 'mm', 1, 2.16, 'M2', NULL::NUMERIC, NULL::NUMERIC, '1동 806호-거실외창대판'),
    ('25-1322', 3, '10.76그린접합(5GN+0.76+5CL)+8A+5LE', '생산하자분', 1124, 1878, 23.76, 'mm', 1, 2.11, 'M2', NULL::NUMERIC, NULL::NUMERIC, '12동 206호-거실외창대판'),
    ('25-1322', 4, '10.76그린접합(5GN+0.76+5CL)+8A+5LE', '생산하자분', 1124, 1878, 23.76, 'mm', 1, 2.11, 'M2', NULL::NUMERIC, NULL::NUMERIC, '12동 106호-거실외창대판'),

    -- 25-1392: PL창호 - 대광건영-평택브레인 (4라인)
    ('25-1392', 1, '5CL+12A+5CL', 'P', 320, 946, 22, 'mm', 2, 0.61, 'M2', 41066::NUMERIC, 24886::NUMERIC, '대피창-84B,101 .마크X'),
    ('25-1392', 2, '5CL+12A+5CL', 'P', 320, 946, 22, 'mm', 2, 0.61, 'M2', 41066::NUMERIC, 24886::NUMERIC, '대피창-84B,101 .마크X'),
    ('25-1392', 3, '5CL+12A+5CL', 'P', 320, 946, 22, 'mm', 1, 0.3, 'M2', 41066::NUMERIC, 12443::NUMERIC, '대피창-84A .마크X'),
    ('25-1392', 4, '5CL+12A+5CL', 'P', 320, 946, 22, 'mm', 1, 0.3, 'M2', 41066::NUMERIC, 12443::NUMERIC, '대피창-84A .마크X'),

    -- 25-1559: 롯데건설 - 광명2R (4라인)
    ('25-1559', 1, '투명접합(5CL+0.76PVB+5CL)', '시공하자분', 864, 877, 10.76, 'mm', 1, 0.76, 'M2', NULL::NUMERIC, NULL::NUMERIC, '하자점검9차-0201-2802 침실3난간대84A'),
    ('25-1559', 2, '투명접합(5CL+0.76PVB+5CL)', '시공하자분', 764, 877, 10.76, 'mm', 1, 0.67, 'M2', NULL::NUMERIC, NULL::NUMERIC, '하자점검9차-0202-1104 거실난간대59B'),
    ('25-1559', 3, '투명접합(5CL+0.76PVB+5CL)', '시공하자분', 714, 877, 10.76, 'mm', 2, 1.25, 'M2', NULL::NUMERIC, NULL::NUMERIC, '하자점검9차-0201-1201 거실난간대84B'),
    ('25-1559', 4, '투명접합(5CL+0.76PVB+5CL)', '시공하자분', 614, 877, 10.76, 'mm', 1, 0.54, 'M2', NULL::NUMERIC, NULL::NUMERIC, '하자점검9차-0208-1901 침실2난간대84C'),

    -- 25-1667: 현대엔지니어링(주) - 시흥장현지구 업무시설 (9라인)
    ('25-1667', 1, '10CL(TF)', '시공하자분', 1143, 2355, 10, 'mm', 1, 2.69, 'M2', NULL::NUMERIC, NULL::NUMERIC, '내부SSD-파손분 HEAT SOAK TEST 적용'),
    ('25-1667', 2, '10CL(TF)', '시공하자분', 1113, 2355, 10, 'mm', 1, 2.62, 'M2', NULL::NUMERIC, NULL::NUMERIC, '내부SSD-파손분 HEAT SOAK TEST 적용'),
    ('25-1667', 3, '10CL(TF)', '시공하자분', 1020, 2355, 10, 'mm', 1, 2.4, 'M2', NULL::NUMERIC, NULL::NUMERIC, '내부SSD-파손분 HEAT SOAK TEST 적용'),
    ('25-1667', 4, '10CL(TF)', 'FL', 245, 2355, 10, 'mm', 2, 1.15, 'M2', NULL::NUMERIC, NULL::NUMERIC, '내부방풍실-신규발주 HEAT SOAK TEST 적용'),
    ('25-1667', 5, '10CL(TF)', 'FL', 2100, 565, 10, 'mm', 2, 2.37, 'M2', NULL::NUMERIC, NULL::NUMERIC, '내부방풍실-신규발주 HEAT SOAK TEST 적용'),
    ('25-1667', 6, '10CL(TF)', '시공하자분', 1188, 565, 10, 'mm', 1, 0.67, 'M2', NULL::NUMERIC, NULL::NUMERIC, '내부SSD-파손분 HEAT SOAK TEST 적용'),
    ('25-1667', 7, '10CL(TF)', '시공하자분', 1113, 565, 10, 'mm', 1, 0.63, 'M2', NULL::NUMERIC, NULL::NUMERIC, '내부SSD-파손분 HEAT SOAK TEST 적용'),
    ('25-1667', 8, '10CL(TF)', '시공하자분', 1020, 565, 10, 'mm', 1, 0.58, 'M2', NULL::NUMERIC, NULL::NUMERIC, '내부SSD-파손분 HEAT SOAK TEST 적용'),
    ('25-1667', 9, '10CL(TF)', 'FL', 245, 565, 10, 'mm', 2, 0.56, 'M2', NULL::NUMERIC, NULL::NUMERIC, '내부방풍실-신규발주 HEAT SOAK TEST 적용'),

    -- 25-1876: 대성유리창호(주) - 용산 유엔사 (10라인)
    ('25-1876', 1, '5PLAONEII(HS)+5DURAMAX(HS)+5CL(HS)', 'P', 1657, 2409, 35, 'mm', 2, 7.98, 'M2', 37610::NUMERIC, 300278::NUMERIC, '3층1,5호-오피스텔D동1차 .롤텍,아르곤,엣지5+10+5+10+5'),
    ('25-1876', 2, '5PLAONEII(HS)+5DURAMAX(HS)+5CL(HS)', 'P', 957, 2409, 35, 'mm', 3, 6.92, 'M2', 37610::NUMERIC, 260186::NUMERIC, '3층2,3,4호-오피스텔D동1차 .롤텍,아르곤,엣지5+10+5+10+5'),
    ('25-1876', 3, '5PLAONEII(HS)+5DURAMAX(HS)+5CL(HS)', 'P', 942, 2409, 35, 'mm', 2, 4.54, 'M2', 37610::NUMERIC, 170749::NUMERIC, '3층1,5호-오피스텔D동1차 .롤텍,아르곤,엣지5+10+5+10+5'),
    ('25-1876', 4, '5PLAONEII(HS)+5DURAMAX(HS)+5CL(HS)', 'P', 757, 2409, 35, 'mm', 3, 5.47, 'M2', 37610::NUMERIC, 205802::NUMERIC, '3층2,3,4호-오피스텔D동1차 .롤텍,아르곤,엣지5+10+5+10+5'),
    ('25-1876', 5, '5PLAONEII(HS)+5DURAMAX(HS)+5CL(HS)', 'P', 742, 2409, 35, 'mm', 3, 5.36, 'M2', 37610::NUMERIC, 201740::NUMERIC, '3층2,3,4호-오피스텔D동1차 .롤텍,아르곤,엣지5+10+5+10+5'),
    ('25-1876', 6, '5PLAONEII(HS)+5DURAMAX(HS)+5CL(HS)', 'P', 457, 2409, 35, 'mm', 1, 1.1, 'M2', 37610::NUMERIC, 41409::NUMERIC, '3층1호-오피스텔D동1차 .롤텍,아르곤,엣지5+10+5+10+5'),
    ('25-1876', 7, '5PLAONEII(HS)+5DURAMAX(HS)+5CL(HS)', 'P', 800, 2320, 35, 'mm', 5, 9.28, 'M2', 37610::NUMERIC, 349021::NUMERIC, '3층1~5호-오피스텔D동1차 .롤텍,아르곤,엣지5+10+5+10+5'),
    ('25-1876', 8, '5PLAONEII(HS)+5DURAMAX(HS)+5CL(HS)', 'P', 468, 2299, 35, 'mm', 5, 5.38, 'M2', 37610::NUMERIC, 202342::NUMERIC, '3층1~5호-오피스텔D동1차 .롤텍,아르곤,엣지5+10+5+10+5'),
    ('25-1876', 9, '5PLAONEII(HS)+5DURAMAX(HS)+5CL(HS)', 'P', 902, 1140, 35, 'mm', 4, 4.12, 'M2', 37610::NUMERIC, 154803::NUMERIC, '3층1,2,3,4호-오피스텔D동1차 .롤텍,아르곤,엣지5+10+5+10+5'),
    ('25-1876', 10, '5PLAONEII(HS)+5DURAMAX(HS)+5CL(HS)', 'P', 800, 1125, 35, 'mm', 4, 3.6, 'M2', 37610::NUMERIC, 135396::NUMERIC, '3층1,2,3,4호-오피스텔D동1차 .롤텍,아르곤,엣지5+10+5+10+5')

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
WHERE h.order_no IN ('25-1138', '25-1139', '25-1150', '25-1210', '25-1228', '25-1249', '25-1258', '25-1296', '25-1320', '25-1322', '25-1392', '25-1559', '25-1667', '25-1876')
  AND (SELECT COALESCE(SUM(amount), 0) FROM hkgn.sales_order_detail d WHERE d.order_header_id = h.id) > 0;

-- 완료 메시지
SELECT
    '수주 헤더 ' || COUNT(DISTINCT h.id) || '건, ' ||
    '수주 상세 ' || COUNT(d.id) || '건 INSERT 완료' AS result
FROM hkgn.sales_order_header h
LEFT JOIN hkgn.sales_order_detail d ON d.order_header_id = h.id
WHERE h.order_no IN ('25-1138', '25-1139', '25-1150', '25-1210', '25-1228', '25-1249', '25-1258', '25-1296', '25-1320', '25-1322', '25-1392', '25-1559', '25-1667', '25-1876');
