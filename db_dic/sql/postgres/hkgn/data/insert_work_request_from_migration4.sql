-- ============================================
-- 작업 의뢰 마이그레이션 데이터 INSERT (2025년 3분기)
-- ============================================
-- 출처: ref/작업의뢰20253.xlsx
-- 생성일시: 2026-02-10
-- 설명: 작업 의뢰 데이터 15건 (거래처 15곳, 상세 101라인)
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
-- 25-1944: PL창호  - (없음) (9라인)
('25-1944', '2025-09-01'::DATE, '25-1944', 'PL창호', 'PL창호', NULL, '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 1719, 1940, NULL, 2, 2, 2, 6.67, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1944', '2025-09-01'::DATE, '25-1944', 'PL창호', 'PL창호', NULL, '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 904, 1940, NULL, 4, 4, 4, 7.016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1944', '2025-09-01'::DATE, '25-1944', 'PL창호', 'PL창호', NULL, '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 763, 1940, NULL, 4, 4, 4, 5.924, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1944', '2025-09-01'::DATE, '25-1944', 'PL창호', 'PL창호', NULL, '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 754, 1940, NULL, 4, 4, 4, 5.852, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1944', '2025-09-01'::DATE, '25-1944', 'PL창호', 'PL창호', NULL, '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 754, 1940, NULL, 4, 4, 4, 5.852, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1944', '2025-09-01'::DATE, '25-1944', 'PL창호', 'PL창호', NULL, '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 644, 1926, NULL, 2, 2, 2, 2.482, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1944', '2025-09-01'::DATE, '25-1944', 'PL창호', 'PL창호', NULL, '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 444, 906, NULL, 2, 2, 2, 0.806, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1944', '2025-09-01'::DATE, '25-1944', 'PL창호', 'PL창호', NULL, '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 294, 906, NULL, 2, 2, 2, 0.56, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1944', '2025-09-01'::DATE, '25-1944', 'PL창호', 'PL창호', NULL, '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 454, 370, NULL, 4, 4, 4, 1.12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-1970: (주)HK 지앤텍 - (없음) (3라인)
('25-1970', '2025-09-03'::DATE, '25-1970', '(주)HK 지앤텍', '(주)HK 지앤텍', NULL, '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤,오토실링X', 'P', '5CL+14TPS,AR+5CL', 24, 'mm', 500, 800, NULL, 1, 1, 1, 0.4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1970', '2025-09-03'::DATE, '25-1970', '(주)HK 지앤텍', '(주)HK 지앤텍', NULL, '보통', '승인', NULL, NULL, FALSE, 'TPS,오토실링X', 'P', '5CL+14TPS+5CL', 24, 'mm', 500, 800, NULL, 2, 2, 2, 0.8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1970', '2025-09-03'::DATE, '25-1970', '(주)HK 지앤텍', '(주)HK 지앤텍', NULL, '보통', '승인', NULL, NULL, FALSE, 'TPS,프레스X,오토실링X', 'P', '5CL+14TPS+5CL', 24, 'mm', 500, 800, NULL, 3, 3, 3, 1.2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-1978: 디엘이앤씨(주) - e편한세상 검단웰카운티 (4라인)
('25-1978', '2025-09-03'::DATE, '25-1978', '디엘이앤씨(주)', '디엘이앤씨(주)', 'e편한세상 검단웰카운티', '생산하자분', '승인', NULL, NULL, FALSE, NULL, 'P', '8CL(TF)', 8, 'mm', 165, 1960, NULL, 1, 1, 1, 0.324, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1978', '2025-09-03'::DATE, '25-1978', '디엘이앤씨(주)', '디엘이앤씨(주)', 'e편한세상 검단웰카운티', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 1074, 1123, NULL, 24, 24, 24, 28.968, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1978', '2025-09-03'::DATE, '25-1978', '디엘이앤씨(주)', '디엘이앤씨(주)', 'e편한세상 검단웰카운티', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 1074, 388, NULL, 24, 24, 24, 10.008, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1978', '2025-09-03'::DATE, '25-1978', '디엘이앤씨(주)', '디엘이앤씨(주)', 'e편한세상 검단웰카운티', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 970, 445, NULL, 24, 24, 24, 10.368, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-1996: 일신건영(주) - 평택화양지구7-1BL (6라인)
('25-1996', '2025-09-04'::DATE, '25-1996', '일신건영(주)', '일신건영(주)', '평택화양지구7-1BL', '생산하자분', '승인', NULL, NULL, FALSE, '.', 'P', '5CL+12A+5LE', 22, 'mm', 605, 1940, NULL, 1, 1, 1, 1.174, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1996', '2025-09-04'::DATE, '25-1996', '일신건영(주)', '일신건영(주)', '평택화양지구7-1BL', '생산하자분', '승인', NULL, NULL, FALSE, '.', 'P', '5CL+12A+5LE', 22, 'mm', 605, 920, NULL, 1, 1, 1, 0.557, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1996', '2025-09-04'::DATE, '25-1996', '일신건영(주)', '일신건영(주)', '평택화양지구7-1BL', '생산하자분', '승인', NULL, NULL, FALSE, '.', 'P', '5GN+12A+5LE', 22, 'mm', 605, 1940, NULL, 1, 1, 1, 1.174, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1996', '2025-09-04'::DATE, '25-1996', '일신건영(주)', '일신건영(주)', '평택화양지구7-1BL', '생산하자분', '승인', NULL, NULL, FALSE, '.', 'P', '5GN+12A+5LE', 22, 'mm', 645, 1925, NULL, 1, 1, 1, 1.242, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1996', '2025-09-04'::DATE, '25-1996', '일신건영(주)', '일신건영(주)', '평택화양지구7-1BL', '생산하자분', '승인', NULL, NULL, FALSE, 'SWS,아르곤,엣지', 'P', '5PLAONE+14AR(단열)+5CL', 24, 'mm', 1350, 2295, NULL, 1, 1, 1, 3.099, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-1996', '2025-09-04'::DATE, '25-1996', '일신건영(주)', '일신건영(주)', '평택화양지구7-1BL', '생산하자분', '승인', NULL, NULL, FALSE, 'SWS,아르곤,엣지', 'P', '5PLAONE+14AR(단열)+5CL', 24, 'mm', 1400, 2290, NULL, 1, 1, 1, 3.206, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-2000: 대우건설 - 운정3지구A-8BL (10라인)
('25-2000', '2025-09-04'::DATE, '25-2000', '대우건설', '대우건설', '운정3지구A-8BL', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 625, 2205, NULL, 20, 20, 20, 27.58, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2000', '2025-09-04'::DATE, '25-2000', '대우건설', '대우건설', '운정3지구A-8BL', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 625, 2205, NULL, 20, 20, 20, 27.58, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2000', '2025-09-04'::DATE, '25-2000', '대우건설', '대우건설', '운정3지구A-8BL', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 625, 2205, NULL, 4, 4, 4, 5.516, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2000', '2025-09-04'::DATE, '25-2000', '대우건설', '대우건설', '운정3지구A-8BL', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 525, 2205, NULL, 20, 20, 20, 23.16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2000', '2025-09-04'::DATE, '25-2000', '대우건설', '대우건설', '운정3지구A-8BL', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 525, 2205, NULL, 24, 24, 24, 27.792, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2000', '2025-09-04'::DATE, '25-2000', '대우건설', '대우건설', '운정3지구A-8BL', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5LE', 22, 'mm', 625, 2205, NULL, 20, 20, 20, 27.58, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2000', '2025-09-04'::DATE, '25-2000', '대우건설', '대우건설', '운정3지구A-8BL', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5LE', 22, 'mm', 625, 2205, NULL, 20, 20, 20, 27.58, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2000', '2025-09-04'::DATE, '25-2000', '대우건설', '대우건설', '운정3지구A-8BL', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5LE', 22, 'mm', 625, 2205, NULL, 4, 4, 4, 5.516, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2000', '2025-09-04'::DATE, '25-2000', '대우건설', '대우건설', '운정3지구A-8BL', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5LE', 22, 'mm', 525, 2205, NULL, 20, 20, 20, 23.16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2000', '2025-09-04'::DATE, '25-2000', '대우건설', '대우건설', '운정3지구A-8BL', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5LE', 22, 'mm', 525, 2205, NULL, 24, 24, 24, 27.792, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-2009: 중흥토건  - 평택브레인시티1BL(1공구) (5라인)
('25-2009', '2025-09-04'::DATE, '25-2009', '중흥토건', '중흥토건', '평택브레인시티1BL(1공구)', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 600, 1200, NULL, 4, 4, 4, 2.88, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2009', '2025-09-04'::DATE, '25-2009', '중흥토건', '중흥토건', '평택브레인시티1BL(1공구)', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 600, 1200, NULL, 4, 4, 4, 2.88, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2009', '2025-09-04'::DATE, '25-2009', '중흥토건', '중흥토건', '평택브레인시티1BL(1공구)', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 600, 1200, NULL, 8, 8, 8, 5.76, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2009', '2025-09-04'::DATE, '25-2009', '중흥토건', '중흥토건', '평택브레인시티1BL(1공구)', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 600, 1200, NULL, 8, 8, 8, 5.76, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2009', '2025-09-04'::DATE, '25-2009', '중흥토건', '중흥토건', '평택브레인시티1BL(1공구)', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 600, 1200, NULL, 8, 8, 8, 5.76, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-2063: 디엘건설(주)  - 대전역 센텀비스타 (8라인)
('25-2063', '2025-09-17'::DATE, '25-2063', '디엘건설(주)', '디엘건설(주)', '대전역 센텀비스타', '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤,엣지', 'P', '6GN+16TPS,AR+6LE', 28, 'mm', 1048, 903, NULL, 3, 3, 3, 2.841, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2063', '2025-09-17'::DATE, '25-2063', '디엘건설(주)', '디엘건설(주)', '대전역 센텀비스타', '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤,엣지', 'P', '6GN+16TPS,AR+6LE', 28, 'mm', 1046, 903, NULL, 3, 3, 3, 2.835, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2063', '2025-09-17'::DATE, '25-2063', '디엘건설(주)', '디엘건설(주)', '대전역 센텀비스타', '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤,엣지', 'P', '6GN+16TPS,AR+6LE', 28, 'mm', 1046, 878, NULL, 3, 3, 3, 2.757, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2063', '2025-09-17'::DATE, '25-2063', '디엘건설(주)', '디엘건설(주)', '대전역 센텀비스타', '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤,엣지', 'P', '6GN+16TPS,AR+6LE', 28, 'mm', 1048, 875, NULL, 3, 3, 3, 2.751, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2063', '2025-09-17'::DATE, '25-2063', '디엘건설(주)', '디엘건설(주)', '대전역 센텀비스타', '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤,엣지', 'P', '6GN+16TPS,AR+6LE', 28, 'mm', 1051, 770, NULL, 1, 1, 1, 0.81, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2063', '2025-09-17'::DATE, '25-2063', '디엘건설(주)', '디엘건설(주)', '대전역 센텀비스타', '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤,엣지', 'P', '6GN+16TPS,AR+6LE', 28, 'mm', 1046, 765, NULL, 1, 1, 1, 0.801, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2063', '2025-09-17'::DATE, '25-2063', '디엘건설(주)', '디엘건설(주)', '대전역 센텀비스타', '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤,엣지', 'P', '6GN+16TPS,AR+6LE', 28, 'mm', 1000, 713, NULL, 2, 2, 2, 1.426, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2063', '2025-09-17'::DATE, '25-2063', '디엘건설(주)', '디엘건설(주)', '대전역 센텀비스타', '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤,엣지', 'P', '6GN+16TPS,AR+6LE', 28, 'mm', 1000, 713, NULL, 2, 2, 2, 1.426, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-2077: 주식회사 폴딩엠텍 - (없음) (6라인)
('25-2077', '2025-09-19'::DATE, '25-2077', '주식회사 폴딩엠텍', '주식회사 폴딩엠텍', NULL, '보통', '승인', NULL, NULL, FALSE, '단열', 'P', '5CL(HS)+18A+5LE(HS)', 28, 'mm', 2065, 2519, NULL, 1, 1, 1, 5.202, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2077', '2025-09-19'::DATE, '25-2077', '주식회사 폴딩엠텍', '주식회사 폴딩엠텍', NULL, '보통', '승인', NULL, NULL, FALSE, '단열', 'P', '5CL+18A+5LE', 28, 'mm', 649, 2497, NULL, 3, 3, 3, 4.863, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2077', '2025-09-19'::DATE, '25-2077', '주식회사 폴딩엠텍', '주식회사 폴딩엠텍', NULL, '보통', '승인', NULL, NULL, FALSE, '단열', 'P', '5CL+18A+5LE', 28, 'mm', 382, 1704, NULL, 1, 1, 1, 0.651, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2077', '2025-09-19'::DATE, '25-2077', '주식회사 폴딩엠텍', '주식회사 폴딩엠텍', NULL, '보통', '승인', NULL, NULL, FALSE, '단열', 'P', '5CL+18A+5LE', 28, 'mm', 762, 1683, NULL, 1, 1, 1, 1.283, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2077', '2025-09-19'::DATE, '25-2077', '주식회사 폴딩엠텍', '주식회사 폴딩엠텍', NULL, '보통', '승인', NULL, NULL, FALSE, '단열', 'P', '5CL+18A+5LE', 28, 'mm', 2245, 376, NULL, 1, 1, 1, 0.845, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2077', '2025-09-19'::DATE, '25-2077', '주식회사 폴딩엠텍', '주식회사 폴딩엠텍', NULL, '보통', '승인', NULL, NULL, FALSE, '단열', 'P', '5CL+18A+5LE', 28, 'mm', 2091, 376, NULL, 1, 1, 1, 0.787, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-2107: 현대엔지니어링(주) - 시흥장현지구 업무시설  (10라인)
('25-2107', '2025-09-29'::DATE, '25-2107', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '시공하자분', '승인', NULL, NULL, FALSE, '.', 'P', '10CL(TF)', 10, 'mm', 1057, 290, NULL, 1, 1, 1, 0.307, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2107', '2025-09-29'::DATE, '25-2107', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '시공하자분', '승인', NULL, NULL, FALSE, '982', 'P', '5CL+12A+5CL', 22, 'mm', 965, 2225, NULL, 1, 1, 1, 2.148, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2107', '2025-09-29'::DATE, '25-2107', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '시공하자분', '승인', NULL, NULL, FALSE, '982', 'P', '5CL+12A+5CL', 22, 'mm', 880, 2195, NULL, 1, 1, 1, 1.932, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2107', '2025-09-29'::DATE, '25-2107', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '시공하자분', '승인', NULL, NULL, FALSE, '982', 'P', '5CL+12A+5CL', 22, 'mm', 1030, 2090, NULL, 1, 1, 1, 2.153, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2107', '2025-09-29'::DATE, '25-2107', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '시공하자분', '승인', NULL, NULL, FALSE, '써믹스단열,아르곤,982,엣지', 'P', '5SKN154II(HS)+14AR(단열)+5CL', 24, 'mm', 925, 1755, NULL, 1, 1, 1, 1.624, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2107', '2025-09-29'::DATE, '25-2107', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '시공하자분', '승인', NULL, NULL, FALSE, '써믹스단열,아르곤,982,엣지', 'P', '5SKN154II(HS)+14AR(단열)+5CL', 24, 'mm', 1025, 1715, NULL, 1, 1, 1, 1.758, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2107', '2025-09-29'::DATE, '25-2107', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '생산하자분', '승인', NULL, NULL, FALSE, '써믹스단열,아르곤,982,엣지', 'P', '5SKN154II(HS)+14AR(단열)+5CL', 24, 'mm', 930, 545, NULL, 1, 1, 1, 0.507, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2107', '2025-09-29'::DATE, '25-2107', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '생산하자분', '승인', NULL, NULL, FALSE, '써믹스단열,아르곤,982,엣지', 'P', '5SKN154II(HS)+14AR(단열)+5CL', 24, 'mm', 810, 545, NULL, 1, 1, 1, 0.442, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2107', '2025-09-29'::DATE, '25-2107', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '시공하자분', '승인', NULL, NULL, FALSE, '써믹스단열,아르곤,982,엣지', 'P', '6SKG149T(HS)+14AR(단열)+6CL', 26, 'mm', 920, 2205, NULL, 1, 1, 1, 2.029, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2107', '2025-09-29'::DATE, '25-2107', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '시공하자분', '승인', NULL, NULL, FALSE, '좌스텝,써믹스단열,아르곤,982,엣지,마크X', 'P', '6SKG149T(HS)+12AR(단열)+6CL', 24, 'mm', 1350, 2370, NULL, 1, 1, 1, 3.2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-2184: 대성유리창호(주) - 용산 유엔사  (4라인)
('25-2184', '2025-10-28'::DATE, '25-2184', '대성유리창호(주)', '대성유리창호(주)', '용산 유엔사', '보통', '승인', NULL, NULL, FALSE, '롤텍,엣지', 'P', '5PLAONEII(HS)+12A(단열)+10.76투명배강', 27.76, 'mm', 839, 1188, NULL, 1, 1, 1, 0.997, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2184', '2025-10-28'::DATE, '25-2184', '대성유리창호(주)', '대성유리창호(주)', '용산 유엔사', '보통', '승인', NULL, NULL, FALSE, '롤텍,엣지', 'P', '5PLAONEII(HS)+12A(단열)+10.76투명배강', 27.76, 'mm', 949, 1140, NULL, 1, 1, 1, 1.082, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2184', '2025-10-28'::DATE, '25-2184', '대성유리창호(주)', '대성유리창호(주)', '용산 유엔사', '보통', '승인', NULL, NULL, FALSE, '롤텍,아르곤,엣지5+14+5+14+10.76', 'P', '5PLAONEII(HS)+5DURAMAX(HS)+10.76투명배강', 48.76, 'mm', 2301, 2519, NULL, 1, 1, 1, 5.797, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2184', '2025-10-28'::DATE, '25-2184', '대성유리창호(주)', '대성유리창호(주)', '용산 유엔사', '보통', '승인', NULL, NULL, FALSE, '롤텍,아르곤,엣지5+14+5+14+10.76', 'P', '5PLAONEII(HS)+5DURAMAX(HS)+10.76투명배강', 48.76, 'mm', 822, 2519, NULL, 1, 1, 1, 2.071, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-2256: 금호건설 - 강릉회산동 공동주택 (4라인)
('25-2256', '2025-10-20'::DATE, '25-2256', '금호건설', '금호건설', '강릉회산동 공동주택', '보통', '승인', NULL, NULL, FALSE, 'TPS,AR', 'P', '10.76그린접합+14TPS,AR+5LE+14TPS,AR+5LE', 48.76, 'mm', 1190, 510, NULL, 5, 5, 5, 3.035, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2256', '2025-10-20'::DATE, '25-2256', '금호건설', '금호건설', '강릉회산동 공동주택', '보통', '승인', NULL, NULL, FALSE, 'TPS,AR', 'P', '10.76그린접합+14TPS,AR+5LE+14TPS,AR+5LE', 48.76, 'mm', 1190, 510, NULL, 10, 10, 10, 6.07, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2256', '2025-10-20'::DATE, '25-2256', '금호건설', '금호건설', '강릉회산동 공동주택', '보통', '승인', NULL, NULL, FALSE, 'TPS,AR', 'P', '10.76그린접합+14TPS,AR+5LE+14TPS,AR+5LE', 48.76, 'mm', 1190, 510, NULL, 5, 5, 5, 3.035, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2256', '2025-10-20'::DATE, '25-2256', '금호건설', '금호건설', '강릉회산동 공동주택', '보통', '승인', NULL, NULL, FALSE, 'TPS,AR', 'P', '10.76그린접합+14TPS,AR+5LE+14TPS,AR+5LE', 48.76, 'mm', 1190, 510, NULL, 5, 5, 5, 3.035, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-2291: 현대건설(주) - 현대 하이테크센터 (5라인)
('25-2291', '2025-10-24'::DATE, '25-2291', '현대건설(주)', '현대건설(주)', '현대 하이테크센터', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '10CL(TF)', 10, 'mm', 1093, 2230, NULL, 5, 5, 5, 12.19, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2291', '2025-10-24'::DATE, '25-2291', '현대건설(주)', '현대건설(주)', '현대 하이테크센터', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '10CL(TF)', 10, 'mm', 980, 2230, NULL, 1, 1, 1, 2.186, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2291', '2025-10-24'::DATE, '25-2291', '현대건설(주)', '현대건설(주)', '현대 하이테크센터', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '10CL(TF)', 10, 'mm', 1093, 590, NULL, 5, 5, 5, 3.225, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2291', '2025-10-24'::DATE, '25-2291', '현대건설(주)', '현대건설(주)', '현대 하이테크센터', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '10CL(TF)', 10, 'mm', 1023, 590, NULL, 1, 1, 1, 0.604, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2291', '2025-10-24'::DATE, '25-2291', '현대건설(주)', '현대건설(주)', '현대 하이테크센터', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '10CL(TF)', 10, 'mm', 980, 590, NULL, 1, 1, 1, 0.579, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-2347: (주)포스코이앤씨 - 의정부시 캠프라과디아 (9라인)
('25-2347', '2025-10-31'::DATE, '25-2347', '(주)포스코이앤씨', '(주)포스코이앤씨', '의정부시 캠프라과디아', '보통', '승인', NULL, NULL, FALSE, '아르곤', 'P', '8.76(4CL+0.76+4CL)+10AR+5LE', 23.76, 'mm', 1519, 1870, NULL, 5, 5, 5, 14.205, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2347', '2025-10-31'::DATE, '25-2347', '(주)포스코이앤씨', '(주)포스코이앤씨', '의정부시 캠프라과디아', '보통', '승인', NULL, NULL, FALSE, '아르곤', 'P', '8.76(4CL+0.76+4CL)+10AR+5LE', 23.76, 'mm', 1419, 1870, NULL, 5, 5, 5, 13.27, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2347', '2025-10-31'::DATE, '25-2347', '(주)포스코이앤씨', '(주)포스코이앤씨', '의정부시 캠프라과디아', '보통', '승인', NULL, NULL, FALSE, '아르곤', 'P', '8.76(4CL+0.76+4CL)+10AR+5LE', 23.76, 'mm', 1419, 1870, NULL, 5, 5, 5, 13.27, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2347', '2025-10-31'::DATE, '25-2347', '(주)포스코이앤씨', '(주)포스코이앤씨', '의정부시 캠프라과디아', '보통', '승인', NULL, NULL, FALSE, '아르곤', 'P', '8.76(4CL+0.76+4CL)+10AR+5LE', 23.76, 'mm', 1419, 1870, NULL, 5, 5, 5, 13.27, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2347', '2025-10-31'::DATE, '25-2347', '(주)포스코이앤씨', '(주)포스코이앤씨', '의정부시 캠프라과디아', '보통', '승인', NULL, NULL, FALSE, '아르곤', 'P', '8.76(4CL+0.76+4CL)+10AR+5LE', 23.76, 'mm', 1419, 1870, NULL, 5, 5, 5, 13.27, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2347', '2025-10-31'::DATE, '25-2347', '(주)포스코이앤씨', '(주)포스코이앤씨', '의정부시 캠프라과디아', '보통', '승인', NULL, NULL, FALSE, '아르곤', 'P', '8.76(4CL+0.76+4CL)+10AR+5LE', 23.76, 'mm', 1419, 1870, NULL, 5, 5, 5, 13.27, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2347', '2025-10-31'::DATE, '25-2347', '(주)포스코이앤씨', '(주)포스코이앤씨', '의정부시 캠프라과디아', '보통', '승인', NULL, NULL, FALSE, '아르곤', 'P', '8.76(4CL+0.76+4CL)+10AR+5LE', 23.76, 'mm', 594, 1856, NULL, 5, 5, 5, 5.515, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2347', '2025-10-31'::DATE, '25-2347', '(주)포스코이앤씨', '(주)포스코이앤씨', '의정부시 캠프라과디아', '보통', '승인', NULL, NULL, FALSE, '아르곤', 'P', '8.76(4CL+0.76+4CL)+10AR+5LE', 23.76, 'mm', 594, 1856, NULL, 5, 5, 5, 5.515, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2347', '2025-10-31'::DATE, '25-2347', '(주)포스코이앤씨', '(주)포스코이앤씨', '의정부시 캠프라과디아', '보통', '승인', NULL, NULL, FALSE, '아르곤', 'P', '8.76(4CL+0.76+4CL)+10AR+5LE', 23.76, 'mm', 594, 1856, NULL, 5, 5, 5, 5.515, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-2358: 동부건설  - 인천검단AA-21BL(7공구) (10라인)
('25-2358', '2025-10-31'::DATE, '25-2358', '동부건설', '동부건설', '인천검단AA-21BL(7공구)', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 1485, 442, NULL, 22, 22, 22, 14.454, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2358', '2025-10-31'::DATE, '25-2358', '동부건설', '동부건설', '인천검단AA-21BL(7공구)', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 1395, 442, NULL, 44, 44, 44, 27.148, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2358', '2025-10-31'::DATE, '25-2358', '동부건설', '동부건설', '인천검단AA-21BL(7공구)', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 1095, 442, NULL, 22, 22, 22, 10.648, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2358', '2025-10-31'::DATE, '25-2358', '동부건설', '동부건설', '인천검단AA-21BL(7공구)', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 718, 442, NULL, 22, 22, 22, 6.996, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2358', '2025-10-31'::DATE, '25-2358', '동부건설', '동부건설', '인천검단AA-21BL(7공구)', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 695, 442, NULL, 22, 22, 22, 6.776, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2358', '2025-10-31'::DATE, '25-2358', '동부건설', '동부건설', '인천검단AA-21BL(7공구)', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 674, 442, NULL, 44, 44, 44, 13.112, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2358', '2025-10-31'::DATE, '25-2358', '동부건설', '동부건설', '인천검단AA-21BL(7공구)', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 970, 315, NULL, 22, 22, 22, 6.732, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2358', '2025-10-31'::DATE, '25-2358', '동부건설', '동부건설', '인천검단AA-21BL(7공구)', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 593, 315, NULL, 22, 22, 22, 6.16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2358', '2025-10-31'::DATE, '25-2358', '동부건설', '동부건설', '인천검단AA-21BL(7공구)', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 570, 315, NULL, 22, 22, 22, 6.16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2358', '2025-10-31'::DATE, '25-2358', '동부건설', '동부건설', '인천검단AA-21BL(7공구)', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 548, 315, NULL, 44, 44, 44, 12.32, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-2495: (주)창희씨앤에스 - 롯데바이오로직스 (8라인)
('25-2495', '2025-11-20'::DATE, '25-2495', '(주)창희씨앤에스', '(주)창희씨앤에스', '롯데바이오로직스', '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤,982,엣지', 'P', '6SKS143II(HS)+16TPS,AR+6CL(HS)', 28, 'mm', 1940, 1685, NULL, 16, 16, 16, 52.304, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2495', '2025-11-20'::DATE, '25-2495', '(주)창희씨앤에스', '(주)창희씨앤에스', '롯데바이오로직스', '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤,982,엣지', 'P', '6SKS143II(HS)+16TPS,AR+6CL(HS)', 28, 'mm', 1940, 1485, NULL, 59, 59, 59, 169.979, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2495', '2025-11-20'::DATE, '25-2495', '(주)창희씨앤에스', '(주)창희씨앤에스', '롯데바이오로직스', '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤,982,엣지', 'P', '6SKS143II(HS)+16TPS,AR+6CL(HS)', 28, 'mm', 1940, 1005, NULL, 1, 1, 1, 1.95, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2495', '2025-11-20'::DATE, '25-2495', '(주)창희씨앤에스', '(주)창희씨앤에스', '롯데바이오로직스', '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤,982,엣지', 'P', '6SKS143II(HS)+16TPS,AR+6CL(HS)', 28, 'mm', 1940, 705, NULL, 3, 3, 3, 4.104, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2495', '2025-11-20'::DATE, '25-2495', '(주)창희씨앤에스', '(주)창희씨앤에스', '롯데바이오로직스', '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤,982,엣지', 'P', '6SKS143II(HS)+16TPS,AR+6CL(HS)', 28, 'mm', 1940, 685, NULL, 20, 20, 20, 26.58, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2495', '2025-11-20'::DATE, '25-2495', '(주)창희씨앤에스', '(주)창희씨앤에스', '롯데바이오로직스', '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤,982,엣지', 'P', '6SKS143II(HS)+16TPS,AR+6CL(HS)', 28, 'mm', 1940, 585, NULL, 7, 7, 7, 7.945, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2495', '2025-11-20'::DATE, '25-2495', '(주)창희씨앤에스', '(주)창희씨앤에스', '롯데바이오로직스', '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤,982,엣지', 'P', '6SKS143II(HS)+16TPS,AR+6CL(HS)', 28, 'mm', 950, 665, NULL, 1, 1, 1, 0.632, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-2495', '2025-11-20'::DATE, '25-2495', '(주)창희씨앤에스', '(주)창희씨앤에스', '롯데바이오로직스', '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤,982,엣지', 'P', '6SKS143II(HS)+16TPS,AR+6CL(HS)', 28, 'mm', 950, 965, NULL, 3, 3, 3, 2.751, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)

;

-- 완료 메시지
SELECT
    '작업 의뢰 데이터 ' || COUNT(*) || '건 INSERT 완료' AS result
FROM hkgn.work_request
WHERE request_no IN ('25-1944', '25-1970', '25-1978', '25-1996', '25-2000', '25-2009', '25-2063', '25-2077', '25-2107', '25-2184', '25-2256', '25-2291', '25-2347', '25-2358', '25-2495');
