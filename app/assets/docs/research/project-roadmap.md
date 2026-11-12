# urdoc 研究平台改造计划任务

## T-01 · 打通用户登录闭环（最高优先级）

**任务目标**：把现有半成品认证链路修成「可建表 → 可建账号 → 可登录 → 会话可保持 → 可登出 → 受保护页面需登录」的端到端闭环，作为本清单最高优先级、阶段 1 的首个可验收交付；范围只覆盖基础身份，不含角色 / RBAC 与盲态（T-07）、不含统一数据访问驱动（T-06）。

**意义**：`server/api/auth/login.post.ts`、`server/api/auth/logout.post.ts` 与 `app/pages/user/index.vue` 已有骨架，但 `server/db/migrations/001_users.sql:5` 行尾多余逗号使用户表建不出来、会话加密所需的 `NUXT_SESSION_PASSWORD` 未在本地环境配置、`app/stores/user.ts` 为全注释空壳，登录无法端到端验证；没有可信会话，T-07 的角色与盲态过滤、T-09 的脱敏主体与审计留痕都缺少身份锚点，后续研究数据无法归因。

**实现方法**：① 先把 T-02 的迁移修复作为前置步骤一并落地（编号表示优先级，T-01 不重复定义迁移任务），用 `runtimeConfig.turso` 凭据建 `users` 表并验证幂等，提供最小账号初始化路径（本地脚本或一次性 POST 接口），用 `hashPassword()` 写入 `password_hash`，禁止明文入库；② 在 `.env` 与 EdgeOne 部署环境变量补齐 `NUXT_SESSION_PASSWORD`（至少 32 字符），`turso` 凭据仍只由服务端 `runtimeConfig` 读取；③ 改造 `server/api/auth/login.post.ts:1-54`：`readValidatedBody` 配合 Zod 校验 `name` / `password`，`SELECT id, name, password_hash` 取代 `SELECT *`，401 统一为「用户名或密码错误」防用户名枚举，加失败限流与不含密码的登录审计，`setUserSession` 只存 `id` / `name`；④ 统一登出入口，`app/pages/user/index.vue:230-246` 改为调用 `server/api/auth/logout.post.ts` 的 POST 再 `fetchSession()` 刷新，并清除本地派生状态；⑤ 前端 `app/pages/user/index.vue:248-274` 登录成功后刷新会话并回跳原页面，补齐 SSR 首屏会话水合与加载 / 错误态，沿用 `UForm` + `UInput size="lg"` + `UAlert` 与手机端纵向布局，`app/components/App/Sidebar.vue:15-22` 入口按 `session` 显示「登录 / 用户名」；⑥ 新增 `app/middleware/` 下的鉴权中间件，用 `useUserSession()` 判定并在未登录时重定向到 `/user`，首页与文档页白名单放行，服务端 API 的 `requireUserSession` 加固与角色判定留给 T-07；⑦ 安全收口：`server/api/admin/hash.get.ts:1-11` 与 `server/api/admin/debug-verify.get.ts:1-68` 现以 GET query 传明文密码、无鉴权且回显哈希片段，改为仅本地开发可用或验收后下线；⑧ 验收清单为迁移幂等、账号初始化、正确 / 错误密码、刷新后会话保持、登出后受保护页重定向、桌面端与移动端可用、`pnpm build` 通过。`app/stores/user.ts` 保持现状不重建（由 T-07 按 `app/utils/store.ts` 的 `syncStoreVersion` 规范接入），本任务以 `useUserSession()` 为唯一登录态来源。

## T-02 · 修正用户表迁移脚本语法瑕疵

**任务目标**：让 `server/db/migrations/001_users.sql` 可被 `@libsql/client` 正确执行且可重复运行。

**意义**：`:5` 行尾多余逗号会使迁移执行失败，阻塞阶段 1 数据层建设；后续账号角色扩展与研究表迁移都以可执行迁移为前提。

**实现方法**：删除 `:5` 中 `password_hash TEXT NOT NULL` 行尾多余逗号；确认 `CREATE TABLE IF NOT EXISTS` 与 `CREATE INDEX IF NOT EXISTS` 幂等；用 `runtimeConfig.turso` 凭据连库执行或用 SQLite 解析做一次最小验证。本任务不扩展表结构，角色与盲态字段留给 T-07。

## T-03 · 注册研究计划任务到站内导航

**任务目标**：把 `project-roadmap.md` 作为研究平台改造计划的唯一入口注册到文档侧边栏，并清理已删除研究文档的导航链接。

**意义**：导航 slug 必须与 `app/assets/docs/` 下的实际文件名一致，否则站内链接打不开；本任务清单是当前唯一保留的研究文档，需要让实施与评审直接访问，避免只靠文件路径查找造成口径分散。

**实现方法**：在 `app/utils/docs.ts` 的 `docNav` 中把原研究文档分组替换为一条顶层导航项，`slug` 为 `research/project-roadmap`、`label` 为「研究平台改造计划」、`icon` 为 `i-lucide-clipboard-list`；移除三份已删除研究文档的导航项与失效的旧任务清单链接；`getDocTitle()`、`flattenDocNav()`、`generateDocSidebarItems()` 与 `import.meta.glob` 加载规则无需改动。

## T-04 · 新增研究域类型与 Zod schema

**任务目标**：把研究域模型落成可评审、可复用、可校验的类型契约，作为后续所有服务端与前端任务的共同语言。

**意义**：当前 `app/types/` 的 10 个文件全为内容域、研究域类型为 0；没有统一契约会导致各页面与路由各自定义字段，使数据字典口径漂移、协议驱动与 API 校验失去依据。

**实现方法**：在 `app/types/` 新增研究域类型文件（如 `research.ts` 或 `research/` 子目录按分组拆分），覆盖 `Study`、`ProtocolVersion`、`Arm`、`Window`、`Subject`、`Consent`、`Assignment`、`Account` / `Role`、`Session`、`ItemBank`、`Item`、`RubricVersion`、`Response`、`Score`、`Review`、`Scale` / `ScaleItem` / `ScaleResponse`、`VosceScript` / `VosceSession` / `VosceScore`、`Transcript`、研究侧 `Case` / `Story`、`Reflection`、`DiscussionPost`、`MediaAsset`、`ModelRun`、`TeacherEvent`、`AuditLog`、`ExportJob`；新增 `research.schema.ts`，用已装的 `zod` 定义 API 请求 / 响应 schema 并以 `z.infer` 推导类型，权重与枚举用 `z.literal` / `z.enum` 锁定。类型由 `nuxt.config.ts` 的 `imports.dirs` 自动扫描，不改动现有 10 个内容域类型文件。

## T-05 · 冻结常量与协议配置载体

**任务目标**：把研究设计中必须冻结的枚举、权重与事件名收敛到单一配置源，杜绝页面硬编码研究设计。

**意义**：格式等价校验、单一主要结局与权重锁库前冻结都依赖唯一权威取值；取值散落在页面中会让协议版本失效、统计分析前口径可变。

**实现方法**：新增 `app/constants/research.ts` 与 `server/utils/research/constants.ts`，以 `as const` 定义臂别 A / B、窗口 PRE / ROTATION / POST、题库标签 practice / X / Y、维度权重 W1 40 / W2 30 / W3 30、叙事冲突点清单、评分通道 `auto` / `llm_assist` / `human` / `arbitration`、scaffolding 编码枚举、研究事件名枚举。所有取值由协议或数据库注入，页面只读不写；T-11 把权重写入 `rubric_version` 后，以数据库冻结版本为权威，常量仅作兜底与类型约束。

## T-06 · 统一数据访问驱动与研究表迁移

**任务目标**：建立「研究数据全部落库」的物理基础，以可切换的驱动抽象隔离 Turso 与未来存储形态。

**意义**：现状只有登录接口直连 Turso，研究数据全在浏览器 localStorage，不能作为研究证据；部署形态与最终存储选型尚未决策，要求驱动抽象先行，且 EdgeOne Makers 无托管数据库、KV 最终一致 60 秒，随机化、评分、锁库等强一致状态不得放入 KV。

**实现方法**：复用 `app/assets/docs/development/database-plan.md:417-437` 的规划思路，新增 `server/db/index.ts` 暴露统一 `execute()` 与驱动工厂、`server/db/drivers/turso.ts` 从 `runtimeConfig.turso.{databaseUrl,authToken}` 读取凭据（仅服务端可读）、`server/utils/db.ts` 封装自动导入的 Repository；按研究域字段方向新增 `server/db/migrations/002_research_*.sql` 系列迁移，覆盖研究定义、身份伦理、窗口题库量规、作答评分复核、量表与 vOSCE、内容素材、教师轨、审计与导出各组表，并按 `subject_id_hash + window_id`、`batch + occurred_at`、`bank_tag` 建复合索引。一律参数化查询、不写死凭据；为 Blob / KV 切换预留驱动接口。

## T-07 · 账号角色、RBAC 与盲态中间件

**任务目标**：建立学生 / 教师 / 盲态评分者 / 管理员四类角色，并在服务端强制过滤盲态字段。

**意义**：盲态是内部效度与确证评分的前提；若只在前端隐藏臂别、身份、题库标签与 pre / post 时点，评分者可通过接口绕过，导致证据链被审稿质疑。

**实现方法**：扩展 `users` 表或新建 `account` / `role` 表，字段至少含 `role`、`is_teaching_faculty`、`scope`；沿用 `nuxt-auth-utils` 的 `setUserSession` / `getUserSession`（现状见 `server/api/auth/login.post.ts:46-51`），在 `server/middleware/` 新增鉴权与角色校验中间件；臂别、学员身份、题库标签、pre / post 时点在服务端剥离，评分接口只返回盲态字段集；重建 `app/stores/user.ts`（当前为全注释空壳），按 `app/utils/store.ts` 的 `syncStoreVersion` 规范接入。盲态评分视图须是独立页面 / 路由，不复用教师工作台的学情组件。

## T-08 · `/api/research/**` 路由骨架

**任务目标**：形成完整的研究 API 表面，让所有研究能力通过统一服务端入口读写。

**意义**：API 表面是事件批量写入、盲态过滤、导出审计与 Zod 校验的共同挂载点；缺它会导致页面直连数据库、各路由各自拼 SQL，研究数据口径无法统一。

**实现方法**：在 `server/api/research/` 下按 Nuxt 4 约定建路由，`*.get.ts` / `*.post.ts` 决定方法，动态参数用描述性名称（如 `[studyId].get.ts`，不用泛化 `[id].get.ts`）；使用 `defineEventHandler`、`getRouterParam`、`readValidatedBody` / `getValidatedQuery` 配合 T-04 的 Zod schema 校验、`createError` 统一错误响应。路由组覆盖 `studies` / `protocols`、`subjects` / `assignments`、`sessions`、`items` / `banks`、`responses`（POST 批量）、`scores` / `reviews`、`scales` / `vosce`、`media`、`teacher-events`、`exports` / `audit`。数据访问一律经 T-06 Repository；研究事件与评分不缓存，缓存只用于文档、静态字典等非研究数据。

## T-09 · 三类日志、事件批量写入与模型留痕

**任务目标**：落实「答题即数据」，把业务日志、研究事件日志、审计日志分离，并保证主要结局数据不丢、不重、可复现。

**意义**：逐题事件是主要结局、置信度校准、学习投入与机制分析的共同来源，不得以截屏、本地存储或事后补录替代；模型 / 提示词版本留痕保证刺激可复现；写入失败会直接造成主要结局缺失。

**实现方法**：新增 `server/utils/research/events.ts`，定义 `item.started`、`item.submitted`、`confidence.reported`、`story.read`、`dialogue.turn`、`report.viewed`、`reflection.submitted`、`discussion.posted` 等研究事件，以及 `content.approved`、`rubric.frozen`、`assignment.created`、`score.reviewed`、`export.generated`、`data.locked` 等审计动作；每个事件带 `event_id` 幂等键、`occurred_at`、脱敏主体、协议版本与模型 / 提示词版本引用。逐题事件由前端按会话或时间窗缓冲后批量提交，服务端用唯一约束去重并具备失败重试与补偿队列。在 `server/api/chat/` 与各多模态生成链路挂载 `model_run` 写入，记录模型 ID / 版本、温度、提示词模板版本（`app/utils/prompts.ts` 加载）、调用时间与输出哈希。

## T-10 · 协议冻结、随机化与知情同意

**任务目标**：让研究设计由 `study` / `protocol_version` 配置驱动，实现可审计的随机分配与合规入组。

**意义**：研究设计不得硬编码在页面；分配序列留痕防选择性分配；脱敏与知情同意是伦理底线，并决定 A 臂不接触训练、B 臂闭环套数可被计数验证。

**实现方法**：实现 `study` / `protocol_version` / `arm` / `window` 的注册与冻结，冻结后不可修改、只新增版本，统计计划归档引用 `protocol_id + version`；随机分配按轮转批次或个体生成 `assignment`，记录 `randomization_unit`、`sequence_no`、`assigned_at`、`operator_hash`；入组时生成不可逆 `subject_id_hash`，姓名 / 学号不入库、不出平台；`consent` 记录版本、`signed_at`、`voluntary` 与用途限定（答题数据不与出科成绩 / 个人评价挂钩）。协议层强制 A 臂不接触任何 CSTAR 训练入口，B 臂闭环套数（10 至 20）由协议计数并作为完成标记。

## T-11 · 三套隔离题库、冻结量规与 A/B 等价校验

**任务目标**：把格式等价红线与干预 / 测评分离变成服务端可执行约束，保证三库互不重叠、权重冻结。

**意义**：三库隔离防背题与练习量混淆；A / B 题型组合一致才能把 B−A 归因于教学法而非卷面格式；权重锁库前冻结避免多重比较与 p-hacking。

**实现方法**：建 `item_bank`（`bank_tag` = practice / X / Y，练习库带 `is_excluded_from_assessment`）与 `item`（`type` = choice / short_answer / dialogue、`dimension` = W1 / W2 / W3、`criterion_refs`、`equivalent_pair_id`、`content_hash`）；`rubric_version` 由 2 名专家审定后冻结，权重 W1 40 / W2 30 / W3 30 与 criterion 在锁库前定稿、之后只新增版本；组卷服务在服务端校验 A / B 题型组合、题量与 rubric 一致性（唯一允许差异为 B 的 Story 叙事层与线上闭环），并用 `content_hash` 校验出科 Y 未出现在练习库与入科 X；讨论区按批次隔离防透题。任一校验失败以 `createError` 阻止投放，不做静默降级。

## T-12 · 协议上下文注入与三页面骨架

**任务目标**：把三个 `project` 页建成按角色分工的视图与流程入口，通过同一协议调用能力层，避免三处重复实现。

**意义**：入口层只做视图与流程调度、能力层被训练与测评以不同参数复用；学生端不暴露臂别、题库标签、标准答案与他人作答，是盲态与防污染约束在 UI 层的落实；`record.order` 必须保持内容编排语义而非实验流程。

**实现方法**：新增 `app/composables/useStudyProtocol.ts` 与 `app/stores/study.ts`（按 `syncStoreVersion(VERSION, 'pinia:study')` 规范），从 `/api/research/protocols` 读取当前冻结版本，向五个 CSTAR 页与多模态页注入病种、难度、叙事冲突、窗口、题库标签与臂别可见性。`narrative-medicine.vue` 保留现有 `NarrativeSheet` 与 `app/utils/narrativeTemplates.ts` 作为叙事素材创作子能力，新增理论框架、研究总览、叙事医学能力地图与证据链地图（只显示脱敏聚合视图）；`pedagogical-research.vue` 搭教师工作台骨架（冲突设计、审核队列、量规冻结、学情分析、复盘脚手架、同伴协商、教师采集、师资培训入口，先用占位区块，再由 T-13 / T-16 / T-18 / T-22 填充）；`clinical-simulation.vue` 按 PRE / ROTATION / POST 窗口组织导航，服务端保证不暴露臂别、题库标签、标准答案、AI 辅助评分与他人作答。`app/stores/record.ts` 的 8 步 `order` 保持不变。

## T-13 · Case / Story 结构化参数与人工审核冻结

**任务目标**：把 AI 生成内容纳入「草稿 → 待审核 → 已冻结」生命周期，教师对临床准确性与人文真实性承担人工在环审核。

**意义**：AI 幻觉导致医学事实错误是课题核心风险，医学事实性错误零容忍；审核留痕与冻结版本不可覆盖是可复现与合规要求；叙事冲突点与 W2 / W3 的显式映射支撑格式等价。

**实现方法**：`app/components/Case/index.vue:104-154,458-478` 现有生成 / 校验 / 自动更正 / 手工编辑链路接教师参数（病种、难度、冲突点），结果落 `case` / `story` 表并置 `review_status`；把 `app/assets/prompts/case/verify.md` 的「AI 自校验」升级为教师审核清单（临床事实、去标识化、避免偏见），审核人 / 结论 / 时间 / 版本写 `audit_log`，一键纠错全量留痕。`app/components/Story/Content.vue` 四 Tab 保留 AI 示范材料，冲突点从 T-05 清单选取并与 W2 / W3 建立显式映射，A 组「去叙事基础版」与 B 组「叙事情境版」共用题型组合与 rubric；`app/components/Conversation/`、`Discussion/`、`Comment/` 三个容器组件区分「AI 生成示范」与「真人同伴协商」，后者由 T-18 落库。冻结版本在采集期禁止重新生成覆盖。

## T-14 · Test 三类题型与逐题事件采集

**任务目标**：把 Test 从「独立选择题前测」改造为 Case + Story 之后循环内的形成性评估与主要数据来源，实现「答题即数据」。

**意义**：这是研究设计中最重要的定位修正：Test 是循环内形成性评估与主要数据来源，不是前测；逐题作答、用时、置信度 1 至 5、修改次数是主要结局、置信度校准与学习投入分析的共同来源，不得以截屏或本地存储替代。

**实现方法**：扩展 `app/types/test.ts` 与 `app/stores/test.ts:117-142`，支持单选 / 多选（客观题）、简答 / 短文（主观题）、AI 患者对话子题同卷组合，每题带 `dimension`、`criterion_refs`、`bank_tag`；`app/components/Test/index.vue:59-112` 增加逐题开始 / 提交时间、`duration_ms`、置信度 1 至 5、修改次数采集，按会话批量提交到 `/api/research/responses`（幂等 `event_id`），非逐题实时请求；协议强制 Case → Story → Test 时序，Test 完成后才进入 Act 与 Rate；客观题保留现有自动判分但改为按维度与冻结权重合成 0 至 100 总分；置信度校准（平均置信度 − 正确率）作为次要结局，计算交给 T-24。

## T-15 · LLM 辅助评分通道

**任务目标**：为主观题与对话子题建立可复现的 LLM 辅助评分，并明确其不得单独作为确证证据。

**意义**：用 AI 自动评分替代人工确证评分属本期明确不做；但 LLM 辅助分是人机一致性分析与评分效率所需，必须以通道标记与人工共识分严格隔离。

**实现方法**：基于 `server/api/chat/providers/aisdk.ts` 的 `generateText` 配合 `output: Output.object(...)` 与 Zod schema（以 `node_modules/ai/docs/03-ai-sdk-core/10-generating-structured-data.mdx` 为准），按冻结 criterion 输出维度分与理由；新增 `app/assets/prompts/score/` 模板或改造 `app/assets/prompts/rate/prompt.md`，由 `app/utils/prompts.ts` 加载并记录模板版本；评分写 `score` 时标注 `channel = llm_assist` 并关联 `model_run`。确证分析只采用人工共识分或仲裁分，须在评分服务与导出口径中显式过滤。

## T-16 · 盲态双评、仲裁与一致性统计

**任务目标**：实现 2 名非授课教师网络双评、分歧第三人仲裁，以及 ICC ≥0.75 门控与人机一致性报告。

**意义**：确证评分必须留人在环；人—人 ICC 与 AI—人 Pearson r / ICC / 加权 κ + Bland-Altman 必须同时报告，未达标须降级为「AI 辅助、人工主导」，否则结论可信度不成立。

**实现方法**：建 `review` 任务分派，评分者角色为 `blind_rater`，`blinded_fields` 由 T-07 的服务端过滤保证；双评分歧超阈值触发 `arbitration` 通道；实现 `server/utils/research/agreement.ts`（或独立分析模块），同时计算人—人 ICC 与 AI—人 Pearson r / ICC / 加权 κ + Bland-Altman；ICC ≥0.75 方可进入分析，未达标降级为「AI 辅助、人工主导」并写决策记录。评分界面为独立路由，不复用教师工作台学情信息；评估者校准记录与仲裁记录留审计。

## T-17 · Act 压缩为对话子题并解耦 persona

**任务目标**：把独立自由问诊引擎压缩为答题内 1 至 2 轮 AI 患者对话子题，并使训练 persona 与 vOSCE 测评 persona 完全独立。

**意义**：把 Act 当作独立实时问诊会造成测量口径漂移，其定位应为答题内 1 至 2 轮对话子题；人格、剧本与训练引擎解耦可防练习效应与光环效应，保障 vOSCE 构造效度。

**实现方法**：`app/components/Act/index.vue:51-102,138-148,241-359` 保留自由问诊作为训练期可选素材生成能力（不作主要数据来源），新增「答题内短对话子题」模式：限制轮次、固定 persona；`app/components/Act/quiz.vue:42-59` 的得分改为按 0 至 9 分 rubric（共情确认 / 信息准确 / 决策共享 / 纠偏不贬低 / 针对恐惧记忆）计入 W3；复用 `app/composables/useChatApi.ts` 的 `Chat` + `DefaultChatTransport` + `/api/chat`，但为 vOSCE 另建独立会话与 `persona_config`，不复用训练单例状态；全量对话以 `dialogue.turn` 事件落 `transcript` 表并归档，供盲态复评与答辩质证。

## T-18 · Rate 拆为四个可采集动作

**任务目标**：把仅展示 AI Markdown 报告的 Rate 改造成「AI 双维报告 + 教师脚手架 + 在线同伴协商 + 反思叙事档案」四个可采集动作，构成社会建构闭环。

**意义**：Rate 不可纯算法评分是本研究最重要的模型修正之一；四个动作分别产出过程数据、教师轨行为编码、同伴协商与质性探索性证据，其中反思叙事档案明确不作确证结局。

**实现方法**：`app/components/Rate/index.vue`、`app/stores/rate.ts` 从单一文本报告拆分：① 按「诊疗 + 共情」输出结构化 W1 / W2 / W3 维度分与说明（改造 `app/assets/prompts/rate/prompt.md`），记录 `report.viewed`；② 标准化复盘模板（单次 ≤30 分钟）与 scaffolding 编码（追问 / 支架 / 元认知提示 / 情感支持 / 纠偏），写 `teacher_event`；③ 争议题同伴协商讨论区按批次隔离，发言与参与时长落 `discussion_post`；④ 反思叙事档案复用 `app/components/Narrative/Sheet.vue` 与 `app/utils/narrativeTemplates.ts` 作呈现载体，文本落 `reflection` 供盲态教师质性编码。闭环完成后回到下一教学单元，B 臂累计 10 至 20 套由协议计数。

## T-19 · 素材生命周期与 Blob 归档

**任务目标**：把图像 / 视频 / 声音从「生成并展示」升级为标准化刺激素材，实现「生成 → 审核 → 冻结 → 按协议投放 → 归档」，大文件不入库。

**意义**：刺激标准化可复现、训练与测评素材不共用、AI 生成内容经教师审核冻结，是 vOSCE 构造效度与合规要求；大素材入库会拖垮数据库查询与按月导出。

**实现方法**：`app/pages/multimodal/image.vue:56-58`、`app/stores/image.ts:22-27`（现仅存远程 URL）改造为素材实体：`media_asset` 表存 `type`（image / video / audio）、`usage`（training / assessment）、`blob_ref`、`content_hash`、`rubric_or_script_ref`、`frozen_at`、审核人、`model_run_id`；大文件上传到对象存储（Blob），库内只存元数据与引用；教师审核后冻结，冻结版本不可被重新生成覆盖；训练素材与 vOSCE 测评素材以 `usage` 强制隔离并在投放时校验。为 EdgeOne Makers 的 Blob / KV 切换保留驱动抽象，注意平台无托管数据库、KV 仅 Edge Functions 可用且最终一致 60 秒，强一致状态不得放入 KV。`app/pages/multimodal/video.vue` 的短片生成继续只用于训练期叙事情境。

## T-20 · JSE-HPS 量表前后测与信度门控

**任务目标**：建立态度层独立测量，中文版 20 题 7 点 Likert、10 题反向计分，前后测配对，并验证 α ≥0.80。

**意义**：JSE-HPS 与 vOSCE 必须作为独立量表保留，不得因题目已融合能力项而取消；它是「表现—态度—行为」三源互证的态度层，α 门控保证信度。

**实现方法**：实现 `scale` / `scale_item` / `scale_response` 三张表，题目定义注明中文版出处与反向题号；学生端在 PRE / POST 窗口通过 `/api/research/scales` 呈现量表，按 `subject_id_hash + window_id` 配对前后测；服务端计算 `scored_value`（反向题反向计分）与总分，原始值一并留档；预试验计算 Cronbach's α，α ≥0.80 方可进入分析，未达标更换或修订量表版本并复测。

## T-21 · vOSCE 考站、录制与转录存档

**任务目标**：建立行为层确证性测量：标准化视频触发器 + 学员回应录制 + 全程转录 + 盲态教师按 OS-12 / Calgary 中文版量规评转录稿。

**意义**：vOSCE 是三源互证的行为层主测量，AI 只生成患者、不评分；全程转录 / 录像归档与如实命名 vOSCE 及替代方式，是盲态复评、答辩质证与审稿要求。

**实现方法**：按视频触发器方案实现：`vosce_script` 存一次性录制的标准化患者片段（`form` = parallel A / B、`persona_config`、`media_ref`、`frozen_at`），入科 / 出科平行等价版本交叉平衡、全员复用；学生端用 `getUserMedia` + `MediaRecorder` 录制自身回应（视频或音频，当前全库无此能力），上传 Blob 并写 `vosce_session`（10 至 12 分钟、只考 W2 + W3）；转录优先评估 `ai` SDK 的 `transcribe`（可用性取决于所选 provider，选型需先确认），无论采用哪种方案都记录模型 / 版本 / 时间戳，转录文本、分段、音频引用与 `content_hash` 落 `transcript`；`vosce_score` 由盲态教师填写，每项附 1 至 2 句叙事反馈。vOSCE 人格、剧本、提示词与训练引擎完全解耦，两套入口不共用单例状态。

## T-22 · 教师平行采集轨

**任务目标**：让教师数据作为独立于学员「入科 → 出科」流程的并列采集轨。

**意义**：支撑教师角色转型研究，教师数据不依赖学员流程是否完成；标准化复盘与自动化采集可缓解教师新增的复盘 / 协商负担。

**实现方法**：建 `teacher_event`（类型 `worktime_survey` / `weekly_log` / `debrief` / `scaffolding_code` / `review_workload` / `training` / `interview` / `platform_trace`），含 `duration_min`、`coding`、`occurred_at`，不通过 `session` 关联学员流程；工作台提供工作时间结构问卷前后测、周工作量日志、培训参与、审核工作量、半结构化访谈 / 开放问卷入口；T-18 的复盘时长与 scaffolding 编码、T-07 的平台操作留痕自动汇入同一轨；教师轨可独立查询与单独导出。

## T-23 · 按月结构化导出与锁库只读

**任务目标**：以结构化、脱敏、带数据字典与校验和的按月导出替代「页面截屏即证据」，并实现锁库后只读。

**意义**：中期检查、结题材料与 ANCOVA 数据准备都需要可复现的结构化数据；锁库后只读与导出包版本绑定，防止按结果调整口径，并满足结题后保存 5 年的留存要求。

**实现方法**：实现 `export_job` 与按月导出任务，按 `study_id + period` 分批导出脱敏数据，附数据字典版本、行数与校验和，导出包入对象存储 + 任务记录；失败可重跑且结果一致。锁库置 `locked_flag` 后只读，任何变更走 `audit_log` 与版本化。`app/components/Button/Capture.vue:57-110,316-404` 的 PNG / JPG / WebP / SVG / PDF 截屏明确标注为非研究证据；数据保留期限写入治理配置。

## T-24 · 数据质量、一致性与统计门控

**任务目标**：把方法学门控落成可执行的数据质量规则与统计准备，保证单一主要结局与结论边界。

**意义**：无效作答剔除、缺失处理、ITT / PP 双分析集与统计计划归档是研究设计的硬要求；ICC ≥0.75、α ≥0.80、统计计划已归档、冻结清单齐备未通过不得锁库；结论限定「CSTAR 程序效应」防过度归因。

**实现方法**：实现无效作答规则（时长过短、全同作答、限时窗口）按规则标记而非静默丢弃、缺失率 <5% 多重插补 / ≥5% 敏感性分析、ITT 与 PP 双分析集；准备 ANCOVA（`Y ~ 臂 + X`）数据集并输出人—人 ICC、AI—人 Pearson r / ICC / 加权 κ + Bland-Altman、JSE α 与置信度校准（平均置信度 − 正确率）；门控检查（ICC、α、统计计划归档、冻结清单齐备）未通过不得锁库。统计代码建议独立模块 / 脚本，不写进页面组件，且不得在锁库后按结果调整权重或口径。

## T-25 · 全链路集成与配置化扩展

**任务目标**：把前 24 项能力串成可运行的 PRE → ROTATION（仅 B 臂 10 至 20 套完整闭环）→ POST 全链路，并让后续研究通过配置接入。

**意义**：一课题多文、共用数据底座要求研究差异收敛到 `study` / `protocol_version`，新增研究只加配置与版本、不复制页面与表结构；这是唯一横跨全部模块、且必须等待门控与外部决策落地后才能收尾的任务。

**实现方法**：按窗口校验知情同意、随机分配、三库隔离、盲态字段过滤与闭环计数，逐项执行验收清单并留可核验证据（导出记录、审计报告、冻结版本、pilot 报告）；按冻结清单归档权重、量规、剧本、模型 / 提示词版本、素材哈希与统计计划；把新臂别、窗口、题库、量表、量规、persona、导出模板收敛为协议配置；补齐操作指南与师资培训材料入口；验证桌面端与移动端响应式、输入控件触摸友好与 Nuxt UI v4 语义色一致性。

## T-26 · 研究方案评审、待决事项决策与伦理合规准备

**任务目标**：完成研究方案评审，就部署形态与数据驻留、最终存储选型、量规权重与统计计划冻结责任人、转录服务 provider 选型形成书面结论，取得伦理与合规边界确认，并完成存储驱动抽象的技术验证。

**意义**：部署形态与数据驻留、最终存储选型未决会阻塞 T-06、T-07、T-19 的实现口径；研究要求院内本地化部署，与 Turso / EdgeOne 云端形态存在冲突，须由伦理与数据合规方在正式采集前确认，否则后续返工。

**实现方法**：组织课题负责人、方法学顾问与平台负责人评审本任务清单，形成评审记录；就上述四项待决分别形成书面决策并归档；提交伦理申请与知情同意文本，明确自愿参与、非授课教师招募、答题数据不与出科成绩 / 个人评价挂钩；在决策前只做驱动接口抽象与最小技术验证，不写死云端实现。

## T-27 · 师资培训与 pilot 预试验

**任务目标**：完成师资培训，并以 n≈10 的 pilot 跑通完整闭环与全部质量门控，形成 pilot 报告。

**意义**：2027.12 平台 v2 上线与 pilot 是放行节点；pilot 用于验证 ICC ≥0.75、α ≥0.80、闭环时序、盲态双评与导出链路，未达标须修订方案后再进入正式采集。

**实现方法**：开展提示工程、双重质量把关、AI 双维报告解读、过程性点评与标准化复盘工作坊；用 pilot 批次依次跑通知情同意 → 入科 PRE（基线 X、JSE-HPS 前测、vOSCE 入科站）→ B 臂完整闭环 → 出科 POST（全新 Y、JSE 后测、vOSCE 出科站）→ 盲态双评 → 按月导出；记录评估者校准、双评分歧率、事件写入失败率与冻结版本，形成 pilot 报告与方案修订清单；pilot 与 AB / BA 交叉敏感性分析结果并入主报告，但不改变主设计。

## T-28 · 正式采集与按月质控

**任务目标**：按单中心平行两臂随机准实验完成正式采集，计划入组 ≈118、有效平行样本 ≥94，并按月导出与质控。

**意义**：这是主要结局 ANCOVA（`Y ~ 臂 + X`）的样本与数据基础；按月导出与质控能及时发现样本不足、透题污染、评估者漂移与事件写入失败。

**实现方法**：按轮转批次入组并随机分配，A 臂常规轮转不干预，B 臂完成 10 至 20 套 CSTAR 完整闭环；入科 X、出科全新 Y 两组同测，JSE-HPS 与 vOSCE 前后测并行；按月执行 T-23 导出并核对行数与校验和，监控事件写入失败率与积压、无效作答与缺失率、双评分歧率、审核队列积压；讨论区按批次隔离防透题；样本不足时延长采集窗并如实报告功效局限；按期完成中期检查。

## T-29 · 数据锁定、分析与结题成果

**任务目标**：锁库后完成主分析与一致性分析，产出论文素材、结题材料与后续研究配置接入。

**意义**：2028.08 数据锁定后只读、统计计划已归档是结论可信的前提；结题硬条件为 ≥1 篇中文知网收录教改论文、1 项 2027 年内取得采纳证明的教改方案、1 套优质数字教学资源；结论须限定为「CSTAR 程序效应」。

**实现方法**：核对冻结清单与统计计划归档后置只读标志，任何变更走审计；执行 ANCOVA 主分析（控基线 X）、ITT / PP 双分析集、人—人 ICC 与 AI—人一致性、vOSCE 同构分析、置信度校准与反思文本质性编码；修订《分步实施手册》与量表；整理框架、实证、教师转型、可选 vOSCE 方法学四类论文共用数据底座的素材；归档平台功能包、病例题库与操作指南作为数字教学资源，取得学校采纳证明；按 T-25 的协议配置接入后续研究方向，完成结题验收与应用满 1 年要求。
