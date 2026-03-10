#!/bin/bash
# deploy.sh — 서버 배포 실행 스크립트
# 사용법: ./deploy.sh <RELEASE_TAG>
# GitHub Actions CD에서 SSH로 호출됨
set -euo pipefail

RELEASE_TAG="${1:?Release tag required. Usage: ./deploy.sh <RELEASE_TAG>}"

# 릴리스 태그 형식 검증 (YYYYMMDD-HHMMSS)
if [[ ! "$RELEASE_TAG" =~ ^[0-9]{8}-[0-9]{6}$ ]]; then
    echo "ERROR: Invalid release tag format: ${RELEASE_TAG}" >&2
    echo "Expected format: YYYYMMDD-HHMMSS (e.g. 20260306-120000)" >&2
    exit 1
fi

DEPLOY_DIR="/opt/metaverse"
RELEASES_DIR="${DEPLOY_DIR}/releases"
RELEASE_DIR="${RELEASES_DIR}/${RELEASE_TAG}"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }
error() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $*" >&2; }

log "=== 배포 시작: ${RELEASE_TAG} ==="

# ── 1. 릴리스 아카이브 추출 ──
log "[1/6] 릴리스 아카이브 추출..."
mkdir -p "${RELEASE_DIR}"
tar -xzf "${RELEASES_DIR}/release-${RELEASE_TAG}.tar.gz" -C "${RELEASE_DIR}"
rm -f "${RELEASES_DIR}/release-${RELEASE_TAG}.tar.gz"

# ── 2. Backend Docker 이미지 빌드 (런타임 전용) ──
log "[2/6] Backend Docker 이미지 빌드..."
mkdir -p "${RELEASE_DIR}/backend-ctx"
cp "${RELEASE_DIR}/backend.jar" "${RELEASE_DIR}/backend-ctx/"

cat > "${RELEASE_DIR}/backend-ctx/Dockerfile" << 'DOCKEREOF'
FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY backend.jar app.jar
RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 8086
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
DOCKEREOF

docker build -t metaverse-backend:${RELEASE_TAG} -t metaverse-backend:latest "${RELEASE_DIR}/backend-ctx/"

# ── 3. Frontend Docker 이미지 빌드 (런타임 전용) ──
log "[3/6] Frontend Docker 이미지 빌드..."
mkdir -p "${RELEASE_DIR}/frontend-ctx"
cp -r "${RELEASE_DIR}/frontend/" "${RELEASE_DIR}/frontend-ctx/dist"
cp "${DEPLOY_DIR}/docker/nginx-frontend-metaverse.conf" "${RELEASE_DIR}/frontend-ctx/"

cat > "${RELEASE_DIR}/frontend-ctx/Dockerfile" << 'DOCKEREOF'
FROM nginx:1.25-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html/metaverse
COPY nginx-frontend-metaverse.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
DOCKEREOF

docker build -t metaverse-frontend:${RELEASE_TAG} -t metaverse-frontend:latest "${RELEASE_DIR}/frontend-ctx/"

# ── 4. 롤백 정보 저장 ──
log "[4/6] 롤백 정보 저장..."
if [ -f "${RELEASES_DIR}/.current-tag" ]; then
    cp "${RELEASES_DIR}/.current-tag" "${RELEASES_DIR}/.previous-tag"
    log "이전 릴리스: $(cat ${RELEASES_DIR}/.previous-tag)"
fi
echo "${RELEASE_TAG}" > "${RELEASES_DIR}/.current-tag"

# ── 5. 서비스 재시작 ──
log "[5/6] 서비스 재시작..."
cd "${DEPLOY_DIR}"

# .env 로드
set -a
source .env
set +a

# Backend 먼저 재시작
docker compose -f docker-compose.prod.yml up -d --no-build backend
log "Backend 헬스체크 대기..."

for i in $(seq 1 18); do
    if docker exec metaverse-backend wget -qO- http://localhost:8086/api/v1/health 2>/dev/null | grep -q 'status.*ok'; then
        log "Backend 정상 ($((i * 5))초)"
        break
    fi
    if [ "$i" -eq 18 ]; then
        error "Backend 헬스체크 실패 (90초 타임아웃)"
        exit 1
    fi
    sleep 5
done

# Frontend 재시작
docker compose -f docker-compose.prod.yml up -d --no-build frontend

# nginx-proxy reload (metaverse-backend/frontend DNS 갱신)
if docker ps --format '{{.Names}}' | grep -q 'biz-nginx-proxy'; then
    log "nginx-proxy reload (DNS 갱신)..."
    docker exec biz-nginx-proxy nginx -s reload 2>/dev/null || true
fi

# ── 6. 오래된 릴리스 정리 (최근 3개만 보관) ──
log "[6/6] 오래된 릴리스 정리..."
ls -dt "${RELEASES_DIR}"/20* 2>/dev/null | tail -n +5 | xargs rm -rf 2>/dev/null || true
docker image prune -f --filter "until=72h" 2>/dev/null || true

log "=== 배포 완료: ${RELEASE_TAG} ==="
