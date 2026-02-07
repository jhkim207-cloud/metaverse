# Changelog

HK지앤텍 ERP 데이터베이스 스키마 변경 이력

---

## [1.0.0] - 2026-02-07

### Added (신규 추가)

#### DDL 파일 (22개 테이블)
- `business_partner.sql` - 거래처 마스터 (매출처/매입처/외주처 통합)
- `item_master.sql` - 자재 마스터 (제품/원판/부자재/강화/에칭/용기 통합)
- `site_master.sql` - 현장 마스터 (건설현장/납품처)
- `site_price.sql` - 현장별 유리사양 단가 정보
- `worker.sql` - 작업자 마스터
- `standard_terms.sql` - 표준용어사전
- `sales_order_header.sql` - 수주 헤더
- `sales_order_detail.sql` - 수주 상세
- `production_plan.sql` - 생산계획 (작업지시서)
- `production_plan_detail.sql` - 생산계획 상세
- `production_result.sql` - 생산실적 (생산일지)
- `cutting_daily_report.sql` - 재단일보
- `packing_order.sql` - 포장지시
- `delivery_header.sql` - 출고 헤더
- `delivery_detail.sql` - 출고 상세
- `purchase_order.sql` - 구매발주
- `purchase_order_detail.sql` - 구매발주 상세
- `goods_receipt.sql` - 입고
- `inventory.sql` - 재고 현황
- `inventory_transaction.sql` - 재고 이동 이력
- `container_inventory.sql` - 용기 재고 (현장별)
- `subcontract_order.sql` - 외주발주

#### 샘플 데이터 (22개 파일, 292개 레코드)
- `data/business_partner_sample.sql` - 15개
- `data/item_master_sample.sql` - 20개
- `data/site_master_sample.sql` - 10개
- `data/site_price_sample.sql` - 15개
- `data/worker_sample.sql` - 12개
- `data/standard_terms_sample.sql` - 10개
- `data/sales_order_header_sample.sql` - 15개
- `data/sales_order_detail_sample.sql` - 30개
- `data/production_plan_sample.sql` - 15개
- `data/production_plan_detail_sample.sql` - 30개
- `data/production_result_sample.sql` - 20개
- `data/cutting_daily_report_sample.sql` - 15개
- `data/packing_order_sample.sql` - 12개
- `data/delivery_header_sample.sql` - 10개
- `data/delivery_detail_sample.sql` - 20개
- `data/purchase_order_sample.sql` - 10개
- `data/purchase_order_detail_sample.sql` - 25개
- `data/goods_receipt_sample.sql` - 15개
- `data/inventory_sample.sql` - 15개
- `data/inventory_transaction_sample.sql` - 20개
- `data/container_inventory_sample.sql` - 10개
- `data/subcontract_order_sample.sql` - 10개

#### 마스터 스크립트
- `_execute_all_ddl.sql` - 전체 DDL 일괄 실행 스크립트
- `data/_insert_all_sample_data.sql` - 전체 샘플 데이터 일괄 INSERT 스크립트
- `data/_verify_sample_data.sql` - 데이터 검증 스크립트

#### 문서
- `README.md` - 설치 및 사용 가이드
- `CHANGELOG.md` - 본 파일 (변경 이력)
- `data/README.md` - 샘플 데이터 가이드
- `data/SUMMARY.md` - 작업 완료 보고서
- `data/QUICK_START.md` - 빠른 시작 가이드

### Changed (변경사항)

#### 스키마 변경
- **원본**: `hk_erp` (사용자 제공 Excel DDL)
- **변경**: `hkgn` (프로젝트 표준 스키마)
- **이유**: 기존 프로젝트 구조와 일관성 유지

#### FK 제약조건 제외
- **원본**: REFERENCES 구문 포함
- **변경**: REFERENCES 구문 제외, 주석으로 참조 관계 명시
- **이유**: 사용자 요청에 따라 FK 정의 제외
- **예시**:
  ```sql
  -- 원본
  bp_cd VARCHAR(30) NOT NULL REFERENCES business_partner(bp_cd)

  -- 변경
  bp_cd VARCHAR(30) NOT NULL,  -- [거래처코드] 거래처 코드 (→ business_partner.bp_cd)
  ```

#### SERIAL → BIGINT GENERATED ALWAYS AS IDENTITY
- **원본**: `SERIAL PRIMARY KEY`
- **변경**: `BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY`
- **이유**: PostgreSQL 권장 방식

### Enhanced (보강사항)

#### 공통 감사 컬럼 추가
모든 테이블에 다음 컬럼 추가:
```sql
created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
created_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER
updated_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER
```

- **원본**: `created_at`, `updated_at`만 일부 테이블에 존재
- **변경**: 모든 테이블에 4개 감사 컬럼 표준화
- **효과**: 데이터 변경 추적 및 감사 기능 강화

#### 인덱스 추가
- FK 컬럼에 인덱스 추가 (FK 제약조건은 없지만 검색 성능 향상)
- 검색 컬럼(status, date, type 등)에 인덱스 추가
- 예시:
  ```sql
  CREATE INDEX idx_item_master_type ON hkgn.item_master(material_type);
  CREATE INDEX idx_item_master_supplier ON hkgn.item_master(supplier_cd);
  ```

#### COMMENT 추가
모든 테이블과 컬럼에 COMMENT 추가:
```sql
COMMENT ON TABLE hkgn.item_master IS '자재 마스터 - 제품/원판/부자재/강화/에칭/용기 통합 관리';
COMMENT ON COLUMN hkgn.item_master.material_cd IS '[자재코드] 자재 식별 코드 (PK)';
COMMENT ON COLUMN hkgn.item_master.material_type IS '[자재구분] PRODUCT:완제품, RAW:원판, SUB:부자재, TEMPERED:강화, ETCHED:에칭, CONTAINER:용기';
```

- **형식**: `[한글명] - 설명`
- **효과**: 데이터베이스 자체 문서화, 개발자 이해도 향상

#### 파일 헤더 추가
모든 DDL 파일에 표준 헤더 추가:
```sql
-- ============================================
-- 테이블: item_master
-- 설명: 자재 마스터 (제품/원판/부자재 통합)
-- 작성일: 2026-02-07
-- 스키마: hkgn
-- ============================================
```

### Fixed (수정사항)

#### 인덱스 에러 수정
- **원본**: `#NAME?` 에러 (Excel 수식 오류)
- **변경**: 정상적인 CREATE INDEX 문으로 재작성

#### 데이터 타입 표준화
- 모든 TIMESTAMP 컬럼: `TIMESTAMP WITH TIME ZONE` 사용 (타임존 보존)
- 문자열 컬럼: VARCHAR(길이) 명시적 지정

---

## 주요 차이점 요약

| 항목 | 원본 (Excel) | 변경 후 (최종) |
|------|-------------|---------------|
| 스키마 | hk_erp | hkgn |
| FK 제약조건 | REFERENCES 포함 | 제외 (주석으로 표시) |
| 감사 컬럼 | 일부만 포함 | 모든 테이블 표준화 (4개) |
| 인덱스 | #NAME? 에러 | 정상 생성 |
| COMMENT | 없음 | 모든 테이블/컬럼 추가 |
| 파일 분리 | 단일 파일 | 테이블별 개별 파일 (22개) |
| 샘플 데이터 | 일부만 제공 | 모든 테이블 10~20개씩 |
| 문서 | 없음 | README, CHANGELOG 등 |

---

## 통계

### 파일 수
- **DDL 파일**: 23개 (22개 테이블 + 1개 마스터 스크립트)
- **INSERT 파일**: 23개 (22개 테이블 + 1개 마스터 스크립트)
- **문서 파일**: 5개
- **총계**: 51개

### 샘플 데이터
- **총 레코드 수**: 292개
- **기준정보**: 82개
- **영업/수주**: 45개
- **생산**: 80개
- **포장/출고**: 42개
- **구매**: 50개
- **재고**: 45개
- **외주**: 10개

### 코드 라인 수
- **DDL 총 라인**: 약 3,500줄
- **INSERT 총 라인**: 약 1,800줄
- **문서 총 라인**: 약 800줄
- **총계**: 약 6,100줄

---

## 비교: 원본 vs 최종

### 원본 DDL (사용자 제공)
```sql
CREATE TABLE item_master (
    material_cd     VARCHAR(30)   PRIMARY KEY,
    material_type   VARCHAR(20)   NOT NULL,
    material_nm     VARCHAR(200)  NOT NULL,
    supplier_cd     VARCHAR(30),
    is_active       BOOLEAN       DEFAULT TRUE,
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
```

### 최종 DDL (enriched)
```sql
-- ============================================
-- 테이블: item_master
-- 설명: 자재 마스터 (제품/원판/부자재 통합)
-- 작성일: 2026-02-07
-- 스키마: hkgn
-- ============================================

CREATE TABLE hkgn.item_master (
    -- PK
    material_cd     VARCHAR(30)   PRIMARY KEY,                               -- [자재코드] 자재 식별 코드 (PK)

    -- 기본 정보
    material_type   VARCHAR(20)   NOT NULL,                                  -- [자재구분] PRODUCT:완제품, RAW:원판, SUB:부자재, TEMPERED:강화, ETCHED:에칭, CONTAINER:용기
    material_nm     VARCHAR(200)  NOT NULL,                                  -- [자재명] 자재 이름

    -- 참조 정보
    supplier_cd     VARCHAR(30),                                             -- [주거래처코드] 주거래처 코드 (→ business_partner.bp_cd)

    -- 상태
    is_active       BOOLEAN       DEFAULT TRUE,                              -- [사용여부] 사용 여부

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

-- 인덱스
CREATE INDEX idx_item_master_type ON hkgn.item_master(material_type);
CREATE INDEX idx_item_master_supplier ON hkgn.item_master(supplier_cd);

-- 코멘트
COMMENT ON TABLE hkgn.item_master IS '자재 마스터 - 제품/원판/부자재/강화/에칭/용기 통합 관리';
COMMENT ON COLUMN hkgn.item_master.material_cd IS '[자재코드] 자재 식별 코드 (PK)';
COMMENT ON COLUMN hkgn.item_master.material_type IS '[자재구분] PRODUCT:완제품, RAW:원판, SUB:부자재, TEMPERED:강화, ETCHED:에칭, CONTAINER:용기';
-- ... (생략)
```

---

## 향후 계획

### v1.1.0 (예정)
- [ ] Trigger 추가 (updated_at 자동 갱신)
- [ ] View 추가 (주문-생산-출고 통합 뷰)
- [ ] Function 추가 (재고 수불 계산)

### v1.2.0 (예정)
- [ ] Partition 적용 (대용량 트랜잭션 테이블)
- [ ] Full-text search index 추가
- [ ] Materialized view 추가 (집계 데이터)

---

**작성일**: 2026-02-07
**작성자**: Claude Sonnet 4.5
**버전**: 1.0.0
