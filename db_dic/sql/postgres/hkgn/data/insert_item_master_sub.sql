-- ============================================
-- 부자재 자재 INSERT (엑셀 데이터 기반)
-- material_type: SUB
-- category: 부자재
-- 기존 SUB001~SUB005 사용 중, SUB006부터 시작
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
('SUB006', 'SUB', '부자재', '스페이서(일반12mm)', NULL, 'EA', TRUE),
('SUB007', 'SUB', '부자재', '백색격자 12T', 12, 'EA', TRUE),
('SUB008', 'SUB', '부자재', '운송비', NULL, 'EA', TRUE),
('SUB009', 'SUB', '부자재', '치오콜(펜지)', NULL, 'EA', TRUE),
('SUB010', 'SUB', '부자재', '단열간봉 12T', 12, 'EA', TRUE),
('SUB011', 'SUB', '부자재', '코너키 12T', 12, 'EA', TRUE),
('SUB012', 'SUB', '부자재', '지게차비', NULL, 'EA', TRUE),
('SUB013', 'SUB', '부자재', '치오콜 SET', NULL, 'EA', TRUE),
('SUB014', 'SUB', '부자재', '부칠(KG)', NULL, 'EA', TRUE),
('SUB015', 'SUB', '부자재', '백색격자 6T', 6, 'EA', TRUE),
('SUB016', 'SUB', '부자재', '필름', NULL, 'EA', TRUE),
('SUB017', 'SUB', '부자재', 'AL Spacer 6T', 6, 'EA', TRUE),
('SUB018', 'SUB', '부자재', '간봉 6T', 6, 'EA', TRUE),
('SUB019', 'SUB', '부자재', '흡습제', NULL, 'EA', TRUE),
('SUB020', 'SUB', '부자재', '간봉 12T', 12, 'EA', TRUE),
('SUB021', 'SUB', '부자재', '코너키 6T', 6, 'EA', TRUE),
('SUB022', 'SUB', '부자재', '아존단열간봉', NULL, 'EA', TRUE),
('SUB023', 'SUB', '부자재', '샷시대금', NULL, 'EA', TRUE),
('SUB024', 'SUB', '부자재', '유니트', NULL, 'EA', TRUE),
('SUB025', 'SUB', '부자재', '금액조정', NULL, 'EA', TRUE),
('SUB026', 'SUB', '부자재', '할증', NULL, 'EA', TRUE),
('SUB027', 'SUB', '부자재', '완충패 2T', 2, 'EA', TRUE),
('SUB028', 'SUB', '부자재', '완충패드 2T', 2, 'EA', TRUE),
('SUB029', 'SUB', '부자재', '부자재', NULL, 'EA', TRUE),
('SUB030', 'SUB', '부자재', '단열간봉 14T', 14, 'EA', TRUE);

-- 생성 완료 메시지
SELECT '부자재 자재 25건 INSERT 완료 (SUB006~SUB030)' AS result;
