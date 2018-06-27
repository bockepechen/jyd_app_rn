import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image
} from 'react-native';
import Swiper from 'react-native-swiper';
import SplashScreen from 'react-native-splash-screen';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import InitialDao from '../../dao/InitialDao';

let p1_uri = 'http://c12.eoemarket.net/app0/703/703939/screen/3490585.png'
let p2_uri = 'http://8.pic.pc6.com/thumb/up/2016-8/20168241155552193192400850570_600_566.jpg'
let p3_uri = 'http://pic.downyi.com/upload/2017-12/2017121885958764860.jpg'
let p4_uri = 'http://img.zcool.cn/community/016f3f580da69fa84a0e282bd958cc.png'

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.initialDao = new InitialDao();
    this.state = {
      countDownTime: 3,
      ifShowJumpBtn: false,
      ifFirstOpen: true
    }
  }

  componentWillMount() {

  }

  async init() {
    let initialData = await this.initialDao.getInitailData('AppOpen');
    if (initialData) {
      this.setState({
        ifFirstOpen: initialData.ifFirstOpen
      });
      this.countDown();
    } else {
      await this.initialDao.saveInitialData('AppOpen', {ifFirstOpen: false});
    }
  }

  componentDidMount() {
    SplashScreen.hide();
    this.init();
  }

  onSwipe = (index) => {
    if(index === 2) {
      this.setState({ifShowJumpBtn:true});
      this.countDown();
    }
  }

  countDown() {
    this.timer = setInterval(() => {
      if (this.state.countDownTime === 0) {
        this.props.navigation.navigate('App');
      } else {
        this.setState({
          countDownTime: this.state.countDownTime - 1
        })
      }
    }, 1000);
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  render() {
    let jumpBtn = 
      <View style={{
        backgroundColor:'rgba(255,255,255,0.1)',
        height:30,
        justifyContent:'center', 
        alignItems:'center',
        position:'absolute',
        left:Dimensions.get('window').width*0.70,
        right:Dimensions.get('window').width*0.1,
        top:30,
        borderRadius:3,
        borderWidth:1,
        borderColor:'white'
      }}>
        <Text style={{
          fontSize:13,
          color:'white'
        }}>{`跳过广告 ${this.state.countDownTime}`}
        </Text>
      </View>
      let FirstView = 
        <View style={GlobalStyles.rootContainer}>
          <Swiper
            horizontal={true}
            onIndexChanged={this.onSwipe}
            loop={false}>
            <Image source={{uri:p1_uri}} style={styles.banner_image} />
            <Image source={{uri:p2_uri}} style={styles.banner_image} />
            <Image source={{uri:p3_uri}} style={styles.banner_image} />
          </Swiper>
          {this.state.ifShowJumpBtn?jumpBtn:null}
        </View>
      let UnFirstView = 
        <View style={GlobalStyles.rootContainer}>
          <Image source={{uri:p4_uri}} style={styles.banner_image} />
        </View>
    return (
      this.state.ifFirstOpen?FirstView:UnFirstView
    )
  }
}

const styles = StyleSheet.create({
  banner_image:{
    flex:1,
    width:GlobalStyles.WINDOW_WIDTH,
    height:GlobalStyles.WINDOW_HEIGHT
  }
})