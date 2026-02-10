-- ============================================
-- 포장지시 데이터 INSERT (출고 데이터 기반 자동 생성)
-- ============================================
-- 설명: delivery_header/detail 에서 읽어서
--       packing_order 에 포장완료 상태로 INSERT
-- 대상 출고: DL26-0154, DL26-0155, DL26-0156, DL26-0157
-- 포장번호: 'PK' + order_no + '-' + line_no (예: PK26-0154-001)
-- 상태: packing_status = COMPLETED (포장완료)
-- 생성일시: 2026-02-10
-- ============================================

SET search_path TO hkgn, public;

-- ============================================
-- STEP 1: packing_order INSERT (출고 상세 기반)
-- ============================================
-- 출고 상세 1건당 포장지시 1건 생성
-- packing_date = delivery_date - 1일 (출고 전일 포장 가정)
-- packing_qty = delivery_qty (출고수량 = 포장수량)
-- ============================================
INSERT INTO hkgn.packing_order (
    packing_no,
    packing_date,
    order_no,
    material_cd,
    material_nm,
    packing_qty,
    unit,
    packing_status,
    remarks
)
SELECT
    'PK' || dd.order_no || '-' || LPAD(dd.line_no::TEXT, 3, '0')  AS packing_no,
    dh.delivery_date - INTERVAL '1 day'                            AS packing_date,
    dd.order_no,
    dd.material_cd,
    dd.material_nm,
    dd.delivery_qty                                                AS packing_qty,
    COALESCE(dd.unit, 'EA')                                        AS unit,
    'COMPLETED'                                                    AS packing_status,
    '출고 ' || dd.delivery_no || ' 라인 ' || dd.line_no || ' 포장완료' AS remarks
FROM hkgn.delivery_detail dd
JOIN hkgn.delivery_header dh ON dh.delivery_no = dd.delivery_no
WHERE dh.delivery_no IN ('DL26-0154', 'DL26-0155', 'DL26-0156', 'DL26-0157')
ORDER BY dd.order_no, dd.line_no;

-- ============================================
-- STEP 2: 결과 확인
-- ============================================

-- 2-1. 수주번호별 포장지시 요약
SELECT
    po.order_no,
    COUNT(*) AS packing_count,
    SUM(po.packing_qty) AS total_qty,
    po.packing_status
FROM hkgn.packing_order po
WHERE po.packing_no LIKE 'PK26-015%'
GROUP BY po.order_no, po.packing_status
ORDER BY po.order_no;

-- 2-2. 출고 대비 포장 정합성 검증
SELECT
    dd.order_no,
    COUNT(dd.id) AS delivery_lines,
    COUNT(po.id) AS packing_lines,
    CASE WHEN COUNT(dd.id) = COUNT(po.id) THEN 'OK' ELSE 'MISMATCH' END AS check_result
FROM hkgn.delivery_detail dd
LEFT JOIN hkgn.packing_order po
    ON po.packing_no = 'PK' || dd.order_no || '-' || LPAD(dd.line_no::TEXT, 3, '0')
WHERE dd.delivery_no IN ('DL26-0154', 'DL26-0155', 'DL26-0156', 'DL26-0157')
GROUP BY dd.order_no
ORDER BY dd.order_no;

-- 2-3. 전체 요약
SELECT
    '포장지시: ' || COUNT(*) || '건 INSERT 완료 (모두 COMPLETED)' AS result
FROM hkgn.packing_order
WHERE packing_no LIKE 'PK26-015%';
