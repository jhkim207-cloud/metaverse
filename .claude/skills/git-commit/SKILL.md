# Git Commit 스킬

## 개요

일관된 커밋 메시지 작성을 위한 가이드입니다.

## 커밋 메시지 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Type 분류

| Type | 설명 | 예시 |
|------|------|------|
| feat | 새로운 기능 | `feat: 로그인 기능 추가` |
| fix | 버그 수정 | `fix: 로그인 실패 시 에러 메시지 표시` |
| refactor | 리팩토링 | `refactor: UserService 분리` |
| docs | 문서 수정 | `docs: README 업데이트` |
| test | 테스트 추가/수정 | `test: UserService 테스트 추가` |
| chore | 빌드/설정 변경 | `chore: CI 워크플로우 수정` |
| style | 코드 포맷팅 | `style: 린트 에러 수정` |
| perf | 성능 개선 | `perf: 쿼리 최적화` |

## Scope (선택)

영향 범위를 명시합니다.

```
feat(auth): JWT 토큰 검증 로직 추가
fix(user): 이메일 중복 체크 버그 수정
```

## Subject 규칙

- 50자 이내
- 마침표 없음
- 명령형 현재 시제 (한글: "~함", "~추가")
- 첫 글자 소문자

```
✅ feat: add user registration
✅ feat: 사용자 등록 기능 추가

❌ feat: Added user registration.
❌ feat: 사용자 등록 기능을 추가했습니다.
```

## Body 규칙

- 72자에서 줄바꿈
- "무엇"보다 "왜"를 설명
- 빈 줄로 subject와 구분

```
feat(auth): JWT 토큰 검증 로직 추가

기존 세션 기반 인증에서 JWT 기반으로 전환.
토큰 만료 시 자동 갱신 로직 포함.

- Access Token: 30분
- Refresh Token: 7일
```

## Footer 규칙

### 이슈 참조

```
feat: 사용자 등록 기능 추가

Closes #123
Refs #456
```

### Breaking Changes

```
feat!: API 응답 구조 변경

BREAKING CHANGE: 응답 형식이 변경되었습니다.
이전: { data: ... }
이후: { success: true, data: ... }
```

## 예시

### 간단한 커밋

```
fix: 로그인 페이지 오타 수정
```

### 상세한 커밋

```
feat(order): 주문 취소 기능 추가

사용자가 결제 완료 전 주문을 취소할 수 있도록 함.

- 주문 상태가 PENDING일 때만 취소 가능
- 취소 시 재고 자동 복구
- 취소 사유 기록

Closes #234
```

## 커밋 전 체크리스트

- [ ] 의미 있는 단위로 커밋하는가?
- [ ] 테스트가 통과하는가?
- [ ] 린트 에러가 없는가?
- [ ] 커밋 메시지가 규칙을 따르는가?

## Git Hooks 설정

```bash
# .husky/commit-msg
npx commitlint --edit $1
```

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'refactor', 'docs', 'test', 'chore', 'style', 'perf'
    ]],
    'subject-max-length': [2, 'always', 50],
  },
};
```
