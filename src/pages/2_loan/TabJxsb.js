import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import ProductCardJxsb from './ProductCardJxsb';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import ViewUtils from '../../utils/ViewUtils';
import {ExceptionMsg} from '../../dao/ExceptionMsg';

let isAndroid = Platform.OS==='android'?true:false;
export default class TabJxsb extends Component {
  constructor(props){
    super(props);
    // this.loadFlag = false;
    this.dataResponsitory = new DataResponsitory();
    this.state = {
      selected: new Map(),
      httpRes:{},
      list:[],
      refreshing: false,
      next_page:"",
      detail_url:'',
      sell_url:''
    }
  }

  componentDidMount() {
    // this._onRefresh();
    this.setState({
      next_page : '1'
    },()=>{
      this.getInfoData()
    })
  }

  async getInfoData() {
    global.NetReqModel.page_number = await this.state.next_page;
    global.NetReqModel.tel_phone = await "18330128418";
    global.NetReqModel.jyd_pubData.user_id = await "39";
    global.NetReqModel.jyd_pubData.token_id = await "89a5ad1adba2f96b";
    let url = await '/productList/queryStandardpowderList';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
    .then((result) => {
      console.log(result);
      var totalList = [];
      if(result.return_code == '0000'){
        totalList = (this.state.next_page === "1") ? [] : this.state.list;
        totalList = totalList.concat(result.StandardpowderList);
        this.setState(
          {
            httpRes : result,
            list : totalList,
            next_page : result.next_page,
            refreshing : false,
            detail_url:result.detail_url,
            sell_url:result.sell_url
          }
          , () => {
            // this.loadFlag = false
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
      this.refs.toast.show(ExceptionMsg.COMMON_ERR_MSG);
    })
  }

  _onRefresh() {
    // this.loadFlag = true;
    this.setState({
        next_page : '1',
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
      <ProductCardJxsb
        id={data.index}
        data={data}
        onPressItem={this._onPressItem}
        selected={!!this.state.selected.get(data.index)}
        {...this.props}
      />
    )
  }

  _onPressItem = (id,item,type) => {
    if(type == 'item'){
      global.NetReqModel.BorrowId = item.BorrowId;
      this.props.navigation.navigate('JxsbListItemDetail',{
        data:{
          url:'/productDetails/queryStandardpowderDetail',
          title:'精选散标',
          jsonObj:global.NetReqModel
        },
        ...this.props
      });
    }
    else{
      // global.NetReqModel.sellInfoId = item.id;
      global.NetReqModel.borrow_id = item.BorrowId;
      global.NetReqModel.rest_money = parseFloat(item.OriginalAmount) - parseFloat(item.CollectedAmount);
      this.props.navigation.navigate('JxsbListItemDetail',{
        data:{
          url:'/balanceQuery/queryBalanceApp',
          title:'立即出借',
          jsonObj:global.NetReqModel
        },
        ...this.props
      });
    }
  };

  _onEndReached = ()=>{
    //如果是正在加载中或没有更多数据了，则返回
    if(this.state.next_page === "" || this.state.next_page === "1" ){
        return ;
    }
    //获取数据
    this._onLoad();
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

  render() {
    return (
      <View style={{flex:1}}>
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
        // onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
      />
      {ViewUtils.renderToast(220)}
      </View>
    )
  }
}