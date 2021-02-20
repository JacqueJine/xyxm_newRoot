import request from '@/utils/request'

// 获取学校列表
export function getSchoolList(data) {
  return request({
    url: '/admin/school/getSchoolList.html',
    method: 'post',
    data
  })
}
// 添加学校
export function addSchool(data) {
  return request({
    url: '/admin/school/addSchool.html',
    method: 'post',
    data
  })
}
// 修改学校
export function updateSchool(data) {
  return request({
    url: '/admin/school/updateSchool.html',
    method: 'post',
    data
  })
}
// 删除学校
export function delSchool(data) {
  return request({
    url: '/admin/school/delSchool.html',
    method: 'post',
    data
  })
}



// 获取任务列表
export function listTask(data) {
  return request({
    url: '/admin/task/listTask.html',
    method: 'post',
    data
  })
}
// 获取任务详情
export function getInfoTask(data) {
  return request({
    url: '/admin/task/getInfoTask.html',
    method: 'post',
    data
  })
}
