---
name: pagezero-content-improvement
description: 使用 Page Zero MCP 讀取與修改網站的 AEO 內容和 Context，或依要求匯出網站資料供下載與搬遷。
---

探索目前工具，以 `getConnectionInfo`、`listSites` 選定使用者要求的網站。網站有歧義才請使用者選擇；所有網站呼叫帶明確 `site_id`。

用 `listAeoContents`、`getAeoContent`、`listAeoContexts`、`readAeoContext` 讀取現有內容及事實。長正文依回傳的游標、偏移及 `document.revision` 完整續讀；修訂變更時重新讀取，不混接版本。

依使用者要求選擇目前提供的命令。純事實新增用 `addAeoContext`；修改、啟用或封存用對應 Context 命令。Context命令直接呼叫既有保存功能，不傳`operation_id`或`expected_revision`，版本歷史由服務保留。重送可能再次新增或修改，先確認前次結果。

使用者要求研究時，品牌、競品、熱門產品與需求問題分別用對應的 `research*` 單步工具，依 `document_id` 讀取已保存報告。完整市場研究、頁面意圖與主題評估沿用背景工作，以 `workflow_run_id` 查詢結果。`synthesizeBrandContexts` 與完整市場研究會自動建立及啟用 Context；只查已有資料時用讀取工具。

需要生成內容時，使用 `generateAeoContent`；修改現有欄位用 `editAeoArtifact`；批次生成用 `generateForPages`；補強短答案用 `capsuleContentEnrichment`。四者會嘗試發布，須同時具備 `aeo:run`、`aeo:write`、`publication:write`。不傳 `operation_id`，重送可能再次執行及扣費。單頁結果以 `content_id` 讀取正文；背景工作以 `workflow_run_id` 查詢 `getWorkflowResult`。寫入權限不包含讀取權限。

發布或撤回使用獨立的 `setAeoPublication`，帶site_id、page_path與action，不傳operation_id或expected_revision。沿用既有發布歷史與交付流程。核對 `getAeoContent` 與 `getAeoDeliveryStatus`，分別說明內容已保存、發布狀態及客戶網站最後確認的交付結果。未有網站確認時保留未確認狀態。

使用者要搬遷資料時，才使用 `prepareHandoffExport`，只傳 `site_id`，不傳 `operation_id`。每次呼叫會建立獨立匯出。以回傳的 `export_id` 查詢 `getExportStatus`，準備完成後讀取 manifest、檔案及資產清單。依回傳分頁與續讀欄位取完資料，核對大小與 SHA-256，明列缺少或排除的來源。`readExportFile` 的文字與二進位編碼依公開 schema 處理。同本人換有效連線仍可讀取，須具備目前角色及 `required_read_scopes`；新連線重新分頁。過期或來源失權時停止讀取。

工具未提供、缺 scope 或超出額度時說明實際限制。OAuth 重新授權後再核對網站。
