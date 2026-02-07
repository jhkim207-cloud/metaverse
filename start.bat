@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

:: 프로젝트 루트 디렉토리 (배치파일 위치 기준)
set "PROJECT_ROOT=%~dp0"
set "PROJECT_ROOT=%PROJECT_ROOT:~0,-1%"

echo ========================================
echo   BizManagement - Development Server
echo ========================================
echo.

:: Check if we should start backend, frontend, or both
set MODE=%1
if "%MODE%"=="" set MODE=all

:: Default variables
set BACKEND_PORT=8083
set FRONTEND_PORT=5177

:: Argument parsing
if /i "%MODE%"=="all" (
    if NOT "%2"=="" set BACKEND_PORT=%2
    if NOT "%3"=="" set FRONTEND_PORT=%3
)

if /i "%MODE%"=="backend" (
    if NOT "%2"=="" set BACKEND_PORT=%2
)

if /i "%MODE%"=="frontend" (
    if NOT "%2"=="" set FRONTEND_PORT=%2
)

echo Mode: %MODE%
if /i "%MODE%"=="all" (
    echo Backend Port: %BACKEND_PORT%
    echo Frontend Port: %FRONTEND_PORT%
) else if /i "%MODE%"=="backend" (
    echo Backend Port: %BACKEND_PORT%
) else if /i "%MODE%"=="frontend" (
    echo Frontend Port: %FRONTEND_PORT%
)
echo.

if /i "%MODE%"=="backend" goto :backend
if /i "%MODE%"=="frontend" goto :frontend
if /i "%MODE%"=="all" goto :all

echo Usage: start.bat [all|backend|frontend] [backend_port] [frontend_port]
goto :eof

:all
echo Starting both backend and frontend...
echo.
echo [1/2] Starting Backend (background)...
cd /d "%PROJECT_ROOT%\backend"
start "" /b mvnw.cmd spring-boot:run -Dspring-boot.run.arguments=--server.port=%BACKEND_PORT% -Dspring-boot.run.profiles=local > NUL 2>&1
cd /d "%PROJECT_ROOT%"

echo Waiting for backend to be ready...
set RETRY_COUNT=0
set MAX_RETRIES=60

:wait_backend
timeout /t 2 /nobreak > NUL
set /a RETRY_COUNT+=1

:: Check if backend is responding
curl -s -o NUL -w "" http://localhost:%BACKEND_PORT%/api/v1/health >NUL 2>&1
if %ERRORLEVEL%==0 (
    echo Backend is ready!
    goto :start_frontend
)

if %RETRY_COUNT% GEQ %MAX_RETRIES% (
    echo Warning: Backend health check timed out after 120 seconds.
    echo Starting frontend anyway...
    goto :start_frontend
)

echo   Waiting... [%RETRY_COUNT%/%MAX_RETRIES%]
goto :wait_backend

:start_frontend
echo.
echo [2/2] Starting Frontend...
echo ========================================
echo Backend: http://localhost:%BACKEND_PORT%
echo Frontend: http://localhost:%FRONTEND_PORT%
echo ========================================
echo.
cd /d "%PROJECT_ROOT%\frontend"
npm install && npm run dev -- --port %FRONTEND_PORT%
cd /d "%PROJECT_ROOT%"
goto :eof

:backend
echo Starting backend only...
cd /d "%PROJECT_ROOT%\backend"
mvnw.cmd spring-boot:run -Dspring-boot.run.arguments=--server.port=%BACKEND_PORT% -Dspring-boot.run.profiles=local
goto :eof

:frontend
echo Starting frontend only...
cd /d "%PROJECT_ROOT%\frontend"
npm install
npm run dev -- --port %FRONTEND_PORT%
goto :eof
