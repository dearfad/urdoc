# urdoc 研究平台综合改造任务清单

> **依据文档**
> - `app/assets/docs/research/cstar-research-platform-blueprint.md`（主蓝图，结论与决策）
> - `app/assets/docs/research/research-data-foundation.md`（附录 A，域模型、字段方向、API 与存储）
> - `app/assets/docs/research/gap-matrix-and-roadmap.md`（附录 B，差距矩阵、路线图、验收清单）
>
> **研究基线**：《研究计划.md》2026-11-02 定稿（单中心平行两臂随机准实验）
> **版本**：v1.0 · 2026-11-11 · 状态：待评审
> **性质**：本文件仅是**任务编排**，描述未来要做的代码改造；本次交付只新增本文件，未改动任何 `.vue` / `.ts` / `.json` / `.sql` 业务代码、配置或依赖。

---

## 研究文档导航

本清单与下列文档同位于 `app/assets/docs/research/`。站内导航链接由 `app/utils/docs.ts` 的 `import.meta.glob('~/assets/docs/**/*.md')` 按 slug 加载，注册 `docNav` 前即可直接访问，只是不会出现在文档侧边栏（见 T-03）；仓库内相对路径链接供 IDE 与代码仓库中打开。

| 目录 / 文档 | 站内导航链接 | 仓库内路径 |
| --- | --- | --- |
| `research/` 目录 | 站内无目录页 | [打开目录](./) |
| 主蓝图 · CSTAR 研究平台整体改造蓝图 | [/docs/research/cstar-research-platform-blueprint](/docs/research/cstar-research-platform-blueprint) | [cstar-research-platform-blueprint.md](./cstar-research-platform-blueprint.md) |
| 附录 A · 研究数据底座设计 | [/docs/research/research-data-foundation](/docs/research/research-data-foundation) | [research-data-foundation.md](./research-data-foundation.md) |
| 附录 B · 差距矩阵与分阶段路线图 | [/docs/research/gap-matrix-and-roadmap](/docs/research/gap-matrix-and-roadmap) | [gap-matrix-and-roadmap.md](./gap-matrix-and-roadmap.md) |
| 本清单 · 综合改造任务清单 | [/docs/research/task](/docs/research/task) | [task.md](./task.md) |

> 若需四份文档都出现在文档侧边栏，在 T-03 的 `docNav` 分组中一并加入 `research/task` 即可。

---

## 0. 使用说明

### 0.1 目标与范围

把 `urdoc` 从「单机、单人、浏览器本地的 AI 内容生成工具」改造为「由研究协议驱动、按角色分入口、五环节与多模态为可复用能力、全过程数据落库且可审计」的研究平台（主蓝图第 3.1、4.1 节）。本清单把附录 B 差距矩阵的 P / C / M / D / Q 共 60 项，合并为 **25 项可执行的代码改造任务**，每项给出目标与实现方法。

### 0.2 排序尺度：为什么这样排

任务严格按**实现复杂度由低到高**排列，复杂度由四个尺度共同判定：

1. **改动范围**：单行修复 → 单文件配置 → 多文件类型与契约 → 新增服务端分层 → 跨端业务能力 → 全链路集成。
2. **是否引入新架构层**：不引入（A）→ 类型与常量（B）→ 数据访问与鉴权（C）→ 研究域服务（D）→ 五环节与多模态能力（E、F）→ 治理与统计（G）。
3. **依赖链长度**：无依赖的任务在前，被后续任务依赖的基础能力必须先行（例如类型 → 驱动 → API → 页面）。
4. **是否涉及外部能力**：Blob 对象存储、录制设备、ASR 转录、统计门控等外部依赖越多的任务排在越后。

> 排序是**依赖与复杂度顺序**，不是时间顺序。时间顺序以附录 B 第 4 章阶段路线图为准；两者互补，实施时以路线图门控（M2 冻结、M3 pilot、M6 锁库）控制放行，以本清单控制先后依赖。

### 0.3 全局实现约束（所有任务共同遵守）

| 约束 | 要求 | 依据 |
| --- | --- | --- |
| 组件与样式 | 优先 Nuxt UI v4 内置组件；语义色 `text-muted` / `bg-elevated` / `border-default`；桌面横向、移动端纵向堆叠，输入控件 `size="lg"` 或 `size="xl"` | `AGENTS.md`、主蓝图第 5.1 节 |
| 状态 | 新增 Pinia store 必须调用 `syncStoreVersion(VERSION, 'pinia:<name>')`；localStorage 只存非研究偏好与断网补偿，不作研究证据 | `app/utils/store.ts`、主蓝图 P5 / E-08 |
| 大模型通信 | 统一走 `ai` SDK；现有实际链路是 `server/api/chat/`（**不是** `AGENTS.md` 记载的 `server/api/aisdk/text/index.ts`），前端 `app/composables/useChatApi.ts` 用 `Chat` + `DefaultChatTransport` | 主蓝图第 6.0 节 |
| 服务端 | `server/api/*.get.ts` / `*.post.ts` 决定方法；`defineEventHandler`、`getRouterParam`、`readValidatedBody` / `getValidatedQuery`、`createError`；Repository 放 `server/utils/` 自动导入；密钥只读 `runtimeConfig` 私有键 | 附录 A 第 6.1 节 |
| 校验与可复现 | 用项目已装的 `zod` 定义 API 请求 / 响应 schema 并推导类型；每次 AI 调用记录模型 / 版本 / 温度 / 提示词版本 / 时间戳 | 附录 A 第 6.1、10 章、E-06 |
| 代码风格 | 简体中文注释；Prettier 无分号、单引号、120 字符行宽 | `AGENTS.md` |
| 流程与内容解耦 | `app/stores/record.ts` 的 8 步 `order` 与 `app/utils/recordContent.ts` 继续只管内容依赖与重生成提示，**不得**改造成实验流程 | 主蓝图 P2、D-15 |

### 0.4 非任务范围（实施时不得误做）

- **明确不做**（附录 B 第 2.6 节 N-01 至 N-06）：真实 SP 版 mini-CEX、患者版 MSF / CBD、DOPS 整体纳入与 SCT 确证化、虚拟社区声音与非临床情境任务的确证测量（M-08）、把卷面 X/Y 改名成 OSCE、用 AI 自动评分替代人工确证评分。它们仅登记为后续可配置研究方向。
- **反向红线**（主蓝图第 8.1 节 R-01 至 R-10）：无真人患者、格式等价、干预与测评分离、三库隔离、测评人格独立、评分留人在环、单一主要结局、结论限定「CSTAR 程序效应」、JSE-HPS 与 vOSCE 独立保留、如实命名 vOSCE。
- **不属代码任务**：附录 B 阶段 0 的蓝图评审、伦理申请、知情同意文本审定、师资培训与论文撰写，不在本清单内。
- **待决事项**（主蓝图第 9.4 节）：D1 / D2 / D3 / D4 由课题方、伦理或平台方决策，不预设结论；其对任务的阻塞关系见第 4 章。
- **文档纠偏提醒**（不列为任务）：`AGENTS.md` 中 `server/api/aisdk/text/index.ts` 的路径记载已过时，实际为 `server/api/chat/`，维护 `AGENTS.md` 时一并更新。

### 0.5 任务梯度

| 梯度 | 任务 | 复杂度 | 主题 |
| --- | --- | --- | --- |
| A | T-01 ~ T-03 | 极低 | 最小改动与配置注册 |
| B | T-04 ~ T-05 | 低 | 类型、常量与数据契约 |
| C | T-06 ~ T-09 | 中低 | 服务端数据访问、鉴权、API、日志 |
| D | T-10 ~ T-12 | 中 | 协议、题库量规、页面骨架 |
| E | T-13 ~ T-18 | 中高 | CSTAR 五模块改造 |
| F | T-19 ~ T-22 | 高 | 多模态素材、量表、vOSCE、教师轨 |
| G | T-23 ~ T-25 | 最高 | 导出锁库、统计门控、全链路集成 |

---

## 1. 任务总览

| 编号 | 任务 | 复杂度 | 主要依赖 | 对应差距项 |
| --- | --- | --- | --- | --- |
| T-01 | 修正三页面唯一标识与导航语义 | 极低 | 无 | P-05 |
| T-02 | 修正用户表迁移脚本语法瑕疵 | 极低 | 无 | P-R5、核验 9 |
| T-03 | 注册研究文档目录到站内导航 | 极低 | 无 | 附录 B 第 8 章 |
| T-04 | 新增研究域类型与 Zod schema | 低 | 无 | D-01 |
| T-05 | 冻结常量与协议配置载体 | 低 | T-04 | C-06、D-07、Q-10 |
| T-06 | 统一数据访问驱动与研究表迁移 | 中低 | T-02、T-04 | D-13、D-14 |
| T-07 | 账号角色、RBAC 与盲态中间件 | 中低 | T-06 | D-04、Q-08、E-03 |
| T-08 | `/api/research/**` 路由骨架 | 中低 | T-04、T-06、T-07 | 附录 A 6.2 |
| T-09 | 三类日志、事件批量写入与模型留痕 | 中低 | T-06、T-08 | D-05、D-12、E-06 |
| T-10 | 协议冻结、随机化与知情同意 | 中 | T-06、T-08 | D-01 ~ D-03、Q-07 |
| T-11 | 三套隔离题库、冻结量规与等价校验 | 中 | T-05、T-08、T-10 | C-06 ~ C-08、Q-02、Q-03 |
| T-12 | 协议上下文注入与三页面骨架 | 中 | T-04、T-08、T-10、T-11 | P-01 ~ P-04、P-06 |
| T-13 | Case / Story 结构化参数与人工审核冻结 | 中高 | T-09、T-12 | C-01 ~ C-04、E-05 |
| T-14 | Test 三类题型与逐题事件采集 | 中高 | T-09、T-11、T-12 | C-05、C-09、C-10 |
| T-15 | LLM 辅助评分通道 | 中高 | T-04、T-09 | C-11 |
| T-16 | 盲态双评、仲裁与一致性统计 | 中高 | T-07、T-15 | C-12、D-08、Q-05、Q-06 |
| T-17 | Act 压缩为对话子题并解耦 persona | 中高 | T-09、T-12 | C-13 ~ C-15、Q-04 |
| T-18 | Rate 拆为四个可采集动作 | 中高 | T-09、T-12、T-17 | C-16 ~ C-20 |
| T-19 | 素材生命周期与 Blob 归档 | 高 | T-06、T-09、T-13 | M-01、M-02、M-09、D-14 |
| T-20 | JSE-HPS 量表前后测与信度门控 | 高 | T-08、T-10 | D-06、Q-06 |
| T-21 | vOSCE 考站、录制与转录存档 | 高 | T-16、T-17、T-19 | M-03、M-04、M-07、D-09 |
| T-22 | 教师平行采集轨 | 高 | T-09、T-18 | D-10、C-18 |
| T-23 | 按月结构化导出与锁库只读 | 最高 | T-06、T-09 | D-11、E-04 |
| T-24 | 数据质量、一致性与统计门控 | 最高 | T-16、T-20、T-23 | Q-06、Q-09、Q-10、E-07 |
| T-25 | 全链路集成、pilot 与配置化扩展 | 最高 | T-01 ~ T-24 | 阶段 2 ~ 5、第 9 章 |

---

## 2. 逐项任务（由最简单到最复杂）

### 梯度 A · 最小改动与配置注册

#### T-01 · 修正三个 `project` 页面的唯一标识与导航语义

- **目标**：消除三页 `UDashboardPanel` 的 `id` 重复，使面包屑、标题与 i18n 键按「全体 / 教师 / 学生」三类角色语义正确，为后续按角色分工打底（P-05）。
- **实现方法**：把 `app/pages/project/narrative-medicine.vue`、`pedagogical-research.vue`、`clinical-simulation.vue` 的 `id` 分别改为 `pages-project-narrative-medicine` / `pages-project-pedagogical-research` / `pages-project-clinical-simulation`；同步 `definePageMeta` 的 `title` 与 `UDashboardNavbar` 的标题键；在 `app/components/App/Sidebar.vue:48-72` 的 projects 组按角色说明调整 label / icon，并在根目录 `i18n/locales/zh.json`、`en.json` 补齐对应键。仅改标识与文案，不新增区块。

#### T-02 · 修正用户表迁移脚本语法瑕疵

- **目标**：让现有迁移可被 `@libsql/client` 正确执行且可重复运行，解除阶段 1 数据层的前置阻塞（P-R5、附录 B 核验 9）。
- **实现方法**：删除 `server/db/migrations/001_users.sql:5` 中 `password_hash TEXT NOT NULL` 行尾多余的逗号；确认 `CREATE TABLE IF NOT EXISTS` 与 `CREATE INDEX IF NOT EXISTS` 幂等；做一次最小执行验证（用 `runtimeConfig.turso` 凭据连库执行或用 SQLite 解析），确认无语法错误。本任务**不扩展表结构**，角色与盲态字段留给 T-07。

#### T-03 · 注册研究文档目录到站内导航

- **目标**：把 `app/assets/docs/research/` 下的主蓝图、两份附录与任务清单作为同一分组出现在文档侧边栏，与上文「研究文档导航」的链接表一一对应，便于实施与评审互相跳转核对设计口径（附录 B 第 8 章）。
- **实现方法**：在 `app/utils/docs.ts` 的 `docNav` 末尾新增一个 `DocGroup`（类型见同文件 `:10-14`），`children` 四条 slug：`research/cstar-research-platform-blueprint`、`research/research-data-foundation`、`research/gap-matrix-and-roadmap`、`research/task`；`generateDocSidebarItems()`（`:105-128`）自动生成导航，`app/pages/docs/[...slug].vue` 与 `import.meta.glob` 加载规则无需改动。需要双语标签时再补 `i18n/locales/*.json`。

### 梯度 B · 类型、常量与数据契约

#### T-04 · 新增研究域类型与 Zod schema

- **目标**：把附录 A 第 2、3 章的域模型落成可评审、可复用、可校验的类型契约，作为后续所有服务端与前端任务的共同语言（D-01）。
- **实现方法**：在 `app/types/` 新增研究域类型文件（如 `research.ts`，或 `research/` 子目录按分组拆分），覆盖 `Study`、`ProtocolVersion`、`Arm`、`Window`、`Subject`、`Consent`、`Assignment`、`Account` / `Role`、`Session`、`ItemBank`、`Item`、`RubricVersion`、`Response`、`Score`、`Review`、`Scale` / `ScaleItem` / `ScaleResponse`、`VosceScript` / `VosceSession` / `VosceScore`、`Transcript`、研究侧 `Case` / `Story`、`Reflection`、`DiscussionPost`、`MediaAsset`、`ModelRun`、`TeacherEvent`、`AuditLog`、`ExportJob`；新增 `research.schema.ts`，用已装的 `zod` 定义 API 请求 / 响应 schema 并以 `z.infer` 推导类型，权重与枚举用 `z.literal` / `z.enum` 锁定。类型由 `nuxt.config.ts` 的 `imports.dirs` 自动扫描；**不改动**现有 10 个内容域类型文件（附录 A 第 2.3 节）。

#### T-05 · 冻结常量与协议配置载体

- **目标**：把研究设计中必须冻结的枚举与权重收敛到单一配置源，杜绝页面硬编码研究设计（主蓝图 P1、R-07、Q-10）。
- **实现方法**：新增共享常量模块（如 `app/constants/research.ts` 与 `server/utils/research/constants.ts`），以 `as const` 定义：臂别 A / B、窗口 PRE / ROTATION / POST、题库标签 practice / X / Y、维度权重 W1 40 / W2 30 / W3 30、叙事冲突点清单、评分通道 `auto` / `llm_assist` / `human` / `arbitration`、scaffolding 编码枚举、事件名枚举。所有取值由协议或数据库注入，页面只读不写；待 T-11 把权重写入 `rubric_version` 后，以数据库冻结版本为权威，常量仅作兜底与类型约束。

### 梯度 C · 服务端数据访问、鉴权、API 与日志

#### T-06 · 统一数据访问驱动与研究表迁移

- **目标**：建立「研究数据全部落库」的物理基础，以可切换的驱动抽象隔离 Turso 与未来存储形态（D-13、D-14、E-08）。
- **实现方法**：复用 `app/assets/docs/development/database-plan.md:417-437` 的规划思路，新增 `server/db/index.ts` 暴露统一 `execute()` 与驱动工厂、`server/db/drivers/turso.ts` 从 `runtimeConfig.turso.{databaseUrl,authToken}` 读取凭据（仅服务端可读）、`server/utils/db.ts` 封装自动导入的 Repository；按附录 A 第 3 章字段方向新增 `server/db/migrations/002_research_*.sql` 系列迁移，覆盖研究定义、身份伦理、窗口题库量规、作答评分复核、量表与 vOSCE、内容素材、教师轨、审计与导出各组表，并按 `subject_id_hash + window_id`、`batch + occurred_at`、`bank_tag` 建复合索引。一律参数化查询，不写死凭据；为 Blob / KV 切换预留驱动接口，强一致状态（随机化、评分、锁库）不得放入最终一致的 KV（附录 A 8.2、P-R3）。

#### T-07 · 账号角色、RBAC 与盲态中间件

- **目标**：建立学生 / 教师 / 盲态评分者 / 管理员四类角色，并在服务端强制过滤盲态字段，保证盲态不被前端绕过（D-04、E-03、Q-05）。
- **实现方法**：扩展 `users` 表或新建 `account` / `role` 表，字段至少含 `role`、`is_teaching_faculty`、`scope`；沿用 `nuxt-auth-utils` 的 `setUserSession` / `getUserSession`（现状见 `server/api/auth/login.post.ts:46-51`），在 `server/middleware/` 新增鉴权与角色校验中间件；臂别、学员身份、题库标签、pre / post 时点在**服务端**剥离，评分接口只返回盲态字段集；重建 `app/stores/user.ts`（当前为全注释空壳），按 `app/utils/store.ts` 的 `syncStoreVersion` 规范接入。盲态评分视图须是独立页面 / 路由，不复用教师工作台的学情组件。

#### T-08 · `/api/research/**` 路由骨架

- **目标**：形成附录 A 第 6.2 节定义的完整研究 API 表面，让所有研究能力通过统一服务端入口读写（附录 A 第 6 章）。
- **实现方法**：在 `server/api/research/` 下按 Nuxt 4 约定建路由，`*.get.ts` / `*.post.ts` 决定方法，动态参数用描述性名称（如 `[studyId].get.ts`，不用泛化 `[id].get.ts`）；使用 `defineEventHandler`、`getRouterParam`、`readValidatedBody` / `getValidatedQuery` 配合 T-04 的 Zod schema 校验、`createError` 统一错误响应。路由组覆盖 `studies` / `protocols`、`subjects` / `assignments`、`sessions`、`items` / `banks`、`responses`（POST 批量）、`scores` / `reviews`、`scales` / `vosce`、`media`、`teacher-events`、`exports` / `audit`。数据访问一律经 T-06 Repository，避免各路由直接拼 SQL；研究事件与评分不缓存，缓存只用于文档、静态字典等非研究数据。

#### T-09 · 三类日志、事件批量写入与模型留痕

- **目标**：落实「答题即数据」，把业务日志、研究事件日志、审计日志分离，并保证主要结局数据不丢、不重（D-05、D-12、E-06、附录 A 第 4 章）。
- **实现方法**：新增 `server/utils/research/events.ts`，定义 `item.started`、`item.submitted`、`confidence.reported`、`story.read`、`dialogue.turn`、`report.viewed`、`reflection.submitted`、`discussion.posted` 等研究事件，以及 `content.approved`、`rubric.frozen`、`assignment.created`、`score.reviewed`、`export.generated`、`data.locked` 等审计动作；每个事件带 `event_id` 幂等键、`occurred_at`、脱敏主体、协议版本与模型 / 提示词版本引用。逐题事件由前端按会话或时间窗缓冲后**批量提交**，服务端用唯一约束去重并具备失败重试与补偿队列（P-R6）。在 `server/api/chat/` 与各多模态生成链路挂载 `model_run` 写入，记录模型 ID / 版本、温度、提示词模板版本（`app/utils/prompts.ts` 加载）、调用时间与输出哈希。

### 梯度 D · 研究流程底座

#### T-10 · 协议冻结、随机化与知情同意

- **目标**：让研究设计由 `study` / `protocol_version` 配置驱动，实现可审计的随机分配与合规入组（D-01 至 D-03、Q-07、E-01 / E-02）。
- **实现方法**：实现 `study` / `protocol_version` / `arm` / `window` 的注册与冻结，冻结后不可修改、只新增版本，统计计划归档引用 `protocol_id + version`；随机分配按轮转批次或个体生成 `assignment`，记录 `randomization_unit`、`sequence_no`、`assigned_at`、`operator_hash`；入组时生成不可逆 `subject_id_hash`，姓名 / 学号不入库、不出平台；`consent` 记录版本、`signed_at`、`voluntary` 与用途限定（答题数据不与出科成绩 / 个人评价挂钩）。协议层强制 A 臂不接触任何 CSTAR 训练入口，B 臂闭环套数（10 至 20）由协议计数并作为完成标记。

#### T-11 · 三套隔离题库、冻结量规与 A/B 等价校验

- **目标**：把格式等价红线与干预 / 测评分离变成服务端可执行约束，保证三库互不重叠、权重冻结（C-06 至 C-08、D-07、Q-02 / Q-03、R-02 至 R-04）。
- **实现方法**：建 `item_bank`（`bank_tag` = practice / X / Y，练习库带 `is_excluded_from_assessment`）与 `item`（`type` = choice / short_answer / dialogue、`dimension` = W1 / W2 / W3、`criterion_refs`、`equivalent_pair_id`、`content_hash`）；`rubric_version` 由 2 名专家审定后冻结，权重 W1 40 / W2 30 / W3 30 与 criterion 在锁库前定稿、之后只新增版本；组卷服务在服务端校验 A / B 题型组合、题量与 rubric 一致性（唯一允许差异为 B 的 Story 叙事层与线上闭环），并用 `content_hash` 校验出科 Y 未出现在练习库与入科 X；讨论区按批次隔离防透题。任一校验失败以 `createError` 阻止投放，不做静默降级。

#### T-12 · 协议上下文注入与三页面骨架

- **目标**：把三个 `project` 页建成按角色分工的视图与流程入口，通过同一协议调用能力层，避免三处重复实现（P-01 至 P-04、P-06、主蓝图第 5 章）。
- **实现方法**：新增 `app/composables/useStudyProtocol.ts` 与 `app/stores/study.ts`（按 `syncStoreVersion(VERSION, 'pinia:study')` 规范），从 `/api/research/protocols` 读取当前冻结版本，向五个 CSTAR 页与多模态页注入病种、难度、叙事冲突、窗口、题库标签与臂别可见性。`narrative-medicine.vue` 保留现有 `NarrativeSheet` 与 `app/utils/narrativeTemplates.ts` 作为叙事素材创作子能力，新增理论框架、研究总览、叙事医学能力地图与证据链地图（只显示脱敏聚合视图）；`pedagogical-research.vue` 搭教师工作台骨架（冲突设计、审核队列、量规冻结、学情分析、复盘脚手架、同伴协商、教师采集、师资培训入口，先用占位区块，再由 T-13 / T-16 / T-18 / T-22 填充）；`clinical-simulation.vue` 按 PRE / ROTATION / POST 窗口组织导航，服务端保证不暴露臂别、题库标签、标准答案、AI 辅助评分与他人作答。`app/stores/record.ts` 的 8 步 `order` 保持内容编排语义不变（P2）。

### 梯度 E · CSTAR 五模块改造

#### T-13 · Case / Story 结构化参数与人工审核冻结

- **目标**：把 AI 生成内容纳入「草稿 → 待审核 → 已冻结」生命周期，教师对临床准确性与人文真实性承担人工在环审核（C-01 至 C-04、E-05、R4）。
- **实现方法**：`app/components/Case/index.vue:104-154,458-478` 现有生成 / 校验 / 自动更正 / 手工编辑链路接教师参数（病种、难度、冲突点），结果落 `case` / `story` 表并置 `review_status`；把 `app/assets/prompts/case/verify.md` 的「AI 自校验」升级为教师审核清单（临床事实、去标识化、避免偏见），审核人 / 结论 / 时间 / 版本写 `audit_log`，一键纠错全量留痕。`app/components/Story/Content.vue` 四 Tab 保留 AI 示范材料，冲突点从 T-05 清单选取并与 W2 / W3 建立显式映射，A 组「去叙事基础版」与 B 组「叙事情境版」共用题型组合与 rubric；`app/components/Conversation/`、`Discussion/`、`Comment/` 三个 13 行容器组件区分「AI 生成示范」与「真人同伴协商」，后者由 T-18 落库。冻结版本在采集期禁止重新生成覆盖（G-05）。

#### T-14 · Test 三类题型与逐题事件采集

- **目标**：把 Test 从「独立选择题前测」改造为 Case + Story 之后的循环内形成性评估与主要数据来源，实现「答题即数据」（C-05、C-09、C-10、主蓝图第 6.3 节）。
- **实现方法**：扩展 `app/types/test.ts` 与 `app/stores/test.ts:117-142`，支持单选 / 多选（客观题）、简答 / 短文（主观题）、AI 患者对话子题同卷组合，每题带 `dimension`、`criterion_refs`、`bank_tag`；`app/components/Test/index.vue:59-112` 增加逐题开始 / 提交时间、`duration_ms`、置信度 1 至 5、修改次数采集，按会话批量提交到 `/api/research/responses`（幂等 `event_id`），非逐题实时请求；协议强制 Case → Story → Test 时序，Test 完成后才进入 Act 与 Rate；客观题保留现有自动判分但改为按维度与冻结权重合成 0 至 100 总分；置信度校准（平均置信度 − 正确率）作为次要结局，计算交给 T-24。

#### T-15 · LLM 辅助评分通道

- **目标**：为主观题与对话子题建立可复现的 LLM 辅助评分，并明确其不得单独作为确证证据（C-11、G-08、主蓝图第 6.4 节）。
- **实现方法**：基于 `server/api/chat/providers/aisdk.ts` 的 `generateText` 配合 `output: Output.object(...)` 与 Zod schema（以 `node_modules/ai/docs/03-ai-sdk-core/10-generating-structured-data.mdx` 为准），按冻结 criterion 输出维度分与理由；新增 `app/assets/prompts/score/` 模板或改造 `app/assets/prompts/rate/prompt.md`，由 `app/utils/prompts.ts` 加载并记录模板版本；评分写 `score` 时标注 `channel = llm_assist` 并关联 `model_run`。确证分析只采用人工共识分或仲裁分，须在评分服务与导出口径中显式过滤。

#### T-16 · 盲态双评、仲裁与一致性统计

- **目标**：实现 2 名非授课教师网络双评、分歧第三人仲裁，以及 ICC ≥0.75 门控与人机一致性报告（C-12、D-08、Q-05 / Q-06、§9）。
- **实现方法**：建 `review` 任务分派，评分者角色为 `blind_rater`，`blinded_fields` 由 T-07 的服务端过滤保证；双评分歧超阈值触发 `arbitration` 通道；实现 `server/utils/research/agreement.ts`（或独立分析模块），同时计算人—人 ICC 与 AI—人 Pearson r / ICC / 加权 κ + Bland-Altman；ICC ≥0.75 方可进入分析，未达标降级为「AI 辅助、人工主导」并写决策记录。评分界面为独立路由，不复用教师工作台学情信息；评估者校准记录与仲裁记录留审计。

#### T-17 · Act 压缩为对话子题并解耦 persona

- **目标**：把独立自由问诊引擎压缩为答题内 1 至 2 轮 AI 患者对话子题，并使训练 persona 与 vOSCE 测评 persona 完全独立（C-13 至 C-15、Q-04、R-05）。
- **实现方法**：`app/components/Act/index.vue:51-102,138-148,241-359` 保留自由问诊作为训练期可选素材生成能力（不作主要数据来源），新增「答题内短对话子题」模式：限制轮次、固定 persona，`app/components/Act/quiz.vue:42-59` 的得分改为按评分手册 §4.4 的 0 至 9 分 rubric 计入 W3；复用 `app/composables/useChatApi.ts` 的 `Chat` + `DefaultChatTransport` + `/api/chat`，但为 vOSCE 另建独立会话与 `persona_config`，不复用训练单例状态；全量对话以 `dialogue.turn` 事件落 `transcript` 表并归档，供盲态复评与答辩质证。

#### T-18 · Rate 拆为四个可采集动作

- **目标**：把仅展示 AI Markdown 报告的 Rate 改造成「AI 双维报告 + 教师脚手架 + 在线同伴协商 + 反思叙事档案」四个可采集动作，构成社会建构闭环（C-16 至 C-20、主蓝图第 6.5 节）。
- **实现方法**：`app/components/Rate/index.vue`、`app/stores/rate.ts` 从单一文本报告拆分：① 按「诊疗 + 共情」输出结构化 W1 / W2 / W3 维度分与说明（改造 `app/assets/prompts/rate/prompt.md`），记录 `report.viewed`；② 标准化复盘模板（单次 ≤30 分钟）与 scaffolding 编码（追问 / 支架 / 元认知提示 / 情感支持 / 纠偏），写 `teacher_event`；③ 争议题同伴协商讨论区按批次隔离，发言与参与时长落 `discussion_post`；④ 反思叙事档案复用 `app/components/Narrative/Sheet.vue` 与 `app/utils/narrativeTemplates.ts` 作呈现载体，文本落 `reflection` 供盲态教师质性编码，明确不作确证结局。闭环完成后回到下一教学单元，B 臂累计 10 至 20 套由协议计数。Rate **不可纯算法评分**。

### 梯度 F · 多模态素材、量表、vOSCE 与教师轨

#### T-19 · 素材生命周期与 Blob 归档

- **目标**：把图像 / 视频 / 声音从「生成并展示」升级为标准化刺激素材，实现「生成 → 审核 → 冻结 → 按协议投放 → 归档」，大文件不入库（M-01、M-02、M-09、D-14、主蓝图第 7.5 节）。
- **实现方法**：`app/pages/multimodal/image.vue:56-58`、`app/stores/image.ts:22-27`（现仅存远程 URL）改造为素材实体：`media_asset` 表存 `type`（image / video / audio）、`usage`（training / assessment）、`blob_ref`、`content_hash`、`rubric_or_script_ref`、`frozen_at`、审核人、`model_run_id`；大文件上传到对象存储（Blob），库内只存元数据与引用；教师审核后冻结，冻结版本不可被重新生成覆盖；训练素材与 vOSCE 测评素材以 `usage` 强制隔离并在投放时校验（R-05）。为 EdgeOne Makers 的 Blob / KV 切换保留驱动抽象；注意平台无托管数据库、KV 仅 Edge Functions 可用且最终一致 60 秒，强一致状态不得放入 KV（附录 A 8.2、D2）。`app/pages/multimodal/video.vue` 的短片生成继续只用于训练期叙事情境。

#### T-20 · JSE-HPS 量表前后测与信度门控

- **目标**：建立态度层独立测量，中文版 20 题 7 点 Likert、10 题反向计分，前后测配对，并验证 α ≥0.80（D-06、Q-06、R-09、§8.1(1)）。
- **实现方法**：按附录 A 3.4 实现 `scale` / `scale_item` / `scale_response`，题目定义注明中文版出处与反向题号；学生端在 PRE / POST 窗口通过 `/api/research/scales` 呈现量表，按 `subject_id_hash + window_id` 配对前后测；服务端计算 `scored_value`（反向题反向计分）与总分，原始值一并留档；预试验计算 Cronbach's α，α ≥0.80 方可进入分析，未达标更换或修订量表版本并复测。量表保持独立，不因题目已融合能力项而取消。

#### T-21 · vOSCE 考站、录制与转录存档

- **目标**：建立行为层确证性测量：标准化视频触发器 + 学员回应录制 + 全程转录 + 盲态教师按 OS-12 / Calgary 中文版量规评转录稿（M-03、M-04、M-07、D-09、Q-04、R-06 / R-10）。
- **实现方法**：按分析文档 §8.9 起步方案②实现：`vosce_script` 存一次性录制的标准化患者片段（`form` = parallel A / B、`persona_config`、`media_ref`、`frozen_at`），入科 / 出科平行等价版本交叉平衡、全员复用；学生端用 `getUserMedia` + `MediaRecorder` 录制自身回应（视频或音频，当前全库无此能力），上传 Blob 并写 `vosce_session`（10 至 12 分钟、只考 W2 + W3）；语音转录优先评估 `ai` SDK Core 的 `transcribe`（以 `node_modules/ai/docs/03-ai-sdk-core/36-transcription.mdx` 为准，取决于 provider 是否提供转录模型），不可用则评估外部 ASR（待决 D4）；转录文本、分段时间戳、模型 / 版本、音频引用与 `content_hash` 落 `transcript`；`vosce_score` 由盲态教师填写，AI 只生成患者、不评分；平台与文案如实标注 vOSCE 及所用替代方式。vOSCE 人格、剧本、提示词与训练引擎完全解耦，两套入口不共用单例状态。

#### T-22 · 教师平行采集轨

- **目标**：让教师数据作为独立于学员「入科 → 出科」流程的并列采集轨，支撑 Q2 与论文 C（D-10、C-18、主蓝图第 4.5 节、§11）。
- **实现方法**：建 `teacher_event`（类型 `worktime_survey` / `weekly_log` / `debrief` / `scaffolding_code` / `review_workload` / `training` / `interview` / `platform_trace`，含 `duration_min`、`coding`、`occurred_at`）；在教师工作台提供工作时间结构问卷前后测、周工作量日志、培训参与、半结构化访谈 / 开放问卷入口；T-18 的复盘时长与 scaffolding 编码、T-13 的审核工作量、T-07 的操作留痕自动汇入同一轨；教师轨**不通过 `session` 关联学员流程**，可独立查询与单独导出，不依赖学员流程是否完成。

### 梯度 G · 导出锁库、统计门控与全链路集成

#### T-23 · 按月结构化导出与锁库只读

- **目标**：以结构化、脱敏、带数据字典与校验和的按月导出替代「页面截屏即证据」，并实现锁库后只读（D-11、E-04、E-08、附录 A 3.6 / 5.2）。
- **实现方法**：实现 `export_job` 与按月导出任务，按 `study_id + period` 分批导出脱敏结构化数据（CSV / JSON + 数据字典版本、行数、校验和），导出包入对象存储且可重跑结果一致；导出内容与 `protocol_version`、数据字典版本绑定；锁库后置 `locked_flag` 只读，任何变更走 `audit_log` 与版本化。现有 `app/components/Button/Capture.vue:57-110,316-404` 的 PNG / JPG / WebP / SVG / PDF 截屏明确标注为非研究证据，**不得**复用为数据导出。锁库动作在 T-24 门控全部通过后方可执行。

#### T-24 · 数据质量、一致性与统计门控

- **目标**：把方法学门控落成可执行的数据质量规则与统计准备，保证单一主要结局与结论边界（Q-06、Q-09、Q-10、E-07、附录 A 第 7 章）。
- **实现方法**：实现无效作答规则（时长过短、全同作答、限时窗口）按规则**标记**而非静默丢弃、缺失率 <5% 多重插补 / ≥5% 敏感性分析、ITT 与 PP 双分析集定义；导出前生成数据质量报告；按冻结 `rubric_version` 计算 X / Y 总分 0 至 100 与 W1 / W2 / W3 维度分，准备 ANCOVA（`Y ~ 臂 + X`）与 vOSCE 同构分析所需数据集，并输出人—人 ICC、AI—人 Pearson r / ICC / 加权 κ + Bland-Altman 与 JSE α；门控检查（ICC ≥0.75、α ≥0.80、统计计划已归档、单一主要结局、冻结清单齐备）未通过不得锁库；结论限定「CSTAR 程序效应」。统计代码建议独立模块 / 脚本，不写进页面组件，且不得在锁库后按结果调整权重或口径。

#### T-25 · 全链路集成、pilot 与配置化扩展

- **目标**：把前 24 项能力串成可运行的 PRE → ROTATION（仅 B 臂 10 至 20 套完整闭环）→ POST 全链路，通过 pilot（n≈10）门控，并让后续研究仅通过配置接入（主蓝图第 9 章、附录 B 阶段 2 ~ 5 与第 5 章验收清单）。
- **实现方法**：以 T-12 的协议上下文统一调度五模块与多模态能力，按窗口校验知情同意、随机分配、三库隔离、不暴露盲态字段；逐项执行附录 B 第 5.1 ~ 5.5 节可勾选验收清单并留可核验证据；按第 6 章冻结清单归档权重、量规、剧本、模型 / 提示词版本、素材哈希、统计计划；把研究差异收敛到 `study` / `protocol_version` 配置（新臂别、窗口、题库、量表、量规、persona、导出模板），新增研究只加配置与版本，不复制页面与表结构；补齐操作指南与师资培训材料入口；验证桌面端与移动端响应式、触摸友好与 Nuxt UI v4 语义色一致性。这是唯一横跨全部模块、且必须等待所有门控与外部决策落地后才能收尾的任务。

---

## 3. 依赖关键路径

按复杂度和依赖收敛为五条主链，实施时可并行推进不同链上互不依赖的任务：

| 链 | 路径 | 交付的能力 |
| --- | --- | --- |
| 基础链 | T-02 → T-04 → T-06 → T-07 → T-08 → T-09 | 数据可落库、可鉴权、可调用、可留痕 |
| 协议链 | T-05 → T-10 → T-11 → T-12 | 研究可配置、可随机化、可组卷、可按角色进入 |
| 闭环链 | T-13 → T-14 → T-17 → T-18 | CSTAR 五环节形成训练闭环 |
| 评分链 | T-15 → T-16，并汇入 T-20 / T-21 | 辅助评分、盲态双评、量表与行为层测量 |
| 治理链 | T-19 / T-22 → T-23 → T-24 → T-25 | 素材与教师轨归档、导出、门控、集成 |

**最小可跑通集合**：T-01 ~ T-12（对应附录 B 阶段 1，M2 前完成）＋ T-13 / T-14 / T-17 / T-18（阶段 2 的闭环主体）即具备 pilot 条件；T-21 与 T-24 依赖待决 D4 与冻结门控，允许按附录 A 第 7 章降级方案延后，但不得绕过「评分留人在环」红线。

---

## 4. 待决事项对任务的阻塞关系

| 待决 | 阻塞任务 | 说明 | 建议决策时点 |
| --- | --- | --- | --- |
| D1 · 部署形态与数据驻留（院内本地化 vs 云端） | T-06、T-07、T-19 | 决定驱动实现、加密与访问边界；决策前只做接口抽象、不写死云端实现 | 伦理审批前（2027Q1） |
| D2 · EdgeOne Makers 无托管数据库下的最终选型 | T-06、T-19、T-23 | 平台无托管 SQL，可选继续外接 Turso / Blob `setJSON` + 键前缀 / 院内本地化；影响索引、查询与导出策略 | 平台 v2 设计定稿前（2027H1） |
| D3 · 量规权重与统计计划的冻结责任人、时间与归档形式 | T-11、T-24 | 40 / 30 / 30 为示例值，须 2 名专家审定后冻结；未冻结不得进入分析 | 2027.06（M2）前 |
| D4 · 转录服务 provider 选型 | T-21 | `ai` SDK `transcribe` 可用性取决于 provider；否则评估外部 ASR，两者都须记录模型 / 版本 / 时间戳 | 2027H2（平台 v2 上线前） |

> 待决项结论应回写主蓝图第 9 章与附录 A、B 对应章节；本清单不预设结论，也不把 D1 / D2 未决作为跳过 T-04 / T-05 等不依赖部署形态任务的理由。

---

## 5. 验收与文档闭环

| 验收来源 | 用法 |
| --- | --- |
| 附录 B 第 5.1 ~ 5.5 节可勾选验收清单 | 作为每个任务的完成判据；T-25 逐项勾选并留可核验证据（导出记录、审计报告、冻结版本、pilot 报告） |
| 附录 B 第 6 章冻结与锁库清单 | 约束 T-11、T-13、T-19、T-21、T-23：冻结版本不可覆盖、锁库后只读 |
| 主蓝图第 8 章合规与质量红线 | 约束全部任务；R-01 ~ R-10 与 E-01 ~ E-08 为反向验收项 |
| 附录 B 第 4 章阶段路线图 | 控制放行节奏：阶段 1（T-01 ~ T-12）、阶段 2（T-13 ~ T-22）、阶段 3 ~ 5（T-23 ~ T-25） |
| 附录 B 第 7 章风险映射 | 关注 P-R5（迁移瑕疵，T-02）、P-R6（事件写入失败，T-09）、P-R7（persona 未解耦，T-17 / T-21）、P-R8（规划被误当实现） |

**边界复核**：本清单只描述目标状态与未来实施建议，不代表任何功能已实现；三份研究文档中的「现状」断言以附录 B 第 3 章核验表为准，`database-plan.md` / `data-architecture.md` / `project.md` 中的规划文字不得当作已实现能力。本次交付仅新增 `task.md`，其余文件零改动。
