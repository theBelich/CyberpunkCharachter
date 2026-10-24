@echo off
setlocal

set "ROOT=%~dp0"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%ROOT%tools\build-standalone.ps1" -ProjectRoot "%ROOT%."
if errorlevel 1 goto failed

echo.
echo Share the standalone file: "%ROOT%build\index.html"
exit /b 0

:failed
echo Build failed. Check that PowerShell and the source files are available.
exit /b 1
