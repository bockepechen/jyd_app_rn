import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  RefreshControl,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Modal,
  TouchableHighlight,
  ImageBackground
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
      next_page:"",
      itemUrl:'',
      modalVisible: false,
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

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  async getInfoData() {
    global.NetReqModel.page_number = await this.state.next_page;
    global.NetReqModel.tel_phone = await "15903262695";
    global.NetReqModel.jyd_pubData.user_id = await "39";
    global.NetReqModel.jyd_pubData.token_id = await '89a5ad1adba2f96b';
    // global.NetReqModel.tel_phone = await "15822753827";
    // global.NetReqModel.jyd_pubData.user_id = await "91";
    console.log(JSON.stringify(global.NetReqModel))
    let url = await '/redEnvelope';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
    .then((result) => {
      console.log(result);
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
          }
          , () => {
            // this.loadFlag = false
        })
      }else{
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
    })
  }

  async openRedPacket(index,itemId) {
    global.NetReqModel.red_id = itemId;
    console.log(JSON.stringify(global.NetReqModel));
    let url = await '/redEnvelope/openRedEnvelope';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
    .then((result) => {
      console.log(result);
      if(result.return_code == '0000'){
        this.setModalVisible(true)
        let templist = this.state.list;
        templist[index].status = '2'
        this.setState(
          {
            httpRes : result,
            list : templist,
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
    // let templist = this.state.list;
    // templist[id].status = '2'
    // this.setState({
    //   list:templist
    // })
    this.openRedPacket(id,item.id)
  };

  _onEndReached = ()=>{
    //如果是正在加载中或没有更多数据了，则返回
    if(this.state.next_page === "" || this.state.next_page === "1" ){
        return ;
    }
    //获取数据
    this._onLoad();
}

renderModal(){
  return (
    <Modal
        style={{flex:1,}}
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          alert('Modal has been closed.');
        }}>
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.3)'}}>
          <View style={{flexDirection:'column',justifyContent:'center',height:scaleSize(891),width:scaleSize(915),borderRadius:scaleSize(30),backgroundColor:'#fff'}} >
            <View style={{flexDirection:'row',justifyContent:'center'}}>
              <Text style={{color:'#989898',fontSize:scaleSize(36)}}>{this.state.modaltext1}</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',marginTop:scaleSize(60)}}>
              <Text style={{color:'#998675',fontSize:scaleSize(42)}}>{this.state.modaltext2}</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',marginTop:scaleSize(54)}}>
              <Text style={{color:'#989898',fontSize:scaleSize(36)}}>{this.state.modaltext3}</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center'}}>
              <Text style={{color:'#989898',fontSize:scaleSize(36)}}>{this.state.modaltext4}</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',marginTop:scaleSize(54)}}>
              <TouchableHighlight 
                style={{flexDirection:'row',justifyContent:'center'}}
                underlayColor='rgba(0,0,0,0)'
                onPress={()=>{this.setModalVisible(false)}}>
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
                onPress={()=>{console.log('立即开通')}}>
                <ImageBackground 
                  source={ImageStores.sy_15} 
                  resizeMode={'stretch'} 
                  style={{width:scaleSize(336), height:scaleSize(138), alignItems:'center', justifyContent:'center'}}>
                  <Text style={{fontSize:scaleSize(50), fontWeight:'200', color:'#FFFFFF'}}>{'立即开通'}</Text>
                </ImageBackground>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
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
              {this.renderModal()}
          </View>
      </TouchableWithoutFeedback>
    )
  }
}