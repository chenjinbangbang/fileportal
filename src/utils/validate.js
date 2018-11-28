/**
 */

//日期转字符串 返回日期格式20080808
function dateToString(date) {
    if (date instanceof Date) {
        var year = date.getFullYear().toString();
        var month = (date.getMonth() + 1).toString();
        month = month < 10 ? '0' + month : month;
        var day = date.getDate().toString();
        day = day < 10 ? '0' + day : day;
        return year + month + day;
    }
    return '';
}

// 身份证号验证 
export function id_numberRule(rule, value, callback) {
    //身份证正则表达式(18位) 
    var isIdCard2 = /^[1-9]\d{5}(19\d{2}|[2-9]\d{3})((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])(\d{4}|\d{3}X)$/i;
    var addcode = [11, 12, 13, 14, 15, 21, 22, 23, 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 46, 51, 52, 53, 54, 50, 61, 62, 63, 64, 65, 71, 81, 82];
    console.log();
    var stard = "10X98765432"; //最后一位身份证的号码
    var first = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //1-17系数
    var sum = 0;
    if (!isIdCard2.test(value) || addcode.indexOf(parseInt(value.slice(0, 2))) < 0) {
        callback(new Error("请输入合法的身份证号码"));
        return;
    }
    var year = value.substr(6, 4);
    var month = value.substr(10, 2);
    var day = value.substr(12, 2);
    var birthday = value.substr(6, 8);
    if (birthday != dateToString(new Date(year + '/' + month + '/' + day))) { //校验日期是否合法
        callback(new Error("请输入合法的身份证号码"));
        return;
    }
    for (var i = 0; i < value.length - 1; i++) {
        sum += value[i] * first[i];
    }
    var result = sum % 11;
    var last = stard[result]; //计算出来的最后一位身份证号码
    if (value[value.length - 1].toUpperCase() == last) {
        callback();
    } else {
        callback(new Error("请输入合法的身份证号码"));
        return;
    }
}

//密码验证
export function validatePass(rule, value, callback) {
    if (value.length < 6) {
        callback(new Error("密码不能小于6位"));
    } else {
        callback();
    }
};

//电子邮箱验证
export function emailRule(rule, value, callback) {
    let valReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!valReg.test(value)) {
        callback(new Error(i18n.t('user.emailRule')));
    } else {
        callback();
    }
};

/* 是否是公司邮箱*/
export function isWscnEmail(str) {
    const reg = /^[a-z0-9](?:[-_.+]?[a-z0-9]+)*@wz\.com$/i;
    return reg.test(str.trim());
}

/* 合法uri*/
export function validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
}

/* 小写字母*/
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
}

/* 验证key*/
// export function validateKey(str) {
//     var reg = /^[a-z_\-:]+$/;
//     return reg.test(str);
// }

/* 大写字母*/
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
}

/* 大小写字母*/
export function validatAlphabets(str) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
}

export function oneOf(value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true;
        }
    }
    return false;
}
