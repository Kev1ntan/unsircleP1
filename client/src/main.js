import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from './api/axios';
import swal from './api/swal';

Vue.prototype.$axios = axios;
Vue.prototype.$swal = swal;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
