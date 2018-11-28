<template>
	<div>
		<navbar>
			<button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">&#9776;</button>
			<a class="logo">{{title}}</a>
			<ul class="nav navbar-nav d-md-down-none">
				<li class="nav-item">
					<a class="nav-link navbar-toggler sidebar-toggler" @click="sidebarMinimize">&#9776;</a>
				</li>
			</ul>
			<ul class="nav navbar-nav ml-auto">
				<Dropdown class="nav-item">
					<a href="javascript:void(0)">
						<span slot="button">
			          <img src="static/img/avatars/6.jpg" class="img-avatar" alt="o">
			          <span class="d-md-down-none">{{username}}</span>
						</span>
					</a>
					<Dropdown-menu slot="list">
						<Dropdown-item>
							<a @click="Modify">
								<p class="dropdown-itemp">
									<Icon type="locked"></Icon>修改密码</p>
							</a>
						</Dropdown-item>
						<Dropdown-item>
							<a @click="Logout">
								<p class="dropdown-itemp">
									<Icon type="power"></Icon>退出</p>
							</a>
						</Dropdown-item>
					</Dropdown-menu>
				</Dropdown>
			</ul>
		</navbar>
		<Modal v-model="modify" title="修改密码" :mask-closable="false" @on-cancel="resetForm">
			<Form :model="infoForm" ref="infoForm" :rules="infoRules" :label-width="80">
				<FormItem label="旧密码" prop="password">
					<Input v-model="infoForm.password" placeholder="请输入旧密码" clearable type="password" ></Input>
				</FormItem>
				<FormItem label="新密码" prop="newpwd">
					<Input v-model="infoForm.newpwd" placeholder="请输入新密码" clearable type="password"></Input>
				</FormItem>
				<FormItem>
					<Button type="primary"  @click="saveForm" :loading="saveLoading">提交</Button>
					<Button type="ghost" @click="resetForm">取消</Button>
				</FormItem>
			</Form>
		</Modal>
	</div>
</template>
<script>
import navbar from "./Navbar";
import { changePwd, validPwd } from "@/api/user";
export default {
  name: "header",
  data() {
    // let passwordReg = (rule, value, callback) => {
    //   validPwd({ password: value }).then(res => {
    //     if (res.error_code === 0) {
    //       callback();
    //     } else {
    //       callback(new Error("旧密码不正确！"));
    //     }
    //   });
    // };
    let newpwdReg = (rule, value, callback) => {
      if (value === this.infoForm.password) {
        callback(new Error("新密码不能和旧密码一样！"));
      } else {
        callback();
      }
    };
    return {
      title: process.env.title,
      username: this.$store.getters.username,
      modify: false,
      saveLoading: false, //密码修改提交按钮加载
      infoForm: {
        password: "",
        newpwd: ""
      },
      infoRules: {
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: "密码不能小于6位",
            trigger: "blur"
          }
          //{ validator: passwordReg, trigger: "blur" }
        ],
        newpwd: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: "密码不能小于6位",
            trigger: "blur"
          },
          { validator: newpwdReg, trigger: "blur" }
        ]
      }
    };
  },
  components: {
    navbar
  },
  methods: {
    //密码修改提交
    saveForm() {
      this.saveLoading = true;
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          changePwd(this.infoForm)
            .then(res => {
              if (res.error_code === 0) {
                this.$Notice.success({
                  title: "成功",
                  desc: "修改密码成功"
                });
                
                this.resetForm();
              }
              this.saveLoading = false;
            })
            .catch(err => {
              this.saveLoading = false;
            });
        } else {
          this.saveLoading = false;
        }
      });
    },
    //重置表单
    resetForm() {
      this.modify = false;
      this.$refs.infoForm.resetFields();
    },

    Modify() {
      this.modify = true;
    },
    Logout(e) {
      e.preventDefault();
      this.$store
        .dispatch("LogOut")
        .then(() => {
          this.$router.push({
            path: "/login"
          });
          location.reload();
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    click() {
      // do nothing
    },
    sidebarToggle(e) {
      e.preventDefault();
      document.body.classList.toggle("sidebar-hidden");
    },
    sidebarMinimize(e) {
      e.preventDefault();
      document.body.classList.toggle("sidebar-minimized");
    },
    mobileSidebarToggle(e) {
      e.preventDefault();
      document.body.classList.toggle("sidebar-mobile-show");
    }
  }
};
</script>

<style type="text/css" scoped>
.dropdown-itemp {
  text-align: left;
  font-size: 15px;
  padding: 10px;
}

.header-item .ivu-dropdown-item {
  padding: 15px;
}

.header-item {
  width: 130px;
}

.header-item a {
  color: white !important;
}

.ml-auto {
  padding-right: 20px;
}

.d-md-down-none {
  padding-left: 10px;
}

.dropdown-itemp i {
  padding-right: 6px;
}
</style>