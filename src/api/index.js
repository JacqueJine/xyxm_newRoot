import request from '@/utils/request'

// 首页学校列表
export function adminSchoolList(data) {
    return request({
        url: '/admin/Index/adminSchoolList.html',
        method: 'post',
        data
    })
}
// 管理员首页统计 
export function HomePage(data) {
    return request({
        url: '/admin/Index/HomePage.html',
        method: 'post',
        data
    })
}