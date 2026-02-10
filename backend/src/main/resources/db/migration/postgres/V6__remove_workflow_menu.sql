-- 워크플로우(PROD_WORKFLOW) 메뉴 삭제 및 sort_order 재정렬
DELETE FROM menus WHERE code = 'PROD_WORKFLOW';

-- sort_order 재정렬 (워크플로우 제거 후 빈 자리 채우기)
UPDATE menus SET sort_order = 1  WHERE code = 'PROD_PROJECT';
UPDATE menus SET sort_order = 2  WHERE code = 'PROD_SUBCONTRACT';
UPDATE menus SET sort_order = 3  WHERE code = 'PROD_ORDER';
UPDATE menus SET sort_order = 4  WHERE code = 'PROD_PLAN';
UPDATE menus SET sort_order = 5  WHERE code = 'PROD_WORK_ORDER';
UPDATE menus SET sort_order = 6  WHERE code = 'PROD_RESULT';
UPDATE menus SET sort_order = 7  WHERE code = 'PROD_PACKAGING';
UPDATE menus SET sort_order = 8  WHERE code = 'PROD_SHIPPING';
UPDATE menus SET sort_order = 9  WHERE code = 'PROD_PURCHASE';
UPDATE menus SET sort_order = 10 WHERE code = 'PROD_WORKER';
UPDATE menus SET sort_order = 11 WHERE code = 'PROD_DEFECT';
UPDATE menus SET sort_order = 12 WHERE code = 'PROD_INVENTORY';
