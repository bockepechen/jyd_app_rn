import React, { Component } from 'react';
import {
  View,
  Image,
  Animated,
  Easing,
  DeviceEventEmitter,
  Button
} from 'react-native';
import {ImageStores} from '../../../res/styles/ImageStores';
import {scaleSize} from '../../utils/FitViewUtils';

export default class RotateAnimate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      springValue: new Animated.Value(0.3)
    }
  }

  spring () {
    this.state.springValue.setValue(0.3)
    Animated.spring(
      this.state.springValue,
      {
        toValue: 1,
        friction: 1
      }
    ).start()
  }

  render() {
    return (
      <View style={{flex:1,alignItems:'center', justifyContent:'center'}}>
          <Animated.Image 
          source={ImageStores.dl_2} 
          resizeMode={'stretch'}
          style={{
            width:scaleSize(288), 
            height:scaleSize(288),
            transform: [{scale: this.state.springValue}]
          }} />
          <Button title='弹跳' onPress={()=>{this.spring()}}/>
      </View>
    )
  }
}