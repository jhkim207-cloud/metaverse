#!/bin/bash
# rollback.sh — 이전 릴리스로 롤백
# 사용법: ./rollback.sh
set -euo pipefail

DEPLOY_DIR="/opt/metaverse"
RELEASES_DIR="${DEPLOY_DIR}/releases"
PREVIOUS_TAG_FILE="${RELEASES_DIR}/.previous-tag"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }
error() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $*" >&2; }

if [ ! -f "${PREVIOUS_TAG_FILE}" ]; then
    error "이전 릴리스 정보가 없습니다. 롤백 불가."
    exit 1
fi

PREVIOUS_TAG=$(cat "${PREVIOUS_TAG_FILE}")

# 태그 값 검증
if [[ -z "${PREVIOUS_TAG}" || ! "${PREVIOUS_TAG}" =~ ^[0-9]{8}-[0-9]{6}$ ]]; then
    error "이전 릴리스 태그가 유효하지 않습니다: '${PREVIOUS_TAG}'"
    exit 1
fi

log "=== 롤백 시작: ${PREVIOUS_TAG} ==="

# 이전 이미지를 latest로 태깅
docker tag "metaverse-backend:${PREVIOUS_TAG}" metaverse-backend:latest 2>/dev/null || {
    error "metaverse-backend:${PREVIOUS_TAG} 이미지를 찾을 수 없습니다."
    exit 1
}
docker tag "metaverse-frontend:${PREVIOUS_TAG}" metaverse-frontend:latest 2>/dev/null || {
    error "metaverse-frontend:${PREVIOUS_TAG} 이미지를 찾을 수 없습니다."
    exit 1
}

# 서비스 재시작
cd "${DEPLOY_DIR}"

if [ ! -f .env ]; then
    error ".env 파일이 없습니다: ${DEPLOY_DIR}/.env"
    exit 1
fi

set -a
source .env
set +a

docker compose -f docker-compose.prod.yml up -d --no-build backend frontend

# 롤백 후 헬스체크
log "롤백 후 헬스체크 대기..."
for i in $(seq 1 12); do
    if docker exec metaverse-backend wget -qO- http://localhost:8086/api/v1/health 2>/dev/null | grep -q 'status.*ok'; then
        log "Backend 정상 ($((i * 5))초)"
        break
    fi
    if [ "$i" -eq 12 ]; then
        error "롤백 후 헬스체크 실패 (60초 타임아웃). 수동 확인 필요."
    fi
    sleep 5
done

# 현재 태그 업데이트
echo "${PREVIOUS_TAG}" > "${RELEASES_DIR}/.current-tag"
rm -f "${PREVIOUS_TAG_FILE}"

log "=== 롤백 완료: ${PREVIOUS_TAG} ==="
log "주의: 연속 롤백은 불가합니다. 새 배포가 필요합니다."
