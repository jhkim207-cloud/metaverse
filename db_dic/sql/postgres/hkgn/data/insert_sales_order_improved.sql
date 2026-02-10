-- ============================================
-- 수주 데이터 INSERT (개선 버전)
-- ============================================
-- 특징:
-- 1. customer_cd를 거래처명으로 자동 매핑
-- 2. material_cd를 품명으로 자동 매핑
-- 3. 모든 신규 컬럼 포함 (order_type, site_nm, tax_separate, duo_light 등)
-- ============================================

-- ============================================
-- STEP 1: 수주 헤더 INSERT
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
    bp.bp_cd AS customer_cd,  -- 거래처명으로 자동 매핑
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
    ('26-0154', '2026-01-28'::DATE, NULL::DATE, '주식회사 엘엑스글라스', '완제품', 'P', '1공장', '서초동JK타워', 0, FALSE, '듀오라이트', '13층', 'PENDING')
) AS v(order_no, order_date, delivery_date, customer_nm, order_type, order_kind, site_cd, site_nm, total_amount, tax_separate, duo_light, remarks, order_status)
LEFT JOIN hkgn.business_partner bp ON bp.bp_nm = v.customer_nm;

-- ============================================
-- STEP 2: 수주 상세 INSERT
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
    COALESCE(im.material_cd, 'UNKNOWN') AS material_cd,  -- 품명 매핑 (없으면 UNKNOWN)
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
    ('26-0154', 1, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 1685, 26, 'mm', 1, 2.166, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#2SPANDREL', 'JK-035', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 2, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 1685, 26, 'mm', 2, 4.332, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#2SPANDREL', 'JK-035A', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 3, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 1685, 26, 'mm', 1, 2.166, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#2SPANDREL', 'JK-037', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 4, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 1685, 26, 'mm', 6, 11.73, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#2SPANDREL', 'JK-015E', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 5, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 2, 2.566, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-018', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 6, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 2, 2.566, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-019', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 7, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 1, 1.283, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-035', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 8, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 2, 2.566, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-035A', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 9, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 998, 26, 'mm', 1, 1.283, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-037', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 10, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 998, 26, 'mm', 9, 11.322, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-002', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 11, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 998, 26, 'mm', 3, 3.774, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-002A', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 12, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 998, 26, 'mm', 3, 3.774, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-011우힌지', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 13, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 998, 26, 'mm', 3, 3.774, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-011좌힌지', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 14, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1235, 998, 26, 'mm', 1, 1.233, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-005', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 15, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1235, 998, 26, 'mm', 1, 1.233, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-021', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 16, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1235, 998, 26, 'mm', 1, 1.233, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-022', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 17, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1195, 998, 26, 'mm', 1, 1.193, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-006', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 18, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1195, 998, 26, 'mm', 1, 1.193, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-050D', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 19, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 998, 26, 'mm', 1, 1.183, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-010', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 20, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 998, 26, 'mm', 1, 1.183, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-012', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 21, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 998, 26, 'mm', 1, 1.183, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-024', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 22, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 998, 26, 'mm', 1, 1.183, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-025', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 23, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1170, 998, 26, 'mm', 1, 1.168, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-044', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 24, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1170, 998, 26, 'mm', 1, 1.168, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-045D', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 25, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 19, 22.002, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-015', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 26, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 6, 6.948, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-015E', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 27, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 2, 2.316, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-015F', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 28, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 1, 1.158, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-015FA', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 29, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 2, 2.316, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-015G', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 30, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 4, 4.632, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-033', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 31, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 998, 26, 'mm', 1, 1.158, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-047D', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 32, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1085, 998, 26, 'mm', 1, 1.083, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-014', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 33, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1085, 998, 26, 'mm', 1, 1.083, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-016', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 34, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1060, 998, 26, 'mm', 2, 2.116, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-007', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 35, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1060, 998, 26, 'mm', 2, 2.116, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-008', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 36, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1045, 998, 26, 'mm', 1, 1.043, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-039', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 37, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 725, 26, 'mm', 1, 0.932, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#3SPANDREL', 'JK-035', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 38, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 725, 26, 'mm', 2, 1.864, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#3SPANDREL', 'JK-035A', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 39, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 725, 26, 'mm', 1, 0.932, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#3SPANDREL', 'JK-037', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 40, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 725, 26, 'mm', 6, 5.046, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#3SPANDREL', 'JK-015E', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 41, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 498, 26, 'mm', 1, 0.64, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-035', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 42, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 498, 26, 'mm', 2, 1.28, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-035A', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 43, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1285, 498, 26, 'mm', 1, 0.64, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-037', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 44, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 498, 26, 'mm', 6, 3.468, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-015E', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 45, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1210, 498, 26, 'mm', 1, 0.603, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-026', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 46, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1210, 498, 26, 'mm', 1, 0.603, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-028', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 47, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1135, 498, 26, 'mm', 1, 0.565, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-043', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 48, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 498, 26, 'mm', 9, 5.648, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-002', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 49, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 498, 26, 'mm', 3, 1.883, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-002A', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 50, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 498, 26, 'mm', 3, 1.883, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-011우힌지', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 51, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1260, 498, 26, 'mm', 3, 1.883, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-011좌힌지', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 52, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1235, 498, 26, 'mm', 1, 0.615, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-005', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 53, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1235, 498, 26, 'mm', 1, 0.615, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-021', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 54, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1235, 498, 26, 'mm', 1, 0.615, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-022', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 55, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1195, 498, 26, 'mm', 1, 0.595, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-006', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 56, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1195, 498, 26, 'mm', 1, 0.595, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-050D', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 57, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 498, 26, 'mm', 1, 0.59, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-010', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 58, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 498, 26, 'mm', 1, 0.59, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-012', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 59, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 498, 26, 'mm', 1, 0.59, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-024', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 60, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1185, 498, 26, 'mm', 1, 0.59, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-025', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 61, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1170, 498, 26, 'mm', 1, 0.583, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-044', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 62, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1170, 498, 26, 'mm', 1, 0.583, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-045D', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 63, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 498, 26, 'mm', 19, 10.977, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-015', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 64, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 498, 26, 'mm', 6, 3.466, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-015E', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 65, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 498, 26, 'mm', 2, 1.156, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-015F', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 66, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 498, 26, 'mm', 1, 0.578, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-015FA', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 67, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 498, 26, 'mm', 2, 1.156, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-015G', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 68, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 498, 26, 'mm', 4, 2.312, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-033', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 69, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1160, 498, 26, 'mm', 1, 0.578, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-047D', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 70, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1085, 498, 26, 'mm', 1, 0.54, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-014', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 71, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1085, 498, 26, 'mm', 1, 0.54, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-016', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 72, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1060, 498, 26, 'mm', 2, 1.056, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-007', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 73, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1060, 498, 26, 'mm', 2, 1.056, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-008', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 74, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1045, 498, 26, 'mm', 1, 0.52, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-039', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 75, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1600, 1685, 26, 'mm', 6, 16.176, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#2SPANDREL', 'JK-017', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 76, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1600, 1685, 26, 'mm', 6, 16.176, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#2SPANDREL', 'JK-030', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 77, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1575, 1685, 26, 'mm', 1, 2.654, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#2SPANDREL', 'JK-031', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 78, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1575, 1685, 26, 'mm', 1, 2.654, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#2SPANDREL', 'JK-032', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 79, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1550, 1685, 26, 'mm', 1, 2.612, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#2SPANDREL', 'JK-009', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 80, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1530, 1685, 26, 'mm', 1, 2.578, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#2SPANDREL', 'JK-001', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 81, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1530, 1685, 26, 'mm', 1, 2.578, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#2SPANDREL', 'JK-034', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 82, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1530, 1685, 26, 'mm', 1, 2.578, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#2SPANDREL', 'JK-036', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 83, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1530, 1685, 26, 'mm', 1, 2.578, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#2SPANDREL', 'JK-038', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 84, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1530, 1685, 26, 'mm', 1, 2.578, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#2SPANDREL', 'JK-040', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 85, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1530, 1685, 26, 'mm', 1, 2.578, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#2SPANDREL', 'JK-042', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 86, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1365, 1685, 26, 'mm', 1, 2.3, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#2SPANDREL', 'JK-023', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 87, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1315, 1685, 26, 'mm', 1, 2.216, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#2SPANDREL', 'JK-020', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 88, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1210, 1685, 26, 'mm', 1, 2.039, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#2SPANDREL', 'JK-003', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 89, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1600, 998, 26, 'mm', 6, 9.565, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-017', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 90, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1600, 998, 26, 'mm', 6, 9.565, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-030', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 91, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1575, 998, 26, 'mm', 1, 1.572, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-031', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 92, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1575, 998, 26, 'mm', 1, 1.572, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-032', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 93, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1550, 998, 26, 'mm', 1, 1.547, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-009', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 94, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1530, 998, 26, 'mm', 1, 1.527, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-001', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 95, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1530, 998, 26, 'mm', 1, 1.527, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-034', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 96, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1530, 998, 26, 'mm', 1, 1.527, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-036', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 97, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1530, 998, 26, 'mm', 1, 1.527, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-038', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 98, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1530, 998, 26, 'mm', 1, 1.527, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-040', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 99, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1530, 998, 26, 'mm', 1, 1.527, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-042', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 100, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1365, 998, 26, 'mm', 1, 1.362, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-023', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 101, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1315, 998, 26, 'mm', 1, 1.312, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-020', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 102, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1210, 998, 26, 'mm', 1, 1.208, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#1SPANDREL', 'JK-003', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 103, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1600, 725, 26, 'mm', 6, 6.96, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#3SPANDREL', 'JK-017', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 104, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1600, 725, 26, 'mm', 6, 6.96, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#3SPANDREL', 'JK-030', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 105, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1575, 725, 26, 'mm', 1, 1.142, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#3SPANDREL', 'JK-031', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 106, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1575, 725, 26, 'mm', 1, 1.142, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#3SPANDREL', 'JK-032', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 107, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1550, 725, 26, 'mm', 1, 1.124, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#3SPANDREL', 'JK-009', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 108, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1530, 725, 26, 'mm', 1, 1.109, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#3SPANDREL', 'JK-001', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 109, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1530, 725, 26, 'mm', 1, 1.109, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#3SPANDREL', 'JK-034', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 110, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1530, 725, 26, 'mm', 1, 1.109, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#3SPANDREL', 'JK-036', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 111, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1530, 725, 26, 'mm', 1, 1.109, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#3SPANDREL', 'JK-038', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 112, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1530, 725, 26, 'mm', 1, 1.109, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#3SPANDREL', 'JK-040', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 113, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1530, 725, 26, 'mm', 1, 1.109, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#3SPANDREL', 'JK-042', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 114, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1365, 725, 26, 'mm', 1, 0.99, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#3SPANDREL', 'JK-023', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 115, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1315, 725, 26, 'mm', 1, 0.954, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#3SPANDREL', 'JK-020', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 116, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1210, 725, 26, 'mm', 1, 0.877, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#3SPANDREL', 'JK-003', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 117, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1600, 498, 26, 'mm', 6, 4.781, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-017', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 118, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1600, 498, 26, 'mm', 6, 4.781, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-030', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 119, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1210, 498, 26, 'mm', 1, 0.603, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-003', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 120, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1315, 498, 26, 'mm', 1, 0.655, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-020', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 121, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1365, 498, 26, 'mm', 1, 0.68, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-023', 'FixSpandrel', 'sws,아르곤,982,엣지'),
    ('26-0154', 122, '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P', 1530, 498, 26, 'mm', 6, 4.57, 'M2', NULL::NUMERIC, NULL::NUMERIC, '13층#4SPANDREL', 'JK-001/034/036/038/040/042', 'FixSpandrel', 'sws,아르곤,982,엣지')
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
WHERE h.order_no = '26-0154';

-- 완료 메시지
SELECT
    '수주 헤더 ' || COUNT(DISTINCT h.id) || '건, ' ||
    '수주 상세 ' || COUNT(d.id) || '건 INSERT 완료' AS result
FROM hkgn.sales_order_header h
LEFT JOIN hkgn.sales_order_detail d ON d.order_header_id = h.id
WHERE h.order_no = '26-0154';
