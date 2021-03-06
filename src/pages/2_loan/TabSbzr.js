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
import ViewUtils from '../../utils/ViewUtils';
import ProductCardSbzr from './ProductCardSbzr';
import {ImageStores} from '../../../res/styles/ImageStores';
import DataResponsitory, { Storage_Key } from '../../dao/DataResponsitory';

let isAndroid = Platform.OS==='android'?true:false;
export default class TabSbzr extends Component {
  constructor(props){
    super(props);
    this.dataResponsitory = new DataResponsitory();
    this.state = {
      sourceData: [
        {
          titleImg:ImageStores.cp_cheaa,
          titleName:'购物',
          rate:6.24,
          period:6,
          addDay:25,
          restMoney:1620.24,
          transferMoney:1420.24,
          isRestMoney: true,
          ifSell:true
        },
        {
          titleImg:ImageStores.cp_xina,
          titleName:'资金周转',
          rate:10.24,
          period:12,
          addDay:25,
          restMoney:1000620.24,
          transferMoney:11420.24,
          isRestMoney: true,
          ifSell:false
        },
        {
          titleImg:ImageStores.cp_cheaa,
          titleName:'【担保】购物',
          rate:6.24,
          period:18,
          addDay:25,
          restMoney:1620.24,
          transferMoney:1420.24,
          isRestMoney: true,
          ifSell:false
        },
      ],
      selected: new Map(),
      httpRes:{},
      list:[],
      refreshing: false,
      next_page:"",
      itemUrl:'',
    }
  }

  componentDidMount() {
    this._onRefresh();
  }

  async getInfoData() {
    global.NetReqModel.PageNum = await this.state.next_page;
    // global.NetReqModel.tel_phone = await "13502151376";
    // global.NetReqModel.jyd_pubData.user_id = await "4";
    global.NetReqModel.tel_phone = await "15822753827";
    global.NetReqModel.jyd_pubData.user_id = await "91";
    let url = await '/productList/querySecondStandardList';
    this.dataResponsitory.fetchNetResponsitory(url, global.NetReqModel)
    .then((result) => {
      console.log(result);
      var totalList = [];
      if(result.return_code == '0000'){
        totalList = (this.state.next_page === "1") ? [] : this.state.list;
        totalList = totalList.concat(result.SecondStandardList);
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

  _onRefresh() {
    // this.loadFlag = true;
    this.setState({
        next_page : '1',
        // refreshing:true
    },()=>{
        this.getInfoData();
    });
  }

  _onLoad(){
    console.log('adfafafdafd');
    this.getInfoData();
  }

  keyExtractor = (data, index) => {return String(index);}
  
  renderFlatListItem = (data) => {
    return (
      <ProductCardSbzr
        id={data.index}
        data={data}
        onPressItem={this._onPressItem}
        selected={!!this.state.selected.get(data.index)}
        {...this.props}/>
    )
  }

  _onPressItem = (id) => {
    // console.log(`selected id is ${id}`);
    this.setState((state) => {
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id));
      return {selected};
    });
    // let navData = {
    //   title:'嘉季丰'
    // };
    // this.props.navigation.navigate('LoanPageDetails',{
    //   data:navData,
    //   ...this.props
    // })
  };

  _onEndReached = ()=>{
    //如果是正在加载中或没有更多数据了，则返回
    if(this.state.next_page === "" || this.state.next_page === "1" ){
        return ;
    }else{
      //获取数据
      this._onLoad();
    }
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
      <FlatList
        style={{paddingTop:scaleSize(63)}}
        data={this.state.list}
        extraData={this.state.selected}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderFlatListItem}
        initialNumToRender={6}
        refreshControl={
          <RefreshControl 
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        ListFooterComponent={this._renderFooter}//尾巴
        onEndReached={this._onEndReached}
        onEndReachedThreshold={0.1}
        />
    )
  }
}