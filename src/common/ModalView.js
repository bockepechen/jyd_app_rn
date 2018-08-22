import React, {Component} from 'react';
import {
  View,
  Easing, 
  Animated,
  StyleSheet, 
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import {GlobalStyles} from '../../res/styles/GlobalStyles';

export default class ModalView extends Component {
  static propTypes = {
    isPressClosed: PropTypes.bool, // 是否通过点击遮罩层关闭Modal 标志位
  }

  static defaultProps = {
    isPressClosed: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      fadeOpacity: new Animated.Value(0)
    }
  }

  /**
   * 打开Modal方法 (通过该组件引用调用)
   * @param {*} modalContentView   Modal中间展示层
   */
  show(modalContentView) {
    this.setState({
      visible: true,
      modalContentView: modalContentView
    }, this._fadeIn());
  }

  // 加载Modal展示动画
  _fadeIn() {
    this.state.fadeOpacity.setValue(0);
    Animated.timing(this.state.fadeOpacity, {
      toValue: 0.5,
      duration: 500,
      easing: Easing.linear
    }).start();
  }

  // 点击遮罩调用关闭方法
  _dimiss() {
    if(this.props.isPressClosed) {
      this.setState({visible: !this.state.visible})
    }
  }

  // 渲染Modal方法
  _renderModalView() {
    return (
      <TouchableWithoutFeedback onPress={()=>{this._dimiss()}}>
        <View style={styles.modal_container}>
          <Animated.View style={[styles.modal_container,{backgroundColor:'#000000', opacity:this.state.fadeOpacity}]}/>
          {this.state.modalContentView}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  render() {
    return this.state.visible?this._renderModalView():(<View/>)
  }
}

const styles = StyleSheet.create({
  modal_container: {
    width:GlobalStyles.WINDOW_WIDTH, 
    height:GlobalStyles.WINDOW_HEIGHT, 
    position:'absolute', 
    top:0,
  }
})