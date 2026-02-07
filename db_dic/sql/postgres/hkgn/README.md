# HK지앤텍 ERP 데이터베이스 설치 가이드

## 개요

HK지앤텍 유리 가공 ERP 시스템의 PostgreSQL 데이터베이스 스키마 및 샘플 데이터 설치 가이드입니다.

---

## 시스템 요구사항

- **DBMS**: PostgreSQL 12 이상
- **데이터베이스**: apps
- **스키마**: hkgn
- **접속 정보**:
  - Host: 168.107.43.244
  - Port: 5432
  - Database: apps
  - Username: postgres

---

## 디렉토리 구조

```
c:\project\hkgn\db_dic\sql\postgres\hkgn\
├── _execute_all_ddl.sql                # 마스터 DDL 실행 스크립트
├── README.md                            # 본 파일
├── CHANGELOG.md                         # 변경 이력
├── business_partner.sql                 # 거래처 마스터
├── item_master.sql                      # 자재 마스터
├── site_master.sql                      # 현장 마스터
├── site_price.sql                       # 현장별 단가
├── worker.sql                           # 작업자 마스터
├── standard_terms.sql                   # 표준용어
├── sales_order_header.sql               # 수주 헤더
├── sales_order_detail.sql               # 수주 상세
├── production_plan.sql                  # 생산계획
├── production_plan_detail.sql           # 생산계획 상세
├── production_result.sql                # 생산실적
├── cutting_daily_report.sql             # 재단일보
├── packing_order.sql                    # 포장지시
├── delivery_header.sql                  # 출고 헤더
├── delivery_detail.sql                  # 출고 상세
├── purchase_order.sql                   # 구매발주
├── purchase_order_detail.sql            # 구매발주 상세
├── goods_receipt.sql                    # 입고
├── inventory.sql                        # 재고 현황
├── inventory_transaction.sql            # 재고 이동
├── container_inventory.sql              # 용기 재고
├── subcontract_order.sql                # 외주발주
└── data\
    ├── _insert_all_sample_data.sql      # 마스터 INSERT 스크립트
    ├── _verify_sample_data.sql          # 검증 스크립트
    ├── business_partner_sample.sql      # 거래처 샘플 (15개)
    ├── item_master_sample.sql           # 자재 샘플 (20개)
    ├── site_master_sample.sql           # 현장 샘플 (10개)
    ├── ... (생략)
    └── README.md                        # 샘플 데이터 가이드
```

---

## 설치 방법

### 1. DDL 실행 (테이블 생성)

#### Windows (PowerShell)
```powershell
cd c:\project\hkgn\db_dic\sql\postgres\hkgn

psql -h 168.107.43.244 -p 5432 -U postgres -d apps -f "_execute_all_ddl.sql"
```

#### Linux/Mac
```bash
cd /c/project/hkgn/db_dic/sql/postgres/hkgn

psql -h 168.107.43.244 -p 5432 -U postgres -d apps -f _execute_all_ddl.sql
```

#### 예상 출력
```
==========================================
HK G&N Tech ERP DDL 실행 시작...
==========================================

1. 스키마 생성...
   ✓ hkgn 스키마 생성 완료

2. 기준정보 마스터 테이블 생성...
   - business_partner (거래처)
   - item_master (자재)
   - site_master (현장)
   - site_price (현장별 단가)
   - worker (작업자)
   - standard_terms (표준용어)
   ✓ 기준정보 마스터 테이블 생성 완료 (6개)

... (생략)

==========================================
DDL 실행 완료!
==========================================

총 22개 테이블 생성:
  - 기준정보: 6개
  - 영업/수주: 2개
  - 생산: 4개
  - 포장/출고: 3개
  - 구매: 3개
  - 재고: 3개
  - 외주: 1개
```

---

### 2. 샘플 데이터 삽입

#### Windows (PowerShell)
```powershell
cd c:\project\hkgn\db_dic\sql\postgres\hkgn\data

psql -h 168.107.43.244 -p 5432 -U postgres -d apps -f "_insert_all_sample_data.sql"
```

#### 예상 출력
```
==========================================
HK G&N Tech ERP 샘플 데이터 삽입 시작...
==========================================

... (생략)

==========================================
샘플 데이터 삽입 완료!
==========================================

총 292개 레코드 삽입:
  - 기준정보: 82개
  - 영업/수주: 45개
  - 생산: 80개
  - 포장/출고: 42개
  - 구매: 50개
  - 재고: 45개
  - 외주: 10개
```

---

### 3. 데이터 검증

#### Windows (PowerShell)
```powershell
cd c:\project\hkgn\db_dic\sql\postgres\hkgn\data

psql -h 168.107.43.244 -p 5432 -U postgres -d apps -f "_verify_sample_data.sql"
```

#### 수동 검증 쿼리
```sql
-- 테이블별 레코드 수 확인
SELECT
    schemaname,
    tablename,
    n_tup_ins AS row_count
FROM pg_stat_user_tables
WHERE schemaname = 'hkgn'
ORDER BY tablename;

-- 주문-생산-출고 플로우 확인
SELECT
    so.doc_no AS 수주번호,
    so.order_date AS 수주일자,
    pp.wo_no AS 작업지시번호,
    pp.plan_date AS 계획일자,
    dh.dlv_doc_no AS 출고번호,
    dh.txn_date AS 출고일자
FROM hkgn.sales_order_header so
LEFT JOIN hkgn.production_plan pp ON so.doc_no = pp.doc_no
LEFT JOIN hkgn.delivery_header dh ON pp.wo_no = dh.wo_no
ORDER BY so.order_date DESC
LIMIT 10;
```

---

## 테이블 구성

### 기준정보 (6개)
| 테이블명 | 한글명 | 샘플 데이터 |
|---------|--------|------------|
| business_partner | 거래처 마스터 | 15개 |
| item_master | 자재 마스터 | 20개 |
| site_master | 현장 마스터 | 10개 |
| site_price | 현장별 단가 | 15개 |
| worker | 작업자 마스터 | 12개 |
| standard_terms | 표준용어 | 10개 |

### 영업/수주 (2개)
| 테이블명 | 한글명 | 샘플 데이터 |
|---------|--------|------------|
| sales_order_header | 수주 헤더 | 15개 |
| sales_order_detail | 수주 상세 | 30개 |

### 생산 (4개)
| 테이블명 | 한글명 | 샘플 데이터 |
|---------|--------|------------|
| production_plan | 생산계획 | 15개 |
| production_plan_detail | 생산계획 상세 | 30개 |
| production_result | 생산실적 | 20개 |
| cutting_daily_report | 재단일보 | 15개 |

### 포장/출고 (3개)
| 테이블명 | 한글명 | 샘플 데이터 |
|---------|--------|------------|
| packing_order | 포장지시 | 12개 |
| delivery_header | 출고 헤더 | 10개 |
| delivery_detail | 출고 상세 | 20개 |

### 구매 (3개)
| 테이블명 | 한글명 | 샘플 데이터 |
|---------|--------|------------|
| purchase_order | 구매발주 | 10개 |
| purchase_order_detail | 구매발주 상세 | 25개 |
| goods_receipt | 입고 | 15개 |

### 재고 (3개)
| 테이블명 | 한글명 | 샘플 데이터 |
|---------|--------|------------|
| inventory | 재고 현황 | 15개 |
| inventory_transaction | 재고 이동 | 20개 |
| container_inventory | 용기 재고 | 10개 |

### 외주 (1개)
| 테이블명 | 한글명 | 샘플 데이터 |
|---------|--------|------------|
| subcontract_order | 외주발주 | 10개 |

---

## 주의사항

### FK 제약조건 제외
- 모든 테이블에서 FOREIGN KEY 제약조건이 **제외**되었습니다
- FK 관계는 주석으로만 표시: `-- [컬럼명] 설명 (→ 참조테이블.참조컬럼)`
- FK 무결성은 **애플리케이션 레벨**에서 관리해야 합니다

### 공통 감사 컬럼
모든 테이블에 다음 컬럼이 자동으로 추가됩니다:
```sql
created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
created_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER
updated_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER
```

### 타임존
- 모든 TIMESTAMP 컬럼은 `TIMESTAMP WITH TIME ZONE` 타입 사용
- 서버 타임존 설정 확인 필요

---

## 문제 해결

### 1. 스키마가 이미 존재하는 경우
```sql
-- 기존 스키마 삭제 (주의: 모든 데이터 손실)
DROP SCHEMA IF EXISTS hkgn CASCADE;
```

### 2. 테이블이 이미 존재하는 경우
```sql
-- 특정 테이블 삭제
DROP TABLE IF EXISTS hkgn.item_master CASCADE;

-- 모든 테이블 삭제
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'hkgn')
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS hkgn.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;
```

### 3. 샘플 데이터 재삽입
```sql
-- 모든 테이블 데이터 삭제 (구조는 유지)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'hkgn')
    LOOP
        EXECUTE 'TRUNCATE TABLE hkgn.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;
```

---

## 변경 이력

자세한 변경 이력은 [CHANGELOG.md](CHANGELOG.md)를 참조하세요.

---

## 문의

- 작성일: 2026-02-07
- 버전: 1.0.0
- 프로젝트: HK지앤텍 유리 가공 ERP
