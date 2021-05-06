import Vue from 'vue'
import App from './App.vue'
import ElementUI from './element/index'
import 'element-ui/lib/theme-chalk/index.css'
import UmyUi from 'umy-ui'
import 'umy-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(UmyUi);
new Vue({
  render: h => h(App),
}).$mount('#app')
