<template>
  <section class="px-6 py-8 lg:px-8">
    <!-- 区块标题 -->
    <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 class="text-highlighted flex items-center gap-2 text-lg font-semibold">
          <UIcon name="i-lucide-git-branch" class="text-primary size-5" />
          {{ t('dashboard.branch.title') }}
        </h2>
        <p class="text-muted mt-1 text-sm">{{ t('dashboard.branch.subtitle') }}</p>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="overview" class="text-muted hidden text-xs sm:inline">
          {{ t('dashboard.branch.syncedAt', { time: formatDateTime(overview.fetchedAt, locale) }) }}
        </span>
        <UButton
          :label="t('dashboard.branch.refresh')"
          icon="i-lucide-refresh-cw"
          color="neutral"
          variant="ghost"
          size="sm"
          :loading="pending"
          @click="refresh()"
        />
      </div>
    </div>

    <!-- 整体失败 -->
    <UCard v-if="error && !overview" variant="subtle" :ui="{ body: 'p-8 text-center' }">
      <UIcon name="i-lucide-cloud-off" class="text-error mx-auto size-8" />
      <p class="text-highlighted mt-3 font-medium">{{ t('dashboard.branch.loadFailed') }}</p>
      <UButton :label="t('dashboard.branch.retry')" icon="i-lucide-refresh-cw" color="primary" variant="soft" class="mt-4" @click="refresh()" />
    </UCard>

    <template v-else>
      <!-- 首屏骨架 -->
      <div v-if="pending && !overview" class="grid gap-4 lg:grid-cols-2">
        <USkeleton v-for="index in 2" :key="index" class="h-64 rounded-xl" />
      </div>

      <template v-if="overview">
        <!-- 局部降级提示 -->
        <div v-if="overview.warnings.length" class="border-default bg-elevated/50 text-warning mb-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs">
          <UIcon name="i-lucide-triangle-alert" class="size-4 shrink-0" />
          {{ t('dashboard.branch.partialWarning') }}
        </div>

        <!-- 分支差异 -->
        <div v-if="overview.compare" class="mb-4 flex flex-wrap items-center gap-2">
          <UBadge v-if="overview.compare.aheadBy" color="warning" variant="soft" size="sm">
            <UIcon name="i-lucide-arrow-up-right" class="size-3" />
            {{ t('dashboard.branch.ahead', { count: overview.compare.aheadBy }) }}
          </UBadge>
          <UBadge v-if="overview.compare.behindBy" color="info" variant="soft" size="sm">
            <UIcon name="i-lucide-arrow-down-left" class="size-3" />
            {{ t('dashboard.branch.behind', { count: overview.compare.behindBy }) }}
          </UBadge>
          <UBadge v-if="!overview.compare.aheadBy && !overview.compare.behindBy" color="success" variant="soft" size="sm">
            <UIcon name="i-lucide-check" class="size-3" />
            {{ t('dashboard.branch.inSync') }}
          </UBadge>
          <span class="text-muted text-xs">{{ t('dashboard.branch.compareHint') }}</span>
        </div>

        <!-- 双分支卡片与近期提交 -->
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <UCard
            v-for="item in overview.branches"
            :key="item.branch"
            variant="subtle"
            :ui="{
              root: 'group relative h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg',
              body: 'flex h-full flex-col p-5',
            }"
          >
            <div
              class="pointer-events-none absolute inset-x-0 top-0 h-0.5 opacity-70"
              :class="
                item.branch === 'main'
                  ? 'bg-linear-to-r from-emerald-400/10 via-emerald-400/80 to-emerald-400/10'
                  : 'bg-linear-to-r from-amber-400/10 via-amber-400/80 to-amber-400/10'
              "
            />

            <div class="flex flex-wrap items-start justify-between gap-2">
              <div class="flex items-center gap-3">
                <span
                  class="flex size-9 items-center justify-center rounded-lg ring-1"
                  :class="
                    item.branch === 'main'
                      ? 'bg-success/10 text-success ring-success/20'
                      : 'bg-warning/10 text-warning ring-warning/20'
                  "
                >
                  <UIcon name="i-lucide-git-branch" class="size-4" />
                </span>
                <div>
                  <h3 class="text-highlighted font-mono text-sm font-semibold">{{ item.branch }}</h3>
                  <p class="text-muted text-xs">
                    {{ item.branch === 'main' ? t('dashboard.branch.production') : t('dashboard.branch.development') }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-1">
                <UTooltip :text="t('dashboard.branch.openSite')">
                  <UButton
                    :to="item.siteUrl"
                    target="_blank"
                    icon="i-lucide-external-link"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    :aria-label="t('dashboard.branch.openSite')"
                  />
                </UTooltip>
                <UTooltip :text="t('dashboard.branch.openCommit')">
                  <UButton
                    :to="item.htmlUrl"
                    target="_blank"
                    icon="i-simple-icons-github"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    :aria-label="t('dashboard.branch.openCommit')"
                  />
                </UTooltip>
              </div>
            </div>

            <template v-if="!item.error && item.date">
              <div class="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span class="text-muted inline-flex items-center gap-1.5 text-xs">
                  <UIcon name="i-lucide-clock-3" class="size-3.5" />
                  {{ t('dashboard.branch.lastUpdated') }}
                </span>
                <span class="text-default font-mono text-sm font-medium">{{ formatDateTime(item.date, locale) }}</span>
                <span class="text-muted text-xs">{{ formatRelativeTime(item.date, locale) }}</span>
              </div>

              <div class="border-default bg-elevated/40 mt-4 rounded-lg border p-3">
                <p class="text-muted mb-1.5 text-[11px] tracking-wider uppercase">{{ t('dashboard.branch.commit') }}</p>
                <a
                  :href="item.htmlUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-highlighted hover:text-primary line-clamp-2 text-sm leading-snug font-medium transition-colors"
                >
                  {{ item.message || t('dashboard.branch.noCommit') }}
                </a>
                <div class="mt-3 flex flex-wrap items-center gap-2">
                  <DashboardCommitAvatar :author="item.author" size="xs" />
                  <span class="text-muted max-w-40 truncate text-xs">
                    {{ item.author?.name || t('dashboard.timeline.unknownAuthor') }}
                  </span>
                  <UButton
                    v-if="item.sha"
                    :label="item.sha.slice(0, 7)"
                    icon="i-lucide-copy"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    class="font-mono"
                    :aria-label="t('dashboard.branch.copySha')"
                    @click="copySha(item.sha)"
                  />
                </div>
              </div>

              <div v-if="item.stats" class="mt-auto grid grid-cols-3 gap-2 pt-4">
                <div class="border-default bg-elevated/40 rounded-lg border px-2 py-2.5 text-center">
                  <p class="text-highlighted font-mono text-sm font-semibold">{{ item.stats.files }}</p>
                  <p class="text-muted mt-0.5 text-[11px]">{{ t('dashboard.branch.files') }}</p>
                </div>
                <div class="border-default bg-elevated/40 rounded-lg border px-2 py-2.5 text-center">
                  <p class="text-success font-mono text-sm font-semibold">+{{ item.stats.additions }}</p>
                  <p class="text-muted mt-0.5 text-[11px]">{{ t('dashboard.branch.additions') }}</p>
                </div>
                <div class="border-default bg-elevated/40 rounded-lg border px-2 py-2.5 text-center">
                  <p class="text-error font-mono text-sm font-semibold">-{{ item.stats.deletions }}</p>
                  <p class="text-muted mt-0.5 text-[11px]">{{ t('dashboard.branch.deletions') }}</p>
                </div>
              </div>
            </template>

            <div v-else class="text-muted mt-6 flex items-center gap-2 rounded-lg border border-dashed border-default px-3 py-6 text-sm">
              <UIcon name="i-lucide-info" class="size-4 shrink-0" />
              {{ t('dashboard.branch.unavailable') }}
            </div>
          </UCard>

          <!-- 近期提交时间线：与两张分支卡片同行 -->
          <UCard
            class="md:col-span-2 xl:col-span-1"
            variant="subtle"
            :ui="{ root: 'h-full', body: 'flex h-full flex-col p-5' }"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="min-w-0">
                <h3 class="text-highlighted flex items-center gap-2 text-sm font-semibold">
                  <UIcon name="i-lucide-history" class="text-primary size-4" />
                  {{ t('dashboard.timeline.title') }}
                </h3>
                <p class="text-muted mt-1 text-xs">{{ t('dashboard.timeline.subtitle') }}</p>
              </div>
              <div v-if="overview.contributors.length" class="flex items-center gap-2">
                <span class="text-muted hidden text-xs xl:inline">{{ t('dashboard.timeline.contributors') }}</span>
                <div class="flex -space-x-2">
                  <div v-for="contributor in overview.contributors" :key="contributor.name" :title="contributor.name">
                    <DashboardCommitAvatar :author="contributor" size="sm" class="ring-default bg-default ring-2" />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="overview.timeline.length" class="mt-4 flex flex-1 flex-col">
              <div class="grid gap-1 md:grid-cols-2 xl:grid-cols-1">
                <a
                  v-for="commit in visibleTimeline"
                  :key="commit.sha"
                  :href="commit.htmlUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group hover:bg-elevated/60 flex items-start gap-2.5 rounded-lg px-2 py-2 transition-colors"
                >
                  <DashboardCommitAvatar :author="commit.author" size="sm" class="mt-0.5" />
                  <div class="min-w-0 flex-1">
                    <p class="text-default group-hover:text-primary truncate text-sm font-medium transition-colors">
                      {{ commit.message || t('dashboard.timeline.unknownAuthor') }}
                    </p>
                    <div class="text-muted mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px]">
                      <span class="max-w-32 truncate">
                        {{ commit.author?.name || t('dashboard.timeline.unknownAuthor') }}
                      </span>
                      <span class="text-dimmed">·</span>
                      <span>{{ formatRelativeTime(commit.date, locale) }}</span>
                      <span class="text-dimmed">·</span>
                      <code class="font-mono">{{ commit.sha.slice(0, 7) }}</code>
                      <UBadge :color="commit.branch === 'main' ? 'success' : 'warning'" variant="soft" size="xs">
                        {{ commit.branches.join(' / ') }}
                      </UBadge>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <div v-else class="text-muted flex flex-1 items-center justify-center gap-2 py-8 text-sm">
              <UIcon name="i-lucide-inbox" class="size-4" />
              {{ t('dashboard.timeline.empty') }}
            </div>
          </UCard>
        </div>
      </template>
    </template>
  </section>
</template>

<script setup lang="ts">
import { formatDateTime, formatRelativeTime, useGithubOverview } from '~/composables/useGithubOverview'

const { t, locale } = useI18n()
const toast = useToast()
const { data: overview, pending, error, refresh } = useGithubOverview()

const visibleTimeline = computed(() => (overview.value?.timeline ?? []).slice(0, 4))

async function copySha(sha: string) {
  if (!sha) return
  try {
    await navigator.clipboard.writeText(sha)
    toast.add({ title: t('common.copied'), color: 'success', icon: 'i-lucide-check' })
  } catch {
    toast.add({ title: t('common.copyFailed'), color: 'error', icon: 'i-lucide-alert-circle' })
  }
}
</script>
