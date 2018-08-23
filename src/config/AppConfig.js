const isProEnv = false;
export var AppConfig = {
  REQUEST_HOST: isProEnv?'https://authoritymserv.jiayecaifu.com:8023':'https://jydrnserv.jiayidai.com:8282/JYD_RN_Serv',
  // REQUEST_HOST:'http://10.2.0.155:8199/JYD_RN_Serv',
  isProEnv: isProEnv,
  REQUEST_TIMEOUT:50000,
  AUTHCODE_CD:10,
}