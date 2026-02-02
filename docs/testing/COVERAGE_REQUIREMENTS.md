# 테스트 커버리지 요구사항

## 1. 커버리지 목표

| 레이어 | 최소 커버리지 | 목표 커버리지 | 비고 |
|--------|-------------|--------------|------|
| Service (비즈니스 로직) | 80% | 90% | 핵심 비즈니스 로직 |
| Controller (API) | 70% | 85% | API 엔드포인트 |
| Repository (DB) | 60% | 75% | 데이터 접근 |
| Frontend Components | 70% | 80% | UI 컴포넌트 |
| Utils/Helpers | 90% | 95% | 유틸리티 함수 |

---

## 2. 필수 테스트 시나리오

### 모든 코드에 적용

| 시나리오 | 설명 | 예시 |
|----------|------|------|
| Happy Path | 정상 흐름 | 유효한 입력으로 성공 |
| Edge Cases | 경계값 | null, 빈 문자열, 최대값 |
| Error Handling | 예외 처리 | 잘못된 입력, 시스템 오류 |
| Security | 인증/인가 | 미인증, 권한 부족 |

### Service Layer 필수 테스트

```java
// 필수 테스트 시나리오
- create_ValidInput_Success
- create_InvalidInput_ThrowsValidationException
- create_DuplicateData_ThrowsBizException
- findById_Exists_ReturnsEntity
- findById_NotFound_ThrowsNotFoundException
- update_ValidInput_Success
- update_NotFound_ThrowsNotFoundException
- delete_Exists_Success
- delete_NotFound_ThrowsNotFoundException
```

### Controller Layer 필수 테스트

```java
// 필수 테스트 시나리오
- POST_ValidInput_Returns201Created
- POST_InvalidInput_Returns400BadRequest
- GET_Exists_Returns200OK
- GET_NotFound_Returns404NotFound
- PUT_ValidInput_Returns200OK
- DELETE_Exists_Returns204NoContent
- ANY_Unauthorized_Returns401
- ANY_Forbidden_Returns403
```

---

## 3. 커버리지 제외 대상

### 제외 가능 항목

| 항목 | 이유 |
|------|------|
| DTO/Model | 단순 데이터 클래스 |
| Configuration | 설정 클래스 |
| Generated Code | 자동 생성 코드 |
| Main Application | 진입점 클래스 |

### JaCoCo 설정

```xml
<!-- pom.xml -->
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <configuration>
        <excludes>
            <exclude>**/dto/**</exclude>
            <exclude>**/model/**</exclude>
            <exclude>**/config/**</exclude>
            <exclude>**/*Application.class</exclude>
        </excludes>
    </configuration>
</plugin>
```

### Vitest 설정

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      exclude: [
        'src/types/**',
        'src/main.tsx',
        'src/**/*.d.ts',
      ],
    },
  },
});
```

---

## 4. 커버리지 측정 도구

### Backend (JaCoCo)

```bash
# 테스트 실행 및 커버리지 측정
./mvnw clean verify

# 리포트 위치
target/site/jacoco/index.html
```

### Frontend (Vitest)

```bash
# 테스트 실행 및 커버리지 측정
npm run test:coverage

# 리포트 위치
coverage/index.html
```

---

## 5. CI/CD 커버리지 게이트

### GitHub Actions

```yaml
# .github/workflows/test.yml
- name: Run tests with coverage
  run: ./mvnw clean verify

- name: Check coverage threshold
  run: |
    COVERAGE=$(grep -oP '(?<=<counter type="LINE" missed=")[0-9]+' target/site/jacoco/jacoco.xml | head -1)
    if [ "$COVERAGE" -lt 80 ]; then
      echo "Coverage is below 80%"
      exit 1
    fi
```

### SonarQube 연동

```yaml
- name: SonarQube Scan
  uses: SonarSource/sonarqube-scan-action@master
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

---

## 6. 커버리지 리포트 예시

### 요약 리포트

```
=== Coverage Summary ===

Package                              Coverage
─────────────────────────────────────────────
com.biz.management.service           87.5%
com.biz.management.controller        82.3%
com.biz.management.repository        71.2%
com.biz.management.util              94.1%
─────────────────────────────────────────────
TOTAL                                83.7%

Status: PASSED (Minimum: 80%)
```

### 상세 리포트

| 클래스 | Line | Branch | 상태 |
|--------|------|--------|------|
| UserService | 92% | 88% | ✅ |
| OrderService | 85% | 80% | ✅ |
| AuthService | 78% | 75% | ⚠️ |
| PaymentService | 65% | 60% | ❌ |

---

## 7. 커버리지 개선 가이드

### 낮은 커버리지 원인

| 원인 | 해결 방법 |
|------|----------|
| 테스트 미작성 | 누락된 테스트 케이스 추가 |
| 복잡한 분기 | 분기별 테스트 케이스 추가 |
| 예외 처리 미테스트 | 예외 발생 시나리오 테스트 |
| Dead Code | 사용하지 않는 코드 제거 |

### 우선순위

1. 비즈니스 핵심 로직 (Service)
2. 외부 노출 API (Controller)
3. 복잡한 유틸리티 함수 (Utils)
4. 데이터 접근 로직 (Repository)

---

## 8. 팀 가이드라인

### PR 머지 조건

- [ ] 전체 커버리지 80% 이상 유지
- [ ] 새로 추가된 코드 커버리지 80% 이상
- [ ] 핵심 비즈니스 로직 테스트 포함
- [ ] 모든 테스트 통과

### 리뷰 체크리스트

- [ ] Happy Path 테스트 있음
- [ ] Edge Case 테스트 있음
- [ ] Error Handling 테스트 있음
- [ ] 테스트 이름이 명확함
- [ ] Mock 사용이 적절함
