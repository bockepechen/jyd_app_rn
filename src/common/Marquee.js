import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ViewPropTypes,
  Animated,
  Easing,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import {GlobalStyles} from '../../res/styles/GlobalStyles';

export default class Marquee extends Component {
  constructor(props) {
    super(props);
    this.mHeight = this.props.height;
    this.state = {
      translateY: new Animated.Value(0)
    }
  }

  componentDidMount() {
    this.showHeadBar(0, this.props.data.length);
  }

  showHeadBar(index, count) {
    index++;
    Animated.timing(this.state.translateY, {
      toValue: -(this.mHeight * index),                 //40为文本View的高度
      duration: this.props.duration,                    //动画时间
      Easing: Easing.linear,
      delay: this.props.delay                           //文字停留时间
    }).start(() => {                                    //每一个动画结束后的回调 
      if(index >= count) {
        index = 0;
        this.state.translateY.setValue(0);
      }
      this.showHeadBar(index, count);                   //循环动画
    })
  }

  renderRollMsgView() {
    let views = [];
    return this.props.data.map((item, index) => {
      return (
        <View key={index} style={[styles.bar, {height:this.mHeight}]}>
          <Text style={styles.barText}>{item.msgTxt}</Text>
        </View>
      )
    })
  }

  render() {
    return (
      <View style={[styles.container,{height:this.mHeight}]}>
        <View style={[styles.signContainer,{height:this.mHeight}]}>
          <Image style={{width:this.mHeight*0.6, height:this.mHeight*0.6, tintColor:'white'}}
            source={require('../../res/images/ic_pages.png')} />
        </View>
        <View>
          <Animated.View
            style={[styles.wrapper, {
                transform: [{
                  translateY: this.state.translateY
                }]
              }
            ]}>
            {this.renderRollMsgView()}
          </Animated.View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginLeft:5,
    marginRight:5,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
    flexDirection: 'row',
  },
  wrapper: {
    marginHorizontal: 5,
  },
  bar: {
    justifyContent: 'center',
  },
  barText: {
    width:GlobalStyles.WINDOW_WIDTH-53,
    marginLeft: 5,
    color: '#FFFFFF',
    fontSize: 14,
  },
  signContainer: {
    justifyContent:'center', 
    marginLeft:2
  }
})