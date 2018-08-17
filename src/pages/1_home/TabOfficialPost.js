import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import MsgListOfficialPost from './MsgListOfficialPost';
import {scaleSize} from '../../utils/FitViewUtils';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import Utils from '../../utils/Utils';

let isAndroid = Platform.OS==='android'?true:false;
export default class TabOfficialPost extends Component {
  constructor(props) {
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.readedList = []
    this.state = {
      selected: new Map(),
      httpRes:{},
      list:[],
      refreshing: false,
      next_page:"",
      itemUrl:''
    }
  }

  componentDidMount() {
    this.setState({next_page:'1'},()=>{
      this.getInfoData();
    })
    // this._onRefresh();
  }

  async getInfoData() {
    global.NetReqModel.page_number = await this.state.next_page;
    let url = await '/userMail/announcement';
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
            itemUrl:'/userMail/readAnnouncement',
            refreshing : false
          }
          , () => {
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

  async readAll() {
    console.log('22222222');
    // global.NetReqModel.tel_phone = await "15822753827";
    global.NetReqModel.tel_phone = await "13502151376";
    global.NetReqModel.jyd_pubData.user_id = await "4";
    global.NetReqModel.jyd_pubData.source_type = await "0001";
    global.NetReqModel.jyd_pubData.system_id = await "Android 7";
    global.NetReqModel.jyd_pubData.network_type = await "wifi";
    // global.NetReqModel.jyd_pubData.token_id = await Utils.randomToken();
    let url = await '/userMail/readAnnouncements';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
    .then((result) => {
      console.log(result);
      if(result.return_code == '0000'){
        var templist = [];
        this.setState((state) => {
          // copy the map rather than modifying state.
          const selected = new Map(state.selected);
          templist = this.state.list;
          for(var i =0 ; i< templist.length ; i++){
            templist[i].ua_readstatus = "01"
            selected.set(templist[i].an_id, !selected.get(templist[i].an_id)); // toggle
          }
          return {selected};
        });
        this.setState({
          list : templist
        })
      }
    })
    .catch((e) => {
      console.log(e);
    })
  }

  async readMsg(){
    console.log('aaaaaaaaa')
    console.log(this.readedList)
    if(this.readedList.length < 1) return false
    global.NetReqModel.an_id_list = await this.readedList;
    let url = await '/userMail/readAnnouncementsByAppCache';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
    .then((result) => {
      console.log(result);
    })
    .catch((e) => {
      console.log(e);
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
    console.log('adfafafdafd');
    this.getInfoData();
  }

  _keyExtractor = (item, index) => item.an_id;

  _onPressItem = (id,item) => {
    // updater functions are preferred for transactional updates
    global.NetReqModel.an_id = item.an_id
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

  _renderItem = ({item}) => (
    <MsgListOfficialPost
      id={item.an_id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.an_id)}
      item={item}
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
      if(this.state.next_page === "" || this.state.next_page === "1"){
          return ;
      }
      //获取数据
      this._onLoad();
  }

  _separator(){
      return <View style={{backgroundColor:'#f2f2f2', width:GlobalStyles.WINDOW_WIDTH, height:scaleSize(3)}}/>;
  }
  
  renderMainView() {
    return(
      <View style={{flex:1}}>
      <FlatList
        style={{backgroundColor:'#fff'}}
        initialNumToRender = {10}
        data={this.state.list}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListFooterComponent={this._renderFooter}//尾巴
        onEndReached={this._onEndReached}
        onEndReachedThreshold={0.1}
        ItemSeparatorComponent={this._separator}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
      />
      </View>
    )
  }

  render() {
    return (
      this.renderMainView()
    )
  }
}