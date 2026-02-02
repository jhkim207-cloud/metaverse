# 테스트 전략 가이드

## 1. 테스트 피라미드

```
                    ┌─────────┐
                    │   E2E   │  5%  (Playwright)
                   ─┼─────────┼─
                   │Integration│ 15% (API/DB 통합)
                  ─┼───────────┼─
                  │    Unit    │ 80% (JUnit/Vitest)
                 ─┴─────────────┴─
```

| 레벨 | 비율 | 속도 | 비용 | 도구 |
|------|------|------|------|------|
| Unit | 80% | 빠름 | 낮음 | JUnit 5, Vitest |
| Integration | 15% | 중간 | 중간 | TestContainers, MSW |
| E2E | 5% | 느림 | 높음 | Playwright |

---

## 2. 테스트 디렉토리 구조

### Backend

```
backend/
└── src/test/java/com/biz/management/
    ├── unit/                    # 단위 테스트
    │   ├── service/
    │   │   └── UserServiceTest.java
    │   └── util/
    │       └── DateUtilsTest.java
    ├── integration/             # 통합 테스트
    │   ├── api/
    │   │   └── UserApiTest.java
    │   └── repository/
    │       └── UserMapperTest.java
    └── fixtures/                # 테스트 데이터
        └── TestDataBuilder.java
```

### Frontend

```
frontend/
└── src/
    ├── __tests__/
    │   ├── unit/               # 컴포넌트 단위 테스트
    │   │   └── Button.test.tsx
    │   └── integration/        # 페이지 통합 테스트
    │       └── LoginPage.test.tsx
    └── __mocks__/              # Mock 데이터
        └── api.ts
```

### E2E

```
e2e/
├── tests/
│   ├── auth/
│   │   └── login.spec.ts
│   └── user/
│       └── user-crud.spec.ts
├── fixtures/
│   └── test-data.json
└── playwright.config.ts
```

---

## 3. 단위 테스트 가이드

### 원칙

- 하나의 테스트는 하나의 동작만 검증
- 외부 의존성은 Mock 처리
- 빠르게 실행 (1초 이내)
- 독립적으로 실행 가능

### Backend 예시

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("사용자 생성 - 정상 케이스")
    void createUser_Success() {
        // given
        UserCreateRequest request = UserCreateRequest.builder()
            .name("홍길동")
            .email("hong@example.com")
            .build();

        when(userMapper.existsByEmail(anyString())).thenReturn(false);
        when(userMapper.insert(any())).thenReturn(1);

        // when
        UserResponse result = userService.createUser(request);

        // then
        assertThat(result.getName()).isEqualTo("홍길동");
        verify(userMapper).insert(any());
    }

    @Test
    @DisplayName("사용자 생성 - 이메일 중복 시 예외")
    void createUser_DuplicateEmail_ThrowsException() {
        // given
        UserCreateRequest request = UserCreateRequest.builder()
            .email("existing@example.com")
            .build();

        when(userMapper.existsByEmail(anyString())).thenReturn(true);

        // when & then
        assertThatThrownBy(() -> userService.createUser(request))
            .isInstanceOf(BizException.class)
            .hasMessageContaining("이미 존재하는 이메일");
    }
}
```

### Frontend 예시

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## 4. 통합 테스트 가이드

### Backend API 테스트

```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@Testcontainers
class UserApiTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    @DisplayName("POST /api/v1/users - 사용자 생성")
    void createUser() {
        // given
        UserCreateRequest request = new UserCreateRequest("홍길동", "hong@example.com");

        // when
        ResponseEntity<ApiResponse<UserResponse>> response = restTemplate.postForEntity(
            "/api/v1/users",
            request,
            new ParameterizedTypeReference<>() {}
        );

        // then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getData().getName()).isEqualTo("홍길동");
    }
}
```

### Frontend 통합 테스트 (MSW)

```typescript
// LoginPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { LoginPage } from '../LoginPage';

const server = setupServer(
  http.post('/api/v1/auth/login', () => {
    return HttpResponse.json({
      success: true,
      data: { accessToken: 'token123', user: { name: '홍길동' } }
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('LoginPage', () => {
  it('로그인 성공 시 대시보드로 이동', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText('이메일'), 'test@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'password123');
    await user.click(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard');
    });
  });
});
```

---

## 5. E2E 테스트 가이드

### Playwright 설정

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
  ],
});
```

### E2E 테스트 예시

```typescript
// login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('로그인', () => {
  test('정상 로그인', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]'))
      .toContainText('환영합니다');
  });

  test('잘못된 비밀번호', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');

    await expect(page.locator('[data-testid="error-message"]'))
      .toBeVisible();
  });
});
```

---

## 6. 테스트 명명 규칙

### 패턴

```
[테스트 대상]_[시나리오]_[기대 결과]
```

### 예시

```java
// Java
createUser_ValidInput_ReturnsCreatedUser
createUser_DuplicateEmail_ThrowsBizException
findById_NotFound_ThrowsNotFoundException
```

```typescript
// TypeScript
it('renders button with label')
it('calls onClick when button is clicked')
it('shows error message when login fails')
```

---

## 7. 테스트 데이터 관리

### Builder 패턴

```java
public class UserTestDataBuilder {
    private String name = "테스트유저";
    private String email = "test@example.com";
    private String role = "USER";

    public UserTestDataBuilder withName(String name) {
        this.name = name;
        return this;
    }

    public UserTestDataBuilder withEmail(String email) {
        this.email = email;
        return this;
    }

    public User build() {
        return User.builder()
            .name(name)
            .email(email)
            .role(role)
            .build();
    }
}

// 사용
User user = new UserTestDataBuilder()
    .withName("홍길동")
    .build();
```

### Fixture 파일

```json
// fixtures/users.json
{
  "validUser": {
    "name": "홍길동",
    "email": "hong@example.com",
    "role": "USER"
  },
  "adminUser": {
    "name": "관리자",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

---

## 8. CI/CD 통합

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  unit-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
      - name: Run Unit Tests
        run: ./mvnw test -Dtest="**/unit/**"

  integration-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - name: Run Integration Tests
        run: ./mvnw test -Dtest="**/integration/**"

  e2e-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm ci
        working-directory: e2e
      - name: Run E2E Tests
        run: npx playwright test
        working-directory: e2e
```
