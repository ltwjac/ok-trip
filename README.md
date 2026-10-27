# 綠林快槍手沖繩之旅

朋友可以直接開：[https://ltwjac.github.io/ok-trip/](https://ltwjac.github.io/ok-trip/)

## GitHub Pages

Repo 已設定 Pages 由 **`main` 分支根目錄** 提供網站（`index.html`）。合併到 `main` 之後，上面個網址會更新。

如果 Pages 被關咗，喺 Settings → Pages 揀 **Deploy from a branch**，branch 選 `main`，folder 選 `/ (root)`。

## Cloudflare Worker 同步

記帳本預設只存喺各人瀏覽器（`localStorage`）。要多人同步：

1. 用 `worker.js` 部署 Cloudflare Worker。
2. 建立 KV namespace，綁定名稱必須係 `EXPENSES_KV`。
3. 將 Worker URL 貼入 `index.html` 嘅 `CLOUDFLARE_API_URL`，再部署／推上 `main`。

客戶端會按支出 `id` 合併，較新嘅 `updatedAt` 勝出。`CLOUDFLARE_API_URL` 留空就只係本地記帳。

改動同已知問題見 `ISSUES.md`。
