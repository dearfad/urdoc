<template>
  <UButton icon="i-lucide-camera" variant="ghost" @click="capture">
    {{ label }}
  </UButton>
</template>

<script setup lang="ts">
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

// 截图前把范围内的跨域 <img> 临时替换为同源代理地址：
// localStorage 只持久化远程 URL（避免 base64 撑爆配额），但 snapdom 序列化跨域图片到
// canvas 会污染画布，导致导出 PNG 失败/图片缺失。经同源代理转发后不污染画布。
// 仅改写内存中的 DOM，不触碰持久化数据，截完即还原。
async function inlineCrossOriginImages(el: HTMLElement) {
  const imgs = Array.from(el.querySelectorAll('img')) as HTMLImageElement[]
  await Promise.all(
    imgs.map((img) => {
      const src = img.getAttribute('src') || ''
      if (!src || src.startsWith('data:') || src.startsWith('blob:')) return Promise.resolve()

      let absolute: URL
      try {
        absolute = new URL(src, window.location.href)
      } catch {
        return Promise.resolve()
      }
      // 同源或相对路径图片（如占位图）无需代理，snapdom 可直接内联
      if (absolute.origin === window.location.origin) return Promise.resolve()

      const proxySrc = `/api/image/proxy?url=${encodeURIComponent(absolute.href)}`
      img.dataset.captureOriginalSrc = src
      return new Promise<void>((resolve) => {
        const done = () => resolve()
        img.addEventListener('load', done, { once: true })
        img.addEventListener('error', done, { once: true })
        img.src = proxySrc
      })
    }),
  )
}

function restoreImageSrcs(el: HTMLElement) {
  el.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
    const original = img.dataset.captureOriginalSrc
    if (original) {
      img.src = original
      delete img.dataset.captureOriginalSrc
    }
  })
}

async function capture() {
  const el = document.getElementById(captureId)
  if (!el) return

  const restore = expandElement(el)
  await inlineCrossOriginImages(el)
  await new Promise(r => requestAnimationFrame(r))

  await snapdom.download(el, {
    format: 'png',
    filename: 'capture',
    backgroundColor: '#fff',
    plugins: [{
      name: 'expand-overflow',
      afterClone: ({ clone: clonedElement }) => {
        // 根节点（截屏目标本身）直接展开，确保完整高度渲染
        clonedElement.style.overflow = 'visible'
        clonedElement.style.maxHeight = 'none'
        clonedElement.style.height = 'auto'
        // 仅对真正「可滚动」(overflow:auto/scroll) 的子孙节点展开，
        // 保留 overflow:hidden 的裁切用途（如圆形头像、圆角插图），否则会破坏圆形遮罩等效果
        const isScrollable = (node: Element) => {
          const cs = getComputedStyle(node)
          return (
            cs.overflow === 'auto' || cs.overflow === 'scroll' ||
            cs.overflowY === 'auto' || cs.overflowY === 'scroll'
          )
        }
        clonedElement.querySelectorAll('*').forEach((child) => {
          if (isScrollable(child)) {
            child.style.overflow = 'visible'
            child.style.maxHeight = 'none'
            if (child.style.height) child.style.height = ''
          }
        })
      },
    }],
  })

  restoreImageSrcs(el)
  restore()
}
</script>
