import React, {Component} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  TouchableHighlight,
  Text,
  Keyboard
} from 'react-native'
import { scaleSize } from '../../utils/FitViewUtils';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';

export default class AuthCode extends Component {
  constructor(props) {
    super(props);
    this.codeNum = 6;
    var txtArray = []
    for (var i = 0; i < this.codeNum; i++) {
      txtArray.push('');
    }
    this.state = {
      txtArray:txtArray
    }
  }

  componentDidMount() {
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidHide = () => {
    this.refs.textRef.blur();
  }

  callKeyboard = () => {
    this.refs.textRef.focus();
  }

  convertInputChars = (t) => {
    let charsArray = t.split('');
    var aLength = charsArray.length;
    for(let i = 0; i < (this.codeNum - aLength); i++) {
      charsArray.push('');
    }
    this.setState({
      txtArray:charsArray
    })
    if (aLength === this.codeNum) {
      this._finishInput(t);
    }
  }

  _finishInput(t) {
    // console.log(`录入验证码为：${t}`)
    this.props.callback(t);
    // this.props.onPressItem(t);
  }
  
  renderCodeView() {
    let codeView = [];
    for (let i = 0; i < this.codeNum; i++) {
      codeView.push(
        <TouchableHighlight 
          key={i}
          style={[
            styles.code_container,
            {
              borderBottomColor:this.state.txtArray[i]===''?'#c3c3c3':'#E8152E',
              // shadowColor:this.state.txtArray[i]===''?'#c3c3c3':'#E8152E',
              // shadowOffset:this.state.txtArray[i]===''?{width:0, height:0}:{width:0.8, height:0.8},
              // shadowOpacity:this.state.txtArray[i]===''?0:0.5,
              // shadowRadius:this.state.txtArray[i]===''?0:2,
              // elevation:this.state.txtArray[i]===''?0:2
            }
          ]}
          underlayColor='rgba(0,0,0,0)'
          onPress={this.callKeyboard}>
          <Text style={{fontSize:30, fontWeight:'300'}}>{this.state.txtArray[i]}</Text>
        </TouchableHighlight>
      )
    }
    return (
      <View style={{flexDirection:'row', justifyContent:'space-between', width:scaleSize(999)}}>
        {codeView}
      </View>
    )
  }

  render() {
    let kbType = Platform.OS==='ios'?'number-pad':'numeric';
    return (
      <View style={{alignItems:'center', justifyContent:'center'}}>
        <TextInput 
          style={{width:0, height:0, paddingTop:0, paddingBottom:0}} 
          ref='textRef'
          maxLength={this.codeNum}
          keyboardType={kbType}
          onChangeText={this.convertInputChars}
          />
        {this.renderCodeView()}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  code_container: {
    width:35, 
    height:Platform.OS==='ios'?50:45, 
    alignItems:'center', 
    justifyContent:'flex-end',
    borderBottomWidth:GlobalStyles.PIXEL*2, 
  },
})