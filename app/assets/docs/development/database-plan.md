# 数据库集成开发大纲

## 一、项目概述

### 1.1 背景
当前项目完全基于浏览器 localStorage 进行数据持久化，存在以下限制：
- 数据无法跨设备同步
- 存储容量受限（通常 5-10MB）
- 无法进行复杂查询和数据分析
- 数据安全性较低

### 1.2 目标
- 添加服务端数据库支持，实现数据持久化
- 当前使用 Turso 数据库（SQLite 兼容）
- 设计可扩展架构，便于未来切换到 EdgeOne Makers 原生数据库
- 保持向后兼容，支持从 localStorage 渐进式迁移

### 1.3 技术选型
- **数据库驱动**: @libsql/client（Turso 官方驱动）
- **运行时验证**: Zod（与现有代码保持一致）

## 二、架构设计

### 2.1 整体架构
```
┌─────────────────────────────────────────────────┐
│                  前端层 (Pinia Stores)          │
│           useLocalStorage / useDatabase         │
├─────────────────────────────────────────────────┤
│              数据持久化抽象层                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┐│
│  │ localStorage │  │  REST API   │  │  SDK    ││
│  │  (当前实现)  │  │  (推荐)     │  │ (可选)  ││
│  └─────────────┘  └─────────────┘  └─────────┘│
├─────────────────────────────────────────────────┤
│              服务端 API 层                      │
│  ┌─────────────────────────────────────────┐  │
│  │  server/api/ (CRUD + 业务逻辑)          │  │
│  └─────────────────────────────────────────┘  │
├─────────────────────────────────────────────────┤
│              数据库驱动层                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┐│
│  │  Turso/libSQL│  │  Supabase   │  │ SQLite  ││
│  │  (当前)      │  │  (备选)     │  │ (本地)  ││
│  └─────────────┘  └─────────────┘  └─────────┘│
└─────────────────────────────────────────────────┘
```

### 2.2 目录结构
```
urdoc/
├── server/
│   ├── db/
│   │   ├── index.ts           # @libsql/client 连接配置
│   │   └── migrations/        # SQL 迁移文件
│   │       └── 001_users.sql  # 用户表迁移
│   ├── utils/
│   │   └── db.ts              # 数据库工具函数（自动导入）
│   └── api/
│       ├── auth/              # 认证 API
│       │   ├── login.post.ts  # 登录接口
│       │   └── logout.post.ts # 登出接口
│       ├── cases/             # 病例 API
│       ├── stories/           # 故事 API
│       ├── tests/             # 考核 API
│       ├── acts/              # 互动实践 API
│       ├── rates/             # 评价 API
│       └── records/           # 记录 API
├── app/
│   ├── composables/
│   │   └── useDatabase.ts     # 数据库操作 composable
│   ├── pages/
│   │   └── login.vue          # 登录页面
│   └── utils/
│       └── migration.ts       # localStorage 迁移工具
└── package.json               # 依赖配置
```

## 三、实现阶段

### 阶段 1：基础设施搭建（预计 2-3 小时）

#### 步骤 1.1：安装依赖
```bash
pnpm add @libsql/client
```

#### 步骤 1.2：数据库连接
- 创建 `server/db/index.ts`
- 实现数据库连接配置
- 支持 Turso 和本地 SQLite 双模式

#### 步骤 1.3：工具函数
- 创建 `server/utils/db.ts`
- 实现通用 CRUD 工具函数
- 添加 Zod 验证

### 阶段 2：API 开发（预计 3-4 小时）

#### 步骤 2.1：验证器定义
- 在 `server/utils/db.ts` 中定义 Zod schema
- 为每个实体定义请求体和查询参数验证

#### 步骤 2.2：Cases API
```
POST   /api/cases          # 创建病例
GET    /api/cases          # 获取病例列表（支持分页、搜索）
GET    /api/cases/:id      # 获取单个病例
PUT    /api/cases/:id      # 更新病例
DELETE /api/cases/:id      # 删除病例
```

#### 步骤 2.3：Stories API
- 实现与 Cases 类似的 CRUD 接口
- 支持按标签筛选

#### 步骤 2.4：Tests API
- 实现考核数据的 CRUD
- 添加答案提交和评分接口

#### 步骤 2.5：Acts API
- 实现互动实践的 CRUD
- 添加对话历史记录接口

#### 步骤 2.6：Rates API
- 实现评价数据的 CRUD

#### 步骤 2.7：Records API
- 实现记录协调器
- 支持批量操作

### 阶段 3：前端集成（预计 2-3 小时）

#### 步骤 3.1：数据库 Composable
- 创建 `app/composables/useDatabase.ts`
- 封装所有 API 调用
- 实现错误处理和重试机制

#### 步骤 3.2：Store 更新
- 更新现有 Pinia stores 支持双模式
- 添加数据同步逻辑
- 实现乐观更新

#### 步骤 3.3：数据迁移工具
- 创建 `app/utils/migration.ts`
- 实现 localStorage 数据导入
- 添加数据验证和清洗

### 阶段 4：数据迁移（预计 1-2 小时）

#### 步骤 4.1：迁移脚本
- 创建迁移页面或工具
- 实现一键迁移功能
- 添加迁移进度显示

#### 步骤 4.2：数据验证
- 实现迁移后数据完整性检查
- 添加数据对比功能
- 支持回滚操作

### 阶段 5：优化和测试（预计 2-3 小时）

#### 步骤 5.1：性能优化
- 添加数据库索引
- 实现查询缓存
- 优化批量操作

#### 步骤 5.2：错误处理
- 统一错误响应格式
- 添加日志记录
- 实现错误恢复机制

#### 步骤 5.3：测试
- 编写 API 单元测试
- 进行集成测试
- 性能压力测试

## 四、数据表设计

### 4.1 表结构概览

共 12 张表：
- `users` — 用户表（认证用）
- `records` — 主表，存储记录基本信息
- `record_cases` — 病例子表
- `record_stories` — 故事子表
- `record_tests` — 考核子表
- `record_acts` — 互动实践子表
- `record_rates` — 评价子表
- `record_images` — 图片子表
- `record_audios` — 音频子表
- `record_videos` — 视频子表
- `models` — 模型配置表
- `prompts` — 提示词表

### 4.2 核心表结构

**users 表（用户认证）**
- id: INTEGER PRIMARY KEY AUTOINCREMENT
- name: TEXT UNIQUE NOT NULL (用户名)
- password_hash: TEXT NOT NULL (密码哈希，scrypt)
- created_at: INTEGER (创建时间)

**records 表（主表）**
- id: INTEGER PRIMARY KEY
- created_at: INTEGER
- updated_at: INTEGER

**record_cases 表（病例）**
- id: INTEGER PRIMARY KEY
- record_id: INTEGER (外键关联 records)
- tags: TEXT (JSON 数组)
- textbook: TEXT (JSON 对象)
- custom: TEXT (JSON 数组)
- reasoning: TEXT
- content: TEXT (JSON 对象)
- verify_result: TEXT
- verify_reasoning: TEXT
- created_at: INTEGER
- updated_at: INTEGER

**record_stories 表（故事）**
- id: INTEGER PRIMARY KEY
- record_id: INTEGER (外键关联 records)
- tags: TEXT (JSON 数组)
- custom: TEXT (JSON 数组)
- reasoning: TEXT
- content: TEXT
- created_at: INTEGER
- updated_at: INTEGER

**record_tests 表（考核）**
- id: INTEGER PRIMARY KEY
- record_id: INTEGER (外键关联 records)
- tags: TEXT (JSON 数组)
- custom: TEXT (JSON 数组)
- reasoning: TEXT
- content: TEXT
- user_answers: TEXT (JSON 对象)
- submitted: INTEGER (布尔值)
- score: INTEGER
- created_at: INTEGER
- updated_at: INTEGER

**record_acts 表（互动实践）**
- id: INTEGER PRIMARY KEY
- record_id: INTEGER (外键关联 records)
- case_id: INTEGER (关联病例)
- custom: TEXT (JSON 数组)
- reasoning: TEXT
- content: TEXT (JSON 数组)
- quiz: TEXT (JSON 数组)
- user_answers: TEXT (JSON 对象)
- quiz_submitted: INTEGER (布尔值)
- quiz_score: INTEGER
- created_at: INTEGER
- updated_at: INTEGER

**record_rates 表（评价）**
- id: INTEGER PRIMARY KEY
- record_id: INTEGER (外键关联 records)
- tags: TEXT (JSON 数组)
- custom: TEXT (JSON 数组)
- reasoning: TEXT
- content: TEXT
- created_at: INTEGER
- updated_at: INTEGER

### 4.3 多媒体表结构

**record_images 表（图片）**
- id: INTEGER PRIMARY KEY
- record_id: INTEGER (外键关联 records)
- task: TEXT (任务类型：face/illustration/custom)
- prompt: TEXT (生成提示词)
- url: TEXT (图片 URL)
- original_url: TEXT (原始 URL)
- model: TEXT (使用的模型)
- created_at: INTEGER

**record_audios 表（音频）**
- id: INTEGER PRIMARY KEY
- record_id: INTEGER (外键关联 records)
- task: TEXT (任务类型)
- text: TEXT (原文内容)
- url: TEXT (音频 URL)
- model: TEXT (使用的模型)
- created_at: INTEGER

**record_videos 表（视频）**
- id: INTEGER PRIMARY KEY
- record_id: INTEGER (外键关联 records)
- prompt: TEXT (生成提示词)
- url: TEXT (视频 URL)
- duration: INTEGER (时长/帧数)
- model: TEXT (使用的模型)
- created_at: INTEGER

### 4.4 配置表结构

**models 表（模型配置）**
- id: INTEGER PRIMARY KEY
- provider: TEXT (提供商名称)
- api_key: TEXT (API 密钥引用)
- base_url: TEXT (API 地址)
- models: TEXT (JSON 数组，可用模型列表)
- is_active: INTEGER (是否启用)
- created_at: INTEGER
- updated_at: INTEGER

**prompts 表（提示词）**
- id: INTEGER PRIMARY KEY
- type: TEXT (类型：case/story/test/act/rate/face/illustration/video/audio)
- task: TEXT (任务：generate/verify/fix)
- content: TEXT (提示词内容)
- is_custom: INTEGER (是否自定义)
- created_at: INTEGER
- updated_at: INTEGER

### 4.5 索引设计
- records: 无特殊索引
- 所有子表: record_id 索引
- models: provider 索引
- prompts: (type, task) 联合索引

### 4.6 关联关系
```
records (1) ──── (N) record_cases
records (1) ──── (N) record_stories
records (1) ──── (N) record_tests
records (1) ──── (N) record_acts
records (1) ──── (N) record_rates
records (1) ──── (N) record_images
records (1) ──── (N) record_audios
records (1) ──── (N) record_videos
record_cases (1) ──── (N) record_acts
```

### 4.7 数据库连接配置

- 创建 `server/db/index.ts`
- 使用 `@libsql/client` 创建连接
- 通过 `useRuntimeConfig()` 获取 Turso 配置
- 本地开发环境使用 `file:local.db`

### 4.8 工具函数

- 创建 `server/utils/db.ts`
- 实现通用 CRUD 工具函数（findAll, findById, create, update, delete）
- 使用原始 SQL 查询
- 通过 Zod 验证输入数据

### 4.9 API 路由

**认证 API**
- 创建 `server/api/auth/login.post.ts` — 用户登录
- 创建 `server/api/auth/logout.post.ts` — 用户登出
- 使用 `setUserSession()` / `clearUserSession()` 管理会话
- 使用 `hashPassword()` / `verifyPassword()` 处理密码

**数据 API**
- 创建 `server/api/records/index.get.ts` 等路由文件
- 使用 `useDb()` 获取数据库连接
- 调用工具函数执行查询
- 返回 JSON 响应

### 4.10 前端 Composable

- 创建 `app/composables/useDatabase.ts`
- 封装所有 API 调用（使用 `$fetch`）
- 实现错误处理和重试机制

## 五、数据迁移策略

### 5.1 迁移流程
1. 检测 localStorage 中的数据
2. 验证数据格式和完整性
3. 批量导入到数据库
4. 更新前端 store 使用远程数据
5. 可选：清除 localStorage 数据

### 5.2 迁移工具

- 创建 `app/utils/migration.ts`
- 检测 localStorage 中的数据
- 验证数据格式和完整性
- 批量导入到数据库

### 5.3 向后兼容
- 保持 localStorage 作为 fallback
- 通过环境变量控制数据源
- 支持混合模式（部分数据在数据库，部分在本地）

## 六、配置和环境变量

### 6.1 nuxt.config.ts 更新
```typescript
export default defineNuxtConfig({
  modules: ['nuxt-auth-utils', /* 其他模块 */],
  runtimeConfig: {
    turso: {
      databaseUrl: '',
      authToken: '',
    },
  },
})
```

### 6.2 环境变量
```bash
# .env
NUXT_TURSO_DATABASE_URL=libsql://urdoc-dearfad.aws-ap-northeast-1.turso.io
NUXT_TURSO_AUTH_TOKEN=your_token_here
NUXT_SESSION_PASSWORD=your_session_password_min_32_chars  # nuxt-auth-utils 会话加密
```

## 七、切换到 EdgeOne Makers 数据库

### 7.1 驱动抽象层设计

在 `server/db/index.ts` 中实现驱动工厂，根据环境变量返回对应的数据库 client：

```
server/db/
├── index.ts          # 驱动工厂
└── drivers/
    ├── turso.ts      # @libsql/client 实现
    └── edgeone.ts    # 未来 EdgeOne 驱动实现
```

所有驱动需实现统一的 `execute()` 接口，确保上层代码无需修改。

### 7.2 切换步骤

1. **新增 EdgeOne 驱动**：在 `server/db/drivers/edgeone.ts` 实现与 @libsql/client 相同的接口
2. **修改驱动工厂**：在 `server/db/index.ts` 中根据环境变量选择驱动
3. **数据迁移**：从 Turso 导出数据，写入 EdgeOne 数据库

### 7.3 兼容性保证

- SQL 查询保持不变（SQLite 方言）
- API 路由和工具函数无需修改
- 仅需修改驱动配置和环境变量

## 八、测试计划

### 8.1 单元测试
- Repository 方法测试
- API 路由测试
- 验证器测试

### 8.2 集成测试
- 完整 CRUD 流程测试
- 数据一致性测试
- 并发操作测试

### 8.3 性能测试
- 查询性能基准
- 批量操作性能
- 并发负载测试

## 九、部署清单

### 9.1 部署前检查
- [ ] 环境变量已配置
- [ ] 数据库迁移已执行
- [ ] 测试全部通过
- [ ] 性能指标达标

### 9.2 部署步骤
1. 执行数据库迁移
2. 部署应用代码
3. 验证 API 功能
4. 监控错误日志

### 9.3 回滚方案
- 保留数据库备份
- 准备回滚脚本
- 制定回滚流程

## 十、时间规划

| 阶段 | 任务 | 预计时间 | 优先级 |
|------|------|----------|--------|
| 1 | 基础设施搭建 | 2-3 小时 | P0 |
| 2 | API 开发 | 3-4 小时 | P0 |
| 3 | 前端集成 | 2-3 小时 | P1 |
| 4 | 数据迁移 | 1-2 小时 | P1 |
| 5 | 优化和测试 | 2-3 小时 | P2 |
| **总计** | | **10-15 小时** | |

## 十一、风险和缓解措施

### 11.1 技术风险
- **风险**: SQL 注入
- **缓解**: 使用参数化查询，避免字符串拼接

### 11.2 数据风险
- **风险**: 数据迁移丢失
- **缓解**: 迁移前备份，支持回滚

### 11.3 性能风险
- **风险**: 查询性能下降
- **缓解**: 添加索引，优化查询

## 十二、后续扩展

### 12.1 功能扩展
- 数据导出功能
- 实时数据同步
- 用户权限细化（admin/user 角色）

### 12.2 架构优化
- 连接池优化
- 查询缓存
- 读写分离

## 附录

### A. 参考资源
- [@libsql/client 文档](https://docs.turso.tech/sdk/ts/quickstart)
- [Turso 文档](https://docs.turso.tech/)
- [Nuxt Server 模式](https://nuxt.com/docs/guide/directory-structure/server)

### B. 相关文件
- `nuxt.config.ts` - 项目配置
- `app/types/` - 类型定义
- `app/stores/` - Pinia stores
- `server/api/` - 服务端 API
