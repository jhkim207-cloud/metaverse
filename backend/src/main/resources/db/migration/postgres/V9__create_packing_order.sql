-- V9__create_packing_order.sql
-- 포장지시 테이블 생성 (hkgn 스키마)

CREATE TABLE IF NOT EXISTS hkgn.packing_order (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    packing_no      VARCHAR(30)   NOT NULL UNIQUE,
    packing_date    DATE          NOT NULL,
    order_no        VARCHAR(30)   NOT NULL,
    material_cd     VARCHAR(30)   NOT NULL,
    material_nm     VARCHAR(200),
    packing_qty     NUMERIC(12,2) NOT NULL,
    unit            VARCHAR(10)   DEFAULT 'EA',
    container_cd    VARCHAR(30),
    container_qty   INTEGER       DEFAULT 0,
    worker_cd       VARCHAR(30),
    packing_status  VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    remarks         TEXT,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

CREATE INDEX idx_packing_order_date     ON hkgn.packing_order(packing_date);
CREATE INDEX idx_packing_order_order    ON hkgn.packing_order(order_no);
CREATE INDEX idx_packing_order_material ON hkgn.packing_order(material_cd);
CREATE INDEX idx_packing_order_status   ON hkgn.packing_order(packing_status);

-- 샘플 데이터
INSERT INTO hkgn.packing_order (packing_no, packing_date, order_no, material_cd, material_nm, packing_qty, unit, container_cd, container_qty, worker_cd, packing_status, remarks) VALUES
('PACK202501200001', '2025-01-20', 'SO202501001', 'PRD001', '복층유리 16T (5CL+6A+5CL) 투명', 98, 'M2', 'CNT001', 3, 'W012', 'COMPLETED', '강철틀 포장'),
('PACK202501200002', '2025-01-20', 'SO202501001', 'PRD002', '복층유리 22T (6CL+12A+6CL) 그린', 49, 'M2', 'CNT001', 2, 'W012', 'COMPLETED', '강철틀 포장'),
('PACK202501210001', '2025-01-21', 'SO202501001', 'PRD001', '복층유리 16T (5CL+6A+5CL) 투명', 100, 'M2', 'CNT001', 3, 'W012', 'COMPLETED', '강철틀 포장'),
('PACK202501210002', '2025-01-21', 'SO202501001', 'PRD002', '복층유리 22T (6CL+12A+6CL) 그린', 50, 'M2', 'CNT001', 2, 'W012', 'COMPLETED', '강철틀 포장'),
('PACK202501220001', '2025-01-22', 'SO202501002', 'PRD001', '복층유리 16T (5CL+6A+5CL) 투명', 148, 'M2', 'CNT001', 4, 'W012', 'COMPLETED', '강철틀 포장'),
('PACK202501220002', '2025-01-22', 'SO202501002', 'PRD002', '복층유리 22T (6CL+12A+6CL) 그린', 100, 'M2', 'CNT001', 3, 'W012', 'PROCESSING', '강철틀 포장'),
('PACK202501230001', '2025-01-23', 'SO202501002', 'PRD001', '복층유리 16T (5CL+6A+5CL) 투명', 150, 'M2', 'CNT001', 4, 'W012', 'PROCESSING', '강철틀 포장'),
('PACK202501230002', '2025-01-23', 'SO202501002', 'PRD002', '복층유리 22T (6CL+12A+6CL) 그린', 99, 'M2', 'CNT001', 3, 'W012', 'PENDING', '강철틀 포장'),
('PACK202501240001', '2025-01-24', 'SO202501003', 'PRD002', '복층유리 22T (6CL+12A+6CL) 그린', 125, 'M2', 'CNT001', 4, 'W012', 'PENDING', '강철틀 포장'),
('PACK202501240002', '2025-01-24', 'SO202501003', 'PRD003', '복층유리 24T (8CL+8A+8CL) 로이', 35, 'M2', 'CNT001', 1, 'W012', 'PENDING', '강철틀 포장');
