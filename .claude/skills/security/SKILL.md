# 보안 스킬

## 개요

보안 코드 작성 및 검토를 위한 가이드입니다.

## OWASP Top 10 체크리스트

| 위협 | 대응 방안 |
|------|----------|
| Injection | PreparedStatement, 입력값 검증 |
| Broken Auth | JWT + Refresh Token, 세션 관리 |
| XSS | 출력 인코딩, CSP 헤더 |
| CSRF | CSRF Token, SameSite Cookie |
| Security Misconfig | 환경별 설정 분리 |

## 입력값 검증 패턴

```java
// ❌ 잘못된 예
String query = "SELECT * FROM users WHERE name = '" + name + "'";

// ✅ 올바른 예 (PreparedStatement)
@Select("SELECT * FROM users WHERE name = #{name}")
User findByName(@Param("name") String name);
```

## JWT 보안 설정

```yaml
jwt:
  secret: ${JWT_SECRET}         # 환경변수 필수
  access-token-expiry: 30m      # 30분 이하
  refresh-token-expiry: 7d      # 7일 이하
```

## 비밀번호 정책

- 최소 8자 이상
- 대문자, 소문자, 숫자, 특수문자 조합
- bcrypt (cost factor 12 이상)

```java
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
String hashed = encoder.encode(rawPassword);
```

## 보안 헤더 설정

```java
http.headers(headers -> headers
    .contentTypeOptions(Customizer.withDefaults())
    .xssProtection(Customizer.withDefaults())
    .frameOptions(frame -> frame.deny())
    .httpStrictTransportSecurity(hsts -> hsts
        .includeSubDomains(true)
        .maxAgeInSeconds(31536000)));
```

## 민감 정보 관리

### 절대 커밋하지 말 것

- `.env`, `.env.local`
- `application-prod.yml` (민감정보 포함 시)
- API 키, 비밀번호, 토큰
- `*.pem`, `*.key`

### 대신 사용할 것

```yaml
spring:
  datasource:
    password: ${DB_PASSWORD}  # 환경변수
```

## 코드 리뷰 보안 체크

- [ ] SQL Injection 취약점 없음
- [ ] XSS 취약점 없음
- [ ] CSRF 보호 적용
- [ ] 인증/인가 검증
- [ ] 민감 정보 로깅 없음
- [ ] 하드코딩된 비밀번호/키 없음

## 보안 스캔 명령어

```bash
# 의존성 취약점 스캔
./mvnw verify -Psecurity
npm audit

# OWASP ZAP (동적 분석)
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:8080
```

## 참고 문서

- [보안 체크리스트](../../docs/security/SECURITY_CHECKLIST.md)
- [민감 정보 관리](../../docs/security/SECRETS_MANAGEMENT.md)
