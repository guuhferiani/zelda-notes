@echo off
title Zelda Notes - Companion App
cd /d "%~dp0"
echo ========================================================
echo   Zelda Notes - Companion de Ocarina of Time
echo ========================================================
echo.
echo [1/2] Iniciando Bridge de sincronizacao com o jogo...
start /b npm run bridge
echo.
echo [2/2] Abrindo Web App no navegador...
npm run dev
