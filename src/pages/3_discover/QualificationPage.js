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
import AndroidBackHandler from '../../utils/AndroidBackHandler';

let isAndroid = Platform.OS==='android'?true:false;
export default class QualificationPage extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.navData = this.props.navigation.state.params.data;
    this.listItem = [
        {
            img: ImageStores.fx_45,
            title:'组织信息',
            callback:()=>{this.goto('QualificationItemPage',{
                url:this.navData.organization_url,
                title:'组织信息',
                jsonObj:global.NetReqModel,
            })}
        },
        {
            img: ImageStores.fx_46,
            title:'证照信息',
            callback:()=>{this.goto('QualificationItemPage',{
                url:this.navData.permit_url,
                title:'证照信息',
                jsonObj:global.NetReqModel,
            })}
        },
        {
            img: ImageStores.fx_47,
            title:'管理团队',
            callback:()=>{this.goto('QualificationItemPage',{
                url:this.navData.team_url,
                title:'管理团队',
                jsonObj:global.NetReqModel,
            })}
        },
        {
            img: ImageStores.fx_48,
            title:'企业大事记',
            callback:()=>{this.goto('QualificationItemPage',{
                url:this.navData.companyAffair_url,
                title:'企业大事记',
                jsonObj:global.NetReqModel,
            })}
        },
        {
            img: ImageStores.fx_49,
            title:'分支机构',
            callback:()=>{this.goto('QualificationItemPage',{
                url:this.navData.branch_url,
                title:'分支机构',
                jsonObj:global.NetReqModel,
            })}
        },
        {
            img: ImageStores.fx_50,
            title:'备案登记',
            callback:()=>{this.goto('QualificationItemPage',{
                url:this.navData.papers_url,
                title:'备案登记',
                jsonObj:global.NetReqModel,
            })}
        },
        {
            img: ImageStores.fx_51,
            title:'审核信息',
            callback:()=>{this.goto('QualificationItemPage',{
                url:this.navData.audit_url,
                title:'审核信息',
                jsonObj:global.NetReqModel,
            })}
        },
        {
            img: ImageStores.fx_52,
            title:'其他信息',
            callback:()=>{this.goto('QualificationItemPage',{
                url:this.navData.otherInfo_url,
                title:'其他信息',
                jsonObj:global.NetReqModel,
            })}
        },     
    ]
    this.state = {
      httpRes:{},
      list:[],
    }
  }

  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
  }

  componentWillUnmount() {
    this.AndroidBackHandler.removePressBackListener();
  }
  
  navGoback = () => {
    this.props.navigation.goBack();
  }

  goto(url,JsonObj){
    this.props.navigation.navigate(url,{
      data:JsonObj ? JsonObj : {}
    });
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
                    <View style={{flexDirection:'row',marginLeft:scaleSize(63)}}>
                        <Image 
                            source={item.img} 
                            resizeMode={'stretch'} 
                            style={{
                                width:scaleSize(66),
                                height:scaleSize(66),
                                marginTop:scaleSize(33)
                            }} 
                        />
                        <Text style={{marginLeft:scaleSize(36),color:'#989898',marginTop:scaleSize(48)}}>{item.title}</Text>
                    </View>
                    <Image 
                        source={ImageStores.me_6} 
                        resizeMode={'stretch'} 
                        style={{
                            width:scaleSize(27),
                            height:scaleSize(45),
                            marginRight:scaleSize(63),
                            marginTop:scaleSize(51)
                        }} 
                    />
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
        // style={{}}
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
                title='消息中心'
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