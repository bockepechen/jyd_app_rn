import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {GlobalStyles} from '../../res/styles/GlobalStyles'

export default class ViewUtils {
  static renderLine(height, color) {
    return (
      <View style={[styles.line_container, {height:height}]}>
        <View style={[styles.line, {backgroundColor:color}]}/>
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
}

const styles = StyleSheet.create({
  line_container: {
    backgroundColor:'#FFFFFF',
    paddingLeft:8,
    paddingRight:8,
  },
  line: {
    flex:1,
  },
  back_btn_container: {
    paddingLeft: GlobalStyles.WINDOW_WIDTH*0.01,
  },
  back_btn_image: {
    width:24, 
    height:24,
  }
})