-- ============================================
-- 에칭유리 자재 INSERT (엑셀 데이터 기반)
-- material_type: ETCHED
-- category: 에칭유리
-- 기존 ETC001~ETC002 사용 중, ETC003부터 시작
-- ============================================

INSERT INTO hkgn.item_master (
    material_cd,
    material_type,
    category,
    material_nm,
    thickness,
    unit,
    is_active
) VALUES
('ETC003', 'ETCHED', '에칭유리', '투명에칭 6T', 6, 'EA', TRUE),
('ETC004', 'ETCHED', '에칭유리', '투명스리에칭 5T', 5, 'EA', TRUE),
('ETC005', 'ETCHED', '에칭유리', '투명스리 3T', 3, 'EA', TRUE),
('ETC006', 'ETCHED', '에칭유리', '투명스리 10T', 10, 'EA', TRUE),
('ETC007', 'ETCHED', '에칭유리', '투명스리 5T', 5, 'EA', TRUE),
('ETC008', 'ETCHED', '에칭유리', '에칭강화 5T', 5, 'EA', TRUE),
('ETC009', 'ETCHED', '에칭유리', '에칭 6T', 6, 'EA', TRUE),
('ETC010', 'ETCHED', '에칭유리', '스리에칭 3T', 3, 'EA', TRUE),
('ETC011', 'ETCHED', '에칭유리', '스리.각면 8T', 8, 'EA', TRUE),
('ETC012', 'ETCHED', '에칭유리', '스리 5T', 5, 'EA', TRUE),
('ETC013', 'ETCHED', '에칭유리', '샌드에칭 12T', 12, 'EA', TRUE),
('ETC014', 'ETCHED', '에칭유리', '그린에칭 8T', 8, 'EA', TRUE),
('ETC015', 'ETCHED', '에칭유리', '그린에칭 5T', 5, 'EA', TRUE);

-- 생성 완료 메시지
SELECT '에칭유리 자재 13건 INSERT 완료 (ETC003~ETC015)' AS result;
