import { login, logout, getInfo, changepwd } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import qs from 'qs'

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: '',
        roles: []
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    }
}

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            login(qs.stringify({ username: username.trim(), password: password })).then(response => {
                const { result } = response;
                localStorage.setItem('name', result.name);
                localStorage.setItem('auth', result.auth == 1 ? JSON.stringify(['admin']) : JSON.stringify(['editor']))
                commit('SET_TOKEN', result.token)
                setToken(result.token)
                resolve()
            }).catch(error => {
                // resolve()
                reject(error)
            })
        })
    },
    changepwd({ commit }, userInfo) {
        const { old_password, password } = userInfo
        return new Promise((resolve, reject) => {
            changepwd(qs.stringify({ password: password, old_password: old_password })).then(response => {
                const { data } = response
                commit('SET_TOKEN', data)
                    // setToken(data)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            const roles = localStorage.getItem('auth');
            commit('SET_ROLES', roles)
            resolve()
                // getInfo(qs.stringify({ username: localStorage.getItem('username') })).then(response => {
                //   const { data } = response

            //   if (!data) {
            //     reject('验证失败，请重新登录!')
            //   }
            //   const roles = ["admin"]
            //   // const roles = [{
            //   //   path: '/permission',
            //   //   component: Layout,
            //   //   redirect: '/permission/page',
            //   //   alwaysShow: true, // will always show the root menu
            //   //   name: 'Permission',
            //   //   meta: {
            //   //     title: '权限',
            //   //     icon: 'lock',
            //   //     roles: ['admin', 'editor'] // you can set roles in root nav
            //   //   },
            //   //   children: [
            //   //     {
            //   //       path: 'page',
            //   //       component: () => import('@/views/permission/page'),
            //   //       name: 'PagePermission',
            //   //       meta: {
            //   //         title: '页面权限',
            //   //         roles: ['admin'] // or you can only set roles in sub nav
            //   //       }
            //   //     },
            //   //     {
            //   //       path: 'role',
            //   //       component: () => import('@/views/permission/role'),
            //   //       name: 'RolePermission',
            //   //       meta: {
            //   //         title: '角色权限',
            //   //         roles: ['admin']
            //   //       }
            //   //     }
            //   //   ]
            //   // },]

            //   // roles must be a non-empty array
            //   if (!roles || roles.length <= 0) {
            //     reject('角色必须是非空数组!')
            //   }
            //   commit('SET_ROLES', roles)
            //   resolve(data)
            // }).catch(error => {
            //   const roles = ["admin"]
            //   commit('SET_ROLES', roles)
            //   resolve()
            //   reject(error)
            // })
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}