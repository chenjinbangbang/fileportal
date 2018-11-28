<template>
	<div class="login-container" style="background-color: #141a48;margin: 0px;overflow: hidden;">

		<Form ref="loginForm" autoComplete="on" :model="loginForm" :rules="loginRules" class="card-box login-form">
			<Form-item prop="id_number">
				<Input type="text" v-model="loginForm.id_number" placeholder="输入身份证号码" autoComplete="on">
				<Icon type="ios-person-outline" slot="prepend"></Icon>
				</Input>
			</Form-item>
			<Form-item prop="password">
				<Input type="password" v-model="loginForm.password" placeholder="输入密码" @keyup.enter.native="handleLogin">
				<Icon type="ios-locked-outline" slot="prepend"></Icon>
				</Input>
			</Form-item>
			<Form-item>
				<Button type="primary" @click="handleLogin('loginForm')" long>登录</Button>
			</Form-item>
			<!-- <div class='tips'>admin账号为:admin@wz.com 密码123456</div>
			<div class='tips'>editor账号:editor@wz.com 密码123456</div> -->
			<div class='tips'>超管账号：360323197303128955，密码：123456</div>
			<div class='tips'>超管账号：12000019911007021x，密码：123456</div>
      <div class='tips'>文管账号：542233197105014511，密码：123456</div>
      <!-- <input type="file" ref="file" @change="fileFn($event)"> -->
		</Form>

    <!-- <Alert type="warning" class="videoAlert" show-icon>连接摄像头失败，可能在另一个浏览器也开启了摄像头，请关闭它才重新连接</Alert> -->

    <Modal v-model="isVerify" :closable="false">
      <div class="video">
        <div class="phone">

          <p class="isVideo" v-show="!isVideo">连接摄像头失败，请检查电脑连接摄像头是否正常</p>
          <video autoplay ref="video" v-show="!isPhoto && isVideo"></video>
          <canvas width="600" height="400" ref="canvas" v-show="isPhoto"></canvas>
          
          <!-- <p class="phonetip">
            <span v-show="!isPhoto">当前为摄像头模式，眼睛请正对着摄像头中间进行拍照</span>
            <span v-show="isPhoto" class="danger">当前为您的头像，若不满意可重拍</span>
          </p> -->
        </div>
        <div class="oper">
          
          <!-- <Button type="primary" size="large" v-if="!isPhoto" @click="getphone">拍照</Button>
          <Button type="warning" size="large" v-else @click="regetphone">是否重拍</Button> -->
          <Button type="success" size="large" @click="getphone">点击进行身份验证</Button>
          <!-- <Button type="info" size="large" @click="getVideo"></Button> -->
          
          <p class="getVideo" @click="getVideo">
            <Tooltip content="重连摄像头" placement="top">
              <span class="iconfont icon-camera"></span>
            </Tooltip>
          </p>
        </div>
      </div>
    </Modal>
    

	</div>
</template>

<script>

// import sha1 from 'crypto-js/sha1';
// import HMACSHA1 from 'crypto-js/hmac-sha1';
// import enchex from 'crypto-js/enc-hex';

// import sha256 from 'crypto-js/sha256';
// import hmacSHA512 from 'crypto-js/hmac-sha512';
//import Base64 from 'crypto-js/enc-base64';

import hmacsha1 from "hmacsha1";
import { Base64 } from "js-base64";

import { id_numberRule, validatePass } from "utils/validate";

export default {
  name: "login",
  data() {
    return {
      loginForm: {
        id_number: "360323197303128955",
        password: "123456"
      },
      loginRules: {
        id_number: [
          {
            required: true,
            trigger: "blur",
            validator: id_numberRule
          }
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            validator: validatePass
          }
        ]
      },
      loading: false,

  
      isVerify: false,
      isPhoto: false,
      file: "", //文件
      filestream: null, //文件流
      isVideo: false, //连接摄像头是否失败
    };
  },
  created() {
    //console.log(this.$route);
  },
  mounted() {
    //调用用户媒体设备,访问摄像头
    this.getVideo();

    //人脸静态活体检测
    //this.faceFn();

    //this.verifyFn();
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("login", this.loginForm)
            .then(res => {
              if (res.error_code === 0) {

                //判断数据库是否有用户，有则不返回：false，判断是否强认证，没有则first：true，直接登录成功
                //let first = res.data.first;
                //if(!first){
                  //判断是否需要强认证，需要则进行身份验证
                  let sia = res.data.sia;
                  if (sia === '1') {
                    this.isVerify = true;

                    return false;
                  }
                //}

                this.$Message.success("登录成功");
                this.$router.push({path: '/'});
              }
            })
            .catch(err => {
              this.$message.error(err);
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //强认证-人脸核身
    facecompareidcard(faceimage){
      let username = this.$store.getters.username;

      faceimage = faceimage.split(',')[1];

      this.$store.dispatch('facecompareidcard',{id_number: this.loginForm.id_number,username,faceimage}).then(res => {
        if(res.error_code === 0){
          this.$Message.success({content: '身份验证成功！'});
          this.$router.push({path: '/'});
        }
      }).catch(err => {
        console.log(err);
      });
    },
    //**blob to dataURL**
    blobToDataURL(blob, callback) {
        var a = new FileReader();
        a.onload = function (e) { callback(e.target.result); }
        a.readAsDataURL(blob);
    },

    //拍照
    getphone() {
      this.isPhoto = true;
      let canvas = this.$refs.canvas;
      let context = canvas.getContext("2d");
      context.drawImage(this.$refs.video, 0, 0, 600, 400);

      //this.$Message.success({ content: "拍照成功！" });

      //将canvas元素的图像转换为jpg格式的Blob对象的处理
      let type = 'image/jpeg';
      //将canvas元素中的图像转变为DataURL
      let dataurl = canvas.toDataURL(type);
      //抽取DataURL中的数据部分，从Base64格式转换为二进制格式
      let bin = atob(dataurl.split(',')[1]);
      //创建空的Uint8Array
      let buffer = new Uint8Array(bin.length);
      //将图像数据逐字放入Uint8Array中
      for(let i=0;i<bin.length;i++){
        buffer[i] = bin.charCodeAt(i);
      }
      //利用Uint8Array创建Blob对象
      let blob1 = new Blob([buffer.buffer],{type});

      this.blobToDataURL(blob1,(faceimage) => {

        //强认证-人脸核身
        this.facecompareidcard(faceimage);

      });

      //let blob = window.URL.createObjectURL(blob1);

      //let blob = this.$refs.video.src;
     // console.log(blob);

      //利用Blob对象创建文件进行下载
      // var a = document.createElement("a");
      // a.innerHTML = "x.jpg";
      // // 指定生成的文件名
      // a.download = `${new Date().getTime()}.jpg`;
      // a.href = blob;
      // document.body.appendChild(a);
      // var evt = document.createEvent("MouseEvents");
      // evt.initEvent("click", false, false);
      // a.dispatchEvent(evt);
      // document.body.removeChild(a);

      //  var aafile = new File([blob1], "my.jpg");
      // // this.filestream = aafile;

      // let headers = {
      //   'content-type': 'multipart/form-data'
      // };
      // let formData = new FormData();
      // formData.append('uid',123);
      // formData.append("myfile", aafile);
      // //formData.append('file',url);

      // this.$http({
      //   method: 'post',
      //   url: '/my/php/index.php',
      //   data: formData,
      //   headers,
      // }).then(res => {
      //   console.log(res);
      // });

      //获取本地图片
      // let imgUrl = 'http://localhost/my/php/upload/my.jpg';
      // let img = new Image();
      // img.src = imgUrl;
      // img.onload = () => {
      //   console.log(img.target);
      // };

      //this.filestream = this.$refs.video.src;

      //人脸静态活体检测
      //this.faceFn();
    },
    //返回摄像头进行重拍
    regetphone() {
      this.isPhoto = false;
    },
    //上传文件
    fileFn(event) {
      this.filestream = event.target.files[0];
      //console.log(file);

      //this.faceFn();

      this.getphone(filestream);
    },
    //人脸静态活体检测
    faceFn() {
      //let img = this.$refs.video.src;

      let headers = {
        //'host': 'recognition.image.myqcloud.com',
        'content-type': 'application/json',
        //"content-type": "multipart/form-data",
        authorization:
          "8xrMp0JtCsHtY4btXAGYPJYX8c5hPTEyNTY3ODM4OTYmYj1hbnl1bjEwMC0xMjU2NzgzODk2Jms9QUtJRE9tMDJ0WlpSZVVEazVJRUUyVXExMXJXNVdUSTFNQ2R0JmU9MTUyOTc0MjUwMSZ0PTE1MjcxNTA1MDEmcj0zMjM4NyZ1PTAmZj0="
      };

      let data = {
        appid: "1256783896",
        //image: file
        url: 'http://localhost/my/php/upload/my.jpg'
      };

      // let formData = new FormData();
      // formData.append("appid", data.appid);
      // formData.append("image", data.image);
      // console.log(formData.get("image"));

      this.$http({
        method: "post",
        url: "https://recognition.image.myqcloud.com/face/livedetectpicture",
        data: data,
        headers
      }).then(res => {
        console.log(res);
      });
    },
    //点击进行身份验证
    verifyFn() {
      let img = this.$refs.video.src;
      //let src = this.base64File(img);
      console.log(img);

      //签名
      let APPID = "1256783896";
      let Bucket = "anyun100-1256783896";
      let SecretID = "AKIDOm02tZZReUDk5IEE2Uq11rW5WTI1MCdt";
      let SecretKey = "CE6nIbieOxUq10nPp470lOsBIDxWt8BC";
      let expiredTime = Math.floor(new Date().getTime() / 1000) + 2592000;
      let currentTime = Math.floor(new Date().getTime() / 1000);
      let rand = Math.floor(Math.random() * 100000 + 1);
      let userid = "0";
      let fileid = "tencentyunSignTest";
      //console.log(currentTime);
      //console.log(rand);
      //拼接签名串
      let signStr = `a=${APPID}&b=${Bucket}&k=${SecretID}&e=${expiredTime}&t=${currentTime}&r=${rand}&u=${userid}&f=`;
      //let signStr = `secretId=${SecretID}&currentTimeStamp=${currentTime}&expireTime=${expiredTime}&random=${rand}`;
      console.log(signStr);

      // let SignTmp = HMACSHA1(signStr,SecretKey);
      // console.log(SignTmp);
      // let Sign = Base64(SignTmp+signStr);
      // console.log(Sign);

      //var auth = HMACSHA1(signStr, SecretKey).toString(enchex)+signStr;
      let auth = hmacsha1(SecretKey, signStr);
      console.log(auth);
      var Sign = Base64.encode(auth + signStr);
      console.log(Sign);

      let headers = {
        host: "recognition.image.myqcloud.com",
        "content-type": "application/json",
        //'content-type': 'multipart/form-data',
        authorization: Sign
        //'authorization': '8xrMp0JtCsHtY4btXAGYPJYX8c5hPTEyNTY3ODM4OTYmYj1hbnl1bjEwMC0xMjU2NzgzODk2Jms9QUtJRE9tMDJ0WlpSZVVEazVJRUUyVXExMXJXNVdUSTFNQ2R0JmU9MTUyOTc0MjUwMSZ0PTE1MjcxNTA1MDEmcj0zMjM4NyZ1PTAmZj0='
      };

      let data = {
        appid: APPID,
        idcard_number: "441827199304255318",
        idcard_name: "陈进帮",
        image: "",
        url: "",
        session_id: ""
      };

      this.$http({
        method: "post",
        url: "https://recognition.image.myqcloud.com/face/idcardcompare",
        data,
        headers
      }).then(res => {
        console.log(res);
      });
    },
    //调用用户媒体设备,访问摄像头
    getVideo() {
      this.isPhoto = false;
      if (
        navigator.mediaDevices.getUserMedia ||
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
      ) {
        this.getUserMedia({
          video: { width: 600, height: 400 }
        })
          .then(stream => {
            this.success(stream);
          })
          .catch(error => {
            this.error(error);
          });
      } else {
        alert("你的浏览器不支持访问用户媒体设备");
      }
    },
    //获取用户摄像头
    getUserMedia(constrains) {
      return new Promise((resolve, reject) => {
        if (navigator.mediaDevices.getUserMedia) {
          //最新标准API
          navigator.mediaDevices
            .getUserMedia(constrains)
            .then(stream => {
              resolve(stream);
            })
            .catch(error => {
               console.log('最新标准API不支持');
              reject(error);
            });
        } else if (navigator.webkitGetUserMedia) {
          //webkit内核浏览器
          navigator
            .webkitGetUserMedia(constrains)
            .then(stream => {
              
              resolve(stream);
            })
            .catch(error => {
              console.log('webkit内核浏览器不支持');
              reject(error);
            });
        } else if (navigator.mozGetUserMedia) {
          //Firefox浏览器
          navagator
            .mozGetUserMedia(constrains)
            .then(stream => {
              resolve(stream);
            })
            .catch(error => {
              console.log('Firefox浏览器不支持');
              reject(error);
            });
        } else if (navigator.getUserMedia) {
          //旧版API
          navigator
            .getUserMedia(constrains)
            .then(stream => {
              resolve(stream);
            })
            .catch(error => {
              console.log('旧版API不支持');
              reject(error);
            });
        }
      });
    },
    //成功的回调函数
    success(stream) {
      console.log(stream);
      this.isVideo = true;

      //兼容webkit内核浏览器
      //let windowURL = window.URL || window.webkitURL;
      //将视频流设置为video元素的源
      //this.$refs.video.src = windowURL.createObjectURL(stream);
      this.$refs.video.srcObject = stream;
      
      //播放视频
      this.$refs.video.play();
    },
    //异常的回调函数
    error(error) {
      console.log("访问用户媒体设备失败：", error.name, error.message);
    }
  }
};
</script>

<style lang="scss">
.login-container a {
  color: #0078de;
}

#canvascontainer {
  position: absolute;
  top: 0px;
}

.wz-input-group-prepend {
  background-color: #141a48;
  border: 1px solid #2d8cf0;
  border-right: none;
  color: #2d8cf0;
}
.tips {
  font-size: 14px;
  color: #fff;
  margin-bottom: 5px;
}

.login-container {
  height: 100vh;
  background-color: #2d3a4b;
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
    -webkit-text-fill-color: #fff !important;
  }
  input {
    background: transparent;
    border: 1px solid #2d8cf0;
    -webkit-appearance: none;
    border-radius: 3px;
    padding: 12px 5px 12px 15px;
    color: #eeeeee;
    height: 47px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #889aa4;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: #eeeeee;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .forget-pwd {
    color: #fff;
  }
}
.ivu-modal {
  width:700px !important;
 
}
.videoAlert{
  //position:fixed;
  //left: 100px;
  //color:#f00;
}
.video {
  .phone {
    display:flex;
    justify-content: center;
    align-items:center;
     //border:1px solid #f00;
    //width: 600px;
    //height: 400px;
    p{
      color:#ff9900;
      height:200px;
      line-height:200px;
      font-size:16px;
    }
    .phonetip {
      font-size: 20px;
      margin-top: 5px;
      
    }
  }
  .oper {
    display: flex;
    //justify-content: center;
    align-items: center;
    height: 80px;
    position: relative;
    .ivu-btn {
      margin: 20px auto;
    }
    .getVideo {
      height: 20px;
      line-height: 20px;
      position: absolute;
      right: 0;
      margin-left: auto;
      .iconfont {
        font-size: 30px;
        cursor: pointer;
      }
    }
  }
}
</style>