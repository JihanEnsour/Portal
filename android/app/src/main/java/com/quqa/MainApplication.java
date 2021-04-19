package com.quqa;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;
import org.reactnative.camera.RNCameraPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.modules.i18nmanager.I18nUtil;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new BackgroundTimerPackage(),
            new RNDeviceInfo(),
            new RNPermissionsPackage(),
            new RNCameraPackage(),
            new RNFusedLocationPackage(),
            new MapsPackage(),
            new RNFetchBlobPackage(),
            new ReactNativeDocumentPicker(),
            new RNVersionNumberPackage(),
            new ReactNativePushNotificationPackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage()
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
    I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
    sharedI18nUtilInstance.forceRTL(this,true);
    sharedI18nUtilInstance.allowRTL(this, true);
    //BackgroundTaskPackage.useContext(this);
  }
}
