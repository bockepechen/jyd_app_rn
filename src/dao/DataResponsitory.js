import {
  AsyncStorage
} from 'react-native';
import {AppConfig} from '../config/AppConfig';
import {ExceptionMsg} from './ExceptionMsg';
import Utils from '../utils/Utils';

export var Storage_Key = {
  LS_REG_COUNTDOWN: 'reg_cd',
  LS_REG_USERINFO: 'user_info',
}

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
   * @param {*} key 
   */
  fetchLocalResponsitory(key) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(key, (error, result) => {
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
   * @param {*} params
   */
  fetchNetResponsitory(url, params) {
    // 网络请求Promise
    var fetchRequest = new Promise((resolve, reject) => {
      fetch(AppConfig.REQUEST_HOST+url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      })
      .then(response => response.json())
      .then(responseJson => {
        resolve(responseJson);
      })
      .catch((e) => {
        reject(e.message);
      })
    });
    // 超时等待Promise
    var timeoutRequset = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          return_code:'8888',
          return_msg:ExceptionMsg.REQUEST_TIMEOUT
        })
      }, AppConfig.REQUEST_TIMEOUT);
    })
    // Promise竞态，返回先执行完的Promise
    return Promise.race([fetchRequest, timeoutRequset]);
  }

  /**
   * 将网络数据缓存到手机本地
   * @param {*} key 
   * @param {*} items 
   */
  saveLocalStorage(key, items, callback) {
    AsyncStorage.setItem(key, JSON.stringify(items), callback);
  }

  /**
   * 检查时间是否过期
   * @param {*} lastLongTime 
   * @param {*} interval (默认有效期：4小时)
   */
  checkOverDue(lastLongTime, interval=4*60*60) {
    let diff_time = Math.floor((Date.now() - lastLongTime)/1000);
    if (diff_time >= interval) {
      return true
    } else {
      return false;
    }
  }

  /**
   * 试图从本地缓存中取出短信验证码读秒信息，并根据当前时间校正
   */
  adaptAuthCodeCD() {
    let result = {
      ifSendAuthCode: true,
      authcodeCD: AppConfig.AUTHCODE_CD
    }
    return new Promise((resolve) => {
      this.fetchLocalResponsitory(Storage_Key.LS_REG_COUNTDOWN)
      .then(res => {
        if(res) {
          let diff_time = res.currentCd - Utils.getInterval(res.timeStamp);
          if(diff_time > 0) {
            result.ifSendAuthCode = false;
            result.authcodeCD = diff_time;
          }
        }
        resolve(result);
      })
      .catch(e => {
        reject(result);
      })
    })
  }

}