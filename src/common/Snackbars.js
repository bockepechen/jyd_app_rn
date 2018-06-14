import React, { Component } from 'react';
import {
  Animated,
  Easing
} from 'react-native';

export default class Snackbars extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),          // 透明度初始值设为0
    };
  }
  componentDidMount() {
    // Animated.timing(                            // 随时间变化而执行的动画类型
    //   this.state.fadeAnim,                      // 动画中的变量值
    //   {
    //     toValue: 1,                             // 透明度最终变为1，即完全不透明
    //     easing: Easing.linear,
    //     duration: 1000
    //   }
    // ).start();                                  // 开始执行动画
    Animated.parallel([
        
        Animated.timing(                            // 随时间变化而执行的动画类型
            this.state.fadeAnim,                      // 动画中的变量值
            {
              toValue: 1,                             // 透明度最终变为1，即完全不透明
              easing: Easing.linear,
              duration: 500
            }
        ),
        Animated.timing(this.state.fadeAnim, {
            toValue: 50,
            easing: Easing.linear,
            duration: 1000
        }),
        
        
    ]).start()
  }
  render() {
    return (
      <Animated.View                            // 可动画化的视图组件
        style={[{
          ...this.props.style,
          opacity: this.state.fadeAnim,          // 将透明度指定为动画变量值
        },{transform: [{translateY: this.state.fadeAnim}]}]}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
