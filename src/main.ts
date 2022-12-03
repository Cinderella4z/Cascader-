import { createApp } from 'vue'
import App from './App.vue'
import cascaderInstall from './components/cascader/cascader'
import handleClose from './directive/v-handleClose'
const app = createApp(App)


app.use(cascaderInstall)
app.directive('close', handleClose)
app.mount('#app')
