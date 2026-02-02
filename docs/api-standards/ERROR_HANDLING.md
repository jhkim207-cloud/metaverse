# API 에러 처리 가이드

## 1. 에러 응답 구조

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "사용자에게 표시할 메시지",
    "details": [],
    "traceId": "추적 ID"
  }
}
```

### 필드 설명

| 필드 | 필수 | 설명 |
|------|------|------|
| success | O | 항상 `false` |
| error.code | O | 에러 코드 (기계가 읽는 용도) |
| error.message | O | 에러 메시지 (사람이 읽는 용도) |
| error.details | X | 상세 에러 정보 (필드별 오류 등) |
| error.traceId | O | 로그 추적용 ID |

---

## 2. 유효성 검증 에러

### 요청

```json
POST /api/v1/users
{
  "email": "invalid-email",
  "age": -5
}
```

### 응답 (400 Bad Request)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값이 올바르지 않습니다.",
    "details": [
      {
        "field": "email",
        "message": "유효한 이메일 형식이 아닙니다.",
        "rejectedValue": "invalid-email"
      },
      {
        "field": "age",
        "message": "0 이상의 값이어야 합니다.",
        "rejectedValue": -5
      }
    ],
    "traceId": "abc-123-xyz"
  }
}
```

---

## 3. 인증/인가 에러

### 인증 실패 (401 Unauthorized)

```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_TOKEN",
    "message": "유효하지 않은 토큰입니다.",
    "traceId": "abc-123-xyz"
  }
}
```

### 권한 없음 (403 Forbidden)

```json
{
  "success": false,
  "error": {
    "code": "AUTH_FORBIDDEN",
    "message": "해당 리소스에 접근 권한이 없습니다.",
    "traceId": "abc-123-xyz"
  }
}
```

---

## 4. 리소스 에러

### 리소스 없음 (404 Not Found)

```json
{
  "success": false,
  "error": {
    "code": "BIZ_NOT_FOUND",
    "message": "요청한 리소스를 찾을 수 없습니다.",
    "traceId": "abc-123-xyz"
  }
}
```

### 중복 충돌 (409 Conflict)

```json
{
  "success": false,
  "error": {
    "code": "BIZ_DUPLICATE",
    "message": "이미 존재하는 이메일입니다.",
    "details": [
      {
        "field": "email",
        "message": "중복된 값",
        "rejectedValue": "existing@example.com"
      }
    ],
    "traceId": "abc-123-xyz"
  }
}
```

---

## 5. 비즈니스 로직 에러 (422 Unprocessable Entity)

```json
{
  "success": false,
  "error": {
    "code": "BIZ_INVALID_STATE",
    "message": "주문을 취소할 수 없는 상태입니다.",
    "details": [
      {
        "field": "status",
        "message": "현재 상태: SHIPPED, 취소 가능 상태: PENDING, CONFIRMED",
        "rejectedValue": "SHIPPED"
      }
    ],
    "traceId": "abc-123-xyz"
  }
}
```

---

## 6. 서버 에러 (500 Internal Server Error)

```json
{
  "success": false,
  "error": {
    "code": "SYS_UNKNOWN",
    "message": "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    "traceId": "abc-123-xyz"
  }
}
```

**주의**: 500 에러에서는 내부 정보(스택 트레이스 등)를 노출하지 않음

---

## 7. Backend 구현 예시

### GlobalExceptionHandler.java

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleValidationException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        List<ErrorDetail> details = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> new ErrorDetail(
                error.getField(),
                error.getDefaultMessage(),
                error.getRejectedValue()
            ))
            .toList();

        return ApiResponse.error(
            "VALIDATION_ERROR",
            "입력값이 올바르지 않습니다.",
            details,
            generateTraceId(request)
        );
    }

    @ExceptionHandler(BizException.class)
    public ResponseEntity<ApiResponse<Void>> handleBizException(
            BizException ex,
            HttpServletRequest request) {

        return ResponseEntity
            .status(ex.getHttpStatus())
            .body(ApiResponse.error(
                ex.getErrorCode(),
                ex.getMessage(),
                generateTraceId(request)
            ));
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Void> handleException(
            Exception ex,
            HttpServletRequest request) {

        log.error("Unhandled exception", ex);

        return ApiResponse.error(
            "SYS_UNKNOWN",
            "서버 오류가 발생했습니다.",
            generateTraceId(request)
        );
    }
}
```

---

## 8. Frontend 에러 처리 예시

```typescript
async function handleApiError(response: Response) {
  const data = await response.json();

  switch (response.status) {
    case 400:
      // 유효성 검증 에러 - 필드별 에러 표시
      if (data.error.details) {
        data.error.details.forEach((detail: ErrorDetail) => {
          showFieldError(detail.field, detail.message);
        });
      }
      break;

    case 401:
      // 인증 에러 - 로그인 페이지로 이동
      redirectToLogin();
      break;

    case 403:
      // 권한 에러 - 권한 없음 메시지
      showError('접근 권한이 없습니다.');
      break;

    case 404:
      // 리소스 없음
      showError('요청한 리소스를 찾을 수 없습니다.');
      break;

    case 422:
      // 비즈니스 로직 에러
      showError(data.error.message);
      break;

    case 500:
    default:
      // 서버 에러
      showError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error('TraceId:', data.error.traceId);
      break;
  }
}
```
