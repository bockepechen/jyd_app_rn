import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  RefreshControl,
  Platform,
  ActivityIndicator,
  TouchableHighlight,
  ImageBackground,
  DeviceEventEmitter,
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import ProductCardJxsb from './ProductCardJxsb';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import ViewUtils from '../../utils/ViewUtils';
import {ExceptionMsg} from '../../dao/ExceptionMsg';
import { StackActions,NavigationActions } from 'react-navigation';

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

  goto(url,JsonObj){
    this.props.navigation.navigate(url,{
      data:JsonObj ? JsonObj : {}
    });
  }

  async getInfoData() {
    global.NetReqModel.page_number = await this.state.next_page;
    // global.NetReqModel.tel_phone = await "18330128418";
    // global.NetReqModel.jyd_pubData.user_id = await "39";
    // global.NetReqModel.jyd_pubData.token_id = await "89a5ad1adba2f96b";
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
        this.setState({
          httpRes : result,
          list : totalList,
          next_page : '',
          refreshing : false
        })
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

  async riskValidate(product_id,item) {
    let url = await '/riskValidate';
    global.NetReqModel.product_id = product_id;
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
    .then((result) => {
      console.log(result);
      this.setState({isLoading:false},()=>{
        if(result.return_code == '0000'){
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
        else if(result.return_code == '9983'){
          this.refs.toast.show(result.return_msg);
        }
        else if(result.return_code == '9965'){
          this.showModalView(true,this.renderModal())
          this.refs.toast.show(result.return_msg);
        }
        else if(result.return_code == '9964'){
          this.showModalView(true,this.renderModal())
          this.refs.toast.show(result.return_msg);
        }
        else if(result.return_code == '9987'){
          this.refs.toast.show(result.return_msg);
          this.goto('LoginPage')
        }
        else if(result.return_code == '8888'){
          this.refs.toast.show(ExceptionMsg.REQUEST_TIMEOUT);
          return res;
        }
      })
    })
    .catch((e) => {
      console.log(e);
      this.refs.toast.show(ExceptionMsg.COMMON_ERR_MSG);
      if(this.state.isLoading){
        this.setState({isLoading:false})
      }
      return res;
    })
  }

  showModalView(visible,renderView) {
    DeviceEventEmitter.emit('callModal',visible,renderView);
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

  renderModal(){
    return (
      <View
          style={{flex:1,}}
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.3)'}}>
            <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',height:scaleSize(531),width:scaleSize(915),borderRadius:scaleSize(30),backgroundColor:'#fff'}} >
              <View style={{alignItems:'center',marginTop:scaleSize(69)}}>
                <Text style={{fontSize:scaleSize(42),color:'#998675',fontWeight:'bold'}}>{'进入风险评测'}</Text>
              </View>
              <View style={{flexDirection:'row',justifyContent:'center',marginTop:scaleSize(54)}}>
                <TouchableHighlight 
                  style={{flexDirection:'row',justifyContent:'center'}}
                  underlayColor='rgba(0,0,0,0)'
                  onPress={()=>{this.showModalView(false)}}>
                  <ImageBackground 
                    source={ImageStores.cp_2} 
                    resizeMode={'stretch'} 
                    style={{width:scaleSize(336), height:scaleSize(138), alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontSize:scaleSize(50), fontWeight:'200', color:'#FFFFFF'}}>{'稍后再说'}</Text>
                  </ImageBackground>
                </TouchableHighlight>
                <TouchableHighlight 
                  style={{flexDirection:'row',justifyContent:'center'}}
                  underlayColor='rgba(0,0,0,0)'
                  onPress={()=>{
                    this.props.navigation.navigate('JeyxListItemDetail',{
                      data:{
                        url:'/risk/preRisk',
                        title:'风险评测',
                        jsonObj:global.NetReqModel
                      },
                      ...this.props
                    });
                  }}>
                  <ImageBackground 
                    source={ImageStores.sy_15} 
                    resizeMode={'stretch'} 
                    style={{width:scaleSize(336), height:scaleSize(138), alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontSize:scaleSize(50), fontWeight:'200', color:'#FFFFFF'}}>{'立即评测'}</Text>
                  </ImageBackground>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View  >
    )
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
      global.NetReqModel.productId = item.productId;
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
      this.riskValidate('',item)
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