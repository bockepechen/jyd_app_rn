export default class Utils {
    //格式化时间挫
    //第一个参数seconds 是往当前时间延长几秒中
    //返回的是一个字符串
    static fotmatDatetime(seconds, fmt) {
        let date = new Date();
        date.setSeconds(date.getSeconds() + seconds);
        var o = {
            "M+": date.getMonth() + 1,                 //月份   
            "d+": date.getDate(),                    //日   
            "h+": date.getHours(),                   //小时   
            "m+": date.getMinutes(),                 //分   
            "s+": date.getSeconds(),                 //秒   
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
            "S": date.getMilliseconds()             //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    static dateFormate(date, fmt) {
        var o = {
            "M+": date.getMonth() + 1,                 //月份   
            "d+": date.getDate(),                    //日   
            "h+": date.getHours(),                   //小时   
            "m+": date.getMinutes(),                 //分   
            "s+": date.getSeconds(),                 //秒   
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
            "S": date.getMilliseconds()             //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    /**
     * 获取随机字
     * @param {*} len 
     */
    static randomToken(len) {
        let tokenId = '';
        len = len || 32;
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        let maxPos = $chars.length;
        for (i = 0; i < len; i++) {
            tokenId += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return tokenId;
    }

    /**
     * 计算时间间隔(秒)
     * @param {*} oriTime 
     * @param {*} tarTime 
     */
    static getInterval(oriTime, tarTime = Date.now()) {
        return Math.floor((tarTime - oriTime) / 1000);
    }

    /**
     * 验证手机号合法性
     * @param {*} tel 
     */
    static checkoutTel(tel) {
        var PHONE_NUMBER_REG = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        return PHONE_NUMBER_REG.test(tel);
    }

    /**
     * 验证密码复杂度
     * @param {*} pwd
     */
    static checkoutPWD(pwd) {
        // var PWD_REG = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
        var PWD_REG = /^(?!\d+$)(?![a-zA-Z]+$)[\dA-Za-z]{6,20}$/;
        return PWD_REG.test(pwd);
    }

    /**
     * 身份证号复杂度
     * @param {*} 身份证号
     */
    static checkoutSFZ(code) {
        var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
        // var tip = "";
        var pass = true;

        if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
            // tip = "身份证号格式错误";
            pass = false;
        }

        else if (!city[code.substr(0, 2)]) {
            // tip = "地址编码错误";
            pass = false;
        }
        else {
            //18位身份证需要验证最后一位校验位
            if (code.length == 18) {
                code = code.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                //校验位
                var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++) {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];
                if (parity[sum % 11] != code[17]) {
                    // tip = "校验位错误";
                    pass = false;
                }
            }
        }

        return pass;
    }
    /**
     * 格式化money
     * s为要格式化的money
     * n为小数位数
     */
    static fmoney(s, n) {
        if (s === '')
            return;
        var r = ""
        var l;
        if (n) {
            n = n > 0 && n <= 20 ? n : 2;
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            l = s.split(".")[0].split("").reverse();
            r = "." + s.split(".")[1];
        } else {
            l = s.split(".")[0].split("").reverse();
        }
        var t = "";
        for (let i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("") + r;
    }

    static formatMoney(p, n) {
        if (!p || p == '') {
            return p == '0' || p == 0 ? '0.00' : ''
        }
        var p_float = parseFloat(p);
        var res = p_float.toFixed(n)
        return res;
    }

    static clearNetReqModel() {
        Object.keys(global.NetReqModel).forEach(key => {
            if (key === 'jyd_pubData') {
                var innerObj = global.NetReqModel[key];
                Object.keys(innerObj).forEach(innerKey => {
                    if (innerKey !== 'source_type' && innerKey !== 'system_id' && innerKey !== 'network_type') {
                        innerObj[innerKey] = '';
                    }
                })
            } else {
                global.NetReqModel[key] = '';
            }
        });
    }

    /**
     * 校验输入的钱小数点后不能超过3位
     */
    static checkMoneyFormat(p) {
        var PWD_REG = /^(-?\d+)(\.\d{1,2})?$/
        return PWD_REG.test(p);
    }
}