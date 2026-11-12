<template>
  <UDropdownMenu
    v-slot="{ open }"
    :items="formatItems"
    :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
    :ui="{ content: 'w-64' }"
  >
    <UButton
      v-bind="attrs"
      icon="i-lucide-camera"
      variant="ghost"
      :loading="isCapturing"
      :disabled="isCapturing"
      :aria-expanded="open"
      :aria-label="label ?? '截屏'"
      @click="stopClick"
    >
      {{ label }}
    </UButton>
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { computed, ref, useAttrs } from 'vue'
import { snapdom } from '@zumer/snapdom'
import type { SnapdomPlugin } from '@zumer/snapdom'
import type { PdfReport } from '@zumer/snapdom-pdf'

defineOptions({ inheritAttrs: false })

const { captureId, label } = defineProps({
  captureId: { type: String, required: true },
  label: { type: String, default: undefined },
})

// 图片格式由 snapdom.download 处理，PDF 格式由官方插件处理
// 参见 https://snapdom.dev/docs/api/ 与 https://snapdom.dev/docs/plugins/
type ImageFormat = 'png' | 'jpg' | 'webp' | 'svg'
type CaptureFormat = ImageFormat | 'pdf-fit' | 'pdf-a4'

interface CaptureFormatOption {
  value: CaptureFormat
  label: string
  description: string
  icon: string
  toastLabel: string
  group: 'image' | 'pdf'
  downloadFilename?: string
  pdf?: {
    page: 'fit' | 'a4'
    margin?: number
    orientation?: 'portrait'
  }
}

const FORMATS: CaptureFormatOption[] = [
  {
    value: 'png',
    label: 'PNG',
    description: '无损画质，适合文档归档',
    icon: 'i-lucide-image',
    toastLabel: 'PNG',
    group: 'image',
  },
  {
    value: 'jpg',
    label: 'JPG',
    description: '白底压缩图，体积更小',
    icon: 'i-lucide-camera',
    toastLabel: 'JPG',
    group: 'image',
  },
  {
    value: 'webp',
    label: 'WebP',
    description: '白底压缩图，体积更小',
    icon: 'i-lucide-layers',
    toastLabel: 'WebP',
    group: 'image',
  },
  {
    value: 'svg',
    label: 'SVG',
    description: '矢量图形，可无损缩放',
    icon: 'i-lucide-file-code-2',
    toastLabel: 'SVG',
    group: 'image',
  },
  {
    value: 'pdf-fit',
    label: 'PDF 单页',
    description: '完整版面与图片，矢量文字，单页自适应',
    icon: 'i-lucide-file-text',
    toastLabel: 'PDF 单页',
    group: 'pdf',
    downloadFilename: 'capture-fit.pdf',
    pdf: { page: 'fit' },
  },
  {
    value: 'pdf-a4',
    label: 'PDF A4 分页',
    description: '完整版面与图片，矢量文字，A4 纵向分页',
    icon: 'i-lucide-book-open',
    toastLabel: 'PDF A4 分页',
    group: 'pdf',
    downloadFilename: 'capture-a4.pdf',
    pdf: { page: 'a4', margin: 24, orientation: 'portrait' },
  },
]

const attrs = useAttrs()
const toast = useToast()
const isCapturing = ref(false)

const formatItems = computed<DropdownMenuItem[][]>(() => {
  const toItem = ({ value, label, description, icon }: CaptureFormatOption): DropdownMenuItem => ({
    label,
    description,
    icon,
    disabled: isCapturing.value,
    onSelect: (e: Event) => {
      // 选中格式时阻止冒泡，避免移动端工具栏外层容器提前关闭菜单
      e.stopPropagation()
      void capture(value)
    },
  })

  return [
    [{ label: '图片格式', type: 'label' }, ...FORMATS.filter((item) => item.group === 'image').map(toItem)],
    [{ label: 'PDF 文档', type: 'label' }, ...FORMATS.filter((item) => item.group === 'pdf').map(toItem)],
  ]
})

function stopClick(e: MouseEvent) {
  // 移动端工具栏外层容器用 @click 关闭菜单，阻止冒泡以免格式菜单刚打开就被关掉
  e.stopPropagation()
}

function expandElement(el: HTMLElement) {
  const restoreFns: (() => void)[] = []

  function expand(node: HTMLElement) {
    const cs = getComputedStyle(node)
    if (cs.overflow === 'auto' || cs.overflow === 'scroll' || cs.overflowY === 'auto' || cs.overflowY === 'scroll') {
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
  el.querySelectorAll<HTMLElement>('*').forEach(expand)
  return () => restoreFns.forEach((fn) => fn())
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

// 图片与 PDF 两条导出路径共用的溢出展开插件
const expandOverflowPlugin: SnapdomPlugin = {
  name: 'expand-overflow',
  afterClone: ({ clone }) => {
    const clonedElement = clone as HTMLElement | SVGElement | null | undefined
    if (!clonedElement) return
    // 根节点（截屏目标本身）直接展开，确保完整高度渲染
    clonedElement.style.overflow = 'visible'
    clonedElement.style.maxHeight = 'none'
    clonedElement.style.height = 'auto'
    // 仅对真正「可滚动」(overflow:auto/scroll) 的子孙节点展开，
    // 保留 overflow:hidden 的裁切用途（如圆形头像、圆角插图），否则会破坏圆形遮罩等效果
    const isScrollable = (node: Element) => {
      const cs = getComputedStyle(node)
      return cs.overflow === 'auto' || cs.overflow === 'scroll' || cs.overflowY === 'auto' || cs.overflowY === 'scroll'
    }
    clonedElement.querySelectorAll<HTMLElement>('*').forEach((child) => {
      if (isScrollable(child)) {
        child.style.overflow = 'visible'
        child.style.maxHeight = 'none'
        if (child.style.height) child.style.height = ''
      }
    })
  },
}

type PdfPluginModule = typeof import('@zumer/snapdom-pdf')
let pdfPluginModulePromise: Promise<PdfPluginModule> | undefined

// 仅在用户选择 PDF 时加载插件，避免首屏打包体积增大
function getPdfPlugin(): Promise<PdfPluginModule> {
  pdfPluginModulePromise ??= import('@zumer/snapdom-pdf')
  return pdfPluginModulePromise
}

// PDF 文字层使用本地开源字体 Noto Sans SC（OFL-1.1，许可见 public/fonts/OFL.txt）。
// 官方 PDF 插件只能嵌入 WOFF1 / TrueType 字体二进制，WOFF2 会被拒绝，因此提供常规与粗体
// 两份简体中文 WOFF1 子集；它们只在导出 PDF 时由浏览器加载，不影响首屏与其它格式的截屏。
const PDF_FONT_FAMILY = 'UrDoc PDF Sans'
const PDF_FONT_FLAG = 'data-urdoc-pdf-font'
const PDF_FONTS = [
  { url: '/fonts/noto-sans-sc-chinese-simplified-400-normal.woff', weight: '400' },
  { url: '/fonts/noto-sans-sc-chinese-simplified-700-normal.woff', weight: '700' },
] as const

// PDF 采用官方推荐的「整页图像 + 不可见文字层」模型：页面图像保证布局、图片与视觉 100% 还原，
// 文字层只负责选中/搜索，不参与绘制，因此不会出现矢量字形与位图文字错位的重影。
// 主文档注册本地中文字体，让捕获树与文字层共用同一套字体；snapdom 的 localFonts
// 把字体转成 data: URI 写进最终 SVG，PDF 插件据此嵌入并只子集化页面实际用到的字形。
async function preparePdfFonts(el: HTMLElement) {
  const style = document.createElement('style')
  style.textContent = `
    ${PDF_FONTS.map(
      ({ url, weight }) => `
        @font-face {
          font-family: '${PDF_FONT_FAMILY}';
          src: url('${url}') format('woff');
          font-style: normal;
          font-weight: ${weight};
          font-display: swap;
        }
      `,
    ).join('')}
    [${PDF_FONT_FLAG}], [${PDF_FONT_FLAG}] * {
      font-family: '${PDF_FONT_FAMILY}', sans-serif !important;
    }
  `
  document.head.appendChild(style)
  el.setAttribute(PDF_FONT_FLAG, '')

  // 插件会跳过带 filter 的文字子树，导致整段文字层消失。只清掉承载文字的元素上的
  // filter（根节点常见的是 blur(0px)，视觉等价）；纯装饰元素的模糊、渐变、图标 mask 全部保留。
  // 页面样式可能带 !important，因此内联覆盖也必须带同等优先级。
  const restoreFilters: (() => void)[] = []
  for (const node of [el, ...el.querySelectorAll<HTMLElement>('*')]) {
    if (!node.textContent?.trim() || getComputedStyle(node).filter === 'none') continue
    const previousValue = node.style.getPropertyValue('filter')
    const previousPriority = node.style.getPropertyPriority('filter')
    node.style.setProperty('filter', 'none', 'important')
    restoreFilters.push(() => {
      if (previousValue) node.style.setProperty('filter', previousValue, previousPriority)
      else node.style.removeProperty('filter')
    })
  }

  try {
    await Promise.all(
      PDF_FONTS.map(({ weight }) => document.fonts.load(`${weight} 16px "${PDF_FONT_FAMILY}"`, '叙事医学中文ABC')),
    )
    // 等一帧让字体替换后的排版稳定，再交给 snapdom 测量
    await new Promise((r) => requestAnimationFrame(r))
  } catch {
    // 字体不可用时仍继续导出，页面图像本身完整，只是文字层无法嵌入中文字体
  }

  return () => {
    restoreFilters.forEach((fn) => fn())
    el.removeAttribute(PDF_FONT_FLAG)
    style.remove()
  }
}

function logPdfReport(report: PdfReport) {
  if (report.warnings.length) {
    console.warn('[snapdom-pdf] 导出警告:', report.warnings.map((warning) => warning.message).join(' | '))
  }
  console.info(`[snapdom-pdf] 页面图像已保留，共 ${report.pages} 页，嵌入字体 ${report.fontsEmbedded.length} 个`)
}

async function capturePdf(el: HTMLElement, option: CaptureFormatOption) {
  if (!option.pdf || !option.downloadFilename) return

  const { pdf } = await getPdfPlugin()
  const restoreFonts = await preparePdfFonts(el)

  try {
    const result = await snapdom(el, {
      // 2 倍位图像素用于放大与打印，PDF 页面尺寸和文字层几何不受影响
      dpr: 2,
      embedFonts: true,
      backgroundColor: '#fff',
      localFonts: PDF_FONTS.map(({ url, weight }) => ({
        family: PDF_FONT_FAMILY,
        src: url,
        style: 'normal',
        weight,
      })),
      plugins: [pdf(), expandOverflowPlugin],
    })

    await result.toPdf({
      ...option.pdf,
      // 保留 SnapDOM 渲染的整页结果：布局、图片、背景、边框与所有文字都在
      image: true,
      // 无损编码，避免 JPEG 压缩让文字发虚
      codec: 'flate',
      // 不能再叠加矢量文字：插件会用嵌入字体把同一批文字重画一遍，字形与字距无法和
      // 浏览器渲染的位图逐像素重合，叠加后会产生重影。文字层保持不可见，只用于选中/搜索。
      vectorText: false,
      embedFonts: true,
      text: true,
      links: true,
      tagged: true,
      meta: { title: option.label },
      lang: 'zh-CN',
      backgroundColor: '#fff',
      download: option.downloadFilename,
      onReport: logPdfReport,
    })
  } finally {
    restoreFonts()
  }
}

async function capture(format: CaptureFormat) {
  const el = document.getElementById(captureId)
  if (!el || isCapturing.value) return

  const option = FORMATS.find((item) => item.value === format)
  if (!option) return

  isCapturing.value = true
  const restore = expandElement(el)

  try {
    await inlineCrossOriginImages(el)
    await new Promise((r) => requestAnimationFrame(r))

    if (option.pdf) {
      await capturePdf(el, option)
    } else {
      await snapdom.download(el, {
        format: option.value as ImageFormat,
        filename: 'capture',
        backgroundColor: '#fff',
        plugins: [expandOverflowPlugin],
      })
    }

    toast.add({
      title: `已保存为 ${option.toastLabel}`,
      color: 'success',
      icon: 'i-lucide-check-circle',
      duration: 2000,
    })
  } catch (error) {
    console.error('截屏失败:', error)
    toast.add({
      title: '截屏失败',
      description: error instanceof Error ? error.message : undefined,
      color: 'error',
      icon: 'i-lucide-alert-circle',
    })
  } finally {
    restoreImageSrcs(el)
    restore()
    isCapturing.value = false
  }
}
</script>
