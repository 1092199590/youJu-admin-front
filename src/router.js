import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        {
          name: 'Dashboard',
          path: '',
          component: () => import('@/views/dashboard/Dashboard'),
        },
        // Pages
        {
          name: 'User Profile',
          path: 'pages/user',
          component: () => import('@/views/dashboard/pages/UserProfile'),
        },
        {
          name: 'Notifications',
          path: 'components/notifications',
          component: () => import('@/views/dashboard/component/Notifications'),
        },
        {
          name: 'Icons',
          path: 'components/icons',
          component: () => import('@/views/dashboard/component/Icons'),
        },
        {
          name: 'Typography',
          path: 'components/typography',
          component: () => import('@/views/dashboard/component/Typography'),
        },
        // Tables
        {
          name: 'Regular Tables',
          path: 'tables/regular-tables',
          component: () => import('@/views/dashboard/tables/RegularTables'),
        },
        // Maps
        {
          name: 'Google Maps',
          path: 'maps/google-maps',
          component: () => import('@/views/dashboard/maps/GoogleMaps'),
        },
        // Upgrade
        {
          name: 'Upgrade',
          path: 'upgrade',
          component: () => import('@/views/dashboard/Upgrade'),
        },
        {
          name: '主页',
          path: 'MainPage',
          component: () => import('@/views/dashboard/MainPage.vue'),
        },
        {
          name: '举报管理',
          path: 'Report',
          component: () => import('@/views/dashboard/Report.vue'),
        },
        {
          name: '投稿管理',
          path: 'Contribute',
          component: () => import('@/views/dashboard/Contribute.vue'),
        },
        {
          name: '人员管理',
          path: 'Users',
          component: () => import('@/views/dashboard/Users.vue'),
        },
        {
          name: '文章管理',
          path: 'Posts',
          component: () => import('@/views/dashboard/Posts.vue'),
        },
        {
          name: '游戏信息',
          path: 'Games',
          component: () => import('@/views/dashboard/Games.vue'),
        },
        {
          name: '新闻发布',
          path: 'ReleaseNews',
          component: () => import('@/views/dashboard/ReleaseNews.vue'),
        },
      ],
    },
  ],
})
