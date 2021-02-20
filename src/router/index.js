import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false) 如果设置为真，项目将不会显示在侧边栏(默认为假)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route
 *                                it will becomes nested mode, otherwise not show the root menu //当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面  只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面  若你想不管路由下面的 children 声明的个数都显示你的根路由
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb //当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             the name is used by <keep-alive> (must set!!!) 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles) // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true) 如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
/**
 * constantRoutes
 * a base page that does not have permission requirements 没有权限要求的基本页
 * all roles can be accessed 可以访问所有角色
 */
export const constantRoutes = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () =>
                import ('@/views/dashboard/index'),
            meta: { title: '首页面板', icon: 'dashboard' }
        }]
    },
    // {
    //     path: '/shop',
    //     component: Layout,
    //     redirect: '/shop/shopList',
    //     name: 'Shop',
    //     meta: {
    //         title: '店铺管理',
    //         icon: 'table',
    //         roles: ['admin', 'editor']
    //     },
    //     children: [{
    //             path: 'shopList',
    //             name: 'ShopList',
    //             component: () =>
    //                 import ('@/views/shop/index'),
    //             meta: { title: '店铺列表', icon: 'table' }
    //         },
    //         {
    //             path: 'audit',
    //             name: 'ShopAudit',
    //             component: () =>
    //                 import ('@/views/shop/audit'),
    //             meta: { title: '店铺审核', icon: 'edit' }
    //         },
    //         {
    //             path: 'orderShop',
    //             name: 'OrderShop',
    //             component: () =>
    //                 import ('@/views/shop/orderShop'),
    //             meta: { title: '店铺订单', icon: 'documentation' }
    //         },
    //         {
    //             path: 'evaluation/:id(\\d+)',
    //             component: () =>
    //                 import ('@/views/shop/evaluationList'),
    //             name: 'EvaluationList',
    //             meta: { title: '评价列表', noCache: true, activeMenu: '/shop/shopList' },
    //             hidden: true
    //         },
    //         {
    //             path: 'detail/:id(\\d+)',
    //             component: () =>
    //                 import ('@/views/shop/detail'),
    //             name: 'ShopDetail',
    //             meta: { title: '店铺详情', noCache: true, activeMenu: '/shop/shopList' },
    //             hidden: true
    //         }
    //     ]
    // },
    // {
    //     path: '/integralMall',
    //     component: Layout,
    //     redirect: '/integralMall/index',
    //     name: 'IntegralMall',
    //     meta: {
    //         title: '积分商城',
    //         icon: 'shopping',
    //         roles: ['admin', 'editor']
    //     },
    //     children: [{
    //             path: 'index',
    //             name: 'IntegralMallList',
    //             component: () =>
    //                 import ('@/views/integralMall/index'),
    //             meta: { title: '商品列表', icon: 'edit' }
    //         },
    //         {
    //             path: 'order',
    //             name: 'IntegralMallOrder',
    //             component: () =>
    //                 import ('@/views/integralMall/order'),
    //             meta: { title: '订单列表', icon: 'form' }
    //         },
    //         {
    //             path: 'add',
    //             component: () =>
    //                 import ('@/views/integralMall/add'),
    //             name: 'integralMallAdd',
    //             meta: { title: '添加积分商品', noCache: true, activeMenu: '/integralMall/add' },
    //             hidden: true
    //         },
    //         {
    //             path: 'edit/:id(\\d+)',
    //             component: () =>
    //                 import ('@/views/integralMall/edit'),
    //             name: 'EditGoods',
    //             meta: { title: '编辑商品', noCache: true, activeMenu: '/integralMall/edit' },
    //             hidden: true
    //         },
    //     ]
    // },
    // 404 page must be placed at the end !!!
]

export const asyncRoutes = [{
        path: '/user',
        component: Layout,
        redirect: '/user/userList',
        name: 'User',
        meta: {
            title: '用户管理',
            icon: 'user',
            roles: ['admin', 'editor']
        },
        children: [{
                path: 'userList',
                name: 'UserList',
                component: () =>
                    import ('@/views/user/index'),
                meta: { title: '用户列表', icon: 'user', roles: ['admin', 'editor'] }
            },
            {
                path: 'realNameAudit',
                name: 'realNameAudit',
                component: () =>
                    import ('@/views/user/realNameAudit'),
                meta: {
                    title: '实名审核',
                    icon: 'form',
                    roles: ['admin']
                },
            },
            {
                path: 'schoolAudit',
                name: 'schoolAudit',
                component: () =>
                    import ('@/views/user/schoolAudit'),
                meta: {
                    title: '学校审核',
                    icon: 'form',
                    roles: ['admin', 'editor']
                },
            },
            {
                path: 'feedback',
                name: 'feedback',
                component: () =>
                    import ('@/views/user/feedback'),
                meta: { title: '用户反馈', icon: 'email', roles: ['admin', 'editor'] }
            },
            {
                path: 'edit/:id(\\d+)',
                component: () =>
                    import ('@/views/user/edit'),
                name: 'EditUser',
                meta: { title: '编辑用户信息', noCache: true, activeMenu: '/user/userList', roles: ['admin', 'editor'] },
                hidden: true
            },
            {
                path: 'integralList/:id(\\d+)',
                component: () =>
                    import ('@/views/user/integralList'),
                name: 'IntegralList',
                meta: { title: '积分列表', noCache: true, activeMenu: '/user/userList', roles: ['admin', 'editor'] },
                hidden: true
            },
            {
                path: 'credit/:id(\\d+)',
                component: () =>
                    import ('@/views/user/credit'),
                name: 'CreditList',
                meta: { title: '信誉分列表', noCache: true, activeMenu: '/user/userList', roles: ['admin', 'editor'] },
                hidden: true
            },
        ]
    },
    {
        path: '/task',
        component: Layout,
        redirect: '/task/orderTask',
        name: 'task',
        meta: {
            title: '任务管理',
            icon: 'form',
            roles: ['admin', 'editor']
        },
        children: [{
                path: 'orderTask',
                name: 'OrderTask',
                component: () =>
                    import ('@/views/task/orderTask'),
                meta: { title: '任务订单', icon: 'excel', roles: ['admin', 'editor'] }
            },
            {
                path: 'taskReport',
                name: 'taskReport',
                component: () =>
                    import ('@/views/task/taskReport'),
                meta: { title: '任务举报', icon: 'form', roles: ['admin', 'editor'] }
            },
            {
                path: 'taskComments',
                name: 'taskComments',
                component: () =>
                    import ('@/views/task/taskComments'),
                meta: { title: '评论举报', icon: 'message', roles: ['admin', 'editor'] }
            },
            {
                path: 'taskEdit/:id(\\d+)',
                component: () =>
                    import ('@/views/task/taskEdit'),
                name: 'TaskEdit',
                meta: { title: '任务详情', roles: ['admin', 'editor'], noCache: true, activeMenu: '/task/orderTask' },
                hidden: true
            },
        ]
    },
    {
        path: '/community',
        component: Layout,
        redirect: '/community/task',
        name: 'Community',
        meta: {
            title: '社区管理',
            icon: 'list',
            roles: ['admin', 'editor']
        },
        children: [{
                path: 'post',
                name: 'communityPost',
                component: () =>
                    import ('@/views/community/post'),
                meta: { title: '帖子列表', icon: 'list', roles: ['admin', 'editor'] }
            },
            {
                path: 'reportDetail/:id(\\d+)',
                component: () =>
                    import ('@/views/community/reportDetail'),
                name: 'reportDetail',
                meta: { title: '举报详情', roles: ['admin', 'editor'], noCache: true, activeMenu: '/community' },
                hidden: true
            },
            // {
            //     path: 'reportPost',
            //     name: 'reportPost',
            //     component: () =>
            //         import ('@/views/community/reportPost'),
            //     meta: { title: '帖子举报', icon: 'edit', roles: ['admin', 'editor'] }
            // },
            // {
            //     path: 'reportComments',
            //     name: 'reportComments',
            //     component: () =>
            //         import ('@/views/community/reportComments'),
            //     meta: { title: '评论举报', icon: 'message', roles: ['admin', 'editor'] }
            // },
        ]
    },
    {
        path: '/withdrawal',
        component: Layout,
        redirect: '/withdrawal/list',
        name: 'Withdrawal',
        meta: {
            title: '财务管理',
            icon: 'money',
            roles: ['admin', 'editor']
        },
        children: [{
                path: 'audit',
                name: 'WithdrawalAudit',
                component: () =>
                    import ('@/views/withdrawal/audit'),
                meta: {
                    title: '提现审核',
                    icon: 'edit',
                    roles: ['admin']
                },
            },
            {
                path: 'index',
                name: 'WithdrawalIndex',
                component: () =>
                    import ('@/views/withdrawal/index'),
                meta: {
                    title: '提现记录',
                    icon: 'documentation',
                    roles: ['admin', 'editor']
                },
            },
        ]
    },
    {
        path: '/school',
        component: Layout,
        redirect: '/school/index',
        name: 'School',
        meta: {
            title: '学院管理',
            icon: 'component',
            roles: ['admin', 'editor']
        },
        children: [{
                path: 'index',
                name: 'Index',
                component: () =>
                    import ('@/views/school/index'),
                meta: { title: '学院列表', icon: 'component', roles: ['admin', 'editor'] }
            },
            {
                path: 'edit/:id(\\d+)',
                component: () =>
                    import ('@/views/school/edit'),
                name: 'editSchool',
                meta: { title: '编辑学院', roles: ['admin', 'editor'], noCache: true, activeMenu: '/school/index' },
                hidden: true
            },
            {
                path: 'create',
                component: () =>
                    import ('@/views/school/create'),
                name: 'createSchool',
                meta: { title: '添加学院', roles: ['admin', 'editor'], noCache: true, activeMenu: '/school/index' },
                hidden: true
            },
        ]
    },
    {
        path: '/set',
        component: Layout,
        redirect: '/set/set',
        name: 'Set',
        meta: {
            title: '系统设置',
            icon: 'edit',
            roles: ['admin']
        },
        children: [{
                path: 'set',
                name: 'Set',
                component: () =>
                    import ('@/views/set/set'),
                meta: { title: '系统设置', icon: 'edit', roles: ['admin'] }
            },
            {
                path: 'slideList',
                name: 'SlideList',
                component: () =>
                    import ('@/views/notice/slideList'),
                meta: { title: '轮播设置', icon: 'example', roles: ['admin'] }
            },
            {
                path: 'createSlide',
                component: () =>
                    import ('@/views/notice/createSlide'),
                name: 'CreateSlide',
                meta: { title: '添加轮播', noCache: true, activeMenu: '/notice/createSlide', roles: ['admin'] },
                hidden: true
            },
            {
                path: 'adminUser',
                name: 'RolePermission',
                component: () =>
                    import ('@/views/permission/adminUser'),
                meta: {
                    title: '角色权限',
                    icon: 'lock',
                    roles: ['admin']
                }
            },
            {
                path: 'create',
                component: () =>
                    import ('@/views/set/create'),
                name: 'CreateSet',
                meta: { title: '添加系统设置', noCache: true, activeMenu: '/set/set', roles: ['admin'] },
                hidden: true
            },
            {
                path: 'edit/:id(\\d+)',
                component: () =>
                    import ('@/views/set/edit'),
                name: 'EditSet',
                meta: { title: '编辑系统设置', noCache: true, activeMenu: '/set/set', roles: ['admin'] },
                hidden: true
            },
        ]
    },
    // {
    //     path: '/permission',
    //     component: Layout,
    //     redirect: '/permission/page',
    //     name: 'Permission',
    //     meta: {
    //         title: '权限',
    //         icon: 'lock',
    //         roles: ['admin'] // you can set roles in root nav 你可以在根导航中设置角色
    //     },
    //     children: [
    //         {
    //             path: 'adminUser',
    //             component: () =>
    //                 import('@/views/permission/adminUser'),
    //             name: 'RolePermission',
    //             meta: {
    //                 title: '角色权限',
    //                 icon: 'lock',
    //                 roles: ['admin']
    //             }
    //         }
    //     ]
    // },
    { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router