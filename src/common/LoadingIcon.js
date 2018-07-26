import React, { Component } from 'react';
import {
  View,
  Image,
  Animated,
  Easing,
  DeviceEventEmitter
} from 'react-native';
import {GlobalStyles} from '../../res/styles/GlobalStyles';
import {scaleSize} from '../utils/FitViewUtils';
import {ImageStores} from '../../res/styles/ImageStores';

export default class LoadingIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rotateValue: new Animated.Value(0), //旋转角度的初始值
      isRotate:true
    }
    this.isPlaying = false;
    this.playerAnimated = Animated.timing(this.state.rotateValue, {
        toValue: 1, //角度从0变1
        duration: 1500, //从0到1的时间
        easing: Easing.inOut(Easing.linear), //线性变化，匀速旋转
    });
  }

  componentDidMount() {
    console.log('LoadingIcon Component did mount.');
    // this.animateListener = DeviceEventEmitter.addListener('ANIMATE_LISTENER', (isPlaying) => {this.play(isPlaying)});
    this.play(true);
  }

  componentWillUnmount() {
    this.play(false);
    // this.animateListener.remove();
    console.log('LoadingIcon Component will unmount.');
  }


  play(isPlaying) {
    this.isPlaying = isPlaying;
    if (this.isPlaying) {
        this.startPlay();
    } else {
        this.stopPlay();
    }
  }

  rotating() {
    if (this.isPlaying) {
      this.state.rotateValue.setValue(0);
      this.playerAnimated.start(() => {
          console.log('Animation is working');
          this.rotating()
      })
    }
  }

  startPlay() {
    this.playerAnimated.start(() => {
      this.playerAnimated = Animated.timing(this.state.rotateValue, {
          toValue: 1, //角度从0变1
          duration: 1500, //从0到1的时间
          easing: Easing.inOut(Easing.linear), //线性变化，匀速旋转
      });
      this.rotating();
    });
  }

  stopPlay() {
    this.state.rotateValue.stopAnimation((oneTimeRotate) => {
      //计算角度比例
      this.playerAnimated = Animated.timing(this.state.rotateValue, {
          toValue: 1,
          duration: (1-oneTimeRotate) * 1500,
          easing: Easing.inOut(Easing.linear),
      });
      console.log('Animation stops.');
    });
  }

  render() {
    return (
      <View style={{
        position:'absolute', 
        width:scaleSize(150), 
        height:scaleSize(150), 
        top:(GlobalStyles.WINDOW_HEIGHT-scaleSize(150))/2,
        left:(GlobalStyles.WINDOW_WIDTH-scaleSize(150))/2,
        alignItems:'center',
        justifyContent:'center'
      }}>
        <Animated.Image 
          source={ImageStores.ld_1} 
          resizeMode={'stretch'} 
          style={{
            width:scaleSize(150), 
            height:scaleSize(150), 
            position:'absolute', 
            top:0, 
            left:0,
            tintColor:'	rgba(232,21,46,0.8)',
            transform:[
              {rotateZ: this.state.rotateValue.interpolate({
                inputRange: [0,1],
                outputRange: ['-0deg', '-360deg'],
              })},
            ]
          }}/>
        <Image source={ImageStores.ld_2} resizeMode={'stretch'} style={{width:scaleSize(66), height:scaleSize(66), tintColor:'	rgba(232,21,46,0.8)'}}/>
      </View>
    )
  }
}