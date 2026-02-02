# /data-model - 상세 가이드

> 이 문서는 필요 시 참조하는 상세 가이드입니다.

## 산출물 구조

```markdown
# 데이터 모델 설계서: {기능명}

## 1. ERD

```
┌─────────────────┐       ┌─────────────────┐
│ table_a         │       │ table_b         │
├─────────────────┤       ├─────────────────┤
│ PK id           │───┐   │ PK id           │
│    column_1     │   └──>│ FK table_a_id   │
│    column_2     │       │    column_1     │
│    created_at   │       │    created_at   │
│    updated_at   │       │    updated_at   │
└─────────────────┘       └─────────────────┘
```

## 2. 테이블 정의

### 2.1 {테이블명}

| 컬럼명 | 데이터타입 | 제약조건 | 설명 | 표준용어 |
|--------|-----------|----------|------|----------|
| id | BIGINT | PK, GENERATED | 고유 식별자 | ID |
| name | VARCHAR(100) | NOT NULL | 이름 | NM |
| status | VARCHAR(20) | NOT NULL | 상태 | STAT_CD |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT now() | 생성일시 | CREAT_DT |
| updated_at | TIMESTAMPTZ | NOT NULL DEFAULT now() | 수정일시 | UPDT_DT |
| created_by | VARCHAR(100) | NOT NULL DEFAULT CURRENT_USER | 생성자 | CREAT_BY |
| updated_by | VARCHAR(100) | NOT NULL DEFAULT CURRENT_USER | 수정자 | UPDT_BY |

### 2.2 {테이블명}
...

## 3. 인덱스 정의

| 테이블 | 인덱스명 | 컬럼 | 유형 | 용도 |
|--------|----------|------|------|------|
| ... | idx_xxx_yyy | yyy | BTREE | 조회 성능 |
| ... | idx_xxx_zzz | zzz | BTREE | 정렬 성능 |

## 4. 제약조건

| 테이블 | 제약명 | 유형 | 정의 |
|--------|--------|------|------|
| ... | pk_xxx | PRIMARY KEY | (id) |
| ... | fk_xxx_yyy | FOREIGN KEY | REFERENCES yyy(id) |
| ... | chk_xxx_status | CHECK | status IN ('A', 'B', 'C') |

## 5. 초기 데이터

```sql
-- 코드 테이블 초기 데이터
INSERT INTO code_master (code_type, code, name) VALUES
('STATUS', 'ACTIVE', '활성'),
('STATUS', 'INACTIVE', '비활성');
```

## 6. 마이그레이션 전략

| 단계 | 작업 | 롤백 방안 |
|------|------|----------|
| 1 | 테이블 생성 | DROP TABLE |
| 2 | 초기 데이터 | DELETE |
| 3 | 인덱스 생성 | DROP INDEX |
```

---

## DDL 템플릿

```sql
-- ============================================
-- 테이블: {table_name}
-- 설명: {description}
-- 작성일: {date}
-- ============================================

CREATE TABLE {table_name} (
    -- PK
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- 비즈니스 컬럼
    {column_name} {data_type} {constraints} {comment},

    -- 감사(audit) 컬럼
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
    updated_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER
);

-- 인덱스
CREATE INDEX idx_{table_name}_{column} ON {table_name}({column});

-- 코멘트
COMMENT ON TABLE {table_name} IS '{description}';
COMMENT ON COLUMN {table_name}.{column_name} IS '{column_description}';
```

---

## Quality Validation

산출물 생성 후 다음 기준으로 내용 품질을 자체 검증한다.
기준 미달 시 자동 개선 후 재검증한다.

### 표준 용어 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| standards.json 준수 | 모든 컬럼이 표준 용어 사용 | 표준 용어로 변경 |
| 새 용어 등록 | 표준에 없는 용어는 Provisional | 사용자 승인 요청 |
| 데이터타입 일관성 | 동일 용어는 동일 타입 | 타입 통일 |

### DDL 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| 문법 유효성 | PostgreSQL 문법 준수 | 문법 수정 |
| PK 정의 | 모든 테이블에 PK 존재 | PK 추가 |
| 감사 컬럼 | created_at/updated_at 필수 | 컬럼 추가 |
| 네이밍 규칙 | snake_case, 소문자 | 네이밍 수정 |

### ERD 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| 관계 명시 | 모든 FK 관계 표시 | 관계 추가 |
| 카디널리티 | 1:1, 1:N, N:M 명시 | 카디널리티 추가 |
| 테이블 완전성 | 문서의 모든 테이블 포함 | 누락 테이블 추가 |

### 참조 무결성 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| FK 참조 유효 | 참조 테이블 존재 | 순서 조정 또는 테이블 추가 |
| CASCADE 정의 | DELETE/UPDATE 동작 명시 | CASCADE 규칙 추가 |

---

## Provisional 용어 등록

표준에 없는 새 용어 발견 시:

1. `[Provisional]` 태그 붙여 문서에 기록
2. **한글명과 영문명을 반드시 함께 표시**
3. Gate 7에서 일괄 승인 요청
4. 승인 시 standards.json에 추가

### 예시

```markdown
| 컬럼명 | 데이터타입 | 한글명 | 영문명 | 표준용어 |
|--------|-----------|--------|--------|----------|
| notification_type | VARCHAR(50) | 알림유형코드 | Notification Type Code | [Provisional] NTFC_TYP_CD |
| order_no | VARCHAR(50) | 수주번호 | Sales Order Number | [Provisional] ORDR_NO |
```

### Provisional 용어 필수 항목

| 필드 | 필수 | 설명 |
|------|------|------|
| 컬럼명 | ✅ | snake_case 영문 |
| 데이터타입 | ✅ | PostgreSQL 타입 |
| 한글명 | ✅ | 한글 용어명 |
| 영문명 | ✅ | 영문 용어명 (Full Name) |
| 표준용어 | ✅ | 약어 (abbreviation) |

---

## standards.json 참조 방법

```json
{
  "terms": [
    {
      "korean": "식별자",
      "english": "Identifier",
      "abbreviation": "ID",
      "dataType": "BIGINT",
      "description": "고유 식별자"
    },
    {
      "korean": "수주번호",
      "english": "Sales Order Number",
      "abbreviation": "ORDR_NO",
      "dataType": "VARCHAR(50)",
      "description": "수주 고유 번호"
    }
  ]
}
```

### 필수 필드 설명

| 필드 | 필수 | 설명 | 예시 |
|------|------|------|------|
| korean | ✅ | 한글 용어명 | "수주번호" |
| english | ✅ | 영문 용어명 (Full Name) | "Sales Order Number" |
| abbreviation | ✅ | 약어 (컬럼명에 사용) | "ORDR_NO" |
| dataType | ✅ | PostgreSQL 데이터 타입 | "VARCHAR(50)" |
| description | ✅ | 용어 설명 | "수주 고유 번호" |

파일 위치: `db_dic/dictionary/standards.json`
