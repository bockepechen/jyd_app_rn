import React, { Component } from 'react';
import {
  Text,
  View,
  Platform,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  DeviceEventEmitter,
  TouchableHighlight,
  ImageBackground,
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import ListItemJeyx from './ListItemJeyx';
import ViewUtils from '../../utils/ViewUtils';
import {ExceptionMsg} from '../../dao/ExceptionMsg';
import { StackActions,NavigationActions } from 'react-navigation';

let isAndroid = Platform.OS==='android'?true:false;
export default class TabJeyx extends Component {
  constructor(props) {
    super(props);
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
    DeviceEventEmitter.addListener('reFreshEmitter',(dic)=>{
        this.setState({
          next_page : '1'
        },()=>{
          this.getInfoData()
        })
    });
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
    let url = await '/productList/queryInvestList';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
    .then((result) => {
      console.log(result);
      var totalList = [];
      if(result.return_code == '0000'){
        totalList = (this.state.next_page === "1") ? [] : this.state.list;
        totalList = totalList.concat(result.InvestList);
        if(this.state.next_page === "1" && totalList.length > 0)
        {
          totalList[0]["isFirst"] = true
        }
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
          global.NetReqModel.sell_id = item.id;
          this.props.navigation.navigate('JeyxListItemDetail',{
            data:{
              url:'/personProLend',
              title:'嘉e精选',
              jsonObj:global.NetReqModel
            },
            ...this.props
          });
        }
        else if(result.return_code == '9983'){
          this.refs.toast.show(result.return_msg);
        }
        else if(result.return_code == '9987'){
          this.refs.toast.show(result.return_msg);
          this.goto('LoginPage')
        }
        else if(result.return_code == '9986'){
          this.goto('AccountOpeningPage')
        }
        else if(result.return_code == '9984'){
          this.goto('AccountAgreementPage')
        }
        else if(result.return_code == '9970'){
          // global.NetReqModel.user_ip = global.NetReqModel.jyd_pubData.ip
          this.goto('BindCardNewPage',{
            url:'/bindCard',
              jsonObj:global.NetReqModel,
              title:'绑定银行卡'
          })
        }
        else if(result.return_code == '9985'){
          this.goto('AccountSetPwdPage',{
            url:'/transPwd/setPassword',
            jsonObj:global.NetReqModel,
            title:'设置交易密码'
          })
        }
        else if(result.return_code == '9965'){
          this.showModalView(true,this.renderModal())
          this.refs.toast.show(result.return_msg);
        }
        else if(result.return_code == '9964'){
          this.showModalView(true,this.renderModal())
          this.refs.toast.show(result.return_msg);
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

  _onPressItem = (id,item,type) => {
    if(type == 'item')
    {
      global.NetReqModel.sellInfoId = item.id;
      global.NetReqModel.productId = item.productId;
      this.props.navigation.navigate('JeyxListItemDetail',{
        data:{
          url:'/productDetails/querySellinDetail',
          title:'嘉e精选',
          jsonObj:global.NetReqModel
        },
        ...this.props
      });
    }else{
      console.log(item)
      let res = this.riskValidate(item.productId,item)
    }
  };

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

  _keyExtractor = (item, index) => item.id;

  _renderItem = ({item}) => (
    <ListItemJeyx
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      item={item}
      {...this.props}
    />
  );
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
      if(this.state.next_page === "" || this.state.next_page === "1" ){
          return ;
      }else{
        //获取数据
        if(!this.onEndReachedCalledDuringMomentum){
          this._onLoad();
          this.onEndReachedCalledDuringMomentum = true;
        }
      }
  }

  renderMainView() {
    return(
      <View style={{flex:1}}>
      <FlatList
        initialNumToRender = {10}
        data={this.state.list}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListFooterComponent={this._renderFooter}//尾巴
        onEndReached={this._onEndReached}
        onEndReachedThreshold={0.1}
        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
      />
      {ViewUtils.renderToast(230)}
      </View>
    )
  }

  render() {
    return (
      this.renderMainView()
    )
  }
}