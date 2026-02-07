-- ============================================
-- V2: 생산관리 메뉴 + 워크플로우 공통코드 추가
-- 작성일: 2026-02-07
-- ============================================

-- 생산관리 그룹 메뉴
INSERT INTO menus (code, name, parent_id, path, icon, menu_type, sort_order, is_active, depth) VALUES
('PRODUCTION', '생산관리', NULL, NULL, 'factory', 'GROUP', 3, TRUE, 0);

-- 생산관리 자식 메뉴
INSERT INTO menus (code, name, parent_id, path, icon, menu_type, sort_order, is_active, depth) VALUES
('PROD_WORKFLOW',    '워크플로우',     (SELECT id FROM menus WHERE code = 'PRODUCTION'), '/production/workflow',    'workflow',       'MENU', 1,  TRUE, 1),
('PROD_PROJECT',     '프로젝트',       (SELECT id FROM menus WHERE code = 'PRODUCTION'), '/production/project',     'building',       'MENU', 2,  TRUE, 1),
('PROD_SUBCONTRACT', '임가공',         (SELECT id FROM menus WHERE code = 'PRODUCTION'), '/production/subcontract', 'handshake',      'MENU', 3,  TRUE, 1),
('PROD_SALES_ORDER', '수주',           (SELECT id FROM menus WHERE code = 'PRODUCTION'), '/production/sales-order', 'clipboard_list', 'MENU', 4,  TRUE, 1),
('PROD_ORDER',       '주문',           (SELECT id FROM menus WHERE code = 'PRODUCTION'), '/production/order',       'shopping_cart',  'MENU', 5,  TRUE, 1),
('PROD_PLAN',        '생산계획',       (SELECT id FROM menus WHERE code = 'PRODUCTION'), '/production/plan',        'calendar',       'MENU', 6,  TRUE, 1),
('PROD_WORK_ORDER',  '작업지시',       (SELECT id FROM menus WHERE code = 'PRODUCTION'), '/production/work-order',  'wrench',         'MENU', 7,  TRUE, 1),
('PROD_RESULT',      '생산실적',       (SELECT id FROM menus WHERE code = 'PRODUCTION'), '/production/result',      'bar_chart',      'MENU', 8,  TRUE, 1),
('PROD_PACKAGING',   '포장',           (SELECT id FROM menus WHERE code = 'PRODUCTION'), '/production/packaging',   'package',        'MENU', 9,  TRUE, 1),
('PROD_SHIPPING',    '출고',           (SELECT id FROM menus WHERE code = 'PRODUCTION'), '/production/shipping',    'truck',          'MENU', 10, TRUE, 1),
('PROD_PURCHASE',    '발주(원부자재)', (SELECT id FROM menus WHERE code = 'PRODUCTION'), '/production/purchase',    'receipt',        'MENU', 11, TRUE, 1),
('PROD_WORKER',      '작업자 배치',    (SELECT id FROM menus WHERE code = 'PRODUCTION'), '/production/worker',      'hard_hat',       'MENU', 12, TRUE, 1),
('PROD_DEFECT',      '불량관리',       (SELECT id FROM menus WHERE code = 'PRODUCTION'), '/production/defect',      'alert_triangle', 'MENU', 13, TRUE, 1),
('PROD_INVENTORY',   '제품재고',       (SELECT id FROM menus WHERE code = 'PRODUCTION'), '/production/inventory',   'warehouse',      'MENU', 14, TRUE, 1);

-- 워크플로우 상태 코드
INSERT INTO code_master (group_code, group_name, code_id, code_name, sort_order, description, extra_data, is_active) VALUES
('WF_STATUS', '워크플로우상태', 'PENDING',     '대기',   1, '처리 대기 중', '{"color":"gray"}',  TRUE),
('WF_STATUS', '워크플로우상태', 'IN_PROGRESS', '진행중', 2, '현재 진행 중', '{"color":"blue"}',  TRUE),
('WF_STATUS', '워크플로우상태', 'COMPLETED',   '완료',   3, '처리 완료',   '{"color":"green"}', TRUE),
('WF_STATUS', '워크플로우상태', 'BLOCKED',     '차단',   4, '진행 불가',   '{"color":"red"}',   TRUE);

-- 수주 유형 코드
INSERT INTO code_master (group_code, group_name, code_id, code_name, sort_order, description, is_active) VALUES
('ORDER_TYPE', '수주유형', 'PROJECT',     '프로젝트', 1, '고객사 프로젝트 기반 수주', TRUE),
('ORDER_TYPE', '수주유형', 'SUBCONTRACT', '임가공',   2, '외주 가공 의뢰 수주',       TRUE);

-- 프로젝트 단계 코드 (고객사 건설 프로젝트)
INSERT INTO code_master (group_code, group_name, code_id, code_name, sort_order, description, is_active) VALUES
('PROJECT_PHASE', '프로젝트단계', 'CONTRACT',     '수주', 1, '프로젝트 수주 단계', TRUE),
('PROJECT_PHASE', '프로젝트단계', 'DESIGN',       '설계', 2, '설계 진행 단계',     TRUE),
('PROJECT_PHASE', '프로젝트단계', 'CONSTRUCT',    '시공', 3, '시공 진행 단계',     TRUE),
('PROJECT_PHASE', '프로젝트단계', 'COMPLETE',     '완공', 4, '공사 완료 단계',     TRUE),
('PROJECT_PHASE', '프로젝트단계', 'AFTER_SERVICE','A/S',  5, '사후 서비스 단계',   TRUE);
