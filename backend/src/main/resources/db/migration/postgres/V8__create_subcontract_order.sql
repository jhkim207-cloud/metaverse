-- 임가공(외주발주) 테이블 생성 + 샘플 데이터
CREATE TABLE IF NOT EXISTS hkgn.subcontract_order (
    id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    subcontract_no        VARCHAR(30)   NOT NULL,
    line_seq              INTEGER       NOT NULL DEFAULT 1,
    subcontract_date      DATE          NOT NULL,
    subcontract_type      VARCHAR(30)   NOT NULL DEFAULT 'PROCESSING',
    subcontractor_cd      VARCHAR(30),
    subcontractor_nm      VARCHAR(100)  NOT NULL,
    order_no              VARCHAR(30),
    site_nm               VARCHAR(200),
    location              VARCHAR(200),
    material_cd           VARCHAR(30),
    material_nm           VARCHAR(200),
    product_type          VARCHAR(50),
    thickness             NUMERIC(6,2),
    order_qty             NUMERIC(12,2) DEFAULT 0,
    unit                  VARCHAR(10)   DEFAULT 'EA',
    area_m2               NUMERIC(12,4),
    area_pyeong           NUMERIC(12,2),
    unit_price            NUMERIC(15,2) DEFAULT 0,
    total_amount          NUMERIC(15,2) DEFAULT 0,
    requested_receipt_date DATE,
    actual_receipt_date   DATE,
    receipt_changed_date  DATE,
    receipt_location      VARCHAR(100),
    completed_qty         NUMERIC(12,2) DEFAULT 0,
    subcontract_status    VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    remarks               TEXT,
    created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by            VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by            VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    CONSTRAINT uq_subcontract_order_line UNIQUE (subcontract_no, line_seq)
);

CREATE INDEX idx_subcontract_no ON hkgn.subcontract_order(subcontract_no);
CREATE INDEX idx_subcontract_date ON hkgn.subcontract_order(subcontract_date);
CREATE INDEX idx_subcontract_type ON hkgn.subcontract_order(subcontract_type);
CREATE INDEX idx_subcontract_contractor ON hkgn.subcontract_order(subcontractor_cd);
CREATE INDEX idx_subcontract_order_no ON hkgn.subcontract_order(order_no);
CREATE INDEX idx_subcontract_site ON hkgn.subcontract_order(site_nm);
CREATE INDEX idx_subcontract_status ON hkgn.subcontract_order(subcontract_status);
CREATE INDEX idx_subcontract_receipt_date ON hkgn.subcontract_order(requested_receipt_date);

-- 샘플 데이터
INSERT INTO hkgn.subcontract_order (
    subcontract_no, line_seq, subcontract_date, subcontract_type,
    subcontractor_cd, subcontractor_nm, order_no,
    site_nm, location,
    material_cd, material_nm, product_type, thickness,
    order_qty, unit, area_m2, area_pyeong,
    unit_price, total_amount,
    requested_receipt_date, actual_receipt_date, receipt_changed_date, receipt_location,
    completed_qty, subcontract_status, remarks
) VALUES
-- 발주 1: HK-250601-01 (상우지테크, 일신건영 - 이천 마장지구)
('HK-250601-01', 1, '2025-06-01', 'PROCESSING', 'O001', '상우지테크', NULL,
 '일신건영 - 이천 마장지구', '1-1차2동1-9층', NULL, '5CL+12A+5LE', NULL, 22,
 278, 'EA', 255.47, 2783, 0, 0,
 '2025-06-15', '2025-06-15', NULL, 'HK지앤텍 1공장', 278, 'COMPLETED', NULL),

('HK-250601-01', 2, '2025-06-01', 'PROCESSING', 'O001', '상우지테크', NULL,
 '일신건영 - 이천 마장지구', '1-1차2동1-9층', NULL, '5GN+12A+5LE', NULL, 22,
 324, 'EA', 311.33, 3391, 0, 0,
 '2025-06-15', '2025-06-15', NULL, 'HK지앤텍 1공장', 324, 'COMPLETED', NULL),

('HK-250601-01', 3, '2025-06-01', 'PROCESSING', 'O001', '상우지테크', NULL,
 '일신건영 - 이천 마장지구', '1-2차3동1-9층', NULL, '5CL+12A+5LE', NULL, 22,
 302, 'EA', 276.10, 3007, 0, 0,
 '2025-06-16', '2025-06-15', NULL, 'HK지앤텍 1공장', 302, 'COMPLETED', NULL),

('HK-250601-01', 4, '2025-06-01', 'PROCESSING', 'O001', '상우지테크', NULL,
 '일신건영 - 이천 마장지구', '1-2차3동1-9층', NULL, '5GN+12A+5LE', NULL, 22,
 352, 'EA', 337.06, 3671, 0, 0,
 '2025-06-16', '2025-06-15', NULL, 'HK지앤텍 1공장', 352, 'COMPLETED', NULL),

('HK-250601-01', 5, '2025-06-01', 'PROCESSING', 'O001', '상우지테크', NULL,
 '일신건영 - 이천 마장지구', '1-3차1동1-9층', NULL, '5CL+12A+5LE', NULL, 22,
 455, 'EA', 480.34, 5232, 0, 0,
 '2025-06-22', '2025-06-17', NULL, 'HK지앤텍 1공장', 455, 'COMPLETED', NULL),

('HK-250601-01', 6, '2025-06-01', 'PROCESSING', 'O001', '상우지테크', NULL,
 '일신건영 - 이천 마장지구', '1-3차1동1-9층', NULL, '5GN+12A+5LE', NULL, 22,
 507, 'EA', 556.78, 6064, 0, 0,
 '2025-06-22', '2025-06-17', NULL, 'HK지앤텍 1공장', 507, 'COMPLETED', NULL),

('HK-250601-01', 7, '2025-06-01', 'PROCESSING', 'O001', '상우지테크', NULL,
 '일신건영 - 이천 마장지구', '1-4차4동1-8층', NULL, '5CL+12A+5LE', NULL, 22,
 416, 'EA', 439.23, 4784, 0, 0,
 '2025-06-23', '2025-06-28', NULL, 'HK지앤텍 1공장', 416, 'COMPLETED', NULL),

('HK-250601-01', 8, '2025-06-01', 'PROCESSING', 'O001', '상우지테크', NULL,
 '일신건영 - 이천 마장지구', '1-4차4동1-8층', NULL, '5GN+12A+5LE', NULL, 22,
 464, 'EA', 509.79, 5553, 0, 0,
 '2025-06-23', '2025-06-28', NULL, 'HK지앤텍 1공장', 464, 'COMPLETED', NULL),

-- 발주 2: HK-240214-01 (경남유리, 중흥토건 - 천호 1지구)
('HK-240214-01', 1, '2024-02-23', 'PROCESSING', 'O002', '경남유리', NULL,
 '중흥토건 - 천호 1지구', '101-3605펜트포장1', NULL, '5CL+12A+5LE', NULL, 22,
 48, 'EA', 47.62, 519, 0, 0,
 '2024-03-05', NULL, NULL, '현장입고', 48, 'COMPLETED', NULL),

('HK-240214-01', 2, '2024-02-23', 'PROCESSING', 'O002', '경남유리', NULL,
 '중흥토건 - 천호 1지구', '101-3605펜트포장1', NULL, '5GN+12A+5LE', NULL, 22,
 54, 'EA', 49.11, 535, 0, 0,
 '2024-03-05', NULL, NULL, '현장입고', 54, 'COMPLETED', NULL),

('HK-240214-01', 3, '2024-02-23', 'PROCESSING', 'O002', '경남유리', NULL,
 '중흥토건 - 천호 1지구', '101-3605펜트포장1', NULL, '9.76(5GN+0.76+4CL)+12A+5LE', NULL, 26.76,
 6, 'EA', 4.72, 51, 0, 0,
 '2024-03-05', NULL, NULL, '현장입고', 6, 'COMPLETED', NULL),

('HK-240214-01', 4, '2024-02-23', 'PROCESSING', 'O002', '경남유리', NULL,
 '중흥토건 - 천호 1지구', '101-3605펜트포장1', NULL, '10.76(5GN+0.76+5CL)+12AR+5LE', NULL, 27.76,
 6, 'EA', 4.72, 51, 0, 0,
 '2024-03-05', NULL, NULL, '현장입고', 6, 'COMPLETED', NULL),

('HK-240214-01', 5, '2024-02-23', 'PROCESSING', 'O002', '경남유리', NULL,
 '중흥토건 - 천호 1지구', '101-3603펜트포장2', NULL, '5CL+12A+5LE', NULL, 22,
 10, 'EA', 7.67, 84, 0, 0,
 '2024-03-05', NULL, NULL, '현장입고', 10, 'COMPLETED', NULL),

('HK-240214-01', 6, '2024-02-23', 'PROCESSING', 'O002', '경남유리', NULL,
 '중흥토건 - 천호 1지구', '101-3603펜트포장2', NULL, '5GN+12A+5LE', NULL, 22,
 12, 'EA', 9.75, 106, 0, 0,
 '2024-03-05', NULL, NULL, '현장입고', 12, 'COMPLETED', NULL),

('HK-240214-01', 7, '2024-02-23', 'PROCESSING', 'O002', '경남유리', NULL,
 '중흥토건 - 천호 1지구', '101-3601펜트포장3', NULL, '5CL+12A+5LE', NULL, 22,
 12, 'EA', 13.63, 148, 0, 0,
 '2024-03-05', NULL, NULL, '현장입고', 12, 'COMPLETED', NULL),

('HK-240214-01', 8, '2024-02-23', 'PROCESSING', 'O002', '경남유리', NULL,
 '중흥토건 - 천호 1지구', '101-3601펜트포장3', NULL, '5GN+12A+5LE', NULL, 22,
 14, 'EA', 15.30, 167, 0, 0,
 '2024-03-05', NULL, NULL, '현장입고', 14, 'COMPLETED', NULL),

('HK-240214-01', 9, '2024-02-23', 'PROCESSING', 'O002', '경남유리', NULL,
 '중흥토건 - 천호 1지구', '101-3601펜트포장3', NULL, '10.76(5GN+0.76+5CL)+12AR+5LE', NULL, 27.76,
 2, 'EA', 1.57, 17, 0, 0,
 '2024-03-05', NULL, NULL, '현장입고', 2, 'COMPLETED', NULL),

-- 발주 3: HK-240614-01 (일신유리, LX하우시스 - GS음성자이센트럴시티)
('HK-240614-01', 1, '2024-06-17', 'PROCESSING', 'O003', '일신유리', NULL,
 'LX하우시스 - GS음성자이센트럴시티', '12동17~19층', NULL, '5CL+12TPS+5SP2.0', NULL, 22,
 252, 'EA', 176.44, 1922, 0, 0,
 '2024-07-18', NULL, NULL, '현장입고', 252, 'COMPLETED', NULL),

('HK-240614-01', 2, '2024-06-17', 'PROCESSING', 'O003', '일신유리', NULL,
 'LX하우시스 - GS음성자이센트럴시티', '12동17~19층', NULL, '5UGA156+12TPS+5CL', NULL, 22,
 228, 'EA', 109.03, 1188, 0, 0,
 '2024-07-18', NULL, NULL, '현장입고', 228, 'COMPLETED', NULL),

('HK-240614-01', 3, '2024-06-17', 'PROCESSING', 'O003', '일신유리', NULL,
 'LX하우시스 - GS음성자이센트럴시티', '12동17~19층', NULL, '6UGT156(HS)+12TPS+6CL(HS)', NULL, 24,
 15, 'EA', 42.18, 459, 0, 0,
 '2024-07-18', NULL, NULL, '현장입고', 15, 'COMPLETED', NULL),

('HK-240614-01', 4, '2024-06-17', 'PROCESSING', 'O003', '일신유리', NULL,
 'LX하우시스 - GS음성자이센트럴시티', '12동17~19층', NULL, '6UGA156+12TPS+6CL', NULL, 24,
 27, 'EA', 39.01, 425, 0, 0,
 '2024-07-18', NULL, NULL, '현장입고', 27, 'COMPLETED', NULL),

('HK-240614-01', 5, '2024-06-17', 'PROCESSING', 'O003', '일신유리', NULL,
 'LX하우시스 - GS음성자이센트럴시티', '12동20~22층', NULL, '5CL+12TPS+5SP2.0', NULL, 22,
 225, 'EA', 160.51, 1748, 0, 0,
 '2024-07-18', NULL, NULL, '현장입고', 200, 'PROCESSING', '일부 입고 중'),

('HK-240614-01', 6, '2024-06-17', 'PROCESSING', 'O003', '일신유리', NULL,
 'LX하우시스 - GS음성자이센트럴시티', '12동20~22층', NULL, '5UGA156+12TPS+5CL', NULL, 22,
 84, 'EA', 42.99, 468, 0, 0,
 '2024-07-18', NULL, NULL, '현장입고', 0, 'PENDING', NULL);
