-- ============================================
-- V12: Flyway 미관리 기존 테이블 동기화 (29개)
-- 작성일: 2026-02-12
-- 목적: 이미 DB에 존재하는 테이블을 Flyway 버전 관리에 등록
-- 주의: CREATE TABLE IF NOT EXISTS 사용 - 기존 데이터 영향 없음
-- ============================================

-- ============================================
-- 1. 권한/인증 관련 테이블
-- ============================================

-- 1-1. roles (역할)
CREATE TABLE IF NOT EXISTS hkgn.roles (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code            VARCHAR(50)   NOT NULL UNIQUE,
    name            VARCHAR(100)  NOT NULL,
    description     TEXT,
    is_system       BOOLEAN       NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

-- 1-2. permissions (역할별 권한)
CREATE TABLE IF NOT EXISTS hkgn.permissions (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_id         BIGINT        NOT NULL,
    resource_type   VARCHAR(100)  NOT NULL,
    resource_code   VARCHAR(100),
    can_read        BOOLEAN       NOT NULL DEFAULT FALSE,
    can_create      BOOLEAN       NOT NULL DEFAULT FALSE,
    can_update      BOOLEAN       NOT NULL DEFAULT FALSE,
    can_delete      BOOLEAN       NOT NULL DEFAULT FALSE,
    can_submit      BOOLEAN       NOT NULL DEFAULT FALSE,
    can_approve     BOOLEAN       NOT NULL DEFAULT FALSE,
    can_cancel      BOOLEAN       NOT NULL DEFAULT FALSE,
    can_export      BOOLEAN       NOT NULL DEFAULT FALSE,
    perm_level      INTEGER       NOT NULL DEFAULT 0,
    record_filter   TEXT,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

-- 1-3. organizations (조직)
CREATE TABLE IF NOT EXISTS hkgn.organizations (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    master_id       VARCHAR(100),
    code            VARCHAR(50)   NOT NULL UNIQUE,
    name            VARCHAR(100)  NOT NULL,
    org_type        VARCHAR(20)   NOT NULL,
    parent_id       BIGINT,
    depth           INTEGER       NOT NULL DEFAULT 0,
    path            VARCHAR(500),
    manager_id      BIGINT,
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

-- 1-4. user_roles (사용자-역할 매핑)
CREATE TABLE IF NOT EXISTS hkgn.user_roles (
    user_id         BIGINT        NOT NULL,
    role_id         BIGINT        NOT NULL,
    assigned_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    assigned_by     BIGINT,
    PRIMARY KEY (user_id, role_id)
);

-- 1-5. role_menus (역할-메뉴 매핑)
CREATE TABLE IF NOT EXISTS hkgn.role_menus (
    role_id         BIGINT        NOT NULL,
    menu_id         BIGINT        NOT NULL,
    PRIMARY KEY (role_id, menu_id)
);

-- 1-6. role_groups (역할 그룹)
CREATE TABLE IF NOT EXISTS hkgn.role_groups (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code            VARCHAR(50)   NOT NULL UNIQUE,
    name            VARCHAR(100)  NOT NULL,
    description     TEXT
);

-- 1-7. role_group_members (역할 그룹-역할 매핑)
CREATE TABLE IF NOT EXISTS hkgn.role_group_members (
    role_group_id   BIGINT        NOT NULL,
    role_id         BIGINT        NOT NULL,
    PRIMARY KEY (role_group_id, role_id)
);

-- 1-8. role_group_inheritance (역할 그룹 상속)
CREATE TABLE IF NOT EXISTS hkgn.role_group_inheritance (
    child_group_id  BIGINT        NOT NULL,
    parent_group_id BIGINT        NOT NULL,
    PRIMARY KEY (child_group_id, parent_group_id)
);

-- ============================================
-- 2. 마스터 데이터 테이블
-- ============================================

-- 2-1. item_master (자재 마스터)
CREATE TABLE IF NOT EXISTS hkgn.item_master (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    material_cd     VARCHAR(30)   NOT NULL UNIQUE,
    material_type   VARCHAR(20)   NOT NULL,
    category        VARCHAR(30),
    material_nm     VARCHAR(200)  NOT NULL,
    thickness       NUMERIC(6,2),
    spec_remark     VARCHAR(200),
    color_type      VARCHAR(30),
    unit            VARCHAR(10)   DEFAULT 'EA',
    cost_price      NUMERIC(12,2) DEFAULT 0,
    list_price      NUMERIC(12,2) DEFAULT 0,
    purchase_price  NUMERIC(12,2) DEFAULT 0,
    selling_price   NUMERIC(12,2) DEFAULT 0,
    supplier_cd     VARCHAR(30),
    sf_count        NUMERIC(8,2),
    mf_count        NUMERIC(8,2),
    glass_count     NUMERIC(8,2),
    is_active       BOOLEAN       DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

-- 2-2. worker (작업자 마스터)
CREATE TABLE IF NOT EXISTS hkgn.worker (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    worker_cd       VARCHAR(30)   NOT NULL UNIQUE,
    worker_nm       VARCHAR(50)   NOT NULL,
    dept            VARCHAR(30),
    position        VARCHAR(30),
    prod_line       VARCHAR(30),
    phone           VARCHAR(30),
    is_active       BOOLEAN       DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

-- 2-3. worker_assignment_type (작업자 배치 유형)
CREATE TABLE IF NOT EXISTS hkgn.worker_assignment_type (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    assignment_type_cd  VARCHAR(10)   NOT NULL UNIQUE,
    assignment_type_nm  VARCHAR(100),
    description         TEXT,
    sort_order          INTEGER       DEFAULT 0,
    is_active           BOOLEAN       DEFAULT TRUE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

-- 2-4. standard_terms (표준 용어)
CREATE TABLE IF NOT EXISTS hkgn.standard_terms (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    term_group      VARCHAR(50)   NOT NULL,
    term_code       VARCHAR(50)   NOT NULL,
    term_name_kr    VARCHAR(200)  NOT NULL,
    term_name_en    VARCHAR(200),
    description     TEXT,
    abbreviation    VARCHAR(20),
    sort_order      INTEGER       DEFAULT 0,
    is_active       BOOLEAN       DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    UNIQUE(term_group, term_code)
);

-- 2-5. site_price (현장별 단가)
CREATE TABLE IF NOT EXISTS hkgn.site_price (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    site_cd                 VARCHAR(30)   NOT NULL,
    site_nm                 VARCHAR(200),
    customer_nm             VARCHAR(100),
    spec                    VARCHAR(200)  NOT NULL,
    remark                  VARCHAR(200),
    bid_price               NUMERIC(12,2) DEFAULT 0,
    proc_price              NUMERIC(12,2) DEFAULT 0,
    processing_cost         NUMERIC(12,2) DEFAULT 0,
    argon_cost              NUMERIC(12,2) DEFAULT 0,
    insul_cost              NUMERIC(12,2) DEFAULT 0,
    struct_cost             NUMERIC(12,2) DEFAULT 0,
    edge_cost               NUMERIC(12,2) DEFAULT 0,
    etching_cost            NUMERIC(12,2) DEFAULT 0,
    step_cost               NUMERIC(12,2) DEFAULT 0,
    deform_cost             NUMERIC(12,2) DEFAULT 0,
    temper1_cost            NUMERIC(12,2) DEFAULT 0,
    temper2_cost            NUMERIC(12,2) DEFAULT 0,
    temper3_cost            NUMERIC(12,2) DEFAULT 0,
    total_processing_cost   NUMERIC(12,2) DEFAULT 0,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by              VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by              VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

-- ============================================
-- 3. 영업/수주 테이블
-- ============================================

-- 3-1. sales_order_header (수주 헤더)
CREATE TABLE IF NOT EXISTS hkgn.sales_order_header (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_no        VARCHAR(30)   NOT NULL UNIQUE,
    order_date      DATE          NOT NULL,
    delivery_date   DATE,
    customer_cd     VARCHAR(30)   NOT NULL,
    order_type      VARCHAR(20),
    order_kind      VARCHAR(50),
    site_cd         VARCHAR(30),
    site_nm         VARCHAR(200),
    site_address    VARCHAR(500),
    total_amount    NUMERIC(15,2) DEFAULT 0,
    tax_amount      NUMERIC(15,2) DEFAULT 0,
    tax_separate    BOOLEAN       DEFAULT FALSE,
    duo_light       VARCHAR(100),
    remarks         TEXT,
    order_status    VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    is_urgent       BOOLEAN       DEFAULT FALSE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

-- 3-2. sales_order_detail (수주 상세)
CREATE TABLE IF NOT EXISTS hkgn.sales_order_detail (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_header_id     BIGINT        NOT NULL,
    order_no            VARCHAR(30)   NOT NULL,
    line_seq            INTEGER       NOT NULL,
    material_cd         VARCHAR(30)   NOT NULL,
    material_nm         VARCHAR(500),
    product_category    VARCHAR(10),
    width               NUMERIC(10,2),
    height              NUMERIC(10,2),
    thickness           NUMERIC(10,2),
    unit_type           VARCHAR(10),
    quantity            INTEGER       NOT NULL,
    area                NUMERIC(15,4),
    unit                VARCHAR(10)   DEFAULT 'EA',
    unit_price          NUMERIC(15,2),
    amount              NUMERIC(15,2),
    dong                VARCHAR(100),
    ho                  VARCHAR(100),
    floor               VARCHAR(50),
    window_type         VARCHAR(100),
    location_detail     VARCHAR(500),
    delivery_date       DATE,
    production_status   VARCHAR(20)   DEFAULT 'PENDING',
    delivery_status     VARCHAR(20)   DEFAULT 'PENDING',
    remarks             TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    UNIQUE (order_header_id, line_seq)
);

-- 3-3. sales_order_upload (수주 파일 업로드)
CREATE TABLE IF NOT EXISTS hkgn.sales_order_upload (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    upload_batch_id     VARCHAR(50)   NOT NULL,
    upload_date         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    uploaded_by         VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    file_name           VARCHAR(255),
    row_num             INTEGER       NOT NULL,
    product_nm          VARCHAR(500),
    width               NUMERIC(10,2),
    height              NUMERIC(10,2),
    quantity            INTEGER,
    dong                VARCHAR(100),
    ho                  VARCHAR(100),
    window_type         VARCHAR(100),
    extra1              VARCHAR(200),
    extra2              VARCHAR(200),
    extra3              VARCHAR(200),
    validation_status   VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    validation_message  TEXT,
    validated_at        TIMESTAMP WITH TIME ZONE,
    validated_by        VARCHAR(100),
    order_no            VARCHAR(30),
    material_cd         VARCHAR(30),
    customer_cd         VARCHAR(30),
    site_cd             VARCHAR(30),
    imported_at         TIMESTAMP WITH TIME ZONE,
    imported_by         VARCHAR(100),
    order_header_id     BIGINT,
    order_detail_id     BIGINT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

-- ============================================
-- 4. 생산 관련 테이블
-- ============================================

-- 4-1. work_request (작업 의뢰)
CREATE TABLE IF NOT EXISTS hkgn.work_request (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    request_no              VARCHAR(50)   NOT NULL,
    request_date            DATE          NOT NULL,
    plan_id                 BIGINT,
    order_no                VARCHAR(50),
    customer_nm             VARCHAR(200),
    supplier_nm             VARCHAR(200),
    site_nm                 VARCHAR(200),
    work_category           VARCHAR(50),
    approval_status         VARCHAR(50),
    memo                    TEXT,
    duo_light               VARCHAR(50),
    dong_ho_window_separate BOOLEAN       DEFAULT FALSE,
    remarks                 TEXT,
    product_category        VARCHAR(10),
    material_nm             VARCHAR(200),
    thickness               INTEGER,
    unit_type               VARCHAR(20),
    width                   NUMERIC(10,2),
    height                  NUMERIC(10,2),
    other_spec              VARCHAR(200),
    quantity                INTEGER       DEFAULT 0,
    unrequested_quantity    INTEGER       DEFAULT 0,
    requested_quantity      INTEGER       DEFAULT 0,
    area                    NUMERIC(10,3),
    order_remarks           TEXT,
    origin_1                VARCHAR(100),
    origin_2                VARCHAR(100),
    process_1               VARCHAR(100),
    process_2               VARCHAR(100),
    process_3               VARCHAR(100),
    process_4               VARCHAR(100),
    process_5               VARCHAR(100),
    process_6               VARCHAR(100),
    process_7               VARCHAR(100),
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by              VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by              VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    request_status          VARCHAR(20)   NOT NULL DEFAULT 'REGISTERED'
);

-- 4-2. production_plan (생산 계획)
CREATE TABLE IF NOT EXISTS hkgn.production_plan (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    plan_no             VARCHAR(50)   NOT NULL UNIQUE,
    production_date     DATE,
    machine_no          VARCHAR(100),
    category            VARCHAR(50),
    customer_nm         VARCHAR(200),
    site_nm             VARCHAR(200),
    location            VARCHAR(200),
    thickness           INTEGER,
    product_type        VARCHAR(50),
    material_nm         VARCHAR(200),
    quantity            INTEGER       DEFAULT 0,
    area                NUMERIC(10,3),
    options             TEXT,
    completed_quantity  INTEGER       DEFAULT 0,
    completed_area      NUMERIC(10,3),
    defect_quantity     INTEGER       DEFAULT 0,
    defect_area         NUMERIC(10,3),
    pending_quantity    INTEGER       DEFAULT 0,
    pending_area        NUMERIC(10,3),
    shipping_date       VARCHAR(50),
    unit_price          NUMERIC(15,2),
    amount              NUMERIC(15,2),
    plan_status         VARCHAR(20)   NOT NULL DEFAULT 'REGISTERED',
    remarks             TEXT,
    work_request_no     VARCHAR(50),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    start_date          DATE,
    end_date            DATE,
    order_header_id     BIGINT,
    planned_start_date  DATE,
    planned_end_date    DATE,
    site_cd             VARCHAR(30)
);

-- 4-3. production_plan_detail (생산 계획 상세)
CREATE TABLE IF NOT EXISTS hkgn.production_plan_detail (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    plan_id             BIGINT        NOT NULL,
    process_type        VARCHAR(50),
    is_checked          BOOLEAN       DEFAULT FALSE,
    process_status      VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    order_detail_id     BIGINT,
    order_no            VARCHAR(30),
    line_seq            INTEGER,
    material_cd         VARCHAR(30),
    material_nm         VARCHAR(500),
    product_category    VARCHAR(10),
    width               NUMERIC(10,2),
    height              NUMERIC(10,2),
    thickness           NUMERIC(10,2),
    unit_type           VARCHAR(10),
    quantity            INTEGER,
    area                NUMERIC(15,4),
    unit                VARCHAR(10),
    unit_price          NUMERIC(15,2),
    amount              NUMERIC(15,2),
    dong                VARCHAR(100),
    ho                  VARCHAR(100),
    floor               VARCHAR(50),
    window_type         VARCHAR(100),
    location_detail     VARCHAR(500),
    delivery_date       DATE,
    remarks             TEXT
);

-- 4-4. worker_daily_assignment (작업자 일일 배치)
CREATE TABLE IF NOT EXISTS hkgn.worker_daily_assignment (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    work_date           DATE          NOT NULL,
    assignment_type_cd  VARCHAR(10),
    work_area           VARCHAR(50),
    position            VARCHAR(50),
    worker_nm           VARCHAR(100),
    worker_cd           VARCHAR(50),
    plan_no             VARCHAR(50),
    work_request_no     VARCHAR(50),
    assignment_remarks  TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

-- 4-5. cutting_daily_report (재단 일보)
CREATE TABLE IF NOT EXISTS hkgn.cutting_daily_report (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    report_no               VARCHAR(30)   NOT NULL UNIQUE,
    report_date             DATE          NOT NULL,
    seq_no                  INTEGER,
    work_request_no         VARCHAR(50),
    customer_cd             VARCHAR(30),
    customer_nm             VARCHAR(200),
    site_cd                 VARCHAR(30),
    site_nm                 VARCHAR(200),
    raw_plate_no            INTEGER,
    raw_material_cd         VARCHAR(30)   NOT NULL,
    raw_material_nm         VARCHAR(200),
    raw_thickness           NUMERIC(6,2),
    raw_color               VARCHAR(30),
    raw_width               NUMERIC(10,2),
    raw_height              NUMERIC(10,2),
    raw_plate_count         INTEGER       DEFAULT 0,
    required_area           NUMERIC(10,3) DEFAULT 0,
    waste_included_area     NUMERIC(10,3) DEFAULT 0,
    used_area               NUMERIC(10,3) DEFAULT 0,
    production_defect_area  NUMERIC(10,3) DEFAULT 0,
    loss_area               NUMERIC(10,3) DEFAULT 0,
    loss_rate               NUMERIC(5,2)  DEFAULT 0,
    loss_weight             NUMERIC(10,2) DEFAULT 0,
    loss_amount             NUMERIC(15,2) DEFAULT 0,
    optimized_area_pyeong   NUMERIC(10,3) DEFAULT 0,
    optimized_area_m2       NUMERIC(10,3) DEFAULT 0,
    cutting_area            NUMERIC(10,3) DEFAULT 0,
    total_region            NUMERIC(10,3) DEFAULT 0,
    opt_region              NUMERIC(10,3) DEFAULT 0,
    raw_qty                 NUMERIC(12,2) DEFAULT 0,
    good_qty                NUMERIC(12,2) DEFAULT 0,
    defect_qty              NUMERIC(12,2) DEFAULT 0,
    unit                    VARCHAR(10)   DEFAULT '평',
    worker_cd               VARCHAR(30),
    defect_reason           TEXT,
    remarks                 TEXT,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by              VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by              VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

-- ============================================
-- 5. 구매/입고 테이블
-- ============================================

-- 5-1. purchase_order (구매발주)
CREATE TABLE IF NOT EXISTS hkgn.purchase_order (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    po_no               VARCHAR(30)   NOT NULL UNIQUE,
    po_date             DATE          NOT NULL,
    po_type             VARCHAR(30)   NOT NULL DEFAULT 'RAW_GLASS',
    supplier_cd         VARCHAR(30),
    supplier_nm         VARCHAR(100)  NOT NULL,
    site_nm             VARCHAR(200),
    receiver_nm         VARCHAR(100),
    sender_dept         VARCHAR(200),
    sender_nm           VARCHAR(100),
    delivery_date       DATE,
    receipt_location    VARCHAR(100),
    total_amount        NUMERIC(15,2) DEFAULT 0,
    tax_amount          NUMERIC(15,2) DEFAULT 0,
    po_status           VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    remarks             TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

-- 5-2. purchase_order_detail (구매발주 상세)
CREATE TABLE IF NOT EXISTS hkgn.purchase_order_detail (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    po_no               VARCHAR(30)   NOT NULL,
    line_seq            INTEGER       NOT NULL DEFAULT 1,
    material_cd         VARCHAR(30),
    material_nm         VARCHAR(200)  NOT NULL,
    width_mm            NUMERIC(10,2),
    height_mm           NUMERIC(10,2),
    frame_count         INTEGER,
    order_qty           NUMERIC(12,2) NOT NULL,
    unit                VARCHAR(10)   DEFAULT 'EA',
    area_pyeong         NUMERIC(12,2),
    unit_price          NUMERIC(12,2) DEFAULT 0,
    supply_amount       NUMERIC(15,2) DEFAULT 0,
    tax_amount          NUMERIC(15,2) DEFAULT 0,
    received_qty        NUMERIC(12,2) DEFAULT 0,
    line_status         VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    remarks             TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    UNIQUE (po_no, line_seq)
);

-- 5-3. goods_receipt (입고 실적)
CREATE TABLE IF NOT EXISTS hkgn.goods_receipt (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    receipt_no          VARCHAR(30)   NOT NULL UNIQUE,
    receipt_date        DATE          NOT NULL,
    po_no               VARCHAR(30),
    po_line_seq         INTEGER,
    supplier_cd         VARCHAR(30),
    supplier_nm         VARCHAR(100),
    material_cd         VARCHAR(30),
    material_nm         VARCHAR(200),
    width_mm            NUMERIC(10,2),
    height_mm           NUMERIC(10,2),
    frame_count         INTEGER,
    receipt_qty         NUMERIC(12,2) NOT NULL,
    outstanding_qty     NUMERIC(12,2) DEFAULT 0,
    unit                VARCHAR(10)   DEFAULT 'EA',
    area_m2             NUMERIC(12,4),
    area_pyeong         NUMERIC(12,2),
    unit_price          NUMERIC(12,2) DEFAULT 0,
    price_per_pyeong    NUMERIC(12,2),
    discount_pct        NUMERIC(5,2),
    supply_amount       NUMERIC(15,2) DEFAULT 0,
    tax_amount          NUMERIC(15,2) DEFAULT 0,
    inspected_qty       NUMERIC(12,2) DEFAULT 0,
    passed_qty          NUMERIC(12,2) DEFAULT 0,
    rejected_qty        NUMERIC(12,2) DEFAULT 0,
    inspection_status   VARCHAR(20)   DEFAULT 'PENDING',
    rejection_reason    TEXT,
    remarks             TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

-- ============================================
-- 6. 출고/배송 테이블
-- ============================================

-- 6-1. delivery_header (출고 헤더)
CREATE TABLE IF NOT EXISTS hkgn.delivery_header (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    delivery_no         VARCHAR(30)   NOT NULL UNIQUE,
    delivery_date       DATE          NOT NULL,
    actual_date         DATE,
    order_no            VARCHAR(30)   NOT NULL,
    customer_cd         VARCHAR(30)   NOT NULL,
    site_cd             VARCHAR(30),
    transaction_type    VARCHAR(20)   DEFAULT '정상',
    special_notes       TEXT,
    delivery_address    VARCHAR(500),
    vehicle_no          VARCHAR(20),
    driver_nm           VARCHAR(100),
    driver_phone        VARCHAR(20),
    shipping_company    VARCHAR(200),
    shipping_cost       NUMERIC(15,2) DEFAULT 0,
    shipping_tax        NUMERIC(15,2) DEFAULT 0,
    delivery_status     VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    remarks             TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

-- 6-2. delivery_detail (출고 상세)
CREATE TABLE IF NOT EXISTS hkgn.delivery_detail (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    delivery_no         VARCHAR(30)   NOT NULL,
    line_no             INTEGER       NOT NULL,
    order_no            VARCHAR(30),
    order_line_no       INTEGER,
    material_cd         VARCHAR(30)   NOT NULL,
    material_nm         VARCHAR(200),
    category            VARCHAR(10),
    thickness           NUMERIC(10,2),
    width               NUMERIC(10,2),
    height              NUMERIC(10,2),
    order_quantity      NUMERIC(12,2) DEFAULT 0,
    unshipped_quantity  NUMERIC(12,2) DEFAULT 0,
    delivery_qty        NUMERIC(12,2) NOT NULL,
    unit                VARCHAR(10)   DEFAULT 'EA',
    area                NUMERIC(10,3) DEFAULT 0,
    unit_price          NUMERIC(15,2) DEFAULT 0,
    amount              NUMERIC(15,2) DEFAULT 0,
    tax                 NUMERIC(15,2) DEFAULT 0,
    total_amount        NUMERIC(15,2) DEFAULT 0,
    line_status         VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    remarks             TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    UNIQUE(delivery_no, line_no)
);

-- ============================================
-- 7. 재고 관련 테이블
-- ============================================

-- 7-1. inventory (재고 현황)
CREATE TABLE IF NOT EXISTS hkgn.inventory (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    inventory_type  VARCHAR(20)   NOT NULL,
    material_cd     VARCHAR(30)   NOT NULL,
    material_nm     VARCHAR(200)  NOT NULL,
    width_mm        NUMERIC(10,2),
    height_mm       NUMERIC(10,2),
    current_qty     NUMERIC(12,2) NOT NULL DEFAULT 0,
    available_qty   NUMERIC(12,2) NOT NULL DEFAULT 0,
    reserved_qty    NUMERIC(12,2) DEFAULT 0,
    unit            VARCHAR(10)   DEFAULT 'EA',
    area_pyeong     NUMERIC(12,2),
    min_qty         NUMERIC(12,2) DEFAULT 0,
    max_qty         NUMERIC(12,2) DEFAULT 0,
    supplier_cd     VARCHAR(30),
    supplier_nm     VARCHAR(100),
    warehouse_cd    VARCHAR(30),
    location        VARCHAR(100),
    snapshot_date   DATE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

-- 7-2. inventory_transaction (재고 이동 이력)
CREATE TABLE IF NOT EXISTS hkgn.inventory_transaction (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    transaction_no      VARCHAR(30)   NOT NULL,
    transaction_date    DATE          NOT NULL,
    transaction_type    VARCHAR(20)   NOT NULL,
    material_cd         VARCHAR(30),
    material_nm         VARCHAR(200),
    width_mm            NUMERIC(10,2),
    height_mm           NUMERIC(10,2),
    quantity            NUMERIC(12,2) NOT NULL,
    unit                VARCHAR(10)   DEFAULT 'EA',
    area_pyeong         NUMERIC(12,2),
    before_qty          NUMERIC(12,2),
    after_qty           NUMERIC(12,2),
    from_location       VARCHAR(100),
    to_location         VARCHAR(100),
    site_cd             VARCHAR(30),
    site_nm             VARCHAR(200),
    vehicle_no          VARCHAR(50),
    ref_doc_type        VARCHAR(20),
    ref_doc_no          VARCHAR(30),
    remarks             TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

-- 7-3. container_inventory (용기 재고)
CREATE TABLE IF NOT EXISTS hkgn.container_inventory (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    container_cd        VARCHAR(30)   NOT NULL,
    container_nm        VARCHAR(200),
    location            VARCHAR(100)  NOT NULL,
    location_type       VARCHAR(20)   NOT NULL,
    bp_cd               VARCHAR(30),
    site_cd             VARCHAR(30),
    site_nm             VARCHAR(200),
    quantity            INTEGER       NOT NULL DEFAULT 0,
    shortage_qty        INTEGER       DEFAULT 0,
    container_status    VARCHAR(20)   NOT NULL DEFAULT 'GOOD',
    remarks             TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    UNIQUE(container_cd, location)
);
