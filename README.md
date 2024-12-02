# URDOC

- **URDOC - 虚拟病例研究所**
  是通过大语言模型**生成病例**、**编写故事**、**设计问题**、**模拟问诊**和**评估能力**为一体的虚拟病例研究平台。
- 当前应用免费模型为：glm-4-flash
- 框架: Nuxt 3 + Vite + Vue 3 + Pinia + Vuetify + Nodejs

## 设置

1. 根目录新建 .env 文件
2. 在 bigmodel.cn 上注册账号，获取 API_KEY
3. 在 .env 文件中添加以下 **BigModel** 的 API_KEY

```env
# BigModel API Key
VITE_BIGMODEL_API_KEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## 运行

```bash
npm install
npm run dev
http://localhost:3000
```
