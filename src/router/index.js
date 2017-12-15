import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Listen from '@/components/Listen'
import NotFound from '@/components/NotFound'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/listen/:room',
      name: 'Listen',
      component: Listen
    },
    {
      path: '/notfound',
      name: 'NotFound',
      component: NotFound
    },
    // redirect to default welcome page
    { path: '*', redirect: '/' }
  ]
})
