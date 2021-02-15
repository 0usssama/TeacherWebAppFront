import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Payment from '../views/Payments.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/test',
    name: 'Test',
    component: () => import(/* webpackChunkName: "about" */ '../views/Test.vue')
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/about',
    name: 'About',

    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/slider',
    name: 'Slider',

    component: () =>
      import(/* webpackChunkName: "about" */ '../views/SliderExample.vue')
  },
  {
    path: '/payments',
    name: 'Payments',
    component: Payment
    //component: () =>
    //import(/* webpackChunkName: "about" */ '../views/Payments.vue')
  },

  {
    path: '/seances',

    component: () =>
      import(/* webpackChunkName: "about" */ '../views/seance/Index.vue'),
    children: [
      {
        path: '',
        name: 'SeanceList',
        component: () =>
          import(/* webpackChunkName: "about" */ '../views/seance/List.vue')
      },
      {
        path: ':seance_id/:student_id',
        name: 'ShowSeance',
        component: () =>
          import(/* webpackChunkName: "about" */ '../views/seance/Show.vue')
      }
    ]
  },
  {
    path: '/students',

    component: () =>
      import(/* webpackChunkName: "about" */ '../views/student/Index.vue'),
    children: [
      {
        path: '',
        name: 'StudentList',
        component: () =>
          import(/* webpackChunkName: "about" */ '../views/student/List.vue')
      },
      {
        path: ':student_id',
        name: 'ShowStudent',
        component: () =>
          import(/* webpackChunkName: "about" */ '../views/seance/Show.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
