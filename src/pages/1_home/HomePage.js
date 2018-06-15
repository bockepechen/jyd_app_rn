import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  DeviceInfo,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import AppStatusBar from '../../common/AppStatusBar';
import Swiper from 'react-native-swiper';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import Marquee from '../../common/Marquee';
import HomeProduct from './HomeProduct';
import ViewUtils from '../../utils/ViewUtils';
import AndroidBackHandler from '../../utils/AndroidBackHandler'

let p1_uri = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527674184394&di=316aa1eb2034bca1b9746af29e78db4f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F017cc1597b0c83a8012193a31ba999.jpg%401280w_1l_2o_100sh.jpg'
let p2_uri = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527674226142&di=f486f35442645d487186503bf62903e4&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F017eed57c94e7e0000012e7e8f6312.jpg%401280w_1l_2o_100sh.png'
let p3_uri = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527674255194&di=bea2be5484b6d128cf77e6ec1b203895&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01de9255cb662432f8755e66c8ea92.jpg%401280w_1l_2o_100sh.jpg'
let p4_uri = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527674304224&di=db5ff5bb32be90414fa4dc066eff44f0&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F014d1857ce1a7c0000012e7e4e86b6.jpg%401280w_1l_2o_100sh.jpg'
const msgArray = [
  {msgTxt: '1. 扫接送啊接送哦册那扫i几次送啊急哦i超级骚'},
  {msgTxt: '2. 次哦啊囧超级三哦参加哦i撒从啊手机哦参加哦撒手机啊黄i是'},
  {msgTxt: '3. 时空怕靠谱纯牛奶扫你才骚就从萨科皮卡车怕时间'},
  {msgTxt: '4. 岁啊还吃呢少见哦贾长松i接啊词接送i就从撒'},
]

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.AndroidBackHandler = new AndroidBackHandler(props);
  }

  componentWillUpdate(nextProps, nextState) {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('dark-content');
    }
  }

  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
  }

  componentWillUnmount() {
    this.AndroidBackHandler.removePressBackListener();
  }

  renderSwiper() {
    return (
      <View style={{height:DeviceInfo.isIPhoneX_deprecated?244:200}}>
        <Swiper
          horizontal={true}
          paginationStyle={{bottom: 10}}>
          <Image source={{uri:p1_uri}} style={styles.banner_image} />
          <Image source={{uri:p2_uri}} style={styles.banner_image} />
          <Image source={{uri:p3_uri}} style={styles.banner_image} />
          <Image source={{uri:p4_uri}} style={styles.banner_image} />
        </Swiper>
      </View>
    )
  }
  getParallaxRenderConfig(params) {
    let config = {};
    config.renderForeground = () => (
      this.renderSwiper()
    );
    config.renderStickyHeader = () => (
      <View style={styles.parallax_stickyHeader}/>
    );
    config.renderFixedHeader = () => (
      <View style={styles.parallax_fixHeader}>
        <Text style={{fontSize:10, fontWeight:'bold'}}>{'左侧按钮'}</Text>
        <Text style={{fontSize:10, fontWeight:'bold'}}>{'右侧按钮'}</Text>
      </View>
    );
    return config;
  }

  renderParallaxView(params, contentView) {
    let parallaxConfig = this.getParallaxRenderConfig(params);
    return (
      <ParallaxScrollView
        backgroundColor="white"
        contentBackgroundColor="#F0F0F0"
        parallaxHeaderHeight={DeviceInfo.isIPhoneX_deprecated?244:200}
        stickyHeaderHeight={GlobalStyles.PARALLAX_HEADER_HEIGHT}
        {...parallaxConfig}
        >
        {contentView}
      </ParallaxScrollView>
    )
  }

  renderScrollView() {
    return (
      <View>
        <Marquee
          data={msgArray}
          fontSize={11}
          height={20}
          duration={1000}
          delay={3000} />
        <View>
          <TouchableOpacity style={{
            backgroundColor:'#66CDAA',
            marginTop:5,
            marginBottom:5,
            marginLeft:8,
            marginRight:8,
            height:150,
            shadowColor:'gray',
            shadowOffset:{width:0.5, height:0.5},
            shadowOpacity:0.5,
            shadowRadius:2,
            elevation:2,
            alignItems:'center', 
            justifyContent:'center'
          }}>
          <Text style={{fontSize:30, fontWeight:'bold', color:'#FFFFFF'}}>活 动 栏 位</Text>
          </TouchableOpacity>
        </View>
        <HomeProduct
          {...this.props} />
      </View>
    )
  }

  render() {
    let StatusBarView = Platform.OS==='ios'?
      null:
      <AppStatusBar 
          barColor='#AAAAAA'
          barStyle='light-content'/>
    return (
      <View style={GlobalStyles.rootContainer}>
        {StatusBarView}
        {this.renderParallaxView({}, this.renderScrollView())}
        {ViewUtils.renderTransparentTabNavFoot()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  banner_image: {
    width:GlobalStyles.WINDOW_WIDTH,
    height:200
  },
  parallax_fixHeader: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left:0,
    top:0,
    flexDirection:'row',
    alignItems:'center',
    paddingTop:GlobalStyles.STATUSBAR_HEIGHT,
    paddingRight:4,
    paddingLeft:4,
    justifyContent:'space-between',
  },
  parallax_stickyHeader: {
    justifyContent: 'center',
    alignItems:'center',
    paddingTop:GlobalStyles.STATUSBAR_HEIGHT,
  },
})