-- ============================================
-- 작업 의뢰 마이그레이션 데이터 INSERT (2025년 1월)
-- ============================================
-- 출처: ref/작업의뢰20251.xlsx
-- 생성일시: 2026-02-09
-- 설명: 2025-01 작업 의뢰 데이터 11건 (거래처 11곳, 상세 52라인)
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
-- 24-3819: 디엘건설(주)  - 대전역 센텀비스타 (4라인)
('24-3819', '2025-01-08'::DATE, '24-3819', '디엘건설(주)', '디엘건설(주)', '대전역 센텀비스타', '보통', '승인', NULL, NULL, FALSE, 'TPS', 'P', '8.76(5GN+0.76+3CL)+12TPS+5LE', 25.76, 'mm', 625, 855, NULL, 8, 8, 8, 4.28, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('24-3819', '2025-01-08'::DATE, '24-3819', '디엘건설(주)', '디엘건설(주)', '대전역 센텀비스타', '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤', 'P', '5CL+14TPS,AR+5LE', 24, 'mm', 1675, 1915, NULL, 4, 4, 4, 12.832, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('24-3819', '2025-01-08'::DATE, '24-3819', '디엘건설(주)', '디엘건설(주)', '대전역 센텀비스타', '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤', 'P', '5CL+14TPS,AR+5LE', 24, 'mm', 775, 875, NULL, 4, 4, 4, 2.716, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('24-3819', '2025-01-08'::DATE, '24-3819', '디엘건설(주)', '디엘건설(주)', '대전역 센텀비스타', '보통', '승인', NULL, NULL, FALSE, 'TPS,아르곤', 'P', '5CL+14TPS,AR+5LE', 24, 'mm', 665, 865, NULL, 4, 4, 4, 2.304, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 24-3871: 대우건설 - 평택포승지식산업센터  (4라인)
('24-3871', '2025-01-02'::DATE, '24-3871', '대우건설', '대우건설', '평택포승지식산업센터', '보통', '승인', NULL, NULL, FALSE, 'TPS,982,엣지', 'P', '5SKG144T(HS)+6TPS+5CL(HS)', 16, 'mm', 1360, 1285, NULL, 3, 3, 3, 5.244, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('24-3871', '2025-01-02'::DATE, '24-3871', '대우건설', '대우건설', '평택포승지식산업센터', '보통', '승인', NULL, NULL, FALSE, 'TPS,982,엣지', 'P', '5SKG144T(HS)+6TPS+5CL', 16, 'mm', 1360, 1485, NULL, 3, 3, 3, 6.06, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('24-3871', '2025-01-02'::DATE, '24-3871', '대우건설', '대우건설', '평택포승지식산업센터', '보통', '승인', NULL, NULL, FALSE, 'TPS,982,엣지', 'P', '5SKG144T(HS)+6TPS+5CL', 16, 'mm', 1360, 585, NULL, 3, 3, 3, 2.388, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('24-3871', '2025-01-02'::DATE, '24-3871', '대우건설', '대우건설', '평택포승지식산업센터', '보통', '승인', NULL, NULL, FALSE, 'TPS,982,엣지', 'P', '5SKG144T(HS)+6TPS+5CL', 16, 'mm', 1304, 560, NULL, 3, 3, 3, 2.193, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 24-3877: 현대엔지니어링(주) - 시흥장현지구 업무시설  (6라인)
('24-3877', '2025-01-02'::DATE, '24-3877', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '보통', '승인', NULL, NULL, FALSE, '써믹스단열,982,엣지', 'P', '5SKN154II(HS)+14A(단열)+5CL(HS)', 24, 'mm', 1230, 1180, NULL, 2, 2, 2, 2.904, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('24-3877', '2025-01-02'::DATE, '24-3877', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '보통', '승인', NULL, NULL, FALSE, '써믹스단열,982,엣지', 'P', '5SKN154II(HS)+14A(단열)+5CL(HS)', 24, 'mm', 1180, 1180, NULL, 6, 6, 6, 8.358, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('24-3877', '2025-01-02'::DATE, '24-3877', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '보통', '승인', NULL, NULL, FALSE, '써믹스단열,982,엣지', 'P', '5SKN154II(HS)+14A(단열)+5CL(HS)', 24, 'mm', 1300, 740, NULL, 9, 9, 9, 8.658, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('24-3877', '2025-01-02'::DATE, '24-3877', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '보통', '승인', NULL, NULL, FALSE, '써믹스단열,982,엣지', 'P', '5SKN154II(HS)+14A(단열)+5CL(HS)', 24, 'mm', 1292, 740, NULL, 1, 1, 1, 0.957, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('24-3877', '2025-01-02'::DATE, '24-3877', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '보통', '승인', NULL, NULL, FALSE, '써믹스단열,982,엣지', 'P', '5SKN154II(HS)+14A(단열)+5CL(HS)', 24, 'mm', 1230, 740, NULL, 1, 1, 1, 0.911, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('24-3877', '2025-01-02'::DATE, '24-3877', '현대엔지니어링(주)', '현대엔지니어링(주)', '시흥장현지구 업무시설', '보통', '승인', NULL, NULL, FALSE, '써믹스단열,982,엣지', 'P', '5SKN154II(HS)+14A(단열)+5CL(HS)', 24, 'mm', 1222, 740, NULL, 1, 1, 1, 0.905, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-0025: (주)KCC건설  - 안성 방초2지구 물류센터  (4라인)
('25-0025', '2025-01-03'::DATE, '25-0025', '(주)KCC건설', '(주)KCC건설', '안성 방초2지구 물류센터', '보통', '승인', NULL, NULL, FALSE, 'eno,아르곤,엣지,982', 'P', '5MCT154S+14AR(단열)+5CL', 24, 'mm', 915, 1505, NULL, 6, 6, 6, 8.268, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0025', '2025-01-03'::DATE, '25-0025', '(주)KCC건설', '(주)KCC건설', '안성 방초2지구 물류센터', '보통', '승인', NULL, NULL, FALSE, 'eno,아르곤,엣지,982', 'P', '5MCT154S+14AR(단열)+5CL', 24, 'mm', 915, 1505, NULL, 4, 4, 4, 5.512, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0025', '2025-01-03'::DATE, '25-0025', '(주)KCC건설', '(주)KCC건설', '안성 방초2지구 물류센터', '보통', '승인', NULL, NULL, FALSE, 'eno,아르곤,엣지,982', 'P', '5MCT154S+14AR(단열)+5CL', 24, 'mm', 915, 1505, NULL, 7, 7, 7, 9.646, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0025', '2025-01-03'::DATE, '25-0025', '(주)KCC건설', '(주)KCC건설', '안성 방초2지구 물류센터', '보통', '승인', NULL, NULL, FALSE, 'eno,아르곤,엣지,982', 'P', '5MCT154S+14AR(단열)+5CL', 24, 'mm', 915, 1505, NULL, 4, 4, 4, 5.512, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-0042: PL창호  - (없음) (4라인)
('25-0042', '2025-01-06'::DATE, '25-0042', 'PL창호', 'PL창호', NULL, '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5LE', 22, 'mm', 1119, 1875, NULL, 1, 1, 1, 2.099, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0042', '2025-01-06'::DATE, '25-0042', 'PL창호', 'PL창호', NULL, '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5LE', 22, 'mm', 763, 1875, NULL, 2, 2, 2, 2.862, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0042', '2025-01-06'::DATE, '25-0042', 'PL창호', 'PL창호', NULL, '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5GN+12A+5LE', 22, 'mm', 1119, 1875, NULL, 1, 1, 1, 2.099, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0042', '2025-01-06'::DATE, '25-0042', 'PL창호', 'PL창호', NULL, '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5GN+12A+5LE', 22, 'mm', 763, 1875, NULL, 2, 2, 2, 2.862, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-0045: (주)한양 - 남양주 도곡2 주택재개발 (3라인)
('25-0045', '2025-01-06'::DATE, '25-0045', '(주)한양', '(주)한양', '남양주 도곡2 주택재개발', '생산하자분', '승인', NULL, NULL, FALSE, NULL, 'P', '6T그레이(HS)', 6, 'mm', 1120, 1505, NULL, 1, 1, 1, 1.686, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0045', '2025-01-06'::DATE, '25-0045', '(주)한양', '(주)한양', '남양주 도곡2 주택재개발', '생산하자분', '승인', NULL, NULL, FALSE, NULL, 'P', '6T그레이(HS)', 6, 'mm', 765, 1545, NULL, 1, 1, 1, 1.182, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0045', '2025-01-06'::DATE, '25-0045', '(주)한양', '(주)한양', '남양주 도곡2 주택재개발', '생산하자분', '승인', NULL, NULL, FALSE, NULL, 'P', '6T그레이(HS)', 6, 'mm', 765, 685, NULL, 1, 1, 1, 0.524, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-0156: 주식회사 폴딩엠텍 - (없음) (3라인)
('25-0156', '2025-01-09'::DATE, '25-0156', '주식회사 폴딩엠텍', '주식회사 폴딩엠텍', NULL, '보통', '승인', NULL, NULL, FALSE, 'TPS', 'P', '5LE+12TPS+5CL+12TPS+5LE', 39, 'mm', 812, 2652, NULL, 1, 1, 1, 2.154, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0156', '2025-01-09'::DATE, '25-0156', '주식회사 폴딩엠텍', '주식회사 폴딩엠텍', NULL, '보통', '승인', NULL, NULL, FALSE, 'TPS', 'P', '5LE+12TPS+5CL+12TPS+5LE', 39, 'mm', 520, 2652, NULL, 8, 8, 8, 11.032, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0156', '2025-01-09'::DATE, '25-0156', '주식회사 폴딩엠텍', '주식회사 폴딩엠텍', NULL, '보통', '승인', NULL, NULL, FALSE, 'TPS', 'P', '5CL+8TPS+5CL', 18, 'mm', 485, 2646, NULL, 8, 8, 8, 10.272, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-0175: 중흥토건  - 수원제115-10구역  (9라인)
('25-0175', '2025-01-14'::DATE, '25-0175', '중흥토건', '중흥토건', '수원제115-10구역', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 975, 2310, NULL, 4, 4, 4, 9.012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0175', '2025-01-14'::DATE, '25-0175', '중흥토건', '중흥토건', '수원제115-10구역', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 775, 2310, NULL, 4, 4, 4, 7.164, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0175', '2025-01-14'::DATE, '25-0175', '중흥토건', '중흥토건', '수원제115-10구역', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 775, 2310, NULL, 4, 4, 4, 7.164, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0175', '2025-01-14'::DATE, '25-0175', '중흥토건', '중흥토건', '수원제115-10구역', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 675, 2310, NULL, 4, 4, 4, 6.24, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0175', '2025-01-14'::DATE, '25-0175', '중흥토건', '중흥토건', '수원제115-10구역', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 625, 2310, NULL, 4, 4, 4, 5.776, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0175', '2025-01-14'::DATE, '25-0175', '중흥토건', '중흥토건', '수원제115-10구역', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 775, 2295, NULL, 4, 4, 4, 7.116, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0175', '2025-01-14'::DATE, '25-0175', '중흥토건', '중흥토건', '수원제115-10구역', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 775, 2295, NULL, 4, 4, 4, 7.116, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0175', '2025-01-14'::DATE, '25-0175', '중흥토건', '중흥토건', '수원제115-10구역', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 675, 2295, NULL, 4, 4, 4, 6.2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0175', '2025-01-14'::DATE, '25-0175', '중흥토건', '중흥토건', '수원제115-10구역', '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL+12A+5CL', 22, 'mm', 675, 2295, NULL, 4, 4, 4, 6.2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-0222: (주)윈스타트 - (없음) (3라인)
('25-0222', '2025-01-17'::DATE, '25-0222', '(주)윈스타트', '(주)윈스타트', NULL, '보통', '승인', NULL, NULL, FALSE, 'SWS,아르곤,엣지', 'P', '5SKN154Ⅱ(HS)+14AR(SWS)+5CL', 24, 'mm', 1764, 1764, NULL, 1, 1, 1, 3.112, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0222', '2025-01-17'::DATE, '25-0222', '(주)윈스타트', '(주)윈스타트', NULL, '보통', '승인', NULL, NULL, FALSE, 'SWS,아르곤,엣지5+14+5+14+5', 'P', '5SKN154II(HS)+5CL+5PLAONE', 39, 'mm', 1764, 1764, NULL, 1, 1, 1, 3.112, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0222', '2025-01-17'::DATE, '25-0222', '(주)윈스타트', '(주)윈스타트', NULL, '보통', '승인', NULL, NULL, FALSE, 'SWS,아르곤,엣지5+14+5+14+5', 'P', '5SKN154II(HS)+5CL+5DURAplus', 43, 'mm', 875, 1795, NULL, 2, 2, 2, 3.142, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-0231: (주)한국이앤비 - (없음) (5라인)
('25-0231', '2025-01-21'::DATE, '25-0231', '(주)한국이앤비', '(주)한국이앤비', NULL, '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 1981, 3353, NULL, 8, 8, 8, 53.144, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0231', '2025-01-21'::DATE, '25-0231', '(주)한국이앤비', '(주)한국이앤비', NULL, '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 2134, 3048, NULL, 29, 29, 29, 188.645, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0231', '2025-01-21'::DATE, '25-0231', '(주)한국이앤비', '(주)한국이앤비', NULL, '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5CL', 5, 'mm', 2286, 3048, NULL, 16, 16, 16, 111.488, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0231', '2025-01-21'::DATE, '25-0231', '(주)한국이앤비', '(주)한국이앤비', NULL, '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5SuperPlus2.0', 5, 'mm', 1981, 3353, NULL, 20, 20, 20, 132.86, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0231', '2025-01-21'::DATE, '25-0231', '(주)한국이앤비', '(주)한국이앤비', NULL, '보통', '승인', NULL, NULL, FALSE, NULL, 'P', '5SuperPlus2.0', 5, 'mm', 2134, 3048, NULL, 32, 32, 32, 208.16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- 25-0240: 디엘이앤씨(주) - 판교G2업무시설 1공구 (7라인)
('25-0240', '2025-01-21'::DATE, '25-0240', '디엘이앤씨(주)', '디엘이앤씨(주)', '판교G2업무시설 1공구', '시공하자분', '승인', NULL, NULL, FALSE, 'TPS,아르곤,엣지,982,5+12+5+12+5', 'P', '5MCT150(HS)+5CL(HS)+5EHD176', 39, 'mm', 1400, 2885, NULL, 1, 1, 1, 4.039, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0240', '2025-01-21'::DATE, '25-0240', '디엘이앤씨(주)', '디엘이앤씨(주)', '판교G2업무시설 1공구', '시공하자분', '승인', NULL, NULL, FALSE, 'TPS,아르곤,엣지,982,5+12+5+12+5', 'P', '5MCT150(HS)+5CL(HS)+5EHD176', 39, 'mm', 1140, 2865, NULL, 1, 1, 1, 3.267, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0240', '2025-01-21'::DATE, '25-0240', '디엘이앤씨(주)', '디엘이앤씨(주)', '판교G2업무시설 1공구', '시공하자분', '승인', NULL, NULL, FALSE, 'TPS,아르곤,엣지,982,5+12+5+12+5', 'P', '5MCT150(HS)+5CL(HS)+5EHD176', 39, 'mm', 1400, 2865, NULL, 1, 1, 1, 4.011, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0240', '2025-01-21'::DATE, '25-0240', '디엘이앤씨(주)', '디엘이앤씨(주)', '판교G2업무시설 1공구', '시공하자분', '승인', NULL, NULL, FALSE, 'TPS,아르곤,엣지,982,5+12+5+12+5', 'P', '5MCT150(HS)+5CL(HS)+5EHD176', 39, 'mm', 1400, 1585, NULL, 1, 1, 1, 2.219, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0240', '2025-01-21'::DATE, '25-0240', '디엘이앤씨(주)', '디엘이앤씨(주)', '판교G2업무시설 1공구', '시공하자분', '승인', NULL, NULL, FALSE, 'TPS,아르곤,엣지,982,5+12+5+12+5', 'P', '5MCT150(HS)+5CL(HS)+5EHD176', 39, 'mm', 620, 2885, NULL, 1, 1, 1, 1.789, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0240', '2025-01-21'::DATE, '25-0240', '디엘이앤씨(주)', '디엘이앤씨(주)', '판교G2업무시설 1공구', '시공하자분', '승인', NULL, NULL, FALSE, 'TPS,엣지,982', 'P', '5MCT150(HS)+14TPS+5CL(HS)', 24, 'mm', 620, 415, NULL, 1, 1, 1, 0.28, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25-0240', '2025-01-21'::DATE, '25-0240', '디엘이앤씨(주)', '디엘이앤씨(주)', '판교G2업무시설 1공구', '시공하자분', '승인', NULL, NULL, FALSE, 'TPS,엣지,982', 'P', '5MCT150(HS)+14TPS+5CL(HS)', 24, 'mm', 1040, 1615, NULL, 1, 1, 1, 1.68, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)

;

-- 완료 메시지
SELECT
    '작업 의뢰 데이터 ' || COUNT(*) || '건 INSERT 완료' AS result
FROM hkgn.work_request
WHERE request_no IN ('24-3819', '24-3871', '24-3877', '25-0025', '25-0042', '25-0045', '25-0156', '25-0175', '25-0222', '25-0231', '25-0240');
