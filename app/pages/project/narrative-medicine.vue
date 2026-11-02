<template>
  <UDashboardPanel
    id="pages-project-narrative-medicine"
    class="bg-linear-to-br from-amber-50/40 via-rose-50/40 to-cyan-50/40"
  >
    <template #body>
      <div class="min-h-full w-full overflow-auto py-6 sm:py-8 md:py-10">
        <!-- 截屏按钮：内容页右上角（位于被截取元素之外，避免截图中包含按钮） -->
        <div class="mx-auto mb-2 flex w-full max-w-4xl justify-end px-3 sm:px-4">
          <ButtonCapture capture-id="nm-sheet" label="截屏" />
        </div>
        <div class="mx-auto w-full px-3 sm:px-4">
          <!-- 顶部控制区：疾病设定 + 生成叙事按钮（位于卡片之外） -->
          <div class="mb-6 flex flex-col items-center gap-4 sm:mb-8">
            <div class="flex items-center gap-2 text-sm font-medium text-rose-600 sm:text-base">
              <div class="h-px w-10 bg-linear-to-l from-rose-400/60 to-transparent" />
              <div class="h-px w-10 bg-linear-to-r from-rose-400/60 to-transparent" />
              <UIcon name="i-lucide-stethoscope" class="text-lg sm:text-xl" />
              <span>疾病设定</span>
              <div class="h-px w-10 bg-linear-to-r from-rose-400/60 to-transparent" />
              <div class="h-px w-10 bg-linear-to-l from-rose-400/60 to-transparent" />
            </div>
            <div class="flex w-full max-w-2xl flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <UInput
                v-model="disease"
                size="xl"
                icon="i-lucide-search"
                placeholder="请输入任意疾病名称作为设定（例如：偏头痛、肺炎、抑郁症）"
                class="group relative flex-1"
                :ui="{
                  base: 'pl-11 pr-4 py-3 text-base shadow-sm transition-all duration-300 focus:shadow-[0_0_0_4px_rgba(236,72,153,0.08)] focus:ring-2 focus:ring-rose-400/60',
                  leading: 'pl-4',
                }"
              />
              <UButton
                size="xl"
                icon="i-lucide-sparkles"
                variant="solid"
                :loading="isGenerating"
                :ui="{
                  base: 'bg-rose-500 hover:bg-rose-600 active:bg-rose-600 text-white focus-visible:outline-rose-500',
                }"
                class="shrink-0 font-semibold shadow-lg shadow-rose-500/20"
                @click="generateNarrative"
              >
                生成叙事
              </UButton>
            </div>
          </div>

          <!-- 叙事医学内容容器（截屏目标：叙事单页） -->
          <article
            id="nm-sheet"
            class="nm-sheet relative mx-auto flex w-full max-w-4xl flex-col rounded-xl shadow-[0_25px_60px_-20px_rgba(244,114,182,0.25)] ring-1 ring-white/70"
            aria-label="叙事医学界面"
          >
            <!-- 顶部装饰光晕 -->
            <div
              class="pointer-events-none absolute -top-24 left-1/2 h-48 w-[80%] -translate-x-1/2 rounded-full bg-linear-to-r from-fuchsia-200/40 via-amber-200/40 to-cyan-200/40 blur-3xl"
            />
            <div
              class="pointer-events-none absolute top-40 -right-16 h-32 w-32 rounded-full bg-linear-to-br from-rose-200/30 to-orange-200/30 blur-3xl"
            />
            <div
              class="pointer-events-none absolute bottom-32 -left-20 h-40 w-40 rounded-full bg-linear-to-tr from-cyan-200/30 to-violet-200/30 blur-3xl"
            />

            <!-- 页面内容 -->
            <div
              class="relative z-10 flex flex-1 flex-col gap-6 px-4 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 lg:px-12 lg:py-12"
            >
              <!-- 杂志刊头：左专题大字 + 右刊名小字 -->
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <!-- 左：疾病名称（渐变大字） -->
                <div class="flex flex-col gap-2">
                  <p
                    v-if="diseaseName"
                    class="bg-linear-to-r from-fuchsia-600 via-rose-500 to-amber-500 bg-clip-text text-2xl font-extrabold text-transparent drop-shadow-[0_3px_6px_rgba(0,0,0,0.18)] sm:text-3xl md:text-4xl"
                  >
                    {{ diseaseName }}
                  </p>
                </div>
                <!-- 右：杂志刊名（精致 nameplate，专业中性配色） -->
                <div class="flex flex-col items-center gap-1.5 text-center">
                  <span class="h-px w-24 bg-linear-to-r from-transparent via-slate-400/70 to-transparent sm:w-32" />
                  <h1
                    class="bg-linear-to-r from-slate-700 via-slate-600 to-slate-800 bg-clip-text font-serif text-lg font-bold tracking-[0.25em] text-transparent sm:text-xl"
                  >
                    叙事医学
                  </h1>
                  <p class="text-[6px] font-medium tracking-[0.45em] text-slate-500/80 uppercase sm:text-[7px]">
                    NARRATIVE MEDICINE
                  </p>
                  <span class="h-px w-24 bg-linear-to-r from-transparent via-slate-400/70 to-transparent sm:w-32" />
                </div>
              </div>

              <!-- 内容区块：病例、故事、对话、讨论、点评 -->
              <div class="flex flex-col gap-5">
                <!-- 1. 病例（头像内置于卡片右侧） -->
                <section class="block-card group relative overflow-hidden rounded-xl">
                  <div class="block-card-accent from-rose-400/70 via-fuchsia-400/70 to-pink-400/70" />
                  <UCard
                    :ui="{
                      root: 'relative overflow-hidden border-0 bg-white/90 backdrop-blur-sm',
                      header:
                        'relative border-b border-rose-100/80 bg-linear-to-r from-rose-50/80 via-white to-fuchsia-50/60 px-5 py-4 sm:px-6',
                      body: 'relative px-5 py-5 sm:px-6 sm:py-6',
                    }"
                  >
                    <template #header>
                      <div class="flex items-center gap-3">
                        <div
                          class="relative flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-rose-500 to-fuchsia-500 shadow-lg shadow-rose-500/20"
                        >
                          <UIcon name="i-lucide-clipboard-list" class="text-lg text-white" />
                          <div
                            class="absolute inset-0 rounded-lg bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          />
                        </div>
                        <div class="flex flex-col">
                          <h2 class="text-lg font-bold text-gray-900 sm:text-xl">病例</h2>
                          <p class="text-xs text-rose-500/80 sm:text-sm">病史、主诉与临床信息</p>
                        </div>
                        <UBadge
                          variant="subtle"
                          size="sm"
                          class="ms-auto hidden sm:flex"
                          :ui="{ base: 'bg-rose-500/10 text-rose-700 ring ring-inset ring-rose-500/25' }"
                          >CASE</UBadge
                        >
                      </div>
                    </template>
                    <div class="flex flex-col gap-4">
                      <template v-if="caseEntries.length">
                        <!-- 头部：左侧文字（约 2/3） + 右侧患者头像（约 1/3） -->
                        <div class="flex items-start gap-4">
                          <div class="flex min-w-0 flex-1 flex-col gap-3">
                            <div v-for="[key, value] in caseHeaderEntries" :key="key" class="flex flex-col gap-1">
                              <p class="text-sm font-semibold text-rose-600">{{ key }}</p>
                              <p class="leading-relaxed whitespace-pre-wrap text-gray-700">{{ value }}</p>
                            </div>
                          </div>
                          <!-- 右侧：患者头像 -->
                          <div class="flex w-1/3 shrink-0 justify-center">
                            <div
                              class="avatar-placeholder group relative aspect-square w-full max-w-65 overflow-hidden rounded-full bg-white shadow-lg shadow-rose-500/10"
                            >
                              <img
                                :src="avatarSrc"
                                :alt="`${caseStore.case.content?.姓名 || '患者'}头像`"
                                width="1024"
                                height="1024"
                                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div
                                class="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/80 ring-offset-2 ring-offset-rose-100/60"
                              />
                              <!-- 头像生成中遮罩 -->
                              <Transition name="fade">
                                <div
                                  v-if="isAvatarGenerating"
                                  class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-full bg-white/80 backdrop-blur-sm"
                                >
                                  <UIcon name="i-lucide-loader-circle" class="animate-spin text-2xl text-rose-500" />
                                  <span class="text-xs font-medium text-rose-500">头像生成中</span>
                                </div>
                              </Transition>
                            </div>
                          </div>
                        </div>
                        <!-- 其余字段 -->
                        <div v-for="[key, value] in caseOtherEntries" :key="key" class="flex flex-col gap-1">
                          <p class="text-sm font-semibold text-rose-600">{{ key }}</p>
                          <p class="leading-relaxed whitespace-pre-wrap text-gray-700">{{ value }}</p>
                        </div>
                      </template>
                      <p v-else class="leading-relaxed text-gray-500">
                        尚未生成病例内容，请在上方输入疾病设定后点击「生成叙事」，或从「病例」模块导入已有病例。
                      </p>
                    </div>
                  </UCard>
                </section>

                <!-- 2. 故事 -->
                <section class="block-card group relative overflow-hidden rounded-xl">
                  <div class="block-card-accent from-amber-400/70 via-orange-400/70 to-rose-400/70" />
                  <UCard
                    :ui="{
                      root: 'relative overflow-hidden border-0 bg-white/90 backdrop-blur-sm',
                      header:
                        'relative border-b border-amber-100/80 bg-linear-to-r from-amber-50/80 via-white to-orange-50/60 px-5 py-4 sm:px-6',
                      body: 'relative flex flex-col gap-6 px-5 py-5 sm:px-6 sm:py-6',
                    }"
                  >
                    <template #header>
                      <div class="flex items-center gap-3">
                        <div
                          class="relative flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20"
                        >
                          <UIcon name="i-lucide-book-open" class="text-lg text-white" />
                          <div
                            class="absolute inset-0 rounded-lg bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          />
                        </div>
                        <div class="flex flex-col">
                          <h2 class="text-lg font-bold text-gray-900 sm:text-xl">故事</h2>
                          <p class="text-xs text-amber-600/80 sm:text-sm">患者叙事与生活脉络</p>
                        </div>
                        <UBadge
                          variant="subtle"
                          size="sm"
                          class="ms-auto hidden sm:flex"
                          :ui="{ base: 'bg-amber-500/10 text-amber-700 ring ring-inset ring-amber-500/25' }"
                          >STORY</UBadge
                        >
                      </div>
                    </template>
                    <div class="flex flex-col gap-4">
                      <template v-if="storyContent">
                        <Markdown :value="storyContent" class="story-md *:first:mt-0 *:last:mb-0" />
                      </template>
                      <template v-else>
                        <p class="leading-relaxed text-gray-700">
                          【占位文字】从患者视角展开叙述，着重呈现其就诊历程中的心路历程、家庭支持、社会环境以及对疾病的认知与感受。通过细腻的语言勾勒出疾病之外的生活图景。
                        </p>
                        <p class="leading-relaxed text-gray-600">
                          【占位文字】此处将以连贯的段落形式还原患者的叙事线索，突出情感细节与生命经历，为后续对话与讨论提供叙事素材。
                        </p>
                      </template>
                    </div>
                    <!-- 关于故事的四格插图 -->
                    <div class="flex flex-col gap-3">
                      <div class="flex items-center gap-2 text-sm font-medium text-orange-600">
                        <UIcon name="i-lucide-layout-grid" class="text-lg" />
                        <span>插图</span>
                        <UBadge v-if="isIllustrationGenerating" color="warning" variant="subtle" size="xs" class="ms-1">
                          生成中
                        </UBadge>
                      </div>
                      <div
                        v-if="!isIllustrationGenerating && !imageStore.illustrationImages.length"
                        class="grid grid-cols-2 gap-3 sm:gap-4"
                      >
                        <div
                          v-for="index in 4"
                          :key="index"
                          class="story-illus group relative aspect-4/3 overflow-hidden rounded-lg"
                        >
                          <div class="absolute inset-0 bg-linear-to-br from-amber-100 via-orange-100 to-rose-100" />
                          <div class="absolute inset-px rounded-[7px] bg-white/85 backdrop-blur-[1px]" />
                          <div
                            class="relative z-10 flex h-full w-full flex-col items-center justify-center gap-1 text-center"
                          >
                            <UIcon
                              name="i-lucide-image-plus"
                              class="text-xl text-orange-400 transition-transform duration-500 group-hover:scale-110 sm:text-2xl"
                            />
                            <span class="px-2 text-[10px] font-medium text-orange-500/80 sm:text-xs"
                              >插图 {{ index }} · 占位框</span
                            >
                          </div>
                          <div class="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-white/80" />
                        </div>
                      </div>
                      <div v-else class="grid grid-cols-2 gap-3 sm:gap-4">
                        <template v-for="(img, i) in imageStore.illustrationImages" :key="i">
                          <div
                            class="story-illus group border-default relative aspect-4/3 overflow-hidden rounded-lg border"
                          >
                            <img :src="img.url" :alt="`故事插图 ${i + 1}`" class="h-full w-full object-cover" />
                          </div>
                        </template>
                        <!-- 正在生成的插图：仅当前这张转圈，其余未开始的不转圈 -->
                        <template v-if="isIllustrationGenerating">
                          <div
                            v-if="imageStore.illustrationImages.length < 4"
                            class="story-illus group relative aspect-4/3 overflow-hidden rounded-lg"
                          >
                            <div class="absolute inset-0 bg-linear-to-br from-amber-100 via-orange-100 to-rose-100" />
                            <div class="absolute inset-px rounded-[7px] bg-white/85 backdrop-blur-[1px]" />
                            <div
                              class="relative z-10 flex h-full w-full flex-col items-center justify-center gap-1 text-center"
                            >
                              <UIcon
                                name="i-lucide-loader-circle"
                                class="animate-spin text-xl text-orange-400 sm:text-2xl"
                              />
                              <span class="px-2 text-[10px] font-medium text-orange-500/80 sm:text-xs"
                                >插图生成中…</span
                              >
                            </div>
                            <div class="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-white/80" />
                          </div>
                          <!-- 尚未开始的插图：普通占位框（不转圈） -->
                          <div
                            v-for="n in pendingIllustrations"
                            :key="`pending-${n}`"
                            class="story-illus group relative aspect-4/3 overflow-hidden rounded-lg"
                          >
                            <div class="absolute inset-0 bg-linear-to-br from-amber-100 via-orange-100 to-rose-100" />
                            <div class="absolute inset-px rounded-[7px] bg-white/85 backdrop-blur-[1px]" />
                            <div
                              class="relative z-10 flex h-full w-full flex-col items-center justify-center gap-1 text-center"
                            >
                              <UIcon
                                name="i-lucide-image-plus"
                                class="text-xl text-orange-400 transition-transform duration-500 group-hover:scale-110 sm:text-2xl"
                              />
                              <span class="px-2 text-[10px] font-medium text-orange-500/80 sm:text-xs"
                                >插图 {{ imageStore.illustrationImages.length + n }} · 待生成</span
                              >
                            </div>
                            <div class="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-white/80" />
                          </div>
                        </template>
                      </div>
                    </div>
                  </UCard>
                </section>

                <!-- 3. 对话 -->
                <section class="block-card group relative overflow-hidden rounded-xl">
                  <div class="block-card-accent from-cyan-400/70 via-sky-400/70 to-blue-400/70" />
                  <UCard
                    :ui="{
                      root: 'relative overflow-hidden border-0 bg-white/90 backdrop-blur-sm',
                      header:
                        'relative border-b border-cyan-100/80 bg-linear-to-r from-cyan-50/80 via-white to-sky-50/60 px-5 py-4 sm:px-6',
                      body: 'relative flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6',
                    }"
                  >
                    <template #header>
                      <div class="flex items-center gap-3">
                        <div
                          class="relative flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500 to-sky-500 shadow-lg shadow-cyan-500/20"
                        >
                          <UIcon name="i-lucide-messages-square" class="text-lg text-white" />
                          <div
                            class="absolute inset-0 rounded-lg bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          />
                        </div>
                        <div class="flex flex-col">
                          <h2 class="text-lg font-bold text-gray-900 sm:text-xl">对话</h2>
                          <p class="text-xs text-cyan-600/80 sm:text-sm">医患交流与共情场景</p>
                        </div>
                        <UBadge
                          variant="subtle"
                          size="sm"
                          class="ms-auto hidden sm:flex"
                          :ui="{ base: 'bg-cyan-500/10 text-cyan-700 ring ring-inset ring-cyan-500/25' }"
                          >DIALOGUE</UBadge
                        >
                      </div>
                    </template>
                    <div class="flex flex-col gap-4">
                      <template v-if="conversationContent">
                        <Markdown :value="conversationContent" class="nm-md *:first:mt-0 *:last:mb-0" />
                      </template>
                      <template v-else-if="generatingSection === 'story-conversation'">
                        <div class="flex items-center gap-2 text-sm font-medium text-cyan-600">
                          <UIcon name="i-lucide-loader-circle" class="animate-spin text-base" />
                          <span>医患对话生成中…</span>
                        </div>
                      </template>
                      <template v-else>
                        <div
                          class="dialogue-bubble relative rounded-2xl rounded-tl-md border border-cyan-100/80 bg-linear-to-br from-cyan-50/80 to-white p-4 sm:p-5"
                        >
                          <div class="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-700">
                            <UIcon name="i-lucide-user" />
                            <span>患者</span>
                          </div>
                          <p class="leading-relaxed text-gray-700">
                            【占位文字】在交流中表达内心顾虑、对诊断的疑问以及对生活的担忧，语言真实自然，体现患者的独特叙述视角。
                          </p>
                        </div>
                        <div
                          class="dialogue-bubble relative rounded-2xl rounded-tr-md border border-sky-100/80 bg-linear-to-br from-sky-50/80 to-white p-4 sm:p-5"
                        >
                          <div class="mb-2 flex items-center justify-end gap-2 text-sm font-medium text-sky-700">
                            <span>医师</span>
                            <UIcon name="i-lucide-stethoscope" />
                          </div>
                          <p class="text-right leading-relaxed text-gray-700">
                            【占位文字】以倾听、共情、解释为主的回应方式，关注患者的情感需求，在医学信息传递的同时给予充分的理解与支持。
                          </p>
                        </div>
                        <div
                          class="dialogue-bubble relative rounded-2xl rounded-tl-md border border-cyan-100/80 bg-linear-to-br from-cyan-50/70 to-white p-4 sm:p-5"
                        >
                          <div class="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-700">
                            <UIcon name="i-lucide-users" />
                            <span>共同讨论</span>
                          </div>
                          <p class="leading-relaxed text-gray-700">
                            【占位文字】双方在对话中逐步建立信任，共同梳理治疗选择、生活调整与预期目标，体现医患共同决策的叙事过程。
                          </p>
                        </div>
                      </template>
                    </div>
                  </UCard>
                </section>

                <!-- 4. 讨论 -->
                <section class="block-card group relative overflow-hidden rounded-xl">
                  <div class="block-card-accent from-emerald-400/70 via-teal-400/70 to-cyan-400/70" />
                  <UCard
                    :ui="{
                      root: 'relative overflow-hidden border-0 bg-white/90 backdrop-blur-sm',
                      header:
                        'relative border-b border-emerald-100/80 bg-linear-to-r from-emerald-50/80 via-white to-teal-50/60 px-5 py-4 sm:px-6',
                      body: 'relative flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6',
                    }"
                  >
                    <template #header>
                      <div class="flex items-center gap-3">
                        <div
                          class="relative flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20"
                        >
                          <UIcon name="i-lucide-lightbulb" class="text-lg text-white" />
                          <div
                            class="absolute inset-0 rounded-lg bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          />
                        </div>
                        <div class="flex flex-col">
                          <h2 class="text-lg font-bold text-gray-900 sm:text-xl">讨论</h2>
                          <p class="text-xs text-emerald-600/80 sm:text-sm">多角度思辨与叙事分析</p>
                        </div>
                        <UBadge
                          variant="subtle"
                          size="sm"
                          class="ms-auto hidden sm:flex"
                          :ui="{ base: 'bg-emerald-500/10 text-emerald-700 ring ring-inset ring-emerald-500/25' }"
                          >DISCUSSION</UBadge
                        >
                      </div>
                    </template>
                    <div class="flex flex-col gap-4">
                      <template v-if="discussionContent">
                        <Markdown :value="discussionContent" class="nm-md *:first:mt-0 *:last:mb-0" />
                      </template>
                      <template v-else-if="generatingSection === 'story-discussion'">
                        <div class="flex items-center gap-2 text-sm font-medium text-emerald-600">
                          <UIcon name="i-lucide-loader-circle" class="animate-spin text-base" />
                          <span>多方讨论生成中…</span>
                        </div>
                      </template>
                      <template v-else>
                        <p class="leading-relaxed text-gray-700">
                          【占位文字】从生物-心理-社会医学模式出发，结合患者叙事探讨疾病的多重意义。既要关注病理生理，也要理解疾病对患者身份、角色、家庭与社会的影响。
                        </p>
                        <div class="grid gap-3 sm:grid-cols-2">
                          <div
                            class="discussion-item relative overflow-hidden rounded-lg border border-emerald-100/80 bg-linear-to-br from-emerald-50/70 to-white p-4"
                          >
                            <div class="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-700">
                              <UIcon name="i-lucide-heart-handshake" />
                              <span>共情视角</span>
                            </div>
                            <p class="text-sm leading-relaxed text-gray-600">
                              【占位文字】关注“患病体验”本身，理解患者如何赋予疾病意义，尊重其叙述的合理性与价值。
                            </p>
                          </div>
                          <div
                            class="discussion-item relative overflow-hidden rounded-lg border border-teal-100/80 bg-linear-to-br from-teal-50/70 to-white p-4"
                          >
                            <div class="mb-2 flex items-center gap-2 text-sm font-medium text-teal-700">
                              <UIcon name="i-lucide-network" />
                              <span>整体视角</span>
                            </div>
                            <p class="text-sm leading-relaxed text-gray-600">
                              【占位文字】结合家庭、文化、经济等社会因素，思考支持体系与可行的照护策略，追求整体性关怀。
                            </p>
                          </div>
                        </div>
                        <p class="leading-relaxed text-gray-600">
                          【占位文字】在讨论中避免仅以“疾病”概括患者，转而关注“人在患病”这一整体，体现叙事医学的人文关怀与临床思辨的统一。
                        </p>
                      </template>
                    </div>
                  </UCard>
                </section>

                <!-- 5. 点评 -->
                <section class="block-card group relative overflow-hidden rounded-xl">
                  <div class="block-card-accent from-violet-400/70 via-purple-400/70 to-fuchsia-400/70" />
                  <UCard
                    :ui="{
                      root: 'relative overflow-hidden border-0 bg-white/90 backdrop-blur-sm',
                      header:
                        'relative border-b border-violet-100/80 bg-linear-to-r from-violet-50/80 via-white to-purple-50/60 px-5 py-4 sm:px-6',
                      body: 'relative flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6',
                    }"
                  >
                    <template #header>
                      <div class="flex items-center gap-3">
                        <div
                          class="relative flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/20"
                        >
                          <UIcon name="i-lucide-award" class="text-lg text-white" />
                          <div
                            class="absolute inset-0 rounded-lg bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          />
                        </div>
                        <div class="flex flex-col">
                          <h2 class="text-lg font-bold text-gray-900 sm:text-xl">点评</h2>
                          <p class="text-xs text-violet-600/80 sm:text-sm">收获、启发与反思</p>
                        </div>
                        <UBadge
                          variant="subtle"
                          size="sm"
                          class="ms-auto hidden sm:flex"
                          :ui="{ base: 'bg-violet-500/10 text-violet-700 ring ring-inset ring-violet-500/25' }"
                          >COMMENT</UBadge
                        >
                      </div>
                    </template>
                    <div class="flex flex-col gap-4">
                      <template v-if="commentContent">
                        <Markdown :value="commentContent" class="nm-md *:first:mt-0 *:last:mb-0" />
                      </template>
                      <template v-else-if="generatingSection === 'story-comment'">
                        <div class="flex items-center gap-2 text-sm font-medium text-violet-600">
                          <UIcon name="i-lucide-loader-circle" class="animate-spin text-base" />
                          <span>专家点评生成中…</span>
                        </div>
                      </template>
                      <template v-else>
                        <p class="leading-relaxed text-gray-700">
                          【占位文字】总结本次叙事医学实践的主要收获，提炼医患沟通中的闪光点，反思倾听方式对建立信任、改善理解的作用。
                        </p>
                        <div
                          class="relative overflow-hidden rounded-lg border border-violet-100/80 bg-linear-to-br from-violet-50/70 via-white to-fuchsia-50/60 p-4 sm:p-5"
                        >
                          <div class="mb-2 flex items-center gap-2 text-sm font-medium text-violet-700">
                            <UIcon name="i-lucide-sparkles" />
                            <span>启发与思考</span>
                          </div>
                          <ul class="flex flex-col gap-2 text-sm leading-relaxed text-gray-600">
                            <li class="flex items-start gap-2">
                              <UIcon name="i-lucide-dot" class="mt-1 text-lg text-violet-400" />
                              <span>【占位文字】叙事不仅是记录，更是理解疾病体验的重要临床工具。</span>
                            </li>
                            <li class="flex items-start gap-2">
                              <UIcon name="i-lucide-dot" class="mt-1 text-lg text-violet-400" />
                              <span>【占位文字】倾听本身就是治疗，在共情中寻找平衡，既要科学理性，也要人文温暖。</span>
                            </li>
                            <li class="flex items-start gap-2">
                              <UIcon name="i-lucide-dot" class="mt-1 text-lg text-violet-400" />
                              <span>【占位文字】将患者的生活叙事融入临床思考，有助于制定更贴合实际的照护方案。</span>
                            </li>
                          </ul>
                        </div>
                        <p class="leading-relaxed text-gray-600">
                          【占位文字】展望未来：持续练习叙事倾听，将人文关怀贯穿临床实践的每一个环节，在技术与温情之间找到属于自己的平衡点。
                        </p>
                      </template>
                    </div>
                  </UCard>
                </section>
              </div>

              <!-- 页脚装饰 -->
              <footer class="mt-2 flex flex-col items-center gap-2 text-center">
                <div class="h-px w-full max-w-md bg-linear-to-r from-transparent via-fuchsia-300/60 to-transparent" />
                <p class="text-xs tracking-[0.4em] text-rose-400/70 sm:text-sm">叙事医学 · 人文关怀 · 共情实践</p>
              </footer>
            </div>
          </article>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  title: '叙事医学',
})

const caseStore = useCaseStore()
const stateStore = useStateStore()
const imageStore = useImageStore()
const storyStore = useStoryStore()
const recordStore = useRecordStore()
const chatApi = useChatApi()

// 患者头像是否正在生成（置于生成序列最后，同步等待完成）
const isAvatarGenerating = ref(false)

// 故事插图是否正在生成（以头像为参考，紧接头像之后生成）
const isIllustrationGenerating = ref(false)

// 生成插图过程中，尚未开始生成的占位框数量（不含当前正在生成的一张）
const pendingIllustrations = computed(() => {
  if (!isIllustrationGenerating.value) return 0
  return Math.max(0, 4 - imageStore.illustrationImages.length - 1)
})

// 故事内容：有内容则展示，否则回退到占位文字
const storyContent = computed(() => storyStore.story.content ?? '')

// 衍生内容（对话 / 讨论 / 点评）：有内容则展示，否则保留占位文字
const conversationContent = computed(() => storyStore.conversation.content ?? '')
const discussionContent = computed(() => storyStore.discussion.content ?? '')
const commentContent = computed(() => storyStore.comment.content ?? '')

// 生成状态：覆盖「生成叙事」全流程（病例 → 故事 → 对话 → 讨论 → 点评）
const NARRATIVE_TYPES = [
  'case',
  'case-verify',
  'case-fix',
  'story',
  'story-verify',
  'story-fix',
  'story-conversation',
  'story-discussion',
  'story-comment',
]
const isGenerating = computed(
  () =>
    (chatApi.status.value === 'submitted' || chatApi.status.value === 'streaming') &&
    NARRATIVE_TYPES.includes(chatApi.currentType.value ?? ''),
)

// 当前正在生成的区块（用于在对应卡片内显示「生成中」提示）
const generatingSection = computed(() => (isGenerating.value ? (chatApi.currentType.value as string) : null))

// 疾病设定输入框与 Settings.vue 的「自定义内容」（stateStore.case.custom）关联：
// 以「疾病：」前缀标记，双向同步——输入框内容会进入自定义列表，Settings 中编辑亦会回显
const DISEASE_TAG = '疾病：'
const disease = computed({
  get: () => stateStore.case.custom.find((c) => c.startsWith(DISEASE_TAG))?.slice(DISEASE_TAG.length) ?? '',
  set: (val) => {
    const list = stateStore.case.custom.filter((c) => !c.startsWith(DISEASE_TAG))
    if (val && val.trim()) list.unshift(DISEASE_TAG + val.trim())
    stateStore.case.custom = list
  },
})
// 刊头大字始终使用病例的诊断名称；仅对显示做清理，保持「诊断」原值不变：
// 去掉开头非文字符号，并在第一个非文字符号处截断，使疾病名称整洁
const diseaseName = computed(() => cleanDiseaseName(caseStore.case.content?.诊断))

// 清理疾病名称：
// 1) 去除所有空格；2) 去除开头的序号/编号（可连续，如 1、 2. 3) ①② （一）（1）三、）；
// 3) 去掉首部其余非文字符号；4) 遇到第一个非文字符号即截断（含该符号及其以后文字）
function cleanDiseaseName(raw: unknown): string {
  let s = String(raw ?? '').replace(/\s+/g, '') // 去除所有空格（含中文/英文空格、换行等）
  if (!s) return ''

  // 去除开头的序号/编号（循环以处理连续出现的多个前缀）
  const reNum = /^([0-9]+[.、)）]|[①-⑳㉑-㉟]|[（(][0-9一二三四五六七八九十]+[)）]|[一二三四五六七八九十百千]+[.、])/
  let prev = s
  do {
    prev = s
    s = s.replace(reNum, '')
  } while (s !== prev && s.length > 0)

  // 定位首个文字字符（中文、字母、数字），去掉其前的所有符号
  const start = s.search(/[一-龥A-Za-z0-9]/)
  if (start === -1) return ''
  const body = s.slice(start)
  // 首个非文字符号处截断，去掉该符号及其之后所有内容
  const end = body.search(/[^一-龥A-Za-z0-9]/)
  return end === -1 ? body : body.slice(0, end)
}

// 病例内容字段列表（过滤空值），用于替换占位文字
const caseEntries = computed<[string, string][]>(() => {
  const content = caseStore.case.content
  if (!content || typeof content === 'string') return []
  return Object.entries(content).filter(([, value]) => value !== undefined && value !== null && value !== '') as [
    string,
    string,
  ][]
})

// 头部字段（姓名、性别、年龄、主诉），各自成行，置于头像左侧
const HEADER_KEYS = ['姓名', '性别', '年龄', '主诉']
const caseHeaderEntries = computed<[string, string][]>(() =>
  HEADER_KEYS.map((key) => [key, caseStore.case.content?.[key] ?? ''] as [string, string]).filter(
    ([, value]) => value !== '',
  ),
)
// 其余字段（排除 姓名/性别/年龄/主诉）
const caseOtherEntries = computed<[string, string][]>(() =>
  caseEntries.value.filter(([key]) => !HEADER_KEYS.includes(key)),
)

// 患者头像：优先使用已生成的图像，否则按性别回退到占位图
const avatarSrc = computed(() => {
  const generated = imageStore.faceImages[0]?.url
  if (generated) return generated
  const gender = caseStore.case.content?.性别
  if (gender && /男/.test(gender)) return '/images/placeholder_male.png'
  return '/images/placeholder_female.png'
})

// 等待某一（组）生成类型完整结束（status 回到 ready），再衔接下一步。
// 关键：必须等 status 回到 ready，而非 content 一变 truthy 就开始——否则下一步的 send 会
// 调用 chat.stop() 把仍在流式生成的内容打断。
function waitForReady(types: string[]): Promise<void> {
  return new Promise((resolve) => {
    let stop: (() => void) | undefined
    const check = () => {
      if (chatApi.status.value === 'ready' && types.includes(chatApi.currentType.value ?? '')) {
        stop?.()
        resolve()
        return true
      }
      return false
    }
    if (check()) return
    stop = watch(
      () => chatApi.status.value,
      () => check(),
    )
  })
}

async function generateNarrative() {
  // 生成前清空所有相关内容（病例、故事、图像等），确保从干净状态开始
  recordStore.reset()
  imageStore.reset()
  isAvatarGenerating.value = false
  // 清空病历设定中的教科书部分，仅以自定义内容（含疾病设定）生成病例
  stateStore.case.textbook = null
  // 将「疾病设定」输入框文字同时作为生成故事的自定义提示词（要点设定）
  const diseaseText = disease.value.trim()
  if (diseaseText) {
    stateStore.story.custom = [
      `${DISEASE_TAG}${diseaseText}`,
      ...stateStore.story.custom.filter((c) => !c.startsWith(DISEASE_TAG)),
    ]
  }
  // 触发「生成病例」命令
  await caseStore.generate()
  // 等待本次病例完整生成完毕（含可能的自动校验/修正），再衔接后续步骤
  await waitForReady(['case', 'case-verify', 'case-fix'])
  // 生成故事（同步清空对话/讨论/点评等衍生内容）
  await storyStore.generate()
  await waitForReady(['story', 'story-verify', 'story-fix'])
  // 依次生成对话、讨论、点评：三者彼此依赖上游内容，须串行等待各自完成
  await storyStore.generateConversation()
  await waitForReady(['story-conversation'])
  await storyStore.generateDiscussion()
  await waitForReady(['story-discussion'])
  await storyStore.generateComment()
  await waitForReady(['story-comment'])
  // 序列最后生成患者头像：基于已完成的整套叙事，await 同步等待完成后再结束
  isAvatarGenerating.value = true
  try {
    await imageStore.face()
  } catch {
    // 头像生成失败时忽略错误，保留占位图
  } finally {
    isAvatarGenerating.value = false
  }
  // 基于已生成的患者头像，继续生成故事插图（头像作为参考图，保持人物一致）
  isIllustrationGenerating.value = true
  try {
    await imageStore.illustration()
  } catch {
    // 插图生成失败时忽略错误
  } finally {
    isIllustrationGenerating.value = false
  }
}
</script>

<style scoped>
.nm-sheet {
  background: radial-gradient(circle at top, rgba(255, 255, 255, 0.98), rgba(255, 247, 250, 0.96));
  position: relative;
  animation: page-fade-in 900ms ease-out both;
}

@keyframes page-fade-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.99);
    filter: blur(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

.avatar-placeholder {
  position: relative;
  animation: float-gentle 6s ease-in-out infinite;
}

.avatar-placeholder::after {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(244, 114, 182, 0.18) 0%, transparent 70%);
  filter: blur(12px);
  opacity: 0.8;
}

@keyframes float-gentle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.block-card {
  position: relative;
  animation: card-rise 700ms ease-out both;
}

.block-card:nth-child(2) {
  animation-delay: 80ms;
}
.block-card:nth-child(3) {
  animation-delay: 140ms;
}
.block-card:nth-child(4) {
  animation-delay: 200ms;
}
.block-card:nth-child(5) {
  animation-delay: 260ms;
}

@keyframes card-rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.block-card-accent {
  position: absolute;
  inset: 0 auto auto 0;
  height: 3px;
  width: 100%;
  background: linear-gradient(90deg, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to));
  opacity: 0.9;
}

.block-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  box-shadow: 0 30px 60px -40px rgba(236, 72, 153, 0.4);
  pointer-events: none;
}

.story-illus {
  position: relative;
  transition:
    transform 400ms ease,
    box-shadow 400ms ease;
}

.story-illus:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 18px 40px -24px rgba(249, 115, 22, 0.5);
}

/* 故事正文：每段段首空两字，符合中文排版习惯 */
.story-md :deep(p) {
  text-indent: 2em;
}

/* 对话 / 讨论 / 点评的 Markdown 正文排版 */
.nm-md :deep(p) {
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
  line-height: 1.8;
  color: rgb(55 65 81);
}

.nm-md :deep(p:first-child) {
  margin-top: 0;
}

.nm-md :deep(p:last-child) {
  margin-bottom: 0;
}

.nm-md :deep(strong) {
  font-weight: 600;
  color: rgb(17 24 39);
}

/* 头像生成中遮罩的淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dialogue-bubble {
  position: relative;
  box-shadow: 0 20px 40px -30px rgba(14, 165, 233, 0.4);
  transition:
    transform 400ms ease,
    box-shadow 400ms ease;
}

.dialogue-bubble:hover {
  transform: translateY(-2px);
  box-shadow: 0 24px 44px -28px rgba(14, 165, 233, 0.45);
}

.discussion-item {
  position: relative;
  transition:
    transform 400ms ease,
    box-shadow 400ms ease;
}

.discussion-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 38px -26px rgba(16, 185, 129, 0.45);
}

@media print {
  :global(html),
  :global(body) {
    background: #ffffff !important;
  }

  :global(#pages-project-narrative-medicine) {
    background: #ffffff !important;
  }

  .nm-sheet {
    box-shadow: none !important;
    border-radius: 0 !important;
    animation: none !important;
  }

  .nm-sheet::before,
  .nm-sheet::after,
  .pointer-events-none {
    display: none !important;
  }

  .block-card,
  .avatar-placeholder,
  .story-illus,
  .dialogue-bubble,
  .discussion-item {
    animation: none !important;
    transform: none !important;
    box-shadow: none !important;
  }

  .block-card {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .story-illus {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .dialogue-bubble,
  .discussion-item {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
</style>
