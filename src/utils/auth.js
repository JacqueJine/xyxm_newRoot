import Cookies from 'js-cookie'

const TokenKey = '_token'
// export const imgUrl = '/zhang'
// export const imgUrl = '/xiao'
export const imgUrl = ''

// export const imgUrl = 'https://xyxm.admin.mingshifan.cn'  
// export const imgUrl = 'https://xyxm.mingshifan.cn'  
// export const imgUrl = window.location.href.split("/")[0]
export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}