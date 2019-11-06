import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Socket from 'vue-socket.io'

Vue.use(VueRouter)
Vue.use(new Socket({
  debug: true,
  connection: 'http://192.168.1.131:8081'
}))

new Vue({
  el: '#app',
  render: h => h(App)
})
