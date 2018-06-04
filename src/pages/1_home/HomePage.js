import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
  StatusBar
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import AppStatusBar from '../../common/AppStatusBar';
import Swiper from 'react-native-swiper';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {GlobalStyles} from '../../../res/styles/GlobalStyles'

let p1_uri = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527674184394&di=316aa1eb2034bca1b9746af29e78db4f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F017cc1597b0c83a8012193a31ba999.jpg%401280w_1l_2o_100sh.jpg'
let p2_uri = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527674226142&di=f486f35442645d487186503bf62903e4&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F017eed57c94e7e0000012e7e8f6312.jpg%401280w_1l_2o_100sh.png'
let p3_uri = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527674255194&di=bea2be5484b6d128cf77e6ec1b203895&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01de9255cb662432f8755e66c8ea92.jpg%401280w_1l_2o_100sh.jpg'
let p4_uri = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527674304224&di=db5ff5bb32be90414fa4dc066eff44f0&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F014d1857ce1a7c0000012e7e4e86b6.jpg%401280w_1l_2o_100sh.jpg'

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  componentWillUpdate(nextProps, nextState) {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('dark-content');
    }
  }

  renderSwiper() {
    return (
      <View style={{height:200}}>
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
        contentBackgroundColor="pink"
        parallaxHeaderHeight={200}
        stickyHeaderHeight={GlobalStyles.PARALLAX_HEADER_HEIGHT}
        {...parallaxConfig}
        >
        {contentView}
      </ParallaxScrollView>
    )
  }

  render() {
    let StatusBarView = Platform.OS==='ios'?
      null:
      <AppStatusBar 
          barColor='#AAAAAA'
          barStyle='light-content'/>
    let contentView = 
      <ScrollView>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me</Text>
        <Text>Scroll me11111</Text>
        <Text>Scroll me11111</Text>
        <Text>Scroll me11111</Text>
        <Text>Scroll me11111</Text>
        <Text>Scroll me11111</Text>
        <Text>Scroll me11111</Text>
        <Text>Scroll me11111</Text>
        <Text>Scroll me11111</Text>
      </ScrollView>
    return (
      <View style={GlobalStyles.rootContainer}>
        {StatusBarView}
        {this.renderParallaxView({}, contentView)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  banner_image: {
    width:Dimensions.get('window').width,
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
  }
})