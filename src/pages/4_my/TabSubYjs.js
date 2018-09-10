import React, { Component } from 'react';
import {
  Text,
  View,
  Platform,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import ProductCardYjs from './ProductCardYjs';
import ViewUtils from '../../utils/ViewUtils';
import {ExceptionMsg} from '../../dao/ExceptionMsg';

let isAndroid = Platform.OS==='android'?true:false;
export default class TabSubYjs extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.state = {
      selected: new Map(),
      httpRes:{},
      list:[],
      refreshing: false,
      isSelect: -1,
      next_page:"",
    }
  }

  componentDidMount() {
    this.setState({
      next_page:'1'
    },()=>{
      this.getInfoData()
    })
    
  }

  async getInfoData() {
    // global.NetReqModel.tel_phone = await "18312345678";
    global.NetReqModel.Type = await "3";
    global.NetReqModel.page_number = this.state.next_page;
    // global.NetReqModel.jyd_pubData.user_id = await "39";
    // global.NetReqModel.jyd_pubData.token_id = await "89a5ad1adba2f96b";
    let url = await '/lendCenter/StandardpowderRecords';
    console.log(JSON.stringify(global.NetReqModel))
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
    .then((result) => {
      console.log(result);
      var totalList = [];
      if(result.return_code == '0000'){
        totalList = (this.state.next_page === "1") ? [] : this.state.list;
        totalList = totalList.concat(result.StandardpowderRecords);
        this.setState(
          {
            httpRes : result,
            list : totalList,
            next_page : result.next_page,
            refreshing : false
          }
          , () => {
        })
      }
      else if(result.return_code == '8888'){
        this.refs.toast.show(ExceptionMsg.REQUEST_TIMEOUT);
      }
      else{
        this.setState({
          httpRes : result,
          list : totalList,
          next_page : '',
          refreshing : false
        })
      }
    })
    .catch((e) => {
      console.log(e);
      // TODO Toast提示异常
      this.refs.toast.show(ExceptionMsg.COMMON_ERR_MSG);
    })
  }

  _onRefresh() {
    this.setState({
        next_page : '1',
        refreshing : true
    },()=>{
        this.getInfoData();
    });
  }

  _onLoad(){
    this.getInfoData();
  }

  _renderFooter = ()=>{
    if (this.state.next_page === "") {
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

_onEndReached = ()=>{
  //如果是正在加载中或没有更多数据了，则返回
  if(this.state.next_page === "" || this.state.next_page === "1"){
      return ;
  }
  //获取数据
  this._onLoad();
}

  keyExtractor = (data, index) => {return String(index);}

  _onPressItem = (index,item,type) => {
    
  }

  renderItem = (data) => {
    return (
      <ProductCardYjs
        id={data.index}
        data={data}
        onPressItem={this._onPressItem}
        {...this.props}
      />
    )
  }

  renderMainView() {
    return(
      <FlatList
          style={{flex:1}}
          ref={(flatList) => (this.flatList = flatList)}
          keyExtractor={this.keyExtractor}
          data={this.state.list}
          renderItem={this.renderItem}
          ListFooterComponent={this._renderFooter}//尾巴
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.05}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
      />
    )
  }

  render() {
    return (
      <View style={{flex:1,marginTop:scaleSize(51)}}>
        {this.renderMainView()}    
        {ViewUtils.renderToast(500)} 
      </View>
    )
  }
}