# /data-model - 데이터 모델 설계 Skill

## 개요

요구사항을 DB 스키마로 변환하는 전문가 Skill입니다. ERD, DDL, 인덱스/제약조건을 설계합니다.

## 사용법

```
/data-model [기능명]
/data-model [기능명] --fix      # Gate 실패 시 재실행
/data-model [기능명] --blocking # 신규 용어 즉시 승인 모드
```

## 입출력

- **입력**: `prd/{기능명}/00-research.md`, `01-requirements.md`
- **산출물**: `prd/{기능명}/03-data-model.md`, `db_dic/sql/postgres/public/{테이블명}.sql`
- **참조**: `db_dic/dictionary/standards.json`

---

## 🔴 필수 실행 체크리스트

실행 전 반드시 확인:

```
□ 1. standards.json 읽기 (표준 용어 확인)
□ 2. 신규 용어 → [PROVISIONAL] 태그 부착
□ 3. 감사 컬럼 필수 (created_at, updated_at, created_by, updated_by)
□ 4. PK 형식: BIGINT GENERATED ALWAYS AS IDENTITY
□ 5. DDL 파일 생성: db_dic/sql/postgres/public/
□ 6. Quality Validation 수행
□ 7. Gate 3 검증 항목 5개 확인
□ 8. 테이블 생성 여부 확인 (선택)
```

---

## Gate 3 검증 항목 (5개)

| # | 항목 | 유형 | 기준 |
|---|------|------|------|
| 1 | DDL 문법 검증 | 자동 | psql 통과 |
| 2 | standards.json 준수 | 자동 | 표준 용어 또는 [PROVISIONAL] |
| 3 | 감사 컬럼 존재 | 자동 | 4개 필수 |
| 4 | PK 형식 | 자동 | BIGINT IDENTITY |
| 5 | 인덱스 정의 | 수동 | 검색 조건 커버 |

---

## Provisional 모드 (기본)

```
신규 용어 발견 시:
1. [PROVISIONAL] 태그와 함께 DDL에 포함
2. "신규 등록 필요 용어" 섹션에 기록
3. 워크플로우 계속 진행 (중단 없음)
4. Gate 7에서 일괄 승인
```

---

## 테이블 생성 (선택)

DDL 생성 후 확인:
- `[Y]` → psql 실행하여 테이블 생성
- `[N]` → DDL 파일만 보관

---

## 다음 단계

Gate 3 통과 후 → `/api-design` 실행

---

> 📖 상세 템플릿, Quality Validation, 용어 정의 원칙은 `SKILL-detail.md` 참조
