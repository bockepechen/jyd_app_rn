import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity
} from 'react-native';
import {GlobalStyles} from '../../res/styles/GlobalStyles'

export default class FlatListCell extends PureComponent {
  constructor(props) {
    super(props);
  }

  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    return (
      <TouchableOpacity style={styles.cellContainer}
        onPress={this._onPress}>
        <View style={styles.cellTitle}>
          <Image style={styles.cellTitleImage}
            source={require('../../res/images/ic_computer.png')}/>
          <Text style={{color:this.props.selected?'#636363':'blue'}}>{`嘉季丰  ${this.props.data.item}`}</Text>
        </View>
        <View style={styles.cellLineContainer}>
          <View style={styles.cellLine}/>
        </View>
        <View style={styles.cellContentContainer}>
          <View style={styles.cellContent1}>
            <View style={styles.cellContent1_1}>
              <Text style={styles.cellContent1_1_txt1}>8.00%</Text>
              <Text style={styles.cellContent1_1_txt2}>期待年回报率</Text>
            </View>
            <View style={styles.cellContent1_2}>
            <Text style={styles.cellContent1_2_txt1}>90天</Text>
            <Text style={styles.cellContent1_2_txt2}>服务期限</Text>
            </View>
          </View>
          <View style={styles.cellContent2_1}>
            <Text style={styles.cellContent2_1_txt1}>剩余：1572432.95元</Text>
            <TouchableOpacity style={styles.cellContent2_1_btn1}>
            <Text style={styles.cellContent2_1_btn1_txt}>购买</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  cellContainer: {
    backgroundColor:'white',
    padding:5, 
    marginTop:10,
    marginLeft:5,
    marginRight:5,
    shadowColor:'gray',
    shadowOffset:{width:0.5, height:0.5},
    shadowOpacity:0.5,
    shadowRadius:2,
    elevation:6
  },
  cellTitle: {
    flexDirection:'row', 
    paddingLeft:5,
    alignItems:'center',
  },
  cellTitleImage: {
    width:12, 
    height:12, 
    marginRight:2,
    tintColor:'red'
  },
  cellTitleText: {
    color:'#636363'
  },
  cellLineContainer: {
    backgroundColor:'#FFFFFF',
    paddingLeft:0,
    paddingRight:0,
    height:0.8,
    marginTop:4,
  },
  cellLine: {
    flex:1,
    backgroundColor:'#BDBDBD'
  },
  cellContentContainer: {
    height:100,
    flexDirection:'row',
    alignItems:'center',
  },
  cellContent1: {
    flexDirection:'row',
    alignItems:'flex-end',
  },
  cellContent1_1: {
    width:(GlobalStyles.WINDOW_WIDTH-20)*0.45,
    alignItems:'center',
    justifyContent:'center',
  },
  cellContent1_1_txt1: {
    fontSize:30, 
    color:'red'
  },
  cellContent1_1_txt2: {
    fontSize:12, 
    color:'#BDBDBD'
  },
  cellContent1_2: {
    width:(GlobalStyles.WINDOW_WIDTH-20)*0.25,
    alignItems:'center',
    justifyContent:'center',
  },
  cellContent1_2_txt1: {
    fontSize:12, 
    color:'#4A4A4A'
  },
  cellContent1_2_txt2: {
    fontSize:12, 
    color:'#BDBDBD'
  },
  cellContent2_1: {
    width:(GlobalStyles.WINDOW_WIDTH-20)*0.26,
    alignItems:'center',
    justifyContent:'space-between',
    height:70,
    padding:5
  },
  cellContent2_1_txt1: {
    fontSize:12, 
    color:'#BDBDBD'
  },
  cellContent2_1_btn1: {
    backgroundColor:'#CD3333',
    alignItems:'center',
    justifyContent:'center',
    width:70,
    height:25,
    borderRadius:5
  },
  cellContent2_1_btn1_txt: {
    fontSize:12, 
    color:'#FFFFFF',
    fontWeight:'bold',
  }
})