import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableHighlight
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils'
import {ImageStores} from '../../../res/styles/ImageStores';

export default class HorizantalFlatlistCell extends PureComponent {
  constructor(props) {
    super(props);
  }

  _onPress = () => {
    this.props.onPressItem(this.props.id,this.props.data.item);
  };

  render() {
    return (
      <View>
        <TouchableHighlight
          underlayColor='rgba(0,0,0,0)'
          style={{marginLeft:scaleSize(12)}}
          onPress={this._onPress}>
          <ImageBackground 
            source={ImageStores.sy_18} 
            resizeMode={'stretch'} 
            style={{width:scaleSize(480), height:scaleSize(252), alignItems:'center', justifyContent:'flex-start', flexDirection:'row'}}>
            <Image 
              source={this.props.data.item.img}
              resizeMode={'stretch'} 
              style={{marginLeft:scaleSize(42), width:scaleSize(144), height:scaleSize(144)}}/>
            <Text style={{marginLeft:scaleSize(15), fontSize:scaleSize(54), fontWeight:'bold', color:'#998675'}}>{this.props.data.item.title}</Text>
          </ImageBackground>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cellContainer: {
  },
})