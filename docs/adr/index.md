# Architecture Decision Records

## 개요

이 디렉토리는 프로젝트의 중요한 아키텍처 결정을 기록합니다.

## ADR 목록

| 번호 | 제목 | 상태 | 날짜 |
|------|------|------|------|
| [0000](./0000-template.md) | ADR 템플릿 | Accepted | - |

## ADR 작성 가이드

### 언제 ADR을 작성하나?

1. 새로운 기술/라이브러리 도입
2. 아키텍처 패턴 변경
3. 데이터베이스 스키마 중요 변경
4. 외부 서비스 연동 방식 결정
5. 성능/보안 관련 중요 결정

### 명명 규칙

- 파일명: `NNNN-kebab-case-title.md`
- 번호는 순차 증가 (0001, 0002, ...)
- 재사용 금지 (삭제된 번호도 재사용하지 않음)

### 상태 정의

| 상태 | 설명 |
|------|------|
| Proposed | 검토 중인 결정 |
| Accepted | 승인되어 적용 중인 결정 |
| Deprecated | 더 이상 권장하지 않는 결정 |
| Superseded | 다른 ADR로 대체된 결정 |

## 참고 자료

- [MADR (Markdown Any Decision Records)](https://adr.github.io/madr/)
- [ADR GitHub Organization](https://adr.github.io/)
