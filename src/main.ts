import Vue from 'vue';
import App from './App.vue';
import Vue2Filters from 'vue2-filters'
import VueGoogleCharts from 'vue-google-charts'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = true;
Vue.use(Vue2Filters)
Vue.use(VueGoogleCharts)

new Vue({
    vuetify,
    render: h => h(App)
}).$mount('#app');
