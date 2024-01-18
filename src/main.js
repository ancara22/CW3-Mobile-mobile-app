import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'

Vue.config.productionTip = false

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope::', registration.scope);
    })
    .catch((error) => {
      console.error('Error registering Service Worker:', error);
    });
}

new Vue({
  render: h => h(App),
}).$mount('#app')
