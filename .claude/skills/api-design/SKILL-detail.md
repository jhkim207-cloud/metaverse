# /api-design - 상세 가이드

> 이 문서는 필요 시 참조하는 상세 가이드입니다.

## 산출물 구조

```markdown
# API 설계서: {기능명}

## 1. API 개요

| 항목 | 값 |
|------|-----|
| Base URL | /api/v1/{domain} |
| 인증 방식 | JWT Bearer Token |
| Content-Type | application/json |

## 2. 엔드포인트 목록

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | /resources | 목록 조회 | O |
| GET | /resources/{id} | 상세 조회 | O |
| POST | /resources | 생성 | O |
| PUT | /resources/{id} | 수정 | O |
| DELETE | /resources/{id} | 삭제 | O |

## 3. 엔드포인트 상세

### 3.1 GET /resources

#### Request

**Query Parameters:**
| 파라미터 | 타입 | 필수 | 설명 | 검증 |
|----------|------|------|------|------|
| page | int | N | 페이지 번호 (기본: 0) | @Min(0) |
| size | int | N | 페이지 크기 (기본: 20) | @Min(1) @Max(100) |
| sort | string | N | 정렬 (예: name,asc) | - |

#### Response

**200 OK:**
```json
{
  "content": [
    {
      "id": 1,
      "name": "example",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "page": {
    "number": 0,
    "size": 20,
    "totalElements": 100,
    "totalPages": 5
  }
}
```

### 3.2 POST /resources

#### Request

**Request Body:**
| 필드 | 타입 | 필수 | 설명 | 검증 |
|------|------|------|------|------|
| name | string | Y | 이름 | @NotBlank @Size(max=100) |
| type | string | Y | 유형 | @NotNull |
| description | string | N | 설명 | @Size(max=500) |

**예시:**
```json
{
  "name": "example",
  "type": "TYPE_A",
  "description": "설명"
}
```

#### Response

**201 Created:**
```json
{
  "id": 1,
  "name": "example",
  "type": "TYPE_A",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## 4. DTO 정의

### 4.1 Request DTOs

```java
public record ResourceCreateRequest(
    @NotBlank @Size(max = 100) String name,
    @NotNull ResourceType type,
    @Size(max = 500) String description
) {}
```

### 4.2 Response DTOs

```java
public record ResourceResponse(
    Long id,
    String name,
    ResourceType type,
    LocalDateTime createdAt
) {}
```

## 5. 에러 코드

| 코드 | HTTP | 설명 | 대응 |
|------|------|------|------|
| VAL_001 | 400 | 필수 필드 누락 | 필드 입력 안내 |
| VAL_002 | 400 | 형식 오류 | 형식 안내 |
| AUTH_001 | 401 | 인증 실패 | 로그인 유도 |
| AUTH_002 | 403 | 권한 없음 | 권한 안내 |
| BIZ_001 | 404 | 리소스 없음 | 목록으로 이동 |
| BIZ_002 | 409 | 중복 데이터 | 수정 안내 |
| SYS_001 | 500 | 서버 오류 | 재시도 안내 |

## 6. 비즈니스 로직 흐름

### 6.1 생성 로직

```
[요청] → [검증] → [중복 확인] → [저장] → [응답]
           │           │            │
           ↓           ↓            ↓
      VAL_001/002   BIZ_002    SYS_001
```

### 6.2 수정 로직

```
[요청] → [검증] → [존재 확인] → [권한 확인] → [수정] → [응답]
           │           │            │           │
           ↓           ↓            ↓           ↓
      VAL_001/002   BIZ_001    AUTH_002    SYS_001
```
```

---

## Quality Validation

산출물 생성 후 다음 기준으로 내용 품질을 자체 검증한다.
기준 미달 시 자동 개선 후 재검증한다.

### URL 규칙 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| 소문자 사용 | 대문자 없음 | 소문자로 변경 |
| 복수형 명사 | 리소스는 복수형 | 복수형으로 변경 |
| 하이픈 사용 | 언더스코어 대신 하이픈 | 하이픈으로 변경 |
| 동사 미포함 | URL에 동사 없음 | HTTP 메서드로 표현 |

### HTTP 메서드 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| CRUD 매핑 | GET=조회, POST=생성, PUT=수정, DELETE=삭제 | 메서드 수정 |
| 멱등성 | GET/PUT/DELETE는 멱등 | 설계 수정 |
| 안전성 | GET은 부수효과 없음 | 설계 수정 |

### 에러 코드 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| 접두사 규칙 | AUTH_/VAL_/BIZ_/SYS_ | 접두사 수정 |
| HTTP 매핑 | 에러 유형과 HTTP 상태 일치 | 상태 코드 수정 |
| 대응 방안 | 모든 에러에 클라이언트 대응 명시 | 대응 추가 |

### 검증 규칙 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| 필수 필드 | @NotNull/@NotBlank 명시 | 검증 추가 |
| 길이 제한 | @Size/@Length 명시 | 검증 추가 |
| 형식 검증 | @Pattern/@Email 등 | 검증 추가 |

### 비즈니스 로직 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| 흐름도 존재 | 모든 엔드포인트에 흐름도 | 흐름도 추가 |
| 분기점 명시 | 성공/실패 분기 표시 | 분기 추가 |
| 에러 연결 | 각 분기에 에러 코드 연결 | 연결 추가 |

---

## API 설계 표준 참조

파일 위치: `docs/api-standards/API_DESIGN_GUIDE.md`

### 주요 규칙 요약

1. **URL 규칙**: 소문자, 복수형, 하이픈
2. **버전 관리**: /api/v1/...
3. **페이지네이션**: page, size 쿼리 파라미터
4. **정렬**: sort=field,direction
5. **에러 응답**: { code, message, details }
