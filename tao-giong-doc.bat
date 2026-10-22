@echo off
chcp 65001 >nul
cd /d "%~dp0tools"
where node >nul 2>nul || (echo Chua cai Node.js. Tai tai https://nodejs.org roi chay lai file nay. & pause & exit /b)
echo Buoc 1/2: cai thu vien tao giong doc...
call npm install --no-audit --no-fund
echo.
echo Buoc 2/2: tao giong doc cho cac cau moi hoac da sua (can mang Internet, co the mat 10-20 phut)...
node gen-audio.mjs
echo.
echo Xong! Tai lai trang truyen (Ctrl+F5) de nghe giong moi.
pause
