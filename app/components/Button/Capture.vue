<template>
  <UButton icon="i-lucide-camera" variant="ghost" @click="capture">
    {{ label }}
  </UButton>
</template>

<script setup>
import { snapdom } from '@zumer/snapdom'

const { captureId, label } = defineProps({
  captureId: { type: String, required: true },
  label: { type: String, default: undefined },
})

function expandElement(el) {
  const restoreFns = []

  function expand(node) {
    const cs = getComputedStyle(node)
    if (
      cs.overflow === 'auto' || cs.overflow === 'scroll' ||
      cs.overflowY === 'auto' || cs.overflowY === 'scroll'
    ) {
      const prev = {
        overflow: node.style.overflow,
        height: node.style.height,
        maxHeight: node.style.maxHeight,
      }
      node.style.overflow = 'visible'
      node.style.maxHeight = 'none'
      node.style.height = node.scrollHeight + 'px'
      restoreFns.push(() => Object.assign(node.style, prev))
    }
  }

  expand(el)
  el.querySelectorAll('*').forEach(expand)
  return () => restoreFns.forEach(fn => fn())
}

async function capture() {
  const el = document.getElementById(captureId)
  if (!el) return

  const restore = expandElement(el)
  await new Promise(r => requestAnimationFrame(r))

  await snapdom.download(el, {
    format: 'png',
    filename: 'capture',
    backgroundColor: '#fff',
    plugins: [{
      afterClone: ({ clone: clonedElement }) => {
        clonedElement.style.overflow = 'visible'
        clonedElement.style.maxHeight = 'none'
        clonedElement.style.height = 'auto'
        clonedElement.querySelectorAll('*').forEach(child => {
          child.style.overflow = 'visible'
          child.style.maxHeight = 'none'
          if (child.style.height) child.style.height = ''
        })
      },
    }],
  })

  restore()
}
</script>
