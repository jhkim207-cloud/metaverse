-- ============================================
-- 운반용기 자재 INSERT (엑셀 데이터 기반)
-- material_type: CONTAINER
-- category: 운반용기
-- 기존 CNT001 사용 중, CNT002부터 시작
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
('CNT002', 'CONTAINER', '운반용기', 'FO2', NULL, 'EA', TRUE),
('CNT003', 'CONTAINER', '운반용기', 'G14', NULL, 'EA', TRUE),
('CNT004', 'CONTAINER', '운반용기', 'k3', NULL, 'EA', TRUE),
('CNT005', 'CONTAINER', '운반용기', 'k4', NULL, 'EA', TRUE),
('CNT006', 'CONTAINER', '운반용기', 'G13', NULL, 'EA', TRUE),
('CNT007', 'CONTAINER', '운반용기', 'METAL', NULL, 'EA', TRUE),
('CNT008', 'CONTAINER', '운반용기', 'G16', NULL, 'EA', TRUE),
('CNT009', 'CONTAINER', '운반용기', 'K5', NULL, 'EA', TRUE),
('CNT010', 'CONTAINER', '운반용기', 'G15', NULL, 'EA', TRUE),
('CNT011', 'CONTAINER', '운반용기', 'P', NULL, 'EA', TRUE),
('CNT012', 'CONTAINER', '운반용기', 'M15', NULL, 'EA', TRUE),
('CNT013', 'CONTAINER', '운반용기', 'K2', NULL, 'EA', TRUE),
('CNT014', 'CONTAINER', '운반용기', 'G12', NULL, 'EA', TRUE),
('CNT015', 'CONTAINER', '운반용기', '유니트철통', NULL, 'EA', TRUE),
('CNT016', 'CONTAINER', '운반용기', 'M14', NULL, 'EA', TRUE),
('CNT017', 'CONTAINER', '운반용기', 'M13', NULL, 'EA', TRUE),
('CNT018', 'CONTAINER', '운반용기', 'G602', NULL, 'EA', TRUE),
('CNT019', 'CONTAINER', '운반용기', 'G550', NULL, 'EA', TRUE),
('CNT020', 'CONTAINER', '운반용기', 'G11', NULL, 'EA', TRUE),
('CNT021', 'CONTAINER', '운반용기', '자가', NULL, 'EA', TRUE),
('CNT022', 'CONTAINER', '운반용기', 'K17', NULL, 'EA', TRUE),
('CNT023', 'CONTAINER', '운반용기', '금강A1', NULL, 'EA', TRUE),
('CNT024', 'CONTAINER', '운반용기', 'FO1', NULL, 'EA', TRUE),
('CNT025', 'CONTAINER', '운반용기', 'F2', NULL, 'EA', TRUE),
('CNT026', 'CONTAINER', '운반용기', 'K41', NULL, 'EA', TRUE),
('CNT027', 'CONTAINER', '운반용기', '자가철통', NULL, 'EA', TRUE),
('CNT028', 'CONTAINER', '운반용기', '파레트', NULL, 'EA', TRUE),
('CNT029', 'CONTAINER', '운반용기', '소계', NULL, 'EA', TRUE),
('CNT030', 'CONTAINER', '운반용기', '문짝', NULL, 'EA', TRUE),
('CNT031', 'CONTAINER', '운반용기', '보증금', NULL, 'EA', TRUE),
('CNT032', 'CONTAINER', '운반용기', '뚜껑', NULL, 'EA', TRUE),
('CNT033', 'CONTAINER', '운반용기', 'G15 뚜껑', NULL, 'EA', TRUE),
('CNT034', 'CONTAINER', '운반용기', 'G17', NULL, 'EA', TRUE),
('CNT035', 'CONTAINER', '운반용기', 'G20', NULL, 'EA', TRUE),
('CNT036', 'CONTAINER', '운반용기', 'G21', NULL, 'EA', TRUE),
('CNT037', 'CONTAINER', '운반용기', 'DP6', NULL, 'EA', TRUE),
('CNT038', 'CONTAINER', '운반용기', 'G19', NULL, 'EA', TRUE),
('CNT039', 'CONTAINER', '운반용기', 'LG후렘', NULL, 'EA', TRUE),
('CNT040', 'CONTAINER', '운반용기', 'FK2', NULL, 'EA', TRUE),
('CNT041', 'CONTAINER', '운반용기', '자가후렘', NULL, 'EA', TRUE),
('CNT042', 'CONTAINER', '운반용기', 'HEG', NULL, 'EA', TRUE),
('CNT043', 'CONTAINER', '운반용기', 'C철', NULL, 'EA', TRUE),
('CNT044', 'CONTAINER', '운반용기', 'HK철통', NULL, 'EA', TRUE),
('CNT045', 'CONTAINER', '운반용기', 'ㄴ철통', NULL, 'EA', TRUE),
('CNT046', 'CONTAINER', '운반용기', '철통', NULL, 'EA', TRUE),
('CNT047', 'CONTAINER', '운반용기', '포장X', NULL, 'EA', TRUE),
('CNT048', 'CONTAINER', '운반용기', '생산미확인', NULL, 'EA', TRUE),
('CNT049', 'CONTAINER', '운반용기', 'box', NULL, 'EA', TRUE),
('CNT050', 'CONTAINER', '운반용기', '기타', NULL, 'EA', TRUE),
('CNT051', 'CONTAINER', '운반용기', 'A', NULL, 'EA', TRUE);

-- 생성 완료 메시지
SELECT '운반용기 자재 50건 INSERT 완료 (CNT002~CNT051)' AS result;
