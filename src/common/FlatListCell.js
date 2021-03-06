import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import {GlobalStyles} from '../../res/styles/GlobalStyles'
import ViewUtils from '../utils/ViewUtils';
import {ImageStores} from '../../res/styles/ImageStores';

export default class FlatListCell extends PureComponent {
  constructor(props) {
    super(props);
    console.log('isiuieiyeiuyeiyuie');
    console.log(this.props.data);
  }

  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    return (
      <View>
        <TouchableOpacity style={styles.cellContainer}
          onPress={this._onPress}>
          <View style={styles.cellTitle}>
            <Image style={styles.cellTitleImage}
              source={ImageStores.sy_3}/>
            <Text style={{color:this.props.selected?'#636363':'blue'}}>{`${this.props.data.item.pName}`}</Text>
          </View>
          {ViewUtils.renderLine('#BDBDBD')}
          <View style={styles.cellContentContainer}>
            <View style={styles.cellContent1}>
              <View style={styles.cellContent1_1}>
                <Text style={styles.cellContent1_1_txt1}>{`${this.props.data.item.pRate*100}.00%`}</Text>
                <Text style={styles.cellContent1_1_txt2}>期待年回报率</Text>
              </View>
              <View style={styles.cellContent1_2}>
              <Text style={styles.cellContent1_2_txt1}>{`${this.props.data.item.pLimit}天`}</Text>
              <Text style={styles.cellContent1_2_txt2}>服务期限</Text>
              </View>
            </View>
            <View style={styles.cellContent2_1}>
              <Text style={styles.cellContent2_1_txt1}>{`剩余：${this.props.data.item.pRestMoney}元`}</Text>
              <TouchableOpacity style={styles.cellContent2_1_btn1}>
              <Text style={styles.cellContent2_1_btn1_txt}>购买</Text>
              </TouchableOpacity>
            </View>
          </View>
          </TouchableOpacity>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  cellContainer: {
    backgroundColor:'white',
    padding:5, 
    marginTop:5,
    marginBottom:5,
    marginLeft:5,
    marginRight:5,
    shadowColor:'gray',
    shadowOffset:{width:0.5, height:0.5},
    shadowOpacity:0.5,
    shadowRadius:2,
    elevation:2
  },
  cellTitle: {
    flexDirection:'row', 
    paddingLeft:5,
    alignItems:'center',
    marginBottom:10,
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