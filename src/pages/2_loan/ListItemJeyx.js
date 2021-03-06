import React, { PureComponent } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import ProductCardSub from './ProductCardSub';
import ProductCardMain from './ProductCardMain';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import Utils from '../../utils/Utils';

export default class ListItemJeyx extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            passData:{},
        }
    }

    componentWillReceiveProps(nextProps) {
      this.props = nextProps;
    }
    
    _onPress = (id,item,type) => {
      this.props.onPressItem(this.props.id,this.props.item,type);
    };
    
    _MainRender(){
        return <View>
            <View style={{flex:1,height:scaleSize(135),flexDirection:'row',justifyContent:'center'}} >
                <Text style={{fontSize:scaleSize(48),color:'#998675',marginTop:scaleSize(48)}}>每日{`${this.props.item.starttime.substring(this.props.item.starttime.indexOf(" "),this.props.item.starttime.length-3)}`}准时开抢</Text>
            </View>
            <ProductCardMain 
              data={this.props.item} 
              onPress={this._onPress}
              {...this.props}
            />
        </View>
    }

    render() {
    //   const textColor = this.props.selected || (this.props.item.ua_readstatus == '01') ? "#959595" : "#656565";
      return (
        <View style={{flex:1}}>
           {this.props.item.isFirst ? this._MainRender() : <ProductCardSub data={this.props.item} onPress={this._onPress} {...this.props}/>}
           {this.props.item.isFirst ? <View style={{height:scaleSize(6)}}/> : <View style={{height:scaleSize(18)}}/>}
        </View>
      );
    }
  }