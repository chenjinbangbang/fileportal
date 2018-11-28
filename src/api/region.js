import request from '@/utils/request'; //axios默认配置

//获取区域列表，查询
export function getRegionList(data) {

  //处理searchkeys
  let searchkeys = JSON.stringify(data.searchkeys);
  data = {
    page: data.page,
    limit: data.limit,
    searchkeys
  };

  return request({
    url: '/file_manage/region_list',
    method: 'post',
    data
  })
}