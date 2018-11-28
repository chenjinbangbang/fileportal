<template>
	<div class="filelist animated fadeIn">

		<div class="search">
			<Input placeholder="请输入文件名，多个用空格隔开" v-model="search" @keydown.enter.native="searchFn" clearable></Input>
			<Button type="primary" @click="searchFn">搜索文件名</Button>
		</div>

		<Table stripe :columns="columns1" :data="data1"></Table>

		<div class="page">
			<Page :total="total" :current="listQuery.page" :page-size="listQuery.limit" size="small" @on-change="pageChange"></Page>
		</div>

    <Modal title="预览资源" v-model="view" width="1200" @on-close="resetFormView">
      <div class="operate">
        <p>有 {{files.length}} 个资源文件，当前为第 {{fileIndex+1}} 个</p>
        <Button type="primary" size="small" @click="viewPre" :disabled="fileIndex === 0">上一个</Button>
        <Button type="primary" size="small" @click="viewNext" :disabled="fileIndex === (files.length-1)">下一个</Button>
      </div>
      
      <d-player v-if="view"></d-player>
    </Modal>

	</div>
</template>
<script>
import { fileAccreditUser,fileDownload,preview } from "@/api/files";
//引入DPlayer
import VueDPlayer from "@/components/myPlayer";

export default {
  components: { "d-player": VueDPlayer }, 
  data() {
    return {
			total: 0, //总数据
      //查询
      search: "", //用于把字符串转化为对象内容作为请求数据参数
      listQuery: {
        searchkeys: {
          file_names: [""]
        },
        page: 1, //当前页
        limit: 20 //一页多少条记录 
      },

      view: false, //预览图片或视频资源的显示与隐藏
      //files: ['static/video/1.mp4','static/img/1.jpg','static/video/3.flv','static/img/2.jpg'], //预览的文件
      files: [],
      fileIndex: 0, //预览文件的索引

      modal: false,
      cipher: "000000",
      showspin: false,

      columns1: [
        {
          title: "文件名",
          key: "file_name"
        },
        {
          title: "客户端名",
          key: "site_name"
        },
        {
          title: "站点名",
          key: "region_name"
        },
        {
          title: "时间",
          key: "time",
          width: 170,
          align: "center"
        },
        {
          title: "预览",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  type: "success",
                  size: "small"
                },
                on: {
                  click: () => {
                    let file_hash = params.row.file_hash;

                    preview({ file_hash }).then(res => {
                      if (res.error_code === 0) {
                        this.files = res.data.files;

                        this.viewFile();
                      }
                    });
                  }
                }
              },
              "预览"
            );
          }
        },
        {
          title: "文件下载",
          key: "dlink",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  position: "relative"
                }
              },
              [
                h(
                  "Button",
                  {
                    props: {
                      type: "warning",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.dw(params.row.file_hash);
                      }
                    }
                  },
                  this.name(params.row.is_local)
                ),
                h(this.show(this.showspin), {
                  props: {
                    size: "large",
                    fix: ""
                  }
                })
              ]
            );
          }
        }
      ],
      data1: [
        // {
        //   file_name: "文件1",
        //   clientname: "客户端名1",
        //   regionname: "站点名1",
        //   fileid: 1,
        //   type: 0,
        //   time: "2018-04-11 09:00:15",
        //   dlink: "http://www.anyun100.com/wap/test.docx"
        // },
        // {
        //   file_name: "文件2",
        //   clientname: "客户端名2",
        //   regionname: "站点名2",
        //   fileid: 2,
        //   type: 1,
        //   time: "2018-04-11 09:00:15",
        //   dlink: "http://www.anyun100.com/wap/test.docx"
        // }
      ]
    };
	},
	created(){
		//获取文件授权列表（用户为key）
    this.getFileList();

    //预览文件
    //this.viewFile();
	},
  methods: {
		//获取文件授权列表（用户为key）
    getFileList() {
      fileAccreditUser(this.listQuery).then(res => {
        if (res.error_code === 0) {
          this.data1 = res.data.results;
					this.total = res.data.total;
					//console.log(this.data1);
        }
      });
    },
    //搜索关键字
    searchFn() {
      this.listQuery.searchkeys.file_names = this.search.split(" ");
      
      //获取文件授权列表（用户为key）
      this.getFileList();
    },
    //切换页面
    pageChange(page) {
      this.listQuery.page = page;
      this.getFileList();
		},
		
    dw(file_hash) {
       this.showspin = true;
      
      fileDownload({ file_hash }).then(res => {
        if (res.error_code === 0) {
          //window.open(res.data.path);
          window.location = res.data.path;
        }
        this.showspin = false;
      });
    },
    show(val) {
      if (val != false) {
        return "Spin";
      }
    },
    name(is_local) {
      if (!is_local) {
        return "远程下载";
      } else {
        return "本地下载";
      }
    },

    //预览文件
    viewFile(){
      this.$store.commit('SET_FILE',this.files[this.fileIndex]);
      setTimeout(() => {
        this.view = true;
      },1000);
      
    },
    //预览上一个
    viewPre(){
      if((this.fileIndex+1) > 0){
        this.fileIndex--;

        this.viewFile();
        this.$store.commit('SET_FILE',this.files[this.fileIndex]);
        
      }
    },
    //预览下一个
    viewNext(){
      if((this.fileIndex+1) < this.files.length){
        this.fileIndex++;
        this.viewFile();
        this.$store.commit('SET_FILE',this.files[this.fileIndex]);
      }
    },
    //重置
    resetFormView(){
        this.fileIndex = 0;
    }
  }
};
</script>
<style lang="scss">
.filelist .ivu-table th {
  background-color: #2db7f5;
  color: #fff;
  font-size: 12px;
}

.filelist.vertical-center-modal {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}

.filelist.vertical-center-modal .ivu-modal {
  top: 0;
}

.filelist .ivu-modal .ivu-modal-body {
  max-height: 60vh;
  overflow-y: auto;
}

.filelist .ivu-modal .tool {
  padding-bottom: 20px;
}

.filelist .ivu-modal .tool h6 {
  padding-bottom: 10px;
  font-size: 14px;
}

.filelist .ivu-modal .tool input,
.filelist .ivu-modal .tool button {
  margin-bottom: 6px;
}

.filelist .ivu-modal .tool .find {
  padding-bottom: 14px;
  border-bottom: 1px solid #eee;
}

.filelist .ivu-modal .tool .newuser {
  padding-top: 14px;
}

.filelist .ivu-modal .tool .tip {
  font-size: 12px;
  color: #c00;
  padding-left: 10px;
}
</style>