-- ============================================
-- 수주 샘플 데이터 3건 INSERT
-- ============================================
-- 기준: 26-0154 주문을 참조하여 생성
-- 새 주문번호: 26-0155, 26-0156, 26-0157
-- ============================================

-- ============================================
-- STEP 1: 수주 헤더 INSERT (3건)
-- ============================================
INSERT INTO hkgn.sales_order_header (
    order_no, order_date, delivery_date, customer_cd,
    order_type, order_kind, site_cd, site_nm,
    total_amount, tax_separate, duo_light, remarks,
    order_status
)
SELECT
    v.order_no,
    v.order_date,
    v.delivery_date,
    bp.bp_cd AS customer_cd,
    v.order_type,
    v.order_kind,
    v.site_cd,
    v.site_nm,
    v.total_amount,
    v.tax_separate,
    v.duo_light,
    v.remarks,
    v.order_status
FROM (VALUES
    ('26-0155', '2026-01-29'::DATE, NULL::DATE, '주식회사 엘엑스글라스', '완제품', 'P', '1공장', '서초동ABC타워', 0, FALSE, '듀오라이트', '14층', 'PENDING'),
    ('26-0156', '2026-01-30'::DATE, NULL::DATE, '주식회사 엘엑스글라스', '완제품', 'P', '2공장', '강남DEF빌딩', 0, FALSE, '듀오라이트', '15층', 'PENDING'),
    ('26-0157', '2026-01-31'::DATE, NULL::DATE, '주식회사 엘엑스글라스', '완제품', 'P', '1공장', '송파GHI타워', 0, FALSE, '듀오라이트', '16층', 'PENDING')
) AS v(order_no, order_date, delivery_date, customer_nm, order_type, order_kind, site_cd, site_nm, total_amount, tax_separate, duo_light, remarks, order_status)
LEFT JOIN hkgn.business_partner bp ON bp.bp_nm = v.customer_nm;

-- ============================================
-- STEP 2-1: 수주 상세 INSERT - 26-0155 (40 라인)
-- ============================================
INSERT INTO hkgn.sales_order_detail (
    order_header_id, order_no, line_seq,
    material_cd, material_nm, product_category,
    width, height, thickness, unit_type,
    quantity, area, unit, unit_price, amount,
    dong, ho, window_type, remarks,
    production_status, delivery_status
)
SELECT
    h.id AS order_header_id,
    v.order_no,
    v.line_seq,
    COALESCE(im.material_cd, 'UNKNOWN') AS material_cd,
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
    v.dong,
    v.ho,
    v.window_type,
    v.remarks,
    'PENDING' AS production_status,
    'PENDING' AS delivery_status
FROM (VALUES
    ('26-0155', 1, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 1685, 26, 'mm', 1, 2.166, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#2SPANDREL', 'JK-035', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 2, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 1685, 26, 'mm', 2, 4.332, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#2SPANDREL', 'JK-035A', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 3, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 1685, 26, 'mm', 1, 2.166, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#2SPANDREL', 'JK-037', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 4, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 1685, 26, 'mm', 6, 11.73, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#2SPANDREL', 'JK-015E', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 5, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 2, 2.566, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-018', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 6, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 2, 2.566, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-019', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 7, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 1, 1.283, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-035', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 8, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 2, 2.566, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-035A', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 9, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 1, 1.283, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-037', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 10, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 998, 26, 'mm', 9, 11.322, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-002', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 11, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 998, 26, 'mm', 3, 3.774, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-002A', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 12, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 998, 26, 'mm', 3, 3.774, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-011우힌지', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 13, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 998, 26, 'mm', 3, 3.774, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-011좌힌지', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 14, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1235, 998, 26, 'mm', 1, 1.233, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-005', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 15, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1235, 998, 26, 'mm', 1, 1.233, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-021', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 16, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1235, 998, 26, 'mm', 1, 1.233, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-022', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 17, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1195, 998, 26, 'mm', 1, 1.193, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-006', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 18, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1195, 998, 26, 'mm', 1, 1.193, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-050D', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 19, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 998, 26, 'mm', 1, 1.183, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-010', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 20, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 998, 26, 'mm', 1, 1.183, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-012', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 21, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 998, 26, 'mm', 1, 1.183, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-024', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 22, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 998, 26, 'mm', 1, 1.183, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-025', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 23, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1170, 998, 26, 'mm', 1, 1.168, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-044', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 24, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1170, 998, 26, 'mm', 1, 1.168, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-045D', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 25, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 19, 22.002, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-015', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 26, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 6, 6.948, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-015E', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 27, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 2, 2.316, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-015F', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 28, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 1, 1.158, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-015FA', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 29, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 2, 2.316, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-015G', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 30, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 4, 4.632, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-033', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 31, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 1, 1.158, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-047D', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 32, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1085, 998, 26, 'mm', 1, 1.083, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-014', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 33, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1085, 998, 26, 'mm', 1, 1.083, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-016', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 34, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1060, 998, 26, 'mm', 2, 2.116, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-007', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 35, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1060, 998, 26, 'mm', 2, 2.116, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-008', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 36, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1045, 998, 26, 'mm', 1, 1.043, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#1SPANDREL', 'JK-039', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 37, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 725, 26, 'mm', 1, 0.932, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#3SPANDREL', 'JK-035', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 38, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 725, 26, 'mm', 2, 1.864, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#3SPANDREL', 'JK-035A', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 39, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 725, 26, 'mm', 1, 0.932, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#3SPANDREL', 'JK-037', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0155', 40, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 725, 26, 'mm', 6, 5.046, 'M2', NULL::NUMERIC, NULL::NUMERIC, '14층#3SPANDREL', 'JK-015E', 'FixSpandrel', 'sws,아르곤,982,엣지')
) AS v(order_no, line_seq, material_nm, product_category, width, height, thickness, unit_type, quantity, area, unit, unit_price, amount, dong, ho, window_type, remarks)
JOIN hkgn.sales_order_header h ON h.order_no = v.order_no
LEFT JOIN hkgn.item_master im ON im.material_nm = v.material_nm;

-- ============================================
-- STEP 2-2: 수주 상세 INSERT - 26-0156 (60 라인)
-- ============================================
INSERT INTO hkgn.sales_order_detail (
    order_header_id, order_no, line_seq,
    material_cd, material_nm, product_category,
    width, height, thickness, unit_type,
    quantity, area, unit, unit_price, amount,
    dong, ho, window_type, remarks,
    production_status, delivery_status
)
SELECT
    h.id AS order_header_id,
    v.order_no,
    v.line_seq,
    COALESCE(im.material_cd, 'UNKNOWN') AS material_cd,
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
    v.dong,
    v.ho,
    v.window_type,
    v.remarks,
    'PENDING' AS production_status,
    'PENDING' AS delivery_status
FROM (VALUES
    ('26-0156', 1, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 1685, 26, 'mm', 1, 2.166, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#2SPANDREL', 'JK-035', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 2, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 1685, 26, 'mm', 2, 4.332, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#2SPANDREL', 'JK-035A', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 3, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 1685, 26, 'mm', 1, 2.166, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#2SPANDREL', 'JK-037', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 4, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 1685, 26, 'mm', 6, 11.73, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#2SPANDREL', 'JK-015E', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 5, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 2, 2.566, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-018', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 6, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 2, 2.566, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-019', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 7, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 1, 1.283, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-035', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 8, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 2, 2.566, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-035A', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 9, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 1, 1.283, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-037', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 10, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 998, 26, 'mm', 9, 11.322, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-002', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 11, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 998, 26, 'mm', 3, 3.774, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-002A', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 12, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 998, 26, 'mm', 3, 3.774, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-011우힌지', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 13, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 998, 26, 'mm', 3, 3.774, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-011좌힌지', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 14, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1235, 998, 26, 'mm', 1, 1.233, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-005', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 15, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1235, 998, 26, 'mm', 1, 1.233, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-021', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 16, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1235, 998, 26, 'mm', 1, 1.233, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-022', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 17, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1195, 998, 26, 'mm', 1, 1.193, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-006', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 18, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1195, 998, 26, 'mm', 1, 1.193, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-050D', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 19, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 998, 26, 'mm', 1, 1.183, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-010', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 20, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 998, 26, 'mm', 1, 1.183, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-012', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 21, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 998, 26, 'mm', 1, 1.183, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-024', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 22, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 998, 26, 'mm', 1, 1.183, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-025', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 23, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1170, 998, 26, 'mm', 1, 1.168, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-044', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 24, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1170, 998, 26, 'mm', 1, 1.168, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-045D', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 25, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 19, 22.002, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-015', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 26, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 6, 6.948, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-015E', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 27, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 2, 2.316, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-015F', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 28, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 1, 1.158, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-015FA', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 29, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 2, 2.316, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-015G', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 30, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 4, 4.632, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-033', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 31, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 1, 1.158, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-047D', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 32, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1085, 998, 26, 'mm', 1, 1.083, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-014', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 33, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1085, 998, 26, 'mm', 1, 1.083, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-016', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 34, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1060, 998, 26, 'mm', 2, 2.116, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-007', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 35, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1060, 998, 26, 'mm', 2, 2.116, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-008', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 36, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1045, 998, 26, 'mm', 1, 1.043, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#1SPANDREL', 'JK-039', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 37, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 725, 26, 'mm', 1, 0.932, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#3SPANDREL', 'JK-035', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 38, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 725, 26, 'mm', 2, 1.864, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#3SPANDREL', 'JK-035A', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 39, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 725, 26, 'mm', 1, 0.932, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#3SPANDREL', 'JK-037', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 40, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 725, 26, 'mm', 6, 5.046, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#3SPANDREL', 'JK-015E', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 41, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 498, 26, 'mm', 1, 0.64, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-035', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 42, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 498, 26, 'mm', 2, 1.28, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-035A', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 43, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 498, 26, 'mm', 1, 0.64, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-037', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 44, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 498, 26, 'mm', 6, 3.468, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-015E', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 45, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1210, 498, 26, 'mm', 1, 0.603, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-026', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 46, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1210, 498, 26, 'mm', 1, 0.603, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-028', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 47, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1135, 498, 26, 'mm', 1, 0.565, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-043', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 48, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 498, 26, 'mm', 9, 5.648, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-002', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 49, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 498, 26, 'mm', 3, 1.883, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-002A', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 50, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 498, 26, 'mm', 3, 1.883, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-011우힌지', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 51, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 498, 26, 'mm', 3, 1.883, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-011좌힌지', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 52, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1235, 498, 26, 'mm', 1, 0.615, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-005', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 53, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1235, 498, 26, 'mm', 1, 0.615, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-021', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 54, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1235, 498, 26, 'mm', 1, 0.615, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-022', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 55, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1195, 498, 26, 'mm', 1, 0.595, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-006', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 56, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1195, 498, 26, 'mm', 1, 0.595, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-050D', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 57, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 498, 26, 'mm', 1, 0.59, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-010', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 58, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 498, 26, 'mm', 1, 0.59, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-012', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 59, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 498, 26, 'mm', 1, 0.59, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-024', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0156', 60, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 498, 26, 'mm', 1, 0.59, 'M2', NULL::NUMERIC, NULL::NUMERIC, '15층#4SPANDREL', 'JK-025', 'FixSpandrel', 'sws,아르곤,982,엣지')
) AS v(order_no, line_seq, material_nm, product_category, width, height, thickness, unit_type, quantity, area, unit, unit_price, amount, dong, ho, window_type, remarks)
JOIN hkgn.sales_order_header h ON h.order_no = v.order_no
LEFT JOIN hkgn.item_master im ON im.material_nm = v.material_nm;

-- ============================================
-- STEP 2-3: 수주 상세 INSERT - 26-0157 (30 라인)
-- ============================================
INSERT INTO hkgn.sales_order_detail (
    order_header_id, order_no, line_seq,
    material_cd, material_nm, product_category,
    width, height, thickness, unit_type,
    quantity, area, unit, unit_price, amount,
    dong, ho, window_type, remarks,
    production_status, delivery_status
)
SELECT
    h.id AS order_header_id,
    v.order_no,
    v.line_seq,
    COALESCE(im.material_cd, 'UNKNOWN') AS material_cd,
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
    v.dong,
    v.ho,
    v.window_type,
    v.remarks,
    'PENDING' AS production_status,
    'PENDING' AS delivery_status
FROM (VALUES
    ('26-0157', 1, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 1685, 26, 'mm', 1, 2.166, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#2SPANDREL', 'JK-035', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 2, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 1685, 26, 'mm', 2, 4.332, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#2SPANDREL', 'JK-035A', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 3, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 1685, 26, 'mm', 1, 2.166, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#2SPANDREL', 'JK-037', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 4, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 1685, 26, 'mm', 6, 11.73, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#2SPANDREL', 'JK-015E', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 5, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 2, 2.566, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-018', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 6, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 2, 2.566, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-019', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 7, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 1, 1.283, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-035', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 8, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 2, 2.566, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-035A', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 9, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 1, 1.283, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-037', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 10, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 998, 26, 'mm', 9, 11.322, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-002', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 11, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 998, 26, 'mm', 3, 3.774, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-002A', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 12, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 998, 26, 'mm', 3, 3.774, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-011우힌지', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 13, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 998, 26, 'mm', 3, 3.774, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-011좌힌지', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 14, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1235, 998, 26, 'mm', 1, 1.233, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-005', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 15, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1235, 998, 26, 'mm', 1, 1.233, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-021', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 16, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1235, 998, 26, 'mm', 1, 1.233, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-022', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 17, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1195, 998, 26, 'mm', 1, 1.193, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-006', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 18, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1195, 998, 26, 'mm', 1, 1.193, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-050D', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 19, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 998, 26, 'mm', 1, 1.183, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-010', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 20, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 998, 26, 'mm', 1, 1.183, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-012', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 21, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 998, 26, 'mm', 1, 1.183, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-024', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 22, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 998, 26, 'mm', 1, 1.183, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-025', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 23, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1170, 998, 26, 'mm', 1, 1.168, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-044', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 24, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1170, 998, 26, 'mm', 1, 1.168, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-045D', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 25, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 19, 22.002, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-015', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 26, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 6, 6.948, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-015E', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 27, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 2, 2.316, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-015F', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 28, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 1, 1.158, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-015FA', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 29, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 2, 2.316, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-015G', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0157', 30, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 4, 4.632, 'M2', NULL::NUMERIC, NULL::NUMERIC, '16층#1SPANDREL', 'JK-033', 'FixSpandrel', 'sws,아르곤,982,엣지')
) AS v(order_no, line_seq, material_nm, product_category, width, height, thickness, unit_type, quantity, area, unit, unit_price, amount, dong, ho, window_type, remarks)
JOIN hkgn.sales_order_header h ON h.order_no = v.order_no
LEFT JOIN hkgn.item_master im ON im.material_nm = v.material_nm;

-- ============================================
-- STEP 3: 총액 업데이트 (옵션)
-- ============================================
-- detail의 금액 합계를 header에 반영
UPDATE hkgn.sales_order_header h
SET total_amount = (
    SELECT COALESCE(SUM(amount), 0)
    FROM hkgn.sales_order_detail d
    WHERE d.order_header_id = h.id
)
WHERE h.order_no IN ('26-0155', '26-0156', '26-0157');

-- 완료 메시지
SELECT
    '수주 헤더 ' || COUNT(DISTINCT h.id) || '건, ' ||
    '수주 상세 ' || COUNT(d.id) || '건 INSERT 완료' AS result
FROM hkgn.sales_order_header h
LEFT JOIN hkgn.sales_order_detail d ON d.order_header_id = h.id
WHERE h.order_no IN ('26-0155', '26-0156', '26-0157');
