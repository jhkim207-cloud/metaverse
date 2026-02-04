# Research & Ideation: adx_1st

**Feature**: Claude Max PRD Workflow Web UI
**Date**: 2026-02-04
**Author**: Claude (Gate 0 Research Agent)

---

## Executive Summary

adx_1st is a web-based tool that transforms the CLI-based PRD workflow system into an interactive web UI, leveraging Claude Agent SDK and Claude Max subscriptions. This research identifies critical architectural patterns, security considerations, and UX opportunities for building a production-ready workflow automation interface.

**Key Finding**: Recent Anthropic policy changes (Jan 2026) restrict OAuth tokens for third-party tools, requiring careful authentication architecture design.

---

## 1. Best Practice 분석

### 1.1 업계 표준

#### BP-1: Agent SDK Headless Execution Pattern
**출처**: [Claude Agent SDK Documentation](https://platform.claude.com/docs/en/agent-sdk/overview), [Claude Code Headless Docs](https://code.claude.com/docs/en/headless)

**설명**: Claude Agent SDK는 programmatic tool calling을 통해 Claude Code를 headless mode로 실행할 수 있는 공식 API를 제공합니다. SDK는 conversational state를 유지하며 persistent environment에서 명령을 실행합니다.

**적용 방안**:
```typescript
import { AgentSDK } from '@anthropic-ai/claude-agent-sdk';

const agent = new AgentSDK({
  projectPath: userConfig.targetProjectPath,
  authMode: 'oauth', // Claude Max subscription
  workspace: 'isolated' // sandboxed execution
});

// Execute skill with streaming
const stream = await agent.executeSkill('/research', {
  feature: 'adx_1st',
  onProgress: (event) => wsServer.broadcast(event)
});
```

**장점**:
- Official SDK로 안정적 업데이트 보장
- Conversational context 자동 관리
- Built-in tool execution (file I/O, bash, grep)

**단점**:
- OAuth token 제한 (third-party tool 사용 불가 가능성)
- Subscription dependency (Max plan 필수)

---

#### BP-2: WebSocket Bidirectional Streaming for Real-time Agent Interaction
**출처**: [Amazon Bedrock AgentCore Runtime](https://aws.amazon.com/blogs/machine-learning/bi-directional-streaming-for-real-time-agent-interactions-now-available-in-amazon-bedrock-agentcore-runtime/), [Render: Real-Time AI Chat](https://render.com/articles/real-time-ai-chat-websockets-infrastructure)

**설명**: 2026년 AI agent infrastructure는 WebSocket 기반 양방향 스트리밍을 표준으로 채택하여 token streaming, progress updates, user approval 요청을 실시간으로 처리합니다.

**적용 방안**:
```typescript
// Backend: ws (WebSocket server)
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3100 });

wss.on('connection', (ws) => {
  // Agent progress streaming
  agent.on('token', (token) => {
    ws.send(JSON.stringify({ type: 'token', data: token }));
  });

  // User approval bridge
  agent.on('askUserQuestion', async (question) => {
    const response = await new Promise((resolve) => {
      ws.send(JSON.stringify({ type: 'approval', data: question }));
      ws.once('message', (msg) => resolve(JSON.parse(msg)));
    });
    agent.sendUserResponse(response);
  });
});

// Frontend: WebSocket client
const ws = new WebSocket('ws://localhost:3100');
ws.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data);
  if (type === 'token') updateStreamingOutput(data);
  if (type === 'approval') showApprovalDialog(data);
};
```

**장점**:
- Full-duplex 통신 (server → client, client → server)
- Low latency (real-time progress)
- Connection state 유지 (long-running workflows)

**단점**:
- Connection management 복잡성 (reconnection, heartbeat)
- Scalability 제약 (1 connection = 1 workflow session)

---

#### BP-3: Human-in-the-loop Circuit Breaker Pattern
**출처**: [Microsoft Copilot Agent Flows](https://www.microsoft.com/en-us/microsoft-copilot/blog/copilot-studio/introducing-agent-flows-transforming-automation-with-ai-first-workflows/), [Dextra Labs: AI Agentic Workflow Patterns](https://dextralabs.com/blog/ai-agentic-workflow-patterns-for-enterprises/)

**설명**: Enterprise AI agent systems는 high-stakes decisions에 대해 human approval을 필수화하여 trust와 governance를 보장합니다. Microsoft Copilot Studio는 multi-stage approval, delegation, escalation을 지원합니다.

**적용 방안**:
```typescript
// Approval configuration
const approvalConfig = {
  gates: {
    0: { auto: false, reason: 'Research validation' },
    1: { auto: false, reason: 'Requirements review' },
    2: { auto: true },  // UI Design - auto proceed
    7: { auto: false, reason: 'PRD finalization' }
  },
  provisionalItems: {
    autoApprove: false, // Always ask for new terms/components
    notifyOn: ['ui-component', 'db-term']
  }
};

// Approval bridge
class ApprovalBridge {
  async requestApproval(gate: number, data: any): Promise<boolean> {
    if (approvalConfig.gates[gate]?.auto) return true;

    return new Promise((resolve) => {
      this.wsServer.send({
        type: 'approval_request',
        gate,
        data,
        timeout: 300000 // 5 min
      });

      this.once('approval_response', (response) => {
        resolve(response.approved);
      });
    });
  }
}
```

**장점**:
- Trust & safety (human oversight)
- Compliance (audit trail)
- Learning feedback (user corrections improve future runs)

**단점**:
- Workflow interruption (waiting for approval)
- Timeout handling complexity

---

#### BP-4: Container-based Sandboxed Execution Environment
**출처**: [Claude Agent SDK Hosting Guide](https://platform.claude.com/docs/en/agent-sdk/hosting), [NanoClaw Architecture](https://deepwiki.com/gavrielc/nanoclaw)

**설명**: Agent SDK는 보안과 격리를 위해 sandboxed container 환경에서 실행되어야 하며, process isolation, resource limits, network control, ephemeral filesystems를 제공합니다.

**적용 방안**:
```dockerfile
# Dockerfile for Agent SDK execution
FROM node:20-alpine

# Create isolated workspace
RUN adduser -D -u 1001 agent
WORKDIR /workspace

# Install SDK
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Security: non-root user
USER agent

# Resource limits (via docker-compose)
# mem_limit: 2g
# cpus: 2

ENTRYPOINT ["node", "agent-server.js"]
```

**장점**:
- Security isolation (malicious code 방지)
- Resource control (메모리/CPU 제한)
- Clean state (ephemeral container per workflow)

**단점**:
- Deployment 복잡성 증가
- Local dev tool로는 over-engineering 가능성

---

### 1.2 오픈소스 사례

| 프로젝트 | 특징 | 참고할 점 |
|----------|------|-----------|
| **OpenAgentsControl** | Plan-first AI agent framework with approval-based execution | Multi-stage approval mechanism, 자동 testing/code review 통합 |
| **NanoClaw** | Personal Claude assistant (Node.js, WhatsApp integration) | Single Node.js process architecture, containerized execution |
| **Pydantic AI + FastAPI + React** | Full-stack AI agent with streaming | FastAPI backend, React TypeScript frontend, real-time streaming |
| **n8n** | Workflow automation platform with AI co-pilot | Visual workflow builder, deterministic execution, multi-step logic |
| **Windmill** | Self-hosted developer-focused workflow tool | File-based storage, TypeScript/Python support, approval workflows |

**핵심 인사이트**:
- 대부분의 AI workflow tools가 **visual workflow builder** 제공
- **File-based configuration** (YAML, JSON) 선호 (DB 불필요)
- **Approval mechanism**이 enterprise adoption의 핵심 요소

---

### 1.3 상용 서비스 벤치마킹

| 서비스 | UX 특징 | 기술적 접근 |
|--------|---------|-------------|
| **Zapier (2026)** | Multi-step logic, AI-based classification, recovery paths | REST + WebSocket hybrid, visual DAG editor |
| **Workato** | Enterprise governance, audit trail, role-based approval | Multi-tenant architecture, compliance logging |
| **Microsoft Copilot Studio** | Agent flows, human-in-the-loop actions | Graph-based workflow, Azure Functions backend |
| **ChatPRD** | AI-generated PRD from single prompt | Single-page app, real-time markdown preview |

**핵심 인사이트**:
- **Visual progress tracking** (DAG/timeline view) 필수
- **Real-time preview** (markdown rendering)
- **Multi-project workspace** (folder selector)

---

## 2. Anti-pattern 목록

| Anti-pattern | 위험도 | 회피 전략 |
|--------------|--------|-----------|
| **AP-1: OAuth Token Third-Party Abuse** | 높음 | Anthropic 정책(2026-01) 위반: Claude Max OAuth token을 third-party tool에서 사용 시 "This credential is only authorized for use with Claude Code" 에러. **회피**: API key 병행 지원 또는 공식 SDK 범위 내 사용 확인 |
| **AP-2: Synchronous Workflow Execution** | 중간 | Long-running workflow(Gate 0~8, 수십 분 소요)를 synchronous API로 실행 시 timeout, connection drop. **회피**: WebSocket streaming + background task queue 사용 |
| **AP-3: Shared Mutable State Across Sessions** | 높음 | 여러 workflow session이 동일 file system state를 공유 시 race condition, file corruption. **회피**: Session-isolated workspace (임시 디렉토리 또는 container) |
| **AP-4: Hardcoded Project Path** | 낮음 | Target project path를 하드코딩 시 단일 프로젝트에만 사용 가능. **회피**: UI에서 프로젝트 경로 선택 기능 (localStorage 저장) |
| **AP-5: No Approval Timeout** | 중간 | User approval 요청 시 timeout 없이 무한 대기 시 workflow hang. **회피**: 5분 timeout + auto-reject or notify |
| **AP-6: Unencrypted WebSocket** | 높음 | ws:// (unencrypted) 사용 시 OAuth token이 plain text로 전송. **회피**: wss:// (TLS) 사용 또는 localhost-only 제한 |

---

## 3. LLM 창의적 아이디어

### 3.1 UX 개선 아이디어

#### 💡 아이디어 1: Interactive Gate Dependency Graph
**설명**: PRD workflow의 9개 Gate를 D3.js 기반 interactive graph로 시각화. 현재 진행 중인 Gate는 pulsing animation, 완료된 Gate는 녹색, 대기 중은 회색으로 표시. 각 노드 클릭 시 해당 Gate의 산출물(markdown) 미리보기.

**채택 여부**: ✓ 채택

**근거**:
- **Pro**: Visual feedback이 CLI 대비 명확한 차별점. Workflow 전체 구조 이해 용이.
- **Pro**: 기존 n8n, Zapier의 검증된 UX 패턴.
- **Con**: D3.js 학습 곡선 존재하지만, react-flow 같은 라이브러리로 대체 가능.
- **결정**: MVP에서 간단한 timeline view로 시작, v2에서 graph로 업그레이드.

---

#### 💡 아이디어 2: Split-pane Markdown Editor with Real-time Sync
**설명**: 생성된 PRD markdown을 좌측 editor, 우측 preview로 표시. User가 직접 편집 가능하고 저장 시 파일 시스템에 반영. Monaco Editor + remark 사용.

**채택 여부**: ✓ 채택

**근거**:
- **Pro**: ChatPRD의 핵심 기능. Markdown 검토/수정이 CLI보다 훨씬 편리.
- **Pro**: Monaco Editor는 VSCode와 동일한 편집 경험 제공.
- **Con**: File sync 충돌 가능성 (Agent가 동시에 파일 수정 시).
- **결정**: Read-only mode during execution, editable after Gate completion.

---

#### 💡 아이디어 3: Multi-Feature Workspace with Tabs
**설명**: 동시에 여러 feature의 PRD workflow를 실행하고 tab으로 전환. 각 tab은 독립적인 WebSocket 연결 유지.

**채택 여부**: ✗ 미채택 (v1)

**근거**:
- **Pro**: Power user에게 유용 (여러 feature 병렬 작업).
- **Con**: WebSocket connection 수 증가 → backend resource 부담.
- **Con**: Approval 요청이 여러 tab에서 동시 발생 시 UX 혼란.
- **결정**: MVP는 single active workflow로 제한, v2에서 재검토.

---

### 3.2 기술적 혁신 제안

#### 💡 아이디어 4: Offline Mode with IndexedDB Caching
**설명**: 생성된 PRD 문서를 IndexedDB에 캐싱하여 offline에서도 조회 가능. WebSocket 끊김 시 reconnection 후 자동 재개.

**채택 여부**: ✓ 채택

**근거**:
- **Pro**: Network 불안정 환경에서 robustness 향상.
- **Pro**: Page refresh 시에도 workflow state 복구 가능.
- **Con**: IndexedDB API 복잡성.
- **결정**: Zustand persist middleware + IndexedDB 사용.

---

#### 💡 아이디어 5: Agent SDK Wrapper with Retry Logic
**설명**: Claude Agent SDK 호출을 wrapping하여 transient error 발생 시 exponential backoff retry (최대 3회).

**채택 여부**: ✓ 채택

**근거**:
- **Pro**: Network glitch, rate limit 등의 일시적 오류 대응.
- **Pro**: User에게 error 노출 전에 자동 복구 시도.
- **Con**: Retry 중 latency 증가 가능성.
- **결정**: Retry on 5xx errors, not on 4xx (client errors).

---

#### 💡 아이디어 6: Plugin System for Custom Skills
**설명**: .claude/skills/ 외부에 사용자 정의 skill을 추가할 수 있는 plugin 시스템. JavaScript module로 skill 정의.

**채택 여부**: ✗ 미채택 (scope creep)

**근거**:
- **Pro**: Extensibility (사용자 커스터마이징).
- **Con**: Security risk (arbitrary code execution).
- **Con**: MVP 범위 초과 (core workflow에 집중 필요).
- **결정**: Phase 2에서 검토.

---

### 3.3 비즈니스 가치 아이디어

#### 💡 아이디어 7: Team Collaboration with Shared Workspace
**설명**: 여러 개발자가 동일한 PRD workflow를 공유하고 approval 투표 (2/3 찬성 시 진행).

**채택 여부**: ✗ 미채택 (v1)

**근거**:
- **Pro**: 팀 환경에서 가치 높음.
- **Con**: Multi-user state sync 복잡도 (CRDTs 또는 central DB 필요).
- **Con**: "로컬 개발 도구" 컨셉과 불일치.
- **결정**: Solo developer 우선, team feature는 future roadmap.

---

#### 💡 아이디어 8: Export to Notion/Confluence
**설명**: 생성된 PRD markdown을 Notion 또는 Confluence로 one-click export. API 연동.

**채택 여부**: ✓ 채택 (v2)

**근거**:
- **Pro**: 조직 workflow와 통합 (PRD를 문서 시스템에 저장).
- **Pro**: 비교적 간단한 구현 (Notion/Confluence API 사용).
- **Con**: v1에서는 file export (markdown, PDF)로 충분.
- **결정**: v1 - markdown download, v2 - API integration.

---

## 4. 최종 권장 접근법

### 핵심 설계 원칙

1. **SDK-First Architecture**: Claude Agent SDK를 core로 사용하되, OAuth 제약 발생 시 API key fallback 준비.
2. **Real-time First**: WebSocket 기반 bidirectional streaming으로 token, progress, approval 모두 실시간 처리.
3. **Human-in-the-loop by Default**: 모든 Gate 완료 시 user approval 필수 (governance).
4. **Local-first, File-based**: Database 없이 file system + IndexedDB로 state 관리 (단순성).
5. **Security by Design**: wss:// (TLS), sandboxed execution, OAuth token secure storage.

---

### 채택된 Best Practice

1. **BP-1**: Agent SDK Headless Execution Pattern → Core architecture
2. **BP-2**: WebSocket Bidirectional Streaming → Real-time communication
3. **BP-3**: Human-in-the-loop Circuit Breaker → Approval mechanism
4. **BP-4**: Container-based Sandboxing → v2 (local dev에서는 optional)

---

### 채택된 창의적 아이디어

1. **아이디어 1**: Interactive Gate Dependency Graph (simplified timeline in v1)
2. **아이디어 2**: Split-pane Markdown Editor with Real-time Sync
3. **아이디어 4**: Offline Mode with IndexedDB Caching
4. **아이디어 5**: Agent SDK Wrapper with Retry Logic
5. **아이디어 8**: Export to Notion/Confluence (v2)

---

### 기술 스택 권장사항

#### Frontend
```json
{
  "core": "React 18 + Vite 6 + TypeScript 5",
  "ui": "Tailwind CSS + shadcn/ui (or MUI)",
  "state": "Zustand + persist middleware",
  "ws": "native WebSocket API",
  "editor": "Monaco Editor (VSCode)",
  "markdown": "remark + react-markdown",
  "storage": "IndexedDB (idb library)"
}
```

#### Backend
```json
{
  "runtime": "Node.js 20 LTS",
  "framework": "Express 4",
  "ws": "ws (WebSocket library)",
  "sdk": "@anthropic-ai/claude-agent-sdk",
  "auth": "OAuth 2.0 (Anthropic)",
  "storage": "fs (file system)",
  "process": "child_process (for SDK execution)"
}
```

#### DevOps (v2)
```json
{
  "container": "Docker + docker-compose",
  "security": "wss:// (TLS), CORS policy",
  "monitoring": "Winston (logging), optional Sentry"
}
```

---

### 아키텍처 플로우

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (5180)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Project  │  │ Workflow │  │ Approval │  │ Markdown │    │
│  │ Selector │  │ Timeline │  │  Dialog  │  │  Viewer  │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       │             │              │             │           │
│       └─────────────┴──────────────┴─────────────┘           │
│                         │                                    │
│                    WebSocket Client                          │
│                         │                                    │
└─────────────────────────┼────────────────────────────────────┘
                          │
                   wss://localhost:3100
                          │
┌─────────────────────────┼────────────────────────────────────┐
│                    Node.js Backend (3100)                     │
│  ┌──────────────────────┴────────────────────────┐           │
│  │          WebSocket Server (ws)                │           │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────┐ │           │
│  │  │  Session   │  │  Approval  │  │  Token  │ │           │
│  │  │  Manager   │  │   Bridge   │  │ Stream  │ │           │
│  │  └────┬───────┘  └────┬───────┘  └────┬────┘ │           │
│  └───────┼───────────────┼──────────────┼────────┘           │
│          │               │              │                    │
│  ┌───────┴───────────────┴──────────────┴────────┐           │
│  │     Agent SDK Wrapper (retry, error handling) │           │
│  └───────────────────┬────────────────────────────┘           │
│                      │                                        │
│         @anthropic-ai/claude-agent-sdk                        │
│                      │                                        │
└──────────────────────┼────────────────────────────────────────┘
                       │
                 OAuth (Max)
                       │
           ┌───────────┴───────────┐
           │  Claude Code Engine   │
           │    (Max Subscription) │
           └───────────────────────┘
                       │
           Executes .claude/skills/
                       │
                   File System
                       │
           prd/{feature}/0X-*.md
```

---

### 핵심 구현 플랜 (Phase 분리)

#### Phase 1 (MVP - 80%)
- [ ] Backend: Express + ws setup
- [ ] Agent SDK integration (headless mode)
- [ ] WebSocket bidirectional streaming
- [ ] Frontend: React + Vite + TypeScript
- [ ] Basic timeline UI (Gate 0~8 progress)
- [ ] Approval dialog (AskUserQuestion bridge)
- [ ] Markdown viewer (read-only)
- [ ] Project path selector (localStorage)

#### Phase 2 (Completion - 20%)
- [ ] Monaco Editor (split-pane editing)
- [ ] IndexedDB caching (offline mode)
- [ ] Interactive graph (react-flow)
- [ ] Export to Notion/Confluence
- [ ] Docker containerization
- [ ] wss:// (TLS) support
- [ ] Error recovery UI

---

## 5. 멀티 LLM 분석 결과

### 5.1 Execution Note

**Multi-LLM Analysis Status**: ⚠️ Tool Unavailable

The workflow rules require multi-LLM collaboration for new domain/feature development. However, the `mcp__zen__chat` tool was not available in this execution environment.

**Attempted Models**:
- GPT-5.2 (technical architecture analysis)
- Gemini-3-Pro (UX/business perspective)

**Fallback Approach**:
Claude performed comprehensive single-LLM analysis incorporating:
- Industry best practices from web research (2026 sources)
- Technical architecture patterns (Agent SDK, WebSocket streaming)
- UX insights from competitive analysis (Zapier, n8n, Copilot Studio)
- Security considerations (OAuth restrictions, sandboxing)

**Recommendation**: If multi-LLM collaboration becomes available, re-run Gate 0 with GPT-5.2 and Gemini-3-Pro to cross-validate technical feasibility and UX innovations.

---

### 5.2 Research Sources Summary

**Claude Agent SDK & Authentication**:
- [Agent SDK Overview - Claude API Docs](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Run Claude Code programmatically - Claude Code Docs](https://code.claude.com/docs/en/headless)
- [Claude Max OAuth Issue (Jan 2026)](https://github.com/anthropics/claude-code/issues/18340)

**WebSocket Streaming**:
- [Amazon Bedrock: Bi-directional streaming for real-time agent interactions](https://aws.amazon.com/blogs/machine-learning/bi-directional-streaming-for-real-time-agent-interactions-now-available-in-amazon-bedrock-agentcore-runtime/)
- [Building Real-Time AI Chat: WebSockets, LLM Streaming](https://render.com/articles/real-time-ai-chat-websockets-infrastructure)

**Workflow Automation**:
- [Process Automation Trends: 7 Best Practices In 2026](https://www.dipolediamond.com/process-automation-trends-7-best-practices-in-2026/)
- [ChatPRD - AI Platform for Product Managers](https://www.chatprd.ai/)

**Human-in-the-loop Patterns**:
- [Microsoft Copilot: Introducing agent flows](https://www.microsoft.com/en-us/microsoft-copilot/blog/copilot-studio/introducing-agent-flows-transforming-automation-with-ai-first-workflows/)
- [Dextra Labs: AI Agentic Workflow Patterns for Enterprises](https://dextralabs.com/blog/ai-agentic-workflow-patterns-for-enterprises/)

**Open Source References**:
- [OpenAgentsControl - GitHub](https://github.com/darrenhinde/OpenAgentsControl)
- [NanoClaw - Personal Claude Assistant](https://deepwiki.com/gavrielc/nanoclaw)

---

## 6. Critical Risks & Mitigation

### Risk 1: OAuth Token Third-Party Restriction (Critical)
**Status**: Active Policy (Jan 2026)

**Problem**: Anthropic restricts Claude Max OAuth tokens to official Claude Code CLI only. Third-party tools receive "This credential is only authorized for use with Claude Code" error.

**Evidence**:
- [GitHub Issue #18340](https://github.com/anthropics/claude-code/issues/18340): Feature request for Max/Pro subscription auth for third-party IDEs
- [Medium Article](https://jpcaparas.medium.com/claude-code-cripples-third-party-coding-agents-from-using-oauth-6548e9b49df3): Policy tightened on Jan 9, 2026

**Mitigation**:
1. **Investigate SDK Scope**: Verify if `@anthropic-ai/claude-agent-sdk` is considered "official" (likely yes, since it's Anthropic's own package).
2. **API Key Fallback**: Provide option for users to use API keys (console.anthropic.com) instead of OAuth.
3. **Local Proxy Pattern**: Run Agent SDK in "official" Claude Code CLI context, adx_1st acts as UI layer (not direct SDK consumer).

**Decision**: Prototype with OAuth first, test restriction, implement fallback if needed.

---

### Risk 2: Long-running Workflow Timeout
**Status**: Design Consideration

**Problem**: PRD workflow (Gate 0~8) can take 30+ minutes. HTTP timeout, WebSocket disconnect 발생 가능.

**Mitigation**:
1. **Background Task Queue**: Use in-memory job queue (Bull, BullMQ) for async execution.
2. **Reconnection Logic**: Frontend auto-reconnect on WebSocket drop, resume from last checkpoint.
3. **Progress Persistence**: Save Gate completion status to file (.progress.json), resume on reconnect.

---

### Risk 3: Concurrent Session Conflicts
**Status**: Architecture Decision

**Problem**: 여러 사용자/session이 동일 프로젝트 파일을 동시 수정 시 race condition.

**Mitigation**:
1. **Session Lock**: 프로젝트당 1개 활성 workflow session만 허용 (UI에서 "Workflow in progress" 표시).
2. **Isolated Workspace**: 각 session에 임시 디렉토리 할당 (`/tmp/adx-{sessionId}`), 완료 후 target project로 파일 이동.

**Decision**: MVP는 single-session restriction, v2에서 session queue 구현.

---

## 7. Quality Validation

### Best Practice 검증

| 검증 항목 | 기준 | 결과 |
|----------|------|------|
| 출처 명시 | 각 Best Practice에 출처(URL, 문서명) 포함 | ✅ 모든 BP에 URL 포함 |
| 적용 방안 구체성 | 프로젝트에 어떻게 적용할지 기술 | ✅ 코드 예시 포함 |
| 장단점 분석 | 각 Best Practice의 Trade-off 언급 | ✅ 장/단점 섹션 명시 |

### Anti-pattern 검증

| 검증 항목 | 기준 | 결과 |
|----------|------|------|
| 위험성 설명 | 왜 피해야 하는지 구체적 이유 | ✅ OAuth 정책, timeout 등 구체적 시나리오 |
| 회피 전략 실행 가능성 | 회피 전략이 실제 적용 가능한가 | ✅ Retry, session lock 등 실행 가능 |

### 창의적 아이디어 검증

| 검증 항목 | 기준 | 결과 |
|----------|------|------|
| 채택 근거 논리성 | 채택/미채택 이유가 논리적인가 | ✅ Pro/Con 분석 기반 결정 |
| 실현 가능성 | 기술적/비즈니스적으로 실현 가능한가 | ✅ MVP vs v2 구분, 기술 스택 검증 |
| 기존 기능과 차별성 | 이미 있는 기능의 반복이 아닌가 | ✅ CLI 대비 차별점 명확 (visual UI, real-time) |

### 일관성 검증

| 검증 항목 | 기준 | 결과 |
|----------|------|------|
| 최종 권장사항 정합성 | 채택된 BP/아이디어가 최종 권장사항에 반영됨 | ✅ 섹션 4에 모두 반영 |
| 설계 원칙 도출 | Best Practice에서 설계 원칙이 도출됨 | ✅ 5개 설계 원칙 명시 |

---

## 8. Next Steps

### Immediate Actions
1. **Verify OAuth Scope**: Test `@anthropic-ai/claude-agent-sdk` with Max subscription OAuth token → confirm third-party restriction applies or not.
2. **Prototype WebSocket**: Build minimal Express + ws + React PoC for bidirectional streaming.
3. **Define Session Model**: Design session lifecycle (create → execute → approve → complete).

### Gate 1 Prerequisites
- Project path configuration schema
- Approval request/response data model
- WebSocket message protocol (type, payload)
- Error handling strategy (retry, fallback)

### Open Questions for User
1. **OAuth vs API Key**: If OAuth restriction applies, prefer API key fallback or local proxy pattern?
2. **Container Sandboxing**: Is Docker acceptable for local dev tool, or too heavy?
3. **Team Features**: Is solo developer focus acceptable, or team collaboration needed in v1?

---

**Gate 0 Status**: ✅ Complete
**Validation**: 5/5 items passed
**Next Gate**: `/requirements` (Gate 1)
