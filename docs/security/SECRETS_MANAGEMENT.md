# 민감 정보 관리 가이드

## 1. 민감 정보 분류

| 분류 | 예시 | 보호 수준 |
|------|------|----------|
| Critical | DB 비밀번호, API Secret Key | 최고 (암호화 필수) |
| High | 외부 API Key, OAuth Client Secret | 높음 (환경변수) |
| Medium | 서비스 계정 정보 | 중간 |
| Low | 비공개 URL | 기본 |

---

## 2. 절대 커밋하지 말 것

### 파일

```gitignore
# .gitignore 필수 항목

# 환경 파일
.env
.env.local
.env.*.local
application-prod.yml
application-local.yml

# 인증서/키
*.pem
*.key
*.p12
*.jks
secrets/

# IDE 설정 (민감정보 포함 가능)
.idea/
.vscode/settings.json

# 로그 (민감정보 포함 가능)
*.log
logs/
```

### 코드 패턴

```java
// ❌ 절대 금지
private static final String DB_PASSWORD = "mypassword123";
private static final String API_KEY = "sk-abc123...";

// ✅ 올바른 방법
@Value("${DB_PASSWORD}")
private String dbPassword;

@Value("${API_KEY}")
private String apiKey;
```

---

## 3. 환경변수 관리

### 로컬 개발

```yaml
# application-local.yml (.gitignore에 등록)
spring:
  datasource:
    password: ${DB_PASSWORD:localpassword}

jwt:
  secret: ${JWT_SECRET:local-dev-secret-key-for-testing-only}
```

### 운영 환경

```bash
# 시스템 환경변수 설정
export DB_PASSWORD=secure_password
export JWT_SECRET=production-secret-key

# 또는 Docker
docker run -e DB_PASSWORD=secure_password myapp
```

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
      JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

---

## 4. 설정 파일 구조

```
backend/src/main/resources/
├── application.yml           # 공통 설정 (민감정보 없음)
├── application-local.yml     # 로컬 개발 (.gitignore)
├── application-dev.yml       # 개발 서버
└── application-prod.yml      # 운영 서버 (.gitignore)
```

### application.yml (템플릿)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:mydb}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD}  # 기본값 없음 (필수)

jwt:
  secret: ${JWT_SECRET}       # 기본값 없음 (필수)
  access-token-expiry: 30m
  refresh-token-expiry: 7d

external-api:
  base-url: ${EXTERNAL_API_URL:https://api.example.com}
  api-key: ${EXTERNAL_API_KEY}
```

---

## 5. 프론트엔드 환경변수

### Vite 환경변수

```bash
# .env.local (.gitignore에 등록)
VITE_API_BASE_URL=http://localhost:8080
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 접근 방법

```typescript
// 런타임에 접근
const apiUrl = import.meta.env.VITE_API_BASE_URL;

// 타입 정의
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SENTRY_DSN?: string;
}
```

### 주의사항

- `VITE_` 접두사가 있는 변수만 번들에 포함됨
- 민감한 시크릿(API Key 등)은 프론트엔드에 노출하지 않음
- 필요 시 백엔드 프록시를 통해 처리

---

## 6. 시크릿 로테이션

### JWT Secret 로테이션

```java
@Service
public class JwtService {
    // 새 키와 이전 키 동시 사용
    @Value("${jwt.secret}")
    private String currentSecret;

    @Value("${jwt.secret.previous:#{null}}")
    private String previousSecret;

    public boolean validateToken(String token) {
        // 현재 키로 검증 시도
        if (validateWithSecret(token, currentSecret)) {
            return true;
        }
        // 실패 시 이전 키로 검증 (로테이션 기간 중)
        if (previousSecret != null) {
            return validateWithSecret(token, previousSecret);
        }
        return false;
    }
}
```

### API Key 로테이션 절차

1. 새 API Key 생성
2. 두 키 모두 허용하도록 설정
3. 클라이언트에 새 키 배포
4. 모니터링 (이전 키 사용량 0 확인)
5. 이전 키 비활성화

---

## 7. 로깅에서 민감정보 보호

### 마스킹 패턴

```java
@Component
public class SensitiveDataMasker {

    private static final Pattern PASSWORD_PATTERN =
        Pattern.compile("(password|pwd|secret)=([^&\\s]+)", Pattern.CASE_INSENSITIVE);

    private static final Pattern CARD_PATTERN =
        Pattern.compile("\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}");

    public String mask(String input) {
        String result = PASSWORD_PATTERN.matcher(input)
            .replaceAll("$1=****");
        result = CARD_PATTERN.matcher(result)
            .replaceAll("****-****-****-$4");
        return result;
    }
}
```

### 로그백 설정

```xml
<!-- logback-spring.xml -->
<encoder class="net.logstash.logback.encoder.LogstashEncoder">
    <jsonGeneratorDecorator class="...SensitiveDataMaskingDecorator"/>
</encoder>
```

---

## 8. 체크리스트

### 코드 리뷰 시

- [ ] 하드코딩된 비밀번호/키 없음
- [ ] 환경변수 사용 확인
- [ ] 로그에 민감정보 없음
- [ ] .gitignore 설정 확인

### 배포 전

- [ ] 환경변수 설정 완료
- [ ] 테스트 환경 시크릿 ≠ 운영 환경 시크릿
- [ ] 시크릿 접근 권한 최소화
- [ ] 시크릿 백업/복구 절차 확인

### 정기 점검

- [ ] 사용하지 않는 시크릿 삭제
- [ ] 시크릿 로테이션 일정 확인
- [ ] 접근 로그 모니터링
- [ ] 의존성 보안 취약점 스캔
