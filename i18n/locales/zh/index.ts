import { zhHans as $vuetify } from 'vuetify/locale' // 引用vuetify的国际化文件
import zh from './zh.json'

export default () => ({
  ...zh,
  $vuetify,
})
