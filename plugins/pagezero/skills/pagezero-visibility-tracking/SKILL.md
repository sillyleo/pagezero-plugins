---
name: pagezero-visibility-tracking
description: 使用 Page Zero MCP 查閱關鍵字與 AI 能見度歷史，或依使用者要求開始及停止追蹤。
---

探索目前工具，先用 `getConnectionInfo`、`listSites` 確認授權網站，所有網站呼叫帶 `site_id`。多個網站仍有歧義時請使用者選擇。

查歷史時用 `listTrackedKeywords`、`listTrackedPrompts`、`getTrackingSchedule` 取得真實目標識別，再用相應樣本與趨勢工具。沿回傳游標讀完所需資料，保留平台、期間、時區與取樣時間。沒有樣本不等於排名為零，未找到排名與供應商失敗分開呈現。

使用者要開始追蹤時，才使用目前提供的 `trackKeyword` 或 `trackPrompt`，帶site_id及業務欄位，不傳operation_id。工具沿用原生追蹤流程，回傳target_id與workflow_run_id；重送可能再次啟動及扣費。提示詞目前須明選已支援平台，Claude與Perplexity維持費率未核實的限制，省略平台也可能被拒絕。依getTrackingSchedule的keyword_id或listTrackedPrompts的next_run_at呈現排程，不把已啟動說成已有新樣本。之後以getWorkflowResult的workflow_run_id與樣本工具讀取結果。

使用者要停止追蹤時，用目前提供的 `untrackKeyword` 或 `untrackPrompt`。只需site_id與目標識別，不傳operation_id。直接封存目標並停止後續排程，保留歷史；已受理工作仍可能繼續。若還要求停止目前工作，使用可見且可取消工作的 `cancelWorkflowRun`，依回傳 `cancellation_effect` 說明實際結果，不承諾供應商撤回或退款。

`suggestTrackingPrompts`只需`site_id`及可選的`max`、`report_language`，直接回傳建議，不自動追蹤。不要傳`operation_id`，重送可能再次扣費。

比較數據時保持平台、地區、語言及期間一致；只解讀回傳的排名、引用與來源，不推測未觀測的流量或曝光。

缺 scope 時透過宿主 OAuth 取得所需範圍。工具未提供或額度不足時說明限制，不用建立另一個目標繞過。
