# AGENTS.md

单个 Nuxt 4 应用（非 monorepo）。`pnpm-workspace.yaml` 仅允许原生依赖的构建。

## 命令

- `pnpm dev` — 启动开发服务器，带 `--host` 参数（局域网访问）
- `pnpm build` — 需要设置 `NODE_OPTIONS=--max-old-space-size=4096`
- `pnpm postinstall` — 运行 `nuxt prepare`

未配置测试框架。

## 项目结构

- `app/` — Nuxt 4 应用代码（组件、页面、状态管理、类型、工具函数）
- `server/api/` — 服务端路由（chat.ts、github/commit.js、model/object.js）
- `server/prompts/` — AI 提示词模板（.md 和 .ts 文件）
- `app-bak/` — 被 Nuxt 配置忽略（`ignore: ['/app-bak/**/*']`），非活跃代码
- `edge-functions/` — EdgeOne 无服务器函数（大部分为 `.bak` 备份文件）

## 规范

- 自动导入：`~/types` 会被扫描以导入类型（`imports.dirs`）
- Prettier：无分号、单引号、120 字符行宽、tailwindcss 插件
- ESLint：继承 Nuxt 生成的配置（`.nuxt/eslint.config.mjs`）
- Vite `optimizeDeps` 包含：`ai`、`@ai-sdk/vue`、`partial-json`、`@zumer/snapdom`

## 环境变量

`.env` 中的运行时配置键：`shushengApiKey`、`zhipuApiKey`、`openrouterApiKey`

## 部署

EdgeOne 无服务器部署。构建产物使用 Nitro；通过 `pnpm generate` 进行静态生成。
