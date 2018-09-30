package com.jyd_app_rn;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.horcrux.svg.SvgPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.umeng.commonsdk.UMConfigure;
import com.umeng.socialize.PlatformConfig;
import cn.reactnative.httpcache.HttpCachePackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new HttpCachePackage(),
          new MainReactPackage(),
            new RNDeviceInfo(),
            new SvgPackage(),
            new SplashScreenReactPackage(),
            new DplusReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    /**
     * 初始化common库
     * 参数1:上下文，不能为空
     * 参数2:友盟 app key
     * 参数3:友盟 channel
     * 参数4:设备类型，UMConfigure.DEVICE_TYPE_PHONE为手机、UMConfigure.DEVICE_TYPE_BOX为盒子，默认为手机
     * 参数5:Push推送业务的secret
     */
    UMConfigure.init(this, "5b2874608f4a9d2da8000021", "woody", UMConfigure.DEVICE_TYPE_PHONE, "");
    /**
     * 设置组件化的Log开关
     * 参数: boolean 默认为false，如需查看LOG设置为true
     */
    UMConfigure.setLogEnabled(true);
  }
  {
//    PlatformConfig.setWeixin("wxa8b93872e244b7b3", "cdf56d09f39fdcf77cbc0a278dcf11c6");
    PlatformConfig.setWeixin("wx3ed0fc1002c06d0f", "39b8320e6c8104d687ade119d70f647c");
  }
}
