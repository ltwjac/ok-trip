# 綠林快槍手沖繩之旅 App — 原版問題同改進

## 原版發現嘅問題

- **XSS 風險**：支出描述、audit log、人名等直接塞入 `innerHTML`，惡意字串可以注入腳本。
- **酒店圖示壞咗**：用咗 `timeline-hotel-icon` class，但 CSS 冇定義，酒店圓圈冇底色／樣式。
- **匯率寫死**：`accData.rate` 預設 0.052，UI 冇得改，亦唔會持久化提示用戶改。
- **分攤太死板**：只可以「全部」或「單一人」，唔可以例如「Wing + Michael」兩人分。
- **結算顯示唔齊**：程式計咗 `paid`（已付）同 `consumed`（已用），但畫面只顯示淨額，睇唔到明細。
- **歷史篩選有邏輯冇 UI**：`selectedFilterUser` 存在，但記帳頁冇篩選 chips。
- **用陣列 index 改／刪**：刪除或同步時 index 會錯位；冇穩定 `id`，唔適合多人雲端合併。
- **揀墊支／分攤會整頁重繪**：`selectPayer` / `selectSplitUser` 呼叫 `renderAccounting()`，輸入框閃爍、可能失焦。
- **雲端同步殘缺**：`CLOUDFLARE_API_URL` 空白；有 URL 時係整份覆蓋，冇按支出 id merge，多人同時改會互相覆蓋。
- **假保安**：audit 密碼明文寫喺 JS（`ltwy`）；刪除要確認兩次仲有玩笑文案，體驗差又唔係真保安。
- **PWA／手機**：`user-scalable=no` 禁止縮放；`body { overflow: hidden; height: 100vh }` 容易令軟鍵盤頂壞版面；缺 `theme-color`、apple web-app meta、manifest。
- **金額輸入**：`<input type="number">` 冇 `inputmode="decimal"` / `step="any"`，手機鍵盤唔理想。
- **日子 tab 資訊不足**：只顯示 D1–D5，冇日期（11/11 等）。
- **手冊偏短**：有自駕同婚禮，但缺緊急電話、ETC／高速公路簡介。

## 今次改咗咩

- 所有用戶可控字串經 `escapeHtml()` 先先輸出。
- 補上 `.timeline-hotel-icon`（紅底白屋）同 timeline 樣式。
- 記帳頁可改匯率，寫入 `accData.rate` 並存 localStorage／雲端。
- 分攤改為成員 multi-select chips；舊 `splitUser` 字串自動 migrate 成 `splitUsers` 陣列；STORAGE_KEY 升至 `v14`。
- 結算報告顯示每人 **已付／已用／淨額**，另保留找數清單。
- 歷史紀錄加入「全部／各成員」篩選 chips。
- 每筆支出有穩定 `id` + `updatedAt`；改刪改用 id。
- 揀墊支／分攤只更新按鈕 class，唔整頁重繪。
- 提供 `worker.js`（KV `EXPENSES_KV`）；客戶端 GET／POST，按 expense id union、較新 `updatedAt` 勝出；顯示同步狀態。
- audit 用簡單 client-side hash 比對（溫和阻嚇，註明唔係真保安）；刪除只確認一次。
- PWA meta、theme-color、相對 `manifest.webmanifest` data URL；viewport 容許縮放；`min-h-dvh` 可捲動版面。
- 金額欄 `type="number" inputmode="decimal" step="any"`。
- Tab：D1 11/11、D2 12/11、D3 13/11💍、D4 14/11🏮、D5 15/11✈️。
- 手冊加 110／119、ETC／高速公路短講；行程內容維持原版，唔亂加景點。
