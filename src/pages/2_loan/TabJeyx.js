import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import ProductCardMain from './ProductCardMain';
import ProductCardSub from './ProductCardSub';
import {ImageStores} from '../../../res/styles/ImageStores';

export default class TabJeyx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      countDownNum: 3,
      bounceValue: new Animated.Value(1), //你可以改变这个值看
      rotateValue: new Animated.Value(0),//旋转角度的初始值
    }
  }

  componentDidMount() {
    // this.startAnimation();
    // this.timer = setInterval(() => {
    //   if (this.state.countDownNum > 0) {
    //     this.setState({countDownNum: this.state.countDownNum - 1});
    //   } else {
    //     clearInterval(this.timer);
    //     this.setState({
    //       isLoading: false
    //     })
    //   }
    // }, 1000)
  }

  startAnimation() {
    this.state.bounceValue.setValue(1);
    this.state.rotateValue.setValue(0);
    Animated.parallel([
        //通过Animated.spring等函数设定动画参数
        //可选的基本动画类型: spring, decay, timing
        Animated.spring(this.state.bounceValue, {
            toValue: 1,      //变化目标值，也没有变化
            friction: 20,    //friction 摩擦系数，默认40
        }), 
        Animated.timing(this.state.rotateValue, {
            toValue: 1,  //角度从0变1
            duration: 1500,  //从0到1的时间
            easing: Easing.out(Easing.linear),//线性变化，匀速旋转
        }),
        //调用start启动动画,start可以回调一个函数,从而实现动画循环
    ]).start(()=>this.startAnimation());
  }

  renderLoadingView() {
    return (
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <Animated.Image
          source={ImageStores.active_1} 
          resizeMode={'contain'} 
          style={[
            {width:100, height:100, borderRadius:Platform.OS==='ios'?50:100},
            {
              transform:[
                {scale: this.state.bounceValue},
                {rotateZ: this.state.rotateValue.interpolate({
                  inputRange: [0,1],
                  outputRange: ['-0deg', '-360deg'],
                })},
              ]
            }
          ]}/>
      </View>
    )
  }

  renderMainView() {
    return(
      <ScrollView>
        <View style={{marginTop:scaleSize(48), width:GlobalStyles.WINDOW_WIDTH, alignItems:'center'}}>
          <Text style={{fontSize:scaleSize(48), color:'#998675'}}>{'每日9:00准时开抢'}</Text>
          <ProductCardMain
            top={scaleSize(39)}
            data={''}/>
        </View>
        {this.renderSubProductView()}
        <View style={{height:GlobalStyles.BOTTOM_TAB_NAV_HEIGHT+scaleSize(60)}}/>
      </ScrollView>
    )
  }

  renderSubProductView() {
    let views = [];
    let subProductData = ['','','',''];
    subProductData.map((item, index) => {
      views.push(
        <ProductCardSub
        key={index}
        top={0}
        bottom={scaleSize(18)}
        data={item}/>
      )
    })
    return (
      <View style={{marginTop:scaleSize(6)}}>
        {views}
      </View>
    )
  }

  render() {
    return (
      this.state.isLoading?
        this.renderLoadingView():
        this.renderMainView()
    )
  }
}