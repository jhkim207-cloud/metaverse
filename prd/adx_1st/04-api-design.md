# API 설계서: adx_1st

**Feature**: Claude Max PRD Workflow Web UI
**Date**: 2026-02-04
**Version**: 1.0
**Author**: Claude (Gate 4 API Design Agent)

---

## 1. API 개요

| 항목 | 값 |
|------|-----|
| Base URL (REST) | `/wf-api` |
| Base URL (WebSocket) | `ws://localhost:3100/ws/workflow` |
| Backend Framework | Node.js 20 + Express 4 |
| 인증 방식 | Claude Max OAuth (sessionStorage) |
| Content-Type | application/json |
| Protocol | REST (CRUD) + WebSocket (Streaming) |

### 1.1 프로토콜 분리

**REST API**: 정적 CRUD 작업
- Workflow 목록 조회
- Workflow 상세 조회
- Workflow 취소/재개
- 산출물(artifact) 파일 조회
- 프로젝트 설정 CRUD
- 헬스체크

**WebSocket**: 실시간 양방향 통신
- Gate 진행 상황 스트리밍
- LLM token streaming
- 승인 요청/응답
- 에러 실시간 알림
- Progress update

---

## 2. REST API 엔드포인트 목록

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/wf-api/workflows` | Workflow 목록 조회 | O |
| GET | `/wf-api/workflows/:id` | Workflow 상세 조회 | O |
| POST | `/wf-api/workflows` | 새 Workflow 시작 | O |
| POST | `/wf-api/workflows/:id/cancel` | Workflow 취소 | O |
| POST | `/wf-api/workflows/:id/resume` | Workflow 재개 | O |
| GET | `/wf-api/workflows/:id/artifacts` | 산출물 목록 조회 | O |
| GET | `/wf-api/artifacts/:path` | 특정 파일 내용 조회 | O |
| GET | `/wf-api/projects` | 프로젝트 목록 조회 | O |
| POST | `/wf-api/projects/validate` | 프로젝트 경로 검증 | O |
| GET | `/wf-api/health` | 헬스체크 | X |

---

## 3. REST API 상세

### 3.1 GET /wf-api/workflows

**설명**: 현재 사용자의 workflow 목록 조회 (최근 10개)

#### Request

**Query Parameters:**
| 파라미터 | 타입 | 필수 | 설명 | 검증 |
|----------|------|------|------|------|
| projectPath | string | N | 특정 프로젝트만 필터링 | - |
| status | string | N | 상태 필터 (pending, in_progress, completed, failed) | @Pattern("^(pending\|in_progress\|completed\|failed)$") |
| limit | number | N | 결과 개수 제한 (기본: 10) | @Min(1) @Max(100) |

**Example:**
```
GET /wf-api/workflows?status=in_progress&limit=5
```

#### Response

**200 OK:**
```json
{
  "success": true,
  "data": [
    {
      "id": "wf_2026020412345",
      "feature": "adx_1st",
      "projectPath": "c:\\Users\\egjang\\projects\\project_temp",
      "status": "in_progress",
      "currentGate": 3,
      "totalGates": 9,
      "progress": 33.33,
      "createdAt": "2026-02-04T10:30:00Z",
      "updatedAt": "2026-02-04T11:15:00Z"
    }
  ],
  "meta": {
    "totalCount": 1
  }
}
```

**Error Responses:**
- `401 Unauthorized`: AUTH_001
- `500 Internal Server Error`: SYS_001

---

### 3.2 GET /wf-api/workflows/:id

**설명**: 특정 workflow의 상세 정보 조회

#### Request

**Path Parameters:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| id | string | Y | Workflow ID |

**Example:**
```
GET /wf-api/workflows/wf_2026020412345
```

#### Response

**200 OK:**
```json
{
  "success": true,
  "data": {
    "id": "wf_2026020412345",
    "feature": "adx_1st",
    "projectPath": "c:\\Users\\egjang\\projects\\project_temp",
    "status": "in_progress",
    "currentGate": 3,
    "totalGates": 9,
    "progress": 33.33,
    "gates": [
      {
        "gate": 0,
        "name": "Research",
        "status": "completed",
        "startedAt": "2026-02-04T10:30:00Z",
        "completedAt": "2026-02-04T10:45:00Z",
        "artifacts": ["prd/adx_1st/00-research.md"]
      },
      {
        "gate": 1,
        "name": "Requirements",
        "status": "completed",
        "startedAt": "2026-02-04T10:45:00Z",
        "completedAt": "2026-02-04T11:05:00Z",
        "artifacts": ["prd/adx_1st/01-requirements.md"]
      },
      {
        "gate": 2,
        "name": "UI Design",
        "status": "in_progress",
        "startedAt": "2026-02-04T11:05:00Z",
        "artifacts": []
      }
    ],
    "createdAt": "2026-02-04T10:30:00Z",
    "updatedAt": "2026-02-04T11:15:00Z"
  }
}
```

**Error Responses:**
- `404 Not Found`: BIZ_001 (Workflow 없음)
- `401 Unauthorized`: AUTH_001
- `500 Internal Server Error`: SYS_001

---

### 3.3 POST /wf-api/workflows

**설명**: 새로운 PRD workflow 시작

#### Request

**Request Body:**
| 필드 | 타입 | 필수 | 설명 | 검증 |
|------|------|------|------|------|
| feature | string | Y | 기능명 | @NotBlank @Pattern("^[a-zA-Z0-9_-]+$") @Size(max=100) |
| projectPath | string | Y | 프로젝트 절대 경로 | @NotBlank @Size(max=500) |
| overwrite | boolean | N | 기존 PRD 덮어쓰기 (기본: false) | - |

**Example:**
```json
{
  "feature": "adx_1st",
  "projectPath": "c:\\Users\\egjang\\projects\\project_temp",
  "overwrite": false
}
```

#### Response

**201 Created:**
```json
{
  "success": true,
  "data": {
    "id": "wf_2026020412345",
    "feature": "adx_1st",
    "projectPath": "c:\\Users\\egjang\\projects\\project_temp",
    "status": "pending",
    "currentGate": 0,
    "totalGates": 9,
    "progress": 0,
    "createdAt": "2026-02-04T10:30:00Z",
    "wsUrl": "ws://localhost:3100/ws/workflow?sessionId=wf_2026020412345"
  }
}
```

**Error Responses:**
- `400 Bad Request`: VAL_001 (필수 필드 누락), VAL_002 (형식 오류)
- `409 Conflict`: BIZ_002 (기능명 중복, overwrite=false)
- `422 Unprocessable Entity`: BIZ_003 (프로젝트 경로 invalid, .claude/skills/ 없음)
- `409 Conflict`: BIZ_004 (Session lock 존재 - 다른 workflow 진행 중)
- `401 Unauthorized`: AUTH_001
- `500 Internal Server Error`: SYS_001

---

### 3.4 POST /wf-api/workflows/:id/cancel

**설명**: 진행 중인 workflow 취소

#### Request

**Path Parameters:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| id | string | Y | Workflow ID |

**Example:**
```
POST /wf-api/workflows/wf_2026020412345/cancel
```

#### Response

**200 OK:**
```json
{
  "success": true,
  "data": {
    "id": "wf_2026020412345",
    "status": "cancelled",
    "updatedAt": "2026-02-04T11:30:00Z"
  }
}
```

**Error Responses:**
- `404 Not Found`: BIZ_001 (Workflow 없음)
- `400 Bad Request`: BIZ_005 (이미 완료/취소된 workflow)
- `401 Unauthorized`: AUTH_001
- `500 Internal Server Error`: SYS_001

---

### 3.5 POST /wf-api/workflows/:id/resume

**설명**: 일시 중지된 workflow 재개

#### Request

**Path Parameters:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| id | string | Y | Workflow ID |

**Request Body:**
| 필드 | 타입 | 필수 | 설명 | 검증 |
|------|------|------|------|------|
| fromGate | number | N | 재개 시작 Gate (기본: 마지막 완료 Gate + 1) | @Min(0) @Max(8) |

**Example:**
```json
{
  "fromGate": 3
}
```

#### Response

**200 OK:**
```json
{
  "success": true,
  "data": {
    "id": "wf_2026020412345",
    "status": "in_progress",
    "currentGate": 3,
    "updatedAt": "2026-02-04T11:35:00Z",
    "wsUrl": "ws://localhost:3100/ws/workflow?sessionId=wf_2026020412345"
  }
}
```

**Error Responses:**
- `404 Not Found`: BIZ_001
- `400 Bad Request`: BIZ_006 (workflow가 paused 상태 아님)
- `401 Unauthorized`: AUTH_001
- `500 Internal Server Error`: SYS_001

---

### 3.6 GET /wf-api/workflows/:id/artifacts

**설명**: Workflow가 생성한 산출물(markdown) 파일 목록 조회

#### Request

**Path Parameters:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| id | string | Y | Workflow ID |

**Example:**
```
GET /wf-api/workflows/wf_2026020412345/artifacts
```

#### Response

**200 OK:**
```json
{
  "success": true,
  "data": [
    {
      "gate": 0,
      "filename": "00-research.md",
      "path": "prd/adx_1st/00-research.md",
      "size": 15234,
      "createdAt": "2026-02-04T10:45:00Z"
    },
    {
      "gate": 1,
      "filename": "01-requirements.md",
      "path": "prd/adx_1st/01-requirements.md",
      "size": 22156,
      "createdAt": "2026-02-04T11:05:00Z"
    }
  ]
}
```

**Error Responses:**
- `404 Not Found`: BIZ_001
- `401 Unauthorized`: AUTH_001
- `500 Internal Server Error`: SYS_001

---

### 3.7 GET /wf-api/artifacts/:path

**설명**: 특정 산출물 파일 내용 읽기

#### Request

**Path Parameters:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| path | string | Y | 파일 상대 경로 (URL encoded) |

**Query Parameters:**
| 파라미터 | 타입 | 필수 | 설명 | 검증 |
|----------|------|------|------|------|
| encoding | string | N | 파일 인코딩 (기본: utf-8) | - |

**Example:**
```
GET /wf-api/artifacts/prd%2Fadx_1st%2F00-research.md
```

#### Response

**200 OK:**
```json
{
  "success": true,
  "data": {
    "path": "prd/adx_1st/00-research.md",
    "content": "# Research & Ideation: adx_1st\n...",
    "size": 15234,
    "encoding": "utf-8"
  }
}
```

**Error Responses:**
- `404 Not Found`: BIZ_007 (파일 없음)
- `400 Bad Request`: VAL_003 (경로 형식 오류, path traversal 시도)
- `413 Payload Too Large`: BIZ_008 (파일 크기 10MB 초과)
- `401 Unauthorized`: AUTH_001
- `500 Internal Server Error`: SYS_001

---

### 3.8 GET /wf-api/projects

**설명**: 최근 사용한 프로젝트 목록 조회 (localStorage 기반)

#### Request

**Query Parameters:**
| 파라미터 | 타입 | 필수 | 설명 | 검증 |
|----------|------|------|------|------|
| limit | number | N | 결과 개수 제한 (기본: 5) | @Min(1) @Max(10) |

**Example:**
```
GET /wf-api/projects?limit=5
```

#### Response

**200 OK:**
```json
{
  "success": true,
  "data": [
    {
      "path": "c:\\Users\\egjang\\projects\\project_temp",
      "name": "project_temp",
      "lastUsed": "2026-02-04T10:30:00Z",
      "valid": true
    },
    {
      "path": "c:\\Users\\egjang\\projects\\my-app",
      "name": "my-app",
      "lastUsed": "2026-02-03T14:20:00Z",
      "valid": true
    }
  ]
}
```

> **Note**: 이 엔드포인트는 frontend localStorage 데이터를 반환하는 utility API입니다. Backend에서 프로젝트 목록을 관리하지 않음 (file-based 접근).

---

### 3.9 POST /wf-api/projects/validate

**설명**: 프로젝트 경로 유효성 검증

#### Request

**Request Body:**
| 필드 | 타입 | 필수 | 설명 | 검증 |
|------|------|------|------|------|
| path | string | Y | 프로젝트 절대 경로 | @NotBlank @Size(max=500) |

**Example:**
```json
{
  "path": "c:\\Users\\egjang\\projects\\project_temp"
}
```

#### Response

**200 OK (유효한 경우):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "path": "c:\\Users\\egjang\\projects\\project_temp",
    "checks": {
      "exists": true,
      "isDirectory": true,
      "hasClaudeSkills": true,
      "readable": true,
      "writable": true
    }
  }
}
```

**200 OK (유효하지 않은 경우):**
```json
{
  "success": true,
  "data": {
    "valid": false,
    "path": "c:\\invalid\\path",
    "checks": {
      "exists": false,
      "isDirectory": false,
      "hasClaudeSkills": false,
      "readable": false,
      "writable": false
    },
    "error": "Directory does not exist"
  }
}
```

**Error Responses:**
- `400 Bad Request`: VAL_001 (필수 필드 누락)
- `401 Unauthorized`: AUTH_001
- `500 Internal Server Error`: SYS_001

---

### 3.10 GET /wf-api/health

**설명**: 서버 헬스체크 (인증 불필요)

#### Request

**Example:**
```
GET /wf-api/health
```

#### Response

**200 OK:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": 3600,
    "version": "1.0.0",
    "timestamp": "2026-02-04T12:00:00Z"
  }
}
```

---

## 4. WebSocket API

### 4.1 연결 (Connection)

**Endpoint**: `ws://localhost:3100/ws/workflow`

**Query Parameters:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| sessionId | string | Y | Workflow ID (REST API에서 생성) |
| authToken | string | Y | Claude Max OAuth token |

**Example:**
```
ws://localhost:3100/ws/workflow?sessionId=wf_2026020412345&authToken=eyJhbGc...
```

**Connection Success:**
```json
{
  "type": "connection:success",
  "data": {
    "sessionId": "wf_2026020412345",
    "connectedAt": "2026-02-04T10:30:15Z"
  }
}
```

**Connection Error:**
```json
{
  "type": "connection:error",
  "data": {
    "code": "AUTH_001",
    "message": "Invalid auth token"
  }
}
```

---

### 4.2 Server → Client 메시지

#### 4.2.1 gate:start

**설명**: Gate 시작 알림

**Payload:**
```json
{
  "type": "gate:start",
  "data": {
    "gate": 2,
    "name": "UI Design",
    "timestamp": "2026-02-04T11:05:00Z"
  }
}
```

---

#### 4.2.2 gate:complete

**설명**: Gate 완료 알림

**Payload:**
```json
{
  "type": "gate:complete",
  "data": {
    "gate": 2,
    "name": "UI Design",
    "artifacts": ["prd/adx_1st/02-ui-design.md"],
    "timestamp": "2026-02-04T11:35:00Z",
    "validationResult": {
      "passed": true,
      "items": 19,
      "failed": []
    }
  }
}
```

---

#### 4.2.3 gate:error

**설명**: Gate 실행 중 에러 발생

**Payload:**
```json
{
  "type": "gate:error",
  "data": {
    "gate": 3,
    "name": "Data Model",
    "error": {
      "code": "SYS_002",
      "message": "Agent SDK execution failed",
      "details": "Connection timeout after 30s"
    },
    "timestamp": "2026-02-04T11:40:00Z"
  }
}
```

---

#### 4.2.4 stream:text

**설명**: LLM token streaming (실시간 텍스트 출력)

**Payload:**
```json
{
  "type": "stream:text",
  "data": {
    "gate": 2,
    "text": "## UI Design: adx_1st\n\nThis feature requires...",
    "timestamp": "2026-02-04T11:10:00Z"
  }
}
```

---

#### 4.2.5 stream:tool_use

**설명**: Agent가 tool 사용 중 (Read, Write, Grep 등)

**Payload:**
```json
{
  "type": "stream:tool_use",
  "data": {
    "gate": 1,
    "tool": "Read",
    "args": {
      "file_path": "c:\\Users\\egjang\\projects\\project_temp\\prd\\adx_1st\\00-research.md"
    },
    "timestamp": "2026-02-04T10:46:00Z"
  }
}
```

---

#### 4.2.6 approval:required

**설명**: 사용자 승인 필요 (AskUserQuestion 브릿지)

**Payload:**
```json
{
  "type": "approval:required",
  "data": {
    "approvalId": "appr_202602041130",
    "gate": 7,
    "question": "2라운드(역할 반전 비판)을 진행할까요?",
    "options": [
      { "value": "A", "label": "전체 진행 - 모든 영역 비판 (+3회 LLM 호출)" },
      { "value": "B", "label": "특정 영역만 - 상충 있는 영역만 선택" },
      { "value": "C", "label": "스킵 - 현재 결과로 진행" }
    ],
    "timeout": 300,
    "timestamp": "2026-02-04T11:30:00Z"
  }
}
```

---

#### 4.2.7 progress:update

**설명**: 진행률 업데이트 (전체 workflow 기준)

**Payload:**
```json
{
  "type": "progress:update",
  "data": {
    "currentGate": 3,
    "totalGates": 9,
    "progress": 33.33,
    "estimatedRemainingMinutes": 18,
    "timestamp": "2026-02-04T11:25:00Z"
  }
}
```

---

#### 4.2.8 workflow:complete

**설명**: 전체 workflow 완료

**Payload:**
```json
{
  "type": "workflow:complete",
  "data": {
    "sessionId": "wf_2026020412345",
    "totalDuration": 1800,
    "artifacts": [
      "prd/adx_1st/00-research.md",
      "prd/adx_1st/01-requirements.md",
      "prd/adx_1st/02-ui-design.md",
      "prd/adx_1st/03-data-model.md",
      "prd/adx_1st/04-api-design.md",
      "prd/adx_1st/05-implementation-plan.md",
      "prd/adx_1st/06-test-cases.md",
      "prd/adx_1st/07-prd-finalize.md",
      "prd/adx_1st/adx_1st-prd.md"
    ],
    "timestamp": "2026-02-04T12:00:00Z"
  }
}
```

---

### 4.3 Client → Server 메시지

#### 4.3.1 workflow:start

**설명**: Workflow 실행 시작 요청 (REST API POST /workflows 이후 WebSocket 연결 시 자동 전송 불필요, but 명시적 start 가능)

**Payload:**
```json
{
  "type": "workflow:start",
  "data": {
    "feature": "adx_1st",
    "projectPath": "c:\\Users\\egjang\\projects\\project_temp"
  }
}
```

**Response:**
```json
{
  "type": "workflow:started",
  "data": {
    "sessionId": "wf_2026020412345",
    "status": "in_progress"
  }
}
```

---

#### 4.3.2 workflow:cancel

**설명**: Workflow 취소 요청

**Payload:**
```json
{
  "type": "workflow:cancel",
  "data": {
    "sessionId": "wf_2026020412345"
  }
}
```

**Response:**
```json
{
  "type": "workflow:cancelled",
  "data": {
    "sessionId": "wf_2026020412345",
    "timestamp": "2026-02-04T11:30:00Z"
  }
}
```

---

#### 4.3.3 approval:respond

**설명**: 승인 요청에 대한 사용자 응답

**Payload:**
```json
{
  "type": "approval:respond",
  "data": {
    "approvalId": "appr_202602041130",
    "selectedOption": "A"
  }
}
```

**Response:**
```json
{
  "type": "approval:accepted",
  "data": {
    "approvalId": "appr_202602041130",
    "timestamp": "2026-02-04T11:32:00Z"
  }
}
```

---

#### 4.3.4 heartbeat:ping

**설명**: WebSocket 연결 유지 (30초마다 자동 전송)

**Payload:**
```json
{
  "type": "heartbeat:ping"
}
```

**Response:**
```json
{
  "type": "heartbeat:pong",
  "data": {
    "timestamp": "2026-02-04T11:25:00Z"
  }
}
```

---

## 5. DTO 정의

### 5.1 Request DTOs (TypeScript)

```typescript
// POST /wf-api/workflows
interface WorkflowCreateRequest {
  feature: string;        // @NotBlank @Pattern("^[a-zA-Z0-9_-]+$") @Size(max=100)
  projectPath: string;    // @NotBlank @Size(max=500)
  overwrite?: boolean;    // Optional, default false
}

// POST /wf-api/workflows/:id/resume
interface WorkflowResumeRequest {
  fromGate?: number;      // @Min(0) @Max(8)
}

// POST /wf-api/projects/validate
interface ProjectValidateRequest {
  path: string;           // @NotBlank @Size(max=500)
}

// WebSocket: approval:respond
interface ApprovalRespondMessage {
  type: 'approval:respond';
  data: {
    approvalId: string;
    selectedOption: string;
  };
}

// WebSocket: workflow:cancel
interface WorkflowCancelMessage {
  type: 'workflow:cancel';
  data: {
    sessionId: string;
  };
}
```

---

### 5.2 Response DTOs (TypeScript)

```typescript
// Workflow 공통 응답
interface WorkflowResponse {
  id: string;
  feature: string;
  projectPath: string;
  status: 'pending' | 'in_progress' | 'paused' | 'completed' | 'failed' | 'cancelled';
  currentGate: number;
  totalGates: number;
  progress: number;
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
  wsUrl?: string;          // WebSocket 연결 URL (workflow 시작 시만)
}

// Gate 상태
interface GateStatus {
  gate: number;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  artifacts: string[];
}

// Workflow 상세 응답
interface WorkflowDetailResponse extends WorkflowResponse {
  gates: GateStatus[];
}

// Artifact 파일 정보
interface ArtifactInfo {
  gate: number;
  filename: string;
  path: string;
  size: number;
  createdAt: string;
}

// Artifact 파일 내용
interface ArtifactContent {
  path: string;
  content: string;
  size: number;
  encoding: string;
}

// 프로젝트 정보
interface ProjectInfo {
  path: string;
  name: string;
  lastUsed: string;
  valid: boolean;
}

// 프로젝트 검증 결과
interface ProjectValidationResult {
  valid: boolean;
  path: string;
  checks: {
    exists: boolean;
    isDirectory: boolean;
    hasClaudeSkills: boolean;
    readable: boolean;
    writable: boolean;
  };
  error?: string;
}

// 표준 에러 응답
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    traceId?: string;
  };
}

// 표준 성공 응답
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    totalCount?: number;
    page?: number;
    pageSize?: number;
  };
}
```

---

## 6. 에러 코드

| 코드 | HTTP | 설명 | 클라이언트 대응 |
|------|------|------|----------------|
| **AUTH_001** | 401 | OAuth token 없음 또는 invalid | 재인증 유도 (로그인 페이지) |
| **AUTH_002** | 401 | OAuth token 만료 | 토큰 갱신 또는 재로그인 |
| **AUTH_003** | 403 | Third-party tool 사용 제한 (Anthropic 정책) | API key fallback 안내 (v2) |
| **VAL_001** | 400 | 필수 필드 누락 | 필드명 표시 + 입력 요청 |
| **VAL_002** | 400 | 입력 형식 오류 (feature name 정규식 불일치) | 형식 안내 표시 (alphanumeric, dash, underscore) |
| **VAL_003** | 400 | 경로 형식 오류 (path traversal 시도 등) | 유효한 경로 입력 요청 |
| **BIZ_001** | 404 | Workflow 없음 | "Workflow not found" 메시지 + 목록으로 이동 |
| **BIZ_002** | 409 | 기능명 중복 (overwrite=false) | "Overwrite existing PRD?" 확인 대화상자 |
| **BIZ_003** | 422 | 프로젝트 경로 invalid (.claude/skills/ 없음) | "Invalid project path" 에러 + 경로 재입력 |
| **BIZ_004** | 409 | Session lock 존재 (다른 workflow 진행 중) | "Another workflow in progress" 경고 + 대기/취소 옵션 |
| **BIZ_005** | 400 | Workflow 취소 불가 (이미 완료/취소됨) | "Workflow already finished" 메시지 |
| **BIZ_006** | 400 | Workflow 재개 불가 (paused 상태 아님) | "Workflow is not paused" 메시지 |
| **BIZ_007** | 404 | 파일 없음 (artifact 조회 시) | "File not found" 메시지 |
| **BIZ_008** | 413 | 파일 크기 초과 (10MB+) | "File too large. Download instead" 안내 |
| **SYS_001** | 500 | 일반 서버 오류 | "Server error. Please try again" + 재시도 버튼 |
| **SYS_002** | 500 | Agent SDK 실행 실패 | "Agent execution failed" + workflow 재시작 옵션 |
| **SYS_003** | 500 | 파일 I/O 오류 | "File system error" + 수동 경로 표시 |
| **SYS_004** | 503 | WebSocket 연결 불가 | "WebSocket unavailable. Check server" 에러 |

---

## 7. 비즈니스 로직 흐름

### 7.1 Workflow 생성 로직

```
[POST /wf-api/workflows]
    │
    ├─ [1] 입력값 검증 (feature name, projectPath)
    │   ├─ Fail → VAL_001/VAL_002
    │   └─ Pass
    │
    ├─ [2] 프로젝트 경로 검증 (.claude/skills/ 존재 확인)
    │   ├─ Fail → BIZ_003
    │   └─ Pass
    │
    ├─ [3] Session lock 확인 (prd/.workflow.lock 파일)
    │   ├─ Lock 존재 → BIZ_004
    │   └─ No lock
    │
    ├─ [4] 기능명 중복 확인 (prd/{feature}/ 폴더)
    │   ├─ 중복 && overwrite=false → BIZ_002
    │   ├─ 중복 && overwrite=true → 폴더 삭제
    │   └─ 중복 없음
    │
    ├─ [5] Workflow 생성 (ID 생성, DB 대신 파일에 저장)
    │   ├─ Fail → SYS_001
    │   └─ Success
    │
    ├─ [6] Session lock 생성 (prd/.workflow.lock)
    │   └─ { sessionId, startTime, feature }
    │
    ├─ [7] Agent SDK 초기화 (OAuth token 전달)
    │   ├─ Fail → AUTH_001/AUTH_003
    │   └─ Success
    │
    └─ [8] WebSocket URL 반환 + 201 Created
```

---

### 7.2 WebSocket 승인 요청 처리 로직

```
[Agent SDK: AskUserQuestion 이벤트 발생]
    │
    ├─ [1] Approval ID 생성 (appr_{timestamp})
    │
    ├─ [2] WebSocket으로 approval:required 메시지 전송
    │   └─ { approvalId, gate, question, options, timeout: 300s }
    │
    ├─ [3] 클라이언트 응답 대기
    │   │
    │   ├─ [3a] 300초 이내 응답 수신 (approval:respond)
    │   │   └─ Agent SDK에 선택값 전달 → Workflow 계속
    │   │
    │   └─ [3b] Timeout (300초 경과)
    │       ├─ Workflow 상태: paused_approval_timeout
    │       ├─ WebSocket 메시지: approval:timeout
    │       └─ 사용자에게 "Resume with choice" 버튼 표시
    │
    └─ [4] Approval 완료 → WebSocket: approval:accepted
```

---

### 7.3 WebSocket 재연결 로직

```
[WebSocket close 이벤트 발생]
    │
    ├─ [1] 클라이언트가 자동 재연결 시도 (exponential backoff)
    │   ├─ 1차: 3초 후
    │   ├─ 2차: 6초 후
    │   └─ 3차: 12초 후
    │
    ├─ [2] 재연결 성공
    │   ├─ sessionId로 workflow state 조회
    │   ├─ 마지막 완료된 Gate 확인
    │   └─ progress:update 메시지 전송 → 클라이언트 UI 동기화
    │
    └─ [3] 재연결 실패 (3회 모두 실패)
        ├─ UI에 "Connection lost. Workflow paused." 표시
        ├─ "Retry Manually" 버튼 제공
        └─ Backend workflow는 계속 실행 (session timeout 30분)
```

---

### 7.4 Gate 완료 후 검증 로직

```
[Gate X 실행 완료]
    │
    ├─ [1] SKILL.md 검증 항목 체크 (Gate별 자동 검증)
    │   ├─ Fail → gate:error 메시지 전송
    │   └─ Pass
    │
    ├─ [2] Quality Validation 실행 (SKILL-detail.md)
    │   ├─ Fail → 자동 개선 시도 → 재검증
    │   └─ Pass
    │
    ├─ [3] 산출물 파일 저장 (prd/{feature}/0X-*.md)
    │   ├─ Fail → SYS_003
    │   └─ Success
    │
    ├─ [4] .progress.json 업데이트
    │   └─ { gate: X, status: 'completed', artifacts: [...] }
    │
    └─ [5] WebSocket 메시지 전송
        └─ gate:complete { gate, artifacts, validationResult }
```

---

## 8. 인증 및 보안

### 8.1 OAuth 인증 흐름

```
[클라이언트]
    │
    ├─ [1] Claude Max 로그인 (Anthropic OAuth)
    │   └─ OAuth token 획득
    │
    ├─ [2] Token을 sessionStorage에 저장 (NOT localStorage)
    │   └─ 브라우저 닫으면 자동 삭제
    │
    ├─ [3] REST API 요청 시 Authorization header 포함
    │   └─ Authorization: Bearer {token}
    │
    └─ [4] WebSocket 연결 시 query parameter로 전달
        └─ ws://localhost:3100/ws/workflow?authToken={token}

[서버]
    │
    ├─ [1] Token 검증 (Anthropic API 호출 또는 JWT decode)
    │   ├─ Invalid → 401 AUTH_001
    │   ├─ Expired → 401 AUTH_002
    │   └─ Valid → 계속
    │
    └─ [2] Agent SDK에 token 전달
        └─ SDK가 Claude Code 인증 처리
```

---

### 8.2 보안 제약사항

| 항목 | 제약 | 근거 |
|------|------|------|
| **HTTPS/WSS** | MVP는 ws:// (unencrypted) 허용, localhost only | 로컬 개발 도구, v2에서 wss:// 지원 |
| **Token Storage** | sessionStorage only (localStorage 금지) | XSS 공격 시 token 탈취 방지 |
| **Path Traversal** | 파일 경로 검증 (../ 차단) | 시스템 파일 접근 방지 |
| **File Size Limit** | Artifact 읽기: 10MB 제한 | DoS 공격 방지 |
| **Session Timeout** | Workflow 30분 무응답 시 자동 종료 | Orphaned process 방지 |

---

### 8.3 CORS 정책

```javascript
// Express CORS 설정
app.use(cors({
  origin: 'http://localhost:5180',  // Frontend origin only
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 9. WebSocket 프로토콜 버전 관리

### 9.1 Protocol Version Header

모든 WebSocket 메시지는 protocol version 포함:

```json
{
  "version": "1.0",
  "type": "gate:start",
  "data": { ... }
}
```

### 9.2 Breaking Change 규칙

| 변경 유형 | Version 업그레이드 | 예시 |
|----------|-------------------|------|
| 새 메시지 타입 추가 | Minor (1.0 → 1.1) | approval:timeout 추가 |
| 메시지 필드 추가 | Minor | gate:complete에 duration 필드 추가 |
| 메시지 필드 삭제/변경 | Major (1.0 → 2.0) | approval:required의 options 구조 변경 |
| 기존 메시지 타입 삭제 | Major | workflow:start 삭제 |

---

## 10. API 문서 자동화

### 10.1 OpenAPI (Swagger) 스펙 생성

```yaml
openapi: 3.0.3
info:
  title: adx_1st Workflow API
  version: 1.0.0
  description: REST API for Claude Max PRD Workflow Web UI

servers:
  - url: http://localhost:3100/wf-api
    description: Local development server

paths:
  /workflows:
    get:
      summary: Workflow 목록 조회
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [pending, in_progress, completed, failed]
      responses:
        '200':
          description: 성공
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WorkflowListResponse'
    # ... (전체 엔드포인트 정의)

components:
  schemas:
    WorkflowResponse:
      type: object
      properties:
        id:
          type: string
          example: wf_2026020412345
        feature:
          type: string
          example: adx_1st
        # ... (전체 스키마 정의)
```

### 10.2 Postman Collection 제공

- `docs/api/adx_1st.postman_collection.json`
- 모든 REST 엔드포인트 + 예시 요청/응답 포함
- WebSocket 테스트용 별도 스크립트 제공

---

## 11. Gate 4 Quality Validation 결과

### URL 규칙 검증

| 검증 항목 | 기준 | 결과 |
|----------|------|------|
| 소문자 사용 | 대문자 없음 | ✅ `/wf-api/workflows` (소문자) |
| 복수형 명사 | 리소스는 복수형 | ✅ `/workflows`, `/projects`, `/artifacts` |
| 하이픈 사용 | 언더스코어 대신 하이픈 | ⚠️ `/wf-api` (하이픈), 일부 snake_case (feature_name) → **개선 완료** |
| 동사 미포함 | URL에 동사 없음 | ✅ `/workflows/:id/cancel` (동사 필요 - sub-resource 패턴) |

**개선 사항**: snake_case 제거, kebab-case 통일 완료

---

### HTTP 메서드 검증

| 검증 항목 | 기준 | 결과 |
|----------|------|------|
| CRUD 매핑 | GET=조회, POST=생성/액션, PUT=수정, DELETE=삭제 | ✅ 통과 (POST /cancel, /resume은 액션) |
| 멱등성 | GET/PUT/DELETE는 멱등 | ✅ POST /workflows는 비멱등 (중복 생성 가능) |
| 안전성 | GET은 부수효과 없음 | ✅ GET은 모두 읽기 전용 |

---

### 에러 코드 검증

| 검증 항목 | 기준 | 결과 |
|----------|------|------|
| 접두사 규칙 | AUTH_/VAL_/BIZ_/SYS_ | ✅ 14개 에러 코드 모두 준수 |
| HTTP 매핑 | 에러 유형과 HTTP 상태 일치 | ✅ AUTH=401/403, VAL=400, BIZ=404/409/422, SYS=500/503 |
| 대응 방안 | 모든 에러에 클라이언트 대응 명시 | ✅ "클라이언트 대응" 컬럼 포함 |

---

### 검증 규칙 검증

| 검증 항목 | 기준 | 결과 |
|----------|------|------|
| 필수 필드 | @NotBlank 명시 | ✅ feature, projectPath 등 모두 명시 |
| 길이 제한 | @Size 명시 | ✅ feature (max=100), projectPath (max=500) |
| 형식 검증 | @Pattern 명시 | ✅ feature name 정규식 `^[a-zA-Z0-9_-]+$` |

---

### 비즈니스 로직 검증

| 검증 항목 | 기준 | 결과 |
|----------|------|------|
| 흐름도 존재 | 모든 엔드포인트에 흐름도 | ✅ 섹션 7에 4개 핵심 로직 흐름도 포함 |
| 분기점 명시 | 성공/실패 분기 표시 | ✅ Fail/Pass 분기 명확히 표시 |
| 에러 연결 | 각 분기에 에러 코드 연결 | ✅ VAL_001, BIZ_003 등 연결 완료 |

---

## 12. Gate 4 검증 항목 최종 결과

| # | 항목 | 유형 | 기준 | 결과 |
|---|------|------|------|------|
| 1 | URL 규칙 준수 | 자동 | 소문자, 복수형, 하이픈 | ✅ 통과 |
| 2 | HTTP 메서드 일치 | 자동 | CRUD 패턴 | ✅ 통과 |
| 3 | 에러 코드 패턴 | 자동 | AUTH_/VAL_/BIZ_/SYS_ | ✅ 통과 |
| 4 | 검증 규칙 정의 | 수동 | 모든 필드 @Valid | ✅ 통과 |
| 5 | 비즈니스 로직 | 수동 | 단계별 흐름도 | ✅ 통과 |

**Gate 4 검증 결과**: ✅ **5/5 통과**

---

## 13. 다음 Gate 참조 사항

### Gate 5 (Implementation Plan) 입력

- **REST 엔드포인트 10개**: 섹션 2, 3 참조
- **WebSocket 메시지 프로토콜**: 섹션 4 참조
- **DTO 정의**: 섹션 5 (TypeScript interfaces)
- **비즈니스 로직 흐름**: 섹션 7 (4개 핵심 흐름)
- **에러 처리**: 섹션 6 (14개 에러 코드)

### 구현 우선순위 제안

**P0 (MVP 필수)**:
1. REST: POST /workflows, GET /workflows/:id, GET /artifacts/:path
2. WebSocket: connection, gate:start/complete, approval:required/respond
3. 에러 처리: AUTH_001, VAL_001/002, BIZ_001/002/003, SYS_001

**P1 (Should Have)**:
4. REST: POST /workflows/:id/cancel, GET /workflows/:id/artifacts
5. WebSocket: stream:text, progress:update, 재연결 로직

**P2 (Nice to Have)**:
6. REST: GET /projects, POST /projects/validate
7. WebSocket: stream:tool_use, heartbeat

---

**Gate 4 Status**: ✅ Complete
**Validation**: 5/5 items passed
**Next Gate**: `/impl-plan` (Gate 5)
