-- 야적장 CCTV 커버리지 컬럼 추가
ALTER TABLE yard_cctv ADD COLUMN IF NOT EXISTS coverage_radius NUMERIC(10,2) NOT NULL DEFAULT 200;
ALTER TABLE yard_cctv ADD COLUMN IF NOT EXISTS coverage_angle NUMERIC(10,2) NOT NULL DEFAULT 120;

COMMENT ON COLUMN yard_cctv.coverage_radius IS 'CCTV 감시 반경';
COMMENT ON COLUMN yard_cctv.coverage_angle IS 'CCTV 시야각(도)';

-- 야적장 차량/장비
CREATE TABLE IF NOT EXISTS yard_vehicle (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    yard_cd         VARCHAR(20)   NOT NULL REFERENCES yard_master(yard_cd),
    vehicle_nm      VARCHAR(100)  NOT NULL,
    vehicle_type    VARCHAR(20)   NOT NULL,
    current_x       NUMERIC(10,2) NOT NULL DEFAULT 0,
    current_z       NUMERIC(10,2) NOT NULL DEFAULT 0,
    heading         NUMERIC(10,4) NOT NULL DEFAULT 0,
    speed           NUMERIC(10,2) NOT NULL DEFAULT 0,
    status          VARCHAR(20)   NOT NULL DEFAULT 'IDLE',
    assigned_route_id BIGINT,
    is_off_route    BOOLEAN       NOT NULL DEFAULT false,
    last_updated    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

COMMENT ON TABLE yard_vehicle IS '야적장 차량/장비';
COMMENT ON COLUMN yard_vehicle.vehicle_type IS '차량유형: FORKLIFT, TRUCK, AGV, CRANE';
COMMENT ON COLUMN yard_vehicle.status IS '상태: IDLE, MOVING, LOADING, UNLOADING, OFF_ROUTE';

CREATE INDEX IF NOT EXISTS idx_yard_vehicle_yard_cd ON yard_vehicle(yard_cd);

-- 야적장 계획 경로
CREATE TABLE IF NOT EXISTS yard_route (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    yard_cd         VARCHAR(20)   NOT NULL REFERENCES yard_master(yard_cd),
    route_nm        VARCHAR(100)  NOT NULL,
    vehicle_id      BIGINT        REFERENCES yard_vehicle(id),
    status          VARCHAR(20)   NOT NULL DEFAULT 'PLANNED',
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

COMMENT ON TABLE yard_route IS '야적장 계획 경로';
COMMENT ON COLUMN yard_route.status IS '상태: PLANNED, ACTIVE, COMPLETED, CANCELLED';

CREATE INDEX IF NOT EXISTS idx_yard_route_yard_cd ON yard_route(yard_cd);

-- 경로 웨이포인트
CREATE TABLE IF NOT EXISTS yard_route_waypoint (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    route_id        BIGINT        NOT NULL REFERENCES yard_route(id) ON DELETE CASCADE,
    seq             INT           NOT NULL,
    position_x      NUMERIC(10,2) NOT NULL,
    position_z      NUMERIC(10,2) NOT NULL,
    action_type     VARCHAR(20),
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

COMMENT ON TABLE yard_route_waypoint IS '경로 웨이포인트';
COMMENT ON COLUMN yard_route_waypoint.action_type IS '액션: LOAD, UNLOAD, PASS';

CREATE INDEX IF NOT EXISTS idx_yard_route_wp_route ON yard_route_waypoint(route_id);

-- 경로 이탈 로그
CREATE TABLE IF NOT EXISTS yard_route_deviation (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    yard_cd         VARCHAR(20)   NOT NULL,
    vehicle_id      BIGINT        NOT NULL REFERENCES yard_vehicle(id),
    route_id        BIGINT        NOT NULL REFERENCES yard_route(id),
    deviation_dist  NUMERIC(10,2) NOT NULL,
    detected_by_cctv_id BIGINT,
    position_x      NUMERIC(10,2) NOT NULL,
    position_z      NUMERIC(10,2) NOT NULL,
    acknowledged    BOOLEAN       NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

COMMENT ON TABLE yard_route_deviation IS '경로 이탈 로그';

CREATE INDEX IF NOT EXISTS idx_yard_deviation_yard ON yard_route_deviation(yard_cd);
CREATE INDEX IF NOT EXISTS idx_yard_deviation_created ON yard_route_deviation(created_at);

-- 기본 CCTV 데이터 삽입 (12개)
INSERT INTO yard_cctv (yard_cd, cctv_nm, position_x, position_z, direction, coverage_radius, coverage_angle)
SELECT * FROM (VALUES
    ('YARD01', 'cctv1',  -320, -350, 'down', 200, 120),
    ('YARD01', 'cctv2',     0, -350, 'down', 200, 120),
    ('YARD01', 'cctv3',   320, -350, 'down', 200, 120),
    ('YARD01', 'cctv4',   440, -175, 'right', 200, 120),
    ('YARD01', 'cctv5',   440,    0, 'right', 200, 120),
    ('YARD01', 'cctv6',   440,  175, 'right', 200, 120),
    ('YARD01', 'cctv7',   320,  350, 'up', 200, 120),
    ('YARD01', 'cctv8',     0,  350, 'up', 200, 120),
    ('YARD01', 'cctv9',  -320,  350, 'up', 200, 120),
    ('YARD01', 'cctv10', -440,  175, 'left', 200, 120),
    ('YARD01', 'cctv11', -440,    0, 'left', 200, 120),
    ('YARD01', 'cctv12', -440, -175, 'left', 200, 120)
) AS v(yard_cd, cctv_nm, position_x, position_z, direction, coverage_radius, coverage_angle)
WHERE NOT EXISTS (SELECT 1 FROM yard_cctv WHERE yard_cd = 'YARD01');

-- 기본 차량 데이터
INSERT INTO yard_vehicle (yard_cd, vehicle_nm, vehicle_type, current_x, current_z, status)
SELECT * FROM (VALUES
    ('YARD01', '지게차-01', 'FORKLIFT', -200, -200, 'IDLE'),
    ('YARD01', '지게차-02', 'FORKLIFT',  200,  100, 'IDLE'),
    ('YARD01', '트럭-01',   'TRUCK',    -300, -300, 'IDLE'),
    ('YARD01', 'AGV-01',    'AGV',        0,     0, 'IDLE')
) AS v(yard_cd, vehicle_nm, vehicle_type, current_x, current_z, status)
WHERE NOT EXISTS (SELECT 1 FROM yard_vehicle WHERE yard_cd = 'YARD01');

-- 기본 경로 데이터 (2개)
INSERT INTO yard_route (yard_cd, route_nm, vehicle_id, status)
SELECT r.yard_cd, r.route_nm, v.id, r.status
FROM (VALUES
    ('YARD01', '입고 경로 A', '지게차-01', 'ACTIVE'),
    ('YARD01', '출고 경로 B', '트럭-01',   'PLANNED')
) AS r(yard_cd, route_nm, vehicle_nm, status)
JOIN yard_vehicle v ON v.yard_cd = r.yard_cd AND v.vehicle_nm = r.vehicle_nm
WHERE NOT EXISTS (SELECT 1 FROM yard_route WHERE yard_cd = 'YARD01');

-- 경로 A 웨이포인트 (입고: 입구 → 구역1 → 구역3)
INSERT INTO yard_route_waypoint (route_id, seq, position_x, position_z, action_type)
SELECT r.id, wp.seq, wp.pos_x, wp.pos_z, wp.action_type
FROM yard_route r
CROSS JOIN (VALUES
    (1, -400, -300, 'PASS'),
    (2, -200, -200, 'PASS'),
    (3,    0, -100, 'LOAD'),
    (4,  200,    0, 'PASS'),
    (5,  300,  200, 'UNLOAD')
) AS wp(seq, pos_x, pos_z, action_type)
WHERE r.route_nm = '입고 경로 A' AND r.yard_cd = 'YARD01'
  AND NOT EXISTS (SELECT 1 FROM yard_route_waypoint WHERE route_id = r.id);

-- 경로 B 웨이포인트 (출고: 구역5 → 출구)
INSERT INTO yard_route_waypoint (route_id, seq, position_x, position_z, action_type)
SELECT r.id, wp.seq, wp.pos_x, wp.pos_z, wp.action_type
FROM yard_route r
CROSS JOIN (VALUES
    (1,  300,  300, 'LOAD'),
    (2,  100,  200, 'PASS'),
    (3, -100,    0, 'PASS'),
    (4, -300, -200, 'PASS'),
    (5, -400, -350, 'UNLOAD')
) AS wp(seq, pos_x, pos_z, action_type)
WHERE r.route_nm = '출고 경로 B' AND r.yard_cd = 'YARD01'
  AND NOT EXISTS (SELECT 1 FROM yard_route_waypoint WHERE route_id = r.id);

-- 차량에 경로 할당
UPDATE yard_vehicle v
SET assigned_route_id = r.id
FROM yard_route r
WHERE r.vehicle_id = v.id AND r.yard_cd = 'YARD01' AND v.assigned_route_id IS NULL;
