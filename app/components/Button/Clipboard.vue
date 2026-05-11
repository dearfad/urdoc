<template>
  <UButton
    :icon="copied ? 'i-lucide-check' : 'i-lucide-clipboard'"
    :color="copied ? 'success' : 'neutral'"
    variant="ghost"
    @click="copy"
  />
</template>

<script setup>
const { text } = defineProps({
  text: { type: String, required: true },
})

const toast = useToast()
const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    toast.add({
      title: '已复制到剪贴板',
      color: 'success',
      icon: 'i-lucide-check-circle',
      duration: 2000,
    })
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    toast.add({
      title: '复制失败',
      color: 'error',
      icon: 'i-lucide-alert-circle',
    })
  }
}
</script>
