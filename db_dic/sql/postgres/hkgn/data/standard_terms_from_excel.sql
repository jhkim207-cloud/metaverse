-- ============================================
-- 표준 용어 사전 INSERT
-- 출처: Excel 통합파일_전체시트.xlsx - 표준용어사전 시트
-- 작성일: 2026-02-07
-- ============================================

-- 기존 데이터 삭제 (재실행 시)
-- TRUNCATE TABLE hkgn.standard_terms CASCADE;

INSERT INTO hkgn.standard_terms (term_group, term_code, term_name_kr, term_name_en, description, abbreviation, sort_order) VALUES
-- 기준정보
('기준정보', 'MATERIAL_CD', '자재코드', 'Material Code', '자재 고유 식별 코드 (PK)', NULL, 1),
('기준정보', 'MATERIAL_TYPE', '자재구분', 'Material Type', '자재/원자재/원판/부자재/강화/에칭/용기', NULL, 2),
('기준정보', 'MATERIAL_NM', '자재명', 'Material Name', '자재 이름', NULL, 3),
('기준정보', 'THICKNESS', '두께', 'Thickness', '원판 두께 (mm)', NULL, 4),
('기준정보', 'STOCK_QTY', '재고수량', 'Stock Quantity', '창고 재고 현황', NULL, 5),
('기준정보', 'COST_PRICE', '원가', 'Cost Price', '원가 (원)', NULL, 6),
('기준정보', 'LIST_PRICE', '판가', 'List Price', '판가 (원)', NULL, 7),
('기준정보', 'PURCHASE_PRICE', '매입가', 'Purchase Price', '매입 단가 (원)', NULL, 8),
('기준정보', 'SELLING_PRICE', '판매가', 'Selling Price', '판매 단가 (원)', NULL, 9),
('기준정보', 'COLOR_TYPE', '색상구분', 'Color Type', '유리 색상 (투명/칼라/로이 등)', NULL, 10),
('기준정보', 'UNIT', '단위', 'Unit', '수량 단위 (EA/M2/BOX)', NULL, 11),
('기준정보', 'IS_ACTIVE', '사용여부', 'Active Flag', '사용/미사용 구분', NULL, 12),
('기준정보', 'BP', '거래처', 'Business Partner', '매출처/매입처/외주처 기준정보', NULL, 13),
('기준정보', 'BP_CD', '거래처코드', 'BP Code', '거래처 식별 코드 (PK)', NULL, 14),
('기준정보', 'BP_TYPE', '거래처구분', 'BP Type', '매출처/매입처/외주처 구분', NULL, 15),
('기준정보', 'SALES_CATEGORY', '매출처구분', 'Sales Category', '판판/현장/기타 등', NULL, 16),
('기준정보', 'PURCHASE_CATEGORY', '매입처구분', 'Purchase Category', '원자재/부자재/기타 등', NULL, 17),
('기준정보', 'BP_NM', '거래처명', 'BP Name', '거래처 이름', NULL, 18),
('기준정보', 'CEO_NM', '대표자명', 'CEO Name', '대표자 이름', NULL, 19),
('기준정보', 'BIZ_REG_NO', '사업자등록번호', 'Biz Reg No', '사업자등록번호 (###-##-#####)', NULL, 20),
('기준정보', 'CONTACT_PERSON', '담당자', 'Contact Person', '거래처 담당자', NULL, 21),
('기준정보', 'SITE', '현장', 'Site / Project', '건설현장/납품처 기준정보', NULL, 22),
('기준정보', 'SITE_CD', '현장코드', 'Site Code', '현장 식별 코드 (PK)', NULL, 23),
('기준정보', 'SITE_NM', '현장명', 'Site Name', '현장 이름', NULL, 24),
('기준정보', 'CONSTRUCTION_NM', '건설사', 'Construction Co', '건설사 이름', NULL, 25),
('기준정보', 'SPEC', '사양', 'Specification', '유리창 유리 사양', NULL, 26),
('기준정보', 'WORKER', '작업자', 'Worker', '작업자/작업 기준정보', NULL, 27),
('기준정보', 'WORKER_CD', '작업자코드', 'Worker Code', '작업자 고유 코드 (PK)', NULL, 28),
('기준정보', 'WORKER_NM', '작업자명', 'Worker Name', '작업자 이름', NULL, 29),
('기준정보', 'DEPT', '소속부서', 'Department', '소속 부서 (복층/강화/재단/관리 등)', NULL, 30),
('기준정보', 'POSITION', '직무', 'Position/Role', '직무 (관리자/조립/투입/후처리 등)', NULL, 31),
('기준정보', 'PROD_LINE', '생산라인', 'Production Line', '생산 라인 (1호기/2호기 등)', NULL, 32),
('기준정보', 'PROD_LINE', '생산라인', 'Production Line', '복층 1호/2호/3호 기준', NULL, 33),

-- 영업
('영업', 'SO', '수주', 'Sales Order', '고객 주문 접수', NULL, 100),
('영업', 'DOC_NO', 'ID서류번호', 'Document No', '수주 ID서류번호 (예: 26-0154)', NULL, 101),
('영업', 'ORDER_DATE', '수주일자', 'Order Date', '수주 접수일', NULL, 102),
('영업', 'DELIVERY_DATE', '납품예정일', 'Delivery Date', '납품 예정일', NULL, 103),
('영업', 'ORDER_TYPE', '수주유형', 'Order Type', '일반품/긴급/재고품/견본품 등', NULL, 104),
('영업', 'VAT_EXCLUDED', '부가세제외', 'VAT Excluded', '부가세 별도 여부', NULL, 105),
('영업', 'DUO_LIGHT', '듀오라이트', 'Duo Light', '듀오라이트 유무 (Y/N)', NULL, 106),
('영업', 'TPS', 'TPS', 'TPS', 'TPS 처리 여부', NULL, 107),
('영업', 'PRODUCT_TYPE', '제품구분', 'Product Type', 'PH패턴/IP제품 등', NULL, 108),
('영업', 'PRODUCT_NM', '품명', 'Product Name', '제품 명 SB0123/TPH50 등 (S:CLID)', NULL, 109),
('영업', 'SIZE_UNIT', '규격단위', 'Size Unit', 'mm/inch 등', '(공통)', 110),
('영업', 'WIDTH', '가로규격', 'Width', '가로 (mm)', '(공통)', 111),
('영업', 'HEIGHT', '세로규격', 'Height', '세로 (mm)', NULL, 112),
('영업', 'QTY', '수량', 'Quantity', '매 수 (EA)', '(공통)', 113),
('영업', 'AREA_M2', '면적', 'Area (M2)', '면적 (M2) = 가로x세로x수량', NULL, 114),
('영업', 'UNIT_PRICE', '단가', 'Unit Price', '단가 (원)', '(공통)', 115),
('영업', 'AMOUNT', '금액', 'Amount', '금액 = 단가 x 수량', '(공통)', 116),
('영업', 'BUILDING', '동', 'Building', '아파트 동 번호', NULL, 117),
('영업', 'UNIT_NO', '호수', 'Unit No', '아파트 호수', NULL, 118),
('영업', 'WINDOW_TYPE', '창', 'Window Type', '창 종류 (PH:파테라이 등)', NULL, 119),

-- 생산
('생산', 'PP', '생산계획', 'Production Plan', '주간 생산계획 (작업지시)', NULL, 200),
('생산', 'WO_NO', '작업지시번호', 'Work Order No', '작업지시서 번호', NULL, 201),
('생산', 'WORK_TYPE', '작업구분', 'Work Type', '보통/간급 등', NULL, 202),
('생산', 'LOADING_DATE', '로딩일자', 'Loading Date', '강판(유리) 예정일', NULL, 203),
('생산', 'LOCATION_DETAIL', '위치', 'Location Detail', '동/층/호 상세 정보', NULL, 204),
('생산', 'PROC_CATEGORY', '공정구분', 'Process Category', '복층/강화/재단/선택 등', NULL, 205),
('생산', 'OPTION_DESC', '옵션', 'Option Desc', '특이사항/옵션', NULL, 206),
('생산', 'PYEONG_AREA', '평수', 'Pyeong Area', '면적 (평)', '(공통)', 207),
('생산', 'PROC_CHK', '공정확인', 'Process Check', '재단1/재단2/강화/유리제조/재고', NULL, 208),
('생산', 'PR', '실적', 'Production Result', '생산일지 (생산 기록)', NULL, 209),
('생산', 'CUTTING', '재단', 'Cutting', '유리 재단 작업 (재단1/재단2 공정)', NULL, 210),
('생산', 'WASHING', '아르곤', 'Argon/Washing', '아르곤 충전 / 세척 공정', NULL, 211),
('생산', 'TEMPERING', '강화', 'Tempering', '유리 열처리 강화 공정', NULL, 212),
('생산', 'ETCHING', '에칭', 'Etching', '유리 에칭 가공 공정', NULL, 213),
('생산', 'IGLU_ASSEMBLY', '복층조립', 'IGU Assembly', '복층유리(IGU) 조립 공정', NULL, 214),
('생산', 'SEALING', '씰링', 'Sealing', '복층 씰링 공정', NULL, 215),
('생산', 'PR', '생산실적', 'Production Result', '생산일지 (생산 기록)', NULL, 216),
('생산', 'RESULT_DOC_NO', '실적문서번호', 'Result Doc No', '생산실적 문서번호', NULL, 217),
('생산', 'PROCESS', '공정', 'Process', '복층/강화/재단/선택 등', NULL, 218),
('생산', 'SHIFT_TYPE', '근무조구분', 'Day/Night Shift', '주간/야간/저녁 구분', NULL, 219),
('생산', 'PROD_QTY', '생산수량', 'Produced Qty', '생산 완성 수량', NULL, 220),
('생산', 'DEFECT_QTY', '불량수량', 'Defect Qty', '불량 수량', NULL, 221),
('생산', 'UNPROD_QTY', '미생산수량', 'Unproduced Qty', '미생산 전량 수량', NULL, 222),
('생산', 'CDR', '재단일보', 'Cutting Daily Report', '일일 재단 작업 일보', NULL, 223),
('생산', 'WASHED_PYEONG', '로스면적', 'Washed Area', '로스(분할) 면적 (평)', NULL, 224),
('생산', 'WASHED_PYEONG', '아르곤면적', 'Washed Area', '아르곤(세척) 면적 (평)', NULL, 225),
('생산', 'USED_PYEONG', '사용면적', 'Used Area', '원판 사용 면적 (평)', NULL, 226),
('생산', 'LOSS_PYEONG', '로스면적', 'Loss Area', '손실(잔량) 면적 (평)', NULL, 227),
('생산', 'LOSS_RATE', '로스율', 'Loss Rate', '손실률 = 로스면적/사용면적', NULL, 228),

-- 포장
('포장', 'PO_PACK', '포장지시', 'Packing Order', '포장 지시 정보', NULL, 300),
('포장', 'DELIVERY_DOC', '출고문서', 'Delivery/Shipment', '출고 상세 관리', NULL, 301),
('포장', 'DLV_DOC_NO', '출고문서번호', 'Delivery Doc No', '출고문서 번호', NULL, 302),
('포장', 'TXN_DATE', '거래일자', 'Transaction Date', '거래(출고) 일자', NULL, 303),
('포장', 'DELIVERY_TYPE', '출고유형', 'Delivery Type', '판매출고/대여/기타 등', NULL, 304),
('포장', 'FREIGHT_COST', '운반비', 'Freight Cost', '운반비', NULL, 305),
('포장', 'CARRIER', '운송사', 'Carrier', '운송사 이름', NULL, 306),
('포장', 'UNDLV_QTY', '미출고수량', 'Undelivered Qty', '미출고 전량 수량', NULL, 307),
('포장', 'DLV_QTY', '출고수량', 'Delivered Qty', '출고 수량', NULL, 308),
('포장', 'DLV_AMOUNT', '출고금액', 'Delivery Amount', '출고 금액', NULL, 309),
('포장', 'VAT', '부가세', 'VAT', '부가세액', NULL, 310),

-- 구매
('구매', 'PO', '구매발주', 'Purchase Order', '원자재 구매 발주', NULL, 400),
('구매', 'PO_DOC_NO', '발주문서번호', 'PO Doc No', '발주서(PO) 번호 (PO-YYYYMMDD-CC)', NULL, 401),
('구매', 'PO_DATE', '발주일자', 'PO Date', '발주 요청일', NULL, 402),
('구매', 'SIZE_SMALL', '사이즈(소)', 'Size Small', '원판 소 사이즈 (mm)', NULL, 403),
('구매', 'SIZE_LARGE', '사이즈(대)', 'Size Large', '원판 대 사이즈 (mm2.5)', NULL, 404),
('구매', 'SUPPLY_AMT', '공급가액', 'Supply Amount', '공급가액 (부가세 제외)', NULL, 405),
('구매', 'GR', '입고', 'Goods Receipt', '원자재 입고', NULL, 406),
('구매', 'GR_CONFIRM', '입고확인', 'GR Confirmation', '입고확인 상태', NULL, 407),
('구매', 'DISCOUNT_RATE', 'DC율', 'Discount Rate', '할인율 (%)', NULL, 408),
('구매', 'PYEONG_PRICE', '평단가', 'Unit Price/Pyeong', '평당 단가', NULL, 409),

-- 재고
('재고', 'INV', '재고', 'Inventory', '재고 현황 및 이력', NULL, 500),
('재고', 'INV_STATUS', '재고상태', 'Inventory Status', '정상/불량/검사 대기 등', NULL, 501),
('재고', 'INV_TXN_TYPE', '거래유형', 'Txn Type', 'IN입고 / OUT출고', NULL, 502),
('재고', 'INV_TXN_REASON', '거래사유', 'Txn Reason', '구매입고/생산입고/판매출고/자재불출/재고조정', NULL, 503),
('재고', 'INV_TXN_QTY', '거래수량', 'Txn Quantity', '입고(+) / 출고(-) 수량', NULL, 504),
('재고', 'BEFORE_QTY', '이전수량', 'Before Qty', '수불 전 전수량', NULL, 505),
('재고', 'AFTER_QTY', '이후수량', 'After Qty', '수불 후 전수량', NULL, 506),
('재고', 'CONTAINER_PACK', '용기/포장', 'Container/Pack', '용기/용기 관리', NULL, 507),
('재고', 'CONTAINER_CD', '용기코드', 'Container Code', '용기 식별 코드', NULL, 508),
('재고', 'SUBCONTRACT_PO', '외주발주', 'Subcontract PO', '외주 발주 정보', NULL, 509),
('재고', 'SUB_CD', '외주처코드', 'Sub Code', '외주처(업체) 코드', NULL, 510),
('재고', 'SUB_TYPE', '외주구분', 'Sub Type', '강화/정밀/유리가공 구분', NULL, 511),
('재고', 'REC_RECEIPT_DATE', '입고요청일자', 'Rec Receipt Date', '외주 입고 요청일', NULL, 512),
('재고', 'ACT_RECEIPT_DATE', '실제입고일', 'Act Receipt Date', '실제 입고일', NULL, 513),
('재고', 'RECEIPT_LOCATION', '입고장소', 'Receipt Location', '입고 장소 (아파트명 등)', NULL, 514),

-- 현장
('현장', 'SITE_PRICE', '현장단가', 'Site Price', '현장별 유리 사양 단가', NULL, 600),
('현장', 'BID_EXEC_PRICE', '입찰실행단가', 'Bid Exec Price', '입찰 시 낙찰 단가', NULL, 601),
('현장', 'PROC_PRICE', '가공단가', 'Processing Price', '가공비 단가', NULL, 602),
('현장', 'ARGON_COST', '아르곤비', 'Argon', '아르곤 충전 비용', NULL, 603),
('현장', 'EDGE_COST', '엣지비', 'Edge', '엣지 가공 비용', NULL, 604),
('현장', 'STRUCT_COST', '구조용비', 'Structural', '구조용 유리 비용', NULL, 605),
('현장', 'EDGE_STEP', '엣지스텝', 'Edge/Step', '엣지 스텝 가공', NULL, 606)

ON CONFLICT (term_group, term_code) DO NOTHING;

-- 통계 출력
SELECT term_group, COUNT(*) as term_count
FROM hkgn.standard_terms
GROUP BY term_group
ORDER BY term_group;

SELECT '총 ' || COUNT(*) || '개 용어 등록 완료' as summary
FROM hkgn.standard_terms;
