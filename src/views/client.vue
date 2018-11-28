<template>
	<div class="filelist animated fadeIn">

    <div class="search">
			<Input placeholder="请输入客户端名称，多个用空格隔开" v-model="search" @keydown.enter.native="searchFn" clearable></Input>
			<Button type="primary" @click="searchFn">搜索客户端</Button>
		</div>

		<Table stripe :columns="columns1" :data="data1"></Table>

		<div class="page">
			<Page :total="total" :current="listQuery.page" :page-size="listQuery.limit" size="small" @on-change="pageChange"></Page>
		</div>

	</div>

</template>
<script>
import { getClientList } from '@/api/client';
export default {
  data() {
    return {
      total: 0, //总数据
      //查询
      search: "", //用于把字符串转化为对象内容作为请求数据参数
      listQuery: {
        searchkeys: {
          client_names: [""],
          region_id: ''
        },
        page: 1, //当前页
        limit: 20 //一页多少条记录
      },

      columns1: [
        {
          type: "index",
          width: 60,
          align: "center",
          renderHeader: (h, params) => {
            return h(
              "p",
              {
                style: {
                  fontSize: "26px",
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    this.$router.back(-1);
                  }
                }
              },
              "‹"
            );
          }
        },
        {
          title: "客户端名",
          key: "clientName"
        },
        {
          title: "查看",
          key: "client",
          width: 100,
          align: "center",
          render: (h, params) => {
            if (this.$store.getters.token != "admin") {
              return h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.next(params.row.site_id);
                    }
                  }
                },
                "查看"
              );
            }
          }
        }
      ],
      data1: [
        // {
        //   name: "客户端1",
        //   fileid: "1"
        // },
        // {
        //   name: "客户端2",
        //   fileid: "2"
        // }
      ]
    };
	},
	created(){

    let region_id =  this.$route.query.region_id;
    if(region_id){
      this.listQuery.searchkeys.region_id = String(region_id);
    }else{
      this.$router.push({path: '/region'});
    }

		//获取客户端列表
    this.getClientList();

	},
  methods: {
		//获取客户端列表
    getClientList() {
      getClientList(this.listQuery).then(res => {
        if (res.error_code === 0) {
          this.data1 = res.data.results;
          this.total = res.data.total;
        }
      });
		},
		//搜索关键字
    searchFn() {
      this.listQuery.searchkeys.client_names = this.search.split(" ");

      //获取客户端列表
      this.getClientList();
		},
		//切换页面
    pageChange(page) {
      this.listQuery.page = page;
      this.getClientList();
		},
		
    next(site_id) {
      this.$router.push({
        path: "/filelist",
        query: { region_id: this.$route.query.region_id,site_id }
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