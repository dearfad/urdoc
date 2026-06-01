# URDOC - 虚拟病例研究平台

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Nuxt.js](https://img.shields.io/badge/Nuxt.js-4.x-green.svg)](https://nuxt.com/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-blue.svg)](https://vuejs.org/)

**URDOC** 是一个基于大语言模型的虚拟医学病例研究平台，集成病例生成、故事编写、问题设计、问诊模拟和能力评估功能。平台采用 **CSTAR 方法论**，为医学教育和临床实践提供高效、灵活且创新的学习环境。

## ✨ 核心功能

- 🏥 **病例生成 (Case)** - AI 驱动的医学病例创建，提供真实临床场景
- 📝 **编写故事 (Story)** - 交互式医学叙事发展，丰富病例背景
- ❓ **考核理论 (Test)** - 智能医学问题生成与理论考核
- 💬 **互动实践 (Act)** - 真实的医患问诊互动模拟
- 📊 **评估能力 (Rate)** - 全面的学习效果评估和反馈系统
- 🎯 **CSTAR 集成** - 五阶段医学能力培训闭环（Case-Story-Test-Act-Rate）
- 🖼️ **多模态支持** - 集成 AI 图像创作、音频合成、影像渲染等功能
- 📁 **项目管理** - 病例研究项目的创建、组织和协作功能
- ⚙️ **个性化设置** - 用户偏好、工作流程和系统配置选项

## 🛠 技术栈

- **[Nuxt.js 4.x](https://nuxt.com/)** — 全栈 Vue.js 框架
- **[Vue.js 3.x](https://vuejs.org/)** — 渐进式 JavaScript 框架
- **[Nuxt UI v4.x](https://ui.nuxt.com/)** — 基于 Tailwind CSS 的 UI 组件库
- **[Tailwind CSS v4.x](https://tailwindcss.com/)** — 原子化 CSS 框架
- **[AI SDK](https://sdk.vercel.ai/)** — 大语言模型流式对话（多 provider 支持）
- **[Pinia](https://pinia.vuejs.org/)** — 状态管理（14 store，localStorage 版本控制）
- **[Comark](https://comark.rusl.ink/)** — Markdown 内容渲染
- **TypeScript** — 类型安全开发
- **pnpm** — 高效包管理器
- **[Tencent Cloud EdgeOne](https://edgeone.tencent.com/)** — Serverless 边缘计算部署（Node 24）
- **ESLint + Prettier** — 代码质量和格式化

## 📁 项目结构

```
urdoc/
├── .agents/                    # AI agent 技能定义
├── .vscode/                    # VSCode 配置
├── app/                        # 应用源代码（Nuxt 4 约定）
│   ├── app.vue                 # 根组件
│   ├── app.config.ts           # 应用配置（主题、颜色等）
│   ├── error.vue               # 全局错误页面
│   ├── assets/
│   │   └── css/main.css        # 全局样式（Tailwind CSS v4）
│   ├── components/
│   │   ├── Act/                # 互动实践组件
│   │   ├── App/                # 应用级组件（Sidebar、Header、Logo）
│   │   ├── Button/             # 按钮组件（Generate、Clipboard、Capture）
│   │   ├── Case/               # 病例组件
│   │   ├── Image/              # 图像组件
│   │   ├── Rate/               # 评估组件
│   │   ├── Select/Model.vue    # 模型选择器
│   │   ├── Story/              # 故事组件
│   │   └── Test/               # 考核组件
│   ├── composables/
│   │   └── useChatGenerations.ts # AI 生成对话的通用传输接口
│   ├── layouts/
│   │   ├── default.vue         # 仪表盘布局（侧边栏 + 内容区）
│   │   └── landing.vue         # 落地页布局
│   ├── pages/
│   │   ├── index.vue           # 首页（落地页）
│   │   ├── dashboard/
│   │   │   └── index.vue       # 仪表盘概览
│   │   ├── cstar/              # CSTAR 五阶段流程
│   │   │   ├── case.vue        # 病例生成
│   │   │   ├── story.vue       # 故事编写
│   │   │   ├── test.vue        # 考核理论
│   │   │   ├── act.vue         # 互动实践
│   │   │   └── rate.vue        # 评估能力
│   │   ├── multimodal/         # 多模态工具
│   │   │   ├── image.vue       # 图像创作
│   │   │   ├── audio.vue       # 音频合成
│   │   │   └── video.vue       # 影像渲染
│   │   ├── project/            # 项目管理
│   │   ├── settings/           # 系统设置
│   │   └── docs/               # 应用内文档
│   │       └── [...slug].vue   # 动态文档路由
│   ├── stores/                 # Pinia 状态管理（14 个 store）
│   │   ├── record.ts           # 顶层协调 store
│   │   ├── case/story/test/act/rate.ts  # CSTAR 子 store
│   │   ├── image/audio/video.ts         # 多模态子 store
│   │   └── model.ts/book.ts    # 模型选择、教科书数据
│   ├── types/                  # TypeScript 类型定义
│   └── utils/                  # 工具函数
├── public/
│   ├── docs/                   # 文档 Markdown 源文件
│   └── images/                 # 静态图片资源
├── server/
│   ├── api/
│   │   ├── chat.ts             # 主要 AI 对话接口（流式）
│   │   ├── model/object.js     # JSON 对象生成
│   │   └── github/commit.js    # GitHub 提交日期查询
│   └── prompts/                # AI 提示词模板
│       ├── index.ts            # 动态导入映射
│       ├── case/story/test/act/rate/  # CSTAR 提示词
│       └── comment/conversation/discussion/verify/  # 辅助提示词
├── edgeone.json                # EdgeOne 部署配置
├── nuxt.config.ts              # Nuxt 配置
├── eslint.config.mjs           # ESLint 配置
├── .prettierrc.json            # Prettier 配置
├── AGENTS.md                   # AI agent 行为规范

## 🚀 快速开始

### 前置要求

- Node.js 18.x 或更高版本（推荐 22.x+）
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

# 预览生产构建
pnpm preview

# 静态站点生成
pnpm generate
```

### 代码风格

- 无分号、单引号、120 字符行宽
- ESLint + Prettier 集成（保存时自动格式化）

## 🌐 部署

项目部署在 **腾讯云 EdgeOne** 平台，使用 Serverless 函数提供后端 API 服务。

```bash
# 构建并部署
pnpm build
```

部署配置详见 `edgeone.json`。

## 📚 文档

- 完整项目文档：https://docs.urdoc.dearfad.com
- 应用内文档：启动开发服务后访问 `/docs` 路由

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

## 📄 许可证

[MIT License](LICENSE) - Copyright 2025-2026 dearfad

## 🌟 致谢

- [Nuxt.js](https://nuxt.com/) - 直观的 Vue 全栈框架
- [Nuxt UI](https://ui.nuxt.com/) - 现代化的 UI 组件库
- [Tailwind CSS](https://tailwindcss.com/) - 实用的原子化 CSS 框架
- [Tencent Cloud EdgeOne](https://edgeone.tencent.com/) - 边缘计算平台

---

<div align="center">
为医学教育和临床实践 ❤️ 制作
</div>
