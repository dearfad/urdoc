# URDOC - 虚拟病例研究平台

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Nuxt.js](https://img.shields.io/badge/Nuxt.js-4.x-green.svg)](https://nuxt.com/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-blue.svg)](https://vuejs.org/)
[![Vuetify](https://img.shields.io/badge/Vuetify-3.x-purple.svg)](https://vuetifyjs.com/)

</div>

**URDOC**（虚拟病例研究平台）是一个先进的虚拟医学病例研究平台，集成了**病例生成**、**故事编写**、**问题设计**、**问诊模拟**和**能力评估**等功能。利用尖端的大语言模型技术，URDOC为医学教育和临床实践提供了高效、灵活且创新的学习和研究环境。

## ✨ 核心功能

- 🏥 **病例生成** - AI驱动的医学病例创建，提供真实场景
- 📝 **故事编写** - 交互式医学叙事发展
- ❓ **问题设计** - 智能医学问题生成与评估
- 💬 **问诊模拟** - 真实的医患互动模拟
- 📊 **能力评估** - 全面的评估和反馈系统
- 🌐 **多语言支持** - 内置中英文国际化
- 🔐 **身份验证** - 使用Clerk的安全用户管理
- ☁️ **边缘计算** - 基于EdgeOne Functions的无服务器部署

## 🛠 技术栈

### 前端框架
- **[Nuxt.js 4.x](https://nuxt.com/)** - 全栈Vue.js框架
- **[Vue.js 3.x](https://vuejs.org/)** - 渐进式JavaScript框架
- **[Vuetify 3.x](https://vuetifyjs.com/)** - Material Design组件库
- **TypeScript** - 类型安全开发

### 后端与数据库
- **[Supabase](https://supabase.com/)** - 开源Firebase替代方案
- **Edge Functions** - 无服务器API端点
- **Pinia** - 带持久化的状态管理

### 认证与安全
- **[Clerk](https://clerk.com/)** - 现代认证和用户管理

### 开发工具
- **Vite** - 下一代前端工具
- **VitePress** - 文档站点生成器
- **ESLint** - 代码质量和一致性
- **Prettier** - 代码格式化

## 📁 项目结构

```
urdoc/
├── app/                    # 主要应用程序源代码
│   ├── components/        # 可复用的Vue组件
│   ├── composables/       # Vue可组合函数
│   ├── layouts/          # 应用程序布局
│   ├── pages/            # 路由页面
│   ├── stores/           # Pinia存储
│   └── types/            # TypeScript类型定义
├── server/                # 服务器端API端点
├── prompts/               # 医学场景的AI提示模板
├── docs/                  # VitePress文档
├── public/                # 静态资源
├── i18n/                  # 国际化文件
└── edge-functions/        # EdgeOne无服务器函数
```

## 🚀 快速开始

### 前置要求

- Node.js 18.x 或更高版本
- npm 或 yarn 包管理器
- Git

### 安装

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/urdoc.git
   cd urdoc
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **环境配置**
   在根目录创建 `.env` 文件，添加以下变量：
   ```env
   # Supabase配置
   PUBLIC_SUPABASE_URL=your_supabase_url
   PUBLIC_SUPABASE_KEY=your_supabase_anon_key

   # Clerk配置（如果使用Clerk认证）
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

### 开发

**启动开发服务器：**
```bash
npm run dev
```

**构建生产版本：**
```bash
npm run build
```

**预览生产构建：**
```bash
npm run preview
```

**生成静态站点：**
```bash
npm run generate
```

### 文档

**启动文档开发服务器：**
```bash
npm run docs:dev
```

**构建文档：**
```bash
npm run docs:build
```

**预览文档：**
```bash
npm run docs:preview
```

## 📚 文档

完整的文档可在 `/docs` 目录中找到，包括：

- **用户指南** - 完整的使用说明和教程
- **API参考** - 详细的API文档
- **开发指南** - 贡献指南和开发工作流程
- **部署指南** - 生产部署说明

本地访问文档：
```bash
npm run docs:dev
```

## 🌐 国际化

URDOC支持多语言，内置国际化功能：

- **中文** - 默认语言
- **English** - 完整翻译支持

语言文件位于 `i18n/locales/`，可以轻松扩展其他语言。

## 🚀 部署

### EdgeOne部署

该项目配置了EdgeOne无服务器函数部署：

```bash
# 构建并部署到EdgeOne
npm run edgeone
```

### 环境配置

项目使用路由规则以获得最佳性能：
- 静态路由使用服务端渲染（SSR）
- 动态路由（`/user/**`、`/project/**`等）使用客户端渲染
- 媒体路由（`/image/**`、`/video/**`、`/audio/**`）针对静态交付进行优化

## 🤝 贡献

我们欢迎对URDOC的贡献！请遵循以下指南：

1. Fork该仓库
2. 创建功能分支（`git checkout -b feature/amazing-feature`）
3. 提交更改（`git commit -m 'Add amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 打开Pull Request

请确保您的代码遵循项目的编码标准并包含适当的测试。

## 📄 许可证

本项目采用MIT许可证 - 详见[LICENSE](LICENSE)文件。

## 🌟 致谢

- 基于[Nuxt.js](https://nuxt.com/)构建 - 直观的Vue框架
- UI组件由[Vuetify](https://vuetifyjs.com/)提供
- 认证功能由[Clerk](https://clerk.com/)提供支持
- 数据库服务由[Supabase](https://supabase.com/)提供

---

<div align="center">
为医学教育和临床实践❤️制作
</div>