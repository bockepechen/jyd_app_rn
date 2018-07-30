export default class Utils {
    //格式化时间挫
    //第一个参数seconds 是往当前时间延长几秒中
    //返回的是一个字符串
    static fotmatDatetime(seconds,fmt){
        let date = new Date();
        date.setSeconds(date.getSeconds() + seconds);
        var o = {   
            "M+" : date.getMonth()+1,                 //月份   
            "d+" : date.getDate(),                    //日   
            "h+" : date.getHours(),                   //小时   
            "m+" : date.getMinutes(),                 //分   
            "s+" : date.getSeconds(),                 //秒   
            "q+" : Math.floor((date.getMonth()+3)/3), //季度   
            "S"  : date.getMilliseconds()             //毫秒   
        };   
        if(/(y+)/.test(fmt))   
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
        for(var k in o)   
            if(new RegExp("("+ k +")").test(fmt))   
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
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
    static getInterval(oriTime, tarTime=Date.now()) {
        return Math.floor((tarTime - oriTime)/1000);
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
        var PWD_REG = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
        return PWD_REG.test(pwd);
    }
    /**
     * 格式化money
     * s为要格式化的money
     * n为小数位数
     */
    static fmoney(s, n){   
        if(s==='')
            return;
        var r = ""
        var l ;
        if(n){
            n = n > 0 && n <= 20 ? n : 2;   
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
            l = s.split(".")[0].split("").reverse();  
            r = "." + s.split(".")[1]; 
        }else{
            l = s.split(".")[0].split("").reverse(); 
        } 
        var t = "";   
        for(let i = 0; i < l.length; i ++ ) {   
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
        }   
        return t.split("").reverse().join("") + r;   
    } 
}