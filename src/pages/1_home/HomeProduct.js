import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import ViewUtils from '../../utils/ViewUtils'

export default class HomeProduct extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <View style={styles.container}>
          <View style={{
            flexDirection:'row',
            paddingTop:15,
            paddingLeft:15,
            paddingBottom:8,
            alignItems:'center',
          }}>
            <Image style={{
              width:22,
              height:22,
              tintColor:'red',
              marginRight:5
            }} 
              source={require('../../../res/images/ic_computer.png')}/>
            <Text style={{
              fontSize:15,
              color:'#4A4A4A'
            }}>{'嘉季丰'}</Text>
          </View>
          {ViewUtils.renderLine(0.3, '#BDBDBD')}
          <View style={{
            alignItems:'center',
            paddingTop:30
          }}>
            <Text style={{
              fontSize:30,
              color:'red',
              marginBottom:5
            }}>{'8.00%'}</Text>
            <Text style={{
              fontSize:12,
              color:'#BDBDBD'
            }}>{'期待年回报率'}</Text>
          </View>
          <View style={{
            flexDirection:'row',
            justifyContent:'space-between',
            paddingTop:20,
          }}>
            <View style={{
              paddingLeft:50,
              alignItems:'center'
            }}>
              <Text style={{
                fontSize:12,
                color:'#4A4A4A',
                marginBottom:5,
              }}>{'90天'}</Text>
              <Text style={{
                fontSize:12,
                color:'#BDBDBD'
              }}>{'服务期限'}</Text>
            </View>
            <View style={{
              paddingRight:50,
              alignItems:'center'
            }}>
              <Text style={{
                fontSize:12,
                color:'#4A4A4A',
                marginBottom:5,
              }}>{'5000元起'}</Text>
              <Text style={{
                fontSize:12,
                color:'#BDBDBD'
              }}>{'出借金额'}</Text>
            </View>
          </View>
          <View>
            <TouchableOpacity style={{
              backgroundColor:'#FF3030',
              height:45,
              marginTop:10,
              marginLeft:8,
              marginRight:8,
              borderRadius:8,
              alignItems:'center',
              justifyContent:'center'
            }}>
              <Text style={{
                fontSize:18,
                color:'#FFFFFF'
              }}>{'立即出借'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{
            alignItems:'center',
            justifyContent:'center',
            marginTop:20,
          }}>
            <Text style={{
              fontSize:12,
              color:'#63B8FF',
              marginBottom:3
            }}>{'资金由江西银行全程托管'}</Text>
            <Text style={{
              fontSize:12,
              color:'#4A4A4A',
            }}>{'市场有风险，出借需谨慎'}</Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#FFFFFF',
    marginTop:5,
    marginBottom:5,
    marginLeft:8,
    marginRight:8,
    height:320,
    shadowColor:'gray',
    shadowOffset:{width:0.5, height:0.5},
    shadowOpacity:0.5,
    shadowRadius:2,
    elevation:2,
  }
})