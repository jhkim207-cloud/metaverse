# /impl-plan - 상세 가이드

> 이 문서는 필요 시 참조하는 상세 가이드입니다.

## 산출물 구조

```markdown
# 구현 계획서: {기능명}

## 1. 구현 개요

| 항목 | 값 |
|------|-----|
| 총 파일 수 | XX개 |
| Backend | XX개 |
| Frontend | XX개 |
| 테스트 | XX개 |

## 2. Phase별 구현 순서

### Phase 1: 데이터베이스

| 순서 | 파일 | 유형 | 의존성 | 병렬 가능 |
|------|------|------|--------|----------|
| 1.1 | {table}.sql | DDL | - | Y |
| 1.2 | {table2}.sql | DDL | 1.1 (FK) | N |

### Phase 2: Backend

| 순서 | 파일 | 유형 | 의존성 | 병렬 가능 |
|------|------|------|--------|----------|
| 2.1 | {Entity}.java | Entity | Phase 1 | Y |
| 2.2 | {Entity}Mapper.java | Mapper | 2.1 | N |
| 2.3 | {Entity}Mapper.xml | SQL | 2.2 | N |
| 2.4 | {Feature}Service.java | Service | 2.2, 2.3 | N |
| 2.5 | {Dto}Request.java | DTO | - | Y (with 2.1) |
| 2.6 | {Dto}Response.java | DTO | - | Y (with 2.5) |
| 2.7 | {Feature}Controller.java | Controller | 2.4, 2.5, 2.6 | N |
| 2.8 | {Feature}ServiceTest.java | Test | 2.4 | N |
| 2.9 | {Feature}ControllerTest.java | Test | 2.7 | N |

### Phase 3: Frontend

| 순서 | 파일 | 유형 | 의존성 | 병렬 가능 |
|------|------|------|--------|----------|
| 3.1 | types/{feature}.ts | Type | Phase 2 API 완료 | Y |
| 3.2 | services/{feature}Api.ts | API | 3.1 | N |
| 3.3 | hooks/use{Feature}.ts | Hook | 3.2 | N |
| 3.4 | components/{Feature}List.tsx | Component | 3.1, 3.3 | Y |
| 3.5 | components/{Feature}Form.tsx | Component | 3.1, 3.3 | Y (with 3.4) |
| 3.6 | pages/{feature}/index.tsx | Page | 3.4 | N |
| 3.7 | pages/{feature}/[id].tsx | Page | 3.5 | N |
| 3.8 | {Feature}.test.tsx | Test | 3.4, 3.5 | N |

## 3. 파일 상세 명세

### 3.1 Backend 파일

| 파일 경로 | 클래스/인터페이스 | 주요 메서드 |
|----------|------------------|-------------|
| entity/{Entity}.java | {Entity} | - |
| mapper/{Entity}Mapper.java | {Entity}Mapper | findById, findAll, insert, update, delete |
| service/{Feature}Service.java | {Feature}Service | getList, getById, create, update, delete |
| controller/{Feature}Controller.java | {Feature}Controller | GET, POST, PUT, DELETE |

### 3.2 Frontend 파일

| 파일 경로 | Export | 주요 기능 |
|----------|--------|----------|
| types/{feature}.ts | {Feature}, {Feature}Request | 타입 정의 |
| services/{feature}Api.ts | {feature}Api | API 호출 함수 |
| hooks/use{Feature}.ts | use{Feature} | 상태 관리, API 연동 |

## 4. 의존성 그래프

```
[DDL] ──────────────────────────────────────────────┐
   └──> [Entity] ──> [Mapper] ──> [Service] ──> [Controller]
                                      │
[Types] <─────────────────────────────┘
   └──> [API Service] ──> [Hooks] ──> [Components] ──> [Pages]
```

## 5. 병렬 작업 그룹

### Group A (병렬 가능)
- Entity 생성
- DTO Request/Response 생성
- Frontend Types 생성

### Group B (순차 필요)
- Mapper → Service → Controller
- API Service → Hooks → Components → Pages

## 6. 테스트 작성 시점

| 대상 | 테스트 작성 시점 | 테스트 유형 |
|------|-----------------|-------------|
| Service | Service 구현 직후 | Unit Test |
| Controller | Controller 구현 직후 | Integration Test |
| Components | Component 구현 직후 | Component Test |
| Pages | 전체 완료 후 | E2E Test |

## 7. 체크포인트

| Phase | 체크포인트 | 검증 방법 |
|-------|-----------|----------|
| Phase 1 | DDL 실행 | psql 실행 |
| Phase 2 | Backend 빌드 | ./gradlew build |
| Phase 3 | Frontend 빌드 | npm run build |
| 통합 | API 연동 | 수동 테스트 |
```

---

## Quality Validation

산출물 생성 후 다음 기준으로 내용 품질을 자체 검증한다.
기준 미달 시 자동 개선 후 재검증한다.

### 의존성 순서 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| Phase 순서 | DB → Backend → Frontend | 순서 재정렬 |
| Backend 순서 | Entity → Mapper → Service → Controller | 순서 재정렬 |
| Frontend 순서 | Types → API → Hooks → Components → Pages | 순서 재정렬 |
| FK 의존성 | 참조 테이블 먼저 생성 | 순서 조정 |

### 순환 의존성 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| 순환 참조 없음 | A→B→C→A 형태 없음 | 의존성 재설계 |
| 상호 의존 없음 | A↔B 형태 없음 | 공통 모듈 추출 |

### 테스트 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| 테스트 파일 존재 | 각 주요 파일에 테스트 대응 | 테스트 파일 추가 |
| 테스트 시점 명시 | "구현 직후" 명시 | 시점 추가 |

### 병렬 작업 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| 병렬 가능 식별 | 의존성 없는 작업 그룹화 | 그룹 재정의 |
| 그룹 명시 | 병렬 그룹 문서화 | 그룹 섹션 추가 |

---

## 파일 네이밍 규칙

### Backend (Java)

| 유형 | 네이밍 | 예시 |
|------|--------|------|
| Entity | PascalCase | Notification.java |
| Mapper | {Entity}Mapper | NotificationMapper.java |
| Service | {Feature}Service | NotificationService.java |
| Controller | {Feature}Controller | NotificationController.java |
| DTO | {Action}{Entity}Request/Response | CreateNotificationRequest.java |
| Test | {Class}Test | NotificationServiceTest.java |

### Frontend (TypeScript)

| 유형 | 네이밍 | 예시 |
|------|--------|------|
| Types | camelCase.ts | notification.ts |
| API | {feature}Api.ts | notificationApi.ts |
| Hooks | use{Feature}.ts | useNotification.ts |
| Components | {Feature}{Type}.tsx | NotificationList.tsx |
| Pages | kebab-case/ | notifications/index.tsx |
| Test | {Component}.test.tsx | NotificationList.test.tsx |
