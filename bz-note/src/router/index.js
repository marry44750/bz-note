import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '../views/login/Login.vue'
import bookList from '../views/book/bookList.vue'
import Pdf from '../views/pdf/pdf.vue'
import other from "../views/other/other";
import article from "../views/article/article";

Vue.use(Router)

export default new Router({
  mode: 'history',
  linkActiveClass: 'sidebar-active',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../components/Home.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/login/Login.vue')
    },

    {
      path: '/book',
      name: 'bookList',
      component: () => import('../views/book/bookList.vue')
    }
    ,

    {
      path: '/bookdetail/pdf',
      name: 'Pdf',
      component: () => import('../views/pdf/pdf.vue')
    },

    {
      path: '/other',
      name: 'other',
      component: () => import('../views/other/other.vue')
    },

    {
      path: '/article',
      name: 'article',
      component: () => import('../views/article/article.vue')
    }
  ]
})
