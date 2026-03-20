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

## 🛠 技术栈

- **[Nuxt.js 4.x](https://nuxt.com/)** - 全栈 Vue.js 框架
- **[Vue.js 3.x](https://vuejs.org/)** - 渐进式 JavaScript 框架
- **[Nuxt UI v4.x](https://ui.nuxt.com/)** - 基于 Tailwind CSS 的 UI 组件库
- **[Tailwind CSS v4.x](https://tailwindcss.com/)** - 原子化 CSS 框架
- **TypeScript** - 类型安全开发
- **pnpm** - 高效包管理器
- **[Tencent Cloud EdgeOne](https://edgeone.tencent.com/)** - Serverless 边缘计算部署

## 📁 项目结构

```
urdoc/
├── app/                        # 应用源代码（Nuxt 4 约定）
│   ├── app.vue                 # 根组件
│   ├── app.config.ts           # 应用配置（主题、颜色等）
│   ├── assets/css/main.css     # 全局样式
│   ├── components/
│   │   └── App/                # 应用级组件
│   │       ├── Navbar.vue      # 顶部导航栏
│   │       └── Sidebar.vue     # 侧边栏导航
│   ├── layouts/
│   │   ├── default.vue         # 仪表盘布局（侧边栏 + 内容区）
│   │   └── landing.vue         # 落地页布局
│   └── pages/
│       ├── index.vue           # 首页（落地页）
│       ├── dashboard/
│       │   └── index.vue       # 仪表盘概览
│       └── case/
│           └── index.vue       # 病例生成页面
├── public/                     # 静态资源
├── nuxt.config.ts              # Nuxt 配置
├── eslint.config.mjs           # ESLint 配置
├── .prettierrc.json            # Prettier 配置
└── edgeone.json                # EdgeOne 部署配置
```

## 🚀 快速开始

### 前置要求

- Node.js 18.x 或更高版本
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

完整项目文档：https://docs.urdoc.dearfad.com

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
