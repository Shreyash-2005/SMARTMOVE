@echo off
cd /d "%~dp0"
echo SMARTMOVE setup
if not exist backend\.env copy backend\.env.example backend\.env
if not exist frontend\.env copy frontend\.env.example frontend\.env
call npm install
call npm run install:all
start "SMARTMOVE Backend" cmd /k "npm --prefix backend run dev"
start "SMARTMOVE Frontend" cmd /k "npm --prefix frontend run dev"
echo Open http://localhost:5173 after both servers start.
pause
