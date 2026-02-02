-- 초기 데이터베이스 설정
-- docker-compose 시작 시 자동 실행

-- 스키마 생성
CREATE SCHEMA IF NOT EXISTS biz_management;

-- 기본 설정
SET search_path TO biz_management, public;

-- 확장 기능 (필요 시)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 초기 테이블은 Flyway 또는 수동으로 생성
