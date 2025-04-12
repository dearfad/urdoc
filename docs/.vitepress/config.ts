// import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
// https://vitepress.dev/reference/site-config
// export default defineConfig({
export default withMermaid({
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

  // your existing vitepress config...
  // optionally, you can pass MermaidConfig
  mermaid: {
    // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
  },
  // optionally set additional config for plugin itself with MermaidPluginConfig
  mermaidPlugin: {
    class: 'mermaid my-class', // set additional css classes for parent container
  },
})
