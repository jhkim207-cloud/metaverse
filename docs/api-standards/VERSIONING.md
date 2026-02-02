# API 버전 관리 가이드

## 1. 버전 관리 방식

### URL Path 방식 (권장)

```
/api/v1/users
/api/v2/users
```

**장점**: 명확하고 직관적, 캐싱 용이
**단점**: URL 변경 필요

---

## 2. 버전 업그레이드 기준

### 하위 호환 변경 (버전 유지)

| 변경 유형 | 예시 |
|----------|------|
| 새 필드 추가 | 응답에 `createdAt` 추가 |
| 새 엔드포인트 추가 | `/api/v1/users/stats` 추가 |
| 옵셔널 파라미터 추가 | `?includeDeleted=true` |
| 에러 메시지 개선 | 메시지 문구 변경 |

### 하위 호환 불가 변경 (버전 업그레이드)

| 변경 유형 | 예시 |
|----------|------|
| 필드 삭제 | `userName` → 삭제 |
| 필드명 변경 | `userName` → `name` |
| 필드 타입 변경 | `id: string` → `id: number` |
| 응답 구조 변경 | 중첩 구조 변경 |
| 필수 파라미터 추가 | `?filter` 필수화 |
| HTTP 메서드 변경 | GET → POST |
| 상태 코드 변경 | 200 → 201 |

---

## 3. 버전 전환 프로세스

### 1단계: 신규 버전 개발

```
/api/v1/users  (기존, 유지)
/api/v2/users  (신규, 개발 중)
```

### 2단계: Deprecation 공지

```java
@Deprecated
@GetMapping("/api/v1/users")
public ApiResponse<List<User>> getUsersV1() {
    // Deprecation 헤더 추가
    response.setHeader("Deprecation", "true");
    response.setHeader("Sunset", "2025-06-30T23:59:59Z");
    response.setHeader("Link", "</api/v2/users>; rel=\"successor-version\"");

    return userService.getUsers();
}
```

### 3단계: 병행 운영 기간

- 최소 3개월 병행 운영
- 사용 현황 모니터링
- 클라이언트 마이그레이션 지원

### 4단계: 구버전 종료

```java
@GetMapping("/api/v1/users")
public ResponseEntity<ApiResponse<Void>> getUsersV1() {
    return ResponseEntity
        .status(HttpStatus.GONE)  // 410 Gone
        .body(ApiResponse.error(
            "API_DEPRECATED",
            "이 API는 더 이상 사용할 수 없습니다. /api/v2/users를 사용해주세요."
        ));
}
```

---

## 4. 버전별 문서 관리

### 디렉토리 구조

```
docs/
└── api/
    ├── v1/
    │   ├── users.md
    │   └── orders.md
    └── v2/
        ├── users.md          # 변경사항 명시
        ├── orders.md
        └── MIGRATION_GUIDE.md # 마이그레이션 가이드
```

### 마이그레이션 가이드 예시

```markdown
# v1 → v2 마이그레이션 가이드

## 변경 사항

### Users API

#### 필드명 변경

| v1 | v2 | 비고 |
|----|----|----|
| userName | name | 통일성 |
| phoneNumber | phone | 축약 |

#### 응답 구조 변경

v1:
```json
{
  "id": 1,
  "userName": "홍길동"
}
```

v2:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "홍길동"
  }
}
```

## 마이그레이션 체크리스트

- [ ] 필드명 변경 반영
- [ ] 응답 구조 변경 반영
- [ ] 에러 처리 로직 업데이트
- [ ] 테스트 실행
```

---

## 5. 클라이언트 버전 감지

### User-Agent 헤더 활용

```
User-Agent: MyApp/1.2.0 (iOS 17.0)
```

### 커스텀 헤더 활용

```
X-App-Version: 1.2.0
X-Platform: ios
```

### 최소 지원 버전 강제

```java
@Component
public class VersionCheckInterceptor implements HandlerInterceptor {

    private static final String MIN_VERSION = "1.2.0";

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) {
        String appVersion = request.getHeader("X-App-Version");

        if (appVersion != null && isVersionLower(appVersion, MIN_VERSION)) {
            response.setStatus(HttpStatus.UPGRADE_REQUIRED.value());
            response.setHeader("X-Min-Version", MIN_VERSION);
            return false;
        }

        return true;
    }
}
```

---

## 6. 버전 관리 원칙

| 원칙 | 설명 |
|------|------|
| 하위 호환 유지 | 가능한 한 기존 클라이언트가 동작하도록 |
| 명확한 Deprecation | 충분한 사전 공지와 마이그레이션 기간 |
| 문서화 필수 | 모든 버전 변경사항 문서화 |
| 테스트 커버리지 | 버전별 독립적인 테스트 유지 |
| 모니터링 | 버전별 사용량 추적 |
