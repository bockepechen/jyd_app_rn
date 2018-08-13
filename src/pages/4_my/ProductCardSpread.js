import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  LayoutAnimation
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';

const isIOS = Platform.OS==='ios'?true:false;
export default class ProductCardSpread extends Component {
  constructor(props) {
    super(props);
    this.paraData = this.props.data.item;
    this.state={
        isSelect:-1
    }
  }

  _onPress = () => {
    let index = this.props.id
    let select = index;
    if (this.state.isSelect === index){
        select = -1;
    }
    LayoutAnimation.easeInEaseOut();
    this.setState({
        isSelect: select
    })
    this.props.onPressItem(this.props.id,this.paraData,'item');
  };
  
  render() {
    return (
        <View>
            {/*每组的点击header*/}
            <TouchableOpacity
                style={{height:50,width:GlobalStyles.WINDOW_WIDTH,justifyContent:'center',alignItems:'center'}}
                activeOpacity={0.6}
                onPress={this._onPress}
            >
                <Text style={{textAlign:'center',fontSize:20}}>
                    {this.paraData.title}
                </Text>
            </TouchableOpacity>
            {/*每组的折叠item, 相等显示, 不等隐藏*/}
            {this.state.isSelect === this.props.id ?
                <View style={{width:GlobalStyles.WINDOW_WIDTH}} >
                    {
                        <TouchableOpacity
                            style={{marginTop:2,height:40,width:GlobalStyles.WINDOW_WIDTH,backgroundColor:'cyan'}}
                        >
                            <Text>
                                {'subItem'}
                            </Text>
                        </TouchableOpacity>
                    }
                </View> : null}
        </View>
    )
  }
}