const isProEnv = false;
export var AppConfig = {
  REQUEST_HOST: isProEnv?'https://authoritymserv.jiayecaifu.com:8023':'https://jydrnserv.jiayidai.com:8282/JYD_RN_Serv',
  isProEnv: isProEnv,
  REQUEST_TIMEOUT:5000,
  AUTHCODE_CD:10,
}