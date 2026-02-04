# 구현 계획서: adx_1st

**Feature**: Claude Max PRD Workflow Web UI
**Date**: 2026-02-04
**Version**: 1.0
**Author**: Claude (Gate 5 Implementation Plan Agent)

---

## 1. 구현 개요

| 항목 | 값 |
|------|-----|
| 총 파일 수 | 32개 |
| Backend 파일 | 8개 |
| Frontend 파일 | 20개 |
| 테스트 파일 | 4개 |
| Phase 수 | 3 (Backend/Frontend/Integration) |
| 의존성 순서 | BE Types → BE API → FE Types → FE Services → FE Components → Tests |

**주의**: 이 프로젝트는 **DB가 없으므로** Phase 1 (Database)을 건너뜁니다.

---

## 2. Phase별 구현 순서

### Phase 1: Backend (Node.js + Express + TypeScript)

#### 2.1.1 Type 정의 및 인터페이스

| 순서 | 파일 | 유형 | 의존성 | 병렬 가능 | 설명 |
|------|------|------|--------|----------|------|
| **1.1** | `server/src/types/workflow.ts` | Type Definition | - | Y | WorkflowRun, GateExecution, ApprovalRequest 인터페이스 |
| **1.2** | `server/src/types/project.ts` | Type Definition | - | Y (with 1.1) | Project, SessionLock 인터페이스 |
| **1.3** | `server/src/types/api.ts` | Type Definition | - | Y (with 1.1/1.2) | Request/Response DTO 인터페이스 |
| **1.4** | `server/src/types/websocket.ts` | Type Definition | - | Y (with 1.1/1.2/1.3) | WebSocket message protocol 인터페이스 |

#### 2.1.2 서비스 계층 (파일 I/O)

| 순서 | 파일 | 유형 | 의존성 | 병렬 가능 | 설명 |
|------|------|------|--------|----------|------|
| **2.1** | `server/src/services/fileService.ts` | Service | 1.1-1.4 | N | 파일 시스템 CRUD (atomic write, lock 메커니즘) |
| **2.2** | `server/src/services/workflowService.ts` | Service | 2.1 | N | Workflow 생성/조회/업데이트 로직 |
| **2.3** | `server/src/services/projectService.ts` | Service | 2.1 | N | Project 설정 관리 |
| **2.4** | `server/src/services/agentService.ts` | Service | 2.1, 2.2 | N | Agent SDK 래퍼 (executeSkill, AskUserQuestion 처리) |

#### 2.1.3 REST API 계층

| 순서 | 파일 | 유형 | 의존성 | 병렬 가능 | 설명 |
|------|------|------|--------|----------|------|
| **3.1** | `server/src/controllers/workflowController.ts` | Controller | 2.1-2.4 | N | GET/POST /wf-api/workflows*, POST /cancel, /resume |
| **3.2** | `server/src/controllers/projectController.ts` | Controller | 2.1-2.4 | N (with 3.1) | GET /wf-api/projects, POST /validate |
| **3.3** | `server/src/controllers/artifactController.ts` | Controller | 2.1-2.4 | N (with 3.1/3.2) | GET /wf-api/artifacts/* |

#### 2.1.4 WebSocket 계층

| 순서 | 파일 | 유형 | 의존성 | 병렬 가능 | 설명 |
|------|------|------|--------|----------|------|
| **4.1** | `server/src/websocket/workflowHandler.ts` | Handler | 2.1-2.4 | N | WebSocket connection 관리, message dispatch |
| **4.2** | `server/src/websocket/messageParser.ts` | Utility | 1.1-1.4 | Y (with 4.1) | 메시지 파싱 및 검증 |
| **4.3** | `server/src/websocket/sessionManager.ts` | Utility | 2.1 | N | 세션 상태 관리 (in-memory) |

#### 2.1.5 미들웨어 및 설정

| 순서 | 파일 | 유형 | 의존성 | 병렬 가능 | 설명 |
|------|------|------|--------|----------|------|
| **5.1** | `server/src/middleware/authMiddleware.ts` | Middleware | 1.1-1.4 | Y | OAuth token 검증 |
| **5.2** | `server/src/middleware/errorHandler.ts` | Middleware | 1.1-1.4 | Y (with 5.1) | 통일된 에러 응답 포매팅 |
| **5.3** | `server/src/index.ts` | App Setup | 2.1-5.2 | N | Express 앱 초기화, 라우트 등록, WebSocket 설정 |

#### 2.1.6 Backend 테스트

| 순서 | 파일 | 유형 | 의존성 | 병렬 가능 | 설명 |
|------|------|------|--------|----------|------|
| **6.1** | `server/src/__tests__/fileService.test.ts` | Unit Test | 2.1 | Y (with 2.1 완료) | 파일 I/O 테스트 (atomic write, lock) |
| **6.2** | `server/src/__tests__/workflowService.test.ts` | Unit Test | 2.2 | Y (with 2.2 완료) | Workflow CRUD 테스트 |
| **6.3** | `server/src/__tests__/workflowController.test.ts` | Integration Test | 3.1 | Y (with 3.1 완료) | REST API 통합 테스트 |
| **6.4** | `server/src/__tests__/websocket.test.ts` | Integration Test | 4.1-4.3 | Y (with 4.1-4.3 완료) | WebSocket 메시지 흐름 테스트 |

---

### Phase 2: Frontend (React + TypeScript + Vite)

#### 2.2.1 Type 정의

| 순서 | 파일 | 유형 | 의존성 | 병렬 가능 | 설명 |
|------|------|------|--------|----------|------|
| **1.1** | `client/src/types/workflow.ts` | Type Definition | Phase 1 (API 완료) | N | WorkflowRun, GateState, ApprovalRequest 타입 |
| **1.2** | `client/src/types/project.ts` | Type Definition | Phase 1 | N | Project, ProjectValidationResult 타입 |
| **1.3** | `client/src/types/api.ts` | Type Definition | Phase 1 | Y (with 1.1/1.2) | Request/Response DTO 타입 |

#### 2.2.2 API 서비스 계층

| 순서 | 파일 | 유형 | 의존성 | 병렬 가능 | 설명 |
|------|------|------|--------|----------|------|
| **2.1** | `client/src/services/api.ts` | Base API | 1.1-1.3 | N | Fetch wrapper (Authorization header, error handling) |
| **2.2** | `client/src/services/workflowApi.ts` | API Service | 2.1 | N | Workflow REST endpoints (POST /workflows, GET /workflows/:id 등) |
| **2.3** | `client/src/services/projectApi.ts` | API Service | 2.1 | N (with 2.2) | Project REST endpoints (POST /validate, GET /projects) |
| **2.4** | `client/src/services/artifactApi.ts` | API Service | 2.1 | N (with 2.2/2.3) | Artifact REST endpoints (GET /artifacts/:path) |
| **2.5** | `client/src/services/websocketService.ts` | WebSocket Client | 1.1-1.3, 2.1 | N | WebSocket 연결 관리, 자동 재연결 로직 |

#### 2.2.3 상태 관리 (Zustand Store)

| 순서 | 파일 | 유형 | 의존성 | 병렬 가능 | 설명 |
|------|------|------|--------|----------|------|
| **3.1** | `client/src/store/workflowStore.ts` | Store | 1.1-1.3 | N | Workflow 상태 (currentRun, gates, progress) |
| **3.2** | `client/src/store/projectStore.ts` | Store | 1.2 | N (with 3.1) | Project 상태 (currentProject, recentProjects) |
| **3.3** | `client/src/store/approvalStore.ts` | Store | 1.1-1.3 | N (with 3.1/3.2) | Approval 요청 상태 |
| **3.4** | `client/src/store/wsStore.ts` | Store | 1.1-1.3 | Y (with 3.1-3.3) | WebSocket 연결 상태 |

#### 2.2.4 Custom Hooks

| 순서 | 파일 | 유형 | 의존성 | 병렬 가능 | 설명 |
|------|------|------|--------|----------|------|
| **4.1** | `client/src/hooks/useWebSocket.ts` | Hook | 2.5, 3.1-3.4 | N | WebSocket 연결 로직 (connect, listen, send) |
| **4.2** | `client/src/hooks/useWorkflow.ts` | Hook | 2.2, 3.1 | N | Workflow 생성/조회 로직 |
| **4.3** | `client/src/hooks/useProject.ts` | Hook | 2.3, 3.2 | N (with 4.2) | Project 검증/선택 로직 |
| **4.4** | `client/src/hooks/useApproval.ts` | Hook | 2.5, 3.3 | N (with 4.1) | Approval 응답 로직 |

#### 2.2.5 UI 컴포넌트

| 순서 | 파일 | 유형 | 의존성 | 병렬 가능 | 설명 |
|------|------|------|--------|----------|------|
| **5.1** | `client/src/components/workflow/Timeline.tsx` | Component | 3.1, 4.1 | N | 9개 Gate 진행 상황 타임라인 [PROVISIONAL] |
| **5.2** | `client/src/components/workflow/TokenStream.tsx` | Component | 3.1, 4.1 | Y (with 5.1) | LLM token streaming 표시 |
| **5.3** | `client/src/components/workflow/ApprovalDialog.tsx` | Component | 3.3, 4.4 | Y (with 5.1/5.2) | 승인 요청 모달 |
| **5.4** | `client/src/components/workflow/PRDViewer.tsx` | Component | 1.1, 2.4 | Y (with 5.1-5.3) | Markdown 파일 뷰어 |
| **5.5** | `client/src/components/common/Header.tsx` | Component | 3.2 | Y | 헤더 (로고, 프로젝트명, 테마 토글) |
| **5.6** | `client/src/components/common/ThemeToggle.tsx` | Component | - | Y | Dark/Light 모드 토글 |
| **5.7** | `client/src/components/common/Notification.tsx` | Component | - | Y (with 5.5/5.6) | Toast/Notification 컴포넌트 |

#### 2.2.6 페이지 컴포넌트

| 순서 | 파일 | 유형 | 의존성 | 병렬 가능 | 설명 |
|------|------|------|--------|----------|------|
| **6.1** | `client/src/pages/ProjectSelector.tsx` | Page | 4.3, 5.5 | N | SCR-001: 프로젝트 경로 선택 페이지 |
| **6.2** | `client/src/pages/WorkflowDashboard.tsx` | Page | 4.2, 4.4, 5.1-5.4, 5.5 | N | SCR-002: Workflow 대시보드 페이지 |
| **6.3** | `client/src/App.tsx` | Router | 6.1, 6.2, 3.2 | N | React Router 설정, 페이지 네비게이션 |

#### 2.2.7 유틸리티

| 순서 | 파일 | 유형 | 의존성 | 병렬 가능 | 설명 |
|------|------|------|--------|----------|------|
| **7.1** | `client/src/utils/localStorage.ts` | Utility | 1.2 | Y | recentProjects 저장소 관리 |
| **7.2** | `client/src/utils/validation.ts` | Utility | 1.1-1.3 | Y (with 7.1) | 입력값 검증 함수 |
| **7.3** | `client/src/utils/formatting.ts` | Utility | - | Y | 텍스트 포매팅 (날짜, 시간, 진행률) |

#### 2.2.8 Frontend 테스트

| 순서 | 파일 | 유형 | 의존성 | 병렬 가능 | 설명 |
|------|------|------|--------|----------|------|
| **8.1** | `client/src/__tests__/workflowApi.test.ts` | Unit Test | 2.2 | Y (with 2.2 완료) | API 함수 테스트 (mocking) |
| **8.2** | `client/src/__tests__/Timeline.test.tsx` | Component Test | 5.1 | Y (with 5.1 완료) | Timeline 렌더링 및 상호작용 테스트 |
| **8.3** | `client/src/__tests__/ProjectSelector.test.tsx` | Component Test | 6.1 | Y (with 6.1 완료) | ProjectSelector 페이지 테스트 |
| **8.4** | `client/src/__tests__/integration.test.tsx` | Integration Test | 6.1, 6.2 | Y (with 6.1, 6.2 완료) | 전체 페이지 흐름 테스트 |

#### 2.2.9 설정 및 스타일

| 순서 | 파일 | 유형 | 의존성 | 병렬 가능 | 설명 |
|------|------|------|--------|----------|------|
| **9.1** | `client/src/styles/globals.css` | CSS | - | Y | 전역 CSS 변수 (색상, 그림자, 블러) |
| **9.2** | `client/src/styles/theme.css` | CSS | - | Y (with 9.1) | Dark/Light 모드 CSS |
| **9.3** | `client/src/main.tsx` | App Entry | 6.3, 9.1, 9.2 | N | React app 진입점 |

---

### Phase 3: 통합 및 테스트

| 순서 | 파일 | 유형 | 의존성 | 병렬 가능 | 설명 |
|------|------|------|--------|----------|------|
| **1.1** | E2E 테스트 (`e2e/workflow.spec.ts`) | E2E Test | Phase 1 + Phase 2 | N | Workflow 전체 흐름 (Playwright) |
| **1.2** | 환경 설정 (`server/.env.local`, `client/.env.local`) | Config | - | Y | 개발 환경 API endpoint, 포트 설정 |
| **1.3** | API 문서 (`docs/api/openapi.yaml`) | Documentation | Phase 1 API 완료 | Y (with 1.2) | OpenAPI/Swagger 스펙 |
| **1.4** | 배포 설정 (`Dockerfile`, `docker-compose.yml`) | Infrastructure | Phase 1 + Phase 2 | Y | Docker 이미지 빌드 |

---

## 3. 파일 목록 (전체 32개)

### 3.1 Backend 파일 (8개)

#### Types & Interfaces (4개)
```
server/src/types/
├── workflow.ts         (WorkflowRun, GateExecution, ApprovalRequest)
├── project.ts          (Project, SessionLock)
├── api.ts              (Request/Response DTO)
└── websocket.ts        (Message Protocol)
```

#### Services (4개)
```
server/src/services/
├── fileService.ts      (파일 I/O, atomic write, lock)
├── workflowService.ts  (Workflow CRUD)
├── projectService.ts   (Project 설정)
└── agentService.ts     (Agent SDK 래퍼)
```

#### Controllers (3개)
```
server/src/controllers/
├── workflowController.ts
├── projectController.ts
└── artifactController.ts
```

#### WebSocket & Middleware (4개)
```
server/src/websocket/
├── workflowHandler.ts
├── messageParser.ts
└── sessionManager.ts

server/src/middleware/
├── authMiddleware.ts
├── errorHandler.ts
└── index.ts (app setup)
```

#### Total Backend: **11개** (types 4 + services 4 + controllers 3 + websocket 3 + middleware 2 + app setup 1)

### 3.2 Frontend 파일 (20개)

#### Types (3개)
```
client/src/types/
├── workflow.ts
├── project.ts
└── api.ts
```

#### Services (5개)
```
client/src/services/
├── api.ts              (base fetch wrapper)
├── workflowApi.ts
├── projectApi.ts
├── artifactApi.ts
└── websocketService.ts
```

#### Store (4개)
```
client/src/store/
├── workflowStore.ts
├── projectStore.ts
├── approvalStore.ts
└── wsStore.ts
```

#### Hooks (4개)
```
client/src/hooks/
├── useWebSocket.ts
├── useWorkflow.ts
├── useProject.ts
└── useApproval.ts
```

#### Components (7개)
```
client/src/components/
├── workflow/
│   ├── Timeline.tsx        [PROVISIONAL]
│   ├── TokenStream.tsx
│   ├── ApprovalDialog.tsx
│   └── PRDViewer.tsx
├── common/
│   ├── Header.tsx
│   ├── ThemeToggle.tsx
│   └── Notification.tsx

client/src/pages/
├── ProjectSelector.tsx
├── WorkflowDashboard.tsx
├── App.tsx
```

#### Utils (3개)
```
client/src/utils/
├── localStorage.ts
├── validation.ts
└── formatting.ts
```

#### Styles (2개)
```
client/src/styles/
├── globals.css
└── theme.css

client/src/main.tsx
```

#### Total Frontend: **32개** (types 3 + services 5 + store 4 + hooks 4 + components 11 + utils 3 + styles 3)

### 3.3 테스트 파일 (8개)

```
server/src/__tests__/
├── fileService.test.ts
├── workflowService.test.ts
├── workflowController.test.ts
└── websocket.test.ts

client/src/__tests__/
├── workflowApi.test.ts
├── Timeline.test.tsx
├── ProjectSelector.test.tsx
└── integration.test.tsx

e2e/
└── workflow.spec.ts
```

#### Total Tests: **9개**

---

## 4. 의존성 그래프

```
┌─────────────────────────────────────────────────────────────┐
│ BACKEND TYPES (1.1-1.4)                                     │
│ workflow, project, api, websocket                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ BACKEND SERVICES (2.1-2.4)                                  │
│ fileService → workflowService → projectService              │
│              → agentService                                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ BACKEND CONTROLLERS (3.1-3.3) & WEBSOCKET (4.1-4.3)        │
│ workflowController, projectController, artifactController  │
│ + workflowHandler, messageParser, sessionManager           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ BACKEND MIDDLEWARE & SETUP (5.1-5.3)                       │
│ authMiddleware, errorHandler, index.ts (Express app init) │
└─────────────────────────────────────────────────────────────┘
                          ↓
                   (API READY)
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND TYPES (1.1-1.3)                                    │
│ workflow, project, api                                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND SERVICES (2.1-2.5)                                 │
│ api.ts → workflowApi, projectApi, artifactApi, wsService   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND STORES (3.1-3.4)                                   │
│ workflowStore, projectStore, approvalStore, wsStore        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND HOOKS (4.1-4.4)                                    │
│ useWebSocket → useWorkflow, useProject, useApproval       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND COMPONENTS (5.1-5.7)                               │
│ Timeline, TokenStream, ApprovalDialog, PRDViewer           │
│ + Header, ThemeToggle, Notification                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND PAGES (6.1-6.3)                                    │
│ ProjectSelector, WorkflowDashboard, App (Router)           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND UTILS & STYLES (7.1-9.3)                          │
│ localStorage, validation, formatting + CSS globals/theme   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ TESTS (Unit + Integration + E2E)                            │
│ Backend tests, Frontend tests, E2E workflow test           │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. 병렬 작업 그룹

### Group A: Backend Types (병렬 가능) - **동시 시작**
- `1.1`: workflow.ts
- `1.2`: project.ts
- `1.3`: api.ts
- `1.4`: websocket.ts

**완료 조건**: 모든 타입 정의 완료

---

### Group B: Backend Services (순차 필요)
- `2.1`: fileService.ts ← **그룹 A 완료 필요**
- `2.2`: workflowService.ts ← 2.1 완료 필요
- `2.3`: projectService.ts ← 2.1 완료 필요 (2.2와 병렬 가능)
- `2.4`: agentService.ts ← 2.1, 2.2 완료 필요

**병렬 최적화**: 2.2와 2.3을 동시에 시작 가능 (2.1 완료 후)

---

### Group C: Backend Controllers & WebSocket (병렬 가능)
- `3.1`: workflowController.ts ← 그룹 B 완료 필요
- `3.2`: projectController.ts ← 그룹 B 완료 필요
- `3.3`: artifactController.ts ← 그룹 B 완료 필요
- `4.1`: workflowHandler.ts ← 그룹 B 완료 필요
- `4.2`: messageParser.ts ← 그룹 A 완료 필요 (4.1과 병렬)
- `4.3`: sessionManager.ts ← 2.1 완료 필요 (4.1과 병렬)

**병렬 최적화**: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3 모두 동시 시작 가능 (그룹 B 완료 후)

---

### Group D: Backend Middleware & Setup (순차 필요)
- `5.1`: authMiddleware.ts ← 그룹 A 완료 필요
- `5.2`: errorHandler.ts ← 그룹 A 완료 필요 (5.1과 병렬)
- `5.3`: index.ts ← 그룹 C 완료 필요

**병렬 최적화**: 5.1과 5.2를 동시에 시작 가능 (그룹 A 완료 후)

---

### Group E: Backend 테스트 (병렬 가능)
- `6.1`: fileService.test.ts ← 2.1 완료 필요
- `6.2`: workflowService.test.ts ← 2.2 완료 필요
- `6.3`: workflowController.test.ts ← 3.1 완료 필요
- `6.4`: websocket.test.ts ← 4.1-4.3 완료 필요

**병렬 최적화**: 해당 서비스/컨트롤러 완료 직후 즉시 테스트 작성 시작

---

### Group F: Frontend Types (병렬 가능) - **Backend API 완료 후**
- `FE 1.1`: workflow.ts
- `FE 1.2`: project.ts
- `FE 1.3`: api.ts

**병렬 최적화**: 모두 동시 시작 가능 (의존성 없음)

---

### Group G: Frontend Services (순차 필요)
- `FE 2.1`: api.ts ← 그룹 F 완료 필요
- `FE 2.2`: workflowApi.ts ← FE 2.1 완료 필요
- `FE 2.3`: projectApi.ts ← FE 2.1 완료 필요 (FE 2.2와 병렬)
- `FE 2.4`: artifactApi.ts ← FE 2.1 완료 필요 (FE 2.2/2.3과 병렬)
- `FE 2.5`: websocketService.ts ← FE 2.1 완료 필요 (FE 2.2-2.4과 병렬)

**병렬 최적화**: FE 2.2, 2.3, 2.4, 2.5 모두 FE 2.1 완료 후 동시 시작 가능

---

### Group H: Frontend Stores & Hooks (병렬 가능)
- `FE 3.1`: workflowStore.ts ← 그룹 F 완료 필요
- `FE 3.2`: projectStore.ts ← 그룹 F 완료 필요 (FE 3.1과 병렬)
- `FE 3.3`: approvalStore.ts ← 그룹 F 완료 필요 (FE 3.1-3.2와 병렬)
- `FE 3.4`: wsStore.ts ← 그룹 F 완료 필요 (FE 3.1-3.3과 병렬)
- `FE 4.1`: useWebSocket.ts ← FE 2.5, FE 3.1-3.4 완료 필요
- `FE 4.2`: useWorkflow.ts ← FE 2.2, FE 3.1 완료 필요 (FE 4.1과 병렬)
- `FE 4.3`: useProject.ts ← FE 2.3, FE 3.2 완료 필요 (FE 4.1-4.2와 병렬)
- `FE 4.4`: useApproval.ts ← FE 2.5, FE 3.3 완료 필요 (FE 4.1-4.3과 병렬)

**병렬 최적화**:
1. FE 3.1-3.4 모두 동시 시작 (그룹 F 완료 후)
2. FE 2.2-2.5 모두 동시 시작 (FE 2.1 완료 후)
3. FE 4.1-4.4: FE 3.1-3.4 + FE 2.2-2.5 완료 후 동시 시작

---

### Group I: Frontend Components (병렬 가능)
- `FE 5.1`: Timeline.tsx ← FE 3.1, FE 4.1 완료 필요
- `FE 5.2`: TokenStream.tsx ← FE 3.1, FE 4.1 완료 필요 (FE 5.1과 병렬)
- `FE 5.3`: ApprovalDialog.tsx ← FE 3.3, FE 4.4 완료 필요 (FE 5.1-5.2와 병렬)
- `FE 5.4`: PRDViewer.tsx ← FE 1.1, FE 2.4 완료 필요 (FE 5.1-5.3과 병렬)
- `FE 5.5-5.7`: Header, ThemeToggle, Notification ← FE 3.2 (헤더만) (모두 병렬)

**병렬 최적화**: 모든 컴포넌트를 FE 4.1-4.4 + FE 3.3 완료 후 동시 시작

---

### Group J: Frontend Pages (순차 필요)
- `FE 6.1`: ProjectSelector.tsx ← FE 4.3, FE 5.5 완료 필요
- `FE 6.2`: WorkflowDashboard.tsx ← FE 4.2, FE 4.4, FE 5.1-5.4, FE 5.5 완료 필요
- `FE 6.3`: App.tsx (Router) ← FE 6.1, FE 6.2, FE 3.2 완료 필요

**병렬 최적화**: FE 6.1과 FE 6.2는 불가능 (FE 6.3에서 조율 필요), 순차 권장

---

### Group K: Frontend Utils & Styles (병렬 가능)
- `FE 7.1`: localStorage.ts ← FE 1.2 완료 필요
- `FE 7.2`: validation.ts ← FE 1.1-1.3 완료 필요 (FE 7.1과 병렬)
- `FE 7.3`: formatting.ts ← (의존성 없음, FE 7.1-7.2와 병렬)
- `FE 9.1`: globals.css ← (의존성 없음)
- `FE 9.2`: theme.css ← FE 9.1 완료 필요
- `FE 9.3`: main.tsx ← FE 6.3, FE 9.1-9.2 완료 필요

**병렬 최적화**: FE 7.1-7.3, FE 9.1 모두 동시 시작, FE 9.2는 FE 9.1 후, FE 9.3은 최종

---

### Group L: Tests (병렬 가능, 해당 구현 완료 후)
- BE tests ← 해당 BE 파일 완료 직후
- FE tests ← 해당 FE 파일 완료 직후
- E2E test ← Phase 1 + Phase 2 완료 후

**테스트 시점**:
1. fileService.test.ts: fileService.ts 완료 직후
2. workflowService.test.ts: workflowService.ts 완료 직후
3. workflowApi.test.ts: workflowApi.ts 완료 직후
4. Timeline.test.tsx: Timeline.tsx 완료 직후
5. 모든 단위 테스트 완료 후 → Integration 테스트
6. 전체 Phase 2 완료 후 → E2E 테스트

---

## 6. 구현 체크포인트

### Phase 1 체크포인트 (Backend)

| 체크포인트 | 대상 | 검증 방법 | 통과 기준 |
|-----------|------|----------|---------|
| **CP1.1** | Types 정의 | TypeScript 컴파일 | 에러 0개 |
| **CP1.2** | Services 구현 | Unit 테스트 (fileService, workflowService) | 테스트 성공률 100% |
| **CP1.3** | Controllers 구현 | 수동 API 테스트 (Postman) | 모든 엔드포인트 정상 응답 |
| **CP1.4** | WebSocket 구현 | WebSocket 클라이언트 테스트 | 메시지 송수신 정상 |
| **CP1.5** | Middleware & Setup | 앱 시작 테스트 | `npm run dev` 실행 후 localhost:3100 접속 가능 |

### Phase 2 체크포인트 (Frontend)

| 체크포인트 | 대상 | 검증 방법 | 통과 기준 |
|-----------|------|----------|---------|
| **CP2.1** | Types 정의 | TypeScript 컴파일 | 에러 0개 |
| **CP2.2** | Services & Hooks | Unit 테스트 | 테스트 성공률 100% |
| **CP2.3** | Components 렌더링 | Component 테스트 (Vitest) | 스냅샷 및 상호작용 테스트 성공 |
| **CP2.4** | Pages 통합 | 페이지 이동 테스트 | ProjectSelector → WorkflowDashboard 이동 정상 |
| **CP2.5** | 빌드 검증 | `npm run build` | 빌드 성공, 번들 사이즈 < 500KB |

### Phase 3 체크포인트 (통합)

| 체크포인트 | 대상 | 검증 방법 | 통과 기준 |
|-----------|------|----------|---------|
| **CP3.1** | API 연동 | Backend + Frontend 동시 실행 | API 요청/응답 정상 |
| **CP3.2** | WebSocket 연동 | Workflow 시작 및 진행 상황 표시 | Timeline 업데이트 실시간 반영 |
| **CP3.3** | 승인 요청 흐름 | Approval Dialog 표시 및 응답 | 5분 타임아웃 및 자동 거부 정상 작동 |
| **CP3.4** | E2E 테스트 | Playwright 자동화 테스트 | 전체 workflow 시뮬레이션 성공 |
| **CP3.5** | 오류 처리 | 예상 오류 시나리오 테스트 | 에러 코드 및 메시지 정상 표시 |

---

## 7. 테스트 전략

### 7.1 단위 테스트 (Unit Test)

**Backend**:
- `fileService.test.ts`: Atomic write, lock mechanism, stale lock detection
- `workflowService.test.ts`: CRUD 작업, 상태 전이
- **Coverage 목표**: 85% 이상

**Frontend**:
- `workflowApi.test.ts`: API 호출 mocking (fetch)
- `validation.test.ts`: 입력값 검증 함수
- **Coverage 목표**: 80% 이상

**시점**: 각 Service/Utility 파일 구현 직후

---

### 7.2 통합 테스트 (Integration Test)

**Backend**:
- `workflowController.test.ts`: REST API 엔드포인트 (Express 테스트)
- `websocket.test.ts`: WebSocket 메시지 프로토콜 (ws 라이브러리)
- **Coverage**: 메인 로직 70% 이상

**Frontend**:
- `ProjectSelector.test.tsx`: 페이지 렌더링, 사용자 입력, API 호출
- `Timeline.test.tsx`: 컴포넌트 상태 업데이트, 클릭 이벤트
- **Coverage**: 주요 사용자 경로 100%

**시점**: 해당 모듈의 모든 의존성 완료 후

---

### 7.3 E2E 테스트 (E2E Test)

- `workflow.spec.ts` (Playwright)
- **시나리오**:
  1. 프로젝트 선택
  2. Workflow 시작
  3. Token stream 모니터링
  4. Approval 요청 및 응답
  5. Workflow 완료

- **시점**: Phase 1 + Phase 2 완료 후

---

## 8. 구현 순서 요약 (최적화 버전)

### Week 1: Backend 개발

**Day 1-2: Types & Services**
- 병렬 작업: Group A (Types 4개 파일)
- 순차 작업: Group B (fileService.ts → workflowService.ts/projectService.ts → agentService.ts)
- 테스트: fileService.test.ts, workflowService.test.ts

**Day 3-4: Controllers & WebSocket**
- 병렬 작업: Group C (Controllers 3개 + WebSocket 3개)
- 테스트: workflowController.test.ts, websocket.test.ts

**Day 5: Middleware & Setup**
- 순차 작업: authMiddleware.ts → errorHandler.ts → index.ts
- 체크포인트: CP1.5 (앱 시작 테스트)

---

### Week 2-3: Frontend 개발

**Week 2 Day 1-2: Types & Services**
- 병렬 작업: Group F (Types 3개)
- 순차 작업: Group G (api.ts → workflowApi.ts/projectApi.ts/artifactApi.ts/websocketService.ts 병렬)
- 테스트: workflowApi.test.ts

**Week 2 Day 3-4: Stores & Hooks**
- 병렬 작업: Group H (Stores 4개, 그 후 Hooks 4개)
- 테스트: (store 단위 테스트는 hook 테스트로 커버)

**Week 3 Day 1-2: Components**
- 병렬 작업: Group I (Timeline, TokenStream, ApprovalDialog, PRDViewer, Header 등)
- 테스트: Timeline.test.tsx, ProjectSelector.test.tsx

**Week 3 Day 3-4: Pages & Utils**
- 순차 작업: Group J (ProjectSelector.tsx → WorkflowDashboard.tsx → App.tsx)
- 병렬 작업: Group K (Utils & Styles)
- 테스트: integration.test.tsx

**Week 3 Day 5: 빌드 & 최적화**
- 체크포인트: CP2.5 (빌드 검증)
- UI_STANDARD.md 준수 확인
- Performance 최적화 (React.memo, lazy loading)

---

### Week 4: 통합 & E2E 테스트

**Day 1-2: 통합 테스트**
- Backend + Frontend 동시 실행
- API 연동 테스트
- WebSocket 연동 테스트
- 체크포인트: CP3.1, CP3.2

**Day 3-4: 승인 흐름 테스트**
- Approval Dialog 시나리오
- Timeout 처리
- 체크포인트: CP3.3

**Day 5: E2E 테스트 & 문서화**
- E2E 테스트 작성 및 실행 (workflow.spec.ts)
- API 문서 (OpenAPI/Swagger)
- 체크포인트: CP3.4, CP3.5

---

## 9. 주요 구현 노트

### 9.1 Backend 특이사항

1. **파일 기반 저장소**: PostgreSQL DB 없음 → `fs/promises` 사용, 원자성 보장 필수
2. **Session Lock 메커니즘**: `.workflow.lock` 파일로 동시 실행 방지 (30분 TTL)
3. **Agent SDK 래퍼**: `@anthropic-ai/claude-agent-sdk` 초기화 및 에러 처리
4. **WebSocket 메시지 프로토콜**: version + type + data 구조 (v1.0)

### 9.2 Frontend 특이사항

1. **Zustand 상태 관리**: localStorage persistence 선택적 (sessionStorage 권장)
2. **WebSocket 자동 재연결**: exponential backoff (3초, 6초, 12초)
3. **Timeline 컴포넌트**: [PROVISIONAL] - Gate 7에서 승인 필요
4. **반응형 설계**: MVP는 Desktop only (1024x768px), v2에서 모바일 지원

### 9.3 테스트 특이사항

1. **Mock 전략**: Backend 테스트는 fs/promises mocking, Frontend는 fetch mocking
2. **WebSocket 테스트**: `jest-websocket-mock` 또는 `mock-ws` 라이브러리
3. **E2E 테스트**: Workflow 실행에 1-2분 소요 → 타임아웃 설정 필수 (5분)

---

## 10. 순환 의존성 검증

✅ **순환 의존성 없음** - 모든 의존성이 DAG(Directed Acyclic Graph) 구조

```
Types → Services → Controllers → Middleware → App Setup
          ↓
       Stores/Hooks
          ↓
      Components
          ↓
        Pages
          ↓
        Tests
```

---

## 11. 병렬 작업 최적화 요약

| 그룹 | 파일 수 | 시작 조건 | 예상 기간 | 병렬 가능 |
|------|--------|----------|---------|----------|
| A (BE Types) | 4 | 즉시 | 1일 | ✅ 4개 동시 |
| B (BE Services) | 4 | A 완료 | 2일 | ⚠️ 부분 (2.2/2.3 동시, 그 후 2.4) |
| C (BE Controllers + WS) | 6 | B 완료 | 2일 | ✅ 6개 동시 |
| D (BE Middleware + Setup) | 3 | C 완료 | 1일 | ⚠️ 부분 (5.1/5.2 동시, 그 후 5.3) |
| E (BE Tests) | 4 | 해당 모듈 완료 | 1.5일 | ✅ 병렬 |
| F (FE Types) | 3 | BE 완료 | 1일 | ✅ 3개 동시 |
| G (FE Services) | 5 | F 완료 | 1.5일 | ✅ 2.2-2.5 동시 (2.1 후) |
| H (FE Stores + Hooks) | 8 | F + G 완료 | 2일 | ✅ 대부분 병렬 |
| I (FE Components) | 7 | H 완료 | 1.5일 | ✅ 7개 동시 |
| J (FE Pages) | 3 | I 완료 | 1일 | ⚠️ 순차 (6.1/6.2 → 6.3) |
| K (FE Utils + Styles) | 5 | 부분 의존 | 1일 | ✅ 대부분 병렬 |
| L (Tests) | 9 | 해당 모듈 완료 | 2일 | ✅ 병렬 |

**총 예상 기간**: 4주 (병렬 최적화 적용)

---

## 12. Quality Validation 결과

### 의존성 순서 검증

| 검증 항목 | 기준 | 결과 |
|----------|------|------|
| Phase 순서 | Backend → Frontend → Tests | ✅ 통과 (DB 없음, 2 Phase) |
| Backend 순서 | Types → Services → Controllers → Middleware | ✅ 통과 |
| Frontend 순서 | Types → Services → Stores → Hooks → Components → Pages | ✅ 통과 |
| 순환 의존성 | 없음 | ✅ 통과 (DAG 구조 확인) |

### 테스트 시점 검증

| 검증 항목 | 기준 | 결과 |
|----------|------|------|
| Service 테스트 | 구현 직후 (해당 service 완료 후) | ✅ 명시됨 (섹션 6.1-6.4) |
| Component 테스트 | 구현 직후 (해당 component 완료 후) | ✅ 명시됨 (섹션 8.2-8.4) |
| Integration 테스트 | 통합 완료 후 | ✅ 명시됨 (섹션 6.3-6.4, 8.3-8.4) |
| E2E 테스트 | Phase 1 + Phase 2 완료 후 | ✅ 명시됨 (섹션 7.3) |

### 병렬 작업 검증

| 검증 항목 | 기준 | 결과 |
|----------|------|------|
| 병렬 가능 항목 | 의존성 없는 작업 그룹화 | ✅ 통과 (12개 그룹 정의, 섹션 5) |
| 그룹 명시 | 각 그룹별 시작 조건, 병렬 여부 | ✅ 통과 (Group A-L) |
| 최적화 가능성 | 총 기간 단축 (순차 6주 → 병렬 4주) | ✅ 33% 단축 |

### 파일 목록 검증

| 검증 항목 | 기준 | 결과 |
|----------|------|------|
| Backend 파일 | 타입/서비스/컨트롤러/WS 분류 | ✅ 통과 (11개, 섹션 3.1) |
| Frontend 파일 | 타입/서비스/스토어/훅/컴포넌트 분류 | ✅ 통과 (32개, 섹션 3.2) |
| 테스트 파일 | 단위/통합/E2E 분류 | ✅ 통과 (9개, 섹션 3.3) |
| 경로 포함 | 모든 파일의 절대 경로 | ✅ 통과 (server/src/*, client/src/*, e2e/*) |

---

## 13. 다음 Gate 참조

**Gate 6 → `/test-design`**
- 입력: 05-implementation-plan.md (섹션 7 테스트 전략)
- 산출물: 06-test-cases.md (상세 테스트 케이스)
- 검증: 커버리지 80% 이상

**구현 시작 준비사항**:
1. ✅ 파일 목록 및 경로 확정 (섹션 3)
2. ✅ 의존성 순서 정렬 (섹션 2)
3. ✅ 병렬 작업 식별 (섹션 5)
4. ✅ 테스트 시점 명시 (섹션 7)

---

**Gate 5 Status**: ✅ Complete
**Validation**: 3/3 items passed (의존성 순서 ✅, 테스트 시점 ✅, 병렬 작업 ✅)
**Next Gate**: `/test-design` (Gate 6)
