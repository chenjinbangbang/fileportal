import Mock from 'mockjs';
import { param2Obj } from '@/utils';

let mockList = [];
const count = 100;

for (let i = 0; i < count; i++) {
  mockList.push(Mock.mock({
    site_id: '@increment',
    app_id: '@increment',
    timestamp: new Date().getTime(),
    'sgw_port|1': ['8000', '80'],
    'proxy_port|1': ['8000', '80'],
    sgw_ip: '@ip',
    proxy_ip: '@ip',
    file_md5: '09b65b3359e7f0d85c9a7c40c7516fda',
    file_name: 'test1.tar',
    'metadata_len|1-100': 1,
    'metadata|2': { "user_id": 10, "customer_id": 20 },
  }));
}

export default {
  //文件查询
  fileQuery: config => {
    const { limit,page } = param2Obj(config.url);
    
     //分页
    const pageList = mockList.filter((item,index) => index < limit * page && index >= limit * (page-1));

    let lists = {
      error_code: 0,
      data: {
        total: mockList.length,
        results: pageList
      }
    }

    return lists;

  },

  //文件下载
  fileDownload: config => {
    const { params } = param2Obj(config.url);

    let lists = {
      error_code: 0,
      data: {
        total: List.length,
        results: List
      }
    }
    return lists;
  },

  //文件授权
  fileAccredit: config => {
    const params  = JSON.parse(config.data);

    let lists = {
      error_code: 0,
      data: {}
    }
    return lists;
  },

  //文件授权列表（用户为key）
  fileAccreditUser: config => {
    const { params } = param2Obj(config.url);

    let lists = {
      error_code: 0,
      data: {
        total: List.length,
        results: List
      }
    }
    return lists;
  },

  //文件授权列表（文件为key）
  fileAccreditFile: config => {
    const { params } = param2Obj(config.url);

    let lists = {
      error_code: 0,
      data: {
        total: List.length,
        results: List
      }
    }
    return lists;
  },


}