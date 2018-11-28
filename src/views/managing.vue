<template>
	<div class="animated fadeIn filelist">
		<div class="search">
        <Input placeholder="请输入身份证号，多个用空格隔开" v-model="search" @keydown.enter.native="searchFn" clearable></Input>
        <Button type="primary" @click="searchFn">搜索用户</Button>
        <Button type="success" @click="accounts">新建用户</Button>
		</div>

		<Table :columns="columns1" :data="data1" :loading="loading"></Table>
		
		<div class="page">
			<Page :total="total" :current="listQuery.page" :page-size="listQuery.limit" size="small" @on-change="pageChange"></Page>
		</div>

		<Modal v-model="modal1" title="修改权限" class="xgqx">
			<!-- <Collapse @on-change="data2Change">
				<Panel v-for="(item,index) in data2" key="">
					{{item.region_name}}
					<p class="kg"></p>
					<i-switch size="small" class="switch" v-model="item.permission"></i-switch>
					<div slot="content">
						<P v-for="item1 in item.site" key="">
							{{item1.site_name}}
							<i-switch size="small" class="switch" v-model="item1.permission"></i-switch>
						</P>
					</div>
				</Panel>
			</Collapse> -->
      <div class="change-auth" v-for="(item,index) in data2">
        <div class="region" @mouseover="recordRegion_id(item.region_id)">
          <p>{{item.region_name}}</p>
          <i-switch size="small" class="switch" v-model="item.permission" @on-change="changeRegion"></i-switch>
        </div>
        <transition name="authAnim">
          <div class="site" v-if="item.permission">
            <ul>
              <li v-for="item1 in item.site" @mouseover="recordSite_id(item.region_id,item1.site_id)">
                <p>{{item1.site_name}}</p>
                <i-switch size="small" class="switch" v-model="item1.permission" @on-change="changeSite"></i-switch>
              </li>
            </ul>
          </div>
        </transition>
      </div>
		</Modal>

		<Modal v-model="modal2" class="xgqx" title="用户信息" :mask-closable="false" @on-cancel="resetForm">
			<Form :model="dataForm" ref="dataForm" :label-width="80" :rules="rules">
				<FormItem label="编号" prop="id" v-show="dataForm.id">
					<p>{{dataForm.id}}</p>
				</FormItem>
				<FormItem label="用户名" prop="username">
					<Input v-model="dataForm.username" placeholder="请输入姓名" clearable style="width: 150px"></Input>
				</FormItem>
				<FormItem label="密码" prop="password" v-show="dataFormIndex === 0">
					<Input v-model="dataForm.password" placeholder="请输入密码" clearable type="password" style="width: 150px"></Input>
				</FormItem>
				<FormItem label="邮箱" prop="email">
					<Input v-model="dataForm.email" placeholder="请输入邮箱" clearable style="width: 150px"></Input>
				</FormItem>
				<FormItem label="手机号" prop="phone">
					<Input v-model="dataForm.phone" placeholder="请输入电话号码" clearable style="width: 150px"></Input>
				</FormItem>
				<FormItem label="身份证号" prop="id_number">
					<Input v-model="dataForm.id_number" placeholder="请输入身份证号" clearable style="width: 150px"></Input>
				</FormItem>
				<FormItem label="管理权限" prop="roles">
					<RadioGroup v-model="dataForm.roles[0]" type="button" @on-change="ttt">
						<!-- <Radio label="超管"></Radio>
						<Radio label="文件管理"></Radio>
						<Radio label="查看用户"></Radio> -->
						<Radio label="super">超管</Radio>
						<Radio label="filemanager">文件管理</Radio>
						<Radio label="filebrowser">查看用户</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="用户说明" prop="introduction">
					<Input v-model="dataForm.introduction" placeholder="用户说明" clearable type="textarea" :autosize="{minRows: 4,maxRows: 10}"></Input>
				</FormItem>
				<FormItem>
					<Button type="primary"  @click="saveForm" :loading="saveLoading">确定</Button>
					<Button type="ghost" @click="resetForm">取消</Button>
				</FormItem>
			</Form>
		</Modal>

	</div>
</template>
<script>
import {
  getUserList,
  createUser,
  getUserInfo,
  updateUser,
  resetUserPwd,
  deleteUser,
  accredit_list
} from "@/api/user";
import { accreditRegion, accreditSite } from "@/api/files";
import { id_numberRule } from "utils/validate";

import qs from "qs";

//创建访问区域权限子节点
let accredit = (h, params) => {
  let lists = params.row.accredit_list;

  //console.log(this.$slots);
  let arr = [];
  lists.forEach(item => {
    if (item.permission === "1") {
      let siteArr = "访问网点权限：";
      item.site.forEach(item1 => {
        if (item1.permission === "1") {
          siteArr += item1.site_name + `，`;
        }
      });
      //console.log(siteArr);

      arr.push(
        h(
          "Tooltip",
          {
            props: {
              placement: "top",
              content: siteArr.length > 7 ? siteArr : "无"
            }
          },
          [
            //h("div", { props: { slot: "content" } }, "xxxx"), //使用slot无效
            h("p", { style: { color: "#19be6b" } }, item.region_name+'，')
          ]
        )
      );
    }
  });
  return arr;
};

export default {
  components: {},
  data() {
    return {
      total: 0, //总数据
      loading: true, //数据加载
      //查询
      search: "", //用于把字符串转化为对象内容作为请求数据参数
      listQuery: {
        searchkeys: {
          id_number: [""]
        },
        page: 1, //当前页
        limit: 20 //一页多少条记录
      },

      modal1: false, //修改权限的显示与隐藏
      id: null, //记录用户id，修改权限配置需要
      region_id: null, //记录region_id，修改权限配置需要
      site_id: null, //记录site_id，修改权限配置需要

      modal2: false, //表单显示与隐藏
      saveLoading: false, //保存按钮加载的显示与隐藏
      dataFormIndex: 0, //0代表新增，1代表更新
      dataForm: {
        //表单的数据
        id: null,
        username: "",
        password: "",
        email: "",
        phone: "",
        id_number: "",
        roles: ["super"],
        introduction: ""
      },

      //表单验证
      rules: {
        username: {
          required: true,
          message: "用户名不能为空",
          trigger: "blur"
        },
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: "密码不能小于6位",
            trigger: "blur"
          }
        ],
        email: {
          type: "email",
          message: "请输入正确的电子邮箱格式",
          trigger: "blur"
        },
        phone: {
          type: "string",
          pattern: /^1[34578]\d{9}$/,
          message: "请输入正确的手机号码格式",
          trigger: "blur"
        },
        id_number: [
          { required: true, message: "身份证号码不能为空", trigger: "blur" },
          {
            type: "string",
            //pattern: /^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/,
            //message: "请输入合法的身份证号码",
            validator: id_numberRule,
            trigger: "blur"
          }
        ],
        roles: {
          required: true,
          type: "array",
          message: "权限不能为空",
          trigger: "blur"
        },
        introduction: {
          type: "string",
          max: 500,
          message: "用户说明不能大于500个字",
          trigger: "blur"
        }
      },

      clientWidth: true,
      columns1: [
        {
          title: "用户名",
          key: "username",
          align: "center",
          width: 100
        },
        {
          title: "身份证号",
          key: "id_number",
          align: "center",
          minWidth: 180,
          render: (h, params) => {
            return params.row.id_number.replace(
              params.row.id_number.substr(6, 8),
              "*******"
            );
          }
        },
        {
          title: "备注说明",
          key: "introduction",
          align: "center",
          minWidth: 150
        },
        {
          title: "访问区域权限",
          key: "accredit_list",
          align: "center",
          minWidth: 150,
          render: (h, params) => {
            return h("div", {}, accredit(h, params));
          }
        },
        {
          title: "管理操作",
          key: "action",
          width: 460,
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  //display: "flex",
                  //justifyContent: "space-between"
                },
                class: "operation"
              },
              [
                // h(
                //   "Button",
                //   {
                //     props: {
                //       type: params.row.roles ? (params.row.roles.indexOf('filebrowser') < 0 ? 'primary' : 'ghost') : 'text',
                //       //type: 'primary',
                //       size: "small"
                //     },
                //     on: {
                //       click: () => {
                //         if(params.row.roles.indexOf('filebrowser') < 0){
                //           this.show(params);
                //         }else{
                //           this.$Message.warning('超级管理员无权对查看用户分配文件权限！');
                //         }
                //       }
                //     }
                //   },
                //   "文件权限"
                // ),
                h(
                  "Button",
                  {
                    props: {
                      // type: params.row.roles
                      //   ? params.row.roles.indexOf("filebrowser") < 0
                      //     ? "success"
                      //     : "ghost"
                      //   : "text",
                      // size: "small"
                      type: "success",
                      size: "small"
                    },
                    attrs: {
                      style: params.row.roles
                        ? params.row.roles.indexOf("filemanager") >= 0 //&&
                          ? //params.row.id_number !== this.$store.getters.id_number
                            "" //文件管理员不需要隐藏
                          : "display:none;" //超级管理员和查看用户需要隐藏
                        : ""
                    },
                    on: {
                      click: () => {
                        this.setup(params.row.id);
                        // if (params.row.roles.indexOf("filebrowser") < 0) {
                        //   this.setup(params.row.id);
                        // } else {
                        //   this.$Message.warning(
                        //     "超级管理员无权对查看用户进行设置权限！"
                        //   );
                        // }
                      }
                    }
                  },
                  "文件权限"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "warning",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        let id = params.row.id;
                        this.resetUserPwd(id);
                      }
                    }
                  },
                  "重置用户密码"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "success",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.change(params.row.id);
                      }
                    }
                  },
                  "查看/更新用户"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        //console.log(params.row.id);
                        let id = params.row.id;
                        this.deleteUser(id);
                      }
                    }
                  },
                  "删除用户"
                )
              ]
            );
          }
        }
      ],
      data1: [
        // {
        //   username: "用户1",
        //   id_number: "4444444444444",
        //   userid: "111",
        //   introduction:
        //     "备注说明备注说明备注说明备注说明备注说明备注说明备注说明",
        //   region: [
        //     {
        //       regionname: "region1",
        //       client: ["client1-1", "client1-2", "client1-3"]
        //     },
        //     {
        //       regionname: "region2",
        //       client: ["client2-1", "client2-2", "client2-3"]
        //     }
        //   ]
        // },
        // {
        //   username: "用户2",
        //   id_number: "5555555555555",
        //   userid: "222",
        //   introduction:
        //     "备注说明备注说明备注说明备注说明备注说明备注说明备注说明",
        //   region: [
        //     {
        //       regionname: "region1",
        //       client: ["client1-1", "client1-2", "client1-3"]
        //     }
        //   ]
        // }
      ],
      data2Val: "0",
      data2: [
        // {
        //   title: "站点1",
        //   children: [
        //     {
        //       title: "客户端 1-1"
        //     },
        //     {
        //       title: "客户端 1-2"
        //     }
        //   ]
        // },
        // {
        //   title: "站点2",
        //   children: [
        //     {
        //       title: "客户端 2-1"
        //     },
        //     {
        //       title: "客户端 2-2"
        //     }
        //   ]
        // }
      ]
    };
  },
  created() {
    //获取用户列表
    this.getUserList();

    //根据浏览器可见宽度显示隐藏备注说明列
    this.showColumn();
    window.onresize = this.showColumn;

    //测试client
    // let data = {
    //   app_id: 1,
    //   file_path:
    //     "D:/phpStudy/WWW/work/video/web/examples/RemoteRecordDemo(web)/home/2018-05-16-15-56-35_xx_440303198905035361_1.mp4",
    //   metadata: {
    //     user_id: "eee",
    //     customer_id: "440303198905035361"
    //   }
    // };

    // let metadata = JSON.stringify(data.metadata);
    // data.metadata = metadata;
    // data = qs.stringify(data);
    // console.log(data);

    // this.$http.post("/v1/pretransfer", data).then(res => {
    //   console.log(111);
    // });

  },
  mounted() {
    let kg = document.querySelectorAll(".kg");
    kg.forEach(function(dom) {
      dom.onclick = function(e) {
        e.stopPropagation();
      };
    });
  },
  methods: {
    //获取用户列表
    getUserList() {
      this.loading = true;
      getUserList(this.listQuery)
        .then(res => {
          //console.log(res);
          if (res.error_code === 0) {
            this.data1 = res.data.results;
            this.total = res.data.total;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    //搜索关键字
    searchFn() {
      this.listQuery.searchkeys.id_number = this.search.split(" ");

      //获取用户列表
      this.getUserList();
    },
    //提交表单，添加/更新
    saveForm() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.saveLoading = true;
          if (this.dataFormIndex === 0) {
            //添加
            createUser(this.dataForm)
              .then(res => {
                if (res.error_code === 0) {
                  this.getUserList();

                  this.$Notice.success({
                    title: "成功",
                    desc: "添加用户成功"
                  });

                  this.resetForm();
                }
                this.saveLoading = false;
              })
              .catch(err => {
                this.saveLoading = false;
              });
          } else {
            delete this.dataForm.password;
            //更新
            updateUser(this.dataForm)
              .then(res => {
                if (res.error_code === 0) {
                  this.getUserList();
                  this.modal2 = false;
                  this.resetForm();

                  this.$Notice.success({
                    title: "成功",
                    desc: "更新用户成功"
                  });
                }
                this.saveLoading = false;
              })
              .catch(err => {
                this.saveLoading = false;
              });
          }
        } else {
          this.$Message.error("输入信息有误！");
        }
      });
    },
    //重置用户密码
    resetUserPwd(id) {
      this.$Modal.confirm({
        title: "重置",
        content: "是否重置用户密码为身份证最后6位",
        onOk: () => {
          resetUserPwd({ id }).then(res => {
            if (res.error_code === 0) {
              //this.getUserList();
              this.$Notice.success({
                title: "成功",
                desc: "重置用户密码成功"
              });
            }
          });
        }
      });
    },
    //删除用户
    deleteUser(id) {
      this.$Modal.confirm({
        title: "删除",
        content: "是否删除该数据？",
        onOk: () => {
          deleteUser({ id }).then(res => {
            if (res.error_code === 0) {
              this.getUserList();
              this.$Notice.success({
                title: "成功",
                desc: "删除用户成功"
              });
            }
          });
        }
      });
    },
    //重置表单
    resetForm() {
      this.modal2 = false;
      this.$refs.dataForm.resetFields();
    },

    //获取用户已授权列表
    accredit_list() {
      accredit_list({ id: this.id }).then(res => {
        if (res.error_code === 0) {
          this.data2 = res.data;

          this.data2.forEach(item => {
            item.permission = item.permission === "1" ? true : false;
            item.site.forEach(item => {
              item.permission = item.permission === "1" ? true : false;
            });
          });
          //console.log(this.data2);

          this.modal1 = true;
        }
      });
    },

    //=========================设置权限===============================
    //记录点中的region_id
    recordRegion_id(region_id) {
      this.region_id = region_id;
    },
    //区域权限配置
    changeRegion(val) {
      console.log(val);
      let params = {
        id: this.id,
        region_id: this.region_id,
        permission: val ? "1" : "0" //处理permission为0或1
      };
      //console.log(params);
      accreditRegion(params).then(res => {
        if (res.error_code === 0) {
          //获取用户已授权列表
          this.accredit_list();

          //获取用户列表
          this.getUserList();
        }
      });
    },
    //记录点中的region_id
    recordSite_id(region_id, site_id) {
      this.region_id = region_id;
      this.site_id = site_id;
    },
    //区域权限配置
    changeSite(val) {
      //console.log(val);
      let params = {
        id: this.id,
        region_id: this.region_id,
        site_id: this.site_id,
        permission: val ? "1" : "0" //处理permission为0或1
      };
      //console.log(params);
      accreditSite(params).then(res => {
        if (res.error_code === 0) {
          //获取用户已授权列表
          this.accredit_list();

          //获取用户列表
          this.getUserList();
        }
      });
    },

    //切换页面
    pageChange(page) {
      this.listQuery.page = page;
      this.getUserList();
    },
    ttt(xxx) {
      //console.log(xxx);
    },
    showColumn() {
      if (document.body.clientWidth < 1200 && this.clientWidth == true) {
        this.columns1.splice(2, 2);
        this.clientWidth = false;
      } else if (
        document.body.clientWidth > 1200 &&
        this.clientWidth == false
      ) {
        this.columns1.splice(
          2,
          0,
          {
            title: "备注说明",
            key: "introduction",
            align: "center",
            minWidth: 150
          },
          {
            title: "访问区域权限",
            key: "accredit_list",
            align: "center",
            minWidth: 150,
            render: (h, params) => {
              return h("div", {}, accredit(h, params));
            }
          }
        );
        this.clientWidth = true;
      }
    },
    //文件权限
    show(params) {
      let dom = "";
      params.row.region.forEach(function(value) {
        let regionname =
          "<div><span>站点：</span>" +
          value.regionname +
          '</div><div class="eject"><span>客户端：</span>';
        value.client.forEach(function(val) {
          let client = val + "、";
          regionname += client;
        });

        dom += regionname;
        dom += "</div>";
      });
      this.$Modal.info({
        title: "已有权限",
        content: dom
      });
    },
    //设置权限
    setup(id) {
      //获取已授权列表
      this.id = id;
      this.accredit_list();
    },
    accounts() {
      this.modal2 = true;
      this.dataFormIndex = 0;
    },
    change(id) {
      this.modal2 = true;
      this.dataFormIndex = 1;

      getUserInfo({ id }).then(res => {
        if (res.error_code === 0) {
          this.dataForm = res.data;
        }
      });
    }
  }
};
</script>
<style lang="scss">
//折叠动画
.authAnim-enter,
.authAnim-leave-to {
  transform: scale(0, 1);
  opacity: 0;
}
.authAnim-enter-active,
.authAnim-leave-active {
  transition: all 0.5s;
}

.filelist .ivu-table th {
  background-color: #2db7f5;
  color: #fff;
  font-size: 12px;
}

.eject {
  padding-bottom: 10px;
}

.ivu-modal-body {
  max-height: 75vh;
  overflow-y: auto;
}

.ivu-collapse > .ivu-collapse-item > .ivu-collapse-header > i {
  display: none;
}

#xx {
  border: 2px solid #f00;
}

.ivu-collapse > .ivu-collapse-item p {
  height: 38px;
  line-height: 38px;
}

.switch {
  display: inline-block;
  float: right;
  margin: 12px 20px 0 0;
}

.ivu-collapse-content {
  padding-right: 0;
}

.xgqx {
  > div {
  }
  .change-auth {
    border: 1px solid #ddd;
    .region {
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      background-color: #f7f7f7;
      p {
      }
      .switch {
        margin: 0;
      }
    }
    .site {
      ul {
        li {
          height: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px 0 40px;
          p {
          }
          .switch {
            margin: 0;
          }
        }
      }
    }
  }
}

.kg {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}

.operation {
  float: right;
  button {
    margin-left: 20px;
  }
}
</style>