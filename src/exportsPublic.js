import { AsyncStorage, Alert } from "react-native";
import * as DeviceInfo from "./deviceInfo";

const API_LINK_PUBLIC =  "http://86.108.13.54:206/"; //"http://94.142.33.196:201/"; //"http://192.168.1.3:207/"; 

const storageSet = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
  }
};

const storageGet = async (key) => {
  try {
    const result = await AsyncStorage.getItem(key);
    const json = JSON.parse(result);
    //console.warn(json);
    return json;
  } catch (error) {
    console.log(error);
  }
};

const callAnyFunction = async (url) => {
  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((responseData) => {
      var result = JSON.parse(responseData);
       //console.warn(result);
      return result;
    })
    .catch((error) => console.error(error));
};

const getData = async (actionResultName, user, extraData) => {
  try {
    //console.warn(extraData);
    var url = API_LINK_PUBLIC + "Home/RedirectToReaction";
    //console.warn(url);
    return fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        actionResultName: actionResultName,
        id: user.id,
        strEmployee: user.strEmployee,
        Emp_ID: user.Emp_ID,
        strName: user.strName,
        strDBName: user.strDBName,
        strCard: user.strCard,
        strMacAddress: DeviceInfo.deviceMainData,
        AdminHR: user.AdminHR,
        bIsHrAccess: user.bIsHrAccess,
        bitIsLoggedMobileApp: user.bitIsLoggedMobileApp,
        extraData: extraData,        
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        var result = JSON.parse(responseData);
        //console.warn(result);
        return result;
      })
      .catch((error) => console.warn(error));
  } catch (error) {
    return console.log(error);
  }
};

const sendJSONFormData = async (
  actionResultName,
  user,
  extraDataFrst,
  extraDataScnd,
  token
) => {
  try {
    //console.warn( user.strName);

    var formData = new FormData();
    formData.append("actionResultName", actionResultName);
    formData.append("id", user.id);
    formData.append("strEmployee", user.strEmployee);
    formData.append("Emp_ID", user.Emp_ID);
    formData.append("strName", user.strName);
    formData.append("strDBName", user.strDBName);
    formData.append("strCard", user.strCard);
    formData.append("AdminHR", user.AdminHR);
    formData.append("bIsHrAccess", user.bIsHrAccess);
    formData.append("bitIsLoggedMobileApp", user.bitIsLoggedMobileApp);
    formData.append(
      "extraData",
      JSON.stringify(extraDataFrst) + JSON.stringify(extraDataScnd)
    );
    formData.append("strMobileToken", token);
    formData.append("strMacAddress", DeviceInfo.deviceMainData);
    //console.warn(DeviceInfo.macAddress);
    var url = API_LINK_PUBLIC + "Home/RedirectToReaction";
    return fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseData) => {
        var result = JSON.parse(responseData);
        //console.warn(result);
        return result;
      })
      .catch((error) => console.warn(error));
  } catch (error) {
    return console.log(error);
  }
};

const alertUser = (title, msg) => {
  Alert.alert(
    title,
    msg,
    [
      {
        text: "موافق",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
    ],
    { cancelable: false }
  );
};

export {
  storageSet,
  storageGet,
  getData,
  sendJSONFormData,
  callAnyFunction,
  API_LINK_PUBLIC,
  alertUser,
};
