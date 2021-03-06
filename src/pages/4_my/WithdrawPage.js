import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  Image,
  Keyboard,
  TextInput,
  ImageBackground,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import { GlobalStyles } from '../../../res/styles/GlobalStyles';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import { scaleSize } from '../../utils/FitViewUtils';
import { ImageStores } from '../../../res/styles/ImageStores';
import DataResponsitory from '../../dao/DataResponsitory';
import Utils from '../../utils/Utils';
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import LoadingIcon from '../../common/LoadingIcon';
import CommonBlocker from '../../utils/CommonBlocker';

export default class WithdrawPage extends Component {
  constructor(props) {
    super(props)
    this.dataResponsitory = new DataResponsitory();
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.commonBlocker = new CommonBlocker(this);
    this.btnFlag = false;
    this.state = {
      isLoading: false,
      imgLeft: ImageStores.yh_0,
      imgRight: ImageStores.yh_0,
      nameLeft: '江西银行存管账户',
      nameRight: '银行名称',
      keyong: '',
      bank_no: ''
    }
  }

  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
    this.getInfoData()
  }

  componentWillUnmount() {
    this.AndroidBackHandler.removePressBackListener();
  }

  navGoback = () => {
    this.props.navigation.goBack();
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
    let url = await '/withdraw/preWithdraw';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
      .then((result) => {
        console.log(result);
        if (result.return_code == '0000') {
          this.btnFlag = true
          this.setState({
            isLoading: false,
            keyong: result.keyong,
            bank_no: result.bank_no,
            imgRight: result.bank_icon,
            nameRight: result.bank_no_text,
            imgLeft: result.jxbank_icon
          })
        } else {
          this.refs.toast.show(result.return_msg);
        }
        if (this.state.isLoading) {
          this.setState({ isLoading: false });
        }
      })
      .catch((e) => {
        // TODO Toast提示异常
        // 关闭Loading动画
        if (this.state.isLoading) {
          this.setState({ isLoading: false });
        }
      })
  }

  async withdraw(){
    Keyboard.dismiss();
    if (this.commonBlocker.checkLogin() && await this.commonBlocker.checkExpireLogin()) {
      if (!this.apply_money) {
        this.refs.toast.show('请填写提现金额');
        return false
      }
      let money = parseFloat(this.apply_money)
      if (money < 10) {
        this.refs.toast.show('最低提现10元');
        return false
      }
      if(!Utils.checkMoneyFormat(this.apply_money)){
        this.refs.toast.show('格式不正确，请重新输入', 1000);
        return false
      }
      if (parseFloat(this.apply_money) > 50000 && !this.bank_cnapsNo) {
        this.refs.toast.show('提现金额大于50000元时，必须填写银行联行号', 2000);
        return false
      }
      if(parseFloat(this.apply_money) > 500000){
        this.refs.toast.show('提现最高限额是50万', 2000);
        return false
      }
      global.NetReqModel.apply_money = this.apply_money
      global.NetReqModel.bank_cnapsNo = this.bank_cnapsNo
      this.goto('WithdrawBankPage', {
        url: '/withdraw',
        jsonObj: global.NetReqModel,
        title: '提现'
      });
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
          marginTop: scaleSize(110),
          width: GlobalStyles.WINDOW_WIDTH,
          // alignItems:'center',
        }}
      >
        {this.renderSubTitleLine('提现说明')}
        <View style={{ marginTop: scaleSize(60), flexDirection: 'column', marginLeft: scaleSize(110), marginRight: scaleSize(110) }}>
          <Text style={{ fontSize: scaleSize(36), color: '#989898' }}>
            {'1.快速提现单笔限额5万元，大额提现单笔限额50万元，每日最多可提现10次。'}
          </Text>
          <Text style={{ fontSize: scaleSize(36), color: '#989898' }}>
            {'2.提现手续费：1元/笔。'}
          </Text>
          <Text style={{ fontSize: scaleSize(36), color: '#989898' }}>
            {'3.提现时间：7×24小时。快速提现2小时左右到账，大额提现T+1工作日到账。节假日可能出现延迟。'}
          </Text>
          <Text style={{ fontSize: scaleSize(36), color: '#989898' }}>
            {'4.银行联行号：'}
          </Text>
          <Text style={{ fontSize: scaleSize(36), color: '#989898' }}>
            {'银行联行号就是一个地区银行的唯一识别标志。用于人民银行所组织的大额支付系统等跨区域支付结算业务，由12位组成。'}
          </Text>
          <Text style={{ fontSize: scaleSize(36), color: '#989898' }}>
            {'为了您的资金安全，提现金额大于5万需要填写银行联行号，联行号可以通过第三方网站或对应银行客服进行获取，银行联行号输入错误可能会导致提现失败，但不会影响资金安全。'}
          </Text>
        </View>
        <View style={{height:scaleSize(261)}}/>
      </View>
    )
  }

  renderInputView() {
    let kbType = Platform.OS === 'ios' ? 'decimal-pad' : 'numeric';
    return (
      <View
        style={{
          marginTop: scaleSize(105),
          width: GlobalStyles.WINDOW_WIDTH,
          alignItems: 'center',
        }}>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <View style={{ width: scaleSize(400), height: scaleSize(86), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={this.btnFlag ? { uri: this.state.imgLeft } : this.state.imgLeft}
                resizeMode={'stretch'}
                style={{ width: scaleSize(332), height: scaleSize(72) }}
              />
            </View>
            <View style={{ marginLeft: scaleSize(44), justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={ImageStores.me_25}
                resizeMode={'stretch'}
                style={{ width: scaleSize(78), height: scaleSize(27) }}
              />
            </View>
            <View style={{ marginLeft: scaleSize(44), width: scaleSize(400), height: scaleSize(86), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={this.btnFlag ? { uri: this.state.imgRight } : this.state.imgRight}
                resizeMode={'stretch'}
                style={{ width: scaleSize(332), height: scaleSize(72) }}
              />
            </View>
          </View>
          <View style={{ marginTop: scaleSize(75), flexDirection: 'row', justifyContent: 'center' }}>
            <View style={{ width: scaleSize(400), alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: scaleSize(36) }}>{this.state.nameLeft}</Text>
            </View>
            <View style={{ marginLeft: scaleSize(166), width: scaleSize(400), alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: scaleSize(36) }}>{this.state.nameRight}</Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: scaleSize(72), width: scaleSize(1134), height: scaleSize(600), backgroundColor: '#ffffff', borderRadius: 10, alignItems: 'center' }}>
          <View style={{ marginTop: scaleSize(81), width: scaleSize(999), height: scaleSize(81), borderBottomWidth: GlobalStyles.PIXEL, borderBottomColor: '#c3c3c3' }}>
            <Text style={{ marginLeft: scaleSize(18), color: '#996875', fontSize: scaleSize(48) }}>{`可用余额：${Utils.formatMoney(this.state.keyong, 2)}`}</Text>
          </View>
          <View style={{ marginTop: scaleSize(81), width: scaleSize(999), height: scaleSize(81), borderBottomWidth: GlobalStyles.PIXEL, borderBottomColor: '#c3c3c3' }}>
            <TextInput
              style={{ marginTop: scaleSize(0), marginLeft: scaleSize(18), marginRight: scaleSize(18), fontSize: scaleSize(48), paddingTop: 0, paddingBottom: 0 }}
              clearButtonMode={'while-editing'}
              keyboardType={kbType}
              placeholder={'请填写提现金额，最低提现10元'}
              placeholderTextColor='#c3c3c3'
              underlineColorAndroid='rgba(0,0,0,0)'
              onChangeText={(t) => { this.apply_money = t }}
            />
          </View>
          <View style={{ marginTop: scaleSize(81), width: scaleSize(999), height: scaleSize(81), borderBottomWidth: GlobalStyles.PIXEL, borderBottomColor: '#c3c3c3' }}>
            <TextInput
              style={{ marginTop: scaleSize(0), marginLeft: scaleSize(18), marginRight: scaleSize(18), fontSize: scaleSize(48), paddingTop: 0, paddingBottom: 0 }}
              clearButtonMode={'while-editing'}
              placeholder={'请填写银行联行号'}
              placeholderTextColor='#c3c3c3'
              underlineColorAndroid='rgba(0,0,0,0)'
              onChangeText={(t) => { this.bank_cnapsNo = t }}
            />
          </View>
        </View>
        <Image source={ImageStores.dl_1} resizeMode={'stretch'} style={{ width: scaleSize(1134), height: scaleSize(66) }} />
        <TouchableHighlight
          style={{ marginTop: scaleSize(42) }}
          underlayColor='rgba(0,0,0,0)'
          onPress={()=>{this.withdraw()}}>
          <ImageBackground
            source={ImageStores.sy_17}
            resizeMode={'stretch'}
            style={{ width: scaleSize(558), height: scaleSize(168), alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: scaleSize(50), fontWeight: '200', color: '#FFFFFF' }}>{'确认提交'}</Text>
          </ImageBackground>
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    return (
      <View style={GlobalStyles.rootContainer}>
        <NavigationBar
          title={'提现'}
          titleColor='#FFFFFF'
          titleSize={scaleSize(56)}
          navColor='#E8152E'
          statusBarColor='#E8152E'
          statusBarStyle='light-content'
          leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
        />
        <ScrollView>
          <Image
            source={ImageStores.me_1}
            resizeMode={'stretch'}
            style={{ width: scaleSize(1242), height: scaleSize(837), position:'absolute', marginTop:0 }}>
            
          </Image>
          {this.renderInputView()}
          {this.renderRemark()}
        </ScrollView>
        {this.state.isLoading ? (<LoadingIcon isModal={true} />) : null}
        {ViewUtils.renderToast()}
      </View>
    )
  }
}