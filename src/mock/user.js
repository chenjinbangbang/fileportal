import Mock from 'mockjs';
import { param2Obj } from '@/utils';

let List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment', //递增1
    username: '@name', //模拟名称
    password: '@first',
    email: '@email', //模拟email
    phone: /^1[34578]\d{9}$/, //手机号码正则
    id_number: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, //身份证号码正则
    'roles|1': [["super"], ["filemanager"], ["filebrowser"]], //随机选择数组中的其中一项
    introduction: '@cparagraph()' //模拟文本
  }));
}

export default {
  //获取用户列表，查询
  getUserList: config => {
    const { searchkeys, page, limit } = JSON.parse(config.body);

    //查询
    // let mockList = List.filter(item => {
    //   if(searchkeys && item.username.indexOf(searchkeys) < 0) return false;
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
  //添加用户
  createUser: config => {
    return {
      error_code: 0,
      data: {}
    }
  },
  //获取某个用户信息
  getUserInfo: config => {
    console.log(config);
    const { id } = param2Obj(config.url);

    let lists = List.filter(item => {
      return item.id == id;
    });

    return {
      error_code: 0,
      data: lists[0]
    }
  },
  //更新用户
  updateUser: config => {
    //console.log(config);
    return {
      error_code: 0,
      data: {}
    }
  },
  //重置用户密码
  resetUserPwd: config => {
    return {
      error_code: 0,
      data: {}
    }
  },
  //删除用户
  deleteUser: config => {
    return {
      error_code: 0,
      data: {}
    }
  }
};