-- ============================================
-- 출고 데이터 INSERT (수주 데이터 기반 자동 생성)
-- ============================================
-- 설명: sales_order_header/detail 에서 읽어서
--       delivery_header/detail 에 출고완료 상태로 INSERT
-- 대상 수주: 26-0154, 26-0155, 26-0156, 26-0157
-- 출고번호: 'DL' + order_no (예: DL26-0154)
-- 상태: 모두 DELIVERED (출고완료)
-- 생성일시: 2026-02-10
-- ============================================

SET search_path TO hkgn, public;

-- ============================================
-- STEP 1: delivery_header INSERT (수주 헤더 기반)
-- ============================================
-- 수주 1건당 출고 1건 생성
-- delivery_date = order_date + 7일 (생산 후 출고 가정)
-- actual_date = delivery_date (실제 출고 완료)
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
    'DL' || h.order_no                     AS delivery_no,        -- DL26-0154 형식
    h.order_date + INTERVAL '7 days'       AS delivery_date,      -- 주문일 + 7일
    h.order_date + INTERVAL '7 days'       AS actual_date,        -- 실출고일 = 출고예정일
    h.order_no,
    h.customer_cd,
    h.site_cd,
    '정상'                                  AS transaction_type,
    h.site_nm || ' 현장'                    AS delivery_address,   -- 현장명으로 주소 대체
    '12가3456'                              AS vehicle_no,         -- 샘플 차량번호
    '김운송'                                AS driver_nm,          -- 샘플 기사명
    '010-1234-5678'                         AS driver_phone,       -- 샘플 연락처
    '한국유리운송'                           AS shipping_company,
    50000                                   AS shipping_cost,      -- 운반비 5만원
    5000                                    AS shipping_tax,       -- 운반비 세액
    'DELIVERED'                             AS delivery_status,    -- 출고완료
    '수주 ' || h.order_no || ' 전량 출고완료' AS remarks
FROM hkgn.sales_order_header h
WHERE h.order_no IN ('26-0154', '26-0155', '26-0156', '26-0157')
ORDER BY h.order_no;

-- 결과 확인
SELECT delivery_no, delivery_date, order_no, customer_cd, site_cd, delivery_status
FROM hkgn.delivery_header
WHERE delivery_no LIKE 'DL26-015%'
ORDER BY delivery_no;

-- ============================================
-- STEP 2: delivery_detail INSERT (수주 상세 기반)
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
    'DL' || sd.order_no                    AS delivery_no,        -- DL26-0154 형식
    sd.line_seq                            AS line_no,            -- 수주 라인순번 = 출고 행번호
    sd.order_no,
    sd.line_seq                            AS order_line_no,      -- 수주 행번호 참조
    sd.material_cd,
    sd.material_nm,
    sd.product_category                    AS category,           -- P, R, S 등
    sd.thickness,
    sd.width,
    sd.height,
    sd.quantity                            AS order_quantity,      -- 주문수량
    0                                      AS unshipped_quantity,  -- 미출고 = 0 (전량 출고)
    sd.quantity                            AS delivery_qty,        -- 출고수량 = 주문수량 (전량)
    sd.unit,
    sd.area,
    sd.unit_price,
    COALESCE(sd.amount, sd.unit_price * sd.quantity)  AS amount,  -- 출고금액
    ROUND(COALESCE(sd.amount, sd.unit_price * sd.quantity, 0) * 0.1, 0) AS tax,  -- 세액 10%
    ROUND(COALESCE(sd.amount, sd.unit_price * sd.quantity, 0) * 1.1, 0) AS total_amount,  -- 총액
    'DELIVERED'                            AS line_status,         -- 출고완료
    NULL                                   AS remarks
FROM hkgn.sales_order_detail sd
WHERE sd.order_no IN ('26-0154', '26-0155', '26-0156', '26-0157')
ORDER BY sd.order_no, sd.line_seq;

-- ============================================
-- STEP 3: sales_order_detail 상태 업데이트
-- ============================================
-- 출고 완료된 수주 상세의 delivery_status 를 DELIVERED 로 변경
UPDATE hkgn.sales_order_detail
SET delivery_status = 'DELIVERED',
    updated_at = now()
WHERE order_no IN ('26-0154', '26-0155', '26-0156', '26-0157');

-- ============================================
-- STEP 4: sales_order_header 상태 업데이트
-- ============================================
-- 모든 라인이 출고 완료된 수주 헤더 상태를 COMPLETED 로 변경
UPDATE hkgn.sales_order_header
SET order_status = 'COMPLETED',
    updated_at = now()
WHERE order_no IN ('26-0154', '26-0155', '26-0156', '26-0157');

-- ============================================
-- STEP 5: 결과 확인
-- ============================================

-- 5-1. 출고 헤더 요약
SELECT
    '출고 헤더: ' || COUNT(*) || '건 INSERT 완료' AS result
FROM hkgn.delivery_header
WHERE delivery_no LIKE 'DL26-015%';

-- 5-2. 출고 상세 요약 (수주번호별)
SELECT
    dh.delivery_no,
    dh.order_no,
    dh.delivery_status,
    COUNT(dd.id) AS detail_count,
    SUM(dd.delivery_qty) AS total_qty,
    SUM(dd.area) AS total_area,
    SUM(dd.total_amount) AS total_amount
FROM hkgn.delivery_header dh
LEFT JOIN hkgn.delivery_detail dd ON dd.delivery_no = dh.delivery_no
WHERE dh.delivery_no LIKE 'DL26-015%'
GROUP BY dh.delivery_no, dh.order_no, dh.delivery_status
ORDER BY dh.delivery_no;

-- 5-3. 수주 대비 출고 정합성 검증
SELECT
    sd.order_no,
    COUNT(sd.id) AS order_lines,
    COUNT(dd.id) AS delivery_lines,
    CASE WHEN COUNT(sd.id) = COUNT(dd.id) THEN 'OK' ELSE 'MISMATCH' END AS check_result
FROM hkgn.sales_order_detail sd
LEFT JOIN hkgn.delivery_detail dd
    ON dd.order_no = sd.order_no
    AND dd.order_line_no = sd.line_seq
WHERE sd.order_no IN ('26-0154', '26-0155', '26-0156', '26-0157')
GROUP BY sd.order_no
ORDER BY sd.order_no;
