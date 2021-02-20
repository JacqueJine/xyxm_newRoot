import request from '@/utils/request'

// 获取审核店铺列表
export function getStoreList(data) {
  return request({
    url: '/admin/store/getStoreList.html',
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
