#!/bin/bash
# health-check.sh — 서비스 상태 모니터링
# cron: */5 * * * * /opt/metaverse/health-check.sh >> /var/log/metaverse-health.log 2>&1

DOMAIN="https://nextadx.co.kr"

check() {
    local name=$1
    local url=$2
    local expected=$3
    local result

    result=$(curl -sf --max-time 15 "${url}" 2>/dev/null || echo "TIMEOUT")

    if echo "${result}" | grep -qi "${expected}"; then
        echo "[OK] ${name}"
    else
        echo "[FAIL] ${name}: ${result}"
    fi
}

echo "=== Health Check: $(date '+%Y-%m-%d %H:%M:%S') ==="
check "Backend API" "${DOMAIN}/metaverse-api/v1/health" 'status.*ok'
check "Frontend"    "${DOMAIN}/metaverse/"              'doctype html'

# Docker 컨테이너 상태
docker compose -f /opt/metaverse/docker-compose.prod.yml ps --format "table {{.Name}}\t{{.Status}}" 2>/dev/null || true
