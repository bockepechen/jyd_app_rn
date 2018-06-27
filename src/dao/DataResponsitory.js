import {
  AsyncStorage
} from 'react-native';

export default class DataResponsitory {
  /**
   * 根据上一次网络访问的时间差，自动判断读取本地数据或者访问网络接口
   * @param {*} url
   */
  fetchRespository(url) {
    return new Promise((reslove, reject) => {
      this.fetchLocalResponsitory(url)
        .then((result) => {
          if (result && result.timestamp && !this.checkOverDue(result.timestamp)) {
            reslove(result);
          } else {
            this.fetchNetResponsitory(url)
              .then((result) => {
                reslove(result);
              })
              .catch((error) => {
                reject(error);
              })
          }
        })
        .catch((error) => {
          reject(error);
        })
    })
  }
  /**
   * 取得手机本地缓存数据
   * @param {*} url 
   */
  fetchLocalResponsitory(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (error) {
          reject(error);
        } else {
          try {
            resolve(JSON.parse(result));
          } catch(e) {
            reject(e);
          }
        }
      })
    })
  }

  /**
   * 取得网络数据
   * @param {*} url 
   */
  fetchNetResponsitory(url, ifStore) {
    return new Promise((resolve, reject) => {
      fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson) {
          if(ifStore) {
            try {
              saveResponsitory(url, 
                {items:responseJson.items, timestamp:Date.now()}, 
                () => {});
            } catch(e) {
              reject(e);
            }
          }
          resolve(responseJson);
        } else {
          reject(new Error('NetResponsitory is null.'));
        }
      })
      .catch((error) => {
        reject(error);
      })
    })
  }

  /**
   * 将网络数据缓存到手机本地
   * @param {*} url 
   * @param {*} items 
   * @param {*} callBack 
   */
  saveResponsitory(url, items, callBack) {
    AsyncStorage.setItem(url, JSON.stringify(items))
      .then(callBack)
      .catch((error) => {
        throw(error);
      });
  }

  /**
   * 检查时间是否过期（有效期：4小时）
   * @param {*} lastLongTime 
   */
  checkOverDue(lastLongTime) {
    let diff_time = Math.floor((Date.now() - lastLongTime)/1000);
    if (diff_time >= 4*60*60) {
      return true
    } else {
      return false;
    }
  }

}