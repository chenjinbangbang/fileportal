import request from '@/utils/request'; //axios默认配置

//获取日志列表，查询
export function getLogsList(data) {

  //处理searchkeys
  let searchkeys = JSON.stringify(data.searchkeys);
  data = {
    page: data.page,
    limit: data.limit,
    searchkeys
    };

  return request({
    url: '/logs/list',
    method: 'post',
    data
  })
}