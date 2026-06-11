# API 请求与配置点梳理

本文档系统梳理当前 H5 流程中每个页面的后端请求、触发方式、按钮监听、输入监听、跳转链路，以及场景、风格、文案、Prompt 和 fallback 的配置位置。

当前结论：

- 前端真正发 `fetch` 的地方只有 `utils/expression-api.ts`。
- 页面不直接写 `fetch`，而是通过 `generateExpression`、`sendFeedback`、`trackEvent` 调用 BFF。
- 生成请求主要由 `/tone` 和 `/results` 的 `useEffect` 自动触发，也可以由结果页按钮手动触发。
- 复制、反馈、换风格等行为只在结果页触发埋点或反馈请求。
- 用户可见文案集中在 `config/copy/**`；模型 Prompt 集中在 `config/prompts/**`；页面只消费配置导出。

## 1. 页面总览

### `/` 首页

文件：`app/page.tsx`

职责：

- 展示产品定位、场景入口、最近使用、热门风格和主 CTA。
- 只写入前端流程状态，不发后端 API。

状态写入：

- 点击场景卡片：调用 `setScene(scene.key)`，然后通过 `SceneCard` 的 `href` 跳到 `/input?scene=<scene>`。
- 点击热门风格：调用 `setScene("work")` 和 `setStyle(style.key)`，然后跳到 `/input?scene=work`。
- 点击主 CTA：调用 `setScene("work")`，通过 `PrimaryButton` 跳到 `/input?scene=work`。

跳转位置：

- 头像按钮：`/results`
- 最近使用：`/results`
- 场景卡片：来自 `config/copy/content.ts` 中 `scenes[].href`
- 热门风格：固定 `/input?scene=work`
- 主 CTA：固定 `/input?scene=work`

后端请求：

- 无。

### `/input` 输入页

文件：`app/input/page.tsx`

职责：

- 读取 URL 中的 `scene`。
- 收集用户原话。
- 选择表达风格。
- 输入满足最小长度后进入 `/tone`。

监听与状态写入：

- `useSearchParams()` 读取 `scene` 查询参数。
- `useEffect` 中判断 `isScene(sceneKey)`，合法时调用 `setScene(sceneKey)`。
- `TextArea.onChange={setValue}`，输入内容写入 store 的 `text`。
- 风格卡片 `StyleCard.onClick` 调用 `setStyle(getStyleByIndex(index))`。
- 顶部“示例”按钮调用 `setValue(inputPageCopy.exampleRawText)`。
- 顶部“清空”按钮调用 `setValue("")`。

继续条件：

- `canContinue = value.trim().length >= 2`
- 满足条件时显示 `PrimaryButton href="/tone"`。
- 不满足条件时显示 disabled 原生按钮，不跳转。

后端请求：

- 无。

### `/tone` 语气仪表盘页

文件：`app/tone/page.tsx`

职责：

- 展示生成前预览。
- 调整三项语气滑杆。
- 在草稿可用时自动向后端请求生成。
- 进入 `/results` 展示结果。

草稿构建：

- 页面通过 store 的 `buildDraft()` 生成 `GenerateDraft`。
- `buildDraft()` 来源：`stores/expression-flow-store.ts`
- 需要满足：已有 `scene` 且 `text.trim().length > 0`。
- 实际页面 `hasDraft` 使用更严格判断：`Boolean(scene && text.trim().length >= 2)`。

自动发送生成请求的位置：

1. 首次进入页面自动生成

   文件：`app/tone/page.tsx`

   条件：

   - 页面第一次 mount。
   - `hasDraft === true`。
   - `generation.status === "idle"`。

   行为：

   - 调用 `runGenerate()`。
   - `runGenerate()` 内调用 `generateExpression(draft)`。
   - 最终发 `POST /api/generate`。

2. 草稿变化后防抖生成

   文件：`app/tone/page.tsx`

   条件：

   - `draft` 和 `requestKey` 存在。
   - 当前 `generation.requestKey` 不等于新 `requestKey`，或当前状态未覆盖该请求。

   行为：

   - `window.setTimeout(..., 350)` 防抖。
   - 350ms 后调用 `runGenerate()`。
   - 组件更新或卸载时 `window.clearTimeout(timerId)`。

滑杆监听：

- `ToneSlider` 的 `onChange` 分别调用：
  - `setSlider("politeness", value)`
  - `setSlider("formality", value)`
  - `setSlider("distance", value)`

滑杆变化会将 `generation.status` 重置为 `"idle"`，从而触发防抖生成。

按钮监听：

- 顶部“重置”：调用 `setSliders(defaultSliders)`。
- 底部主按钮：
  - 有草稿：`href="/results"`
  - 无草稿：`href="/input"`

后端请求：

- `POST /api/generate`

请求函数：

- `utils/expression-api.ts` 中 `generateExpression(draft)`

响应处理：

- `response.ok === true`：调用 `setGenerationSuccess(response.data, requestKey)`。
- `response.ok === false` 且 `code === "SAFETY_REFUSED"`：状态设为 `"refused"`。
- 其他失败：状态设为 `"fail"`。

### `/results` 结果页

文件：`app/results/page.tsx`

职责：

- 展示原话、生成状态和三种结果卡。
- 如果结果还没生成，则自动补发生成请求。
- 支持复制、反馈、重试/再润色、换风格、调语气。

自动发送生成请求的位置：

文件：`app/results/page.tsx`

触发：

- `useEffect` 根据 `draft`、`requestKey`、`generation.status` 自动判断是否需要请求。

不会重复请求的情况：

- 当前状态是 `success-model` 或 `success-fallback`，且 `requestKey` 匹配。
- 当前状态是 `loading`，且 `requestKey` 匹配。
- 当前状态是 `fail` 或 `refused`，且 `requestKey` 匹配。

会请求的情况：

- 有合法 `draft`。
- 当前 store 中没有匹配当前草稿的成功、加载中或失败状态。

请求行为：

- 调用 `runGenerate(draft)`。
- `runGenerate` 调用 `generateExpression(nextDraft)`。
- 最终发 `POST /api/generate`。

手动生成请求：

- “重试一次”按钮：调用 `handleRegenerate()`。
- 结果卡“再润色”按钮：调用 `handleRegenerate()`。

`handleRegenerate()` 行为：

- 调用 `buildDraft("regenerate")`。
- 有草稿时调用 `runGenerate(nextDraft)`。
- 最终发 `POST /api/generate`，其中 `operation` 为 `"regenerate"`。

复制请求与监听：

- 结果卡“复制”按钮：`ResultCard.onCopy`
- 页面处理函数：`handleCopy(mode)`
- 行为：
  - 先通过 `navigator.clipboard?.writeText(copiedText)` 写入剪贴板。
  - 再调用 `trackEvent(...)`。
  - 最终发 `POST /api/track`。

复制埋点 payload：

```ts
{
  sessionId,
  event: "copy_result",
  payload: {
    mode,
    candidateIndex: generatedResult[mode].recommendedIndex,
  },
}
```

反馈请求与监听：

- 结果卡“有用”按钮：`ResultCard.onUseful`
- 页面处理函数：`handleUseful(mode)`
- 行为：
  - 调用 `sendFeedback(...)`。
  - 最终发 `POST /api/feedback`。

反馈 payload：

```ts
{
  sessionId,
  resultId: `${sessionId}-${mode}`,
  useful: true,
  reasonTags: generatedResult?.[mode].reasons ?? ["usable"],
}
```

换风格埋点与监听：

- 结果卡“换风格”按钮：`ResultCard.onSwitchStyle`
- 行为：
  - 调用 `trackEvent(...)`。
  - 然后 `window.location.href = "/input"`。
  - 最终发 `POST /api/track`。

换风格埋点 payload：

```ts
{
  sessionId,
  event: "switch_style_from_result",
  payload: { mode: result.mode },
}
```

其他按钮：

- 顶部“收藏”：目前只传入 label 和 icon，没有 `onClick`，不发请求。
- 顶部“分享”：目前只传入 label 和 icon，没有 `onClick`，不发请求。
- “查看原话 -> 优化版变化点”：当前只是按钮展示，没有 `onClick`，不发请求。
- “再调整语气”：普通 `<a href="/tone">`。
- 底部“换一种风格”：`PrimaryButton href="/input"`。

## 2. 前端 API client

文件：`utils/expression-api.ts`

统一请求函数：

```ts
async function postJson<T>(url: string, payload: unknown): Promise<T>
```

请求方式：

- `method: "POST"`
- `headers: { "Content-Type": "application/json" }`
- `body: JSON.stringify(payload)`

错误处理：

- 尝试 `response.json()`。
- 如果 HTTP 非 2xx 且没有 JSON body，返回：

```ts
{
  ok: false,
  code: "NETWORK_ERROR",
  message: apiErrorCopy.networkError,
}
```

导出的请求函数：

- `generateExpression(draft)` -> `POST /api/generate`
- `sendFeedback(payload)` -> `POST /api/feedback`
- `trackEvent(payload)` -> `POST /api/track`

## 3. 后端 API route

### `POST /api/generate`

文件：`app/api/generate/route.ts`

流程：

1. `await request.json()`
2. `GenerateRequestSchema.safeParse(body)`
3. 校验失败：返回 `jsonError("INVALID_INPUT", apiErrorCopy.invalidInput, 400)`
4. 校验成功：调用 `lib/use-cases/generate-expression.ts` 中的 `generateExpression(parsed.data)`
5. 成功返回：`Response.json(result, { status: 200 })`
6. 未捕获异常：返回 `jsonError("INTERNAL_ERROR", apiErrorCopy.internalError, 500)`

运行时：

- `export const runtime = "nodejs"`

请求 schema：

文件：`lib/validators/generate.ts`

字段：

- `text`: 字符串，trim，最小长度来自 `minInputTextLength`，最大长度来自 `maxInputTextLength`
- `scene`: `student | work | social | formal`
- `style`: `delay | refuse | boundary | followup | decode | sarcasm`
- `sliders`: `{ politeness, formality, distance }`，0-100 整数
- `outputModes`: `wechat | email | spoken` 数组，默认 `defaultOutputModes`
- `operation`: `generate | regenerate | edit`，默认 `"generate"`
- `context.sessionId`: 可选
- `context.prev`: 可选

服务端 use-case：

文件：`lib/use-cases/generate-expression.ts`

流程：

1. 记录 `generateStarted` 日志。
2. `assertRequestSafe(request)` 前置安全检查。
3. `buildGenerationContext(request)` 构建 Prompt 上下文。
4. `generateWithLlmOrFallback(request, context)` 调模型或 fallback。
5. `isGeneratedResultSafe(data)` 后置安全检查。
6. 成功记录 `generateSucceeded`。
7. 安全拒绝返回 `ok: false, code: "SAFETY_REFUSED"`。
8. 其他错误继续抛给 route，route 返回 `INTERNAL_ERROR`。

LLM/fallback：

文件：`lib/llm/pipeline.ts`

流程：

- `createChatModel()` 判断模型是否配置。
- 未配置：直接 `createFallbackResult(...)`。
- 已配置：
  - `generationPrompt.invoke(...)` 组装 Prompt。
  - `model.invoke(promptValue, { response_format: { type: "json_object" } })`
  - 超时、坏输出、模型异常都会 fallback。
  - 解析 JSON 后用 `normalizeGeneratedResult(...)` 归一化。

### `POST /api/feedback`

文件：`app/api/feedback/route.ts`

流程：

1. `await request.json()`
2. `FeedbackRequestSchema.safeParse(body)`
3. 校验失败：`INVALID_INPUT`
4. 校验成功：调用 `submitFeedback(parsed.data)`
5. 返回 `{ ok: true }`

schema：

文件：`lib/validators/feedback.ts`

字段：

- `sessionId`: 必填字符串，1-120
- `resultId`: 必填字符串，1-120
- `useful`: boolean
- `reasonTags`: 字符串数组，最多 10 个，每个 1-40，默认 `[]`

当前后端行为：

- 只调用 `logEvent(analyticsEvents.feedbackSubmitted, ...)`。
- 没有数据库写入。

### `POST /api/track`

文件：`app/api/track/route.ts`

流程：

1. `await request.json()`
2. `TrackRequestSchema.safeParse(body)`
3. 校验失败：`INVALID_INPUT`
4. 校验成功：调用 `trackEvent(parsed.data)`
5. 返回 `{ ok: true }`

schema：

文件：`lib/validators/track.ts`

字段：

- `sessionId`: 必填字符串，1-120
- `event`: 必填字符串，1-80
- `payload`: 可选对象，默认 `{}`

当前后端行为：

- 只调用 `logEvent(analyticsEvents.userTracked, ...)`。
- 没有数据库写入。

## 4. Store 与请求草稿

文件：`stores/expression-flow-store.ts`

核心状态：

- `sessionId`
- `scene`
- `text`
- `style`
- `sliders`
- `generation`

默认值：

- `style`: `"boundary"`
- `sliders`: `defaultSliders`

当前前端默认滑杆：

```ts
{
  politeness: 76,
  formality: 58,
  distance: 62,
}
```

生成状态：

- `idle`
- `loading`
- `success-model`
- `success-fallback`
- `fail`
- `refused`

状态重置规则：

- `setText`：文本变化时将 `generation.status` 重置为 `"idle"`。
- `setStyle`：风格变化时将 `generation.status` 重置为 `"idle"`。
- `setSlider`：任一滑杆变化时将 `generation.status` 重置为 `"idle"`。
- `setSliders`：批量更新滑杆时将 `generation.status` 重置为 `"idle"`。

`buildDraft(operation = "generate")` 输出：

```ts
{
  text,
  scene,
  style,
  sliders,
  outputModes: ["wechat", "email", "spoken"],
  operation,
  context: {
    sessionId,
    prev: generation.result ?? undefined,
  },
}
```

`createRequestKey(draft)`：

- 将 `text`、`scene`、`style`、`sliders`、`outputModes`、`operation` 序列化成 JSON。
- 用于判断当前结果是否已经覆盖当前草稿，避免重复请求。
- 不包含 `sessionId` 和 `prev`。

## 5. 组件监听点

### `PrimaryButton`

文件：`components/PrimaryButton.tsx`

行为：

- 使用 `antd-mobile` 的 `Button`。
- 点击时先执行可选 `onClick?.()`。
- 再执行 `router.push(href)`。

影响：

- 首页主 CTA 会先写入默认场景，再跳转。
- 其他页面主按钮主要负责跳转。

### `SceneCard`

文件：`components/SceneCard.tsx`

行为：

- 使用 Next `Link`。
- 点击时执行可选 `onClick`。
- 再按 `href` 跳转。

当前用途：

- 首页点击场景卡时写入 `scene`。

### `StyleCard`

文件：`components/StyleCard.tsx`

行为：

- 原生 button。
- 点击执行 `onClick`。

当前用途：

- 输入页点击风格卡写入 `style`。

### `ToneSlider`

文件：`components/ToneSlider.tsx`

行为：

- 滑杆变化时执行 `onChange(nextValue)`。

当前用途：

- 语气页写入 `politeness`、`formality`、`distance`。
- 滑杆变化会间接触发 `/api/generate` 防抖请求。

### `ResultCard`

文件：`components/ResultCard.tsx`

按钮：

- “复制”：调用 `onCopy`
- “有用”：调用 `onUseful`
- “再润色”：调用 `onRegenerate`
- “换风格”：调用 `onSwitchStyle`

组件本身不发请求，请求由 `app/results/page.tsx` 传入的 handler 完成。

### `TopBar`

文件：`components/TopBar.tsx`

行为：

- 返回按钮使用 Next `Link`。
- action 按钮调用传入的 `onClick`。

当前实际 action：

- 输入页“示例”：写入示例原话。
- 输入页“清空”：清空原话。
- 语气页“重置”：重置滑杆。
- 结果页“收藏/分享”：没有传 `onClick`，当前不执行实际动作。

## 6. 配置与文案位置

### 页面文案

文件：`config/copy/pages.ts`

包含：

- `appMetadataCopy`
- `homePageCopy`
- `inputPageCopy`
- `tonePageCopy`
- `resultsPageCopy`

适合修改：

- 页面标题、副标题
- CTA 文案
- 空状态文案
- loading/refused/fail 文案
- 输入页示例原话
- 语气页实时预览 fallback 样例

### 组件文案

文件：`config/copy/components.ts`

包含：

- `topBarCopy`
- `resultCardCopy`
- `bottomNavCopy`

适合修改：

- 返回按钮 aria 文案
- 结果卡按钮文案：复制、有用、再润色、换风格
- 底部导航文案

### 场景、风格、结果卡元信息

文件：`config/copy/content.ts`

包含：

- `scenes`
- `expressionStyles`
- `resultCards`

适合修改：

- 首页四个场景卡的标题、副标题、跳转、图标、context
- 六种风格卡的标题、说明、图标
- 三种结果卡的 label、tone、icon、fit、静态 tags、静态示例 text

注意：

- 当前实时结果正文来自 API。
- `resultCards[].text` 是静态元信息中的旧 demo 示例，结果页当前实际展示的是后端返回的推荐候选。

### API 错误文案

文件：`config/copy/api.ts`

包含：

- `apiErrorCopy.invalidInput`
- `apiErrorCopy.internalError`
- `apiErrorCopy.networkError`

使用位置：

- `app/api/generate/route.ts`
- `app/api/feedback/route.ts`
- `app/api/track/route.ts`
- `utils/expression-api.ts`

### fallback 生成文案

文件：`config/copy/fallback.ts`

核心函数：

- `createLocalizedFallbackCopy(language, style, rawText, note)`

适合修改：

- 模型不可用或模型输出异常时的兜底结果。
- 中文、英文、日文、韩文 fallback 输出。
- 不同 style 的 fallback 意图描述。
- fallback 的 reasons、assumptions、safetyNotes。

### Prompt 配置

文件：

- `config/prompts/generation.ts`
- `config/prompts/few-shots.ts`

`config/prompts/generation.ts` 包含：

- `generationPromptCopy.systemLines`
- `generationPromptCopy.humanLines`
- `promptSceneLabels`
- `promptStyleLabels`
- `promptLanguageLabels`
- `promptLanguageInstructions`

适合修改：

- 模型系统规则。
- 输出 JSON 要求。
- 场景传给模型时的标签。
- 风格传给模型时的标签。
- 多语言输出要求。

`config/prompts/few-shots.ts` 包含：

- `promptStyleFewShotConfig`
- `formatPromptFewShots(style)`

适合修改：

- 六种风格的 few-shot 样例。
- 风格定位、关键词、样例原话、样例改写、策略说明、风险提醒。

### 枚举与类型契约

文件：`lib/domain/enums.ts`

核心枚举：

- 场景：`student | work | social | formal`
- 风格：`delay | refuse | boundary | followup | decode | sarcasm`
- 输出模式：`wechat | email | spoken`
- 操作：`generate | regenerate | edit`
- 语言：`zh-CN | en | ja | ko`
- 生成来源：`model | fallback`

如果新增场景、风格或输出模式，至少要同步检查：

- `lib/domain/enums.ts`
- `config/copy/content.ts`
- `config/prompts/generation.ts`
- `config/prompts/few-shots.ts`
- `lib/validators/generate.ts`
- `stores/expression-flow-store.ts`
- `app/results/page.tsx`

### 默认值与限制

文件：`lib/domain/defaults.ts`

用于后端 schema 和模型链路的默认值与限制。

另一个前端默认滑杆位置：

- `stores/expression-flow-store.ts` 中 `defaultSliders`

如果要统一默认滑杆，建议检查这两个位置是否存在重复定义或语义差异。

## 7. 想改内容时看哪里

想改首页标题、说明、CTA：

- `config/copy/pages.ts` 的 `homePageCopy`

想改输入页 placeholder、示例、按钮文案：

- `config/copy/pages.ts` 的 `inputPageCopy`

想改语气页滑杆标题、左右标签、提示语：

- `config/copy/pages.ts` 的 `tonePageCopy.sliders`

想改语气页未生成前的实时预览 fallback：

- `config/copy/pages.ts` 的 `tonePageCopy.previewSamples`

想改结果页 loading、失败、拒绝、空状态：

- `config/copy/pages.ts` 的 `resultsPageCopy`

想改四个场景入口：

- `config/copy/content.ts` 的 `scenes`

想改六个风格卡：

- `config/copy/content.ts` 的 `expressionStyles`

想改模型理解的六个风格：

- `config/prompts/generation.ts` 的 `promptStyleLabels`
- `config/prompts/few-shots.ts` 的 `promptStyleFewShotConfig`

想改模型系统 Prompt：

- `config/prompts/generation.ts` 的 `generationPromptCopy.systemLines`

想改模型输入模板：

- `config/prompts/generation.ts` 的 `generationPromptCopy.humanLines`

想改模型不可用时的兜底结果：

- `config/copy/fallback.ts`

想改生成 API 请求字段：

- 前端草稿：`stores/expression-flow-store.ts`
- 后端 schema：`lib/validators/generate.ts`
- 后端 use-case：`lib/use-cases/generate-expression.ts`

想改复制后的埋点：

- `app/results/page.tsx` 的 `handleCopy`
- 后端：`app/api/track/route.ts` 和 `lib/use-cases/track-event.ts`

想改“有用”反馈：

- `app/results/page.tsx` 的 `handleUseful`
- 后端：`app/api/feedback/route.ts` 和 `lib/use-cases/submit-feedback.ts`

想让收藏/分享真的工作：

- `app/results/page.tsx` 中 `TopBar` actions 当前只有 label/icon，没有 `onClick`。

想让“查看变化点”工作：

- `app/results/page.tsx` 中 `compareButton` 当前没有 `onClick`。

## 8. 当前请求清单

| 触发位置 | 用户动作/生命周期 | 前端函数 | API | 后端入口 |
| --- | --- | --- | --- | --- |
| `/tone` | 首次进入且草稿可用 | `generateExpression(draft)` | `POST /api/generate` | `app/api/generate/route.ts` |
| `/tone` | 输入、风格或滑杆变化后状态回到 idle，再防抖 | `generateExpression(draft)` | `POST /api/generate` | `app/api/generate/route.ts` |
| `/results` | 进入结果页但当前草稿没有匹配结果 | `generateExpression(draft)` | `POST /api/generate` | `app/api/generate/route.ts` |
| `/results` | 点击“重试一次” | `generateExpression(buildDraft("regenerate"))` | `POST /api/generate` | `app/api/generate/route.ts` |
| `/results` | 点击结果卡“再润色” | `generateExpression(buildDraft("regenerate"))` | `POST /api/generate` | `app/api/generate/route.ts` |
| `/results` | 点击结果卡“复制” | `trackEvent(...)` | `POST /api/track` | `app/api/track/route.ts` |
| `/results` | 点击结果卡“有用” | `sendFeedback(...)` | `POST /api/feedback` | `app/api/feedback/route.ts` |
| `/results` | 点击结果卡“换风格” | `trackEvent(...)` | `POST /api/track` | `app/api/track/route.ts` |

## 9. 当前未发请求但有入口的位置

- 首页头像按钮：跳 `/results`，不发请求。
- 首页最近使用：跳 `/results`，不发请求。
- 输入页“示例”：只写入本地 store，不发请求。
- 输入页“清空”：只写入本地 store，不发请求。
- 输入页“开始转换”：只跳 `/tone`，不直接发请求；请求由 `/tone` mount 后触发。
- 语气页“重置”：只改本地滑杆；随后可能因状态 idle 触发防抖生成。
- 语气页“生成结果”：只跳 `/results`；如果 `/tone` 已生成成功，结果页不会重复发同一个请求。
- 结果页“收藏”：当前无 `onClick`。
- 结果页“分享”：当前无 `onClick`。
- 结果页“查看变化点”：当前无 `onClick`。
- 结果页“再调整语气”：只跳 `/tone`。
- 结果页底部“换一种风格”：只跳 `/input`。

## 10. 维护注意事项

- 不要在页面里新增散落的 `fetch`；继续通过 `utils/expression-api.ts` 收口。
- 不要把 Prompt 文本写进页面或组件；模型可见文本放 `config/prompts/**`。
- 不要把用户可见文案写进业务 use-case；用户可见 copy 放 `config/copy/**`。
- 修改生成请求字段时，前端 `GenerateDraft`、后端 zod schema、Prompt 上下文和 fallback 都要一起检查。
- 修改风格或场景时，要同时检查 UI copy、Prompt label、few-shot、枚举、schema 和结果页映射。
- 当前 feedback/track 只落日志，不做数据库持久化。
- 当前模型不可用时会 fallback，因此看到 `success-fallback` 不代表真实模型链路已成功。
