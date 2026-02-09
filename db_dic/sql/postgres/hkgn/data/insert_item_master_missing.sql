-- ============================================
-- 누락 자재 INSERT (기존 INSERT 스크립트 참조 자재 보완)
-- 작성일: 2026-02-09
-- 스키마: hkgn
-- 데이터 수: 8건 (원판 1, 부자재 5, 운반용기 2)
-- 사유: goods_receipt, inventory, purchase_order_detail,
--       container_inventory 샘플데이터에서 참조하지만
--       item_master에 없는 자재 코드 추가
-- ============================================

SET search_path TO hkgn, public;

-- ============================================
-- 원판 (RAW) - 1건 추가 (기존: RAW001~RAW101)
-- ============================================
INSERT INTO hkgn.item_master (
    material_cd, material_type, category, material_nm, thickness, unit, is_active
) VALUES
('RAW102', 'RAW', '원판', 'DURA MAX 5T', 5, 'EA', TRUE);

-- ============================================
-- 부자재 (SUB) - 5건 추가 (기존: SUB001~SUB030)
-- ============================================
INSERT INTO hkgn.item_master (
    material_cd, material_type, category, material_nm, thickness, unit, is_active
) VALUES
('SUB031', 'SUB', '부자재', 'SWS-16m/m(5.5m)', NULL, 'BOX', TRUE),
('SUB032', 'SUB', '부자재', '16T단열코너키 (SWS 전용)', NULL, 'BOX', TRUE),
('SUB033', 'SUB', '부자재', '실리콘 (투명)', NULL, 'BOX', TRUE),
('SUB034', 'SUB', '부자재', '실리콘 (블랙)', NULL, 'BOX', TRUE),
('SUB035', 'SUB', '부자재', '부틸테이프 6mm', NULL, 'BOX', TRUE);

-- ============================================
-- 운반용기 (CONTAINER) - 2건 추가 (기존: CNT001~CNT051)
-- ============================================
INSERT INTO hkgn.item_master (
    material_cd, material_type, category, material_nm, thickness, unit, is_active
) VALUES
('CNT052', 'CONTAINER', '운반용기', 'CF2', NULL, 'EA', TRUE),
('CNT053', 'CONTAINER', '운반용기', 'LG2', NULL, 'EA', TRUE);

SELECT '누락 자재 8건 INSERT 완료 (RAW102, SUB031~SUB035, CNT052~CNT053)' AS result;
