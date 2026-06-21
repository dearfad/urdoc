<template>
  <UButton
    :icon="copied ? 'i-lucide-check' : 'i-lucide-clipboard'"
    :color="copied ? 'success' : undefined"
    variant="ghost"
    @click="copy"
  >
    {{ label }}
  </UButton>
</template>

<script setup>
const props = defineProps({
  text: { type: String, default: '' },
  label: { type: String, default: undefined },
})

const toast = useToast()
const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.text ?? '')
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
