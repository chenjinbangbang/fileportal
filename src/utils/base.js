
//定义全局函数
exports.install = function (Vue) {

  //日期格式化
  Vue.prototype.timeFormats = function (time) {
    time = new Date(time);
    let getFullYear = time.getFullYear(),
      getMonth = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1,
      getDate = time.getDate() < 10 ? '0' + time.getDate() : time.getDate(),
      getHours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours(),
      getMinutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes(),
      getSeconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    return `${getFullYear}-${getMonth}-${getDate} ${getHours}:${getMinutes}:${getSeconds}`;
  }

}