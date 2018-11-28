<template>
	<div class="video">

    <Form :model="dataForm" ref="dataForm" :label-width="80" class="dataForm" v-if="!loginSuccess">
				<FormItem label="服务器：" prop="serverList"> 
          <Input v-model="dataForm.serverList" placeholder="请输入服务器" clearable></Input>
				</FormItem>
				<FormItem label="用户名：" prop="authAcnt">
					<Input v-model="dataForm.authAcnt" placeholder="请输入用户名" clearable></Input>
				</FormItem>
				<FormItem label="密码：" prop="authPswd">
					<Input v-model="dataForm.authPswd" placeholder="请输入密码" clearable type="password"></Input>
				</FormItem>
				<FormItem label="登录昵称：" prop="nickName">
					<Input v-model="dataForm.nickName" placeholder="请输入昵称昵称" clearable></Input>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="submit" :loading="saveLoading">登录</Button>
				</FormItem>
			</Form>

      <div class="loginSuccess" v-else>
        登录成功
        <Button type="info" @click="logout">注销</Button>
      </div>

	</div>
</template>

<script>
import md5 from "js-md5";

export default {
  name: "video",
  data() {
    return {
      //表单数据
      dataForm: {
        serverList: "rtc.cloudroom.com",
        authAcnt: "13811111111",
        authPswd: "123456",
        nickName: "安云100"
      },
      saveLoading: false, //登录中
      loginSuccess: false, //是否登录成功
      sdk: null //sdk是否可用
    };
  },
  components: {},
  created() {
    //sdk初始化
    this.sdkInit();
  },
  mounted() {},
  methods: {
    //sdk初始化
    sdkInit() {
      //SDK初始化
      let sdkUsePath = "";
      let statCallSer = 1;
      let statMediaSer = 1;
      let statHttp = 0;
      let result = CRVideo_Init2(
        sdkUsePath,
        statCallSer,
        statMediaSer,
        statHttp
      ); //成功时返回0
      //console.log(CRVideo_NOERR);

      if (result == CRVideo_OCX_VERSION_NOTUPPORTED) {
        alert("H5 SDK版本过低");
      } else if (result == CRVideo_WEB_BROWER_NOTUPPORTED) {
        console.log("不支持的浏览器");
      } else if (result != 0) {
        console.log("其他错误");
      }
      this.sdk = result;
    },
    //登录
    submit() {
      this.saveLoading = true;

      if (this.sdk == CRVideo_NOERR) {
        console.log("H5 SDK可用");

        //SDK反初始化
        //CRVideo_init();

        //设置服务器地址
        let serverList = this.dataForm.serverList;
        CRVideo_SetServerAddr(serverList);

        //登录
        let authAcnt = this.dataForm.authAcnt;
        let authPswd = md5(this.dataForm.authPswd);
        let nickName = this.dataForm.nickName;
        let privAcnt = this.dataForm.privAcnt;
        let privAuthCode = "";

        CRVideo_Login(authAcnt, authPswd, nickName, privAcnt, privAuthCode);

        //登录成功
        CRVideo_LoginSuccess.callback = (userID, cookie) => {
          //登录成功，开始创建视频会话，见下一步
          console.log("登录成功");

          this.loginSuccess = true;

          console.log(CRVideo_GetUserStatus(cookie));

        };

        //登录失败
        CRVideo_LoginFail.callback = (sdkErr, cookie) => {
          //登录出错，可以弹出错误提示，或调用登录接口再次重试登录
          console.log("登录失败");
        };
      }
    },
    //注销
    logout() {
      
      CRVideo_Logout();
      this.$message.info({content: '注销成功',duration: 2000,onClose(){
        this.loginSuccess = false;
      }});

    }
  }
};
</script>

<style lang="scss">
.video {
  .dataForm {
    width: 400px;
    margin: auto;
  }
}
</style>