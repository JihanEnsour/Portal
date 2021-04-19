import React, { Component } from "react";
import {
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  Linking,
  Alert,
  ImageBackground,
  Dimensions,
} from "react-native";
import {
  Container,
  Header,
  Content,
  Button,
  Icon,
  Text,
  View,
  Right,
  Left,
  Body,
  Spinner,
  Toast,
} from "native-base";
import styles from "./styles";
import DialogInput from "react-native-dialog-input";
import VersionNumber from "react-native-version-number";
import NotifService from "./NotifService";
import {
  getConstantDeviceInfo,
  getSyncDeviceInfo,
} from "../deviceInfo";
import * as JSONData from "../exportsPublic";

const screenWidth = Dimensions.get("window").width;

class MainMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appDataArr: [],
      userArray: [],
      tabsArray: [],
      serverDateTime: null,

      isDialogVisible: false,
      senderId: "433564957846",
      appGottenVersion: VersionNumber.appVersion,
      showAlertForUpdate: false,
    };

    this.fillGottenData = this.fillGottenData.bind(this);
    this.onRegister = this.onRegister.bind(this);
  }

  componentDidMount() {
    this.fillGottenData();
  }

  async fillGottenData() {
    await AsyncStorage.getItem("UserLoggedData").then((value) => {
      const data = JSON.parse(value);
      this.setState({ userArray: data[0] });

      JSONData.getData("GetAppData", data[0], "1,1,true").then(
        (appDataValue) => {          

          this.setState({
            tabsArray: appDataValue.Table1,
            appDataArr: appDataValue.Table2[0],
          });        

          this.state.appDataArr.strAppVersionAndroid !=
          this.state.appGottenVersion
            ? this.setState({ showAlertForUpdate: true })
            : this.setState({ showAlertForUpdate: false });

          // console.warn(this.state.appDataArr.strAppVersionAndroid);
           //console.warn(this.state.appGottenVersion);
          this.showAlert2();
        }
      );

      this.notif = new NotifService(
        this.onRegister.bind(this),
        this.onNotif.bind(this)
      );
      this.notif.configure(
        this.onRegister.bind(this),
        this.onNotif.bind(this),
        this.state.senderId
      );

      //Transfer the transactions if exist
      AsyncStorage.getItem("savedTransactions").then(async (result) => {
        //const items = [];
        const val = await result;
       // console.warn(val);
        if (val != null && val != undefined) {
          const results = await JSONData.getData(
            "AttendanceBuffered",
            this.state.userArray,
            val
          );
          if (results) {
            console.warn("deleted");
            AsyncStorage.removeItem("savedTransactions");
          }
          // console.warn("AttendanceBuffered " + results);

          //delete the inserted the transactions
          //AsyncStorage.removeItem("savedTransactions");
        }
      });
    });
  }

  emptyTheData() {
    AsyncStorage.setItem("KeepMeSignedIn", "false");
    //AsyncStorage.setItem("UserLoggedData", "");
    this.props.navigation.navigate("Home");
  }
  getResult = async (actionResult, extraData, snd, token) => {
    const results = await JSONData.sendJSONFormData(
      actionResult,
      this.state.userArray,
      extraData,
      snd,
      token
    );
    //if (results) {
    return results;
    //}
  };
  async LogoutMethod() {
    var url =
      JSONData.API_LINK_PUBLIC +
      "Home/Logout?userId=" +
      this.state.userArray.strEmployee +
      "&company=" +
      this.state.userArray.strDBName;
    await JSONData.callAnyFunction(url).then((res) => {
      if (res === true) {
        this.emptyTheData();
      }
    });
  }
  itemPressed(item) {
    if (item.strTabScreen !== "msg") {
      this.props.navigation.navigate(item.strTabScreen, {
        strDBName: this.state.userArray.strDBName,
        strEmployee: this.state.userArray.strEmployee,
        tabName: item.strTabName,
        userArray: this.state.userArray,
        serverDateTime: this.state.appDataArr.ServerDatetime,
      });
    } 
    else {
      Toast.show({
        text: item.strTabDescription,
        type: "warning",
        duration: 5000,
      });
    }
  }
  async sendInput(text) {
    this.showDialog(false);
    if (text != null && text != "") {
      var url =
        JSONData.API_LINK_PUBLIC +
        "Home/GetFeedbackFromUsers?userId=" +
        this.state.userArray.strEmployee +
        "&company=" +
        this.state.userArray.strDBName +
        "&msg=" +
        text;
      await JSONData.callAnyFunction(url).then((res) => {
        Toast.show({
          text: "تم إرسال ملاحظتك!",
          type: "success",
          duration: 8000,
        });
      });
    } else {
      Toast.show({
        text: "إذا كان لديك أي ملاحظة الرجاء كتابتها أو انقر الغاء!",
        buttonText: "موافق",
        type: "danger",
        duration: 8000,
      });
    }
  }
  showDialog(hereBool) {
    this.setState({
      isDialogVisible: hereBool,
    });
  }
  showAppInPlayStore() {
    Linking.openURL(this.state.appDataArr.strAppLinkAndroid);
  }
  showAlert2() {
    this.state.showAlertForUpdate
      ? Alert.alert(
          "تحديث",
          this.state.appDataArr.strAppNameAr +
            " " +
            this.state.appDataArr.strAppVersionAndroid,
          [
            {
              text: "لاحقاً",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "تحديث",
              onPress: () => this.showAppInPlayStore(),
            },
          ],
          { cancelable: false }
        )
      : null;
  }
  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.LogoutMethod()}>
              <Icon active name="log-out" />
            </Button>
          </Left>
          <Body />
          <Right>
            <Button
              transparent
              onPress={() =>
                Linking.openURL(this.state.appDataArr.strAppWebsite)
              }
            >
              <Icon active name="cloud-circle" />
            </Button>
            <Button transparent onPress={() => this.showDialog(true)}>
              <Icon active name="chatbubbles" />
            </Button>
          </Right>
        </Header>
        <Content>
          <ImageBackground
            style={stylesLocal.avatar}
            source={{
              uri: this.state.appDataArr.strAppBackground,
            }}
          >
            <View style={stylesLocal.container}>
              <View style={stylesLocal.headerContent}>
                <Text style={stylesLocal.nameBox}>
                  {this.state.userArray.strName !== undefined
                    ? this.state.userArray.strName
                    : ""}
                </Text>
                <Text
                  style={[
                    stylesLocal.name,
                    {
                      fontSize: 12,
                      paddingTop: 10,
                      color: this.state.showAlertForUpdate ? "#f53d3d" : "#FFF",
                    },
                  ]}
                  onPress={() => this.showAppInPlayStore()}
                >
                  {this.state.showAlertForUpdate ? (
                    <Icon
                      name="download"
                      style={[
                        stylesLocal.name,
                        {
                          fontSize: 12.5,
                        },
                      ]}
                    />
                  ) : (
                    ""
                  )}
                  {"  "}
                  {this.state.appDataArr.strAppLinkAndroid !== ""
                    ? this.state.appDataArr.strAppNameAr +
                      " " +
                      this.state.appDataArr.strAppVersionAndroid
                    : ""}
                </Text>
              </View>
              <View style={stylesLocal.body}>
                {this.state.tabsArray.length > 0 ? ( // condition
                  // if true
                  <FlatList
                    contentContainerStyle={stylesLocal.bodyContent}
                    data={this.state.tabsArray}
                    horizontal={false}
                    numColumns={2}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item }) => {
                      return (
                        <TouchableOpacity
                          onPress={() => this.itemPressed(item)}
                        >
                          <View
                            style={[
                              stylesLocal.menuBox,
                              { backgroundColor: item.strTabColor },
                            ]}
                          >
                            <Image
                              style={stylesLocal.icon}
                              source={{ uri: item.strTabImage }}
                            />
                            <Text style={stylesLocal.info}>
                              {item.strTabName}
                            </Text>
                            <Text style={stylesLocal.textInfo}>
                              {item.strTabDescription}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                  />
                ) : (
                  <View style={{ flex: 1, alignSelf: "center", margin: 50 }}>
                    <Spinner color="#46639E" />
                  </View>
                )}
              </View>
            </View>
          </ImageBackground>
          <DialogInput
            isDialogVisible={this.state.isDialogVisible}
            title={"التغذية الراجعة"}
            message={
              "إذا كان لديك أي ملاحظة على التطبيق يمكنك إرسالها لقسم تكنولوجيا المعلومات!"
            }
            hintInput={"الملاحظات"}
            submitInput={(inputText) => {
              this.sendInput(inputText);
            }}
            closeDialog={() => {
              this.showDialog(false);
            }}
            submitText={"موافق"}
            cancelText={"إلغاء"}
          />
        </Content>
      </Container>
    );
  }
  async onRegister(token) {
    const dataSync = await getSyncDeviceInfo();
    const dataConst = await getConstantDeviceInfo();
    this.getResult(
      "InsertUpdateEmployeeData",
      dataSync,
      dataConst,
      token.token
    );

    this.setState({ registerToken: token.token, gcmRegistered: true });
  }

  onNotif(notif) {
    //console.warn(notif);
    //Alert.alert(notif.title, notif.message);
  }
}

const stylesLocal = StyleSheet.create({
  header: {
    backgroundColor: "#00BFFF",
  },
  headerContent: {
    padding: 2,
    alignItems: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    // borderRadius: 63,
    // borderWidth: 4,
    // borderColor: "white",
    // marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  bodyContent: {
    flex: 1,
    alignSelf: "center",
    padding: 30,
  },
  textInfo: {
    fontSize: 13,
    marginTop: 5,
    color: "#f53d3d",
  },
  body: {
    //paddingTop: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
  },
  menuBox: {
    //backgroundColor: "#DCDCDC",
    width: screenWidth / 2.2,
    height: 135,
    alignItems: "center",
    justifyContent: "center",
    margin: 3,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 2,
      width: -2,
    },
    borderRadius: 55,
    elevation: 4,
  },
  nameBox: {
    //backgroundColor: "#FFFFFF",
    width: screenWidth / 1.02,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    shadowColor: "white",
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 2,
      width: -2,
    },
    borderRadius: 30,
    elevation: 4,
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
    paddingTop: 4,
  },
  icon: {
    width: 50,
    height: 50,
  },
  info: {
    fontSize: 22,
    color: "#000",
  },
});

export default MainMenu;
