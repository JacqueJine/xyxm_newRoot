import request from '@/utils/request'

// 社区帖子列表
export function getPostsLists(data) {
  return request({
    url: '/admin/community/getPostsLists.html',
    method: 'post',
    data
  })
}
// 社区帖子详情
export function getPostsInfo(data) {
  return request({
    url: '/admin/community/getPostsInfo.html',
    method: 'post',
    data
  })
}
// 删除帖子
export function deletePosts(data) {
  return request({
    url: '/admin/community/deletePosts.html',
    method: 'post',
    data
  })
}


