import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';
export default class test extends Component {
  state = {
    modalVisible: false,
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  myclose(){
    this.setModalVisible(!this.state.modalVisible);
  }
  render() {
    return (
      <View style={{marginTop: 22}}>
        <TouchableHighlight
          onPress={() => {
            this.setModalVisible(true);
          }}>
          <Text>Show Modal</Text>
        </TouchableHighlight>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          
        > 
        <TouchableWithoutFeedback onPress={()=>{this.myclose()}}>
          <View style={styles.container} >
            <View style={styles.content}>
              <TouchableHighlight style={[styles.row,styles.rowOfBorder]}>
                <Text style={styles.text}>Hello World!</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.row}
                onPress={() => {this.myclose();}}>
                <Text style={styles.text}>Hide Modal11</Text>
              </TouchableHighlight>
            </View>
          </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}
let styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'row',
    alignItems:'flex-end',
    backgroundColor:'rgba(0, 0, 0, 0.2)'
  },
  content:{
    flex:1,
    backgroundColor:'#fff'
  },
  row:{
    height:70,
    alignItems:'center',
    justifyContent:'center'
  },
  rowOfBorder:{
    borderBottomColor:'#F1F1F1',
    borderBottomWidth:1
  },
  text:{
    color:'#2288D0',
  }
});