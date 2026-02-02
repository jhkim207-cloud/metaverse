# 개발 서버 관리 스킬

## 개요

로컬 개발 환경의 서버 시작/중지/관리를 위한 가이드입니다.

## 빠른 시작

### 전체 시작 (Windows)

```powershell
./start.ps1
```

### 개별 시작

```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm run dev

# Database (Docker)
docker compose up -d postgres
```

## 서비스 정보

| 서비스 | URL | 포트 |
|--------|-----|------|
| Frontend | http://localhost:5173 | 5173 |
| Backend | http://localhost:8080 | 8080 |
| PostgreSQL | localhost:5432 | 5432 |

## Backend 실행 옵션

### 기본 실행

```bash
./mvnw spring-boot:run
```

### 프로파일 지정

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

### 환경변수 설정

```bash
./mvnw spring-boot:run -Dspring-boot.run.arguments="--server.port=8081"
```

### 디버그 모드

```bash
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

## Frontend 실행 옵션

### 기본 실행

```bash
npm run dev
```

### 포트 변경

```bash
npm run dev -- --port 3000
```

### 호스트 바인딩 (외부 접근 허용)

```bash
npm run dev -- --host 0.0.0.0
```

## Docker Compose

### 전체 시작

```bash
docker compose up -d
```

### 특정 서비스만 시작

```bash
docker compose up -d postgres
```

### 로그 확인

```bash
docker compose logs -f backend
```

### 중지

```bash
docker compose down
```

### 볼륨 포함 삭제

```bash
docker compose down -v
```

## 헬스 체크

### Backend

```bash
curl http://localhost:8080/api/v1/health
```

### Database

```bash
docker compose exec postgres pg_isready
```

## 포트 충돌 해결

### Windows

```powershell
# 포트 사용 프로세스 확인
netstat -ano | findstr :8080

# 프로세스 종료
taskkill /PID <PID> /F
```

### Linux/Mac

```bash
# 포트 사용 프로세스 확인
lsof -i :8080

# 프로세스 종료
kill -9 <PID>
```

## 로그 확인

### Backend 로그

```bash
tail -f backend/logs/application.log
```

### Docker 로그

```bash
docker compose logs -f --tail=100
```

## 데이터베이스 접속

### psql

```bash
docker compose exec postgres psql -U postgres -d mydb
```

### 환경변수로 접속

```bash
PGPASSWORD=password psql -h localhost -U postgres -d mydb
```

## 문제 해결

### Backend 시작 실패

1. 포트 충돌 확인
2. 환경변수 설정 확인
3. 데이터베이스 연결 확인

### Frontend 시작 실패

1. `node_modules` 삭제 후 재설치
   ```bash
   rm -rf node_modules
   npm install
   ```
2. 포트 충돌 확인

### Database 연결 실패

1. Docker 컨테이너 상태 확인
   ```bash
   docker compose ps
   ```
2. 네트워크 확인
   ```bash
   docker network ls
   ```
