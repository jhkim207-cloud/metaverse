-- ============================================
-- 강화유리 자재 INSERT (엑셀 데이터 기반)
-- material_type: TEMPERED
-- category: 강화유리
-- 기존 TMP001~TMP002 사용 중, TMP003부터 시작
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
('TMP003', 'TEMPERED', '강화유리', 'SKN163강화 6T', 6, 'EA', TRUE),
('TMP004', 'TEMPERED', '강화유리', '하드로이반강화 5T', 5, 'EA', TRUE),
('TMP005', 'TEMPERED', '강화유리', '투명반강화 5T', 5, 'EA', TRUE),
('TMP006', 'TEMPERED', '강화유리', '투명반강화 8T', 8, 'EA', TRUE),
('TMP007', 'TEMPERED', '강화유리', '투명반강화 12T', 12, 'EA', TRUE),
('TMP008', 'TEMPERED', '강화유리', '투명강화각면 5T', 5, 'EA', TRUE),
('TMP009', 'TEMPERED', '강화유리', '투명강화각면 10T', 10, 'EA', TRUE),
('TMP010', 'TEMPERED', '강화유리', '투명강화각면 8T', 8, 'EA', TRUE),
('TMP011', 'TEMPERED', '강화유리', '투명강화.에칭 6T', 6, 'EA', TRUE),
('TMP012', 'TEMPERED', '강화유리', '투명강화.에칭 10T', 10, 'EA', TRUE),
('TMP013', 'TEMPERED', '강화유리', '투명각면 10T', 10, 'EA', TRUE),
('TMP014', 'TEMPERED', '강화유리', '투명(T/F) 5T', 5, 'EA', TRUE),
('TMP015', 'TEMPERED', '강화유리', '투명(T/F) 10T', 10, 'EA', TRUE),
('TMP016', 'TEMPERED', '강화유리', '투명(T/F) 8T', 8, 'EA', TRUE),
('TMP017', 'TEMPERED', '강화유리', '투명 5T', 5, 'EA', TRUE),
('TMP018', 'TEMPERED', '강화유리', '투(T/S)투 24T', 24, 'EA', TRUE),
('TMP019', 'TEMPERED', '강화유리', '양면반강화 6T', 6, 'EA', TRUE),
('TMP020', 'TEMPERED', '강화유리', '양면강화 5T', 5, 'EA', TRUE),
('TMP021', 'TEMPERED', '강화유리', '샌드에칭.강화 12T', 12, 'EA', TRUE),
('TMP022', 'TEMPERED', '강화유리', '샌드에칭 6T', 6, 'EA', TRUE),
('TMP023', 'TEMPERED', '강화유리', '블루반사L23(T/F) 6T', 6, 'EA', TRUE),
('TMP024', 'TEMPERED', '강화유리', '블루반사L23(H/S) 6T', 6, 'EA', TRUE),
('TMP025', 'TEMPERED', '강화유리', '블루강화 5T', 5, 'EA', TRUE),
('TMP026', 'TEMPERED', '강화유리', '미스트강화 5T', 5, 'EA', TRUE),
('TMP027', 'TEMPERED', '강화유리', '디아망(T/S) 10T', 10, 'EA', TRUE),
('TMP028', 'TEMPERED', '강화유리', '디아망(H/S) 6T', 6, 'EA', TRUE),
('TMP029', 'TEMPERED', '강화유리', '그린반강화 6T', 6, 'EA', TRUE),
('TMP030', 'TEMPERED', '강화유리', '그린반강화 5T', 5, 'EA', TRUE),
('TMP031', 'TEMPERED', '강화유리', '그린강화 8T', 8, 'EA', TRUE),
('TMP032', 'TEMPERED', '강화유리', '그린강화 10T', 10, 'EA', TRUE),
('TMP033', 'TEMPERED', '강화유리', '그린강화 5T', 5, 'EA', TRUE),
('TMP034', 'TEMPERED', '강화유리', '그린(T/S)투명(T/S) 20T', 20, 'EA', TRUE),
('TMP035', 'TEMPERED', '강화유리', '그린 8T', 8, 'EA', TRUE),
('TMP036', 'TEMPERED', '강화유리', '강화가공(하드로이) 5T', 5, 'EA', TRUE),
('TMP037', 'TEMPERED', '강화유리', '강화가공(블루) 5T', 5, 'EA', TRUE),
('TMP038', 'TEMPERED', '강화유리', '강화가공 5T', 5, 'EA', TRUE),
('TMP039', 'TEMPERED', '강화유리', '강화가공 6T', 6, 'EA', TRUE),
('TMP040', 'TEMPERED', '강화유리', '강화가공 12T', 12, 'EA', TRUE),
('TMP041', 'TEMPERED', '강화유리', '강화 12T', 12, 'EA', TRUE);

-- 생성 완료 메시지
SELECT '강화유리 자재 39건 INSERT 완료 (TMP003~TMP041)' AS result;
