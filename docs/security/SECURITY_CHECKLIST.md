# 보안 체크리스트

## 1. OWASP Top 10 대응

| 위협 | 대응 방안 | 체크 |
|------|----------|------|
| A01 Broken Access Control | RBAC 구현, 리소스 소유권 검증 | [ ] |
| A02 Cryptographic Failures | TLS 1.2+, 안전한 해시(bcrypt) | [ ] |
| A03 Injection | PreparedStatement, 입력값 검증 | [ ] |
| A04 Insecure Design | 위협 모델링, 보안 아키텍처 리뷰 | [ ] |
| A05 Security Misconfiguration | 기본값 변경, 불필요 기능 비활성화 | [ ] |
| A06 Vulnerable Components | 의존성 스캔, 패치 관리 | [ ] |
| A07 Auth Failures | MFA, 세션 관리, 비밀번호 정책 | [ ] |
| A08 Software Integrity | 코드 서명, CI/CD 보안 | [ ] |
| A09 Logging Failures | 보안 이벤트 로깅, 로그 보호 | [ ] |
| A10 SSRF | URL 화이트리스트, 내부망 접근 차단 | [ ] |

---

## 2. 인증/인가 체크리스트

### JWT 구현

- [ ] Secret Key는 256비트 이상
- [ ] Access Token 만료: 30분 이내
- [ ] Refresh Token 만료: 7일 이내
- [ ] Refresh Token 재사용 감지
- [ ] 로그아웃 시 토큰 무효화

### 비밀번호 정책

- [ ] 최소 8자 이상
- [ ] 대문자, 소문자, 숫자, 특수문자 조합
- [ ] 이전 비밀번호 재사용 금지
- [ ] bcrypt (cost factor 12 이상) 사용
- [ ] 비밀번호 변경 시 전체 세션 무효화

### 세션 관리

- [ ] 세션 ID는 충분히 랜덤 (128비트 이상)
- [ ] 로그인 시 세션 ID 재생성
- [ ] 동시 로그인 제한 옵션
- [ ] 비활성 세션 자동 만료

---

## 3. 입력값 검증 체크리스트

### 서버 사이드 검증 (필수)

- [ ] 모든 입력값 화이트리스트 검증
- [ ] 길이 제한 적용
- [ ] 타입 검증
- [ ] 범위 검증 (숫자, 날짜)
- [ ] 특수문자 이스케이프

### SQL Injection 방지

- [ ] PreparedStatement 사용
- [ ] MyBatis #{} 파라미터 사용
- [ ] 동적 쿼리 금지 (불가피 시 화이트리스트)

### XSS 방지

- [ ] 출력 인코딩 (HTML, JavaScript, URL)
- [ ] Content-Type 헤더 설정
- [ ] CSP (Content Security Policy) 헤더
- [ ] HttpOnly Cookie 사용

---

## 4. API 보안 체크리스트

### 인증

- [ ] 모든 API에 인증 적용 (화이트리스트 제외)
- [ ] Bearer Token 방식
- [ ] API Key는 헤더로 전송 (URL 파라미터 금지)

### 인가

- [ ] 리소스별 권한 검증
- [ ] 소유권 검증 (자신의 데이터만 접근)
- [ ] 역할 기반 접근 제어 (RBAC)

### 요청 제한

- [ ] Rate Limiting 적용
- [ ] 요청 크기 제한 (body, 파일)
- [ ] 타임아웃 설정

### 응답 보안

- [ ] 민감 정보 마스킹
- [ ] 에러 메시지에 내부 정보 노출 금지
- [ ] CORS 설정 (화이트리스트 방식)

---

## 5. 데이터 보호 체크리스트

### 전송 중 보호

- [ ] TLS 1.2 이상 사용
- [ ] HSTS 헤더 설정
- [ ] 인증서 유효성 검증

### 저장 시 보호

- [ ] 비밀번호: bcrypt/argon2
- [ ] 민감 데이터: AES-256 암호화
- [ ] PII(개인식별정보): 마스킹/익명화

### 로그 보호

- [ ] 비밀번호, 토큰 로깅 금지
- [ ] 개인정보 마스킹 후 로깅
- [ ] 로그 파일 접근 권한 제한

---

## 6. 보안 헤더 설정

### 필수 헤더

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
```

### Spring Security 설정

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .headers(headers -> headers
            .contentTypeOptions(Customizer.withDefaults())
            .xssProtection(Customizer.withDefaults())
            .frameOptions(frame -> frame.deny())
            .httpStrictTransportSecurity(hsts -> hsts
                .includeSubDomains(true)
                .maxAgeInSeconds(31536000))
            .contentSecurityPolicy(csp -> csp
                .policyDirectives("default-src 'self'")));

    return http.build();
}
```

---

## 7. 코드 리뷰 보안 체크포인트

### 필수 확인 사항

| 항목 | 확인 |
|------|------|
| SQL Injection 취약점 없음 | [ ] |
| XSS 취약점 없음 | [ ] |
| CSRF 보호 적용 | [ ] |
| 인증/인가 검증 | [ ] |
| 민감 정보 로깅 없음 | [ ] |
| 하드코딩된 비밀번호/키 없음 | [ ] |
| 에러 메시지에 내부 정보 없음 | [ ] |
| 입력값 검증 적용 | [ ] |

---

## 8. 보안 테스트 체크리스트

### 자동화 스캔

- [ ] OWASP Dependency Check (의존성 취약점)
- [ ] SonarQube (정적 분석)
- [ ] OWASP ZAP (동적 분석)

### 수동 테스트

- [ ] 인증 우회 시도
- [ ] 권한 상승 시도
- [ ] SQL Injection 시도
- [ ] XSS 시도
- [ ] CSRF 시도
- [ ] 파일 업로드 취약점

### CI/CD 통합

```yaml
# .github/workflows/security-scan.yml
- name: OWASP Dependency Check
  uses: dependency-check/Dependency-Check_Action@main
  with:
    project: 'my-project'
    path: '.'
    format: 'HTML'
```
