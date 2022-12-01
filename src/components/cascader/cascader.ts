import type { App } from 'vue'
import cascaderComp from './index.vue'

export default function (app: App) {
  app.component('Cascader', cascaderComp)
}