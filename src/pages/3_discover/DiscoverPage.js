import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import AppStatusBar from '../../common/AppStatusBar';
import {GlobalStyles} from '../../../res/styles/GlobalStyles'

const picArray1 = [
  {uri:require('../../../res/images/3_d_1.png'), text:'公司简介'},
  {uri:require('../../../res/images/3_d_2.png'), text:'风险控制'},
  {uri:require('../../../res/images/3_d_3.png'), text:'安全保障'},
]
const picArray2 = [
  {uri:require('../../../res/images/3_d_4.png'), text:'组织架构'},
  {uri:require('../../../res/images/3_d_5.png'), text:'运营数据'},
  {uri:require('../../../res/images/3_d_6.png'), text:'联系我们'},
]
export default class DiscoverPage extends Component {
  constructor(props) {
    super(props);
  }

  renderLoopView(picArray) {
    return (
      <View style={styles.pic_array_row_container}>
        {picArray.map((item, index) => {
          return (
            <View key={index} style={styles.pic_array_cell_container}>
              <Image style={styles.pic_array_cell_image}
                source={item.uri} />
              <Text style={styles.pic_array_cell_text}>{item.text}</Text>
            </View>
          )
        })}
      </View>
    )
  }

  pressToWebView(switchFlag) {
    let data = {};
    switch(switchFlag) {
      case 'title_img_link':
        data = {
          title:'头部图片链接',
          url:'https://github.com/'
        }
        break;
    }
    this.props.navigation.navigate('WebViewPage',{
      data:data,
      ...this.props
    })
  }
  render() {
    return (
      <View style={GlobalStyles.rootContainer}>
        <AppStatusBar 
         barColor='#AAAAAA'
         barStyle='light-content' />
        <TouchableOpacity onPress={() => this.pressToWebView('title_img_link')}>
          <Image style={{
            width:GlobalStyles.WINDOW_WIDTH,
            height:200
          }}
            source={require('../../../res/images/3_d_7.png')} />
        </TouchableOpacity>
        <View style={styles.pic_array_container}>
          {this.renderLoopView(picArray1)}
          {this.renderLoopView(picArray2)}
        </View>
        <View style={{
          marginTop:30,
        }}>
          <View style={{
            marginLeft:GlobalStyles.WINDOW_WIDTH*0.05,
            marginBottom:3,
          }}>
          <Text style={{
            fontSize:12,
            color:'#4A4A4A',
            marginBottom:5,
          }}>{'嗨爆盛夏 不遗余"礼"'}</Text>
          <Text style={{
            fontSize:12,
            color:'#BDBDBD'
          }}>{'出借满额得豪礼'}</Text>
          </View>
          <View style={{
            marginLeft:GlobalStyles.WINDOW_WIDTH*0.05,
            marginRight:GlobalStyles.WINDOW_WIDTH*0.05,
          }}>
            <Image style={{
              height:150
            }}
              source={{uri:'http://www.jiayidai.com/cms/banner/636628659055750744_466076817243312675.jpg'}}/>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  pic_array_container: {
    height:170,
    justifyContent:'space-between',
    marginTop:30,
  },
  pic_array_row_container: {
    flexDirection:'row',
    justifyContent:'space-around',
    marginLeft:20,
    marginRight:20,
  },
  pic_array_cell_container: {
    alignItems:'center',
    justifyContent:'center',
  },
  pic_array_cell_image: {
    width:35, 
    height:35
  },
  pic_array_cell_text: {
    fontSize:14,
    color:'#4A4A4A',
    marginTop:10
  },

})