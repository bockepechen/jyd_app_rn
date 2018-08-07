import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import {scaleSize} from '../../utils/FitViewUtils';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import {ImageStores} from '../../../res/styles/ImageStores';

let isAndroid = Platform.OS==='android'?true:false;
export default class AccountSecurityPage extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.listItem = [
        {
            title:'用户信息',
            callback:()=>{console.log('组织信息')}
        },
        {
            title:'我的银行卡',
            callback:()=>{console.log('组织信息')}
        },
        {
            title:'手机号码',
            callback:()=>{console.log('组织信息')}
        },
        {
            title:'联系地址',
            callback:()=>{console.log('组织信息')}
        },
        {
            title:'修改登录密码',
            callback:()=>{console.log('组织信息')}
        },
        {
            title:'修改交易密码',
            callback:()=>{console.log('组织信息')}
        },
    ]
    this.state = {
      httpRes:{},
      list:[],
      tel:'138****1234',
      cardInfo:'工商银行(2341)'
    }
  }

  componentDidMount() {
   
  }
  
  navGoback = () => {
    this.props.navigation.goBack();
  }


  _onPressItem = (id,item) => {
    // updater functions are preferred for transactional updates
    this.props.navigation.navigate('MsgListItemDetail',{
      data:{
        url:this.state.itemUrl,
        // url:"http://y5wtkk.natappfree.cc/product1412/html/messageDetail.html",
        title:'消息中心',
        id:item.an_id,
        jsonObj:global.NetReqModel
      },
      ...this.props
    })
    this.setState((state) => {
      // copy the map rather than modifying state.
      this.readedList.push(id);
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
    });
  };

  _renderItemDetail(index){
      if(index == 1){
        return <Text style={{marginTop:scaleSize(48),color:'#989898',marginRight:scaleSize(24)}}>{this.state.cardInfo}</Text>
      }
      else if(index == 2){
        return <Text style={{marginTop:scaleSize(48),color:'#989898',marginRight:scaleSize(24)}}>{this.state.tel}</Text>
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