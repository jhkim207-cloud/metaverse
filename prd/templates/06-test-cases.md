# 테스트 케이스 설계: {기능명}

> **생성일**: YYYY-MM-DD
> **Skill**: `/test-design`
> **Gate**: Gate 6
> **입력**: `01-requirements.md`, `04-api-design.md`
> **참조**: `docs/testing/TEST_STRATEGY.md`

---

## 1. 테스트 범위 요약

| 카테고리 | 테스트 수 | 커버리지 목표 |
|----------|----------|--------------|
| Happy Path | N개 | 100% |
| Error Case | N개 | 100% |
| Edge Case | N개 | 100% |
| **총계** | **N개** | **80%+** |

---

## 2. Happy Path 테스트

### 2.1 API 테스트

| ID | 테스트명 | 엔드포인트 | 시나리오 | 예상 결과 |
|----|----------|-----------|----------|----------|
| HP-001 | 목록 조회 성공 | GET /api/v1/{resources} | 인증된 사용자가 목록 조회 | 200 OK, 페이지네이션 데이터 |
| HP-002 | 상세 조회 성공 | GET /api/v1/{resources}/{id} | 존재하는 ID로 조회 | 200 OK, 상세 데이터 |
| HP-003 | 생성 성공 | POST /api/v1/{resources} | 유효한 데이터로 생성 | 201 Created |
| HP-004 | 수정 성공 | PUT /api/v1/{resources}/{id} | 유효한 데이터로 수정 | 200 OK |
| HP-005 | 삭제 성공 | DELETE /api/v1/{resources}/{id} | 존재하는 ID 삭제 | 204 No Content |

### 2.2 UI 테스트

| ID | 테스트명 | 화면 | 시나리오 | 예상 결과 |
|----|----------|------|----------|----------|
| HP-UI-001 | 목록 페이지 렌더링 | ListPage | 페이지 로드 시 | 테이블 렌더링, 데이터 표시 |
| HP-UI-002 | 생성 폼 제출 | CreateForm | 유효한 데이터 입력 후 제출 | 성공 토스트, 목록 갱신 |
| HP-UI-003 | 수정 폼 제출 | EditForm | 데이터 수정 후 제출 | 성공 토스트, 데이터 갱신 |
| HP-UI-004 | 삭제 확인 | ListPage | 삭제 버튼 클릭, 확인 | 항목 제거, 토스트 표시 |

---

## 3. Error Case 테스트

### 3.1 인증/인가 에러

| ID | 테스트명 | 에러 코드 | 시나리오 | 예상 결과 |
|----|----------|----------|----------|----------|
| EC-001 | 인증 없이 접근 | AUTH_001 | 토큰 없이 API 호출 | 401 Unauthorized |
| EC-002 | 만료된 토큰 | AUTH_001 | 만료된 토큰으로 API 호출 | 401 Unauthorized |
| EC-003 | 권한 부족 | AUTH_002 | USER 역할로 ADMIN API 호출 | 403 Forbidden |

### 3.2 입력값 검증 에러

| ID | 테스트명 | 에러 코드 | 시나리오 | 예상 결과 |
|----|----------|----------|----------|----------|
| EC-004 | 필수값 누락 | VAL_002 | 필수 필드 없이 생성 요청 | 400 Bad Request |
| EC-005 | 형식 오류 | VAL_001 | 잘못된 형식으로 요청 | 400 Bad Request |
| EC-006 | 길이 초과 | VAL_003 | 최대 길이 초과 입력 | 400 Bad Request |

### 3.3 비즈니스 로직 에러

| ID | 테스트명 | 에러 코드 | 시나리오 | 예상 결과 |
|----|----------|----------|----------|----------|
| EC-007 | 중복 데이터 | BIZ_001 | 이미 존재하는 데이터 생성 | 409 Conflict |
| EC-008 | 리소스 없음 | BIZ_002 | 존재하지 않는 ID 조회 | 404 Not Found |
| EC-009 | 상태 불일치 | BIZ_003 | 비활성 상태에서 작업 시도 | 422 Unprocessable Entity |

---

## 4. Edge Case 테스트

### 4.1 요구사항 Edge Case 매핑

| 요구사항 EC | 테스트 ID | 시나리오 | 예상 결과 |
|------------|----------|----------|----------|
| EC-001 (요구사항) | EDGE-001 | 빈 목록 조회 | 빈 배열 반환, EmptyState 표시 |
| EC-002 (요구사항) | EDGE-002 | 최대 길이 입력 | 정상 처리 |
| EC-003 (요구사항) | EDGE-003 | 특수문자 포함 입력 | 정상 처리 또는 적절한 에러 |

### 4.2 경계값 테스트

| ID | 테스트명 | 입력값 | 예상 결과 |
|----|----------|--------|----------|
| EDGE-004 | 최소 페이지 크기 | size=1 | 1개 항목 반환 |
| EDGE-005 | 최대 페이지 크기 | size=100 | 100개 항목 반환 |
| EDGE-006 | 초과 페이지 크기 | size=101 | 100개로 제한 또는 에러 |
| EDGE-007 | 음수 페이지 | page=-1 | 400 Bad Request |
| EDGE-008 | 빈 문자열 검색 | search="" | 전체 목록 반환 |
| EDGE-009 | 공백만 입력 | field="   " | 검증 에러 |

### 4.3 동시성 테스트

| ID | 테스트명 | 시나리오 | 예상 결과 |
|----|----------|----------|----------|
| EDGE-010 | 동시 수정 | 같은 리소스 동시 수정 | 낙관적 락 에러 또는 마지막 승리 |
| EDGE-011 | 동시 삭제 | 같은 리소스 동시 삭제 | 첫 요청 성공, 이후 404 |

---

## 5. Fixture 데이터

### 5.1 테스트 데이터

```json
{
  "entities": [
    {
      "id": 1,
      "field1": "test-value-1",
      "field2": "description-1",
      "status": "ACTIVE",
      "createdAt": "2025-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "field1": "test-value-2",
      "field2": "description-2",
      "status": "ACTIVE",
      "createdAt": "2025-01-02T00:00:00Z"
    },
    {
      "id": 3,
      "field1": "inactive-value",
      "field2": "inactive-desc",
      "status": "INACTIVE",
      "createdAt": "2025-01-03T00:00:00Z"
    }
  ]
}
```

### 5.2 테스트 사용자 및 토큰

```json
{
  "users": {
    "admin": {
      "id": 1,
      "email": "admin@test.com",
      "role": "ADMIN"
    },
    "user": {
      "id": 2,
      "email": "user@test.com",
      "role": "USER"
    }
  },
  "tokens": {
    "admin": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...(ADMIN)",
    "user": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...(USER)",
    "expired": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...(만료됨)"
  }
}
```

### 5.3 Mock 응답 데이터

```json
{
  "mockResponses": {
    "listSuccess": {
      "success": true,
      "data": {
        "content": [...],
        "page": 0,
        "size": 20,
        "totalElements": 3,
        "totalPages": 1
      }
    },
    "listEmpty": {
      "success": true,
      "data": {
        "content": [],
        "page": 0,
        "size": 20,
        "totalElements": 0,
        "totalPages": 0
      }
    }
  }
}
```

---

## 6. 테스트 코드 스켈레톤

### 6.1 Backend (JUnit 5)

```java
@SpringBootTest
@AutoConfigureMockMvc
class EntityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("HP-001: 목록 조회 성공 - 인증된 사용자")
    void shouldReturnListWhenAuthenticated() throws Exception {
        // Given
        String token = "valid-jwt-token";

        // When & Then
        mockMvc.perform(get("/api/v1/entities")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    @DisplayName("EC-001: 인증 없이 접근 시 401 반환")
    void shouldReturn401WhenNoAuthentication() throws Exception {
        // Given (no token)

        // When & Then
        mockMvc.perform(get("/api/v1/entities"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.code").value("AUTH_001"));
    }

    @Test
    @DisplayName("EDGE-001: 빈 목록 조회 시 빈 배열 반환")
    void shouldReturnEmptyArrayWhenNoData() throws Exception {
        // Given
        // ... 데이터 없는 상태 설정

        // When & Then
        mockMvc.perform(get("/api/v1/entities")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.content").isEmpty());
    }
}
```

### 6.2 Frontend (Vitest)

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EntityList } from './EntityList';

describe('EntityList', () => {
  it('HP-UI-001: 목록 페이지가 정상 렌더링된다', async () => {
    // Arrange
    const mockData = [...];
    vi.mocked(fetchEntities).mockResolvedValue(mockData);

    // Act
    render(<EntityList />);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(mockData.length + 1); // +1 for header
    });
  });

  it('EDGE-001: 빈 목록일 때 EmptyState를 표시한다', async () => {
    // Arrange
    vi.mocked(fetchEntities).mockResolvedValue([]);

    // Act
    render(<EntityList />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('등록된 데이터가 없습니다')).toBeInTheDocument();
    });
  });
});
```

---

## 7. 커버리지 분석

| 항목 | 테스트 수 | 대상 수 | 커버리지 |
|------|----------|--------|----------|
| API 엔드포인트 | 5 | 5 | 100% |
| 에러 코드 | 9 | 9 | 100% |
| 요구사항 Edge Case | 3 | 3 | 100% |
| 경계값 | 6 | 6 | 100% |
| UI 컴포넌트 | 4 | 5 | 80% |
| **전체** | **27** | **28** | **96%** |

---

## Gate 6 체크리스트

- [ ] [자동] Happy Path 테스트 수 >= API 엔드포인트 수
- [ ] [자동] Error Case 테스트 수 >= 에러 코드 수
- [ ] [수동] Edge Case 테스트가 요구사항의 Edge Case와 1:1 매핑
- [ ] [수동] Fixture 데이터가 정의됨
