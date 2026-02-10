-- ============================================
-- 출고 상세 데이터 INSERT (샘플)
-- ============================================
-- 출처: ref/출고실적.xlsx
-- 생성일시: 2026-02-08
-- 설명: 출고 상세 샘플 데이터 (26-0059)
-- ============================================

INSERT INTO hkgn.delivery_detail (
    delivery_no, line_no, order_no,
    material_cd, material_nm, category,
    thickness, width, height,
    order_quantity, unshipped_quantity, delivery_qty, unit, area,
    unit_price, amount, tax, total_amount,
    line_status, remarks
) VALUES
-- 26-0059: 주식회사 엘엑스글라스 - LX 서초(jk타워) 12층
('26-0059', 1, '25-2588',
 'TEMP-MAT-001', '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P',
 26, 1285, 1198,
 2, 2, 2, 'M2', 3.08,
 44002, 135526, 0, 135526,
 'DELIVERED', '12층#1SPANDREL-JK-018A/FixSpandrel sws,아르곤,982,엣지'),

('26-0059', 2, '25-2588',
 'TEMP-MAT-001', '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P',
 26, 1285, 1198,
 2, 2, 2, 'M2', 3.08,
 44002, 135526, 0, 135526,
 'DELIVERED', '12층#1SPANDREL-JK-019A/FixSpandrel sws,아르곤,982,엣지'),

('26-0059', 3, '25-2588',
 'TEMP-MAT-001', '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P',
 26, 1260, 1198,
 9, 9, 9, 'M2', 13.59,
 44002, 597987, 0, 597987,
 'DELIVERED', '12층#1SPANDREL-JK-002A/FixSpandrel sws,아르곤,982,엣지'),

('26-0059', 4, '25-2588',
 'TEMP-MAT-001', '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P',
 26, 1260, 1198,
 6, 6, 6, 'M2', 9.06,
 44002, 398658, 0, 398658,
 'DELIVERED', '12층#1SPANDREL-JK-011A/FixSpandrel sws,아르곤,982,엣지'),

('26-0059', 5, '25-2588',
 'TEMP-MAT-001', '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P',
 26, 1235, 1198,
 1, 1, 1, 'M2', 1.48,
 44002, 65122, 0, 65122,
 'DELIVERED', '12층#1SPANDREL-JK-005A/FixSpandrel sws,아르곤,982,엣지'),

('26-0059', 6, '25-2588',
 'TEMP-MAT-001', '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P',
 26, 1235, 1198,
 1, 1, 1, 'M2', 1.48,
 44002, 65122, 0, 65122,
 'DELIVERED', '12층#1SPANDREL-JK-021A/FixSpandrel sws,아르곤,982,엣지'),

('26-0059', 7, '25-2588',
 'TEMP-MAT-001', '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P',
 26, 1235, 1198,
 1, 1, 1, 'M2', 1.48,
 44002, 65122, 0, 65122,
 'LOADED', '12층#1SPANDREL-JK-022A/FixSpandrel sws,아르곤,982,엣지'),

('26-0059', 8, '25-2588',
 'TEMP-MAT-001', '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P',
 26, 1195, 1198,
 1, 1, 1, 'M2', 1.432,
 44002, 63010, 0, 63010,
 'LOADED', '12층#1SPANDREL-JK-006A/FixSpandrel sws,아르곤,982,엣지'),

('26-0059', 9, '25-2588',
 'TEMP-MAT-001', '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P',
 26, 1185, 1198,
 1, 1, 1, 'M2', 1.42,
 44002, 62482, 0, 62482,
 'PICKED', '12층#1SPANDREL-JK-010A/FixSpandrel sws,아르곤,982,엣지'),

('26-0059', 10, '25-2588',
 'TEMP-MAT-001', '5SKG139T(HS)+16AR(단열)+5CL(HS)', 'P',
 26, 1185, 1198,
 1, 1, 1, 'M2', 1.42,
 44002, 62482, 0, 62482,
 'PENDING', '12층#1SPANDREL-JK-012A/FixSpandrel sws,아르곤,982,엣지');

-- 완료 메시지
SELECT '출고 상세 데이터 ' || COUNT(*) || '건 INSERT 완료' AS result
FROM hkgn.delivery_detail;
