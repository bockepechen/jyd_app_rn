import React, { Component } from 'react';
import {
  Text,
  View,
  Platform,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  TouchableHighlight,
} from 'react-native';
import { scaleSize } from '../../utils/FitViewUtils';
import DataResponsitory from '../../dao/DataResponsitory';
import { GlobalStyles } from '../../../res/styles/GlobalStyles';
import { ImageStores } from '../../../res/styles/ImageStores';
import LoadingIcon from '../../common/LoadingIcon';
import CommonBlocker from '../../utils/CommonBlocker';
import ViewUtils from '../../utils/ViewUtils';

export default class RechargeShortcut extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.commonBlocker = new CommonBlocker(this);
    this.tx_amount = ''
    this.state = {
      isLoading: false,
      card_no: '',
      bank_name: '',
      tel_phone: global.NetReqModel.tel_phone
    }
  }

  componentDidMount() {
    this.getInfoData()
  }

  goto(url, JsonObj) {
    this.props.navigation.navigate(url, {
      data: JsonObj ? JsonObj : {}
    });
  }

  async getInfoData() {
    this.setState({
      isLoading: true
    });
    let url = await '/accountSafety/cardInfo';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
      .then((result) => {
        if (result.return_code == '0000') {
          this.setState({
            isLoading: false,
            card_no: result.card_no,
            bank_name: result.bank_name,
          })
        }
        if (this.state.isLoading) {
          this.setState({ isLoading: false });
        }
        global.NetReqModel.bank_transfer_url = result.bank_transfer_url;
      })
      .catch((e) => {
        console.log(e);
        // TODO Toast提示异常
        // 关闭Loading动画
        if (this.state.isLoading) {
          this.setState({ isLoading: false });
        }
      })
  }

  async recharge() {
    this.setState({
      isLoading: true
    });
    if (this.commonBlocker.checkLogin() && await this.commonBlocker.checkExpireLogin()) {
      if (!this.state.tel_phone) {
        this.refs.toast.show('请填写银行预留手机号', 1000);
        this.setState({
          isLoading: false
        });
        return false
      }
      if (!this.tx_amount) {
        this.refs.toast.show('请填写充值金额', 1000);
        this.setState({
          isLoading: false
        });
        return false
      }
      if (this.tx_amount < 100) {
        this.refs.toast.show('充值金额不得少于100', 1000);
        this.setState({
          isLoading: false
        });
        return false
      }
      global.NetReqModel.tx_amount = this.tx_amount
      this.goto('RechargeBankPage', {
        url: '/directRecharge',
        jsonObj: global.NetReqModel,
        title: '充值'
      });
      if(this.state.isLoading){
        this.setState({
          isLoading: false
        });
      }
    }
  }

  renderSubTitleLine(subTitle, topDistance) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: scaleSize(60), marginRight: scaleSize(60) }}>
        <ImageBackground
          source={ImageStores.sy_14}
          resizeMode={'stretch'}
          style={{ marginLeft: 0, width: scaleSize(258), height: scaleSize(72), justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#f2f2f2', fontSize: scaleSize(32) }}>{subTitle}</Text>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: '#c7b299', marginLeft: scaleSize(6), width: scaleSize(870), height: 0.5 }} />
      </View>
    )
  }

  renderRemark() {
    return (
      <View
        style={{
          flex: 1,
          position: 'absolute',
          top: scaleSize(1150),
          width: GlobalStyles.WINDOW_WIDTH,
          alignItems: 'center',
        }}
      >
        {this.renderSubTitleLine('温馨提示')}
        <View style={{ marginTop: scaleSize(66), marginLeft: scaleSize(110), marginRight: scaleSize(110) }}>
          <Text style={{ fontSize: scaleSize(36), color: '#989898' }}>1、充值手续费：充值不收取任何手续费</Text>
          <Text style={{ fontSize: scaleSize(36), marginTop: scaleSize(18), color: '#989898' }}>2、如充值过程中出现异常，请联系嘉e贷客服400-8780-777或直接与江西银行客服联系400-78-96266</Text>
          <Text style={{ fontSize: scaleSize(36), marginTop: scaleSize(18), color: '#989898' }}>3、使用中国邮政储蓄银行卡的用户，交易时间为1:00-20:30</Text>
        </View>
      </View>
    )
  }

  renderMainView() {
    let kbType = Platform.OS === 'ios' ? 'number-pad' : 'numeric';
    return (
      <View
        style={{
          position: 'absolute',
          top: scaleSize(51),
          width: GlobalStyles.WINDOW_WIDTH,
          alignItems: 'center',
        }}>
        <View style={{ width: scaleSize(1134), height: scaleSize(550), backgroundColor: '#ffffff', borderRadius: 10, alignItems: 'center' }}>
          <View style={{ marginTop: scaleSize(54), width: scaleSize(999), height: scaleSize(81), borderBottomWidth: GlobalStyles.PIXEL, borderBottomColor: '#c3c3c3', flexDirection: 'row', alignItems: "center", }}>
            <TextInput
              style={{ flex: 1, color: '#996875', marginLeft: scaleSize(18), marginRight: scaleSize(18), fontSize: scaleSize(48), paddingTop: 0, paddingBottom: 0 }}
              editable={false}
              clearButtonMode={'while-editing'}
              placeholder={'银行账号'}
              placeholderTextColor='#c3c3c3'
              underlineColorAndroid='rgba(0,0,0,0)'
              value={`${this.state.bank_name}(${this.state.card_no})`}
            />
          </View>
          <View style={{ marginTop: scaleSize(54), width: scaleSize(999), height: scaleSize(81), borderBottomWidth: GlobalStyles.PIXEL, borderBottomColor: '#c3c3c3', flexDirection: 'row', alignItems: "center", }}>
            <TextInput
              style={{ flex: 1, color: '#996875', marginLeft: scaleSize(18), marginRight: scaleSize(18), fontSize: scaleSize(48), paddingTop: 0, paddingBottom: 0 }}
              clearButtonMode={'while-editing'}
              maxLength={11}
              keyboardType={kbType}
              placeholder={'请输入银行预留手机号'}
              placeholderTextColor='#c3c3c3'
              underlineColorAndroid='rgba(0,0,0,0)'
              value={this.state.tel_phone}
              onChangeText={(tel_phone) => {
                this.setState({
                  tel_phone: tel_phone
                })
              }}
            />
          </View>
          <View style={{ marginTop: scaleSize(54), width: scaleSize(999), height: scaleSize(81), borderBottomWidth: GlobalStyles.PIXEL, borderBottomColor: '#c3c3c3', flexDirection: 'row', alignItems: "center", }}>
            <TextInput
              style={{ flex: 1, color: '#996875', marginLeft: scaleSize(18), marginRight: scaleSize(18), fontSize: scaleSize(48), paddingTop: 0, paddingBottom: 0 }}
              maxLength={10}
              keyboardType={kbType}
              placeholder={'请输入充值金额,不得少于100元'}
              placeholderTextColor='#c3c3c3'
              underlineColorAndroid='rgba(0,0,0,0)'
              onChangeText={(p) => { this.tx_amount = p }}
            />
          </View>
          <View style={{ marginTop: scaleSize(42), width: scaleSize(999), flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity
              onPress={async () => {
                if (this.commonBlocker.checkLogin() && await this.commonBlocker.checkExpireLogin()) {
                  this.goto('RechargeLimitPage', {
                    url: '/accountRecharge/limitTable',
                    jsonObj: global.NetReqModel,
                    title: '查看银行限额'
                  })
                }
              }}
            >
              <Text style={{ fontSize: scaleSize(36), color: '#3b92f0' }}>{'查看银行限额'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Image source={ImageStores.dl_1} resizeMode={'stretch'} style={{ width: scaleSize(1134), height: scaleSize(66) }} />
        <TouchableHighlight
          style={{ marginTop: scaleSize(45) }}
          underlayColor='rgba(0,0,0,0)'
          onPress={() => { this.recharge() }}>
          <ImageBackground
            source={ImageStores.sy_17}
            resizeMode={'stretch'}
            style={{ width: scaleSize(558), height: scaleSize(168), alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: scaleSize(50), fontWeight: '200', color: '#FFFFFF' }}>{'提交'}</Text>
          </ImageBackground>
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    return (
      <View style={GlobalStyles.rootContainer}>
        {this.renderMainView()}
        {this.renderRemark()}
        {this.state.isLoading ? (<LoadingIcon isModal={true}/>) : null}
        {ViewUtils.renderToast(200)}
      </View>
    )
  }
}