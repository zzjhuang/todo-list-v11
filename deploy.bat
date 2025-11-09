@echo off
REM Angular TodoList 部署腳本 (Windows 版本)
REM 用於快速構建和部署到 GitHub Pages

echo 🚀 開始 Angular TodoList 部署流程...

REM 檢查是否安裝了 Angular CLI
where ng >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Angular CLI 未安裝，請先安裝: npm install -g @angular/cli
    pause
    exit /b 1
)

REM 安裝專案依賴
echo 📦 安裝專案依賴...
call npm install

REM 構建生產版本
echo 🏗️ 構建生產版本...
call ng build --prod --base-href="/todo-list-v11/"

REM 檢查構建是否成功
if %errorlevel% equ 0 (
    echo ✅ 構建成功！
    echo 📁 構建文件位於: dist\todo-list-v11\
    echo.
    echo 🌐 部署到 GitHub Pages 的步驟：
    echo 1. 將專案推送到 GitHub
    echo 2. 在 GitHub 倉庫設定中啟用 Pages
    echo 3. 選擇 'Deploy from a branch'
    echo 4. 選擇 'main' 分支和 '/dist/todo-list-v11' 資料夾
    echo.
    echo 或者使用 angular-cli-ghpages 自動部署：
    echo npm install -g angular-cli-ghpages
    echo npx angular-cli-ghpages --dir=dist/todo-list-v11
) else (
    echo ❌ 構建失敗，請檢查錯誤訊息
)

pause