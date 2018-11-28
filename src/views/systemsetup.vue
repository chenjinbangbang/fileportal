<template>
	<div class="animated fadeIn">
		<div class="setupbox">
			<div class="doc-content">
				<h5>登陆设置</h5>
			</div>
			<Form :model="formItem" :label-width="80">
				<FormItem label="是否强认证">
					<i-switch v-model="formItem.switch" size="large" @on-change='switchChange'>
						<span slot="open">开启</span>
						<span slot="close">关闭</span>
					</i-switch>
				</FormItem>
			</Form>
		</div>


	</div>
</template>
<script>
import { getSetting, systemSetting } from "@/api/system";
export default {
  data() {
    return {
      formItem: {
        switch: true
      },
      
    };
  },
  created() {
    //获取登录设置
    this.getSetting();
  },
  mounted() {
    
  },
  methods: {
    //获取登录设置
    getSetting() {
      getSetting().then(res => {
        if (res.error_code === 0) {
          this.formItem.switch = res.data.sia === "1" ? true : false;
        }
      });
    },
    //系统登录设置
    switchChange(sia) {
      sia = sia ? "1" : "0";

      systemSetting({ sia }).then(res => {
        if (res.error_code === 0) {
          //获取登录设置
          this.getSetting();

          this.$Notice.success({
            title: "设置成功",
            desc: sia === "1" ? "强认证已开启！" : "强认证已关闭！"
          });
        }
      });
    },
    
  }
};
</script>
<style lang="scss">

.setupbox {
  border-bottom: 1.5px dashed #062873;
  margin-bottom: 30px;
}
.setupbox .doc-content {
  margin-bottom: 10px;
}
</style>