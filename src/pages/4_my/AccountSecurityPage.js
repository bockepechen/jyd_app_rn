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
import ModalView from '../../common/ModalView';
import LoadingIcon from '../../common/LoadingIcon';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';

export default class AccountSecurityPage extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
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
          await this.commonBlocker.checkGroup({
            page: 'BankCardListPage'
          }, {
              skipCheckJXCardBind: true,
              skipCheckJXPWDSet: true,
              skipCheckJXSign: true
            })
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
        title: '银行存管账户签约情况',
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
      isLoading:false,
      tel: '',
      cardInfo: '',
    }
  }

  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
    this.getInfoData()
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

  async getInfoData() {
      this.setState({
          isLoading: true
      });
      let url = await '/accountSafety';
      this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
          .then((result) => {
              if (result.return_code == '0000') {
                  this.setState({
                      isLoading: false,
                      tel: result.tel_phone,
                      cardInfo: result.card,
                  })
              }
              if (this.state.isLoading) {
                  this.setState({ isLoading: false });
              }
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

  _renderItemDetail(index) {
    if (index == 1) {
      return <Text style={{ marginTop: scaleSize(48), color: '#989898', marginRight: scaleSize(24) }}>{this.state.cardInfo}</Text>
    }
    else if (index == 2) {
      // return <Text style={{ marginTop: scaleSize(48), color: '#989898', marginRight: scaleSize(24) }}>{this.state.tel}</Text>
      return null
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
      <View style={{ flex: 1}}>
        <ScrollView
          style={{marginTop:scaleSize(120)}}
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
          title='账号与安全'
          titleColor='#FFFFFF'
          titleSize={scaleSize(56)}
          navColor='#E8152E'
          statusBarColor='#E8152E'
          statusBarStyle='light-content'
          leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
        />
        {this.renderMainView()}
        {ViewUtils.renderToast()}
        {this.state.isLoading ? (<LoadingIcon />) : null}
        <ModalView ref='modalView'/>
      </View>
    )
  }
}