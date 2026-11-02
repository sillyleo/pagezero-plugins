---
name: pagezero-sdk-installation
description: 在客戶專案安裝或檢查 Page Zero 的 Next.js、Laravel 或 WordPress 整合，並用 MCP 核對網站觀測。
---

先探索 MCP 工具，以 `getConnectionInfo`、`listSites` 確認授權網站。所有網站呼叫帶明確 `site_id`。讀取本機專案判定框架，再以 `site_id`、`framework` 與 `surfaces` 呼叫 `getSdkInstallGuide`。`surfaces` 沿用使用者已選定的 `aeo` 或 `cms` 功能，仍不明確時再確認範圍，不擅自增加網站功能。依回傳的支援條件及本機指令操作，不自行猜套件版本或設定值。

MCP 連線授權與客戶網站 SDK 的授權各自獨立。使用者已指定安裝的專案可直接進行授權範圍內的本機修改。需要瀏覽器 OAuth 時使用一般登入流程；遇到必須本人完成的登入，再交由使用者操作。不要請使用者把憑證貼進聊天。

Next.js 或 Laravel 的指引提供 wizard 時，在正確的本機專案目錄執行其指令，核對 wizard 實際選到的網站與 MCP `site_id` 一致。WordPress 不使用 Node.js wizard。若指南回傳 `unsupported`，說明缺少可用安裝步驟，先取得官方 Plugin 指引；可繼續查閱既有整合觀測，不猜下載網址或安裝指令。

安裝後執行指引要求的 doctor 與本機檢查，再用 `getSdkStatus`、`listSdkObservations`、`listDoctorReports`、`getDoctorReport` 核對該網站的最新觀測。分別報告本機安裝、實際執行、網站回報與公開交付證據。舊 heartbeat 只代表過去曾被觀測。

宿主沒有本機檔案或命令能力時，提供指引回傳的操作方式及待驗證項目；遠端 MCP 沒有替客戶執行 shell 的能力。缺 scope 時先由宿主 OAuth 補足授權，不把 API key 或帶憑證的網址寫入報告。
