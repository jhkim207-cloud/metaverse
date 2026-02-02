#!/bin/bash
# 프로젝트 초기 설정 스크립트

set -e

echo "=== BizManagement 프로젝트 설정 ==="

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Backend 설정
echo -e "${YELLOW}[1/4] Backend 의존성 설치...${NC}"
cd backend
if [ -f "mvnw" ]; then
    ./mvnw dependency:resolve -q
    echo -e "${GREEN}✓ Backend 의존성 설치 완료${NC}"
else
    echo "Maven wrapper가 없습니다. mvn dependency:resolve를 실행하세요."
fi
cd ..

# 2. Frontend 설정
echo -e "${YELLOW}[2/4] Frontend 의존성 설치...${NC}"
cd frontend
npm install
echo -e "${GREEN}✓ Frontend 의존성 설치 완료${NC}"
cd ..

# 3. 환경 설정 파일 복사
echo -e "${YELLOW}[3/4] 환경 설정 파일 확인...${NC}"
if [ ! -f "backend/src/main/resources/application-local.yml" ]; then
    echo "application-local.yml을 생성하고 DB 정보를 설정하세요."
fi

# 4. Docker 확인
echo -e "${YELLOW}[4/4] Docker 확인...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker 설치됨${NC}"
    echo "  PostgreSQL 시작: cd docker && docker-compose up -d postgres"
else
    echo "Docker가 설치되지 않았습니다."
fi

echo ""
echo -e "${GREEN}=== 설정 완료 ===${NC}"
echo ""
echo "다음 단계:"
echo "1. backend/src/main/resources/application-local.yml에서 DB 정보 설정"
echo "2. docker-compose up -d postgres (또는 외부 DB 사용)"
echo "3. Backend: cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local"
echo "4. Frontend: cd frontend && npm run dev"
