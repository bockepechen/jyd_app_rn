import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {GlobalStyles} from '../../res/styles/GlobalStyles';
import {ImageStores} from '../../res/styles/ImageStores';
import {scaleSize} from './FitViewUtils';
import Toast from 'react-native-easy-toast'

export default class ViewUtils {
  static renderLine(color, isVertical, padding_start, padding_end) {
    let container_style = isVertical?
    {
      paddingTop:padding_start?padding_start:2,
      paddingBottom:padding_end?padding_end:2,
      width:GlobalStyles.PIXEL
    }:
    {
      paddingLeft:padding_start?padding_start:8,
      paddingRight:padding_end?padding_end:8,
      height:GlobalStyles.PIXEL,
    };
    return (
      <View style={[{
        backgroundColor:'#FFFFFF',
      },container_style]}>
        <View style={{flex:1, backgroundColor:color}}/>
      </View>
    )
  }

  static renderBackBtn(color, callback) {
    return (
      <TouchableOpacity style={styles.back_btn_container} 
        onPress={callback}>
        <Image 
          source={ImageStores.cp_10}
          resizeMode={'stretch'}
          style={{width:scaleSize(27), height:scaleSize(45)}}/>
      </TouchableOpacity>
    )
  }

  static renderRightBtn(title, callback) {
    return (
      <TouchableOpacity style={styles.right_btn_container} 
        onPress={callback}>
        <Text style={{fontSize:scaleSize(42), color:'#ffffff'}}>{title}</Text>
      </TouchableOpacity>
    )
  }

  static renderToast(p) {
    return (
      <Toast
        opacity={0.6}
        positionValue={p ? p : 130}
        ref='toast'/>
    )
  }

  static renderTransparentTabNavFoot() {
    return (
      <View style={{height:GlobalStyles.BOTTOM_TAB_NAV_HEIGHT}}/>
    )
  }
}

const styles = StyleSheet.create({
  back_btn_container: {
    paddingLeft: scaleSize(75),
    width:scaleSize(150),
    height:scaleSize(120),
    justifyContent:'center'
  },
  right_btn_container: {
    paddingRight: scaleSize(51),
  },
})