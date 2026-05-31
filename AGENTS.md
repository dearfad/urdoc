# AGENTS.md

单个 Nuxt 4 应用（非 monorepo）。`pnpm-workspace.yaml` 仅允许原生依赖的构建。

## 语言要求

- 所有思考、回复、代码注释必须使用简体中文
- 技术术语可以保留英文原文，但需附带中文解释

## 命令

- `pnpm dev` — 启动开发服务器，带 `--host` 参数（局域网访问）
- `pnpm build` — 已内置 `NODE_OPTIONS=--max-old-space-size=4096`
- `pnpm postinstall` — 运行 `nuxt prepare`（安装后自动触发）
- `pnpm generate` — 静态生成，用于 EdgeOne 部署

未配置测试框架。

## 项目结构

- `app/` — Nuxt 4 应用代码（`app.vue`、`error.vue`、组件、页面、layouts、stores、types、utils）
- `server/api/` — 服务端 API 路由（`chat.ts` 是主要 AI 对话接口）
- `server/prompts/` — AI 提示词模板，通过 `#server/prompts` 别名动态导入（`index.ts` 定义 `type` + `task` → 动态 `import()` 映射，见 `server/api/chat.ts` 调用模式）
- `app-bak/` — 旧版代码备份（Nuxt 已通过 `ignore: ['/app-bak/**/*']` 排除）
- `edge-functions/` — EdgeOne 无服务器函数（大部分为 `.bak` 备份文件）
- `app/pages/index-v*.vue` — 旧版首页变体（非活跃，勿编辑）
- 项目中散布大量 `.bak` 文件（如 `stores/*.js.bak`、`types/*.d.ts.bak`、`server/api/**/*.bak`），均为旧版遗留，非活跃代码

## 框架与工具链

- **Nuxt UI v4**：使用 `UApp`、`UDashboardGroup` 等组件；需从 `@nuxt/ui/locale` 导入 `zh_cn` 作为区域设置（见 `app/layouts/default.vue`）
- **字体**：`ui: fonts: false`，禁用 Nuxt UI 内置字体，通过 CSS 自定义
- **Tailwind CSS v4**：使用 `@import 'tailwindcss'` 语法（非 v3 `@tailwind` 指令），文件扩展名 `.css` 关联为 tailwindcss 语言模式
- **Pinia**：所有 store 需调用 `syncStoreVersion(VERSION, 'pinia:<name>')` 实现 localStorage 版本控制（见 `app/utils/store.ts`）
- **内容管理**：`@comark/nuxt` 模块处理 Markdown 内容（使用 `@comark/vue` 渲染），通过 Comark 和 ComarkRenderer 组件使用
- **自动导入类型**：`~/types` 被配置为类型扫描目录（`imports.dirs`）
- **导入别名**：`#server/prompts` 用于从 `server/prompts/` 动态导入提示词模板
- **AI SDK**：使用 `ai` + `@ai-sdk/openai-compatible` 进行流式对话，provider 选项支持 InternAi、BigModel、OpenRouter 的 reasoning/thinking 配置
- **Vite optimizeDeps**：包含 `ai`、`@ai-sdk/vue`、`partial-json`、`@zumer/snapdom`

## 环境变量

- `.env` 中的运行时配置键（`nuxt.config.ts` `runtimeConfig`）：`shushengApiKey`、`zhipuApiKey`、`openrouterApiKey`
- `process.env.GITHUB_API_TOKEN` — GitHub API 访问令牌，用于 `server/api/github/commit.js`，**不属于** runtimeConfig
- `process.env.DEARFAD_SHUSHENG_API_KEY` — 仅用于 `server/api/model/object.js`，**不属于** runtimeConfig

## 规范

- Prettier：无分号、单引号、120 字符行宽、`prettier-plugin-tailwindcss` 插件
- ESLint：继承 `.nuxt/eslint.config.mjs`（Nuxt 生成），无自定义规则
- VSCode 保存时自动格式化（Prettier）+ ESLint fix

## 部署

EdgeOne 无服务器部署。构建产物为 `.output/` 目录（见 `edgeone.json`），Node.js 版本 `24.5.0`。
