import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function getBaseList(params) {
  return request({
    url: 'columnInfo/findColumnListByPage.json',
    method: 'post',
    data: {
      page: 1,
      rows: 10
    }
  })
}
