import { createApp } from 'vue'
import App from './App.vue'

import cascaderInstall from './components/cascader/cascader'
const app = createApp(App)


app.use(cascaderInstall)
app.mount('#app')
