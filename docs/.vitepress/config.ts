import { defineConfig } from 'vitepress'
import { configureDiagramsPlugin } from 'vitepress-plugin-diagrams'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'URDOC',
  description: '虚拟病例研究平台',
  base: '/docs/',
  outDir: '../.output/public/docs',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '文档', link: '/cstar' },
    ],

    sidebar: [
      {
        text: '简介',
        items: [
          { text: '什么是 CSTAR ?', link: '/cstar' },
          { text: '快速开始', link: '/urdoc' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/dearfad/urdoc' }],
  },
  markdown: {
    config: (md) => {
      configureDiagramsPlugin(md, {
        diagramsDir: 'docs/public/diagrams', // 可选：自定义 SVG 文件目录
        publicPath: '/docs/diagrams', // 可选：自定义公共路径
      })
    },
  },
})
