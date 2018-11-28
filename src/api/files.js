import request from '@/utils/request';
import { encrypt } from '@/utils/encrypt';

//文件查询
export function fileQuery(data) {
  //console.log(data);

  //处理searchkeys
  let timestamp = JSON.stringify(data.timestamp);
  let customer_id = JSON.stringify(data.customer_id);
  let file_name = JSON.stringify(data.file_name);
  data = {
    region_id: data.region_id,
    site_id: data.site_id,
    page: data.page,
    limit: data.limit,
    customer_id,
    file_name,
    timestamp
  };

  return request({
    url: '/file_manage/query',
    method: 'get',
    params: data
  });
}

//文件下载
export function fileDownload(data) {
  return request({
    url: '/file_manage/download',
    method: 'get',
    params: data
  });
}

//文件授权列表（文件为key）
export function accredit_list(data) {
  return request({
    url: '/file_manage/accredit_list/by_file',
    method: 'get',
    params: data
  });
}

//文件权限配置
export function accreditFile(data) {
  return request({
    url: '/file_manage/accredit/file',
    method: 'post',
    data
  });
}

//文件删除
export function deleteFile(data) {
  return request({
    url: '/file_manage/delete',
    method: 'get',
    params: data
  });
}


//文件授权
export function fileAccredit(data) {
  return request({
    url: '/file_manage/accredit',
    method: 'post',
    params: data
  });
}

//文件授权列表（用户为key）
export function fileAccreditUser(data) {

  //处理searchkeys
  let searchkeys = JSON.stringify(data.searchkeys);
  data = {
    page: data.page,
    limit: data.limit,
    searchkeys
  };

  return request({
    url: '/file_manage/accredit_list/by_user',
    method: 'post',
    data
  });
}

//区域权限配置
export function accreditRegion(data) {
  return request({
    url: '/file_manage/accredit/region',
    method: 'post',
    data
  });
}

//网点权限配置
export function accreditSite(data) {
  return request({
    url: '/file_manage/accredit/site',
    method: 'post',
    data
  });
}

//文件预览
export function preview(data) {
  return request({
    url: '/file_manage/preview',
    method: 'get',
    params: data
  });
}

