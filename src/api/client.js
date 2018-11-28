import request from '@/utils/request'; //axios默认配置
import qs from 'qs';

//获取客户端列表，查询
export function getClientList(data) {

  //处理searchkeys
  let searchkeys = JSON.stringify(data.searchkeys);
  data = {
    page: data.page,
    limit: data.limit,
    searchkeys
  };

  return request({
    url: '/file_manage/client_list',
    method: 'post',
    data
  })
}