import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
  Image,
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import {scaleSize} from '../../utils/FitViewUtils';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import {ImageStores} from '../../../res/styles/ImageStores';

let isAndroid = Platform.OS==='android'?true:false;
export default class SettingPage extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.listItem = [
        {
            title:'当前版本',
            callback:()=>{console.log('组织信息')}
        },
        {
            title:'意见反馈',
            callback:()=>{console.log('组织信息')}
        },
        {
            title:'清理缓存',
            callback:()=>{console.log('组织信息')}
        },
    ]
    this.state = {
      httpRes:{},
      list:[],
      cacheSize:0,
      version:'0.0.0'
    }
  }

  componentDidMount() {
   
  }
  
  navGoback = () => {
    this.props.navigation.goBack();
  }

  _renderItemDetail(index){
      if(index == 0){
        return <Text style={{marginTop:scaleSize(48),color:'#989898',marginRight:scaleSize(24)}}>{this.state.version}</Text>
      }
      else if(index == 2){
        return <Text style={{marginTop:scaleSize(48),color:'#989898',marginRight:scaleSize(24)}}>{this.state.cacheSize} M</Text>
      }else{
          return null
      }
  }

  _renderItem(){
    var itemArray = []
    this.listItem.map((item, index) => {
        itemArray.push(
            <View key={index} style={{flex:1,backgroundColor:'#fff',height:scaleSize(135)}}>
                <TouchableOpacity 
                    style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}
                    onPress={item.callback}
                >
                    <View style={{flexDirection:'row',marginLeft:scaleSize(120)}}>
                        <Text style={{marginTop:scaleSize(48),color:'#989898'}}>{item.title}</Text>
                    </View>
                    <View style={{marginRight:scaleSize(63),flexDirection:'row'}}>
                        {this._renderItemDetail(index)}
                        <Image 
                            source={ImageStores.me_6} 
                            resizeMode={'stretch'} 
                            style={{
                                // flex:1,
                                width:scaleSize(27),
                                height:scaleSize(45),
                                // marginRight:scaleSize(63),
                                marginTop:scaleSize(51)
                            }} 
                        />
                    </View>
                </TouchableOpacity>
                <View style={{backgroundColor:'#f2f2f2', width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(3)}}/>
            </View>
        )
    })
    return itemArray
  }

  renderMainView() {
    return(
      <View style={{flex:1}}>
      <ScrollView
        style={{marginTop:scaleSize(120)}}
        scrollEnabled = {false}
      >
        {this._renderItem()}
      </ScrollView>
      <TouchableHighlight 
          style={{flex:1,flexDirection:'row',justifyContent:'center'}}
          underlayColor='rgba(0,0,0,0)'
          onPress={()=>{this.props.navigation.navigate('LoginPage')}}>
          <ImageBackground 
            source={ImageStores.sy_17} 
            resizeMode={'stretch'} 
            style={{width:scaleSize(558), height:scaleSize(168), alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontSize:scaleSize(50), fontWeight:'200', color:'#FFFFFF'}}>{'退出账号'}</Text>
          </ImageBackground>
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    return (
        <View style={GlobalStyles.rootContainer}>
            <NavigationBar 
                title='设置'
                titleColor='#FFFFFF'
                titleSize={scaleSize(56)}
                navColor='#E8152E'
                statusBarColor='#E8152E'
                statusBarStyle='light-content'
                leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
            />
            {this.renderMainView()}
        </View>
    )
  }
}