import React, { Component } from 'react';
import {
  View,
  ViewPropTypes,
  SafeAreaView,
  DeviceInfo
} from 'react-native';
import PropTypes from 'prop-types';
import {GlobalStyles} from '../../res/styles/GlobalStyles';

export default class SafeAreaViewPlus extends Component {
  static propTypes = {
    ...ViewPropTypes,
    topColor: PropTypes.string,
    bottomColor: PropTypes.string,
    enablePlus: PropTypes.bool,
    topInset: PropTypes.bool,
    bottomInset: PropTypes.bool,
    topHeight: PropTypes.number,
    bottomHeight: PropTypes.number,
  }

  static defaultProps = {
    topColor: 'transparent',
    bottomColor: '#f8f8f8',
    enablePlus: true,
    topInset: false,
    bottomInset: true,
    topHeight: 44,
    bottomHeight: 34,
  }

  genSafeAreaViewPlus() {
    const {children, topColor, bottomColor, topInset, bottomInset, topHeight, bottomHeight} = this.props;
    return (
      <View style={[GlobalStyles.rootContainer, this.props.style]}>
        {this.genTopArea(topColor, topInset, topHeight)}
        {children}
        {this.genBottomArea(bottomColor, bottomInset, bottomHeight)}
      </View>
    )
  }

  genSafeAreaView() {
    return (
      <SafeAreaView style={[GlobalStyles.rootContainer, this.props.style]} {...this.props}>
        {this.props.children}
      </SafeAreaView>
    )
  }

  genTopArea(topColor, topInset, topHeight) {
    return DeviceInfo.isIPhoneX_deprecated && !topInset?
            <View style={{backgroundColor: topColor, height: topHeight}}/>:
            null;
          }
          
  genBottomArea(bottomColor, bottomInset, bottomHeight) {
    return DeviceInfo.isIPhoneX_deprecated && !bottomInset?
            <View style={{backgroundColor: bottomColor, height: bottomHeight}}/>:
            null;

  }
  
  render() {
    return this.props.enablePlus?
            this.genSafeAreaViewPlus():
            this.genSafeAreaView();
  }
}