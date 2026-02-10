@echo off

:: Project root directory
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

echo Usage: start.bat [all^|backend^|frontend] [backend_port] [frontend_port]
goto :eof

:all
echo Starting both backend and frontend...
echo.

:: Kill existing Java process on backend port
call :kill_port %BACKEND_PORT% "backend"

:: Kill existing Node process on frontend port
call :kill_port %FRONTEND_PORT% "frontend"

echo.
echo [1/2] Starting Backend (same window, background)...
cd /d "%PROJECT_ROOT%\backend"
start /b "" cmd /c "call mvnw.cmd spring-boot:run -Dspring-boot.run.arguments=--server.port=%BACKEND_PORT%"
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
    echo.
    echo   Backend is ready!
    goto :start_frontend
)

if %RETRY_COUNT% GEQ %MAX_RETRIES% (
    echo.
    echo   Warning: Backend health check timed out after 120 seconds.
    echo   Starting frontend anyway...
    goto :start_frontend
)

echo   Waiting... [%RETRY_COUNT%/%MAX_RETRIES%]
goto :wait_backend

:start_frontend
echo.
echo [2/2] Starting Frontend...
echo ========================================
echo   Backend:  http://localhost:%BACKEND_PORT%
echo   Frontend: http://localhost:%FRONTEND_PORT%
echo ========================================
echo.
echo   To stop: Ctrl+C (both backend and frontend will stop)
echo.
cd /d "%PROJECT_ROOT%\frontend"
call npm install >nul 2>&1 && call npm run dev -- --port %FRONTEND_PORT%
cd /d "%PROJECT_ROOT%"
goto :eof

:backend
echo Starting backend only...

:: Kill existing process
call :kill_port %BACKEND_PORT% "backend"

cd /d "%PROJECT_ROOT%\backend"
call mvnw.cmd spring-boot:run -Dspring-boot.run.arguments=--server.port=%BACKEND_PORT%
goto :eof

:frontend
echo Starting frontend only...
cd /d "%PROJECT_ROOT%\frontend"
call npm install
call npm run dev -- --port %FRONTEND_PORT%
goto :eof

:: --- Subroutine: kill process on a given port ---
:: Usage: call :kill_port [port] [label]
:kill_port
set "_PORT=%~1"
set "_LABEL=%~2"
echo Checking for existing %_LABEL% process on port %_PORT%...
set "_FOUND=0"
for /f "tokens=5" %%p in ('netstat -ano 2^>nul ^| findstr "LISTENING" ^| findstr ":%_PORT% "') do (
    if not "%%p"=="0" if not "%%p"=="" (
        set "_FOUND=1"
        echo   Killing PID=%%p on port %_PORT%...
        taskkill /PID %%p /F >nul 2>&1
        taskkill /PID %%p /T /F >nul 2>&1
    )
)
if "%_FOUND%"=="0" (
    echo   Port %_PORT% is free.
    goto :eof
)
echo   Waiting for port %_PORT% to be released...
set "_WAIT=0"
:_kp_wait
timeout /t 1 /nobreak >nul
set /a _WAIT+=1
netstat -ano 2>nul | findstr "LISTENING" | findstr ":%_PORT% " >nul 2>&1
if errorlevel 1 (
    echo   Port %_PORT% released.
    goto :eof
)
if %_WAIT% LSS 10 goto :_kp_wait
echo   Warning: port %_PORT% still occupied after 10s
goto :eof
