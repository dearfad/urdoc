# AGENTS.md

单个 Nuxt 4 应用（非 monorepo）。`pnpm-workspace.yaml` 仅允许原生依赖的构建。

> 开发原则：UI 优先使用 Nuxt UI 内置组件 + frontend-design skill 美学；后端大模型通信优先使用 ai-sdk skill。

## 语言要求

- 所有思考、回复、代码注释必须使用简体中文
- 技术术语可以保留英文原文，但需附带中文解释

## 命令

- `pnpm dev` — 启动开发服务器，带 `--host` 参数（局域网访问）
- `pnpm build` — 生产构建
- `pnpm edgeone` — EdgeOne 构建（已内置 `NODE_OPTIONS=--max-old-space-size=4096`）
- `pnpm generate` — 静态生成，用于 EdgeOne 部署
- `pnpm postinstall` — 运行 `nuxt prepare`（安装后自动触发）

未配置测试框架。

## 项目结构

- `app/` — Nuxt 4 应用代码
  - `app.vue`、`error.vue` — 根组件与全局错误页
  - `layouts/` — `default.vue`（仪表盘布局，含 `UApp` + `UDashboardGroup` + 侧边栏）、`landing.vue`（落地页布局）
  - `pages/` — `index.vue`（首页落地页）、`dashboard/`、`cstar/`（case/story/test/act/rate）、`multimodal/`（image/audio/video）、`docs/`、`project/`、`settings/`
  - `components/` — Act、App（Sidebar/Header/Logo）、Button（Generate/Clipboard/Capture/Edit）、Card、Case、Editor（Object/Text）、Image、Rate、Select、Story、Test
  - `stores/` — 15 个 Pinia store（`record.ts` 为顶层协调，其余为 CSTAR、多模态、模型等子 store）
  - `types/` — TypeScript 类型定义（act、book、breadcrumb、case、model、rate、story、test）
  - `composables/` — `useBreadcrumb`、`useChatApi`、`useImageApi`、`useVideoApi`
  - `utils/` — `store.ts`（syncStoreVersion）、`prompts.ts`（prompt 加载）、`json.ts`（partial-json 解析）、`docs.ts`（文档导航）
  - `assets/` — `css/main.css`（Tailwind CSS v4）、`prompts/`（AI 提示词模板，14 个子目录）、`books/`（教科书数据）
- `server/api/` — 服务端 API 路由
  - `aisdk/text/index.ts` — 主要 AI 对话接口（流式 + 非流式），使用 `ai` SDK
  - `agnes/image/index.ts`、`agnes/video/index.ts` — 多模态生成 API
  - `github/commit.js` — GitHub 提交日期查询
- `.agents/` — AI agent 技能定义（ai-sdk、frontend-design、nuxt、nuxt-ui），通过 `skills-lock.json` 锁定

## 框架与工具链

- **Nuxt UI v4**（`^4.8.1`）：使用 `UApp`、`UDashboardGroup` 等组件；需从 `@nuxt/ui/locale` 导入 `zh_cn` 作为区域设置（见 `app/layouts/default.vue`）
- **字体**：`ui: fonts: false`，禁用 Nuxt UI 内置字体，通过 CSS 自定义
- **Tailwind CSS v4**：使用 `@import 'tailwindcss'` + `@import '@nuxt/ui'` 语法，文件扩展名 `.css` 关联为 tailwindcss 语言模式
- **Pinia**：所有 store 需调用 `syncStoreVersion(VERSION, 'pinia:<name>')` 实现 localStorage 版本控制（见 `app/utils/store.ts`）
- **状态持久化**：`pinia-plugin-unstorage` 模块已注册
- **内容管理**：`@comark/nuxt` 模块处理 Markdown 内容，通过 `Comark` 组件渲染（用于 CSTAR 输出与文档页）
- **AI SDK**：使用 `ai` + `@ai-sdk/openai-compatible` 进行流式对话；provider 选项支持 InternAi、BigModel、OpenRouter、Agnes 的 reasoning/thinking 配置（见 `app/stores/provider.ts`）
- **提示词模板**：位于 `app/assets/prompts/`，通过 `import.meta.glob('~/assets/prompts/**/*.md')` 动态加载（见 `app/utils/prompts.ts`）
- **JSON 解析**：使用 `partial-json` 处理流式 JSON（见 `app/utils/json.ts`）
- **类型校验**：`zod` 用于运行时类型验证
- **自动导入类型**：`~/types` 被配置为类型扫描目录（`imports.dirs`）
- **Vite optimizeDeps**：包含 `ai`、`@ai-sdk/vue`、`partial-json`、`@zumer/snapdom`

## 环境变量

- `nuxt.config.ts` `runtimeConfig` 声明的运行时配置键：
  `shushengApiKey`、`zhipuApiKey`、`openrouterApiKey`、`longcatApiKey`、`agnesApiKey`、`githubApiToken`
- `.env` 中另有大量第三方平台 API Key（Clerk、Supabase、XFYUN、HUNYUAN 等），仅为环境变量，非运行时配置

## UI 设计原则

- 优先使用 Nuxt UI v4 内置组件（UButton、UInput 等），避免自行封装基础 UI
- 视觉美学遵循 frontend-design skill：选择鲜明风格方向（极简、复古未来、精致等），注重排版、色彩、动效和空间构图
- 所有 UI 组件必须同时适配桌面端和手机端，使用 Tailwind 响应式前缀（`sm:`、`md:` 等）
- 风格专业、美观、干净，遵循 Nuxt UI v4 语义化颜色体系（`text-muted`、`bg-elevated`、`border-default` 等）
- 输入控件使用 `size="lg"` 或 `size="xl"` 确保移动端触摸友好
- 表单布局在手机端纵向堆叠（`flex-col`）、桌面端横向排列（`sm:flex-row`）

## 规范

- Prettier：无分号、单引号、120 字符行宽、`prettier-plugin-tailwindcss` 插件
- ESLint：继承 `.nuxt/eslint.config.mjs`（Nuxt 生成），无自定义规则
- VSCode 保存时自动格式化（Prettier）+ ESLint fix

## AI 开发规范

- 所有大模型通信优先使用 `ai` SDK（`ai` + `@ai-sdk/openai-compatible`），遵循 ai-sdk skill
- 不依赖内部知识，始终以 `node_modules/ai/docs/` 或 ai-sdk.dev 文档为准
- 流式对话使用 `streamText`，provider 配置参考 `server/api/aisdk/text/index.ts`

## 部署

EdgeOne 无服务器部署。构建产物为 `.output/` 目录（见 `edgeone.json`），Node.js 版本 `24.5.0`。
使用 `pnpm edgeone` 或 `pnpm build` 构建。
