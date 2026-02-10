-- ============================================
-- 작업 의뢰 마이그레이션 데이터 INSERT (2025년 2분기)
-- ============================================
-- 출처: ref/작업의뢰20252.xlsx
-- 생성일시: 2026-02-10
-- 설명: 작업 의뢰 데이터 15건 (거래처 15곳, 상세 88라인)
-- ============================================

INSERT INTO hkgn.work_request (
    request_no, request_date, order_no,
    customer_nm, supplier_nm, site_nm,
    work_category, approval_status, memo, duo_light, dong_ho_window_separate, remarks,
    product_category, material_nm, thickness,
    unit_type, width, height, other_spec,
    quantity, unrequested_quantity, requested_quantity, area,
    order_remarks,
    origin_1, origin_2,
    process_1, process_2, process_3, process_4, process_5, process_6, process_7
) VALUES
-- 25-1138: (주)포스코이앤씨 - 천호4구역  (6라인)
('25-1138', '2025-05-07'::DATE, '25-1138', '(주)포스코이앤씨', '(주)포스코이앤씨', '천호4구역', '보통', '승인', NULL, NULL, FALSE, 'SWS,아르곤,982,엣지', 'P', '5MZT152(HS)+14SWS,AR+5CL', 24, 'mm', 1146, 1174, NULL, 2, 2, 2, 2.692, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1138', '2025-05-07'::DATE, '25-1138', '(주)포스코이앤씨', '(주)포스코이앤씨', '천호4구역', '보통', '승인', NULL, NULL, FALSE, 'SWS,아르곤,982,엣지', 'P', '5MZT152(HS)+14SWS,AR+5CL', 24, 'mm', 1024, 964, NULL, 3, 3, 3, 2.964, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1138', '2025-05-07'::DATE, '25-1138', '(주)포스코이앤씨', '(주)포스코이앤씨', '천호4구역', '보통', '승인', NULL, NULL, FALSE, 'SWS,아르곤,982,엣지', 'P', '5MZT152(HS)+14SWS,AR+5CL', 24, 'mm', 984, 910, NULL, 2, 2, 2, 1.792, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1138', '2025-05-07'::DATE, '25-1138', '(주)포스코이앤씨', '(주)포스코이앤씨', '천호4구역', '보통', '승인', NULL, NULL, FALSE, 'SWS,아르곤,982,엣지', 'P', '5MZT152(HS)+14SWS,AR+5CL', 24, 'mm', 802, 910, NULL, 3, 3, 3, 2.19, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1138', '2025-05-07'::DATE, '25-1138', '(주)포스코이앤씨', '(주)포스코이앤씨', '천호4구역', '보통', '승인', NULL, NULL, FALSE, 'SWS,아르곤,982,엣지', 'P', '5MZT152(HS)+14SWS,AR+5CL', 24, 'mm', 1077, 435, NULL, 2, 2, 2, 0.938, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1138', '2025-05-07'::DATE, '25-1138', '(주)포스코이앤씨', '(주)포스코이앤씨', '천호4구역', '보통', '승인', NULL, NULL, FALSE, 'SWS,아르곤,982,엣지', 'P', '5MZT152(HS)+14SWS,AR+5CL', 24, 'mm', 955, 435, NULL, 3, 3, 3, 1.248, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-1190: 디엘이앤씨(주) - e편한세상 검단웰카운티 (8라인)
('25-1190', '2025-05-12'::DATE, '25-1190', '디엘이앤씨(주)', '디엘이앤씨(주)', 'e편한세상 검단웰카운티', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '8CL(TF)', 8, 'mm', 2108, 1190, NULL, 1, 1, 1, 2.509, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1190', '2025-05-12'::DATE, '25-1190', '디엘이앤씨(주)', '디엘이앤씨(주)', 'e편한세상 검단웰카운티', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '8CL(TF)', 8, 'mm', 624, 2260, NULL, 2, 2, 2, 2.822, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1190', '2025-05-12'::DATE, '25-1190', '디엘이앤씨(주)', '디엘이앤씨(주)', 'e편한세상 검단웰카운티', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '8CL(TF)', 8, 'mm', 624, 2260, NULL, 1, 1, 1, 1.411, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1190', '2025-05-12'::DATE, '25-1190', '디엘이앤씨(주)', '디엘이앤씨(주)', 'e편한세상 검단웰카운티', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '8CL(TF)', 8, 'mm', 575, 1630, NULL, 2, 2, 2, 1.876, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1190', '2025-05-12'::DATE, '25-1190', '디엘이앤씨(주)', '디엘이앤씨(주)', 'e편한세상 검단웰카운티', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '8CL(TF)', 8, 'mm', 575, 1600, NULL, 2, 2, 2, 1.84, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1190', '2025-05-12'::DATE, '25-1190', '디엘이앤씨(주)', '디엘이앤씨(주)', 'e편한세상 검단웰카운티', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '8CL(TF)', 8, 'mm', 624, 1190, NULL, 2, 2, 2, 1.486, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1190', '2025-05-12'::DATE, '25-1190', '디엘이앤씨(주)', '디엘이앤씨(주)', 'e편한세상 검단웰카운티', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '8CL(TF)', 8, 'mm', 624, 1190, NULL, 1, 1, 1, 0.743, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1190', '2025-05-12'::DATE, '25-1190', '디엘이앤씨(주)', '디엘이앤씨(주)', 'e편한세상 검단웰카운티', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '8CL(TF)', 8, 'mm', 412, 1190, NULL, 1, 1, 1, 0.491, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-1228: 중흥토건  - 평택브레인시티1BL(1공구) (4라인)
('25-1228', '2025-05-14'::DATE, '25-1228', '중흥토건', '중흥토건', '평택브레인시티1BL(1공구)', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5GN+6A+5CL', 16, 'mm', 1105, 922, NULL, 7, 7, 7, 7.133, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1228', '2025-05-14'::DATE, '25-1228', '중흥토건', '중흥토건', '평택브레인시티1BL(1공구)', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5GN+6A+5CL', 16, 'mm', 1105, 407, NULL, 3, 3, 3, 1.35, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1228', '2025-05-14'::DATE, '25-1228', '중흥토건', '중흥토건', '평택브레인시티1BL(1공구)', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5GN+6A+5CL', 16, 'mm', 805, 722, NULL, 10, 10, 10, 5.82, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1228', '2025-05-14'::DATE, '25-1228', '중흥토건', '중흥토건', '평택브레인시티1BL(1공구)', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5GN+6A+5CL', 16, 'mm', 975, 335, NULL, 3, 3, 3, 0.981, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-1249: 대우건설 - 운정3지구A-8BL (8라인)
('25-1249', '2025-05-15'::DATE, '25-1249', '대우건설', '대우건설', '운정3지구A-8BL', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 1100, 625, NULL, 12, 12, 12, 8.256, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1249', '2025-05-15'::DATE, '25-1249', '대우건설', '대우건설', '운정3지구A-8BL', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 1100, 625, NULL, 3, 3, 3, 2.064, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1249', '2025-05-15'::DATE, '25-1249', '대우건설', '대우건설', '운정3지구A-8BL', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 1100, 525, NULL, 14, 14, 14, 8.092, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1249', '2025-05-15'::DATE, '25-1249', '대우건설', '대우건설', '운정3지구A-8BL', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 1100, 525, NULL, 16, 16, 16, 9.248, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1249', '2025-05-15'::DATE, '25-1249', '대우건설', '대우건설', '운정3지구A-8BL', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 1100, 515, NULL, 12, 12, 12, 6.804, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1249', '2025-05-15'::DATE, '25-1249', '대우건설', '대우건설', '운정3지구A-8BL', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 1000, 390, NULL, 3, 3, 3, 1.17, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1249', '2025-05-15'::DATE, '25-1249', '대우건설', '대우건설', '운정3지구A-8BL', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 1000, 390, NULL, 14, 14, 14, 5.46, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1249', '2025-05-15'::DATE, '25-1249', '대우건설', '대우건설', '운정3지구A-8BL', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 1000, 390, NULL, 16, 16, 16, 6.24, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-1258: 디엘건설(주)  - 대전역 센텀비스타 (5라인)
('25-1258', '2025-05-16'::DATE, '25-1258', '디엘건설(주)', '디엘건설(주)', '대전역 센텀비스타', '보통', '승인', NULL, NULL, FALSE, 'TPS', 'P', '8.76(5GN+0.76+3CL)+12TPS+5LE', 25.76, 'mm', 1515, 855, NULL, 8, 8, 8, 10.368, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1258', '2025-05-16'::DATE, '25-1258', '디엘건설(주)', '디엘건설(주)', '대전역 센텀비스타', '보통', '승인', NULL, NULL, FALSE, 'TPS', 'P', '8.76(5GN+0.76+3CL)+12TPS+5LE', 25.76, 'mm', 1515, 855, NULL, 4, 4, 4, 5.184, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1258', '2025-05-16'::DATE, '25-1258', '디엘건설(주)', '디엘건설(주)', '대전역 센텀비스타', '보통', '승인', NULL, NULL, FALSE, 'TPS', 'P', '8.76(5GN+0.76+3CL)+12TPS+5LE', 25.76, 'mm', 740, 855, NULL, 16, 16, 16, 10.128, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1258', '2025-05-16'::DATE, '25-1258', '디엘건설(주)', '디엘건설(주)', '대전역 센텀비스타', '보통', '승인', NULL, NULL, FALSE, 'TPS', 'P', '8.76(5GN+0.76+3CL)+12TPS+5LE', 25.76, 'mm', 740, 855, NULL, 8, 8, 8, 5.064, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1258', '2025-05-16'::DATE, '25-1258', '디엘건설(주)', '디엘건설(주)', '대전역 센텀비스타', '보통', '승인', NULL, NULL, FALSE, 'TPS', 'P', '8.76(5GN+0.76+3CL)+12TPS+5LE', 25.76, 'mm', 625, 855, NULL, 8, 8, 8, 4.28, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-1297: 동부건설  - 대전기초과학연구원 (9라인)
('25-1297', '2025-05-21'::DATE, '25-1297', '동부건설', '동부건설', '대전기초과학연구원', '보통', '승인', NULL, NULL, FALSE, '982,엣지', 'P', '5MZT135(HS)+14A+5CL(HS)', 24, 'mm', 977, 2802, NULL, 64, 64, 64, 175.232, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1297', '2025-05-21'::DATE, '25-1297', '동부건설', '동부건설', '대전기초과학연구원', '보통', '승인', NULL, NULL, FALSE, '982,엣지', 'P', '5MZT135(HS)+14A+5CL(HS)', 24, 'mm', 982, 2790, NULL, 40, 40, 40, 109.6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1297', '2025-05-21'::DATE, '25-1297', '동부건설', '동부건설', '대전기초과학연구원', '보통', '승인', NULL, NULL, FALSE, '982,엣지', 'P', '5MZT135(HS)+14A+5CL(HS)', 24, 'mm', 977, 1966, NULL, 64, 64, 64, 122.944, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1297', '2025-05-21'::DATE, '25-1297', '동부건설', '동부건설', '대전기초과학연구원', '보통', '승인', NULL, NULL, FALSE, '982,엣지', 'P', '5MZT135(HS)+14A+5CL(HS)', 24, 'mm', 982, 1939, NULL, 40, 40, 40, 76.2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1297', '2025-05-21'::DATE, '25-1297', '동부건설', '동부건설', '대전기초과학연구원', '보통', '승인', NULL, NULL, FALSE, 'eno,아르곤,982,엣지', 'P', '5MZT135(HS)+14AR(단열)+5CL', 24, 'mm', 977, 1507, NULL, 64, 64, 64, 94.272, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1297', '2025-05-21'::DATE, '25-1297', '동부건설', '동부건설', '대전기초과학연구원', '보통', '승인', NULL, NULL, FALSE, 'eno,아르곤,982,엣지', 'P', '5MZT135(HS)+14AR(단열)+5CL', 24, 'mm', 982, 1495, NULL, 40, 40, 40, 58.76, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1297', '2025-05-21'::DATE, '25-1297', '동부건설', '동부건설', '대전기초과학연구원', '보통', '승인', NULL, NULL, FALSE, 'eno,아르곤,982,엣지', 'P', '5MZT135(HS)+14AR(단열)+5CL', 24, 'mm', 977, 1472, NULL, 34, 34, 34, 48.926, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1297', '2025-05-21'::DATE, '25-1297', '동부건설', '동부건설', '대전기초과학연구원', '보통', '승인', NULL, NULL, FALSE, 'eno,아르곤,982,엣지', 'P', '5MZT135(HS)+14AR(단열)+5CL', 24, 'mm', 982, 1460, NULL, 24, 24, 24, 34.416, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1297', '2025-05-21'::DATE, '25-1297', '동부건설', '동부건설', '대전기초과학연구원', '보통', '승인', NULL, NULL, FALSE, 'eno,아르곤,982,엣지', 'P', '5MZT135(HS)+14AR(단열)+5CL', 24, 'mm', 947, 1433, NULL, 30, 30, 30, 40.74, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-1342: 대창기업  - 영종 오피스텔  (9라인)
('25-1342', '2025-05-27'::DATE, '25-1342', '대창기업', '대창기업', '영종 오피스텔', '생산하자분', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5LE', 22, 'mm', 885, 1935, NULL, 1, 1, 1, 1.713, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1342', '2025-05-27'::DATE, '25-1342', '대창기업', '대창기업', '영종 오피스텔', '생산하자분', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5LE', 22, 'mm', 785, 1935, NULL, 1, 1, 1, 1.519, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1342', '2025-05-27'::DATE, '25-1342', '대창기업', '대창기업', '영종 오피스텔', '생산하자분', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5LE', 22, 'mm', 807, 1287, NULL, 1, 1, 1, 1.039, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1342', '2025-05-27'::DATE, '25-1342', '대창기업', '대창기업', '영종 오피스텔', '생산하자분', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5LE', 22, 'mm', 935, 855, NULL, 2, 2, 2, 1.6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1342', '2025-05-27'::DATE, '25-1342', '대창기업', '대창기업', '영종 오피스텔', '생산하자분', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5LE', 22, 'mm', 935, 855, NULL, 1, 1, 1, 0.8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1342', '2025-05-27'::DATE, '25-1342', '대창기업', '대창기업', '영종 오피스텔', '생산하자분', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5LE', 22, 'mm', 935, 855, NULL, 1, 1, 1, 0.8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1342', '2025-05-27'::DATE, '25-1342', '대창기업', '대창기업', '영종 오피스텔', '생산하자분', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5LE', 22, 'mm', 935, 855, NULL, 1, 1, 1, 0.8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1342', '2025-05-27'::DATE, '25-1342', '대창기업', '대창기업', '영종 오피스텔', '생산하자분', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5LE', 22, 'mm', 835, 855, NULL, 1, 1, 1, 0.714, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1342', '2025-05-27'::DATE, '25-1342', '대창기업', '대창기업', '영종 오피스텔', '생산하자분', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5LE', 22, 'mm', 835, 855, NULL, 1, 1, 1, 0.714, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-1373: (주)HK 지앤텍 - (없음) (3라인)
('25-1373', '2025-06-02'::DATE, '25-1373', '(주)HK 지앤텍', '(주)HK 지앤텍', NULL, '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤,오토실링X', 'P', '5CL+14TPS,AR+5CL', 24, 'mm', 500, 800, NULL, 1, 1, 1, 0.4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1373', '2025-06-02'::DATE, '25-1373', '(주)HK 지앤텍', '(주)HK 지앤텍', NULL, '보통', '승인', NULL, NULL, FALSE, 'TPS,오토실링X', 'P', '5CL+14TPS+5CL', 24, 'mm', 500, 800, NULL, 2, 2, 2, 0.8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1373', '2025-06-02'::DATE, '25-1373', '(주)HK 지앤텍', '(주)HK 지앤텍', NULL, '보통', '승인', NULL, NULL, FALSE, 'TPS,프레스X,오토실링X', 'P', '5CL+14TPS+5CL', 24, 'mm', 500, 800, NULL, 3, 3, 3, 1.2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-1561: 주식회사 폴딩엠텍 - (없음) (4라인)
('25-1561', '2025-07-01'::DATE, '25-1561', '주식회사 폴딩엠텍', '주식회사 폴딩엠텍', NULL, '보통', '승인', NULL, NULL, FALSE, 'TPS', 'P', '5CL+6TPS+5CL', 16, 'mm', 583, 2134, NULL, 5, 5, 5, 6.22, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1561', '2025-07-01'::DATE, '25-1561', '주식회사 폴딩엠텍', '주식회사 폴딩엠텍', NULL, '보통', '승인', NULL, NULL, FALSE, 'TPS', 'P', '5CL+14TPS+5LE', 24, 'mm', 499, 2182, NULL, 3, 3, 3, 3.267, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1561', '2025-07-01'::DATE, '25-1561', '주식회사 폴딩엠텍', '주식회사 폴딩엠텍', NULL, '보통', '승인', NULL, NULL, FALSE, 'TPS', 'P', '5CL+14TPS+5LE', 24, 'mm', 598, 2103, NULL, 2, 2, 2, 2.516, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1561', '2025-07-01'::DATE, '25-1561', '주식회사 폴딩엠텍', '주식회사 폴딩엠텍', NULL, '보통', '승인', NULL, NULL, FALSE, 'TPS', 'P', '5CL+14TPS+5LE', 24, 'mm', 668, 2098, NULL, 1, 1, 1, 1.402, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-1690: (주)대원  - 원주 태장2지구  (5라인)
('25-1690', '2025-07-15'::DATE, '25-1690', '(주)대원', '(주)대원', '원주 태장2지구', '시공하자분', '승인', NULL, NULL, FALSE, 'TPS', 'P', '5CL+12A(단열)+5CL', 22, 'mm', 675, 2005, NULL, 1, 1, 1, 1.354, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1690', '2025-07-15'::DATE, '25-1690', '(주)대원', '(주)대원', '원주 태장2지구', '시공하자분', '승인', NULL, NULL, FALSE, '단열,아르곤', 'P', '5CL+12AR(단열)+5LE', 22, 'mm', 450, 861, NULL, 1, 1, 1, 0.388, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1690', '2025-07-15'::DATE, '25-1690', '(주)대원', '(주)대원', '원주 태장2지구', '시공하자분', '승인', NULL, NULL, FALSE, '단열,아르곤', 'P', '5GN(HS)+12AR(단열)+5LE', 22, 'mm', 760, 1875, NULL, 1, 1, 1, 1.425, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1690', '2025-07-15'::DATE, '25-1690', '(주)대원', '(주)대원', '원주 태장2지구', '시공하자분', '승인', NULL, NULL, FALSE, '단열,아르곤', 'P', '5GN(HS)+12AR(단열)+5LE', 22, 'mm', 460, 275, NULL, 1, 1, 1, 0.28, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1690', '2025-07-15'::DATE, '25-1690', '(주)대원', '(주)대원', '원주 태장2지구', '시공하자분', '승인', NULL, NULL, FALSE, '단열', 'P', '5GN(HS)+12A(단열)+5LE', 22, 'mm', 660, 1880, NULL, 1, 1, 1, 1.241, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-1739: 현대엔지니어링(주) - 시흥장현지구 업무시설  (6라인)
('25-1739', '2025-07-21'::DATE, '25-1739', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '시공하자분', '승인', NULL, NULL, FALSE, '써믹스단열,아르곤,982,엣지', 'P', '5SKG149T(HS)+14AR(단열)+5CL', 24, 'mm', 1125, 1785, NULL, 1, 1, 1, 2.009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1739', '2025-07-21'::DATE, '25-1739', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '시공하자분', '승인', NULL, NULL, FALSE, '써믹스단열,아르곤,982,엣지', 'P', '5SKN154II(HS)+14AR(단열)+5CL', 24, 'mm', 1300, 1755, NULL, 1, 1, 1, 2.282, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1739', '2025-07-21'::DATE, '25-1739', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '시공하자분', '승인', NULL, NULL, FALSE, '써믹스단열,아르곤,982,엣지', 'P', '5SKN154II(HS)+14AR(단열)+5CL', 24, 'mm', 925, 1755, NULL, 1, 1, 1, 1.624, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1739', '2025-07-21'::DATE, '25-1739', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '시공하자분', '승인', NULL, NULL, FALSE, '써믹스단열,아르곤,982,엣지', 'P', '5SKN154II(HS)+14AR(단열)+5CL', 24, 'mm', 1180, 555, NULL, 1, 1, 1, 0.655, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1739', '2025-07-21'::DATE, '25-1739', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '시공하자분', '승인', NULL, NULL, FALSE, '써믹스단열,아르곤,982,엣지', 'P', '5SKN154II(HS)+14AR(단열)+5CL', 24, 'mm', 1080, 550, NULL, 1, 1, 1, 0.594, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1739', '2025-07-21'::DATE, '25-1739', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '시공하자분', '승인', NULL, NULL, FALSE, '써믹스단열,아르곤,982,엣지', 'P', '5SKN154II(HS)+14AR(단열)+5CL', 24, 'mm', 925, 575, NULL, 1, 1, 1, 0.532, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-1810: (주)동일토건  - 청주 개신2지구 (8라인)
('25-1810', '2025-08-07'::DATE, '25-1810', '(주)동일토건', '(주)동일토건', '청주 개신2지구', '시공하자분', '승인', NULL, NULL, FALSE, '.', 'P', '5CL(TF)', 5, 'mm', 1132, 1075, NULL, 1, 1, 1, 1.217, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1810', '2025-08-07'::DATE, '25-1810', '(주)동일토건', '(주)동일토건', '청주 개신2지구', '시공하자분', '승인', NULL, NULL, FALSE, '.', 'P', '5CL(TF)', 5, 'mm', 1130, 1055, NULL, 1, 1, 1, 1.193, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1810', '2025-08-07'::DATE, '25-1810', '(주)동일토건', '(주)동일토건', '청주 개신2지구', '보통', '승인', NULL, NULL, FALSE, '아르곤', 'P', '6CL+16AR+6LE', 28, 'mm', 645, 2545, NULL, 1, 1, 1, 1.642, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1810', '2025-08-07'::DATE, '25-1810', '(주)동일토건', '(주)동일토건', '청주 개신2지구', '보통', '승인', NULL, NULL, FALSE, '아르곤', 'P', '6CL+16AR+6LE', 28, 'mm', 1474, 496, NULL, 4, 4, 4, 2.928, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1810', '2025-08-07'::DATE, '25-1810', '(주)동일토건', '(주)동일토건', '청주 개신2지구', '시공하자분', '승인', NULL, NULL, FALSE, '아르곤', 'P', '6CL+16AR+6LE', 28, 'mm', 1179, 1052, NULL, 1, 1, 1, 1.241, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1810', '2025-08-07'::DATE, '25-1810', '(주)동일토건', '(주)동일토건', '청주 개신2지구', '시공하자분', '승인', NULL, NULL, FALSE, '아르곤', 'P', '6CL+16AR+6LE', 28, 'mm', 1379, 496, NULL, 5, 5, 5, 3.42, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1810', '2025-08-07'::DATE, '25-1810', '(주)동일토건', '(주)동일토건', '청주 개신2지구', '시공하자분', '승인', NULL, NULL, FALSE, '아르곤', 'P', '6CL+16AR+6LE', 28, 'mm', 1435, 1055, NULL, 1, 1, 1, 1.514, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1810', '2025-08-07'::DATE, '25-1810', '(주)동일토건', '(주)동일토건', '청주 개신2지구', '보통', '승인', NULL, NULL, FALSE, '아르곤', 'P', '6CL+16AR+6LE', 28, 'mm', 1474, 496, NULL, 4, 4, 4, 2.928, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-1841: 포스코 - 청주 복대2구역  (3라인)
('25-1841', '2025-08-13'::DATE, '25-1841', '포스코', '포스코', '청주 복대2구역', '생산하자분', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5LE', 22, 'mm', 1727, 1868, NULL, 1, 1, 1, 3.226, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1841', '2025-08-13'::DATE, '25-1841', '포스코', '포스코', '청주 복대2구역', '생산하자분', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5LE', 22, 'mm', 1727, 1868, NULL, 1, 1, 1, 3.226, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1841', '2025-08-13'::DATE, '25-1841', '포스코', '포스코', '청주 복대2구역', '생산하자분', '승인', NULL, NULL, FALSE, NULL, 'P', '5GN+12A+5LE', 22, 'mm', 1727, 1868, NULL, 1, 1, 1, 3.226, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-1895: (주)한양 - 남양주 도곡2 주택재개발 (6라인)
('25-1895', '2025-08-21'::DATE, '25-1895', '(주)한양', '(주)한양', '남양주 도곡2 주택재개발', '시공하자분', '승인', NULL, NULL, FALSE, '면취', 'P', '투명접합(5CL+0.76PVB+5CL)', 10.76, 'mm', 702, 915, NULL, 5, 5, 5, 3.215, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1895', '2025-08-21'::DATE, '25-1895', '(주)한양', '(주)한양', '남양주 도곡2 주택재개발', '시공하자분', '승인', NULL, NULL, FALSE, '면취', 'P', '투명접합(5CL+0.76PVB+5CL)', 10.76, 'mm', 602, 915, NULL, 5, 5, 5, 2.755, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1895', '2025-08-21'::DATE, '25-1895', '(주)한양', '(주)한양', '남양주 도곡2 주택재개발', '시공하자분', '승인', NULL, NULL, FALSE, '면취', 'P', '투명접합(5CL+0.76PVB+5CL)', 10.76, 'mm', 552, 915, NULL, 5, 5, 5, 2.53, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1895', '2025-08-21'::DATE, '25-1895', '(주)한양', '(주)한양', '남양주 도곡2 주택재개발', '시공하자분', '승인', NULL, NULL, FALSE, '면취', 'P', '투명접합(5CL+0.76PVB+5CL)', 10.76, 'mm', 602, 215, NULL, 5, 5, 5, 1.4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1895', '2025-08-21'::DATE, '25-1895', '(주)한양', '(주)한양', '남양주 도곡2 주택재개발', '시공하자분', '승인', NULL, NULL, FALSE, '면취', 'P', '투명접합(5CL+0.76PVB+5CL)', 10.76, 'mm', 452, 60, NULL, 5, 5, 5, 1.4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1895', '2025-08-21'::DATE, '25-1895', '(주)한양', '(주)한양', '남양주 도곡2 주택재개발', '시공하자분', '승인', NULL, NULL, FALSE, '면취', 'P', '투명접합(5CL+0.76PVB+5CL)', 10.76, 'mm', 402, 60, NULL, 5, 5, 5, 1.4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-1931: (주)윈스타트 - (없음) (4라인)
('25-1931', '2025-08-28'::DATE, '25-1931', '(주)윈스타트', '(주)윈스타트', NULL, '보통', '승인', NULL, NULL, FALSE, '단열,아르곤,엣지', 'P', '5SKN154Ⅱ(HS)+14AR+5CL', 24, 'mm', 1903, 1917, NULL, 1, 1, 1, 3.649, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1931', '2025-08-28'::DATE, '25-1931', '(주)윈스타트', '(주)윈스타트', NULL, '보통', '승인', NULL, NULL, FALSE, '단열,아르곤,엣지', 'P', '6SKN154Ⅱ(HS)+12AR+6CL', 24, 'mm', 1533, 1918, NULL, 1, 1, 1, 2.941, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1931', '2025-08-28'::DATE, '25-1931', '(주)윈스타트', '(주)윈스타트', NULL, '보통', '승인', NULL, NULL, FALSE, '단열,아르곤,엣지', 'P', '6SKN154Ⅱ(HS)+12AR+6CL', 24, 'mm', 334, 1545, NULL, 1, 1, 1, 0.516, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1931', '2025-08-28'::DATE, '25-1931', '(주)윈스타트', '(주)윈스타트', NULL, '보통', '승인', NULL, NULL, FALSE, '단열,아르곤,엣지', 'P', '6SKN154Ⅱ(HS)+12AR+6CL', 24, 'mm', 269, 269, NULL, 1, 1, 1, 0.28, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)

;

-- 완료 메시지
SELECT
    '작업 의뢰 데이터 ' || COUNT(*) || '건 INSERT 완료' AS result
FROM hkgn.work_request
WHERE request_no IN ('25-1138', '25-1190', '25-1228', '25-1249', '25-1258', '25-1297', '25-1342', '25-1373', '25-1561', '25-1690', '25-1739', '25-1810', '25-1841', '25-1895', '25-1931');
