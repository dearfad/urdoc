# 开发者指南

本文档面向参与 URDOC 平台开发的开发者，提供项目架构、技术规范与部署说明。

## 项目架构

### 目录结构

```
urdoc/
├── app/                  # Nuxt 4 应用代码
│   ├── components/       # 组件（App/、Case/、Story/ 等）
│   ├── layouts/          # 布局（default、landing）
│   ├── pages/            # 页面路由
│   ├── stores/           # Pinia 状态管理
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   └── composables/      # 组合式函数
├── server/               # 服务端
│   ├── api/              # API 路由（chat.ts 为主要 AI 接口）
│   └── prompts/          # AI 提示词模板
├── public/               # 静态资源
└── edge-functions/       # EdgeOne 无服务器函数
```

### 核心约定

参考项目根目录的 `AGENTS.md` 了解完整的开发规范，包括：

- **代码风格**：Prettier（无分号、单引号、120 字符行宽）
- **状态管理**：Pinia store 需调用 `syncStoreVersion(VERSION, 'pinia:<name>')`
- **导入别名**：`#server/prompts` 用于服务端提示词
- **Markdown 渲染**：使用 `<Comark :markdown="content" />` 组件
- **环境变量**：运行时配置通过 `runtimeConfig` 注入

## 本地开发

### 环境要求

- Node.js 24.5.0+
- pnpm

### 启动开发服务器

```bash
pnpm dev
```

启动后可通过局域网访问（`--host` 模式）。

### 构建

```bash
pnpm build
```

内置 `NODE_OPTIONS=--max-old-space-size=4096` 防止内存不足。

### 静态生成

```bash
pnpm generate
```

用于 EdgeOne 部署。

## 部署

平台部署在 EdgeOne 无服务器环境。主要构建产物为 `.output/` 目录。部署配置见 `edgeone.json`。

## AI 集成

### 支持的 Providers

- **InternAi** — 支持 reasoning/thinking 配置
- **BigModel** — 支持 reasoning/thinking 配置
- **OpenRouter** — 支持 reasoning/thinking 配置

### API 密钥

- `shushengApiKey` — runtimeConfig 配置
- `zhipuApiKey` — runtimeConfig 配置
- `openrouterApiKey` — runtimeConfig 配置

## 文档

文档内容位于 `public/docs/` 目录下，采用 Markdown 格式，通过应用内文档中心展示。如需新增文档：

1. 在 `public/docs/` 创建 `.md` 文件
2. 在 `app/utils/docs.ts` 中注册导航项
3. 在 `app/components/App/Sidebar.vue` 中添加导航链接


// EdgeOne Pages Functions Development Proxy
// 来自 nuxt.config.ts，本地开发时启用 nitro.devProxy 将 /function 代理到 EdgeOne
// nitro: {
//   devProxy: {
//     '/function': 'http://localhost:8088/function',
//   },
// },
// 使用方式：取消注释并重新运行 pnpm dev
