<template>
	<div class="animated fadeIn journal">
		<div class="search">
        <Input placeholder="请输入用户名，多个用空格隔开" v-model="search" @keydown.enter.native="searchFn" clearable></Input>
        
        <DatePicker 
          v-model="listQuery.searchkeys.time" 
          type="datetimerange" 
          placeholder="请选择日期时间区间" 
          format="yyyy-MM-dd HH:mm:ss"
          style="width: 300px">
        </DatePicker>

        <Button type="primary" @click="searchFn">筛选日志</Button>

		</div>

		<Table :row-class-name="rowClassName" :columns="columns1" :data="data1"></Table>

		<div class="page">
			<Page :total="total" :current="listQuery.page" :page-size="listQuery.limit" size="small" @on-change="pageChange"></Page>
		</div>
	</div>
</template>

<script>

import { getLogsList } from "@/api/logs";
import axios from 'axios';
export default {
  data() {
    return {
      total: 0, //总数据
      //查询
      search: "", //用于把字符串转化为对象内容作为请求数据参数
      listQuery: {
        searchkeys: {
          username: [""],
          time: ["", ""]
        },
        page: 1, //当前页
        limit: 10 //一页多少条记录
      },

      columns1: [
        {
          title: "用户名",
          key: "username",
          width: 90,
          align: "center"
        },
        {
          title: "动作",
          key: "category",
          width: 90,
          align: "center"
        },
        {
          title: "操作时间",
          key: "time",
          width: 170,
          align: "center"
        },
        {
          title: "描述",
          key: "content",
          align: "center",
          minWidth: 200
        }
      ],
      data1: [
        // {
        //   username: "111",
        //   category: "添加用户",
        //   time: "2018-04-11 09:00:15",
        //   content:
        //     "添加用户添加用户添加用户添加用户添加用户添加用户添加用户添加用户添加用户"
        // },
        // {
        //   username: "222",
        //   category: "删除用户",
        //   time: "2018-04-11 09:00:15",
        //   content:
        //     "删除用户删除用户删除用户删除用户删除用户删除用户删除用户删除用户删除用户"
        // },
        // {
        //   username: "333",
        //   category: "region授权",
        //   time: "2018-04-11 09:00:15",
        //   content:
        //     "region授权region授权region授权region授权region授权region授权region授权"
        // },
        // {
        //   username: "444",
        //   category: "文件下载",
        //   time: "2018-04-11 09:00:15",
        //   content:
        //     "文件下载文件下载文件下载文件下载文件下载文件下载文件下载文件下载文件下载"
        // },
        // {
        //   username: "555",
        //   category: "删除用户",
        //   time: "2018-04-11 09:00:15",
        //   content: "删除用户删除用户删除用户删除用户删除用户删除用户"
        // },
        // {
        //   username: "666",
        //   category: "文件授权",
        //   time: "2018-04-11 09:00:15",
        //   content: "文件授权文件授权文件授权文件授权文件授权文件授权文件授权"
        // }
      ]
    };
  },
  created() {
    //获取日志列表
    this.getLogsList();
  
  },
  methods: {
    //获取日志列表
    getLogsList() {
      getLogsList(this.listQuery).then(res => {
        //console.log(res);
        if (res.error_code === 0) {
          this.data1 = res.data.results;
          this.total = res.data.total;
        }
      });
    },
    //搜索关键字
    searchFn() {
      this.listQuery.searchkeys.username = this.search.split(" ");

      if (this.listQuery.searchkeys.time[0]) {
        this.listQuery.searchkeys.time = [
          this.timeFormats(this.listQuery.searchkeys.time[0]),
          this.timeFormats(this.listQuery.searchkeys.time[1])
        ];
      }

      //获取区域列表
      this.getLogsList();
    },
    //切换页面
    pageChange(page) {
      this.listQuery.page = page;
      this.getLogsList();
    },
    rowClassName(row, index) {
      if (
        row.category.indexOf("添加") > -1 ||
        row.category.indexOf("更新") > -1
      ) {
        return "category-add";
      } else if (row.category.indexOf("删除") > -1) {
        return "category-del";
      } else if (row.category.indexOf("授权") > -1) {
        return "category-grant";
      } else if (row.category.indexOf("下载") > -1) {
        return "category-dw";
      }
      return "";
    }
  }
};
</script>
<style type="text/css">
.journal .ivu-table-wrapper {
  background: #c00;
}

.journal .ivu-table .ivu-table-body table {
  border-spacing: 0 10px;
}

.journal .ivu-table-wrapper,
.journal .ivu-table {
  border: none;
  background-color: #eff0f4;
}

.journal .ivu-table tr {
  margin-bottom: 4px;
}

.journal .ivu-table td {
  border: 1px solid #c00;
  border-right: none;
  border-left: none;
}

.journal .ivu-table th {
  border: 1px solid #495060;
  border-right: none;
  border-left: none;
  color: #fff;
  background-color: #80848f;
}

.journal .ivu-table th:first-child {
  border-left: 1px solid #495060;
  border-radius: 6px 0 0 6px;
}

.journal .ivu-table th:last-child {
  border-right: 1px solid #495060;
  border-radius: 0 6px 6px 0;
}

.journal .ivu-table td:first-child {
  border-left: 1px solid #c00;
  border-radius: 6px 0 0 6px;
}

.journal .ivu-table td:last-child {
  border-right: 1px solid #c00;
  border-radius: 0 6px 6px 0;
}

.journal .ivu-table:before {
  content: "";
  width: 100%;
  height: 0;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 1;
}

.journal .ivu-table:after {
  content: "";
  width: 1px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  background-color: #eff0f4;
  z-index: 3;
}

.journal .ivu-table .category-add td {
  background-color: #eaf4fe;
  border-color: #2d8cf0;
}

.journal .ivu-table .category-del td {
  background-color: #fdece8;
  border-color: #ed3f14;
}

.journal .ivu-table .category-grant td {
  background-color: #e8f9f0;
  border-color: #19be6b;
}

.journal .ivu-table .category-dw td {
  background-color: #fff5e6;
  border-color: #ff9900;
}
</style>