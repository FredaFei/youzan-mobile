import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [{
  path: '/',
  component: require('../components/member.vue')
}, {
  path: '/address',
  component: require('../components/address.vue'),
  children: [{
    path: '',
    // component: require('./components/all.vue')
    redirect: 'all'
  }, {
    path: 'all',
    name: 'all',
    component: require('../components/all.vue'),
  }, {
    path: 'form',
    name: 'form',
    component: require('../components/form.vue'),
  }]
}]

let router = new VueRouter({
  routes
})

export default router
