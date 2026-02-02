# 구현 계획: {기능명}

> **생성일**: YYYY-MM-DD
> **Skill**: `/impl-plan`
> **Gate**: Gate 5
> **입력**: `02-ui-design.md`, `03-data-model.md`, `04-api-design.md`

---

## 1. 구현 개요

### 1.1 범위

| 구분 | 수량 |
|------|------|
| 신규 파일 | N개 |
| 수정 파일 | N개 |
| 삭제 파일 | N개 |
| **총계** | **N개** |

### 1.2 예상 의존성

#### 외부 라이브러리
| 라이브러리 | 버전 | 용도 |
|-----------|------|------|
| - | - | - |

#### 내부 모듈
| 모듈 | 용도 |
|------|------|
| 공통 유틸 | ... |
| 인증 모듈 | ... |

---

## 2. Phase별 구현 순서

### Phase 1: 데이터베이스 (DB)

| 순서 | 파일 | 유형 | 설명 | 의존성 |
|------|------|------|------|--------|
| 1-1 | db_dic/sql/postgres/public/table_1.sql | DDL | 테이블1 생성 | 없음 |
| 1-2 | db_dic/sql/postgres/public/table_2.sql | DDL | 테이블2 생성 | 1-1 |

---

### Phase 2: 백엔드 (Backend)

#### 2.1 Entity

| 순서 | 파일 | 유형 | 설명 | 의존성 |
|------|------|------|------|--------|
| 2-1 | backend/src/.../entity/Entity1.java | Entity | 엔티티1 | 1-1 |
| 2-2 | backend/src/.../entity/Entity2.java | Entity | 엔티티2 | 1-2, 2-1 |

#### 2.2 Repository (Mapper)

| 순서 | 파일 | 유형 | 설명 | 의존성 |
|------|------|------|------|--------|
| 2-3 | backend/src/.../mapper/Entity1Mapper.java | Mapper | Mapper 인터페이스 | 2-1 |
| 2-4 | backend/src/.../mapper/Entity1Mapper.xml | Mapper XML | MyBatis SQL | 2-3 |

#### 2.3 DTO

| 순서 | 파일 | 유형 | 설명 | 의존성 |
|------|------|------|------|--------|
| 2-5 | backend/src/.../dto/CreateRequest.java | DTO | 생성 요청 | 없음 |
| 2-6 | backend/src/.../dto/UpdateRequest.java | DTO | 수정 요청 | 없음 |
| 2-7 | backend/src/.../dto/Response.java | DTO | 응답 | 없음 |

#### 2.4 Service

| 순서 | 파일 | 유형 | 설명 | 의존성 |
|------|------|------|------|--------|
| 2-8 | backend/src/.../service/Service1.java | Service | 비즈니스 로직 | 2-3, 2-4 |

#### 2.5 Controller

| 순서 | 파일 | 유형 | 설명 | 의존성 |
|------|------|------|------|--------|
| 2-9 | backend/src/.../controller/Controller1.java | Controller | API 컨트롤러 | 2-5~2-8 |

#### 2.6 테스트

| 순서 | 파일 | 유형 | 설명 | 의존성 |
|------|------|------|------|--------|
| 2-10 | backend/src/test/.../Service1Test.java | Unit Test | 서비스 테스트 | 2-8 |
| 2-11 | backend/src/test/.../Controller1Test.java | Integration Test | 컨트롤러 테스트 | 2-9 |

---

### Phase 3: 프론트엔드 (Frontend)

#### 3.1 Types

| 순서 | 파일 | 유형 | 설명 | 의존성 |
|------|------|------|------|--------|
| 3-1 | frontend/src/types/entity.ts | Type | 타입 정의 | 없음 |

#### 3.2 API Client

| 순서 | 파일 | 유형 | 설명 | 의존성 |
|------|------|------|------|--------|
| 3-2 | frontend/src/api/entityApi.ts | API | API 클라이언트 | 3-1 |

#### 3.3 Hooks

| 순서 | 파일 | 유형 | 설명 | 의존성 |
|------|------|------|------|--------|
| 3-3 | frontend/src/hooks/useEntity.ts | Hook | 커스텀 훅 | 3-2 |

#### 3.4 Components

| 순서 | 파일 | 유형 | 설명 | 의존성 |
|------|------|------|------|--------|
| 3-4 | frontend/src/components/entity/EntityList.tsx | Component | 목록 컴포넌트 | 3-3 |
| 3-5 | frontend/src/components/entity/EntityForm.tsx | Component | 폼 컴포넌트 | 3-3 |

#### 3.5 Pages

| 순서 | 파일 | 유형 | 설명 | 의존성 |
|------|------|------|------|--------|
| 3-6 | frontend/src/pages/EntityPage.tsx | Page | 페이지 컴포넌트 | 3-4, 3-5 |

#### 3.6 테스트

| 순서 | 파일 | 유형 | 설명 | 의존성 |
|------|------|------|------|--------|
| 3-7 | frontend/src/components/entity/EntityList.test.tsx | Unit Test | 컴포넌트 테스트 | 3-4 |

---

## 3. 병렬 작업 가능 항목

다음 항목들은 서로 의존성이 없어 병렬 작업 가능:

### 그룹 A (동시 진행 가능)

- 2-5: CreateRequest.java
- 2-6: UpdateRequest.java
- 2-7: Response.java
- 3-1: entity.ts

### 그룹 B (그룹 A 완료 후)

- 2-3, 2-4: Mapper 관련
- 3-2: API 클라이언트

### 그룹 C (그룹 B 완료 후)

- 2-8: Service
- 3-3: Hook

---

## 4. 테스트 작성 시점

| 구현 파일 | 테스트 파일 | 작성 시점 |
|-----------|------------|----------|
| Service1.java | Service1Test.java | 서비스 구현 직후 |
| Controller1.java | Controller1Test.java | 컨트롤러 구현 직후 |
| EntityList.tsx | EntityList.test.tsx | 컴포넌트 구현 직후 |

---

## 5. 체크리스트

### Phase 1 완료 조건

- [ ] DDL 실행 성공
- [ ] 테이블/인덱스 생성 확인
- [ ] 데이터 삽입 테스트

### Phase 2 완료 조건

- [ ] 단위 테스트 통과
- [ ] API 테스트 통과
- [ ] Swagger/OpenAPI 문서 확인

### Phase 3 완료 조건

- [ ] 컴포넌트 테스트 통과
- [ ] 페이지 렌더링 확인
- [ ] E2E 테스트 통과 (선택적)

---

## 6. 리스크 및 의존성

| 리스크 | 영향도 | 발생 확률 | 대응 방안 |
|--------|--------|----------|----------|
| DB 마이그레이션 충돌 | 높음 | 낮음 | 마이그레이션 버전 관리 철저 |
| API 스펙 변경 | 중간 | 중간 | 프론트엔드와 동시 수정 |
| 외부 라이브러리 호환성 | 낮음 | 낮음 | 버전 고정, 테스트 |

---

## Gate 5 체크리스트

- [ ] 파일 생성 순서가 의존성에 맞게 정렬됨 (DB → Backend → Frontend)
- [ ] 테스트 코드 작성 시점이 명시됨
- [ ] 병렬 작업 가능 항목이 식별됨
