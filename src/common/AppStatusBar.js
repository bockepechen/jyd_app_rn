import React, { Component } from 'react';
import {
  View,
  Platform,
  StatusBar,
} from 'react-native';
import PropTypes from 'prop-types';
import {GlobalStyles} from '../../res/styles/GlobalStyles'

/**
 * StatusBarStyle: "default" | "light-content" | "dark-content"
 */
const DEFAULT_STATUSBAR_STYLE = 'dark-content';
const DEFAULT_STATUSBAR_COLOR = 'rgba(255,255,255,1)';
const DEFAULT_STATUSBAR_TRANSLUCENT = false;

export default class AppStatusBar extends Component {

  static propTypes = {
    barColor: PropTypes.string,
    barStyle: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this._barColor = this.props.barColor?this.props.barColor:DEFAULT_STATUSBAR_COLOR;
    this._barStyle = this.props.barStyle?this.props.barStyle:DEFAULT_STATUSBAR_STYLE;
    this.state = {
      statusBar_conf:{
        backgroundColor: this._barColor,
        barStyle: this._barStyle,
        translucent: DEFAULT_STATUSBAR_TRANSLUCENT,
      }
    }
  }
  componentWillUpdate(nextProps, nextState) {
    StatusBar.setBarStyle(this._barStyle);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(this._barColor);
      StatusBar.setTranslucent(DEFAULT_STATUSBAR_TRANSLUCENT);
    }
  }
  render() {
    return (
      <View style={{backgroundColor:this._barColor, height:GlobalStyles.STATUSBAR_HEIGHT}}>
        <StatusBar {...this.state.statusBar_conf}/>
      </View>
    )
  }
}