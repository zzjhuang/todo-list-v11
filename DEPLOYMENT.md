# 📋 發布到 GitHub 指南

## 🚀 快速發布步驟

### 方法一：使用 GitHub Actions 自動部署（推薦）

1. **上傳到 GitHub**

   ```bash
   # 初始化 Git 倉庫（如果還沒有的話）
   git init

   # 添加所有文件
   git add .

   # 提交變更
   git commit -m "Initial commit: Angular TodoList v11"

   # 添加遠程倉庫（替換為你的 GitHub 倉庫 URL）
   git remote add origin https://github.com/your-username/todo-list-v11.git

   # 推送到 GitHub
   git push -u origin main
   ```

2. **啟用 GitHub Pages**
   - 進入 GitHub 倉庫設定頁面
   - 找到 "Pages" 設定
   - Source 選擇 "GitHub Actions"
   - 推送代碼後，Actions 會自動構建和部署

### 方法二：手動部署

1. **構建專案**

   ```bash
   # Windows 用戶可以直接執行
   .\deploy.bat

   # Linux/Mac 用戶
   ./deploy.sh

   # 或者手動執行
   ng build --prod --base-href="/todo-list-v11/"
   ```

2. **上傳到 GitHub**

   ```bash
   git add .
   git commit -m "Build for production"
   git push origin main
   ```

3. **設定 GitHub Pages**
   - 進入倉庫設定
   - Pages 設定中選擇 "Deploy from a branch"
   - 分支選擇 "main"
   - 資料夾選擇 "/dist/todo-list-v11"

### 方法三：使用 angular-cli-ghpages

1. **安裝 angular-cli-ghpages**

   ```bash
   npm install -g angular-cli-ghpages
   ```

2. **一鍵部署**
   ```bash
   ng build --prod --base-href="/todo-list-v11/"
   npx angular-cli-ghpages --dir=dist/todo-list-v11
   ```

## 🔧 重要設定

### Angular 路由設定

確保 `app-routing.module.ts` 中使用 `HashLocationStrategy`：

```typescript
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";

// ... routes 設定

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AppRoutingModule {}
```

### 404 錯誤處理

為了處理 GitHub Pages 的 404 問題，可以在 `dist/todo-list-v11` 資料夾中添加 `404.html`：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>TodoList</title>
    <script>
      // GitHub Pages 404 重定向處理
      sessionStorage.redirect = location.href;
      location.replace(location.origin + location.pathname.split("/").slice(0, -1).join("/") + "/#/");
    </script>
  </head>
  <body></body>
</html>
```

## 🌐 訪問你的網站

部署完成後，你可以通過以下 URL 訪問：

```
https://your-username.github.io/todo-list-v11/
```

## 🐛 常見問題

### 1. 路由不工作

- 確保使用 `HashLocationStrategy`
- 檢查 `base-href` 設定是否正確

### 2. 資源載入失敗

- 檢查 `--base-href` 參數是否正確設定
- 確保所有資源路徑都是相對路徑

### 3. GitHub Actions 失敗

- 檢查 Node.js 版本是否符合
- 確保 `package.json` 中有正確的建構腳本

### 4. 頁面空白

- 檢查瀏覽器控制台是否有 JavaScript 錯誤
- 確認 Angular 應用程式能正常運行

## 📱 測試部署

在部署前，建議本地測試：

```bash
# 構建生產版本
ng build --prod

# 使用 http-server 測試（需要安裝）
npm install -g http-server
http-server dist/todo-list-v11 -p 8080
```

然後在瀏覽器中訪問 `http://localhost:8080` 確認一切正常。
