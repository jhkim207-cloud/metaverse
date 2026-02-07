-- ============================================
-- 테이블: item_master
-- 설명: 자재 마스터 샘플 데이터
-- 작성일: 2026-02-07
-- 스키마: hkgn
-- 데이터 수: 20개 (제품 5, 원판 5, 부자재 5, 강화 2, 에칭 2, 용기 1)
-- ============================================

-- 완제품 (PRODUCT)
INSERT INTO hkgn.item_master (material_cd, material_type, category, material_nm, thickness, spec_remark, color_type, unit, cost_price, list_price, purchase_price, selling_price, supplier_cd, sf_count, mf_count, glass_count, is_active, created_at, updated_at) VALUES
('PRD001', 'PRODUCT', '복층유리', '복층유리 16T (5CL+6A+5CL) 투명', 16.00, '5mm 투명 + 6mm 공기층 + 5mm 투명', '투명', 'M2', 35000, 50000, 0, 45000, NULL, 1.5, 2.0, 2, TRUE, '2025-01-10 08:00:00+09', '2025-01-10 08:00:00+09'),
('PRD002', 'PRODUCT', '복층유리', '복층유리 22T (6CL+12A+6CL) 그린', 22.00, '6mm 그린 + 12mm 공기층 + 6mm 투명', '그린', 'M2', 42000, 60000, 0, 55000, NULL, 1.8, 2.3, 2, TRUE, '2025-01-10 08:00:00+09', '2025-01-10 08:00:00+09'),
('PRD003', 'PRODUCT', '복층유리', '복층유리 24T (8CL+8A+8CL) 로이', 24.00, '8mm 로이 + 8mm 아르곤 + 8mm 투명', '로이', 'M2', 55000, 75000, 0, 68000, NULL, 2.0, 2.5, 2, TRUE, '2025-01-12 09:00:00+09', '2025-01-12 09:00:00+09'),
('PRD004', 'PRODUCT', '복층유리', '복층유리 28T (10CL+8A+10CL) 브론즈', 28.00, '10mm 브론즈 + 8mm 공기층 + 10mm 투명', '브론즈', 'M2', 60000, 82000, 0, 75000, NULL, 2.2, 2.8, 2, TRUE, '2025-01-15 10:00:00+09', '2025-01-15 10:00:00+09'),
('PRD005', 'PRODUCT', '복층유리', '복층유리 32T (12CL+8A+12CL) 투명', 32.00, '12mm 투명 + 8mm 공기층 + 12mm 투명', '투명', 'M2', 68000, 92000, 0, 85000, NULL, 2.5, 3.0, 2, TRUE, '2025-01-18 11:00:00+09', '2025-01-18 11:00:00+09');

-- 원판 (RAW)
INSERT INTO hkgn.item_master (material_cd, material_type, category, material_nm, thickness, spec_remark, color_type, unit, cost_price, list_price, purchase_price, selling_price, supplier_cd, sf_count, mf_count, glass_count, is_active, created_at, updated_at) VALUES
('RAW001', 'RAW', '원판', '원판 5T 투명 (2440x3660)', 5.00, '2440mm x 3660mm 투명유리', '투명', 'EA', 18000, 25000, 17000, 0, 'P001', 0.8, 1.0, 1, TRUE, '2025-01-10 08:00:00+09', '2025-01-10 08:00:00+09'),
('RAW002', 'RAW', '원판', '원판 6T 투명 (2440x3660)', 6.00, '2440mm x 3660mm 투명유리', '투명', 'EA', 22000, 30000, 20000, 0, 'P001', 1.0, 1.2, 1, TRUE, '2025-01-10 08:00:00+09', '2025-01-10 08:00:00+09'),
('RAW003', 'RAW', '원판', '원판 8T 그린 (2440x3660)', 8.00, '2440mm x 3660mm 그린유리', '그린', 'EA', 28000, 38000, 26000, 0, 'P002', 1.2, 1.5, 1, TRUE, '2025-01-12 09:00:00+09', '2025-01-12 09:00:00+09'),
('RAW004', 'RAW', '원판', '원판 10T 브론즈 (2440x3660)', 10.00, '2440mm x 3660mm 브론즈유리', '브론즈', 'EA', 35000, 48000, 32000, 0, 'P002', 1.5, 1.8, 1, TRUE, '2025-01-15 10:00:00+09', '2025-01-15 10:00:00+09'),
('RAW005', 'RAW', '원판', '원판 12T 로이 (2440x3660)', 12.00, '2440mm x 3660mm 로이유리', '로이', 'EA', 42000, 58000, 38000, 0, 'P005', 1.8, 2.2, 1, TRUE, '2025-01-18 11:00:00+09', '2025-01-18 11:00:00+09');

-- 부자재 (SUB)
INSERT INTO hkgn.item_master (material_cd, material_type, category, material_nm, thickness, spec_remark, color_type, unit, cost_price, list_price, purchase_price, selling_price, supplier_cd, is_active, created_at, updated_at) VALUES
('SUB001', 'SUB', '스페이서', '알루미늄 스페이서 6A', 6.00, '6mm 알루미늄 스페이서', NULL, 'M', 1200, 1800, 1100, 0, 'P003', TRUE, '2025-01-10 08:00:00+09', '2025-01-10 08:00:00+09'),
('SUB002', 'SUB', '스페이서', '알루미늄 스페이서 8A', 8.00, '8mm 알루미늄 스페이서', NULL, 'M', 1400, 2000, 1300, 0, 'P003', TRUE, '2025-01-10 08:00:00+09', '2025-01-10 08:00:00+09'),
('SUB003', 'SUB', '스페이서', '알루미늄 스페이서 12A', 12.00, '12mm 알루미늄 스페이서', NULL, 'M', 1800, 2500, 1700, 0, 'P003', TRUE, '2025-01-12 09:00:00+09', '2025-01-12 09:00:00+09'),
('SUB004', 'SUB', '실란트', '1차 부틸 9.5mm', NULL, '1차 부틸 실란트', NULL, 'M', 2200, 3000, 2000, 0, 'P004', TRUE, '2025-01-15 10:00:00+09', '2025-01-15 10:00:00+09'),
('SUB005', 'SUB', '실란트', '2차 실리콘 검정', NULL, '2차 실리콘 실란트 검정', NULL, 'EA', 8500, 12000, 8000, 0, 'P004', TRUE, '2025-01-18 11:00:00+09', '2025-01-18 11:00:00+09');

-- 강화 (TEMPERED)
INSERT INTO hkgn.item_master (material_cd, material_type, category, material_nm, thickness, spec_remark, color_type, unit, cost_price, list_price, purchase_price, selling_price, supplier_cd, is_active, created_at, updated_at) VALUES
('TMP001', 'TEMPERED', '강화유리', '강화유리 5T 투명', 5.00, '5mm 강화유리 투명', '투명', 'M2', 12000, 18000, 0, 16000, NULL, TRUE, '2025-01-10 08:00:00+09', '2025-01-10 08:00:00+09'),
('TMP002', 'TEMPERED', '강화유리', '강화유리 6T 그린', 6.00, '6mm 강화유리 그린', '그린', 'M2', 14000, 20000, 0, 18000, NULL, TRUE, '2025-01-12 09:00:00+09', '2025-01-12 09:00:00+09');

-- 에칭 (ETCHED)
INSERT INTO hkgn.item_master (material_cd, material_type, category, material_nm, thickness, spec_remark, color_type, unit, cost_price, list_price, purchase_price, selling_price, supplier_cd, is_active, created_at, updated_at) VALUES
('ETC001', 'ETCHED', '에칭유리', '에칭유리 5T 무광', 5.00, '5mm 에칭유리 무광', NULL, 'M2', 15000, 22000, 0, 20000, NULL, TRUE, '2025-01-15 10:00:00+09', '2025-01-15 10:00:00+09'),
('ETC002', 'ETCHED', '에칭유리', '에칭유리 6T 유광', 6.00, '6mm 에칭유리 유광', NULL, 'M2', 18000, 25000, 0, 23000, NULL, TRUE, '2025-01-18 11:00:00+09', '2025-01-18 11:00:00+09');

-- 용기 (CONTAINER)
INSERT INTO hkgn.item_master (material_cd, material_type, category, material_nm, thickness, spec_remark, color_type, unit, cost_price, list_price, purchase_price, selling_price, supplier_cd, is_active, created_at, updated_at) VALUES
('CNT001', 'CONTAINER', '운반용기', '강철 운반틀 2440x3660용', NULL, '2440x3660 유리 운반용 강철틀', NULL, 'EA', 180000, 250000, 170000, 0, 'P003', TRUE, '2025-01-10 08:00:00+09', '2025-01-10 08:00:00+09');
