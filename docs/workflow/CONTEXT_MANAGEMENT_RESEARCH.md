# 컨텍스트 폭발 문제 해결 - Best Practice 조사 결과

> 조사일: 2026-02-01

## 1. 문제 정의

### 1.1 컨텍스트 폭발이란?
- LLM의 컨텍스트 윈도우가 채워지면서 **성능이 급격히 저하**되는 현상
- Claude의 경우: 컨텍스트가 75% 이상 차면 품질 저하 시작, 90%에서 심각한 저하
- "Context Rot": 단순히 컨텍스트를 늘려도 성능이 오히려 나빠지는 현상

### 1.2 우리 워크플로우의 문제
```
Gate 0~8 순차 실행 시:
- 9개 SKILL.md 로드
- 각 단계 산출물 누적
- 멀티 LLM 결과 누적
→ 단일 세션에서 컨텍스트 한계 도달
```

---

## 2. 업계 Best Practice 분류

### 2.1 Context Overflow 정책 (기본 전략)

| 정책 | 설명 | 장단점 |
|------|------|--------|
| **stopAtLimit** | 한계 도달 시 중단 | 안전하지만 작업 미완료 |
| **truncateMiddle** | 중간 내용 잘라냄 | 시작/끝 보존, 중간 손실 |
| **rollingWindow** | 오래된 메시지 제거 | 최신 유지, 초기 손실 |

> 출처: [Agenta - Top 6 Techniques to Manage Context Length](https://agenta.ai/blog/top-6-techniques-to-manage-context-length-in-llms)

### 2.2 메모리 최적화 기법 (6가지)

| 기법 | 설명 | 적용 상황 |
|------|------|----------|
| **Sliding Window** | 최근 N개 메시지만 유지 | 대화형 에이전트 |
| **Summarization** | 이전 내용 LLM으로 요약 | 긴 대화 압축 |
| **Vector Memory** | 임베딩으로 관련 정보만 검색 | 대규모 문서 |
| **Virtual Memory** | RAM/Disk처럼 Active/Storage 분리 | 복잡한 워크플로우 |
| **Artifact Pattern** | 큰 데이터는 핸들(참조)만 유지 | 대용량 출력 |
| **Semantic Compression** | 중복 개념 제거, 핵심만 보존 | 중복 많은 문서 |

> 출처: [IBM - AI Agent Memory](https://www.ibm.com/think/topics/ai-agent-memory), [Medium - Memory Optimization Strategies](https://medium.com/@nirdiamant21/memory-optimization-strategies-in-ai-agents-1f75f8180d54)

---

## 3. 멀티 에이전트 오케스트레이션 패턴

### 3.1 핵심 패턴

#### Pattern 1: Manager/Worker (Magentic Pattern)
```
[Manager Agent]
    ├── Task 분해
    ├── Task Ledger 관리
    └── Specialist Agent 호출
         ├── [Agent A] → 결과
         ├── [Agent B] → 결과
         └── [Agent C] → 결과
```
- **장점**: 각 Agent가 독립 컨텍스트 보유
- **단점**: 결과 통합 시 메인 컨텍스트 사용

> 출처: [Azure AI Agent Design Patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)

#### Pattern 2: Handoff Pattern
```
[Agent 1] --handoff--> [Agent 2] --handoff--> [Agent 3]
     │                      │                      │
     └── State 저장 ────────┴── State 전달 ────────┘
```
- **핵심**: 전체 책임을 다음 Agent에게 이전
- **State 유지**: 체크포인트 저장/복원

> 출처: [Microsoft Agent Framework - Handoff](https://learn.microsoft.com/en-us/agent-framework/user-guide/workflows/orchestrations/handoff)

#### Pattern 3: Event-Driven Multi-Agent
```
[Event Bus]
    ├── Agent 1 (구독: topic-a)
    ├── Agent 2 (구독: topic-b)
    └── Agent 3 (구독: topic-c)
```
- **장점**: 비동기, 느슨한 결합
- **장점**: Agent 추가/제거 용이

> 출처: [Confluent - Event-Driven Multi-Agent Systems](https://www.confluent.io/blog/event-driven-multi-agent-systems/)

### 3.2 Context Isolation 효과

> "Each subagent works in isolation with only its relevant context. Subagents process **67% fewer tokens** overall due to context isolation."

- 서브에이전트는 필요한 컨텍스트만 가짐
- 메인 대화 오염 방지
- 토큰 사용량 대폭 감소

> 출처: [Google Developers - Architecting Efficient Multi-Agent Framework](https://developers.googleblog.com/architecting-efficient-context-aware-multi-agent-framework-for-production/)

---

## 4. Claude Code 특화 Best Practice

### 4.1 Anthropic 공식 권장사항

#### /clear 적극 활용
```
Anti-pattern: "The kitchen sink session"
- 한 세션에서 여러 관련 없는 작업 수행
- 실패한 시도들이 컨텍스트 오염

Fix:
- 작업 간 /clear
- 2번 실패 후 /clear + 개선된 프롬프트로 재시작
```

#### Subagent 활용 시점
```
"Strong use of subagents, especially for complex problems.
Telling Claude to use subagents to verify details or
investigate particular questions early on tends to
preserve context availability."
```

#### 컨텍스트 활용률 가이드
| 활용률 | 품질 | 권장 |
|--------|------|------|
| 90%+ | 저하됨 | 피할 것 |
| **75%** | 최적 | **권장** |
| 50% 이하 | 양호 | 새 작업 가능 |

> 출처: [Anthropic - Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

### 4.2 Task Tool vs Subagent

| 구분 | Task Tool | Custom Subagent |
|------|-----------|-----------------|
| 컨텍스트 | 독립 200k 윈도우 | 독립 윈도우 |
| 지속성 | 일회성 (ephemeral) | resume 가능 |
| 커스터마이징 | 제한적 | 프롬프트/도구 지정 가능 |
| 용도 | 단순 위임 작업 | 전문화된 반복 작업 |

> 출처: [Claude Code - Task Tool vs Subagents](https://amitkoth.com/claude-code-task-tool-vs-subagents/)

### 4.3 Long-Running Agent 전략

```
[Initializer Agent] → 환경 설정, 첫 세션
         ↓
[Coding Agent] → 점진적 진행, 아티팩트 저장
         ↓
[Next Session] → 아티팩트 기반 재개
```

**핵심 원칙**:
- Git으로 상태 추적
- 점진적 진행 (incremental progress)
- 명확한 아티팩트 남기기

> 출처: [Anthropic - Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

---

## 5. 다른 도구들의 접근법

### 5.1 Aider - Architect Mode
```
[Architect Model] → 설계/계획 (DeepSeek R1)
         ↓
[Editor Model] → 구체적 편집 (Claude 3.5)
```
- 두 모델 역할 분리
- 복잡한 작업: 64% 정확도 달성
- 비용 효율적

> 출처: [Aider - Chat Modes](https://aider.chat/docs/usage/modes.html)

### 5.2 Cursor - Agent Mode
- **Auto-context**: 관련 코드 자동 포함
- **8개 Agent 동시 실행** (Git worktree 격리)
- 컨텍스트 한계 시 새 대화 제안

> 출처: [Cursor Docs - Modes](https://cursor.com/docs/agent/modes)

### 5.3 LangGraph - State Machine
```python
# 체크포인트 기반 재개
with_checkpointing() → 상태 저장
resume() → 정확히 중단점에서 재개
```
- 상태 머신 기반 워크플로우
- 영속적 메모리
- Human-in-the-loop 지원

> 출처: [LangGraph GitHub](https://github.com/langchain-ai/langgraph)

---

## 6. PRD 워크플로우 특화 패턴

### 6.1 3-Tier Workflow (검증된 패턴)

```
Tier 1: PRD 생성 (고수준 의도 + 제약)
         ↓
Tier 2: Task 분해 (에픽 → 개별 태스크)
         ↓
Tier 3: 구현 (컨텍스트 소진 없이 완료 가능한 크기)
```

**핵심**: 각 태스크는 **컨텍스트 소진 없이 완료 가능**해야 함

> 출처: [Vectorian - Agentic Project Management](https://www.vectorian.be/articles/agentic-project-management/)

### 6.2 Spec-First Approach

```
1. Plan First: 계획 수립
2. Split into Tasks: 독립 태스크로 분할
3. Implement Each: 각 태스크별 Fresh Context
```

**효과**: 약 90%가 첫 시도에 성공

> 출처: [Poldrack - Workflows for Agentic Coding](https://russpoldrack.substack.com/p/workflows-for-agentic-coding-and)

### 6.3 Context Block Pattern

```xml
<!-- 태스크별 구조화된 컨텍스트 -->
<task id="impl-notification-service">
  <files>
    <file>src/service/NotificationService.java</file>
    <file>src/mapper/NotificationMapper.java</file>
  </files>
  <dependencies>
    <dep>NotificationEntity</dep>
  </dependencies>
  <reference>prd/notification-prd.md#section-3</reference>
</task>
```

- 필요한 파일/의존성만 제공
- 무관한 코드 읽기 방지
- 집중력 유지

> 출처: [GitHub Blog - Reliable AI Workflows](https://github.blog/ai-and-ml/github-copilot/how-to-build-reliable-ai-workflows-with-agentic-primitives-and-context-engineering/)

---

## 7. 권장 솔루션 종합

### 7.1 즉시 적용 가능 (Quick Wins)

| 솔루션 | 적용 방법 | 효과 |
|--------|----------|------|
| Gate별 /clear | 각 Gate 완료 후 /clear | 컨텍스트 초기화 |
| 산출물 파일 참조 | 전체 내용 대신 파일 경로 | 토큰 절약 |
| Task Tool 위임 | 복잡한 분석은 Task로 | 67% 토큰 감소 |

### 7.2 구조적 개선 (Medium-term)

| 솔루션 | 설명 | 복잡도 |
|--------|------|--------|
| Gate별 세션 분리 | Gate 0-2, 3-5, 6-8 그룹화 | 중간 |
| Handoff 문서 | 세션 간 상태 전달 문서 | 낮음 |
| 체크포인트 파일 | 진행 상황 자동 저장 | 중간 |

### 7.3 고급 패턴 (Long-term)

| 솔루션 | 설명 | 복잡도 |
|--------|------|--------|
| Manager/Worker | 메인 에이전트 + 전문 서브에이전트 | 높음 |
| Event-Driven | 비동기 이벤트 기반 처리 | 높음 |
| LangGraph 통합 | 상태 머신 + 체크포인트 | 높음 |

---

## 8. 우리 워크플로우에 적용할 핵심 인사이트

### 8.1 핵심 원칙

1. **"컨텍스트는 75%까지만"** - 90%에서 품질 급락
2. **"Fresh Context는 친구"** - /clear 적극 활용
3. **"참조 > 포함"** - 파일 내용보다 경로 참조
4. **"점진적 진행"** - 한 번에 모든 것 X, 단계별 O
5. **"명확한 핸드오프"** - 세션 간 상태 명시적 전달

### 8.2 우리 워크플로우 개선 방향

```
현재: Gate 0 → 1 → 2 → ... → 8 (단일 세션)

개선안:
[Session 1: Research & Requirements]
  Gate 0 → Gate 1 → HANDOFF.md 저장

[Session 2: Design]
  HANDOFF.md 로드 → Gate 2 → Gate 3 → Gate 4 → HANDOFF.md 갱신

[Session 3: Planning & Test]
  HANDOFF.md 로드 → Gate 5 → Gate 6 → Gate 7 → PRD 완성

[Session 4: Implementation]
  PRD 로드 → Gate 8 → 코드 생성
```

---

## 참고 문헌

### Anthropic/Claude
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Long Context Prompting Tips](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/long-context-tips)
- [Managing Context on Claude Platform](https://www.anthropic.com/news/context-management)

### Context Engineering
- [JetBrains - Smarter Context Management](https://blog.jetbrains.com/research/2025/12/efficient-context-management/)
- [16x Engineer - LLM Context Management Guide](https://eval.16x.engineer/blog/llm-context-management-guide)
- [Agenta - Top 6 Techniques](https://agenta.ai/blog/top-6-techniques-to-manage-context-length-in-llms)
- [LlamaIndex - Context Engineering](https://www.llamaindex.ai/blog/context-engineering-what-it-is-and-techniques-to-consider)

### Multi-Agent Orchestration
- [Azure - AI Agent Design Patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)
- [Microsoft - Agent Framework Checkpoints](https://learn.microsoft.com/en-us/agent-framework/user-guide/workflows/checkpoints)
- [Google - Efficient Multi-Agent Framework](https://developers.googleblog.com/architecting-efficient-context-aware-multi-agent-framework-for-production/)
- [Confluent - Event-Driven Multi-Agent](https://www.confluent.io/blog/event-driven-multi-agent-systems/)

### Tools & Frameworks
- [LangGraph GitHub](https://github.com/langchain-ai/langgraph)
- [OpenAI Agents SDK - Session Memory](https://cookbook.openai.com/examples/agents_sdk/session_memory)
- [Aider - Chat Modes](https://aider.chat/docs/usage/modes.html)
- [Cursor Docs - Agent Modes](https://cursor.com/docs/agent/modes)

### Workflow Patterns
- [GitHub - Reliable AI Workflows](https://github.blog/ai-and-ml/github-copilot/how-to-build-reliable-ai-workflows-with-agentic-primitives-and-context-engineering/)
- [Vectorian - Agentic Project Management](https://www.vectorian.be/articles/agentic-project-management/)
- [Poldrack - Workflows for Agentic Coding](https://russpoldrack.substack.com/p/workflows-for-agentic-coding-and)
