import {AsyncStorage} from 'react-native'
const PRE_KEY = 'Initial_';
export default class InitialDao {

  saveInitialData(key, data) {
    AsyncStorage.setItem(PRE_KEY+key, JSON.stringify(data), (error) => {
      if (error) {
        return false;
      } else {
        return true;
      }
    })
  }

  getInitailData(key) {
    return new Promise((reslove, reject) => {
      AsyncStorage.getItem(PRE_KEY+key, (error, result) => {
        if (!error) {
          try {
            reslove(JSON.parse(result));
          } catch(e) {
            reject(e);
          }
        } else {
          reject(error);
        }
      })
    });
  }

}