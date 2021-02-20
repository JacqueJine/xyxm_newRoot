import request from '@/utils/request'

// 获取任务列表
export function getTaskLists(data) {
  return request({
    url: '/admin/task/getTaskLists.html',
    method: 'post',
    data
  })
}
// 获取单个任务详情
export function getTaskInfo(data) {
  return request({
    url: '/admin/task/getTaskInfo.html',
    method: 'post',
    data
  })
}


// 店铺封店解封
export function closeStore(data) {
  return request({
    url: '/admin/store/closeStore.html',
    method: 'post',
    data
  })
}
// 店铺审核通过拒绝接口
export function auditStore(data) {
  return request({
    url: '/admin/store/auditStore.html',
    method: 'post',
    data
  })
}
