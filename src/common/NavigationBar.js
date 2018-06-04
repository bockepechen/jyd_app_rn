import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  StatusBar,
  ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';
import AppStatusBar from './AppStatusBar';
import {GlobalStyles} from '../../res/styles/GlobalStyles'

export default class NavigationBar extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    titleColor: PropTypes.string,
    titleSize: PropTypes.number,
    titleView: PropTypes.element,
    hide: PropTypes.bool,
    leftButton: PropTypes.element,
    rightButton: PropTypes.element,
    navColor: PropTypes.string,
    statusBarColor: PropTypes.string,
    statusBarStyle: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      hide: false
    };
  }

  getButtonElement = (data) => {
    return (
        <View style={styles.navBarButton}>
            {data? data : null}
        </View>
    );
  }

  render() {
    let titleView = 
      this.props.titleView?
        this.props.titleView:
        <Text style={{
          color: this.props.titleColor?this.props.titleColor:'white',
          fontSize: this.props.titleSize?this.props.titleSize:20,
        }}>{this.props.title}</Text>

    let content = 
      <View style={[styles.navBar, {backgroundColor:this.props.navColor,}]}>
        {this.getButtonElement(this.props.leftButton)}
        <View style={styles.titleView}>
          {titleView}
        </View>
        {this.getButtonElement(this.props.rightButton)}
      </View>

    return (
      <View style={[styles.container]}>
        <AppStatusBar 
          barColor={this.props.statusBarColor}
          barStyle={this.props.statusBarStyle}/>
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gray',
  },
  navBar: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: GlobalStyles.NAVBAR_HEIGHT,
    flexDirection: 'row',
  },
  titleView: {
    justifyContent: 'center',
    alignItems: 'center',
    position:'absolute',
    left: 40,
    right: 40,
    top: 0,
    bottom: 0,
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
  navBarButton: {
    alignItems: 'center',
  },
});