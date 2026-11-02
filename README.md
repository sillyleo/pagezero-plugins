# Page Zero plugin

透過既有 Page Zero 帳號使用正式 MCP，並提供五份公開任務技能。Codex 使用 `plugins/pagezero/` 下的 Agent Plugins manifest 與 `mcp.json`；Claude Code 使用 `.claude-plugin/plugin.json` 與 `.mcp.json`。兩者共用 `skills/`，不需要本機 MCP 程序。

## 安裝

直接從本公開儲存庫安裝，不需要取得 Page Zero 後端原始碼或先下載專案。

### Codex

```sh
codex plugin marketplace add sillyleo/pagezero-plugins
codex plugin add pagezero@pagezero
```

安裝後開啟新的工作階段。首次連線依宿主提示登入 Page Zero，選擇工作區、網站及授權範圍。Codex 使用 CIMD 發現用戶端，不需要在 plugin 內放 client secret。

### Claude Code

```sh
claude plugin marketplace add sillyleo/pagezero-plugins
claude plugin install pagezero@pagezero
```

重新開啟 Claude Code，以 `/mcp` 完成 Page Zero OAuth。Claude Code 自動探索正式服務的 CIMD 與 OAuth 設定。首次使用可先要求列出授權網站，再選擇明確的 `site_id`。

## 包含的技能

- `pagezero-sdk-installation`：安裝或檢查客戶網站的 SDK。
- `pagezero-site-audit`：審查網站與既有 AEO 資料。
- `pagezero-traffic-reporting`：查詢流量、爬蟲及 referral。
- `pagezero-visibility-tracking`：查詢及管理關鍵字與提示詞追蹤。
- `pagezero-content-improvement`：依現有資料改善內容。

所有技能先確認授權網站，網站呼叫必須使用明確 `site_id`。缺少權限時依宿主 OAuth 流程補足。MCP 授權與客戶網站 SDK 的連線授權分開；安裝 plugin 不會替網站安裝 SDK。

寫入、生成及追蹤操作會影響正式資料，沿用服務既有額度與計費。安裝包不包含憑證、內部提示詞、後端程式或客戶資料。

## 驗證與發行

在儲存庫根目錄執行：

```sh
node --test plugins/pagezero/plugin.test.mjs
claude plugin validate plugins/pagezero --strict
claude plugin validate .claude-plugin/marketplace.json --strict
codex plugin list --marketplace pagezero --available --json
```

本儲存庫只提供 plugin 與公開技能；MCP 服務由 Page Zero 託管。這是可直接安裝的公開 marketplace，尚未提交 Codex 或 Claude 官方目錄。

格式來源：[OpenAI plugin 文件](https://developers.openai.com/plugins/build/plugins)、[Claude Code plugin manifest](https://code.claude.com/docs/en/plugins/manifest-reference)、[Claude Code marketplace](https://code.claude.com/docs/en/plugins/create-marketplace)。
