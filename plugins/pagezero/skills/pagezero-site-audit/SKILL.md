---
name: pagezero-site-audit
description: 使用 Page Zero MCP 查閱網站審查，或依使用者要求執行單頁與全站審查並讀取結果。
---

先探索目前連線提供的工具與參數。以 `getConnectionInfo`、`listSites` 確認授權工作區及網站。使用者已明確指定且唯一符合的網站可直接選用；仍有多個候選時請使用者選擇。每次網站操作都帶明確 `site_id`，不把網域當成識別碼。

先用 `listSitePages`、`getPageAudit`、`listAuditRuns`、`getAuditRun` 讀取已有資料。依來源時間說明結果；缺資料不代表沒有問題。

使用者要求新審查時，單頁用 `auditUrl`，全站用 `auditSiteWide`，基礎盤點用 `searchFoundationAudit`。`runInitialScanPlaybook` 會研究、保存報告並建立及啟用 Context，依使用者要求使用。四者須具備 `aeo:run`、`aeo:write` 及 editor 角色，可能消耗方案額度。依公開 schema 填業務欄位，不設定模型、供應商或使用者身分。

不傳 `operation_id`，重送可能再次執行及扣費。`auditUrl` 直接回傳本次訊號，不保存單頁報告；回傳 `fetch_notice` 時說明抓取限制，不把未抓到的動態內容當作頁面真實缺漏。

盤點回傳 `discovery_only` 時沒有背景工作。收到 `workflow_run_id` 後，以 `listWorkflowRuns`、`getWorkflowResult` 查閱狀態與可見結果。依回傳的後續查詢方式等待，不密集輪詢。列出已完成、失敗及缺資料項目，引用實際頁面、期間與來源，不把已受理說成審查完成。

工具未提供時說明目前連線的能力。缺 scope 時透過宿主 OAuth 取得所需範圍，再重新選站。權限與額度錯誤不靠換網站或操作識別重試。
