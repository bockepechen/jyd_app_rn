import React, { PureComponent } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';

export default class MsgListStationMessage extends PureComponent {
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps) {
      this.props = nextProps;
    }

    _onPress = () => {
      this.props.onPressItem(this.props.id,this.props.item);
    };
  
    render() {
      const textColor = this.props.selected || (this.props.item.um_readstatus == '01') ? "#959595" : "#656565";
      return (
        <View style={{flex:1,height:scaleSize(198),backgroundColor:'#fff'}}>
          <TouchableOpacity onPress={this._onPress} style={{flex:1,flexDirection:'column', justifyContent:'space-between',alignItems:'flex-start'}}>
              <View style={{flex:1,marginLeft:scaleSize(108),marginRight:scaleSize(108)}}>
                <Text numberOfLines={1} style={{color: textColor,fontSize:scaleSize(42),marginTop:scaleSize(50) }}>
                  {this.props.item.um_title}
                </Text>
                <Text style={{color: textColor,fontSize:scaleSize(32),position:'absolute',bottom:scaleSize(18)}}>
                  {this.props.item.um_inputtime}
                </Text>
              </View>
            {/* <View style={{backgroundColor:'#f2f2f2', width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(3)}}/> */}
          </TouchableOpacity>
        </View>
      );
    }
  }