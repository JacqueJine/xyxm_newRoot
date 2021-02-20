import request from '@/utils/request'

// 获取系统列表
export function listSystem(data) {
    return request({
        url: '/admin/System/listSystem.html',
        method: 'post',
        data
    })
}
// 修改系统设置
export function updateSystem(data) {
    return request({
        url: '/admin/system/updateSystem.html',
        method: 'post',
        data
    })
}
// 添加系统设置
export function addSystem(data) {
    return request({
        url: '/admin/system/addSystem.html',
        method: 'post',
        data
    })
}
// 获取系统设置详情
export function infoSystem(data) {
    return request({
        url: '/admin/system/infoSystem.html',
        method: 'post',
        data
    })
}