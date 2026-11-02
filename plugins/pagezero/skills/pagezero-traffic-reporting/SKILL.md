---
name: pagezero-traffic-reporting
description: 使用 Page Zero MCP 查詢 AI 爬蟲、推薦來源與 GA4 流量，讀取或依要求保存流量報告。
---

探索目前工具，以 `getConnectionInfo`、`listSites` 確認網站，所有網站呼叫帶明確 `site_id`。先核對使用者要求的期間、時區、網址範圍與計數單位。

查報告先用 `listReports`、`getReport` 取得已有內容與來源期間。需要原始彙總時，用 `getTrafficOverview`、`getCrawlerStats`、`getCrawlerTrends`、`getReferralStats`、`listGa4PageTraffic`、`getGa4ReferralSessions` 等目前提供的工具。多頁資料沿游標取完，不把第一頁當作全站總數。

保留回傳的來源、觀測時間、涵蓋期間、可用性、警告與時區。Page Zero 爬蟲請求、推薦來源觀測及 GA4 工作階段是不同單位，分開列出，不直接相加。來源未連接、缺觀測、查詢失敗及確實為零要分開說明。推薦來源資料只代表可觀測部分，不推估成完整歸因或營收。

使用者要求保存新報告時，才用目前提供的 `generateCrawlerReport`，帶`site_id`及可選期間，不傳`operation_id`。重送可能另存一份報告。讀取結果所指的報告，核對 `source_period`，再交付資料與缺口。只要求查數據時直接回答數據，不另建追蹤或重跑研究。

要找特定網址的資料，用 `listTrafficUrls`、`getTrafficUrlDetail` 核對實際網址及期間。比較前確認各來源的期間與單位一致；無法對齊時明列差異。

缺 scope 時透過宿主 OAuth 取得所需範圍，重新核對網站。工具未提供時說明目前連線的能力，不假造報表。
