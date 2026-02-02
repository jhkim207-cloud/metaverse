# /implement - 상세 가이드

> 이 문서는 필요 시 참조하는 상세 가이드입니다.

## 구현 프로세스

### Phase 1: 준비

```
1. PRD 문서 확인
   - prd/{기능명}-prd.md 읽기
   - 05-implementation-plan.md 의존성 순서 확인

2. 기존 코드 패턴 분석
   - 유사 Entity/Service/Controller 패턴 확인
   - 네이밍 규칙 확인

3. 표준 문서 확인
   - API_DESIGN_GUIDE.md
   - UI_STANDARD.md
   - standards.json
```

### Phase 2: DB 구현

```
1. DDL 파일 확인
   - db_dic/sql/postgres/public/{table}.sql

2. DDL 실행 (필요 시)
   - FK 의존성 순서 준수

3. 검증
   - 테이블 생성 확인
```

### Phase 3: Backend 구현

```
의존성 순서:
Entity → Mapper → Service → DTO → Controller → Test

각 파일 생성 후:
1. 컴파일 확인 (./gradlew compileJava)
2. 다음 파일로 진행

전체 완료 후:
- ./gradlew build
- ./gradlew test
```

### Phase 4: Frontend 구현

```
의존성 순서:
Types → API Service → Hooks → Components → Pages → Test

각 파일 생성 후:
1. TypeScript 체크 (npm run typecheck)
2. 다음 파일로 진행

전체 완료 후:
- npm run build
- npm run test
```

### Phase 5: 통합 검증

```
1. Backend 빌드 확인
2. Frontend 빌드 확인
3. API 연동 테스트 (수동)
4. Gate 8 체크리스트 확인
```

---

## 코드 템플릿

### Backend Entity

```java
package com.example.domain.{feature}.entity;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class {Entity} {
    private Long id;

    // 비즈니스 필드
    private String name;
    private String status;

    // 감사 필드
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
}
```

### Backend Mapper

```java
package com.example.domain.{feature}.mapper;

import com.example.domain.{feature}.entity.{Entity};
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface {Entity}Mapper {
    List<{Entity}> findAll(@Param("offset") int offset, @Param("limit") int limit);
    {Entity} findById(@Param("id") Long id);
    int insert({Entity} entity);
    int update({Entity} entity);
    int delete(@Param("id") Long id);
    int count();
}
```

### Backend Service

```java
package com.example.domain.{feature}.service;

import com.example.domain.{feature}.entity.{Entity};
import com.example.domain.{feature}.mapper.{Entity}Mapper;
import com.example.domain.{feature}.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class {Feature}Service {

    private final {Entity}Mapper mapper;

    public PageResponse<{Entity}Response> getList(int page, int size) {
        // 구현
    }

    public {Entity}Response getById(Long id) {
        // 구현
    }

    @Transactional
    public {Entity}Response create({Entity}CreateRequest request) {
        // 구현
    }

    @Transactional
    public {Entity}Response update(Long id, {Entity}UpdateRequest request) {
        // 구현
    }

    @Transactional
    public void delete(Long id) {
        // 구현
    }
}
```

### Backend Controller

```java
package com.example.domain.{feature}.controller;

import com.example.domain.{feature}.service.{Feature}Service;
import com.example.domain.{feature}.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/{resources}")
@RequiredArgsConstructor
public class {Feature}Controller {

    private final {Feature}Service service;

    @GetMapping
    public ResponseEntity<PageResponse<{Entity}Response>> getList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(service.getList(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<{Entity}Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<{Entity}Response> create(
            @Valid @RequestBody {Entity}CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<{Entity}Response> update(
            @PathVariable Long id,
            @Valid @RequestBody {Entity}UpdateRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Frontend Types

```typescript
export interface {Entity} {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface {Entity}CreateRequest {
  name: string;
  status: string;
}

export interface {Entity}UpdateRequest {
  name?: string;
  status?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}
```

### Frontend API Service

```typescript
import { api } from '@/lib/api';
import type { {Entity}, {Entity}CreateRequest, {Entity}UpdateRequest, PageResponse } from '@/types/{feature}';

export const {feature}Api = {
  getList: (page = 0, size = 20) =>
    api.get<PageResponse<{Entity}>>(`/api/v1/{resources}?page=${page}&size=${size}`),

  getById: (id: number) =>
    api.get<{Entity}>(`/api/v1/{resources}/${id}`),

  create: (data: {Entity}CreateRequest) =>
    api.post<{Entity}>('/api/v1/{resources}', data),

  update: (id: number, data: {Entity}UpdateRequest) =>
    api.put<{Entity}>(`/api/v1/{resources}/${id}`, data),

  delete: (id: number) =>
    api.delete(`/api/v1/{resources}/${id}`),
};
```

### Frontend Hook

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { {feature}Api } from '@/services/{feature}Api';
import type { {Entity}CreateRequest, {Entity}UpdateRequest } from '@/types/{feature}';

export function use{Feature}List(page = 0, size = 20) {
  return useQuery({
    queryKey: ['{features}', page, size],
    queryFn: () => {feature}Api.getList(page, size),
  });
}

export function use{Feature}(id: number) {
  return useQuery({
    queryKey: ['{feature}', id],
    queryFn: () => {feature}Api.getById(id),
    enabled: !!id,
  });
}

export function useCreate{Feature}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {Entity}CreateRequest) => {feature}Api.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['{features}'] }),
  });
}

export function useUpdate{Feature}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: {Entity}UpdateRequest }) =>
      {feature}Api.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['{features}'] }),
  });
}

export function useDelete{Feature}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => {feature}Api.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['{features}'] }),
  });
}
```

---

## 진행 상황 표시

구현 중 다음 형식으로 진행 상황 표시:

```
## 구현 진행 상황

### Phase 2: Backend [4/9]
- [x] Entity 생성
- [x] Mapper 인터페이스
- [x] Mapper XML
- [x] Service 구현
- [ ] DTO Request
- [ ] DTO Response
- [ ] Controller
- [ ] Service 테스트
- [ ] Controller 테스트

### Phase 3: Frontend [0/8]
- [ ] Types 정의
- [ ] API Service
- [ ] Hooks
- [ ] List 컴포넌트
- [ ] Form 컴포넌트
- [ ] 목록 페이지
- [ ] 상세 페이지
- [ ] 컴포넌트 테스트
```

---

## 오류 처리

### 컴파일 오류 시

```
1. 오류 메시지 확인
2. 누락된 import 추가
3. 타입 오류 수정
4. 재컴파일
```

### 테스트 실패 시

```
1. 실패 원인 분석
2. 코드 또는 테스트 수정
3. 재실행
```

### 빌드 실패 시

```
1. 전체 오류 로그 확인
2. 의존성 문제 확인
3. 순차적으로 수정
```

---

## 80% 완성도 범위

### 포함 (구현 대상)

- 핵심 CRUD 기능
- 기본 유효성 검증 (@Valid)
- 표준 에러 처리
- 주요 UI 컴포넌트
- 기본 단위 테스트

### 미포함 (완성 단계에서 추가)

- 고급 에러 처리 (재시도, 회복)
- 성능 최적화 (캐싱, 인덱스 튜닝)
- 고급 보안 (Rate Limiting)
- E2E 테스트
- 모니터링/로깅 고도화
