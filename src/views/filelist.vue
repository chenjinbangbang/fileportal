<template>
	<div class="filelist animated fadeIn">
		<div class="search">

        <Input placeholder="请输入身份证号，多个用空格隔开" v-model="customer_idSearch" @keydown.enter.native="searchFn" clearable></Input>
        <Input placeholder="请输入文件名，多个用空格隔开" v-model="file_nameSearch" @keydown.enter.native="searchFn" clearable></Input>

        <DatePicker 
          v-model="listQuery.timestamp" 
          type="datetimerange" 
          placeholder="请选择日期时间区间" 
          format="yyyy-MM-dd HH:mm:ss" 
          style="width: 300px">
        </DatePicker>

        <Button type="primary" @click="searchFn">搜索文件</Button>

		</div>

		<Table stripe :columns="columns1" :data="data1"></Table>

		<div class="page">
			<Page :total="total" :current="listQuery.page" :page-size="listQuery.limit" size="small" @on-change="pageChange"></Page>
		</div>

		<Modal title="权限用户列表" width="650" v-model="modal" class-name="vertical-center-modal filelist" :mask-closable="false" @on-cancel="resetForm">
			<div class="tool">
				<h6>添加权限用户<span class="tip">*若用户不存在，请新建用户</span></h6>
				<div class="find">
          <Form ref="permissionData" :model="permissionData" :rules="permissionDataRules" inline @submit.native.prevent>
            <FormItem prop="id_number">
              <Input placeholder="请输入身份证号" clearable v-model="permissionData.id_number"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="addpermissionFn('1',permissionData.id_number)">添加用户</Button>
            </FormItem>
          </Form>
					<!-- <Input placeholder="请输入姓名或身份证号" clearable style="width: 200px" v-model="id_number"></Input>
					<Button type="primary" @click="permissionFn">添加用户</Button> -->
				</div>
				<div class="newuser">
          <Form ref="userData" :model="userData" :rules="userDataRules" inline >
            <FormItem prop="username">
              <Input placeholder="请输入用户名" clearable v-model="userData.username"></Input>
            </FormItem>
            <FormItem prop="id_number">
              <Input placeholder="请输入身份证号" clearable v-model="userData.id_number"></Input>
            </FormItem>
            <FormItem>
              <Input value="默认密码身份证号后六位" disabled></Input>
            </FormItem>
            <FormItem>
              <Button type="success" @click="createUser">新建用户</Button>
            </FormItem>
          </Form>
				</div>
			</div>
			<Table stripe :columns="columns2" :data="data2"></Table>
		</Modal>

    <Modal title="预览资源" v-model="view"  width="1200" @on-close="resetFormView">
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
import {
  fileQuery,
  fileDownload,
  accredit_list,
  accreditFile,
  deleteFile,
  preview
} from "@/api/files";
import { createUser } from "@/api/user";
import { id_numberRule } from "utils/validate";

//引入DPlayer
import VueDPlayer from "@/components/myPlayer";

export default {
  components: { "d-player": VueDPlayer },
  data() {
    return {
      total: 0, //总数据
      customer_idSearch: "",
      file_nameSearch: "",
      listQuery: {
        region_id: "",
        site_id: "",
        customer_id: [""],
        file_name: [""],
        timestamp: ["", ""],
        page: 1, //当前页
        limit: 10 //一页多少条记录
      },

      view: false, //预览图片或视频资源的显示与隐藏
      //files: ['static/video/1.mp4','static/img/1.jpg','static/video/3.flv','static/img/2.jpg'], //预览的文件
      files: [],
      fileIndex: 0, //预览文件的索引

      //添加权限用户数据
      permissionData: {
        id_number: "" //指定用户id_number，文件权限配置需要
      },
      permissionDataRules: {
        id_number: [
          { required: true, message: "请输入身份证号码", trigger: "click" },
          { validator: id_numberRule, trigger: "click" }
        ]
      },
      file_hash: "", //点击修改权限记录，文件权限配置需要

      //添加用户的数据
      userData: {
        username: "",
        password: "",
        id_number: "",
        roles: ["filebrowser"]
      },
      userDataRules: {
        username: {
          required: true,
          message: "用户名不能为空",
          trigger: "click"
        },
        id_number: [
          { required: true, message: "请输入身份证号码", trigger: "click" },
          { validator: id_numberRule, trigger: "click" }
        ]
      },

      modal: false,
      showspin: false,
      columns1: [
        {
          type: "index",
          width: 40,
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
          title: "文件名",
          key: "file_name",
          minWidth: 80
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
        },
        {
          title: "权限设置",
          key: "setup",
          width: 90,
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
                    this.file_hash = params.row.file_hash;

                    //文件授权列表（文件为key）
                    this.accredit_list();
                    this.modal = true;
                  }
                }
              },
              "修改权限"
            );
          }
        },
        {
          title: "操作",
          key: "action",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  type: "error",
                  size: "small"
                },
                on: {
                  click: () => {
                    this.remove1(params.row.file_hash);
                  }
                }
              },
              "删除"
            );
          }
        }
      ],
      columns2: [
        {
          title: "姓名",
          key: "username",
          width: 100,
          align: "center"
        },
        {
          title: "身份证号",
          key: "id_number"
        },
        {
          title: "操作",
          key: "action",
          width: 90,
          align: "center",
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  type: "error",
                  size: "small"
                },
                on: {
                  click: () => {
                    this.remove2(params.row.id_number);
                  }
                }
              },
              "删除"
            );
          }
        }
      ],
      data1: [
        // {
        //   filename: "文件1",
        //   fileid: 1,
        //   type: 0,
        //   time: "2018-04-11 09:00:15",
        //   dlink: "http://www.anyun100.com/wap/test.docx"
        // },
        // {
        //   filename: "文件2",
        //   fileid: 2,
        //   type: 1,
        //   time: "2018-04-11 09:00:15",
        //   dlink: "http://www.anyun100.com/wap/test.docx"
        // }
      ],
      data2: [
        // {
        //   name: "天王盖地虎",
        //   idcard: "3333333333333"
        // },
        // {
        //   name: "宝塔镇河妖",
        //   idcard: "2222222222222"
        // }
      ]
    };
  },
  created() {
    //window.location = 'http://www.mjpai.cn/static/img/test.rar';
    //console.log(this.$route.query);
    let region_id = this.$route.query.region_id;
    let site_id = this.$route.query.site_id;
    if (region_id && site_id) { 
      this.listQuery.region_id = String(region_id);
      this.listQuery.site_id = String(site_id);
    }

    //获取区域列表
    this.fileQuery();

    //预览文件
    //this.viewFile();

  },
  mounted() {},
  methods: {
    //获取文件列表
    fileQuery() {
      //console.log(this.listQuery);
      fileQuery(this.listQuery).then(res => {
        if (res.error_code === 0) {
          this.data1 = res.data.results;
          this.total = res.data.total;
          //console.log(this.data1);
        }
      });
    },
    //搜索关键字
    searchFn() {
      this.listQuery.customer_id = this.customer_idSearch.split(" ");
      this.listQuery.file_name = this.file_nameSearch.split(" ");

      if (this.listQuery.timestamp[0]) {
        this.listQuery.timestamp = [
          this.timeFormats(this.listQuery.timestamp[0]),
          this.timeFormats(this.listQuery.timestamp[1])
        ];
      }

      //获取文件列表
      this.fileQuery();
    },
    //切换页面
    pageChange(page) {
      this.listQuery.page = page;
      this.fileQuery();
    },

    //文件授权列表（文件为key）
    accredit_list() {
      accredit_list({ file_hash: this.file_hash }).then(res => {
        if (res.error_code === 0) {
          this.data2 = res.data;
        }
      });
    },
    //点击给用户授权
    addpermissionFn(permission, id_number) {
      this.$refs.permissionData.validate(valid => {
        if (valid) {
          this.permissionFn(permission, id_number);
        }
      });
    },
    //给指定用户id_number的当前文件下授权
    permissionFn(permission, id_number) {
      let params = {
        region_id: this.listQuery.region_id,
        site_id: this.listQuery.site_id,
        file_hash: this.file_hash,
        id_number,
        permission
      };
      //console.log(params);

      accreditFile(params).then(res => {
        if (res.error_code === 0) {
          //文件授权列表（文件为key）
          this.accredit_list();

          this.$Notice.success({
            title: "成功",
            desc: "文件权限配置成功"
          });
        }
      });
    },

    //新建用户
    createUser() {
      let id_number = this.userData.id_number;

      let params = {
        username: this.userData.username,
        password: id_number.substr(id_number.length - 6, id_number.length),
        id_number: this.userData.id_number,
        roles: this.userData.roles
      };

      //console.log(params);

      this.$refs.userData.validate(valid => {
        if (valid) {
          createUser(params).then(res => {
            if (res.error_code === 0) {
              this.$Notice.success({
                title: "成功",
                desc: "添加用户成功"
              });
            }
          });
        }
      });
    },
    //重置表单
    resetForm() {
      this.$refs.permissionData.resetFields();
      this.$refs.userData.resetFields();
    },

    remove1(file_hash) {
      //this.data1.splice(index, 1);

      this.$Modal.confirm({
        title: "删除",
        content: "是否删除该数据？",
        onOk: () => {
          deleteFile({ file_hash }).then(res => {
            if (res.error_code === 0) {
              this.fileQuery();
              this.$Notice.success({
                title: "成功",
                desc: "删除文件成功"
              });
            }
          });
        }
      });
    },
    remove2(id_number) {
      //this.data2.splice(index, 1);

      this.$Modal.confirm({
        title: "取消",
        content: "是否取消该用户对该文件的授权？",
        onOk: () => {
          //给指定用户id_number的当前文件下授权
          this.permissionFn("0", id_number);
        }
      });
    },
    dw(file_hash) {
      this.showspin = true;

      fileDownload({ file_hash }).then(res => {
        if (res.error_code === 0) {
          //let file = window.open(res.data.path);
          //file.document.execCommand('SaveAs');
          //file.close();

          //window.location = 'http://www.mjpai.cn/static/img/test.rar';
          window.location = res.data.path;

          this.showspin = false;
        }
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
      this.view = true;
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

.newuser .ivu-form-item {
  //width:128px;
}
// .ivu-modal {
//   width: 650px !important;
// }

.filelist .ivu-modal .tool .tip {
  font-size: 12px;
  color: #c00;
  padding-left: 10px;
}

.filelist .find {
  text-align: right;
  padding-bottom: 20px;
}

.operate{
  display:flex;
  height:40px;
  align-items:center;
  justify-content:flex-end;
  .ivu-btn{
    margin-left:10px;
  }
  p{
    color:#f00;
    font-size:14px;
  }
}
</style>