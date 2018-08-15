import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  RefreshControl,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import ViewUtils from '../../utils/ViewUtils';
import RedPacketItem from './RedPacketItem';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import NavigationBar from '../../common/NavigationBar';

let isAndroid = Platform.OS==='android'?true:false;
export default class RedPacketPage extends Component {
  constructor(props){
    super(props);
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.dataResponsitory = new DataResponsitory();
    this.state = {
      selected: new Map(),
      httpRes:{},
      list:[],
      refreshing: false,
      page_number:"",
      itemUrl:'',
    }
  }

  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
    this.setState({
      page_number : '1'
    },()=>{
      this.getInfoData()
    })
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

  async getInfoData() {
    global.NetReqModel.PageNum = await this.state.page_number;
    global.NetReqModel.tel_phone = await "15822753827";
    global.NetReqModel.jyd_pubData.user_id = await "91";
    console.log(JSON.stringify(global.NetReqModel))
    let url = await '/redEnvelope';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
    .then((result) => {
      console.log(result);
      var totalList = [];
      if(result.return_code == '0000'){
        totalList = (this.state.page_number === "1") ? [] : this.state.list;
        totalList = totalList.concat(result.StandardpowderList);
        this.setState(
          {
            httpRes : result,
            list : totalList,
            page_number : result.page_number,
            refreshing : false
          }
          , () => {
            // this.loadFlag = false
        })
      }else{
        this.setState({
          httpRes : result,
          list : totalList,
          page_number : '',
          refreshing : false
        })
      }
    })
    .catch((e) => {
      console.log(e);
    })
  }

  _onRefresh() {
    // this.loadFlag = true;
    this.setState({
        page_number : '1',
        refreshing:true
    },()=>{
        this.getInfoData();
    });
  }

  _onLoad(){
    this.getInfoData();
  }

  keyExtractor = (data, index) => {return String(index);}
  
  renderFlatListItem = (data) => {
    return (
      <RedPacketItem
        id={data.index}
        data={data}
        onPressItem={this._onPressItem}
        selected={!!this.state.selected.get(data.index)}
        {...this.props}
      />
    )
  }

  _onPressItem = (id,item,type) => {
    
  };

  _onEndReached = ()=>{
    //如果是正在加载中或没有更多数据了，则返回
    if(this.state.page_number === "" || this.state.page_number === "1" ){
        return ;
    }
    //获取数据
    this._onLoad();
}

  _renderFooter = ()=>{
    if (this.state.page_number === "") {
        return (
            <View style={{flex:1,height:isAndroid ? scaleSize(300) : scaleSize(200),alignItems:'center',justifyContent:'flex-start',}}>
                {/* <View style={{backgroundColor:'#f2f2f2', width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(3)}}/> */}
                <Text style={{color:'#999999',fontSize:scaleSize(50),marginTop:scaleSize(50)}}>
                    没有更多数据了
                </Text>
            </View>
        );
    } else {
        return (
          <View style={{flex:1,height:isAndroid ? scaleSize(300) : scaleSize(200),alignItems:'center',justifyContent:'flex-start',}}>
                <ActivityIndicator style={{marginTop:scaleSize(50)}} />
                <Text style={{color:'#999999',fontSize:scaleSize(50),marginTop:scaleSize(50)}}>
                正在加载更多数据...
                </Text>
          </View>
        );
    }
}

renderMainView(){
  return (
      <FlatList
        style={{paddingTop:scaleSize(63)}}
        data={this.state.list}
        extraData={this.state.selected}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderFlatListItem}
        // initialNumToRender={5}
        refreshControl={
          <RefreshControl 
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        ListFooterComponent={this._renderFooter}//尾巴
        onEndReached={this._onEndReached}
        onEndReachedThreshold={0.01}
      />
  )
}

  render() {
    return (
      <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
          <View style={GlobalStyles.rootContainer}>
              <NavigationBar 
                  title={'我的红包'}
                  titleColor='#FFFFFF'
                  titleSize={scaleSize(56)}
                  navColor='#E8152E'
                  statusBarColor='#E8152E'
                  statusBarStyle='light-content'
                  leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
              />
              {this.renderMainView()}
          </View>
      </TouchableWithoutFeedback>
    )
  }
}