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
    logo: '/logo.svg',
    nav: [
      { text: '主页', link: 'https://urdoc.dearfad.com', target: '_self' },
      { text: '文档', link: '/' },
    ],

    sidebar: [
      {
        text: '简介',
        items: [
          { text: '什么是 CSTAR ?', link: '/guide/what-is-cstar' },
          { text: '什么是 URDOC ?', link: '/guide/what-is-urdoc' },
          { text: '快速开始', link: '/guide/getting-started' },
        ],
      },
      {
        text: '参考',
        items: [{ text: '配置说明', link: '/reference/custom-config' }],
      },
    ],

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    outline: {
      label: '页面导航',
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/dearfad/urdoc' }],

    editLink: {
      pattern: 'https://github.com/dearfad/urdoc/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面',
    },

    lastUpdated: {
      text: '最后更新于',
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },

  // your existing vitepress config...
  // optionally, you can pass MermaidConfig
  // mermaid: {
  //   // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
  // },
  // optionally set additional config for plugin itself with MermaidPluginConfig
  // mermaidPlugin: {
  //   class: 'mermaid my-class', // set additional css classes for parent container
  // },
})
