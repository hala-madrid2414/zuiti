# Backend BFF + Frontend State Spec

## Problem

当前项目已经有完整移动端 H5 静态 Demo 流程，但 `/input -> /tone -> /results` 之间没有真实状态承接，结果页仍展示静态内容；同时后端架构已经在 `docs/backend-architecture.md` 定稿，但还没有可实现的 API、领域契约、校验、安全、LLM 调用和前端接入闭环。

## Goal

按 `docs/backend-architecture.md` 落地第一版 Next.js BFF，并同步补齐前端 Zustand 状态管理、utils/API client 和页面数据流，让用户输入、场景、风格、语气参数能够生成并展示结构化结果。

## Non Goals

- 不做登录、账号、跨端同步、长期记忆。
- 不引入独立后端、Python 服务、数据库、向量检索或复杂 Agent。
- 不把产品做成通用聊天或通用写作平台。
- 不重构现有 UI 视觉体系。
- 不实现完整历史记录、收藏云同步或复杂报表。

## User Stories

- 作为移动端用户，我选择沟通场景、输入原话、选择风格并调整语气后，希望看到三种可直接使用的表达结果。
- 作为用户，我希望生成失败、参数错误或安全拒答时能看到稳定提示，而不是页面空白或崩溃。
- 作为后续开发者，我希望场景、风格、输出模式、错误码和 API 契约集中定义，避免前后端字段散落。

## Acceptance Criteria

- [ ] 首页选择的 scene 能进入输入页并写入全局状态。
- [ ] 输入页 raw text 与 style 能进入语气页并保留。
- [ ] 语气页 sliders 能进入结果页并触发生成。
- [ ] `POST /api/generate` 接收并校验固定产品契约，返回结构化成功、拒答或错误响应。
- [ ] 结果页能渲染 API 返回的 `wechat/email/spoken` 三类结果。
- [ ] `POST /api/feedback` 和 `POST /api/track` 能完成轻量日志记录。
- [ ] 服务端模型调用只读取 server env，不向前端暴露密钥。
- [ ] 缺少模型配置或模型调用失败时有稳定 fallback/error path。
- [ ] `npm run lint` 和 `npm run build` 通过。

## Edge Cases

- 输入为空、过短、过长或只有空白。
- scene/style/sliders/outputModes/operation 非法。
- 用户直接访问 `/tone` 或 `/results`，缺少前置状态。
- LLM 超时、返回非 JSON、返回候选数量不正确。
- `sarcasm` 风格命中攻击、威胁、羞辱等安全规则。
- 移动端 `375 x 750` 下 loading/error/refused/success 状态不重叠。
