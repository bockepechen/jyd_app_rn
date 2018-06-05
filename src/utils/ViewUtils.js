import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

export default class ViewUtils {
  static renderLine(height, color) {
    return (
      <View style={[styles.lineContainer, {height:height}]}>
        <View style={[styles.line, {backgroundColor:color}]}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  lineContainer: {
    backgroundColor:'#FFFFFF',
    paddingLeft:8,
    paddingRight:8,
  },
  line: {
    flex:1,
  },
})