import Vue from 'vue'
import App from './App'
import router from './router'
import './plugins/element.js'
import './assets/iconfonts/iconfont.css'
import md5 from 'js-md5'
import TreeTable from 'vue-table-with-tree-grid'

Vue.prototype.$md5 = md5

import {
  Service
} from './network/http.js'
Vue.prototype.$http = Service


import verify from "@/plugins/verify.js";

Vue.prototype.verifyfilter = verify.filter

Vue.prototype.verifyrule = verify.rule


import "./plugins/formRules.js";

Vue.component('tree-table', TreeTable)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.config.productionTip = false
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  template: '<App/>'
}).$mount('#app')