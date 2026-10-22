@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul || (echo Chua cai Node.js. Tai tai https://nodejs.org roi chay lai file nay. & pause & exit /b)
echo Dang chay Vuon Truyen Nho tai http://127.0.0.1:4173  (dong cua so nay de tat)
start "" cmd /c "timeout /t 2 >nul & start http://127.0.0.1:4173"
node preview.cjs
pause
