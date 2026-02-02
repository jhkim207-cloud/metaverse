# /test-design - 상세 가이드

> 이 문서는 필요 시 참조하는 상세 가이드입니다.

## 산출물 구조

```markdown
# 테스트 설계서: {기능명}

## 1. 테스트 개요

| 항목 | 값 |
|------|-----|
| 총 테스트 케이스 | XX개 |
| Happy Path | XX개 |
| Error Case | XX개 |
| Edge Case | XX개 |

## 2. Happy Path 테스트

### HP-001: {테스트 제목}

| 항목 | 내용 |
|------|------|
| 대상 | {API/컴포넌트} |
| 전제조건 | {사전 상태} |
| 입력 | {테스트 입력} |
| 예상 결과 | {기대 출력} |
| 검증 방법 | {assertion} |

### HP-002: {테스트 제목}
...

## 3. Error Case 테스트

### EC-001: {테스트 제목}

| 항목 | 내용 |
|------|------|
| 대상 | {API/컴포넌트} |
| 에러 코드 | {에러 코드} |
| 트리거 조건 | {에러 발생 조건} |
| 예상 응답 | {에러 응답} |
| UI 표현 | {사용자 메시지} |

### EC-002: {테스트 제목}
...

## 4. Edge Case 테스트

### EDGE-001: {테스트 제목}

| 항목 | 내용 |
|------|------|
| 대상 | {API/컴포넌트} |
| 요구사항 EC | {01-requirements의 EC-xxx} |
| 시나리오 | {엣지 상황 설명} |
| 입력 | {경계값/특수 입력} |
| 예상 동작 | {시스템 응답} |

### EDGE-002: {테스트 제목}
...

## 5. UI 테스트

### HP-UI-001: {테스트 제목}

| 항목 | 내용 |
|------|------|
| 화면 | {SCR-xxx} |
| 시나리오 | {사용자 행동} |
| 검증 포인트 | {UI 상태 확인} |

## 6. Fixture 데이터

### 6.1 테스트 사용자

```json
{
  "testUser": {
    "id": 1,
    "username": "test_user",
    "email": "test@example.com",
    "role": "USER"
  },
  "adminUser": {
    "id": 2,
    "username": "admin_user",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

### 6.2 테스트 데이터

```json
{
  "validInput": {
    "name": "테스트",
    "type": "TYPE_A"
  },
  "invalidInput": {
    "name": "",
    "type": null
  },
  "boundaryInput": {
    "name": "a".repeat(100),
    "type": "TYPE_A"
  }
}
```

## 7. 테스트 코드 스켈레톤

### 7.1 Backend (JUnit 5)

```java
@SpringBootTest
class {Feature}ServiceTest {

    @Autowired
    private {Feature}Service service;

    @MockBean
    private {Entity}Mapper mapper;

    @Test
    @DisplayName("HP-001: {테스트 제목}")
    void test_happyPath_001() {
        // Given

        // When

        // Then
    }

    @Test
    @DisplayName("EC-001: {테스트 제목}")
    void test_errorCase_001() {
        // Given

        // When & Then
        assertThrows(BusinessException.class, () -> {

        });
    }
}
```

### 7.2 Frontend (Vitest)

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('{Feature}Component', () => {
  it('HP-UI-001: {테스트 제목}', () => {
    // Arrange

    // Act
    render(<{Feature}Component />);

    // Assert
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
```

## 8. 테스트 커버리지 목표

| 레이어 | 최소 | 목표 |
|--------|------|------|
| Service | 80% | 90% |
| Controller | 70% | 85% |
| Components | 70% | 80% |
```

---

## Quality Validation

산출물 생성 후 다음 기준으로 내용 품질을 자체 검증한다.
기준 미달 시 자동 개선 후 재검증한다.

### Happy Path 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| 최소 개수 | ≥ API 엔드포인트 수 | 테스트 케이스 추가 |
| CRUD 커버리지 | Create/Read/Update/Delete 각 1개+ | 누락 케이스 추가 |
| 전제조건 명시 | 모든 케이스에 전제조건 | 전제조건 추가 |

### Error Case 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| 최소 개수 | ≥ 에러 코드 수 | 테스트 케이스 추가 |
| 에러 코드 매핑 | 04-api-design 에러 코드와 1:1 | 누락 케이스 추가 |
| UI 표현 명시 | 사용자 메시지 정의 | UI 표현 추가 |

### Edge Case 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| 요구사항 매핑 | 01-requirements EC와 1:1 | 누락 케이스 추가 |
| 경계값 포함 | null, empty, max, min | 경계값 케이스 추가 |
| 특수 입력 포함 | 특수문자, Unicode 등 | 특수 입력 케이스 추가 |

### Fixture 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| 테스트 사용자 | 최소 2명 (일반/관리자) | 사용자 추가 |
| 유효 데이터 | 정상 케이스용 데이터 | 데이터 추가 |
| 무효 데이터 | 에러 케이스용 데이터 | 데이터 추가 |
| 경계 데이터 | Edge 케이스용 데이터 | 데이터 추가 |

---

## 테스트 ID 네이밍 규칙

| 접두사 | 용도 | 예시 |
|--------|------|------|
| HP-xxx | Happy Path (API/Service) | HP-001, HP-002 |
| EC-xxx | Error Case | EC-001, EC-002 |
| EDGE-xxx | Edge Case | EDGE-001, EDGE-002 |
| HP-UI-xxx | UI Happy Path | HP-UI-001 |
| EC-UI-xxx | UI Error Case | EC-UI-001 |

---

## 테스트 우선순위

| 우선순위 | 대상 | 이유 |
|----------|------|------|
| P1 (필수) | Happy Path 전체 | 기본 기능 검증 |
| P1 (필수) | Critical Error Case | 핵심 에러 처리 |
| P2 (권장) | 모든 Error Case | 안정성 보장 |
| P2 (권장) | Edge Case | 경계 조건 검증 |
| P3 (선택) | UI 상세 테스트 | UX 검증 |
