@echo off
setlocal

set "ROOT=%~dp0"
set "BUILD=%ROOT%build"

if not exist "%BUILD%" mkdir "%BUILD%"
if errorlevel 1 goto failed
if not exist "%BUILD%\css" mkdir "%BUILD%\css"
if errorlevel 1 goto failed
if not exist "%BUILD%\js" mkdir "%BUILD%\js"
if errorlevel 1 goto failed

copy /Y "%ROOT%index.html" "%BUILD%\index.html" >nul
if errorlevel 1 goto failed
copy /Y "%ROOT%css\style.css" "%BUILD%\css\style.css" >nul
if errorlevel 1 goto failed
copy /Y "%ROOT%js\app-bundle.js" "%BUILD%\js\app-bundle.js" >nul
if errorlevel 1 goto failed

echo Browser app assembled in "%BUILD%"
exit /b 0

:failed
echo Build failed. Check that index.html, css\style.css, and js\app-bundle.js exist.
exit /b 1
