import React, {Component} from 'react';
import {View,
  TouchableWithoutFeedback,
  Animated,
  Easing, 
  StyleSheet, 
} from 'react-native';
import PropTypes from 'prop-types';
import {GlobalStyles} from '../../res/styles/GlobalStyles';

export default class ModalView extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    isPressClosed: PropTypes.bool
  }

  static defaultProps = {
    visible: false,
    isPressClosed: false
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      fadeOpacity: new Animated.Value(0)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible
    });
  }

  componentDidMount() {
    this._fadeIn();
  }

  _fadeIn() {
    Animated.timing(this.state.fadeOpacity, {
      toValue: 0.5,
      duration: 500,
      easing: Easing.linear
    }).start();
  }

  _dimiss() {
    if(this.props.isPressClosed) {
      this.setState({visible: !this.state.visible})
    }
  }

  _renderModalView() {
    return (
      <TouchableWithoutFeedback onPress={()=>{this._dimiss()}}>
        <View style={styles.modal_container}>
          <Animated.View style={[styles.modal_container,{backgroundColor:'#000000', opacity:this.state.fadeOpacity}]}/>
          {this.props.children}
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