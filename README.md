# URDOC — 虚拟病例研究平台

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Nuxt.js](https://img.shields.io/badge/Nuxt.js-4.x-green.svg)](https://nuxt.com/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-blue.svg)](https://vuejs.org/)

**URDOC** 是一个基于大语言模型的虚拟医学病例研究平台，集成病例生成、故事编写、问题设计、问诊模拟和能力评估功能。平台采用 **CSTAR 五阶段方法论**（Case-Story-Test-Act-Rate），为医学教育和临床实践提供高效、灵活且创新的学习环境。

## ✨ 核心功能

- 🏥 **病例生成 (Case)** — AI 驱动的医学病例创建，覆盖真实临床场景
- 📝 **编写故事 (Story)** — 交互式医学叙事发展，丰富病例背景
- ❓ **考核理论 (Test)** — 智能医学问题生成与理论知识考核
- 💬 **互动实践 (Act)** — 真实的医患问诊互动模拟
- 📊 **评估能力 (Rate)** — 全面的学习效果评估与反馈
- 🎯 **CSTAR 闭环** — Case → Story → Test → Act → Rate 五阶段医学能力培训
- 🖼️ **多模态创作** — AI 图像生成（Agnes）、视频渲染（Agnes）、音频合成
- 📖 **叙事医学项目** — 基于叙事医学理念的病例研究项目组织
- ⚙️ **个性化设置** — 多模型选择（InternAi / LongCat / Agnes / BigModel / OpenRouter）、推理/思考模式切换

## 🛠 技术栈

- **[Nuxt 4.x](https://nuxt.com/)** — 全栈 Vue.js 框架（^4.4.7）
- **[Vue 3.x](https://vuejs.org/)** — 渐进式 JavaScript 框架
- **[Nuxt UI v4](https://ui.nuxt.com/)** — 基于 Tailwind CSS 的语义化组件库（^4.8.1，125+ 组件）
- **[Tailwind CSS v4](https://tailwindcss.com/)** — 原子化 CSS 框架（`@import 'tailwindcss'; @import '@nuxt/ui'`）
- **[AI SDK](https://sdk.vercel.ai/)** — `ai` + `@ai-sdk/openai-compatible` + `@ai-sdk/vue`，流式对话（`streamText` / `generateText`）
- **[Pinia](https://pinia.vuejs.org/)** — 状态管理（15 store，`pinia-plugin-unstorage` 持久化 + localStorage 版本控制）
- **[Comark](https://comark.rusl.ink/)** — Markdown 内容渲染组件
- **[zod](https://zod.dev/)** — 运行时类型验证（^4.4.3）
- **[partial-json](https://github.com/prometheansacrifice/partial-json)** — 流式 JSON 增量解析
- **[@zumer/snapdom](https://github.com/zumerlab/snapdom)** — DOM 差异更新
- **TypeScript** — 全栈类型安全
- **pnpm** — 高效包管理器
- **[腾讯云 EdgeOne](https://edgeone.tencent.com/)** — Serverless 边缘计算部署（Node 24.5.0）
- **ESLint + Prettier** — 代码质量与格式化（无分号、单引号、120 字符行宽）

## 📁 项目结构

```
urdoc/
├── .agents/                        # AI agent 技能定义（ai-sdk / nuxt / nuxt-ui / frontend-design）
├── .vscode/                        # VSCode 配置（保存时自动格式化）
├── AGENTS.md                       # AI agent 行为规范

├── app/                            # 应用源代码（Nuxt 4 约定目录）
│   ├── app.config.ts               # 应用配置（Nuxt UI 主题色：primary blue / secondary green）
│   ├── app.vue                     # 根组件（NuxtLoadingIndicator + NuxtLayout）
│   ├── error.vue                   # 全局错误页面（UApp + UError）
│   ├── assets/
│   │   ├── books/                  # 教科书数据
│   │   ├── css/main.css            # 全局样式（Tailwind CSS v4 + Nuxt UI）
│   │   └── prompts/                # AI 提示词模板（14 个子目录）
│   │       ├── act/                # 问诊模拟提示词
│   │       ├── case/               # 病例生成提示词
│   │       ├── comment/            # 评论提示词
│   │       ├── conversation/       # 对话提示词
│   │       ├── discussion/         # 讨论提示词
│   │       ├── face/               # 面部描述提示词
│   │       ├── illustration/       # 插画提示词
│   │       ├── pose/               # 体态描述提示词
│   │       ├── rate/               # 评估提示词
│   │       ├── review/             # 复习提示词
│   │       ├── story/              # 故事编写提示词
│   │       ├── test/               # 考题生成提示词
│   │       ├── verify/             # 验证提示词
│   │       └── video/              # 视频提示词
│   ├── components/
│   │   ├── Act/                    # 互动实践组件
│   │   ├── App/                    # 应用框架组件（Sidebar / Header / Logo）
│   │   ├── Button/                 # 功能按钮（Generate / Clipboard / Capture / Edit）
│   │   ├── Card/                   # 通用卡片组件
│   │   ├── Case/                   # 病例展示组件
│   │   ├── Editor/                 # 编辑器组件（Object / Text）
│   │   ├── Image/                  # 图像展示组件
│   │   ├── Rate/                   # 评估展示组件
│   │   ├── Select/                 # 模型选择器（Model.vue）
│   │   ├── Story/                  # 故事展示组件
│   │   └── Test/                   # 考核展示组件
│   ├── composables/
│   │   ├── useBreadcrumb.ts        # 面包屑导航（CSTAR / 多模态分组）
│   │   ├── useChatApi.ts           # AI 流式对话（@ai-sdk/vue Chat + DefaultChatTransport）
│   │   ├── useImageApi.ts          # 图像生成 API 封装
│   │   └── useVideoApi.ts          # 视频生成 API 封装（轮询进度）
│   ├── layouts/
│   │   ├── default.vue             # 仪表盘布局（UApp + UDashboardGroup + AppSidebar）
│   │   └── landing.vue             # 落地页布局（UApp + UMain）
│   ├── pages/
│   │   ├── index.vue               # 首页落地页（暗色主题，CSS 动效）
│   │   ├── dashboard/
│   │   │   └── index.vue           # 仪表盘概览
│   │   ├── cstar/                  # CSTAR 五阶段流程
│   │   │   ├── case.vue            # 生成病例
│   │   │   ├── story.vue           # 编写故事
│   │   │   ├── test.vue            # 考核理论
│   │   │   ├── act.vue             # 互动实践
│   │   │   └── rate.vue            # 评估能力
│   │   ├── multimodal/             # 多模态工具
│   │   │   ├── image.vue           # 图像创作
│   │   │   ├── audio.vue           # 音频合成
│   │   │   └── video.vue           # 影像渲染
│   │   ├── project/
│   │   │   └── narrative-medicine.vue  # 叙事医学项目
│   │   ├── settings/
│   │   │   └── index.vue           # 系统设置
│   │   └── docs/
│   │       ├── index.vue           # 文档首页
│   │       └── [...slug].vue       # 动态文档路由
│   ├── stores/                     # Pinia 状态管理（15 store）
│   │   ├── record.ts               # 顶层协调 store
│   │   ├── case.ts / story.ts / test.ts / act.ts / rate.ts  # CSTAR 子 store
│   │   ├── image.ts / audio.ts / video.ts                   # 多模态子 store
│   │   ├── model.ts / provider.ts  # 模型选择与 provider 配置
│   │   ├── book.ts / prompt.ts / state.ts / user.ts         # 辅助 store
│   ├── types/                      # TypeScript 类型定义
│   │   ├── act.ts / book.ts / breadcrumb.ts
│   │   ├── case.ts / model.ts / rate.ts
│   │   └── story.ts / test.ts
│   └── utils/                      # 工具函数
│       ├── docs.ts                 # 文档导航数据
│       ├── json.ts                 # partial-json 流式 JSON 解析
│       ├── prompts.ts              # 提示词模板动态加载（import.meta.glob）
│       └── store.ts                # localStorage 版本控制（syncStoreVersion）

├── public/
│   ├── docs/                       # 文档 Markdown 源文件
│   └── images/                     # 静态图片资源

├── server/
│   └── api/
│       ├── aisdk/text/index.ts     # AI 对话接口（streamText / generateText，多 provider）
│       ├── agnes/image/index.ts    # Agnes 图像生成代理
│       ├── agnes/video/index.ts    # Agnes 视频生成代理（创建 + 轮询）
│       └── github/commit.js        # GitHub 提交日期查询

├── edgeone.json                    # EdgeOne Serverless 部署配置
├── nuxt.config.ts                  # Nuxt 配置（runtimeConfig、modules、vite optimizeDeps）
├── eslint.config.mjs               # ESLint 配置（继承 Nuxt 生成规则）
├── .prettierrc.json                # Prettier 配置
├── pnpm-workspace.yaml             # pnpm workspace 配置
├── tsconfig.json                   # TypeScript 配置
├── skills-lock.json                # AI agent 技能版本锁定
├── AGENTS.md                       # 开发规范（语言、命令、UI 原则）
├── package.json
└── pnpm-lock.yaml
```

## 🚀 快速开始

### 前置要求

- Node.js 20.x 或更高版本（推荐 22.x+；EdgeOne 部署使用 24.5.0）
- pnpm

### 安装

```bash
git clone https://github.com/dearfad/urdoc.git
cd urdoc
pnpm install
```

### 开发

```bash
# 启动开发服务器（支持局域网访问）
pnpm dev

# 生产构建
pnpm build

# EdgeOne 部署专用构建（NODE_OPTIONS=--max-old-space-size=4096）
pnpm edgeone

# 静态站点生成
pnpm generate

# 预览生产构建
pnpm preview
```

安装后自动执行 `pnpm postinstall`（运行 `nuxt prepare`）。

### 代码风格

- 无分号、单引号、120 字符行宽
- ESLint + Prettier 集成（VSCode 保存时自动格式化）
- Tailwind CSS 类名自动排序（`prettier-plugin-tailwindcss`）

## ⚙️ 运行时配置

`nuxt.config.ts` 中声明的 `runtimeConfig` 键（需通过环境变量注入）：

| 配置键 | 用途 | 对应平台 |
|--------|------|----------|
| `shushengApiKey` | InternAi/书生 AI | InternAi |
| `zhipuApiKey` | 智谱 AI | BigModel |
| `openrouterApiKey` | OpenRouter | OpenRouter |
| `longcatApiKey` | LongCat AI | LongCat |
| `agnesApiKey` | Agnes AI 平台 | Agnes（图像/视频/对话） |
| `githubApiToken` | GitHub API | GitHub 提交查询 |

`.env` 中另有第三方平台 API Key（Clerk、Supabase、XFYUN、HUNYUAN 等），仅为环境变量，非运行时配置。

## 🌐 部署

项目部署在 **腾讯云 EdgeOne** 平台，使用 Serverless 函数提供后端 API 服务。

```bash
# EdgeOne 构建
pnpm edgeone
```

构建产物为 `.output/` 目录，Node.js 版本 **24.5.0**。部署配置详见 `edgeone.json`。

## 📚 文档

应用内文档：启动开发服务后访问 `/docs` 路由

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

## 📄 许可证

[MIT License](LICENSE) — Copyright 2025–2026 dearfad

## 🌟 致谢

- [Nuxt](https://nuxt.com/) — 直观的 Vue 全栈框架
- [Nuxt UI](https://ui.nuxt.com/) — 现代化语义化 UI 组件库
- [AI SDK](https://sdk.vercel.ai/) — AI 流式对话框架
- [Tailwind CSS](https://tailwindcss.com/) — 原子化 CSS 框架
- [腾讯云 EdgeOne](https://edgeone.tencent.com/) — 边缘计算平台
- [Comark](https://comark.rusl.ink/) — Markdown 渲染组件

---

<div align="center">
为医学教育和临床实践 ❤️ 制作
</div>
