import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import App from './App.vue'
import router from './router'
import store from './store'
import PortalVue from 'portal-vue'
import vClickOutside from 'v-click-outside'
import { setupGlobalFuncs } from './markdown-bridge'
import { setupFirebase } from './lib/firebase'

setupGlobalFuncs()
setupFirebase()

Vue.use(VueCompositionApi)
Vue.use(PortalVue)
Vue.use(vClickOutside)

Vue.config.productionTip = false

new Vue({
  router,
  store: store.original,
  render: h => h(App)
}).$mount('#app')
