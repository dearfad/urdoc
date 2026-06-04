<template>
  <UCard>
    <div class="space-y-3">
      <h2 class="text-highlighted text-lg font-semibold">部署状态</h2>
      <div class="space-y-2">
        <div class="flex items-center gap-3">
          <UBadge
            :label="lastCommitDate.main || '--'"
            color="success"
            variant="soft"
            class="font-mono text-xs"
          />
          <span class="text-muted text-sm"
            >正式站：<a href="https://urdoc.dearfad.com" target="_blank" class="text-primary hover:underline"
              >urdoc.dearfad.com</a
            ></span
          >
        </div>
        <div class="flex items-center gap-3">
          <UBadge
            :label="lastCommitDate.develop || '--'"
            color="warning"
            variant="soft"
            class="font-mono text-xs"
          />
          <span class="text-muted text-sm"
            >开发站：<a
              href="https://dev.urdoc.dearfad.com"
              target="_blank"
              class="text-primary hover:underline"
              >dev.urdoc.dearfad.com</a
            ></span
          >
        </div>
        <div class="flex items-center gap-3">
          <UBadge label="最新" color="info" variant="soft" class="font-mono text-xs" />
          <span class="text-muted text-sm"
            >文档：<NuxtLink to="/docs" class="text-primary hover:underline">应用内文档中心</NuxtLink></span
          >
        </div>
      </div>
      <UButton
        label="刷新状态"
        color="neutral"
        variant="ghost"
        size="sm"
        icon="i-lucide-refresh-cw"
        @click="getLastCommitDateAll"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
const toast = useToast()

const lastCommitDate = ref({
  main: '',
  develop: '',
})

async function getLastCommitDate(branch: string): Promise<string> {
  const data: any = await $fetch('/api/github/commit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      branch,
    },
  })
  const utcDate = new Date(data.commit.committer.date)
  return utcDate
    .toLocaleDateString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, '-')
}

async function getLastCommitDateAll() {
  try {
    lastCommitDate.value.main = await getLastCommitDate('main')
  } catch (e: any) {
    lastCommitDate.value.main = ''
    toast.add({
      title: '获取正式站状态失败',
      description: e.data?.message || e.message,
      color: 'error',
      icon: 'i-lucide-alert-circle',
    })
  }
  try {
    lastCommitDate.value.develop = await getLastCommitDate('develop')
  } catch (e: any) {
    lastCommitDate.value.develop = ''
    toast.add({
      title: '获取开发站状态失败',
      description: e.data?.message || e.message,
      color: 'error',
      icon: 'i-lucide-alert-circle',
    })
  }
}
</script>
