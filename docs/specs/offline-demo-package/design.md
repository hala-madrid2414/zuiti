# Offline Demo Package Design

## Architecture

本功能采用“主站保持不变 + 独立静态 Demo 目录”的双交付结构。

- 现有 `app/**`、`app/api/**`、`lib/**` 继续服务完整版演示
- 新增 `demo/src/**` 作为互动空间专用离线 Demo 源码
- 新增 `scripts/build-demo.mjs` 将 `demo/src/**` 复制到 `demo/dist/`

离线 Demo 不复用 Next.js 运行时，不依赖服务端能力，只使用原生 HTML、CSS、JavaScript 和本地数据文件，以最小包体满足 8MB 限制。

## Data Flow

离线 Demo 的数据流如下：

1. 首页选择场景后跳转到输入页，并把场景写入 `localStorage`
2. 输入页记录原话和风格选择，写入 `localStorage`
3. 语气页记录三个 slider 值，写入 `localStorage`
4. 结果页从本地 `mock-data.js` 读取 20 条样本，根据 `scene + style + slider` 做本地匹配
5. 结果页渲染微信、邮件、口语三个输出卡片，不调用任何接口

所有页面通过相对链接跳转，保证静态托管和目录直开都可用。

## Data Model

新增离线 Demo 样本数据结构：

```ts
type DemoMockItem = {
  id: string;
  scene: "student" | "work" | "social" | "formal";
  style: "delay" | "refuse" | "boundary" | "followup" | "decode" | "sarcasm";
  rawInput: string;
  tone: {
    politeness: number;
    formality: number;
    distance: number;
  };
  outputs: {
    wechat: string;
    email: string;
    spoken: string;
  };
  tags: [string, string, string];
};
```

离线状态结构：

```ts
type DemoDraft = {
  scene: string | null;
  text: string;
  style: string;
  sliders: {
    politeness: number;
    formality: number;
    distance: number;
  };
};
```

## API Design

None.

离线 Demo 明确禁止请求 `/api/*` 或任何远端资源。复制、反馈、换风格等交互均在浏览器本地完成。

## UI / UX Design

UI 保持与当前移动端 H5 Demo 同样的四页叙事结构：

- 首页：场景入口和 Demo 说明
- 输入页：原话输入和六种风格选择
- 语气页：三个 slider 和预览文案
- 结果页：三种输出形式、命中样本说明、本地 Demo 提示

视觉上沿用现有项目的浅紫渐变、玻璃卡片、胶囊按钮和 375 x 750 移动容器布局，但实现方式改为独立 `demo/src/styles.css`，避免引入主站运行时和依赖包。

## Security Considerations

- 离线 Demo 不包含 API Key、模型配置或任何服务端凭据
- 不进行网络请求，减少泄露风险和跨域问题
- 用户输入仅保存在浏览器本地 `localStorage`，不上传到服务器

## Performance Considerations

- 使用静态 HTML/CSS/JS，避免 Next.js 运行时和多余依赖进入离线 Demo
- 所有资源本地化，降低包体和运行开销
- 构建脚本只做文件复制和目录清理，执行速度快且稳定

## Risks

- 离线 Demo 与主站 UI 可能出现细节漂移，需要控制样式 token 一致性
- 独立静态实现存在双份页面逻辑，后续维护时需要同步核心文案
- mock 数据过少会让结果显得重复，因此需要保证 20 条样本覆盖度和差异性

## Alternatives Considered

- 直接把当前 Next.js 项目改为 `output: "export"`：会与现有 BFF/API 路线冲突，风险高
- 在主站里加一个“离线模式”开关：运行时仍会受到 Next 构建和依赖牵连，不利于独立上传
- 使用额外前端框架重新做 Demo：包体和维护成本都更高，不符合 MVP 目标
