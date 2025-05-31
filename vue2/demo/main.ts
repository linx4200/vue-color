import Vue from 'vue';
import App from './App.vue';

console.log('👉👉👉 Demo is running on Vue', Vue.version);

new Vue({
  render: h => h(App),
}).$mount('#app');
