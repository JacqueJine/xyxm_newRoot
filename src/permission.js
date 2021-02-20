import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist 没有重定向白名单

router.beforeEach(async (to, from, next) => {
  // start progress bar 开始进度条
  NProgress.start()

  // set page title 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in 确定用户是否已经登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page 如果已登录，则重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // const hasGetUserInfo = localStorage.getItem('info')
      const hasGetUserInfo = store.getters.roles && store.getters.roles.length > 0
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          // 注意:角色必须是一个对象数组!例如:['admin']或['developer'，'editor']
          await store.dispatch('user/getInfo')
          // let roles = ['editor']
          let roles =JSON.parse(localStorage.getItem('auth'));


          // // 根据角色生成可访问路由图
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // // 动态添加可访问路由
          router.addRoutes(accessRoutes)

          // hack方法，以确保addRoutes是完整的
          // 设置replace: true，这样导航将不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
