import request from '@/utils/request'
// 登录
export function login(data) {
    return request({
        url: '/admin/login/login.html',
        method: 'post',
        data
    })
}
// 用户列表
export function getUserList(data) {
    return request({
        url: '/admin/user/getUserList.html',
        method: 'post',
        data
    })
}
// 用户单个详情
export function getUserInfo(data) {
    return request({
        url: '/admin/user/getUserInfo.html',
        method: 'post',
        data
    })
}
// 编辑用户信息
export function editUserInfo(data) {
    return request({
        url: '/admin/user/editUserInfo.html',
        method: 'post',
        data
    })
}
// 修改密码
export function changepwd(data) {
    return request({
        url: '/admin/Admin/updatePwd.html',
        method: 'post',
        data
    })
}
// 退出登录
export function logout() {
    return request({
        url: '/admin/login/logout.html',
        method: 'post'
    })
}
// 删除用户
export function delUser(data) {
    return request({
        url: '/admin/user/delUser',
        method: 'post',
        data
    })
}
// 编辑用户积分
export function creditPoints(data) {
    return request({
        url: '/admin/user/creditPoints',
        method: 'post',
        data
    })
}
// 实名审核列表
export function getIdentitys(data) {
    return request({
        url: '/admin/user/getIdentitys',
        method: 'post',
        data
    })
}
// 实名审核
export function verifyIdentitys(data) {
    return request({
        url: '/admin/user/verifyIdentitys',
        method: 'post',
        data
    })
}
// 提现记录
export function getWithdraw(data) {
    return request({
        url: '/admin/user/getWithdraw',
        method: 'post',
        data
    })
}
// 提现审核
export function verifyWithdraw(data) {
    return request({
        url: '/admin/user/verifyWithdraw',
        method: 'post',
        data
    })
}
// 管理员列表
export function getLists(data) {
    return request({
        url: '/admin/admin/getLists.html',
        method: 'post',
        data
    })
}
// 添加管理员
export function addAdmin(data) {
    return request({
        url: '/admin/admin/addAdmin',
        method: 'post',
        data
    })
}
// 编辑管理员
export function updateAdmin(data) {
    return request({
        url: '/admin/admin/updateAdmin',
        method: 'post',
        data
    })
}
// 删除管理员
export function delAdmin(data) {
    return request({
        url: '/admin/admin/delAdmin',
        method: 'post',
        data
    })
}

// 用户反馈列表
export function listTickling(data) {
    return request({
        url: '/admin/System/listTickling.html',
        method: 'post',
        data
    })
}
// 删除用户反馈列表
export function dellistTickling(data) {
    return request({
        url: '/admin/System/delTickling.html',
        method: 'post',
        data
    })
}

// 用户修改学校列表 
export function schoolStateList(data) {
    return request({
        url: '/admin/User/schoolStateList.html',
        method: 'post',
        data
    })
}
// 审核用户修改学校列表 
export function schoolState(data) {
    return request({
        url: '/admin/User/schoolState.html',
        method: 'post',
        data
    })
}
// 无用
// 获取单个用户信息
export function userMes(data) {
    return request({
        url: '/admin/AdminUser/userMes',
        method: 'post',
        data
    })
}
// 首页接口
export function getIndex(data) {
    return request({
        url: '/admin/Adminindex/index',
        method: 'post',
        data
    })
}
// 积分列表
export function listIntegral(data) {
    return request({
        url: '/admin/adminUser/listIntegral',
        method: 'post',
        data
    })
}