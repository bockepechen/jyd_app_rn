import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import {GlobalStyles} from '../../../res/styles/GlobalStyles';
import ViewUtils from '../../utils/ViewUtils'

export default class MyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefresh: false,
      isEye: true,
    }
  }

  loadData = () => {
    this.setState({isRefresh:true});
    setTimeout(() => {
      // simulate data request
      this.setState({isRefresh:false});
    }, 2000);
  }

  renderNavTitleView() {
    return (
      <View key={'nav_title_android'} style={{
        justifyContent:'flex-end',
        position:'absolute',
        top:0,
        bottom:Platform.OS==='ios'?3:2,
        left:10,
        right:10,
      }}>
        <View style={{
          alignItems:'center',
          flexDirection:'row',
          justifyContent:'space-between',
        }}>
          <TouchableOpacity 
          onPress={()=>{this.props.navigation.navigate('RegisterPage')}}
          style={{
            flexDirection:'row',
            alignItems:'center',
          }}>
          <Image style={{
            width:Platform.OS==='ios'?23:20,
            height:Platform.OS==='ios'?23:20,
            tintColor:'#BDBDBD',
            marginRight:5}}
            source={require('../../../res/images/ic_my.png')}/>
            <Text style={{
              color:'#4A4A4A',
              fontSize:12
            }}>{'138****2629'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            alignItems:'center',
            justifyContent:'center'
          }}>
            <Image style={{
              width:Platform.OS==='ios'?18:16,
              height:Platform.OS==='ios'?18:16,
              tintColor:'#BDBDBD',
              marginBottom:Platform.OS==='ios'?4:2}}
              source={require('../../../res/images/ic_contacts.png')}/>
              <Text style={{
                color:'#4A4A4A',
                fontSize:Platform.OS==='ios'?11:10
              }}>{'明细'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  hideNum = () => {
    this.setState({
      isEye: !this.state.isEye
    });
  }
  render() {
    return (
      <View style={GlobalStyles.rootContainer}>
        <NavigationBar
        navColor='#FFFFFF'
        statusBarColor='#AAAAAA'
        statusBarStyle='light-content'
        titleView={this.renderNavTitleView()}
        />
        <ScrollView
        refreshControl={
          <RefreshControl 
            title={'加载中...'}
            colors={['red']}
            tintColor={'red'}
            titleColor={'red'}
            refreshing={this.state.isRefresh}
            onRefresh={this.loadData} />
        }>

          <View style={styles.personal_panel_container}>
            <Text style={styles.personal_row1_txt}>
              {'可用余额(元)'}
            </Text>
            <View style={styles.personal_row2_container}>
              <Text style={styles.personal_row2_txt}>
                {this.state.isEye?'0.00':'****'}
              </Text>
              <TouchableOpacity onPress={this.hideNum}>
                <Image style={styles.personal_row2_img}
                source={this.state.isEye?
                  require('../../../res/images/eye_opened.png'):
                  require('../../../res/images/eye_closed.png')}/>
              </TouchableOpacity>
            </View>
            <View style={styles.personal_row3_container}>
              <View style={styles.personal_row3_column_container}>
                <View>
                  <Text style={styles.personal_row3_column_txt1}>
                    {'代收本息总额(元)'}
                  </Text>
                  <Text style={styles.personal_row3_column_txt2}>
                    {this.state.isEye?'0.00':'****'}
                  </Text>
                </View>
              </View>
              <View style={styles.personal_row3_column_container}>
                <View>
                  <Text style={styles.personal_row3_column_txt1}>
                    {'累计已收利息及奖励(元)'}
                  </Text>
                  <Text style={styles.personal_row3_column_txt2}>
                    {this.state.isEye?'0.00':'****'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.personal_row4_container}>
              <TouchableOpacity style={[styles.personal_row4_btn,{borderWidth:0.5,borderColor:'#FF3030',}]}>
                <Text style={{color:'#FF3030',fontSize:15}}>
                  {'充 值'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.personal_row4_btn,{
                backgroundColor:'#FF3030'
              }]}>
                <Text style={{color:'#FFFFFF',fontSize:15}}>
                  {'提 现'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.scroll_view_container}>
            <TouchableOpacity style={styles.scroll_view_cell_container}>
              <View style={styles.scroll_view_cell_column1}>
                <Image style={styles.scroll_view_cell_column1_img}
                  source={require('../../../res/images/ic_trending.png')}/>
                <Text style={styles.scroll_view_cell_column1_txt}>
                  {'查看我的资产详情'}
                </Text>
              </View>
              <Image style={styles.scroll_view_cell_column2_img}
                source={require('../../../res/images/ic_tiaozhuan.png')}/>
            </TouchableOpacity>
            {ViewUtils.renderLine('#BDBDBD', false, 30, -1)}

            <TouchableOpacity style={styles.scroll_view_cell_container}>
              <View style={styles.scroll_view_cell_column1}>
                <Image style={styles.scroll_view_cell_column1_img}
                  source={require('../../../res/images/ic_trending.png')}/>
                <Text style={styles.scroll_view_cell_column1_txt}>
                  {'查看我的资产详情'}
                </Text>
              </View>
              <Image style={styles.scroll_view_cell_column2_img}
                source={require('../../../res/images/ic_tiaozhuan.png')}/>
            </TouchableOpacity>
            {ViewUtils.renderLine('#BDBDBD', false, 30, -1)}

            <TouchableOpacity style={styles.scroll_view_cell_container}>
              <View style={styles.scroll_view_cell_column1}>
                <Image style={styles.scroll_view_cell_column1_img}
                  source={require('../../../res/images/ic_trending.png')}/>
                <Text style={styles.scroll_view_cell_column1_txt}>
                  {'查看我的资产详情'}
                </Text>
              </View>
              <Image style={styles.scroll_view_cell_column2_img}
                source={require('../../../res/images/ic_tiaozhuan.png')}/>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {ViewUtils.renderTransparentTabNavFoot()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  personal_panel_container: {
    backgroundColor:'#FFFFFF',
  },
  personal_row1_txt: {
    color:'#212121',
    marginTop:25,
    marginLeft:15
  },
  personal_row2_container: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginTop:20,
    marginLeft:15,
    marginRight:15,
  },
  personal_row2_txt: {
    fontSize:35,
    color:'red'
  },
  personal_row2_img: {
    width:25,
    height:25,
    tintColor:'#212121'
  },
  personal_row3_container: {
    flexDirection:'row',
    marginTop:20,
    marginLeft:15,
    marginRight:10,
    marginBottom:20
  },
  personal_row3_column_container: {
    flexDirection:'row',
    alignItems:'flex-end',
    marginRight:30
  },
  personal_row3_column_img: {
    width:35,
    height:35,
    tintColor:'red',
    marginRight:5,
  },
  personal_row3_column_txt1: {
    color:'#BDBDBD',
    fontSize:12,
    marginBottom:10
  },
  personal_row3_column_txt2: {
    color:'#212121',
    fontSize:15,
  },
  personal_row4_container: {
    flexDirection:'row',
    justifyContent:'space-between',
    paddingTop:10,
    paddingBottom:30,
    paddingLeft:40,
    paddingRight:40,
  },
  personal_row4_btn: {
    width:GlobalStyles.WINDOW_WIDTH*0.35,
    height:35,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:5,
  },
  scroll_view_container: {
    backgroundColor:'#FFFFFF',
    marginTop:15,
  },
  scroll_view_cell_container: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    height:60,
  },
  scroll_view_cell_column1:{
    flexDirection:'row',
    alignItems:'center',
    marginLeft:15
  },
  scroll_view_cell_column1_img:{
    width:20,
    height:20,
    tintColor:'red',
    marginRight:10
  },
  scroll_view_cell_column1_txt:{
    color:'#212121',
  },
  scroll_view_cell_column2_img:{
    width:25,
    height:25,
    tintColor:'red',
    marginRight:15
  },
})