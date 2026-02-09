-- ============================================
-- 출고 헤더 데이터 INSERT (샘플)
-- ============================================
-- 출처: ref/출고실적.xlsx
-- 생성일시: 2026-02-08
-- 설명: 출고 헤더 샘플 데이터
-- ============================================

INSERT INTO hkgn.delivery_header (
    delivery_no, delivery_date, order_no,
    customer_cd, transaction_type, special_notes,
    shipping_cost, shipping_tax, shipping_company,
    delivery_status
) VALUES
-- 26-0059: 주식회사 엘엑스글라스
('26-0059', '2026-02-03', '25-2588',
 'TEMP-BP-001', '정상', 'LX 서초(jk타워) : 12층 / NCR=>23조 (유리=>논산) 오후상차 / 익일 아침착(수)>>2월 03일출고',
 0, 0, NULL,
 'SHIPPED');

-- 완료 메시지
SELECT '출고 헤더 데이터 ' || COUNT(*) || '건 INSERT 완료' AS result
FROM hkgn.delivery_header;
