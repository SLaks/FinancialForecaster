import Vue from 'vue';
import App from './App.vue';
import Vue2Filters from 'vue2-filters'

Vue.config.productionTip = true;
Vue.use(Vue2Filters)

new Vue({
    render: h => h(App)
}).$mount('#app');
