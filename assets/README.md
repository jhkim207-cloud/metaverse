# 재사용 자산 카탈로그

> BizPlatform에서 추출한 재사용 가능한 모듈/컴포넌트 카탈로그

## 개요

이 디렉토리는 프로젝트 간 재사용 가능한 자산의 메타데이터를 관리합니다.
실제 소스 코드는 `backend/`, `frontend/` 디렉토리에 있으며,
여기에는 각 자산의 **사양, 의존성, 이식 가이드**가 YAML 형식으로 정리되어 있습니다.

## 디렉토리 구조

```
assets/
├── catalog.json          # 전체 자산 목록 인덱스
├── README.md             # 이 파일
├── core/                 # 핵심 인프라 (필수)
│   ├── authentication.yml
│   ├── exception-handler.yml
│   └── api-response.yml
├── common/               # 공통 유틸리티 (선택)
│   ├── file-storage.yml
│   ├── email-service.yml
│   └── cache-config.yml
├── domain/               # 도메인 공통 (비즈니스별)
│   ├── code-master.yml
│   └── audit-log.yml
└── frontend/             # 프론트엔드
    ├── auth-context.yml
    ├── theme-context.yml
    ├── api-client.yml
    └── ui-components.yml
```

## 카테고리별 설명

### Core (핵심)

모든 프로젝트에 필수적인 인프라 자산입니다.

| 자산 | 설명 | 우선순위 |
|------|------|----------|
| [authentication](core/authentication.yml) | JWT 인증/인가 시스템 | 🔴 필수 |
| [exception-handler](core/exception-handler.yml) | 전역 예외 처리 | 🔴 필수 |
| [api-response](core/api-response.yml) | 표준 API 응답 형식 | 🔴 필수 |

### Common (공통)

대부분의 프로젝트에서 유용한 유틸리티 자산입니다.

| 자산 | 설명 | 우선순위 |
|------|------|----------|
| [file-storage](common/file-storage.yml) | 파일 업로드/다운로드/썸네일 | 🟠 권장 |
| [email-service](common/email-service.yml) | SMTP 이메일 발송 | 🟡 선택 |
| [cache-config](common/cache-config.yml) | Caffeine 로컬 캐시 | 🟡 선택 |

### Domain (도메인)

비즈니스 요구사항에 따라 선택적으로 사용하는 자산입니다.

| 자산 | 설명 | 우선순위 |
|------|------|----------|
| [code-master](domain/code-master.yml) | 공통코드 관리 | 🟠 권장 |
| [audit-log](domain/audit-log.yml) | 감사 로그 기록 | 🟡 선택 |

### Frontend (프론트엔드)

React 기반 프론트엔드 자산입니다.

| 자산 | 설명 | 우선순위 |
|------|------|----------|
| [auth-context](frontend/auth-context.yml) | 인증 상태 관리 | 🔴 필수 |
| [theme-context](frontend/theme-context.yml) | 다크모드 테마 | 🟠 권장 |
| [api-client](frontend/api-client.yml) | API 클라이언트 | 🔴 필수 |
| [ui-components](frontend/ui-components.yml) | UI 컴포넌트 | 🟠 권장 |

## YAML 파일 구조

각 자산 YAML 파일의 표준 구조:

```yaml
name: 자산명
version: "1.0.0"
category: core | common | domain | frontend
description: 자산 설명

source:
  repository: 원본 저장소
  path: 소스 경로

files:
  backend:
    - path: 파일 경로
      description: 설명
  frontend:
    - path: 파일 경로
      description: 설명

dependencies:
  backend: [Maven 의존성]
  frontend: [npm 패키지]

environment:
  - name: 환경변수명
    description: 설명
    required: true | false

api:
  - method: HTTP 메서드
    path: API 경로
    description: 설명

migration:
  packageRename:
    from: 원본 패키지
    to: 대상 패키지
  notes:
    - 이식 시 주의사항

tags: [태그 목록]
```

## 사용 방법

### 1. 자산 선택

`catalog.json`에서 필요한 자산을 확인하고, 해당 YAML 파일을 참조합니다.

### 2. 의존성 확인

YAML 파일의 `dependencies` 섹션에서 필요한 라이브러리를 확인합니다.

```yaml
dependencies:
  backend:
    - "io.jsonwebtoken:jjwt-api:0.12.6"
  frontend:
    - "react-router-dom"
```

### 3. 파일 복사

`files` 섹션의 파일 목록을 참고하여 원본 저장소에서 복사합니다.

### 4. 패키지명 변경

`migration.packageRename`을 참고하여 패키지명을 변경합니다.

```yaml
migration:
  packageRename:
    from: "com.tnt.sales.auth"
    to: "com.yourcompany.project.auth"
```

### 5. 환경 변수 설정

`environment` 섹션의 환경 변수를 설정합니다.

## Claude 활용

Claude Code에서 자산을 활용할 때:

```
"authentication 자산을 프로젝트에 이식해줘"
→ assets/core/authentication.yml 참조하여 이식 작업 수행

"공통코드 관리 기능이 필요해"
→ assets/domain/code-master.yml 참조하여 구현
```

## 기여 가이드

새로운 재사용 자산을 추가할 때:

1. 적절한 카테고리 디렉토리에 YAML 파일 생성
2. 표준 구조에 맞게 메타데이터 작성
3. `catalog.json`에 자산 등록
4. 이식 테스트 수행

## 버전 관리

- 각 자산의 버전은 독립적으로 관리
- `catalog.json`의 `version`은 카탈로그 전체 버전
- 주요 변경 시 CHANGELOG 기록
