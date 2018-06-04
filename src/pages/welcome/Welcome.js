import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image
} from 'react-native';
import Swiper from 'react-native-swiper';
import SplashScreen from 'react-native-splash-screen';
import {GlobalStyles} from '../../../res/styles/GlobalStyles'

let p1_uri = 'http://c12.eoemarket.net/app0/703/703939/screen/3490585.png'
let p2_uri = 'http://8.pic.pc6.com/thumb/up/2016-8/20168241155552193192400850570_600_566.jpg'
let p3_uri = 'http://pic.downyi.com/upload/2017-12/2017121885958764860.jpg'
export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countDownTime: 3,
      ifShowJumpBtn: false
    }
  }

  componentDidMount() {
    // console.log(`窗口宽为：${Dimensions.get('window').width}`);
    // console.log(`窗口高为：${Dimensions.get('window').height}`);
    SplashScreen.hide();
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  onSwipe = (index) => {
    if(index === 2) {
      this.setState({ifShowJumpBtn:true});
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
    return (
      <View style={{flex:1}}>
        <Swiper
          horizontal={true}
          onIndexChanged={this.onSwipe}>
          <Image source={{uri:p1_uri}} style={styles.banner_image} />
          <Image source={{uri:p2_uri}} style={styles.banner_image} />
          <Image source={{uri:p3_uri}} style={styles.banner_image} />
        </Swiper>
        {this.state.ifShowJumpBtn?jumpBtn:null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  banner_image:{
    flex:1,
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height
  }
})