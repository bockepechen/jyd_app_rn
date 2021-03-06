import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ImageBackground,
  Linking,
  DeviceEventEmitter
} from 'react-native';
import { GlobalStyles } from '../../../res/styles/GlobalStyles';
import { scaleSize } from '../../utils/FitViewUtils';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { ImageStores } from '../../../res/styles/ImageStores';
import AppStatusBar from '../../common/AppStatusBar';
import DataResponsitory from '../../dao/DataResponsitory';
import LoadingIcon from '../../common/LoadingIcon';
import Utils from '../../utils/Utils';
import ViewUtils from '../../utils/ViewUtils';
import { ExceptionMsg } from '../../dao/ExceptionMsg';
import CommonBlocker from '../../utils/CommonBlocker';

let refreshRate = 60;
export default class MyPage extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.commonBlocker = new CommonBlocker(this);
    this.state = {
      isLoading: false,
      isRefresh: false,
      isEye: true,
      image_eye: ImageStores.me_3,
      httpRes: {},
      totalAmount: 0,
      sumRepay: 0,
      availBal: 0,
      fundAccountInfo: {}
    }
  }

  componentWillMount() {
    DeviceEventEmitter.addListener('refreshMyPage', () => {
      this.getInfoData();
    })
  }

  componentDidMount() {
    this.getInfoData()
  }

  async getInfoData() {
    this.setState({
      isLoading: true
    });
    let url = await '/personCenter';
    console.log(JSON.stringify(global.NetReqModel));
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
      .then((result) => {
        console.log(result);
        if (result.return_code == '0000') {
          this.setState({
            isLoading: false,
            httpRes: result,
            totalAmount: result.totalAmount,
            sumRepay: result.sumRepay,
            availBal: result.availBal,
            fundAccountInfo: result.fundAccountInfo
          })
        }
        else if (result.return_code == '8888') {
          this.refs.toast.show(ExceptionMsg.REQUEST_TIMEOUT);
        }
        if (this.state.isLoading) {
          this.setState({ isLoading: false });
        }
      })
      .catch((e) => {
        console.log(e);
        this.refs.toast.show(ExceptionMsg.COMMON_ERR_MSG);
        // TODO Toast提示异常
        // 关闭Loading动画
        if (this.state.isLoading) {
          this.setState({ isLoading: false });
        }
      })
  }

  goto(url, JsonObj) {
    this.props.navigation.navigate(url, {
      data: JsonObj ? JsonObj : {}
    });
  }

  hideNum = () => {
    this.setState({
      isEye: !this.state.isEye,
    }, () => {
      this.setState({
        image_eye: this.state.isEye ? ImageStores.me_3 : ImageStores.me_2
      })
    });
  }

  getParallaxRenderConfig(params) {
    let config = {};
    config.renderForeground = () => (
      <View style={{ marginTop: scaleSize(228) }}>
        <View style={{ marginLeft: scaleSize(81), marginRight: scaleSize(81), height: scaleSize(210), flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
            <Text style={{ marginTop: scaleSize(21), fontSize: scaleSize(48), color: '#ffffff' }}>{'总资产(元)'}</Text>
            <Text style={{ marginTop: scaleSize(54), fontSize: scaleSize(60), fontWeight: 'bold', color: '#ffffff' }}>{this.state.isEye ? Utils.formatMoney(this.state.totalAmount, 2) : '******'}</Text>
          </View>
          <View style={{ backgroundColor: 'white', width: 1, height: scaleSize(210) }} />
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
            <Text style={{ marginTop: scaleSize(21), fontSize: scaleSize(48), color: '#ffffff' }}>{'累计回报(元)'}</Text>
            <Text style={{ marginTop: scaleSize(54), fontSize: scaleSize(60), fontWeight: 'bold', color: '#ffffff' }}>{this.state.isEye ? Utils.formatMoney(this.state.sumRepay, 2) : '******'}</Text>
          </View>
        </View>
        <ImageBackground
          source={ImageStores.me_9}
          resizeMode={'stretch'}
          style={{ marginTop: scaleSize(90), width: GlobalStyles.WINDOW_WIDTH, height: scaleSize(309), flexDirection: 'row' }}>
          <View style={{ marginLeft: scaleSize(108), marginTop: scaleSize(36), width: scaleSize(555), height: scaleSize(159) }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Text style={{ fontSize: scaleSize(36), color: '#656565' }}>{'账户余额(元):'}</Text>
              <TouchableHighlight
                underlayColor='rgba(0,0,0,0)'
                onPress={this.hideNum} >
                <Image source={this.state.image_eye} resizeMode={'stretch'} style={{ marginLeft: scaleSize(36), width: scaleSize(69), height: scaleSize(54) }} />
              </TouchableHighlight>
            </View>
            <Text style={{ marginTop: scaleSize(39), width: scaleSize(555), fontSize: scaleSize(66), fontWeight: '200', color: '#ff3a49' }}>{this.state.isEye ? Utils.formatMoney(this.state.availBal, 2) : '******'}</Text>
          </View>
          <View style={{ marginTop: scaleSize(81), marginLeft: scaleSize(21), height: scaleSize(84), flexDirection: 'row' }}>
            <TouchableHighlight
              onPress={async () => { await this.commonBlocker.checkGroup({page:'RechargePage'}) }}
              underlayColor='rgba(0,0,0,0)'>
              <ImageBackground source={ImageStores.me_5} resizeMode={'stretch'} style={{ width: scaleSize(216), height: scaleSize(84), alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: scaleSize(48), fontWeight: '200', color: '#ffffff' }}>{'充值'}</Text>
              </ImageBackground>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={async () => { await this.commonBlocker.checkGroup({page:'WithdrawPage'}) }}
              underlayColor='rgba(0,0,0,0)'>
              <ImageBackground source={ImageStores.me_11} resizeMode={'stretch'} style={{ marginLeft: scaleSize(27), width: scaleSize(216), height: scaleSize(84), alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: scaleSize(48), fontWeight: '200', color: '#ff3a49' }}>{'提现'}</Text>
              </ImageBackground>
            </TouchableHighlight>
          </View>
        </ImageBackground>
      </View>
    );
    config.renderBackground = () => (
      <Image
        source={ImageStores.me_1}
        resizeMode={'stretch'}
        style={{
          width: GlobalStyles.WINDOW_WIDTH,
          height: scaleSize(837)
        }} />
    );
    config.renderStickyHeader = () => (
      <View style={styles.parallax_stickyHeader}>
        <Text style={{ fontSize: 18, color: 'white' }}>{''}</Text>
      </View>
    );
    config.renderFixedHeader = () => (
      <View style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: scaleSize(78),
        right: scaleSize(60),
        backgroundColor: 'rgba(0,0,0,0)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <TouchableHighlight
          onPress={async () => {
            if (this.commonBlocker.checkLogin() && await this.commonBlocker.checkExpireLogin()) {
              this.goto('AccountSecurityPage');
            }
          }}
          underlayColor='rgba(0,0,0,0)'>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={ImageStores.me_10}
              resizeMode={'stretch'}
              style={{ width: scaleSize(96), height: scaleSize(96) }} />
            <Text style={{ marginLeft: scaleSize(39), fontSize: scaleSize(48), color: '#ffffff' }}>{`${global.NetReqModel.jyd_pubData.token_id === '' ? '登录' : '用户' + global.NetReqModel.tel_phone}`}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this.goto('SettingPage')} underlayColor='rgba(0,0,0,0)'>
          <Image
            source={ImageStores.bar1}
            resizeMode={'stretch'}
            style={{ width: scaleSize(75), height: scaleSize(75) }} />
        </TouchableHighlight>
      </View>
    );
    return config;
  }

  renderParallaxView(params, contentView) {
    let parallaxConfig = this.getParallaxRenderConfig(params);
    return (
      <ParallaxScrollView
        ref="pullToRefresh"
        onScroll={
          (e) => {
            if (!this.state.isLoading && e.nativeEvent.contentOffset.y + refreshRate < 0) {
              this.getInfoData();
            }
          }
        }
        showsVerticalScrollIndicator={false}
        backgroundColor='#E8152E'
        contentBackgroundColor="#F0F0F0"
        parallaxHeaderHeight={scaleSize(837)}
        stickyHeaderHeight={scaleSize(150)}
        {...parallaxConfig}
      >
        {contentView}
      </ParallaxScrollView>
    )
  }

  renderGridView() {
    return (
      <View style={{ marginTop: scaleSize(6) }}>
        <ImageBackground source={ImageStores.me_4} resizeMode={'stretch'} style={{ width: GlobalStyles.WINDOW_WIDTH, height: scaleSize(516) }}>
          <View style={{ flex: 1, borderWidth: 0, flexDirection: 'column', justifyContent: 'space-evenly' }}>
            <View style={{ flex: 1, borderWidth: 0, flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <TouchableOpacity
                onPress={async () => {
                  await this.commonBlocker.checkGroup({page:'AssetPage'});
                }}
                style={{ flex: 1, borderWidth: 0, flexDirection: 'row' }}
              >
                <View style={{ flex: 1, borderWidth: 0, flexDirection: 'row' }}>
                  <Image
                    source={ImageStores.me_44}
                    resizeMode={'stretch'}
                    style={{ marginLeft: scaleSize(105), marginTop: scaleSize(66), width: scaleSize(150), height: scaleSize(150) }} />
                  <Text style={{ marginLeft: scaleSize(48), marginTop: scaleSize(114), fontSize: scaleSize(54), fontWeight: 'bold', color: '#998675' }}>
                    {'资产详情'}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  if (this.commonBlocker.checkLogin() && await this.commonBlocker.checkExpireLogin()) {
                    this.goto('MyLoanPage');
                  }
                }}
                style={{ flex: 1, borderWidth: 0, flexDirection: 'row' }}
              >
                <View style={{ flex: 1, borderWidth: 0, flexDirection: 'row' }}>
                  <Image
                    source={ImageStores.me_45}
                    resizeMode={'stretch'}
                    style={{ marginLeft: scaleSize(48), marginTop: scaleSize(66), width: scaleSize(150), height: scaleSize(150) }} />
                  <Text style={{ marginLeft: scaleSize(48), marginTop: scaleSize(114), fontSize: scaleSize(54), fontWeight: 'bold', color: '#998675' }}>
                    {'我的出借'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, borderWidth: 0, flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <TouchableOpacity
                onPress={async () => {
                  await this.commonBlocker.checkGroup({page:'RedPacketPage'});
                }}
                style={{ flex: 1, borderWidth: 0, flexDirection: 'row' }}
              >
                <View style={{ flex: 1, borderWidth: 0, flexDirection: 'row' }}>
                  <Image
                    source={ImageStores.me_46}
                    resizeMode={'stretch'}
                    style={{ marginLeft: scaleSize(105), marginTop: scaleSize(39), width: scaleSize(150), height: scaleSize(150) }} />
                  <Text style={{ marginLeft: scaleSize(48), marginTop: scaleSize(87), fontSize: scaleSize(54), fontWeight: 'bold', color: '#998675' }}>
                    {'我的红包'}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  if (this.commonBlocker.checkLogin() && await this.commonBlocker.checkExpireLogin()) {
                    global.NetReqModel.page_number = '1'
                    this.goto('MyGoldPage', {
                      url: '/integral',
                      jsonObj: global.NetReqModel,
                      title: '我的嘉金币'
                    })
                  }
                }}
                style={{ flex: 1, borderWidth: 0, flexDirection: 'row' }}
              >
                <View style={{ flex: 1, borderWidth: 0, flexDirection: 'row' }}>
                  <Image
                    source={ImageStores.me_47}
                    resizeMode={'stretch'}
                    style={{ marginLeft: scaleSize(48), marginTop: scaleSize(39), width: scaleSize(150), height: scaleSize(150) }} />
                  <Text style={{ marginLeft: scaleSize(48), marginTop: scaleSize(87), fontSize: scaleSize(54), fontWeight: 'bold', color: '#998675' }}>
                    {'我的嘉金币'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }

  renderItemView() {
    let views = [];
    let data = [
      {
        img: ImageStores.me_48,
        title: '回款日历',
        callback: async () => {
          if (this.commonBlocker.checkLogin() && await this.commonBlocker.checkExpireLogin()) {
            this.props.navigation.navigate('Calendar4Payback');
          }
        },
      },
      {
        img: ImageStores.me_49,
        title: '风险测评',
        callback: async () => {
          if (this.commonBlocker.checkLogin() && await this.commonBlocker.checkExpireLogin()) {
            this.props.navigation.navigate('JeyxListItemDetail', {
              data: {
                url: '/risk/haveRisk',
                title: '风险测评',
                jsonObj: global.NetReqModel
              },
              ...this.props
            });
          }
        },
      },
      {
        img: ImageStores.me_50,
        title: '客户服务',
        callback: () => { this.showModalView(true, this.renderTelModal()) },
      },
      {
        img: ImageStores.me_51,
        title: '我的二维码',
        callback: async () => {
          if (this.commonBlocker.checkLogin() && await this.commonBlocker.checkExpireLogin()) {
            this.goto('QcodePage', {
              url: '/qrCode',
              title: '我的二维码',
              jsonObj: global.NetReqModel
            })
          }
        },
      },
    ]
    data.map((item, index) => {
      views.push(
        <TouchableHighlight key={index}
          underlayColor='rgba(0,0,0,0)'
          onPress={item.callback}>
          <View style={{ backgroundColor: '#ffffff', width: GlobalStyles.WINDOW_WIDTH }}>
            <View style={{ marginLeft: scaleSize(63), marginRight: scaleSize(63), height: scaleSize(135), flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={item.img} resizeMode={'stretch'} style={{ width: scaleSize(66), height: scaleSize(66), alignSelf: 'center' }} />
                <Text style={{ marginLeft: scaleSize(36), alignSelf: 'center', fontSize: scaleSize(42), color: '#989898' }}>{item.title}</Text>
              </View>
              <Image source={ImageStores.me_6} resizeMode={'stretch'} style={{ width: scaleSize(27), height: scaleSize(45), alignSelf: 'center' }} />
            </View>
            <View style={{ backgroundColor: '#f2f2f2', width: GlobalStyles.WINDOW_WIDTH, height: scaleSize(3) }} />
          </View>
        </TouchableHighlight>
      )
    })
    return (
      <View style={{ marginTop: scaleSize(27) }}>
        {views}
      </View>
    )
  }

  renderScrollView() {
    return (
      <View>
        {this.renderGridView()}
        {this.renderItemView()}
      </View>
    )
  }

  renderTelModal() {
    return (
      <View
        style={{ flex: 1, }}
        visible={this.state.modalTelVisible}
        isPressClosed={false}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <View style={{ flexDirection: 'column', justifyContent: 'center', height: scaleSize(360), width: scaleSize(915), borderRadius: scaleSize(30), backgroundColor: '#fff' }} >
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: scaleSize(50) }}>
              <Text style={{ color: '#998675', fontSize: scaleSize(60) }}>{'400-8780-777'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: scaleSize(39) }}>
              <TouchableHighlight
                style={{ flexDirection: 'row', justifyContent: 'center' }}
                underlayColor='rgba(0,0,0,0)'
                onPress={() => { this.showModalView(false) }}>
                <ImageBackground
                  source={ImageStores.me_35}
                  resizeMode={'stretch'}
                  style={{ width: scaleSize(336), height: scaleSize(135), alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: scaleSize(36), fontWeight: '200', color: '#656565' }}>{'取消'}</Text>
                </ImageBackground>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ flexDirection: 'row', justifyContent: 'center' }}
                underlayColor='rgba(0,0,0,0)'
                onPress={() => {
                  let url = 'tel:400-8780-777'
                  Linking.canOpenURL(url).then(supported => {
                    if (!supported) {
                      console.log('Can\'t handle url: ' + url);
                    } else {
                      return Linking.openURL(url);
                    }
                  }).catch(err => console.error('An error occurred', err));
                }}>
                <ImageBackground
                  source={ImageStores.me_36}
                  resizeMode={'stretch'}
                  style={{ width: scaleSize(336), height: scaleSize(135), alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: scaleSize(36), fontWeight: '200', color: '#FFFFFF' }}>{'呼叫'}</Text>
                </ImageBackground>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </View>
    )
  }

  showModalView(visible, renderView) {
    DeviceEventEmitter.emit('callModal', visible, renderView, this.props.ref_modalView);
  }

  render() {
    let StatusBarView =
      <AppStatusBar
        barColor='#E8152E'
        barStyle='light-content' />
    return (
      <View style={GlobalStyles.rootContainer}>
        {StatusBarView}
        {this.renderParallaxView({}, this.renderScrollView())}
        {this.state.isLoading ? (<LoadingIcon isModal={true} />) : null}
        {ViewUtils.renderToast()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  parallax_stickyHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(150),
    backgroundColor: '#e7142d',
  },
})