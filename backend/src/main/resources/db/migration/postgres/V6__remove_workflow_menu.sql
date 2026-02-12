-- 워크플로우(PROD_WORKFLOW) 메뉴 삭제 및 sort_order 재정렬
DELETE FROM hkgn.menus WHERE code = 'PROD_WORKFLOW';

-- sort_order 재정렬 (워크플로우 제거 후 빈 자리 채우기)
UPDATE hkgn.menus SET sort_order = 1  WHERE code = 'PROD_PROJECT';
UPDATE hkgn.menus SET sort_order = 2  WHERE code = 'PROD_SUBCONTRACT';
UPDATE hkgn.menus SET sort_order = 3  WHERE code = 'PROD_ORDER';
UPDATE hkgn.menus SET sort_order = 4  WHERE code = 'PROD_PLAN';
UPDATE hkgn.menus SET sort_order = 5  WHERE code = 'PROD_WORK_ORDER';
UPDATE hkgn.menus SET sort_order = 6  WHERE code = 'PROD_RESULT';
UPDATE hkgn.menus SET sort_order = 7  WHERE code = 'PROD_PACKAGING';
UPDATE hkgn.menus SET sort_order = 8  WHERE code = 'PROD_SHIPPING';
UPDATE hkgn.menus SET sort_order = 9  WHERE code = 'PROD_PURCHASE';
UPDATE hkgn.menus SET sort_order = 10 WHERE code = 'PROD_WORKER';
UPDATE hkgn.menus SET sort_order = 11 WHERE code = 'PROD_DEFECT';
UPDATE hkgn.menus SET sort_order = 12 WHERE code = 'PROD_INVENTORY';
