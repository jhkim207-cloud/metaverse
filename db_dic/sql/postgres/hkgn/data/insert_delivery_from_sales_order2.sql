-- ============================================
-- 출고 데이터 INSERT (미처리 수주 전체 일괄 생성)
-- ============================================
-- 설명: sales_order_header/detail 중 아직 delivery_header에
--       등록되지 않은 COMPLETED 수주를 전량 출고 처리
-- 대상: 2024년(24-xxxx), 2025년(25-xxxx) 미처리 수주 전체
-- 제외: 이미 delivery_header에 존재하는 수주 (DL26-015x 등)
-- 출고번호: 'DL' + order_no (예: DL24-1892)
-- 상태: 모두 DELIVERED (출고완료)
-- 생성일시: 2026-02-10
-- ============================================

SET search_path TO hkgn, public;

-- ============================================
-- 사전 확인: 미처리 수주 목록
-- ============================================
SELECT
    h.order_no,
    h.order_date,
    h.customer_cd,
    h.site_nm,
    h.order_status,
    '미처리' AS delivery_status
FROM hkgn.sales_order_header h
WHERE h.order_status = 'COMPLETED'
  AND NOT EXISTS (
      SELECT 1 FROM hkgn.delivery_header dh
      WHERE dh.order_no = h.order_no
  )
ORDER BY h.order_no;

-- ============================================
-- STEP 1: delivery_header INSERT (미처리 수주 전체)
-- ============================================
-- 수주 1건당 출고 1건 생성
-- delivery_date = order_date + 7일 (생산 후 출고 가정)
-- actual_date = delivery_date (실제 출고 완료)
-- site_nm이 NULL인 경우 고객사 직납으로 처리
-- ============================================
INSERT INTO hkgn.delivery_header (
    delivery_no,
    delivery_date,
    actual_date,
    order_no,
    customer_cd,
    site_cd,
    transaction_type,
    delivery_address,
    vehicle_no,
    driver_nm,
    driver_phone,
    shipping_company,
    shipping_cost,
    shipping_tax,
    delivery_status,
    remarks
)
SELECT
    'DL' || h.order_no                                      AS delivery_no,
    h.order_date + INTERVAL '7 days'                        AS delivery_date,
    h.order_date + INTERVAL '7 days'                        AS actual_date,
    h.order_no,
    h.customer_cd,
    h.site_cd,
    '정상'                                                   AS transaction_type,
    COALESCE(h.site_nm, h.customer_cd) || ' 현장'            AS delivery_address,
    '12가3456'                                               AS vehicle_no,
    '김운송'                                                 AS driver_nm,
    '010-1234-5678'                                          AS driver_phone,
    '한국유리운송'                                            AS shipping_company,
    50000                                                    AS shipping_cost,
    5000                                                     AS shipping_tax,
    'DELIVERED'                                              AS delivery_status,
    '수주 ' || h.order_no || ' 전량 출고완료'                  AS remarks
FROM hkgn.sales_order_header h
WHERE h.order_status = 'COMPLETED'
  AND NOT EXISTS (
      SELECT 1 FROM hkgn.delivery_header dh
      WHERE dh.order_no = h.order_no
  )
ORDER BY h.order_no;

-- STEP 1 결과 확인
SELECT
    '출고 헤더 INSERT: ' || COUNT(*) || '건' AS result
FROM hkgn.delivery_header
WHERE delivery_no LIKE 'DL24-%' OR delivery_no LIKE 'DL25-%';

-- ============================================
-- STEP 2: delivery_detail INSERT (미처리 수주 상세 전체)
-- ============================================
-- 수주 상세 1건당 출고 상세 1건 생성
-- delivery_qty = quantity (전량 출고)
-- unshipped_quantity = 0 (미출고 없음)
-- amount = unit_price * quantity (또는 원본 amount)
-- tax = amount * 0.1
-- total_amount = amount + tax
-- ============================================
INSERT INTO hkgn.delivery_detail (
    delivery_no,
    line_no,
    order_no,
    order_line_no,
    material_cd,
    material_nm,
    category,
    thickness,
    width,
    height,
    order_quantity,
    unshipped_quantity,
    delivery_qty,
    unit,
    area,
    unit_price,
    amount,
    tax,
    total_amount,
    line_status,
    remarks
)
SELECT
    'DL' || sd.order_no                                                             AS delivery_no,
    sd.line_seq                                                                     AS line_no,
    sd.order_no,
    sd.line_seq                                                                     AS order_line_no,
    sd.material_cd,
    sd.material_nm,
    sd.product_category                                                             AS category,
    sd.thickness,
    sd.width,
    sd.height,
    sd.quantity                                                                      AS order_quantity,
    0                                                                                AS unshipped_quantity,
    sd.quantity                                                                      AS delivery_qty,
    sd.unit,
    sd.area,
    sd.unit_price,
    COALESCE(sd.amount, sd.unit_price * sd.quantity)                                 AS amount,
    ROUND(COALESCE(sd.amount, sd.unit_price * sd.quantity, 0) * 0.1, 0)              AS tax,
    ROUND(COALESCE(sd.amount, sd.unit_price * sd.quantity, 0) * 1.1, 0)              AS total_amount,
    'DELIVERED'                                                                      AS line_status,
    NULL                                                                             AS remarks
FROM hkgn.sales_order_detail sd
INNER JOIN hkgn.delivery_header dh ON dh.order_no = sd.order_no
WHERE dh.delivery_no LIKE 'DL24-%' OR dh.delivery_no LIKE 'DL25-%'
  AND NOT EXISTS (
      SELECT 1 FROM hkgn.delivery_detail dd
      WHERE dd.delivery_no = 'DL' || sd.order_no
        AND dd.line_no = sd.line_seq
  )
ORDER BY sd.order_no, sd.line_seq;

-- STEP 2 결과 확인
SELECT
    '출고 상세 INSERT: ' || COUNT(*) || '건' AS result
FROM hkgn.delivery_detail dd
INNER JOIN hkgn.delivery_header dh ON dh.delivery_no = dd.delivery_no
WHERE dh.delivery_no LIKE 'DL24-%' OR dh.delivery_no LIKE 'DL25-%';

-- ============================================
-- STEP 3: sales_order_detail 상태 업데이트
-- ============================================
-- 출고 완료된 수주 상세의 delivery_status 를 DELIVERED 로 변경
UPDATE hkgn.sales_order_detail sd
SET delivery_status = 'DELIVERED',
    updated_at = now()
FROM hkgn.delivery_header dh
WHERE dh.order_no = sd.order_no
  AND (dh.delivery_no LIKE 'DL24-%' OR dh.delivery_no LIKE 'DL25-%');

-- ============================================
-- STEP 4: sales_order_header 상태 업데이트
-- ============================================
-- 이미 COMPLETED인 것이 대부분이지만, 혹시 빠진 건 갱신
UPDATE hkgn.sales_order_header h
SET order_status = 'COMPLETED',
    updated_at = now()
FROM hkgn.delivery_header dh
WHERE dh.order_no = h.order_no
  AND (dh.delivery_no LIKE 'DL24-%' OR dh.delivery_no LIKE 'DL25-%')
  AND h.order_status != 'COMPLETED';

-- ============================================
-- STEP 5: 결과 확인
-- ============================================

-- 5-1. 연도별 출고 헤더 요약
SELECT
    LEFT(delivery_no, 4) AS year_prefix,
    COUNT(*) AS header_count
FROM hkgn.delivery_header
WHERE delivery_no LIKE 'DL%'
GROUP BY LEFT(delivery_no, 4)
ORDER BY year_prefix;

-- 5-2. 연도별 출고 상세 요약
SELECT
    LEFT(dd.delivery_no, 4) AS year_prefix,
    COUNT(*) AS detail_count,
    SUM(dd.delivery_qty) AS total_qty,
    SUM(dd.area) AS total_area,
    SUM(dd.total_amount) AS total_amount
FROM hkgn.delivery_detail dd
WHERE dd.delivery_no LIKE 'DL%'
GROUP BY LEFT(dd.delivery_no, 4)
ORDER BY year_prefix;

-- 5-3. 수주 대비 출고 정합성 검증 (미처리 수주 잔여 확인)
SELECT
    h.order_no,
    h.order_date,
    h.customer_cd,
    h.order_status,
    CASE
        WHEN dh.delivery_no IS NOT NULL THEN 'O 출고완료'
        ELSE 'X 미처리'
    END AS delivery_check
FROM hkgn.sales_order_header h
LEFT JOIN hkgn.delivery_header dh ON dh.order_no = h.order_no
WHERE h.order_status = 'COMPLETED'
ORDER BY h.order_no;

-- 5-4. 출고 상세 수량 일치 검증
SELECT
    sd.order_no,
    COUNT(sd.id) AS order_lines,
    COUNT(dd.id) AS delivery_lines,
    CASE WHEN COUNT(sd.id) = COUNT(dd.id) THEN 'OK' ELSE 'MISMATCH' END AS check_result
FROM hkgn.sales_order_detail sd
LEFT JOIN hkgn.delivery_detail dd
    ON dd.order_no = sd.order_no
    AND dd.order_line_no = sd.line_seq
WHERE sd.order_no LIKE '24-%' OR sd.order_no LIKE '25-%'
GROUP BY sd.order_no
ORDER BY sd.order_no;
