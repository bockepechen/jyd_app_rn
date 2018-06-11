import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {GlobalStyles} from '../../res/styles/GlobalStyles'

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
        <Image style={[styles.back_btn_image, {tintColor:color}]}
          source={require('../../res/images/ic_arrow_back_white_36pt.png')}/>
      </TouchableOpacity>
    )
  }

  static renderTransparentTabNavFoot() {
    return (
      <View style={{height:GlobalStyles.TAB_NAVIGATATOR_HEIGHT}}/>
    )
  }
}

const styles = StyleSheet.create({
  back_btn_container: {
    paddingLeft: GlobalStyles.WINDOW_WIDTH*0.01,
  },
  back_btn_image: {
    width:24, 
    height:24,
  }
})