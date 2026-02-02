# API 설계: {기능명}

> **생성일**: YYYY-MM-DD
> **Skill**: `/api-design`
> **Gate**: Gate 4
> **입력**: `00-research.md`, `01-requirements.md`, `03-data-model.md`
> **참조**: `docs/api-standards/API_DESIGN_GUIDE.md`

---

## 1. API 엔드포인트 목록

| Method | Endpoint | 설명 | 인증 | 권한 |
|--------|----------|------|------|------|
| GET | /api/v1/{resources} | 목록 조회 | Required | USER |
| GET | /api/v1/{resources}/{id} | 상세 조회 | Required | USER |
| POST | /api/v1/{resources} | 생성 | Required | ADMIN |
| PUT | /api/v1/{resources}/{id} | 수정 | Required | ADMIN |
| DELETE | /api/v1/{resources}/{id} | 삭제 | Required | ADMIN |

---

## 2. API 상세 명세

### 2.1 GET /api/v1/{resources}

#### 설명
리소스 목록을 페이징하여 조회합니다.

#### Query Parameters

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| page | int | N | 0 | 페이지 번호 (0부터 시작) |
| size | int | N | 20 | 페이지 크기 (최대 100) |
| sort | string | N | createdAt,desc | 정렬 기준 |
| status | string | N | - | 상태 필터 |
| search | string | N | - | 검색어 |

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "field1": "value1",
        "field2": "value2",
        "status": "ACTIVE",
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 100,
    "totalPages": 5
  }
}
```

#### Error Codes

| 코드 | HTTP | 메시지 |
|------|------|--------|
| AUTH_001 | 401 | 인증이 필요합니다 |
| AUTH_002 | 403 | 권한이 없습니다 |

---

### 2.2 GET /api/v1/{resources}/{id}

#### 설명
특정 리소스의 상세 정보를 조회합니다.

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| id | long | Y | 리소스 ID |

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "field1": "value1",
    "field2": "value2",
    "status": "ACTIVE",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

#### Error Codes

| 코드 | HTTP | 메시지 |
|------|------|--------|
| BIZ_002 | 404 | 리소스를 찾을 수 없습니다 |

---

### 2.3 POST /api/v1/{resources}

#### 설명
새로운 리소스를 생성합니다.

#### Request Body

```json
{
  "field1": "value1",
  "field2": "value2"
}
```

#### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "field1": "value1",
    "field2": "value2",
    "status": "ACTIVE",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

#### Error Codes

| 코드 | HTTP | 메시지 |
|------|------|--------|
| VAL_001 | 400 | 필드1 형식이 올바르지 않습니다 |
| VAL_002 | 400 | 필드2는 필수입니다 |
| BIZ_001 | 409 | 이미 등록된 데이터입니다 |

---

### 2.4 PUT /api/v1/{resources}/{id}

#### 설명
기존 리소스를 수정합니다.

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| id | long | Y | 리소스 ID |

#### Request Body

```json
{
  "field1": "updated_value1",
  "field2": "updated_value2"
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "field1": "updated_value1",
    "field2": "updated_value2",
    "status": "ACTIVE",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### 2.5 DELETE /api/v1/{resources}/{id}

#### 설명
리소스를 삭제합니다. (소프트 삭제)

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| id | long | Y | 리소스 ID |

#### Response (204 No Content)

```
(빈 응답)
```

---

## 3. DTO 정의

### 3.1 Request DTOs

#### CreateRequest

```java
public record CreateRequest(
    @NotBlank(message = "필드1은 필수입니다")
    @Size(max = 255, message = "필드1은 255자 이하여야 합니다")
    String field1,

    @NotBlank(message = "필드2는 필수입니다")
    @Size(max = 100, message = "필드2는 100자 이하여야 합니다")
    String field2
) {}
```

| 필드 | 타입 | 검증 규칙 | 설명 |
|------|------|----------|------|
| field1 | String | @NotBlank @Size(max=255) | 필드1 |
| field2 | String | @NotBlank @Size(max=100) | 필드2 |

#### UpdateRequest

```java
public record UpdateRequest(
    @Size(max = 255)
    String field1,

    @Size(max = 100)
    String field2
) {}
```

### 3.2 Response DTOs

#### ResourceResponse

```java
public record ResourceResponse(
    Long id,
    String field1,
    String field2,
    String status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| id | Long | 리소스 ID |
| field1 | String | 필드1 |
| field2 | String | 필드2 |
| status | String | 상태 |
| createdAt | LocalDateTime | 생성일시 |
| updatedAt | LocalDateTime | 수정일시 |

---

## 4. 에러 코드 체계

### 4.1 코드 패턴

| 접두사 | 설명 | HTTP 코드 |
|--------|------|----------|
| AUTH_ | 인증/인가 오류 | 401, 403 |
| VAL_ | 입력값 검증 오류 | 400 |
| BIZ_ | 비즈니스 로직 오류 | 404, 409, 422 |
| SYS_ | 시스템 오류 | 500, 503 |

### 4.2 에러 코드 목록

| 코드 | HTTP | 메시지 | 설명 |
|------|------|--------|------|
| AUTH_001 | 401 | 인증이 필요합니다 | 토큰 없음/만료 |
| AUTH_002 | 403 | 권한이 없습니다 | 권한 부족 |
| VAL_001 | 400 | 필드1 형식이 올바르지 않습니다 | 입력값 형식 오류 |
| VAL_002 | 400 | 필드2는 필수입니다 | 필수 값 누락 |
| BIZ_001 | 409 | 이미 등록된 데이터입니다 | 중복 데이터 |
| BIZ_002 | 404 | 리소스를 찾을 수 없습니다 | 데이터 없음 |
| SYS_001 | 500 | 서버 오류가 발생했습니다 | 예기치 않은 오류 |

---

## 5. 비즈니스 로직 흐름

### 5.1 생성 (POST)

```
[요청 수신]
    ↓
[입력값 검증] → 실패 → VAL_XXX 에러 반환
    ↓ 성공
[중복 확인] → 중복 → BIZ_001 에러 반환
    ↓ 미중복
[데이터 저장]
    ↓
[이벤트 발행] (선택적)
    ↓
[응답 반환: 201 Created]
```

#### 상세 로직:
1. 요청 DTO 유효성 검증 (@Valid)
2. 중복 체크: `repository.existsByField1(field1)`
3. 엔티티 생성 및 저장
4. 도메인 이벤트 발행 (옵션)
5. Response DTO 변환 및 반환

### 5.2 수정 (PUT)

```
[요청 수신]
    ↓
[엔티티 조회] → 없음 → BIZ_002 에러 반환
    ↓ 있음
[입력값 검증] → 실패 → VAL_XXX 에러 반환
    ↓ 성공
[데이터 업데이트]
    ↓
[응답 반환: 200 OK]
```

---

## 6. 보안 고려사항

### 6.1 인증

- **방식**: JWT 토큰 기반 인증
- **헤더**: `Authorization: Bearer {token}`
- **만료 시간**: Access Token 15분, Refresh Token 7일

### 6.2 인가

- **방식**: Role-Based Access Control (RBAC)
- **역할**:
  - ADMIN: 모든 권한
  - USER: 조회 권한
  - GUEST: 제한된 조회 권한

### 6.3 입력값 검증

- 모든 입력값 서버 사이드 검증
- SQL Injection 방지: PreparedStatement 사용
- XSS 방지: HTML 이스케이프 처리

---

## Gate 4 체크리스트

- [ ] [자동] URL이 소문자, 복수형, 하이픈 규칙 준수
- [ ] [자동] HTTP 메서드가 CRUD 패턴과 일치
- [ ] [자동] 에러 코드가 AUTH_/VAL_/BIZ_/SYS_ 패턴 준수
- [ ] [수동] 모든 필드에 검증 규칙(@Valid 어노테이션) 정의됨
- [ ] [수동] 비즈니스 로직 흐름이 단계별로 기술됨
