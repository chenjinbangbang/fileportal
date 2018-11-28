<template>
	<div class="filelist animated fadeIn">
		<div class="search">
			<Input placeholder="请输入站点名称，多个用空格隔开" v-model="search" @keydown.enter.native="searchFn" clearable></Input>
			<Button type="primary" @click="searchFn">搜索站点</Button>
		</div>

		<Table stripe :columns="columns1" :data="data1"></Table>

		<div class="page">
			<Page :total="total" :current="listQuery.page" :page-size="listQuery.limit" size="small" @on-change="pageChange"></Page>
		</div>

	</div>
</template>
<script>
import { getRegionList } from "@/api/region";
export default {
  data() {
    return {
      total: 0, //总数据
      //查询
      search: "", //用于把字符串转化为对象内容作为请求数据参数
      listQuery: {
        searchkeys: {
          regionName: [""]
        },
        page: 1, //当前页
        limit: 20 //一页多少条记录
      },

      columns1: [
        {
          title: "站点名",
          key: "regionName"
        },
        {
          title: "查看",
          key: "client",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  type: "primary",
                  size: "small"
                },
                on: {
                  click: () => {
                    this.next(params.row.region_id);
                  }
                }
              },
              "查看"
            );
          }
        }
      ],
      data1: [
        // {
        //   name: "站点1",
        //   clientid: "1"
        // },
        // {
        //   name: "站点2",
        //   clientid: "2"
        // }
      ]
    };
  },
  created() {
    //获取区域列表
    this.getRegionList();
  },
  methods: {
    //获取区域列表
    getRegionList() {
      getRegionList(this.listQuery).then(res => {
        if (res.error_code === 0) {
          this.data1 = res.data.results;
          this.total = res.data.total;
        }
      });
    },
    //搜索关键字
    searchFn() {
      this.listQuery.searchkeys.regionName = this.search.split(" ");

      //获取区域列表
      this.getRegionList();
    },
    //切换页面
    pageChange(page) {
      this.listQuery.page = page;
      this.getRegionList();
    },
    
    next(region_id) {
      this.$router.push({
        path: "/client",
        query: { region_id }
      });
    }
  }
};
</script>
<style type="text/css">
.filelist .ivu-table th {
  background-color: #2db7f5;
  color: #fff;
  font-size: 12px;
}
</style>