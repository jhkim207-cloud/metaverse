-- 야적장(Storage Yard) 관련 테이블

-- 야적장 마스터
CREATE TABLE IF NOT EXISTS yard_master (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    yard_cd         VARCHAR(20)  NOT NULL UNIQUE,
    yard_nm         VARCHAR(100) NOT NULL,
    rows_count      INT          NOT NULL DEFAULT 5,
    columns_count   INT          NOT NULL DEFAULT 6,
    sector_count    INT          NOT NULL DEFAULT 3,
    space_width     INT          NOT NULL DEFAULT 100,
    space_length    INT          NOT NULL DEFAULT 100,
    spacing         INT          NOT NULL DEFAULT 120,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    created_by      VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
    updated_by      VARCHAR(100) NOT NULL DEFAULT CURRENT_USER
);

COMMENT ON TABLE yard_master IS '야적장 마스터';
COMMENT ON COLUMN yard_master.yard_cd IS '야적장 코드';
COMMENT ON COLUMN yard_master.yard_nm IS '야적장 명';
COMMENT ON COLUMN yard_master.rows_count IS '행 수';
COMMENT ON COLUMN yard_master.columns_count IS '열 수';
COMMENT ON COLUMN yard_master.sector_count IS '블록(섹터) 수';
COMMENT ON COLUMN yard_master.space_width IS '한 칸 가로 크기';
COMMENT ON COLUMN yard_master.space_length IS '한 칸 세로 크기';
COMMENT ON COLUMN yard_master.spacing IS '블록 간 간격';

-- 야적장 물건
CREATE TABLE IF NOT EXISTS yard_item (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    yard_cd         VARCHAR(20)   NOT NULL REFERENCES yard_master(yard_cd),
    item_nm         VARCHAR(100),
    item_type       VARCHAR(20)   NOT NULL DEFAULT 'BOX',
    width_val       NUMERIC(10,2) NOT NULL,
    length_val      NUMERIC(10,2) NOT NULL,
    position_x      NUMERIC(10,2) NOT NULL DEFAULT 0,
    position_z      NUMERIC(10,2) NOT NULL DEFAULT 0,
    rotation_y      NUMERIC(10,4) NOT NULL DEFAULT 0,
    color           VARCHAR(10),
    status          VARCHAR(20)   NOT NULL DEFAULT 'PLACED',
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

COMMENT ON TABLE yard_item IS '야적장 물건';
COMMENT ON COLUMN yard_item.item_type IS '물건 형태: BOX, HEXAGON, CIRCLE';
COMMENT ON COLUMN yard_item.status IS '상태: PLACED, RESERVED, DELETED';

CREATE INDEX idx_yard_item_yard_cd ON yard_item(yard_cd);

-- CCTV
CREATE TABLE IF NOT EXISTS yard_cctv (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    yard_cd         VARCHAR(20)   NOT NULL REFERENCES yard_master(yard_cd),
    cctv_nm         VARCHAR(50)   NOT NULL,
    position_x      NUMERIC(10,2) NOT NULL,
    position_z      NUMERIC(10,2) NOT NULL,
    direction       VARCHAR(10)   NOT NULL,
    alarm_status    BOOLEAN       NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

COMMENT ON TABLE yard_cctv IS '야적장 CCTV';
COMMENT ON COLUMN yard_cctv.direction IS '방향: up, down, left, right';

CREATE INDEX idx_yard_cctv_yard_cd ON yard_cctv(yard_cd);

-- 알람 로그
CREATE TABLE IF NOT EXISTS yard_alarm_log (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    yard_cd         VARCHAR(20)   NOT NULL,
    cctv_nm         VARCHAR(50)   NOT NULL,
    alarm_type      VARCHAR(20)   NOT NULL,
    message         VARCHAR(500),
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

COMMENT ON TABLE yard_alarm_log IS '야적장 알람 로그';

CREATE INDEX idx_yard_alarm_log_yard_cd ON yard_alarm_log(yard_cd);
CREATE INDEX idx_yard_alarm_log_created ON yard_alarm_log(created_at);

-- 기본 야적장 데이터 삽입
INSERT INTO yard_master (yard_cd, yard_nm, rows_count, columns_count, sector_count, space_width, space_length, spacing)
VALUES ('YARD01', '대불상단 야적장', 5, 6, 3, 100, 100, 120)
ON CONFLICT (yard_cd) DO NOTHING;
