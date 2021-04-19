import DeviceInfo from "react-native-device-info";
import { getManufacturerSync } from "react-native-device-info";

const getConstantDeviceInfo = async () => {
  let deviceJSON = {};

  deviceJSON.uniqueId = DeviceInfo.getUniqueId();
  deviceJSON.deviceId = DeviceInfo.getDeviceId();
  deviceJSON.bundleId = DeviceInfo.getBundleId();
  deviceJSON.systemName = DeviceInfo.getSystemName();
  deviceJSON.systemVersion = DeviceInfo.getSystemVersion();
  deviceJSON.version = DeviceInfo.getVersion();
  deviceJSON.readableVersion = DeviceInfo.getReadableVersion();
  deviceJSON.buildNumber = DeviceInfo.getBuildNumber();
  deviceJSON.isTablet = DeviceInfo.isTablet();
  deviceJSON.appName = DeviceInfo.getApplicationName();
  deviceJSON.brand = DeviceInfo.getBrand();
  deviceJSON.model = DeviceInfo.getModel();
  deviceJSON.deviceType = DeviceInfo.getDeviceType();
  return deviceJSON;
};

const getSyncDeviceInfo = async () => {
  let deviceJSON = {};

  deviceJSON.manufacturer = await getManufacturerSync();
  deviceJSON.buildId = await DeviceInfo.getBuildIdSync();
  deviceJSON.isCameraPresent = await DeviceInfo.isCameraPresentSync();
  deviceJSON.deviceName = await DeviceInfo.getDeviceNameSync();
  deviceJSON.usedMemory = await DeviceInfo.getUsedMemorySync();
  deviceJSON.instanceId = await DeviceInfo.getInstanceIdSync();
  deviceJSON.installReferrer = await DeviceInfo.getInstallReferrerSync();
  deviceJSON.installerPackageName = await DeviceInfo.getInstallerPackageNameSync();
  deviceJSON.isEmulator = await DeviceInfo.isEmulatorSync();
  deviceJSON.fontScale = await DeviceInfo.getFontScaleSync();
  deviceJSON.hasNotch = await DeviceInfo.hasNotch();
  deviceJSON.firstInstallTime = await DeviceInfo.getFirstInstallTimeSync();
  deviceJSON.lastUpdateTime = await DeviceInfo.getLastUpdateTimeSync();
  deviceJSON.serialNumber = await DeviceInfo.getSerialNumberSync();
  deviceJSON.androidId = await DeviceInfo.getAndroidIdSync();
  deviceJSON.IpAddress = await DeviceInfo.getIpAddressSync();
  deviceJSON.MacAddress = await DeviceInfo.getMacAddressSync(); // needs android.permission.ACCESS_WIFI_STATE
  deviceJSON.phoneNumber = await DeviceInfo.getPhoneNumberSync(); // needs android.permission.READ_PHONE_STATE
  deviceJSON.ApiLevel = await DeviceInfo.getApiLevelSync();
  deviceJSON.carrier = await DeviceInfo.getCarrierSync();
  deviceJSON.totalMemory = await DeviceInfo.getTotalMemorySync();
  deviceJSON.maxMemory = await DeviceInfo.getMaxMemorySync();
  deviceJSON.totalDiskCapacity = await DeviceInfo.getTotalDiskCapacitySync();
  deviceJSON.freeDiskStorage = await DeviceInfo.getFreeDiskStorageSync();
  deviceJSON.batteryLevel = await DeviceInfo.getBatteryLevelSync();
  deviceJSON.isLandscape = await DeviceInfo.isLandscapeSync();
  deviceJSON.isAirplaneMode = await DeviceInfo.isAirplaneModeSync();
  deviceJSON.isBatteryCharging = await DeviceInfo.isBatteryChargingSync();
  deviceJSON.isPinOrFingerprintSet = await DeviceInfo.isPinOrFingerprintSetSync();
  deviceJSON.supportedAbis = await DeviceInfo.supportedAbisSync();
  deviceJSON.hasSystemFeature = await DeviceInfo.hasSystemFeatureSync(
    "android.software.webview"
  );
  deviceJSON.getSystemAvailableFeatures = await DeviceInfo.getSystemAvailableFeaturesSync();
  deviceJSON.powerState = await DeviceInfo.getPowerStateSync();
  deviceJSON.isLocationEnabled = await DeviceInfo.isLocationEnabledSync();
  deviceJSON.headphones = await DeviceInfo.isHeadphonesConnectedSync();
  deviceJSON.getAvailableLocationProviders = await DeviceInfo.getAvailableLocationProvidersSync();
  deviceJSON.bootloader = await DeviceInfo.getBootloaderSync();
  deviceJSON.device = await DeviceInfo.getDeviceSync();
  deviceJSON.display = await DeviceInfo.getDisplaySync();
  deviceJSON.fingerprint = await DeviceInfo.getFingerprintSync();
  deviceJSON.hardware = await DeviceInfo.getHardwareSync();
  deviceJSON.host = await DeviceInfo.getHostSync();
  deviceJSON.product = await DeviceInfo.getProductSync();
  deviceJSON.tags = await DeviceInfo.getTagsSync();
  deviceJSON.type = await DeviceInfo.getTypeSync();
  deviceJSON.baseOS = await DeviceInfo.getBaseOsSync();
  deviceJSON.previewSdkInt = await DeviceInfo.getPreviewSdkIntSync();
  deviceJSON.securityPatch = await DeviceInfo.getSecurityPatchSync();
  deviceJSON.codename = await DeviceInfo.getCodenameSync();
  deviceJSON.incremental = await DeviceInfo.getIncrementalSync();
  deviceJSON.supported32BitAbis = await DeviceInfo.supported32BitAbisSync();
  deviceJSON.supported64BitAbis = await DeviceInfo.supported64BitAbisSync();
  deviceJSON.deviceToken = await DeviceInfo.getDeviceToken();

  return deviceJSON;
};

const macAddress = DeviceInfo.getMacAddressSync();

const deviceMainData =
  DeviceInfo.getInstanceIdSync() +
  "," +
  DeviceInfo.getDeviceNameSync();

export { getConstantDeviceInfo, getSyncDeviceInfo, macAddress, deviceMainData };
