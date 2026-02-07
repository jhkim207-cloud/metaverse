# 프로젝트 메모리

> Claude가 세션 간 컨텍스트를 유지하기 위한 작업 히스토리

## 최근 작업 (Last 5 Sessions)

### 2026-02-07: 프로젝트 DB 설정 확정

- **완료**:
  - 운영 DB URL 확정: `jdbc:postgresql://168.107.43.244:5432/apps`
  - Default Schema: `hkgn`

- **주의사항**:
  - 모든 DB 관련 작업은 반드시 위 URL 기준으로 진행
  - DDL 작성 시 스키마 `hkgn` 명시

- **참고 파일**:
  - `backend/src/main/resources/application.yml`
  - `backend/src/main/resources/application-dev.yml`

---

### 2026-01-31: project_temp 템플릿 초기화

- **완료**:
  - IMPLEMENTATION_PLAN_ENHANCEMENT.md 기반 전체 구조 재구성
  - CLAUDE.md 새롭게 작성 (AI 개발 지침)
  - docs/ 문서 체계 구축 (ADR, API, Security, Testing, Code Review)
  - .claude/skills/ 8개 Skill 생성
  - assets/ 재사용 자산 카탈로그 생성
  - prd/ PRD 템플릿 및 추적 시스템
  - .github/ CI/CD 워크플로우 및 PR 템플릿
  - README.md 업데이트

- **결정사항**:
  - BizPlatform의 재사용 가능 모듈만 메타데이터로 관리 (assets/*.yml)
  - 실제 코드는 필요 시 이식하는 방식 채택
  - Claude Skills로 AI 협업 표준화

- **다음 작업**: 실제 프로젝트에서 템플릿 사용 및 검증

---

## 핵심 결정사항 (영구 보존)

| 날짜 | 결정 | 이유 | 영향 범위 |
|------|------|------|----------|
| 2026-02-07 | DB: 168.107.43.244:5432/apps | 운영 DB 확정, schema=hkgn | 모든 DB 작업 |
| 2026-01-31 | YAML 기반 자산 카탈로그 | 코드 복사 대신 메타데이터 관리로 유연성 확보 | assets/ |
| 2026-01-31 | 8개 Claude Skills 체계 | AI 협업 시 일관된 가이드 제공 | .claude/skills/ |
| 2026-01-31 | 테스트 피라미드 80/15/5 | Unit > Integration > E2E 비율로 빠른 피드백 | 테스트 전략 |

---

## 학습된 패턴

- PRD 변경 감지 시 `prd/changes.md`에 기록
- 기능 구현 완료 시 `prd/implementation-status.md` 업데이트
- DDL 작성 시 `db_dic/dictionary/standards.json` 참조

---

## 주의사항 (Gotchas)

- 환경변수 하드코딩 금지 (JWT_SECRET 등)
- CSS 변수 사용 (하드코딩 색상 금지)
- Service 클래스 300줄 이하 유지

---

*마지막 업데이트: 2026-02-07*
