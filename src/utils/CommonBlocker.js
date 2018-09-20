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
  handleDifferentPhone() {
    Alert.alert(
      '通知',
      '您的登录已失效，请重新登录',
      [
        {
          text: '重新登录',
          onPress: () => { this.props.navigation.navigate('LoginPage') },
          style: 'cancel'
        },
      ],
      { cancelable: false }
    )
  }

  /**
   * 校验是否开通江西银行电子账户，如果没开通则跳转开通页面
   * @param {*} accountId 
   */
  checkJXAccountOpen(accountId) {
    if (!accountId || accountId === '') {
      this._openModal(this._renderJXHintView('立即开通', 'AccountOpeningPage'));
      return false;
    } else {
      return true;
    }
  }

  /**
   * 校验是否绑定银行卡，如果没绑定则跳转绑定银行卡页面
   * @param {*} bankNo 
   */
  checkJXCardBind(bankNo) {
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
   */
  checkJXPWDSet(tradePWDStatus) {
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
   */
  checkJXSign(jxSign, xySign, sqsSign) {
    if (jxSign === '1' && xySign === '1' && sqsSign === '1') {
      return true;
    } else {
      this.props.navigation.navigate('AccountAgreementPage');
      return false;
    }
  }

  /**
   * 用户状态组合校验
   * @param {*} targetPage 
   */
  checkGroup(targetPage) {
    return new Promise((resolve) => {
      if (!this.checkLogin()) {
        resolve(false);
      } else {
        this.dataResponsitory.fetchNetResponsitory('/common', global.NetReqModel)
          .then((result) => {
            if (result.return_code == '0000') {
              if (!this.checkJXAccountOpen(result.jx_data.account_id)) {
                resolve(false); // 校验是否开户
              } else if (!this.checkJXCardBind(result.jx_data.bank_no)) {
                resolve(false); // 校验是否绑卡
              } else if (!this.checkJXPWDSet(result.jx_data.tradepwd_status)) {
                resolve(false); // 校验是否设置交易密码
              } else if (!this.checkJXSign(result.jx_data.sign_status, result.jx_data.xy_status, result.jx_data.sqs_status)) {
                resolve(false); // 校验是否签约
              } else {
                this.goto(targetPage);
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
   * 私有方法 通过TabPage页面的事件监听，调用Modal公用组件
   * @param {*} btnName 
   * @param {*} contentView 
   */
  _openModal(contentView) {
    DeviceEventEmitter.emit('callModal', true, contentView, this.props.ref_modalView);
  }

  /**
   * 私有方法 通过TabPage页面的事件监听，关闭Modal公用组件
   */
  _closeModal() {
    DeviceEventEmitter.emit('callModal', false, null, this.props.ref_modalView)
  }

}