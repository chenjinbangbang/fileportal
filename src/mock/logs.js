import Mock from 'mockjs';
import { param2Obj } from '@/utils';

const List = [];
const count = 100;

for(let i=0;i<count;i++){
  List.push(Mock.mock({
    id: '@increment', //递增1
    username: '@name', //模拟名称
    'content|1': [
      '添加用户添加用户添加用户添加用户添加用户添加用户添加用户添加用户添加用户',
      '删除用户删除用户删除用户删除用户删除用户删除用户删除用户删除用户删除用户',
      'region授权region授权region授权region授权region授权region授权region授权',
      '文件下载文件下载文件下载文件下载文件下载文件下载文件下载文件下载文件下载',
      '文件授权文件授权文件授权文件授权文件授权文件授权文件授权'
    ],
    'category|1': ['添加用户','删除用户','region授权','文件下载','文件授权'],
    time: '@datetime', //模拟日期时间
  }));
}

export default {
  //获取日志列表，查询
  getLogsList: config => {
    //console.log(config.body);
    const { searchkeys,page,limit } = JSON.parse(config.body);
    
    //将日期时间转化为毫秒数，进行比较
    // let startTime,endTime;
    // if(searchkeys.starttime && searchkeys.endtime){
    //   startTime = new Date(searchkeys.starttime).getTime();
    //   endTime = new Date(searchkeys.endtime).getTime();
    // }

    //查询
    // let mockList = List.filter(item => {
    //   if(searchkeys.search && item.username.indexOf(searchkeys.search) < 0) return false;
    //   if(startTime && endTime && (startTime > new Date(item.time).getTime() || endTime < new Date(item.time).getTime())) return false;
    //   return true;
    // });

    let mockList = List;

    const pageList = mockList.filter((item,index) => index < limit * page && index >= limit * (page-1)); //分页
    //console.log(pageList);

    let lists = {
      error_code: 0,
      data: {
        total: mockList.length,
        results: pageList
      }
    }

    return lists;
  }
};