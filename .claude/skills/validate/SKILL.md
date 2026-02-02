# 프로젝트 검증 스킬

## 개요

프로젝트 전체 검증(typecheck, lint, test, build)을 실행합니다.

## 트리거

다음 요청 시 이 스킬을 실행합니다:
- "검증해줘"
- "validate 실행해줘"
- "전체 검증"
- "validate_all"

## 실행 방법

```powershell
cd c:/Users/egjang/projects/project_temp
powershell -ExecutionPolicy Bypass -File ./scripts/validate_all.ps1
```

## 검증 항목

### Frontend (4단계)

| 단계 | 명령어 | 설명 |
|------|--------|------|
| typecheck | `npm run typecheck` | TypeScript 타입 오류 검사 |
| lint | `npm run lint` | ESLint 코드 스타일/품질 검사 |
| test | `npm run test:run` | Vitest 단위 테스트 |
| build | `npm run build` | 프로덕션 빌드 |

### Backend (1단계)

| 단계 | 명령어 | 설명 |
|------|--------|------|
| package | `mvnw clean package` | 컴파일 + JUnit 테스트 + JAR 패키징 |

## 개별 실행

### Frontend만 검증

```bash
cd frontend
npm run typecheck && npm run lint && npm run test:run && npm run build
```

### Backend만 검증

```bash
cd backend
./mvnw clean package
```

### 테스트만 실행

```bash
# Frontend
cd frontend && npm run test:run

# Backend
cd backend && ./mvnw test
```

## 실패 시 대응

### TypeScript 에러
- 에러 메시지 확인 후 타입 수정
- `npm run typecheck` 재실행

### Lint 에러
- `npm run lint -- --fix` 로 자동 수정 시도
- 수동 수정 필요 시 에러 위치 확인

### 테스트 실패
- 실패한 테스트 파일 확인
- 테스트 코드 또는 구현 코드 수정

### 빌드 실패
- 이전 단계(typecheck, lint, test) 통과 확인
- 빌드 에러 메시지 확인
