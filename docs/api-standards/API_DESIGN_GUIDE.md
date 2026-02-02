# API 설계 가이드

## 1. URL 명명 규칙

### 올바른 예시

```
GET    /api/v1/users
GET    /api/v1/users/{id}
GET    /api/v1/users/{id}/orders
POST   /api/v1/users
PUT    /api/v1/users/{id}
DELETE /api/v1/users/{id}
```

### 잘못된 예시

```
GET    /api/v1/getUsers        # 동사 사용 금지
POST   /api/v1/user/create     # CRUD 동사 금지
GET    /api/v1/user_orders     # 언더스코어 금지
```

### 규칙 요약

| 규칙 | 설명 |
|------|------|
| 소문자 사용 | `/api/v1/users` (O), `/api/v1/Users` (X) |
| 복수형 사용 | `/users` (O), `/user` (X) |
| 하이픈 사용 | `/user-profiles` (O), `/user_profiles` (X) |
| 동사 금지 | `/users` (O), `/getUsers` (X) |
| 버전 포함 | `/api/v1/...` |

---

## 2. HTTP 메서드 표준

| 메서드 | 용도 | 멱등성 | 안전성 |
|--------|------|--------|--------|
| GET | 조회 | O | O |
| POST | 생성 | X | X |
| PUT | 전체 수정 | O | X |
| PATCH | 부분 수정 | X | X |
| DELETE | 삭제 | O | X |

---

## 3. HTTP 상태 코드 표준

| 상태 코드 | 의미 | 사용 시점 |
|----------|------|----------|
| 200 | OK | GET/PUT/PATCH 성공 |
| 201 | Created | POST로 생성 성공 |
| 204 | No Content | DELETE 성공 |
| 400 | Bad Request | 입력값 오류 |
| 401 | Unauthorized | 인증 필요 |
| 403 | Forbidden | 권한 없음 |
| 404 | Not Found | 리소스 없음 |
| 409 | Conflict | 중복/충돌 |
| 422 | Unprocessable Entity | 비즈니스 로직 오류 |
| 500 | Internal Server Error | 서버 오류 |

---

## 4. 응답 형식 표준화

### 성공 응답

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "홍길동",
    "email": "hong@example.com"
  }
}
```

### 성공 응답 (목록 + 페이징)

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "홍길동" },
    { "id": 2, "name": "김철수" }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 100,
    "totalPages": 5
  }
}
```

### 에러 응답

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값이 올바르지 않습니다.",
    "details": [
      {
        "field": "email",
        "message": "유효한 이메일 형식이 아닙니다."
      }
    ],
    "traceId": "abc-123-xyz"
  }
}
```

---

## 5. 페이징 파라미터

### 요청

```
GET /api/v1/users?page=1&size=20&sort=createdAt,desc
```

| 파라미터 | 설명 | 기본값 |
|----------|------|--------|
| page | 페이지 번호 (1부터 시작) | 1 |
| size | 페이지당 항목 수 | 20 |
| sort | 정렬 기준 (필드,방향) | id,asc |

### 응답 메타데이터

```json
{
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

## 6. 필터링 및 검색

### 단순 필터

```
GET /api/v1/users?status=ACTIVE&role=ADMIN
```

### 범위 필터

```
GET /api/v1/orders?createdAtFrom=2025-01-01&createdAtTo=2025-01-31
```

### 검색

```
GET /api/v1/users?q=홍길동
GET /api/v1/users?search=hong@example.com
```

---

## 7. 날짜/시간 형식

| 형식 | 예시 | 용도 |
|------|------|------|
| ISO 8601 | `2025-01-31T09:30:00Z` | API 표준 |
| Date only | `2025-01-31` | 날짜만 필요 시 |
| Unix timestamp | `1706693400` | 레거시 호환 |

**권장**: ISO 8601 형식 (타임존 포함)

---

## 8. API 버전 관리

### URL Path 방식 (권장)

```
/api/v1/users
/api/v2/users
```

### 버전 업그레이드 규칙

| 변경 유형 | 버전 업그레이드 |
|----------|----------------|
| 필드 추가 | 불필요 (하위 호환) |
| 필드 삭제 | 필수 (Major) |
| 필드명 변경 | 필수 (Major) |
| 응답 구조 변경 | 필수 (Major) |

---

## 9. 에러 코드 체계

### 코드 구조

```
{카테고리}_{번호}
```

### 카테고리 정의

| 카테고리 | 설명 | 예시 |
|----------|------|------|
| AUTH | 인증/인가 | AUTH_001 |
| VAL | 유효성 검증 | VAL_001 |
| BIZ | 비즈니스 로직 | BIZ_001 |
| SYS | 시스템 오류 | SYS_001 |

### 에러 코드 목록

```java
public enum ErrorCode {
    // 인증/인가
    AUTH_INVALID_TOKEN("AUTH_001", "유효하지 않은 토큰"),
    AUTH_EXPIRED_TOKEN("AUTH_002", "만료된 토큰"),
    AUTH_FORBIDDEN("AUTH_003", "접근 권한 없음"),

    // 유효성 검증
    VAL_REQUIRED("VAL_001", "필수 입력값 누락"),
    VAL_FORMAT("VAL_002", "입력 형식 오류"),

    // 비즈니스 로직
    BIZ_DUPLICATE("BIZ_001", "중복된 데이터"),
    BIZ_NOT_FOUND("BIZ_002", "데이터를 찾을 수 없음"),
    BIZ_INVALID_STATE("BIZ_003", "잘못된 상태 전이"),

    // 시스템
    SYS_DATABASE("SYS_001", "데이터베이스 오류"),
    SYS_EXTERNAL_API("SYS_002", "외부 API 호출 실패"),
    SYS_UNKNOWN("SYS_999", "알 수 없는 오류");
}
```
