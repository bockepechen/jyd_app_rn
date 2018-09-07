import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import MsgListStationMessage from './MsgListStationMessage';
import {scaleSize} from '../../utils/FitViewUtils';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';
import ViewUtils from '../../utils/ViewUtils';
import {ExceptionMsg} from '../../dao/ExceptionMsg';

let isAndroid = Platform.OS==='android'?true:false;
export default class TabStationMessage extends Component {
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
            itemUrl:""
        }
    }

    componentDidMount() {
        this.setState({
            next_page : '1'
        },()=>{
            this.getInfoData()
        })
        // this._onRefresh();
    }

    async getInfoData() {
        global.NetReqModel.page_number = await this.state.next_page;
        // global.NetReqModel.tel_phone = '15822753827'
        // global.NetReqModel.jyd_pubData.user_id = '91'
        // global.NetReqModel.jyd_pubData.token_id = '123235h5e3111'
        let url = await '/userMail/usermail';
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
                itemUrl:result.url,
                refreshing : false
                }
                , () => {
            })
          }
          else if(result.return_code == '8888'){
            this.refs.toast.show(ExceptionMsg.REQUEST_TIMEOUT);
          }
          else if(result.return_code == '9987'){
            this.refs.toast.show(result.return_msg);
            const resetAction = StackActions.reset({
              index: 1,
              actions: [
                NavigationActions.navigate({ routeName: 'TabPage'}),
                NavigationActions.navigate({ routeName: 'LoginPage'}),
              ],
            });
            this.props.navigation.dispatch(resetAction);
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
    
    async readAll() {
        // global.NetReqModel.jyd_pubData.token_id = await Utils.randomToken();
        let url = await '/userMail/readUserMails';
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
                        templist[i].um_readstatus = "01"
                        selected.set(templist[i].um_id, !selected.get(templist[i].an_id)); // toggle
                    }
                    return {selected};
                });
                this.setState({
                    list : templist
                })
            }
            else if(result.return_code == '8888'){
                this.refs.toast.show(ExceptionMsg.REQUEST_TIMEOUT);
            }
        })
        .catch((e) => {
        console.log(e);
        this.refs.toast.show(ExceptionMsg.COMMON_ERR_MSG);
        })
    }

    async readMsg(){
        console.log(this.readedList)
        if(this.readedList.length < 1) return false
        global.NetReqModel.um_id_list = await this.readedList;
        // global.NetReqModel.jyd_pubData.token_id = await Utils.randomToken();
        let url = await '/userMail/readUserMailsByAppCache';
        this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
        .then((result) => {
          console.log(result);
        })
        .catch((e) => {
          console.log(e);
          this.refs.toast.show(ExceptionMsg.COMMON_ERR_MSG);
        })
    }

    _onRefresh() {
        if(global.NetReqModel.tel_phone === ""){
            return false
        }
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

    _keyExtractor = (item, index) => item.um_id;

    _onPressItem = (id,item) => {
        // updater functions are preferred for transactional updates
        global.NetReqModel.um_id = item.um_id
        this.props.navigation.navigate('MsgListItemDetail',{
          data:{
            url:'/userMail/readUsermail',
            title:'消息中心',
            id:item.um_id,
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
        <MsgListStationMessage
            id={item.um_id}
            onPressItem={this._onPressItem}
            selected={!!this.state.selected.get(item.um_id)}
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
        } else{
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
        if(this.state.next_page === "" || this.state.next_page === "1"  || global.NetReqModel.tel_phone === ""){
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
                data={this.state.list}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                ListFooterComponent={this._renderFooter}//尾巴
                onEndReached={this._onEndReached}
                onEndReachedThreshold={0.01}
                ItemSeparatorComponent={this._separator}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                    />
                }
            />
            {ViewUtils.renderToast(180)}
            </View>
        )
    }

    render() {
        return (
            this.renderMainView()
        )
    }
}