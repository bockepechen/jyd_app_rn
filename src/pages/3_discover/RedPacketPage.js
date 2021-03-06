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
  TouchableOpacity
} from 'react-native';
import {scaleSize} from '../../utils/FitViewUtils';
import {ImageStores} from '../../../res/styles/ImageStores';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import ViewUtils from '../../utils/ViewUtils';
import {ExceptionMsg} from '../../dao/ExceptionMsg';
import RedPacketItem from './RedPacketItem';
import DataResponsitory from '../../dao/DataResponsitory';
import AndroidBackHandler from '../../utils/AndroidBackHandler';
import NavigationBar from '../../common/NavigationBar';
import LoadingIcon from '../../common/LoadingIcon';
import ModalView from '../../common/ModalView';
import CommonBlocker from '../../utils/CommonBlocker';

let isAndroid = Platform.OS==='android'?true:false;
export default class RedPacketPage extends Component {
  constructor(props){
    super(props);
    this.AndroidBackHandler = new AndroidBackHandler(this);
    this.commonBlocker = new CommonBlocker(this);
    this.dataResponsitory = new DataResponsitory();
    this.state = {
      selected: new Map(),
      httpRes:{},
      list:[],
      refreshing: false,
      next_page:"",
      itemUrl:'',
      isLoading: false
    }
  }

  componentDidMount() {
    this.AndroidBackHandler.addPressBackListener();
    this.setState({
      next_page : '1'
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
    global.NetReqModel.page_number = await this.state.next_page;
    let url = await '/redEnvelope';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
    .then((result) => {
      console.log(result)
      var totalList = [];
      if(result.return_code == '0000'){
        totalList = (this.state.next_page === "1") ? [] : this.state.list;
        totalList = totalList.concat(result.record_list);
        this.setState(
          {
            httpRes : result,
            list : totalList,
            next_page : result.next_page,
            refreshing : false
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

  async openRedPacket(index,itemId) {
    this.setState({
      isLoading: true,
    })
    global.NetReqModel.red_id = itemId;
    let url = await '/redEnvelope/openRedEnvelope';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
    .then((result) => {
      console.log(result);
      this.setState({isLoading:false})
      if(result.return_code == '0000'){
        this.myModal(true,this.renderModal())
        let templist = this.state.list;
        templist[index].status = '2'
        templist[index].use_time = result.use_time
        this.setState(
          {
            httpRes : result,
            list : templist,
          })
      }
      else if(result.return_code == '8888'){
        this.refs.toast.show(ExceptionMsg.REQUEST_TIMEOUT);
      }
      else{
        this.refs.toast.show('领取失败');
      }
    })
    .catch((e) => {
      console.log(e);
      this.refs.toast.show(ExceptionMsg.COMMON_ERR_MSG);
      if(this.state.isLoading){
        this.setState({isLoading:false})
      }
    })
  }

  rule(){
    if(this.state.refreshing){
      return false
    }else{
      this.goto('RedPackRulePage',{
          url:this.state.httpRes.redRule_url,
          jsonObj:global.NetReqModel,
          title:'红包规则'
      })
    }
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

  //一键读取
  getRightButton(callBack) {
      return <TouchableOpacity
              style={{marginRight:scaleSize(54),}}
              onPress={callBack}>
              <View style={{flexDirection:'row'}}>
                <Text
                    style={{color:'#fff',fontSize:scaleSize(49)}} 
                >
                  {'红包规则'}
                </Text>
              </View>
          </TouchableOpacity>
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

  _onPressItem = async (id,item,type) => {
    if (this.commonBlocker.checkLogin() && await this.commonBlocker.checkExpireLogin()) {
      this.openRedPacket(id,item.id)
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

myModal(isShow, modalContentView){
  if (isShow) {
    this.refs.modalView.show(modalContentView);
  } else {
    this.refs.modalView.close();
  }
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
              <Text style={{fontSize:scaleSize(42),color:'#998675',fontWeight:'bold'}}>{'打开红包成功'}</Text>
              <Text style={{fontSize:scaleSize(36),color:'#989898',marginTop:scaleSize(51)}}>{'红包金额将在T+1个工作日内'}</Text>
              <Text style={{fontSize:scaleSize(36),color:'#989898',marginTop:scaleSize(21)}}>{'划拨至您的银行存管电子账户。'}</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',marginTop:scaleSize(57)}}>
              <TouchableHighlight 
                style={{flexDirection:'row',justifyContent:'center'}}
                underlayColor='rgba(0,0,0,0)'
                onPress={()=>{this.myModal(false)}}>
                <ImageBackground 
                  source={ImageStores.me_36} 
                  resizeMode={'stretch'} 
                  style={{width:scaleSize(336), height:scaleSize(135), alignItems:'center', justifyContent:'center'}}>
                  <Text style={{fontSize:scaleSize(36), fontWeight:'bold', color:'#FFFFFF'}}>{'确认'}</Text>
                </ImageBackground>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </View>
  )
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
      <View style={GlobalStyles.rootContainer}>
          <NavigationBar 
              title={'我的红包'}
              titleColor='#FFFFFF'
              titleSize={scaleSize(56)}
              navColor='#E8152E'
              statusBarColor='#E8152E'
              statusBarStyle='light-content'
              leftButton={ViewUtils.renderBackBtn('#FFFFFF', this.navGoback)}
              rightButton={this.getRightButton(()=>this.rule())}
          />
          {this.renderMainView()}
          <ModalView ref='modalView'/>
          {this.state.isLoading?(<LoadingIcon isModal={true}/>):null}
          {ViewUtils.renderToast()}
      </View>
    )
  }
}