const isProEnv = false;
export var AppConfig = {
  REQUEST_HOST: isProEnv?'https://authoritymserv.jiayecaifu.com:8023':'https://jydrnserv.jiayidai.com:8282/JYD_RN_Serv',
  // REQUEST_HOST:'http://10.2.0.155:8199/JYD_RN_Serv',
  // REQUEST_HOST:'http://111.160.7.62:8407/JYD_RN_Serv', // 张红昆本地服务
  // REQUEST_HOST:'http://111.160.7.62:20006/JYD_RN_Serv', // 刘津本地服务
  isProEnv: isProEnv,
  REQUEST_TIMEOUT:30000,
  AUTHCODE_CD:120,
}