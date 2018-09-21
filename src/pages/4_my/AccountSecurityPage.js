import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import { scaleSize } from '../../utils/FitViewUtils';
import { GlobalStyles } from '../../../res/styles/GlobalStyles';
import { ImageStores } from '../../../res/styles/ImageStores';
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import CommonBlocker from '../../utils/CommonBlocker';

export default class AccountSecurityPage extends Component {
  constructor(props) {
    super(props);
    this.commonBlocker = new CommonBlocker(this);
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.listItem = [
      {
        title: '用户信息',
        callback: async () => {
          if (this.commonBlocker.checkLogin() && await this.commonBlocker.checkExpireLogin()) {
            this.goto('PersonInfoPage')
          }
        }
      },
      {
        title: '我的银行卡',
        callback: async () => {
          if (this.commonBlocker.checkLogin() && await this.commonBlocker.checkExpireLogin()) {
            this.goto('BankCardListPage')
          }
        }
      },
      {
        title: '联系地址',
        callback: async () => {
          if (this.commonBlocker.checkLogin() && await this.commonBlocker.checkExpireLogin()) {
            this.goto('AddressPage')
          }
        }
      },
      {
        title: '修改登录密码',
        callback: async () => {
          if (this.commonBlocker.checkLogin() && await this.commonBlocker.checkExpireLogin()) {
            this.goto('ResetpwdPage')
          }
        }
      },
      {
        title: '重置交易密码',
        callback: async () => {
          await this.commonBlocker.checkGroup({
            page: 'ResetTradepwdPage',
            params: {
              data: {
                url: '/transPwd/setAndResetPassword',
                jsonObj: global.NetReqModel,
                title: '重置交易密码'
              }
            }
          }, {
              skipCheckJXCardBind: true,
              skipCheckJXSign: true
            })
        }
      },
      {
        title: '银行账户存管签约情况',
        callback: async () => {
          await this.commonBlocker.checkGroup({
            page: 'AccountAgreementPage'
          }, {
              skipCheckJXSign: true
            })
        }
      },
    ]
    this.state = {
      tel: `${global.NetReqModel.tel_phone.substring(0, 3)} **** ${global.NetReqModel.tel_phone.substring(7)}`,
      cardInfo: `${global.NetReqModel.bank_no && global.NetReqModel.bank_no != '' ? '卡后四位(' + global.NetReqModel.bank_no.substring(global.NetReqModel.bank_no.length - 4) + ')' : ''}`,
    }
  }

  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
  }

  componentWillUnmount() {
    this.AndroidBackHandler.removePressBackListener();
  }

  goto(url, JsonObj) {
    this.props.navigation.navigate(url, {
      data: JsonObj ? JsonObj : {}
    });
  }

  navGoback = () => {
    this.props.navigation.goBack();
  }

  _renderItemDetail(index) {
    if (index == 1) {
      return <Text style={{ marginTop: scaleSize(48), color: '#989898', marginRight: scaleSize(24) }}>{this.state.cardInfo}</Text>
    }
    else if (index == 2) {
      return <Text style={{ marginTop: scaleSize(48), color: '#989898', marginRight: scaleSize(24) }}>{this.state.tel}</Text>
    } else {
      return null
    }
  }

  _renderItem() {
    var itemArray = []
    this.listItem.map((item, index) => {
      itemArray.push(
        <View key={index} style={{ flex: 1, backgroundColor: '#fff', height: scaleSize(135) }}>
          <TouchableOpacity
            style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}
            onPress={item.callback}
          >
            <View style={{ flexDirection: 'row', marginLeft: scaleSize(120) }}>
              <Text style={{ marginTop: scaleSize(48), color: '#989898' }}>{item.title}</Text>
            </View>
            <View style={{ marginRight: scaleSize(63), flexDirection: 'row' }}>
              {this._renderItemDetail(index)}
              <Image
                source={ImageStores.me_6}
                resizeMode={'stretch'}
                style={{
                  // flex:1,
                  width: scaleSize(27),
                  height: scaleSize(45),
                  // marginRight:scaleSize(63),
                  marginTop: scaleSize(51)
                }}
              />
            </View>
          </TouchableOpacity>
          <View style={{ backgroundColor: '#f2f2f2', width: GlobalStyles.WINDOW_WIDTH, height: scaleSize(3) }} />
        </View>
      )
    })
    return itemArray
  }

  renderMainView() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          // style={{marginTop:scaleSize(120)}}
          scrollEnabled={false}
        >
          {this._renderItem()}
        </ScrollView>
      </View>
    )
  }

  render() {
    return (
      <View style={GlobalStyles.rootContainer}>
        <NavigationBar
          title='设置'
          titleColor='#FFFFFF'
          titleSize={scaleSize(56)}
          navColor='#E8152E'
          statusBarColor='#E8152E'
          statusBarStyle='light-content'
          leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
        />
        {this.renderMainView()}
        {ViewUtils.renderToast()}
      </View>
    )
  }
}