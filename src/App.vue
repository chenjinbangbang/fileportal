<template>
        <router-view></router-view>
</template>

<script>
export default {
  name: "APP"
};
</script>

<style lang="scss">
//搜索样式
.search {
  //text-align: right;
  margin-bottom: 18px;
  display: flex;
  justify-content:flex-end;
  >div{
    width: 240px;
    margin-left:10px;
  }
  .ivu-btn {
    margin-left: 10px;
  }
}
//分页样式
.page {
  text-align: right;
  margin-top: 18px;
}
//model组件底部的确定，取消按钮设置隐藏
.ivu-modal-footer {
  display: none;
}
.ivu-tooltip-inner{
  max-width: 500px;
}
</style>

