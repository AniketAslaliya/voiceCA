@echo off
echo Starting VoiceCA...
echo.

REM Kill any existing Node processes
taskkill /F /IM node.exe 2>nul

REM Start backend in background
echo Starting backend on port 3001...
start cmd /k "cd backend && npm start"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start frontend
echo Starting frontend on port 4173...
cd frontend
npm run preview

echo.
echo VoiceCA is running!
echo Frontend: http://localhost:4173
echo Backend: http://localhost:3001
