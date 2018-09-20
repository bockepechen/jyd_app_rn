export var PublicCode = {
  JX_CB_ALL_SUCCESS: '8000',         //江西银行_前台回调code --> 所有业务：成功
  JX_CB_FORGETPWD_FAIL: '8001',      //江西银行_前台回调code --> 忘记密码：失败
  JX_CB_OPENACCOUNT_FAIL: '8002',    //江西银行_前台回调code --> 开户：失败
  JX_CB_BINDCARD_FAIL: '8003',       //江西银行_前台回调code --> 绑卡：失败
  JX_CB_UNBINDCARD_FAIL: '8004',     //江西银行_前台回调code --> 解绑卡：失败
  JX_CB_RECHARGE_FAIL: '8005',       //江西银行_前台回调code --> 充值：失败
  JX_CB_WITHDRAW_FAIL: '8011',       //江西银行_前台回调code --> 提现：失败
  JX_CB_SIGNING_FAIL: '8006',        //江西银行_前台回调code --> 多合一签约：失败
  JX_CB_SETTRADEPWD_FAIL: '8009',    //江西银行_前台回调code --> 交易密码设置：失败
  JX_CB_RESETTRADEPWD_FAIL: '8010',  //江西银行_前台回调code --> 交易密码重置：失败

  LOCAL_SERV_UN_LOGIN: '9987',              //本地服务_前台回调code --> 用户未登录
  LOCAL_SERV_DIFFERENT_PHONE: '9991',       //本地服务_前台回调code --> 设备不一致，登录状态失效
  LOCAL_SERV_UN_OPENACCOUNT: '9986',        //本地服务_前台回调code --> 用户未开江西银行电子账户
  LOCAL_SERV_UN_BINDCARD: '9970',           //本地服务_前台回调code --> 用户江西银行电子账户未绑定银行卡
  LOCAL_SERV_UN_SETPWD: '9985',             //本地服务_前台回调code --> 用户江西银行电子账户未设置交易密码
  LOCAL_SERV_UN_SIGN: '9984',               //本地服务_前台回调code --> 用户未签约(江西银行多合一电子合同、e签宝电子合同)

  LOCAL_SERV_PURCHASE_SUCCESS:'7000',       //本地服务_前台回调code --> 理财产品购买成功
  LOCAL_SERV_PURCHASE_RECHARGE:'7001',      //本地服务_前台回调code --> 理财产品购买页面点击充值
  LOCAL_SERV_ACTIVITYAREA_PRODUCT:'7002',   //本地服务_前台回调code --> 活动专区点击 "跳转产品页面" 链接
  LOCAL_SERV_ACTIVITYAREA_SHARE:'7003',     //本地服务_前台回调code --> 活动专区点击 "跳转分享页面" 链接
}