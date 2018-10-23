import React from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  ImageBackground,
  TouchableHighlight,
  DeviceEventEmitter
} from 'react-native';
import { scaleSize } from '../utils/FitViewUtils';
import { ImageStores } from '../../res/styles/ImageStores';
import DataResponsitory from '../dao/DataResponsitory';
import { ExceptionMsg } from '../dao/ExceptionMsg';
import { PublicCode } from '../dao/PublicCode';
import { StackActions } from 'react-navigation';

export default class CommonBlocker {
  constructor(component) {
    this.component = component;
    this.props = component.props;
    this.dataResponsitory = new DataResponsitory();
  }

  /**
   * 校验是否登录账号
   */
  checkLogin() {
    if (!global.NetReqModel.jyd_pubData.token_id
      || global.NetReqModel.jyd_pubData.token_id === '') {
      this.props.navigation.navigate('LoginPage');
      return false;
    } else {
      return true;
    }
  }

  /**
   * 校验是否登录失效
   */
  checkExpireLogin() {
    return new Promise((resolve) => {
      this.dataResponsitory.fetchNetResponsitory('/checkDeviceToken', global.NetReqModel)
        .then((result) => {
          if (result.return_code == '0000') {
            resolve(true);
          } else if (result.return_code === '9991') {
            this.handleDifferentPhone();
            resolve(false);
          } else if (result.return_code == '8888') {
            this.component.refs.toast.show(ExceptionMsg.REQUEST_TIMEOUT); // 请求超时
            resolve(false);
          }
        })
        .catch((e) => {
          console.log(e);
          this.component.refs.toast.show(ExceptionMsg.COMMON_ERR_MSG);
          resolve(false);
        })
    })
  }

  /**
   * 处理设备不一致，重新登录
   */
  handleDifferentPhone(ifPop = false) {
    Alert.alert(
      '通知',
      '您的登录已失效，请重新登录',
      [
        {
          text: '重新登录',
          onPress: () => {
            this.props.navigation.navigate('LoginPage', {
              data: {
                ifPop: ifPop
              }
            })
          },
          style: 'cancel'
        },
      ],
      { cancelable: false }
    )
  }

  /**
   * 校验是否开通江西银行电子账户，如果没开通则跳转开通页面
   * @param {*} accountId 
   * @param {*} skipCheck 
   */
  checkJXAccountOpen(accountId, skipCheck) {
    if (skipCheck) { return true; }
    if (!accountId || accountId === '') {
      this._openModal(this._renderJXHintView('立即开通', 'AccountOpeningPage'));
      return false;
    } else {
      return true;
    }
  }

  /**
   * 校验是否开通江西银行电子账户，如果没开通则跳转开通页面
   */
  checkRiskOpen(routeName, weburl,data) {
    this._openModal(this._renderRiskView(routeName, weburl,data));
  }

  /**
   * 校验是否绑定银行卡，如果没绑定则跳转绑定银行卡页面
   * @param {*} bankNo 
   * @param {*} skipCheck 
   */
  checkJXCardBind(bankNo, skipCheck) {
    if (skipCheck) { return true; }
    if (!bankNo || bankNo === '') {
      this.props.navigation.navigate('BindCardNewPage', {
        data: {
          url: '/bindCard',
          jsonObj: global.NetReqModel,
          title: '绑定银行卡'
        }
      });
      return false;
    } else {
      return true;
    }
  }

  /**
   * 校验是否设置交易密码，如果没设置跳转到设置交易密码页面
   * @param {*} tradePWDStatus 
   * @param {*} skipCheck 
   */
  checkJXPWDSet(tradePWDStatus, skipCheck) {
    if (skipCheck) { return true; }
    if (!tradePWDStatus || tradePWDStatus === '0') {
      this.props.navigation.navigate('AccountSetPwdPage', {
        data: {
          url: '/transPwd/setPassword',
          jsonObj: global.NetReqModel,
          title: '设置交易密码'
        }
      });
      return false;
    } else {
      return true;
    }
  }

  /**
   * 校验是否完成签约，如果没完成跳转到签约页面
   * @param {*} jxSign  江西银行多合一签约状态
   * @param {*} xySign  e签宝《电子签章用户授权协议》签约状态
   * @param {*} sqsSign e签宝《出借授权书》签约状态
   * @param {*} skipCheck 
   */
  checkJXSign(jxSign, xySign, sqsSign, skipCheck) {
    if (skipCheck) { return true; }
    if (jxSign === '1' && xySign === '1' && sqsSign === '1') {
      return true;
    } else {
      this.props.navigation.navigate('AccountAgreementPage');
      return false;
    }
  }

  /**
   * 用户状态组合校验
   * @param {*} navTarget 校验成功后，跳转参数{page:'', params:{data:{...}}}
   * @param {*} switchConf 各种校验是否开启的开关配置
   */
  checkGroup(navTarget, switchConf) {
    var skipCheckJXAccountOpen = false; // 跳过校验江西银行开户
    var skipCheckJXCardBind = false;    // 跳过校验江西银行绑卡
    var skipCheckJXPWDSet = false;      // 跳过校验江西银行设置交易密码
    var skipCheckJXSign = false;        // 跳过校验江西银行签约

    // 处理配置参数赋值
    if (switchConf) {
      skipCheckJXAccountOpen = switchConf.skipCheckJXAccountOpen ? switchConf.skipCheckJXAccountOpen : false;
      skipCheckJXCardBind = switchConf.skipCheckJXCardBind ? switchConf.skipCheckJXCardBind : false;
      skipCheckJXPWDSet = switchConf.skipCheckJXPWDSet ? switchConf.skipCheckJXPWDSet : false;
      skipCheckJXSign = switchConf.skipCheckJXSign ? switchConf.skipCheckJXSign : false;
    }
    return new Promise((resolve) => {
      if (!this.checkLogin()) {
        resolve(false);
      } else {
        this.dataResponsitory.fetchNetResponsitory('/common', global.NetReqModel)
          .then((result) => {
            if (result.return_code == '0000') {
              if (!this.checkJXAccountOpen(result.jx_data.account_id, skipCheckJXAccountOpen)) {
                resolve(false); // 校验是否开户
              } else if (!this.checkJXCardBind(result.jx_data.bank_no, skipCheckJXCardBind)) {
                resolve(false); // 校验是否绑卡
              } else if (!this.checkJXPWDSet(result.jx_data.tradepwd_status, skipCheckJXPWDSet)) {
                resolve(false); // 校验是否设置交易密码
              } else if (!this.checkJXSign(result.jx_data.sign_status, result.jx_data.xy_status, result.jx_data.sqs_status, skipCheckJXSign)) {
                resolve(false); // 校验是否签约
              } else {
                // 如果第一个参数不设置或者为空，则在改方法外控制跳转页面
                if (navTarget) {
                  this.props.navigation.navigate(navTarget.page, navTarget.params);
                }
                resolve(true);
              }
            } else if (result.return_code === '9991') {
              this.handleDifferentPhone(); // 校验设备不一致
              resolve(false);
            } else if (result.return_code == '8888') {
              this.component.refs.toast.show(ExceptionMsg.REQUEST_TIMEOUT); // 请求超时
              resolve(false);
            }
          })
          .catch((e) => {
            console.log(e);
            this.component.refs.toast.show(ExceptionMsg.COMMON_ERR_MSG);
            resolve(false);
          })
      }
    })
  }

  /**
   * 根据江西银行返回码，处理跳转逻辑
   * @param {*} reqUrl 
   */
  handleJXReturnCode(reqUrl, extraParams) {
    if (reqUrl.indexOf(PublicCode.JX_CB_ALL_SUCCESS) > -1) {
      // 返回8000，跳转业务成功提示界面
      this.props.navigation.navigate('RechargeResultPage', {
        data: {
          title: '操作成功',
          type: '1',
          extraParams: extraParams
        }
      })
      return false;
    } else if (reqUrl.indexOf(PublicCode.JX_CB_FORGETPWD_FAIL) > -1 ||
      reqUrl.indexOf(PublicCode.JX_CB_OPENACCOUNT_FAIL) > -1 ||
      reqUrl.indexOf(PublicCode.JX_CB_BINDCARD_FAIL) > -1 ||
      reqUrl.indexOf(PublicCode.JX_CB_UNBINDCARD_FAIL) > -1 ||
      reqUrl.indexOf(PublicCode.JX_CB_RECHARGE_FAIL) > -1 ||
      reqUrl.indexOf(PublicCode.JX_CB_WITHDRAW_FAIL) > -1 ||
      reqUrl.indexOf(PublicCode.JX_CB_SIGNING_FAIL) > -1 ||
      reqUrl.indexOf(PublicCode.JX_CB_SETTRADEPWD_FAIL) > -1 ||
      reqUrl.indexOf(PublicCode.JX_CB_RESETTRADEPWD_FAIL) > -1) {
      // 返回业务错误码，跳转到最外层tab页
      this.props.navigation.dispatch(StackActions.popToTop());
      return false;
    } else {
      // 其他URL，由Webview正常加载
      return true;
    }
  }

  /**
   * 根据本地服务返回码，处理跳转逻辑
   * @param {*} reqUrl 
   */
  handleLocalServCode(reqUrl) {
    if (reqUrl.indexOf(PublicCode.LOCAL_SERV_UN_LOGIN) > -1) {
      // WebView页面点击按钮，返回未登录错误码
      this.props.navigation.navigate('LoginPage', {
        data: {
          ifPop: true
        }
      });
      return false;
    } else if (reqUrl.indexOf(PublicCode.LOCAL_SERV_DIFFERENT_PHONE) > -1) {
      // WebView页面点击按钮，返回设备不一致错误码
      this.handleDifferentPhone(true);
      return false;
    } else if (reqUrl.indexOf(PublicCode.LOCAL_SERV_UN_OPENACCOUNT) > -1) {
      // WebView页面点击按钮，返回江西银行未开户错误码
      this.props.navigation.navigate('AccountOpeningPage');
      return false;
    } else if (reqUrl.indexOf(PublicCode.LOCAL_SERV_UN_BINDCARD) > -1) {
      // WebView页面点击按钮，返回江西银行未绑卡错误码
      this.props.navigation.navigate('BindCardNewPage', {
        data: {
          url: '/bindCard',
          jsonObj: global.NetReqModel,
          title: '绑定银行卡'
        }
      });
      return false;
    } else if (reqUrl.indexOf(PublicCode.LOCAL_SERV_UN_SETPWD) > -1) {
      // WebView页面点击按钮，返回江西银行未设置交易密码错误码
      this.props.navigation.navigate('AccountSetPwdPage', {
        data: {
          url: '/transPwd/setPassword',
          jsonObj: global.NetReqModel,
          title: '设置交易密码',
          ifPop: true
        }
      });
      return false;
    } else if (reqUrl.indexOf(PublicCode.LOCAL_SERV_UN_SIGN) > -1) {
      // WebView页面点击按钮，返回江西银行未签约错误码
      this.props.navigation.navigate('AccountAgreementPage', {
        data: {
          ifPop: true
        }
      });
      return false;
    } else if (reqUrl.indexOf(PublicCode.LOCAL_SERV_PURCHASE_RECHARGE) > -1) {
      // WebView页面点击按钮，返回充值请求业务码
      this.props.navigation.navigate('RechargePage', {
        data: {
          ifPop: true
        }
      });
      return false;
    } else if (reqUrl.indexOf(PublicCode.LOCAL_SERV_ALL_FAIL) > -1) {
      // WebView异常页面点击按钮，返回跳转首页业务码
      this.props.navigation.dispatch(StackActions.popToTop());
      return true;
    } else if (reqUrl.indexOf(PublicCode.LOCAL_SERV_PURCHASE_SUCCESS) > -1) {
      // WebView页面点击按钮，返回购买成功业务码
      this.props.navigation.dispatch(StackActions.popToTop());
      return true;
    } else if (reqUrl.indexOf(PublicCode.LOCAL_SERV_RISK_FINISH) > -1) {
      // WebView 风险测评页面点击确定，返回结束测评业务码
      this.props.navigation.dispatch(StackActions.popToTop());
      return true;
    } else {
      // 其他URL，由Webview正常加载
      return true;
    }
  }

  /**
   * 私有方法 渲染跳转提示遮罩层
   * @param {*} btnName 
   * @param {*} targetPage 
   */
  _renderJXHintView(btnName, targetPage) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
        <View style={{ flexDirection: 'column', justifyContent: 'center', height: scaleSize(891), width: scaleSize(915), borderRadius: scaleSize(30), backgroundColor: '#fff' }} >
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: '#989898', fontSize: scaleSize(36) }}>{'嘉e贷联手江西银行'}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: scaleSize(45) }}>
            <Image source={ImageStores.me_30} resizeMode={'stretch'} style={{ width: scaleSize(522), height: scaleSize(201) }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: scaleSize(60) }}>
            <Text style={{ color: '#998675', fontSize: scaleSize(42) }}>{'积极响应国家政策'}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: scaleSize(54) }}>
            <Text style={{ color: '#989898', fontSize: scaleSize(36) }}>{'银行存管系统正式上线，请先开通银行存管账户'}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: '#989898', fontSize: scaleSize(36) }}>{'开通后即可进行充值、提现、出借等操作'}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: scaleSize(54) }}>
            <TouchableHighlight
              style={{ flexDirection: 'row', justifyContent: 'center' }}
              underlayColor='rgba(0,0,0,0)'
              onPress={() => { this._closeModal() }}>
              <ImageBackground
                source={ImageStores.cp_2}
                resizeMode={'stretch'}
                style={{ width: scaleSize(336), height: scaleSize(138), alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: scaleSize(50), fontWeight: '200', color: '#FFFFFF' }}>{'稍后再说'}</Text>
              </ImageBackground>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ flexDirection: 'row', justifyContent: 'center' }}
              underlayColor='rgba(0,0,0,0)'
              onPress={() => {
                this._closeModal();
                this.props.navigation.navigate(targetPage);
              }}>
              <ImageBackground
                source={ImageStores.sy_15}
                resizeMode={'stretch'}
                style={{ width: scaleSize(336), height: scaleSize(138), alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: scaleSize(50), fontWeight: '200', color: '#FFFFFF' }}>{btnName}</Text>
              </ImageBackground>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }

  /**
   * 风险评测modal
   */
  _renderRiskView(routeName, weburl,data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
        <View style={{ flexDirection: 'column', justifyContent: 'center', height: scaleSize(891), width: scaleSize(915), borderRadius: scaleSize(30), backgroundColor: '#fff' }} >
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: '#989898', fontSize: scaleSize(36) }}>{'嘉e贷联手江西银行'}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: scaleSize(45) }}>
            <Image source={ImageStores.me_30} resizeMode={'stretch'} style={{ width: scaleSize(522), height: scaleSize(201) }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: scaleSize(60) }}>
            <Text style={{ color: '#998675', fontSize: scaleSize(42) }}>{'积极响应国家政策'}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: scaleSize(54) }}>
            <Text style={{ color: '#989898', fontSize: scaleSize(36) }}>{'您的出借决定与您可承受的风险程度等实际情'}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: '#989898', fontSize: scaleSize(36) }}>{'况不一致，请重新完成风险等级测评'}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: scaleSize(54) }}>
            <TouchableHighlight
              style={{ flexDirection: 'row', justifyContent: 'center' }}
              underlayColor='rgba(0,0,0,0)'
              onPress={() => { this._closeModal() }}>
              <ImageBackground
                source={ImageStores.cp_2}
                resizeMode={'stretch'}
                style={{ width: scaleSize(336), height: scaleSize(138), alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: scaleSize(50), fontWeight: '200', color: '#FFFFFF' }}>{'稍后再说'}</Text>
              </ImageBackground>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ flexDirection: 'row', justifyContent: 'center' }}
              underlayColor='rgba(0,0,0,0)'
              onPress={() => {
                this._closeModal();
                this.props.navigation.navigate(routeName,{
                  data:{
                    url:weburl,
                    title:'风险评测',
                    jsonObj:data
                  },
                  ...this.props
                });
              }}>
              <ImageBackground
                source={ImageStores.sy_15}
                resizeMode={'stretch'}
                style={{ width: scaleSize(336), height: scaleSize(138), alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: scaleSize(50), fontWeight: '200', color: '#FFFFFF' }}>{'立即测评'}</Text>
              </ImageBackground>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }

  /**
   * 私有方法 通过TabPage页面的事件监听，调用Modal公用组件
   * @param {*} contentView 
   */
  _openModal(contentView) {
    if (this.props.ref_modalView !== undefined) {
      DeviceEventEmitter.emit('callModal', true, contentView, this.props.ref_modalView);
    } else {
      this.component.refs.modalView.show(contentView);
    }
  }

  /**
   * 私有方法 通过TabPage页面的事件监听，关闭Modal公用组件
   */
  _closeModal() {
    if (this.props.ref_modalView !== undefined) {
      DeviceEventEmitter.emit('callModal', false, null, this.props.ref_modalView)
    } else {
      this.component.refs.modalView.close();
    }
  }

}