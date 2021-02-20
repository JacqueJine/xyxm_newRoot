import request from '@/utils/request'

// 删除公告
export function delNotice(data) {
    return request({
        url: '/admin/AdminNotice/delnotice',
        method: 'post',
        data
    })
}
// 添加公告
export function addNotice(data) {
    return request({
        url: '/admin/AdminNotice/editor',
        method: 'post',
        data
    })
}
// 公告列表
export function noticeList(data) {
    return request({
        url: '/admin/AdminNotice/findNotice',
        method: 'post',
        data
    })
}
// 单个公告内容
export function noticeId(data) {
    return request({
        url: '/admin/AdminNotice/Noticecont',
        method: 'post',
        data
    })
}
// 公告编辑接口
export function updateNotice(data) {
    return request({
        url: '/admin/AdminNotice/updateNotice',
        method: 'post',
        data
    })
}
//  轮播图列表
export function carouselList(data) {
    return request({
        url: '/admin/System/carouselList.html',
        method: 'post',
        data
    })
}
// 创建轮播图
export function addCarousel(data) {
    return request({
        url: '/admin/system/addCarousel.html',
        method: 'post',
        data
    })
}
// 编辑轮播图
export function updateCarousel(data) {
    return request({
        url: '/admin/system/updateCarousel.html',
        method: 'post',
        data
    })
}
// 删除轮播图
export function delCarousel(data) {
    return request({
        url: '/admin/System/delCarousel.html',
        method: 'post',
        data
    })
}
// 创建教学风采
export function createNew(data) {
    return request({
        url: '/admin/Adminimg/createNew',
        method: 'post',
        data
    })
}
// 获取教学风采
export function getNew(data) {
    return request({
        // url: '/api/Showimg/new',
        url: '/admin/Adminimg/adminNew',
        method: 'post',
        data
    })
}