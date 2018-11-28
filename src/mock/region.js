import Mock from 'mockjs';
import { param2Obj } from '@/utils';

let List = [], locationList = [];
const count = 10;

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: i+1, //递增1
    regionName: ['西北','华北','东北','华南','华东','华西','华中','西南','东南','西东'][i], //模拟区域
    //regionAddress: '@county',
    location_id: i,
    dbIp: '@ip', //模拟ip
    dbPort: '@ip',
    msIp: '@ip',
    msPort: '@ip',
    'clientNum|1-10000': 100, //1-10000的数字
    'storageAgencyNum|1-10000': 100,
    'status|1': [1, 2, 3], //随机选择数组中的其中一项
    comments: '@cparagraph()' //模拟文本
  }));
}

export default {
  //获取区域列表，查询
  getRegionList: config => {

    const { searchkeys, page, limit } = JSON.parse(config.body);

    //查询
    // let mockList = List.filter(item => {
    //   if (searchkeys.search && item.regionName.indexOf(searchkeys.search) < 0) return false;
    //   return true;
    // });

    let mockList = List;
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1)); //分页

    let lists = {
      error_code: 0,
      data: {
        total: mockList.length,
        results: pageList
      }
    }

    return lists;
  },
};