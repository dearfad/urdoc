# 叙事医学显示模板开发指南

叙事医学单页（路由 `/project/narrative-medicine`）支持多套显示模板。模板可以只更换视觉（配色、字体、间距、装饰），也可以重排区块布局；**区块集合、数据来源、生成流程、显示开关与截屏行为始终不变**。

## 架构概览

```
app/pages/project/narrative-medicine.vue     页面编排：控制区 + 截屏按钮 + <NarrativeSheet>
app/composables/
  ├─ useNarrativeViewModel.ts               业务 store → 纯视图数据 NarrativeSheetData
  └─ useNarrativeGenerator.ts               生成编排（与模板无关）
app/components/Narrative/
  ├─ Sheet.vue                              唯一结构骨架，根节点 #nm-sheet
  ├─ Section.vue                           单个区块（线性 / 分组布局共用）
  ├─ BlockCard.vue                         区块卡片壳
  ├─ TemplatePicker.vue                    模板选择器（#nm-sheet 之外）
  ├─ SettingsPopover.vue                   生成 / 显示开关
  └─ blocks/*.vue                          病例、故事、对话、讨论、点评
app/types/narrative.ts                      模板契约与视图数据类型
app/utils/narrativeTemplates.ts             模板注册表（元数据 + 可选 layout）
app/utils/narrativeSections.ts               区块清单与设定项
app/stores/narrative.ts                     generate / show / templateId 持久化
app/assets/css/narrative/
  ├─ index.css                              样式聚合入口
  ├─ base.css                              结构样式、派生规则、打印规则
  └─ templates/*.css                        每套模板一份令牌 / 布局 CSS
```

数据流：`NarrativeSheetData` → 唯一 DOM 结构。模板只做两件事：

1. 在 `#nm-sheet` 上写入 `data-nm-template`，由对应 CSS 注入 `--nm-*` 变量；
2. 若注册表中声明了 `layout`，把区块分到不同的 `data-nm-area` 区域容器，由模板 CSS 定位。

切换模板不进入视图数据的 `computed` 依赖链，不触发数据重算、网络请求或生成流程重启。

## 现有模板

| id | 名称 | 视觉 | 布局 |
|---|---|---|---|
| `magazine` | 叙事杂志（默认） | 暖粉渐变、衬线刊名、五色卡片、柔光装饰 | 线性单列 |
| `clinical` | 病历档案 | 石板蓝灰、编号刊头、左侧竖线 accent、无动效 | 线性单列 |
| `editorial` | 编辑网格 | 米白纸面、墨黑粗线、硬阴影、编号水印、竖排刊名 | 左侧病例跨两行，右侧故事 / 对话堆叠，底部讨论 / 点评并排 |

## 新增一套纯视觉模板

只需 3 步，不需要改动任何 Vue 组件。

### 1. 新建令牌 CSS

在 `app/assets/css/narrative/templates/` 下新建 `<id>.css`。变量要同时挂在 `.nm-page`（页面背景）与 `.nm-sheet`（截屏根节点）上：

```css
:is(.nm-page, .nm-sheet)[data-nm-template='my-theme'] {
  --nm-page-bg: #f1f5f9;
  --nm-paper-from: #ffffff;
  --nm-paper-to: #ffffff;
  --nm-sheet-shadow: 0 8px 24px -12px rgb(15 23 42 / 18%);
  --nm-sheet-ring: rgb(148 163 184 / 35%);
  --nm-sheet-radius: 8px;

  --nm-title-bg: none;
  --nm-title-color: #0f172a;
  --nm-text: #334155;
  --nm-gap: 1rem;
  --nm-card-bg: #ffffff;
  --nm-card-radius: 8px;
  --nm-accent-height: 3px;
  --nm-decor-opacity: 0;

  /* 5 组区块主色，每组 from / via / to / tone 共 4 个值 */
  --nm-case-from: #475569;
  --nm-case-via: #64748b;
  --nm-case-to: #475569;
  --nm-case-tone: #334155;
  /* story / conversation / discussion / comment 同理 */
}
```

`base.css` 会通过 `[data-nm-section]` 把 `--nm-(case|story|conversation|discussion|comment)-*` 映射为统一的 `--nm-accent-*`，再用 `color-mix()` 派生卡片浅底、边框、气泡、徽标与图标颜色。因此一套模板只需给出这 5 组主色，不必逐个区块写样式。

变量未定义时会回退到 `base.css` 中 `var(--nm-x, 默认值)` 里的默认值，可按需只覆盖部分令牌。

### 2. 引入样式

在 `app/assets/css/narrative/index.css` 追加一行：

```css
@import './templates/my-theme.css';
```

`main.css` 已引入 `index.css`，无需改动 `nuxt.config.ts`。所有模板样式随应用一次性加载，切换只改根节点一个属性。

### 3. 注册模板

在 `app/utils/narrativeTemplates.ts` 的 `NARRATIVE_TEMPLATES` 追加一项：

```ts
{
  id: 'my-theme',                          // 必须与 data-nm-template 一致
  label: '我的版式',                        // 选择器显示名
  description: '风格简述',
  icon: 'i-lucide-palette',                 // i-lucide-* 图标名
  swatch: ['#334155', '#0f766e'],           // 选择器色卡起止色
}
```

注意：

- `id` 使用 `string` 而非联合类型，扩容无需改类型；`resolveNarrativeTemplate()` 会把本地存储脏值或已下线 id 回退到注册表第一项。
- 默认模板固定为 `NARRATIVE_TEMPLATES[0]!.id`，**不要随意调整数组顺序**，否则会改变默认版式。
- 仅新增模板不需要改 store，也不需要提升 `VERSION`。

## 新增一套重排布局的模板

在注册表项中追加可选的 `layout`：

```ts
{
  id: 'my-grid',
  // ...其余元数据
  layout: {
    areas: [
      { key: 'case', blocks: ['case'] },
      { key: 'story', blocks: ['story'] },
      { key: 'conversation', blocks: ['conversation'] },
      { key: 'discussion', blocks: ['discussion', 'comment'] }, // 一个区域可放多个区块
    ],
  },
}
```

- `areas[].key` 会输出为 `data-nm-area`，供模板 CSS 定位；
- `blocks` 使用 `NarrativeSectionKey`，同一区域内按声明顺序纵向排列；
- 整组区块都被显示开关关闭时，该区域会被自动移除，网格不会留下空洞；
- 未声明 `layout` 的模板走线性单列分支，行为与新增能力之前完全一致。

然后在模板 CSS 里定义网格：

```css
.nm-sheet[data-nm-template='my-grid'] .nm-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  grid-auto-flow: row dense;
  align-items: stretch;
  gap: var(--nm-gap);
}
.nm-sheet[data-nm-template='my-grid'] .nm-layout-area[data-nm-area='case'] {
  grid-column: 1;
  grid-row: span 2;
}
```

`base.css` 已让 `.nm-layout-area > .nm-block` 撑满区域高度，卡片也会填满所在网格区域，左右两列自动对齐。

### 移动端与打印

- 手机端必须在 `@media (max-width: 639px)` 中把网格改回单列、复位 `grid-column` / `grid-row`，否则两列在窄屏不可读；
- 打印时建议把 `.nm-layout` 改回 `display: block`，按 DOM 顺序线性输出，并移除硬阴影；
- 通用打印规则已在 `base.css` 中收敛到 `.nm-page` / `#nm-sheet`，新增模板不要写全站级 `html, body` 规则。

## 常用令牌

| 分组 | 变量 | 作用 |
|---|---|---|
| 纸张 | `--nm-page-bg`、`--nm-paper-from/to`、`--nm-sheet-shadow/ring/radius` | 页面背景与单页纸张 |
| 刊头 | `--nm-title-bg/color/font/weight/tracking`、`--nm-nameplate-*`、`--nm-sheet-kicker` | 疾病名、刊名；kicker 默认隐藏，需模板 CSS 显示 |
| 装饰 | `--nm-decor-opacity`、`--nm-decor-1/2/3` | 光晕，设为 `0` 可整体关闭 |
| 文本 | `--nm-text`、`--nm-title-strong`、`--nm-muted`、`--nm-md-text` | 正文、标题、次要文字、Markdown 正文 |
| 卡片 | `--nm-gap`、`--nm-card-bg/blur/radius/border-width/border-color/head-bg/head-border/shadow` | 卡片容器与间距 |
| 区块 | `--nm-{区块}-from/via/to/tone` | 5 组主色，派生所有局部颜色 |
| 色条 | `--nm-accent-width/height/angle/opacity` | 顶部渐变色条，或改成左侧竖线 |
| 细节 | `--nm-icon-radius/shadow`、`--nm-badge-radius`、`--nm-block-number*`、`--nm-avatar-*`、`--nm-illus-*` | 图标、徽标、编号水印、头像、插图 |
| 动效 | `--nm-page-anim`、`--nm-block-anim`、`--nm-avatar-anim` | 设为 `none` 即关闭 |
| 控制区 | `--nm-control*`、`--nm-control-btn-*` | 页面顶部输入与按钮（在单页之外） |
| 页脚 | `--nm-footer-line/text` | 页脚装饰 |

区块编号水印通过 `--nm-block-number: '01'` 一类字符串值启用，`base.css` 的 `.nm-block::before` 负责渲染，默认不显示。

## 关键约束

1. **模板属性必须挂在 `#nm-sheet` 根节点**。`ButtonCapture` 用 snapdom 克隆的是 `#nm-sheet` 子树，祖先节点上的 CSS 变量不会进入克隆结果；把变量只放在页面外层容器会导致截图退化为默认样式。
2. **模板选择器与截屏按钮必须位于 `#nm-sheet` 之外**，否则会被截进导出图片。
3. **不要把区块显隐绑定到模板**。显隐由 `useNarrativeStore.show` 计算出的 `showPlan` 决定，模板只负责排列与绘制。
4. **样式文件是全局 CSS**，不能使用 Vue SFC 专有的 `:deep()` / `:global()`；Markdown 正文改用普通后代选择器（如 `.nm-md p`）。
5. **所有选择器限定在具体模板下**（`[data-nm-template='...']`），避免影响其它模板与其它页面。`@keyframes` 等全局名称也应加 `nm-` 前缀。
6. **改动 store 字段需提升 `VERSION`**。`useNarrativeStore` 通过 `syncStoreVersion(VERSION, 'pinia:narrative')` 迁移，版本变化会清空一次整个 localStorage 键，用户的生成 / 显示设定会回到默认值。仅新增模板不涉及此项。
7. **新增区块不属于模板职责**。区块清单在 `app/utils/narrativeSections.ts` 的 `NARRATIVE_BLOCKS`，改动会同时影响所有模板、设定项与生成计划。

## 验证清单

- `pnpm build`
- 页面点「模板」逐套切换，检查刊头、卡片、页脚与区块位置
- 关闭部分区块后检查网格无空洞、左右列高度对齐
- 手机端（< 640px）单列可读
- 截屏导出与浏览器打印预览
- 刷新后模板选择仍被记住

## 相关文件速查

| 目的 | 文件 |
|---|---|
| 注册 / 下线模板 | `app/utils/narrativeTemplates.ts` |
| 模板契约与布局类型 | `app/types/narrative.ts` |
| 令牌与结构样式 | `app/assets/css/narrative/base.css` |
| 模板样式入口 | `app/assets/css/narrative/index.css` |
| 现有模板参考 | `templates/magazine.css`、`clinical.css`、`editorial.css` |
| 布局分组渲染 | `app/components/Narrative/Sheet.vue` |
| 持久化默认值 | `app/stores/narrative.ts` |
| 区块清单 | `app/utils/narrativeSections.ts` |
