@echo off
setlocal enableextensions

if not "%ASYNCAPI_REDIRECTED%"=="1" if exist "%LOCALAPPDATA%\asyncapi\client\bin\asyncapi.cmd" (
  set ASYNCAPI_REDIRECTED=1
  "%LOCALAPPDATA%\asyncapi\client\bin\asyncapi.cmd" %*
  goto:EOF
)

if not defined ASYNCAPI_BINPATH set ASYNCAPI_BINPATH="%~dp0asyncapi.cmd"
if exist "%~dp0..\bin\node.exe" (
  "%~dp0..\bin\node.exe" "%~dp0..\bin\run" %*
) else if exist "%LOCALAPPDATA%\oclif\node\node-18.16.0.exe" (
  "%LOCALAPPDATA%\oclif\node\node-18.16.0.exe" "%~dp0..\bin\run" %*
) else (
  node "%~dp0..\bin\run" %*
)
