import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Grid,
  Row,
  Col,
  Toast,
  View,
  Fab,
} from "native-base";
import {
  StyleSheet,
  Text,
  PermissionsAndroid,
  Platform,
  Alert,
  Dimensions,
  AsyncStorage,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import * as JSONData from "../../exportsPublic";
import { RNCamera } from "react-native-camera";
import QRCodeScanner from "react-native-qrcode-scanner";
import moment from "moment";
import BackgroundTimer from "react-native-background-timer";
import { getPreciseDistance, findNearest } from "geolib";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const widthTwo = "90%";

class urgentSigniture extends Component {
  watchId = null;
  constructor(props) {
    super(props);
    this.state = {
      userArray: [],
      nearstDistance: 0,
      nearstData: "",
      isMapReady: false,
      latitude: 0,
      longitude: 0,
      error: null,
      disableBtns: true,
      qrData: "",
      showData: false,
      showTime: true,
      serverTimeMob: moment().format("hh:mm:ss A"),
      sessionEndsOn: 0,
    };
  }

  async componentDidMount() {
    Geolocation.clearWatch(this.watchID);

    var value = await JSONData.storageGet("UserLoggedData");
    this.setState({
      userArray: value[0],
    });

    // var ddd = await JSONData.storageGet("savedTransactions");
    // console.warn(ddd);

    //AsyncStorage.removeItem("savedTransactions");
    //Active this, when I need to test on Emulator
    //this.getLocation();
  }

  getResult = async (disableBtns) => {
    this.setState({
      disableBtns: disableBtns,
      sessionEndsOn: Number(60),
    });

    BackgroundTimer.runBackgroundTimer(() => {
      let newTime = moment().add(1, "seconds").format("hh:mm:ss A");

      let cc = this.state.sessionEndsOn - 1;
      if (cc == 0) {
        Alert.alert(
          "تنبية",
          "!إنتهت مدة فعالية كود الختم",
          [
            {
              text: "موافق",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
        this.props.navigation.goBack();
      }

      this.setState({ serverTimeMob: newTime, sessionEndsOn: cc });
    }, 1 * 1000);
  };

  insertData = async (actionResult, extraData) => {
    AsyncStorage.getItem("savedTransactions").then(async (result) => {
      const val = await result;
      var contacted = {
        strEmployee: this.state.userArray.strEmployee,
        strDBName: this.state.userArray.strDBName,
        date: moment().format("MM/DD/YYYY hh:mm:ss A"),
        actionResult: actionResult,
        extraData: extraData,
        nearstDistance: this.state.nearstDistance,
      };
      //console.warn(contacted);
      if (val != null) {
        var s = [...JSON.parse(val), contacted];
        //console.warn(s);
        AsyncStorage.setItem("savedTransactions", JSON.stringify(s));
      } else {
        //console.warn("Data Not Found");
        AsyncStorage.setItem("savedTransactions", JSON.stringify([contacted]));
      }
    });

    Toast.show({ text: "تم حفظ الحركة.", type: "success" });
    this.props.navigation.goBack();
  };

  async areYouSure(actionResult, extraData, alertMSG) {
    await Alert.alert(
      "تــــأكيد الختـــم",
      alertMSG,
      [
        {
          text: "إلغـــاء",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "مــــوافق",
          onPress: () => this.insertData(actionResult, extraData),
        },
      ],
      { cancelable: false }
    );
  }

  hasLocationPermission = async () => {
    if (
      Platform.OS === "ios" ||
      (Platform.OS === "android" && Platform.Version < 23)
    ) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      Toast.show({ text: "Location permission denied by user." });
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Toast.show({ text: "Location permission revoked by user." });
    }

    return false;
  };

  onMapLayout = () => {
    this.setState({ isMapReady: true });
  };

  calculateLocalDistance(machineLatitude, machineLongitude) {
    var distance = getPreciseDistance(
      { latitude: this.state.latitude, longitude: this.state.longitude },
      { latitude: machineLatitude, longitude: machineLongitude },
      50
    );
    this.setState({ nearstDistance: distance });
    //console.warn(this.state.nearstDistance);
  }

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();
    if (!hasLocationPermission) return;

    this.watchID = Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        // console.warn(this.state.latitude);
        // console.warn(this.state.longitude);

        var nearestDis = findNearest(
          { latitude: this.state.latitude, longitude: this.state.longitude },
          [
            { latitude: 31.985064, longitude: 35.897729 }, //Sport City Circle
            { latitude: 31.9570036, longitude: 35.9619894 }, //Al Nasir Raw Material Branch
            { latitude: 31.870818, longitude: 35.9863546 }, //Sahab Branch
            { latitude: 31.957700729370117, longitude: 35.964157104492188 }, //Al Nasir Maintenanc Branch
            { latitude: 31.9950399, longitude: 35.9884789 }, //Markah Branch
            { latitude: 31.8708782, longitude: 35.9875764 }, //Sahab Cars
          ]
        );
        this.setState({ nearstData: nearestDis });
        // console.warn(hsdb);
        this.calculateLocalDistance(nearestDis.latitude, nearestDis.longitude);
        if (this.state.nearstDistance <= 500) {
          this.getResult(false);
        } else {
          this.getResult(true);
        }
      },
      (error) => {
        this.setState({ error: error });
        console.warn(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0, //50
        forceRequestLocation: true,
      }
    );
  };

  componentWillUnmount() {
    Geolocation.clearWatch(this.watchID);
  }

  onSuccess = (e) => {
    //console.warn(e);
    this.setState({ qrData: e.data, showData: true });
    this.getLocation();
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-forward" />
            </Button>
          </Left>
          <Body>
            <Title>{"الختم البديل"}</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          {this.state.showData ? (
            <Grid>
              <Row style={{ alignSelf: "center" }}>
                <MapView
                  style={{ flex: 1, height: 180 }}
                  region={{
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                  }}
                  onLayout={this.onMapLayout}
                  showsScale
                  showsCompass
                  showsPointsOfInterest
                  showsBuildings
                >
                  {this.state.isMapReady && (
                    <Marker
                      coordinate={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                      }}
                    />
                  )}
                </MapView>
              </Row>
              <Row style={{ alignSelf: "center" }}>
                <View style={stylesLocal.nameBox}>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 18,
                      fontWeight: "600",
                    }}
                  >
                    {"ســـاعة الختـــم"}
                  </Text>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 18,
                      fontWeight: "600",
                    }}
                  >
                    {this.state.showTime
                      ? this.state.serverTimeMob
                      : "00:00:00"}
                  </Text>
                  {/* <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 10,
                      color: "green",
                    }}
                  >
                    {"(" +
                      this.state.nearstDistance +
                      " M) " +
                      this.state.nearstData.latitude +
                      ", " +
                      +this.state.nearstData.longitude}
                  </Text> */}
                </View>
              </Row>
              <Row
                style={{ width: "100%", padding: 10, justifyContent: "center" }}
              >
                <TouchableOpacity
                  activeOpacity={0.5}
                  disabled={this.state.disableBtns}
                  onPress={() =>
                    this.areYouSure(
                      "AttendanceByQRCodeScanner",
                      this.state.qrData + ",1",
                      "هل أنت متأكد من تسجيل حركة دخول ؟"
                    )
                  }
                >
                  <View
                    style={[
                      stylesLocal.menuBox,
                      {
                        backgroundColor: this.state.disableBtns
                          ? "#607D8B"
                          : "#32db64",
                      },
                    ]}
                  >
                    <Icon name="home" style={{ color: "#fff" }} />
                    <Text style={stylesLocal.info}>دخـــــــــول</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.5}
                  disabled={this.state.disableBtns}
                  onPress={() =>
                    this.areYouSure(
                      "AttendanceByQRCodeScanner",
                      this.state.qrData + ",21",
                      "هل أنت متأكد من تسجيل حركة خروج ؟"
                    )
                  }
                >
                  <View
                    style={[
                      stylesLocal.menuBox,
                      {
                        backgroundColor: this.state.disableBtns
                          ? "#607D8B"
                          : "#E14343",
                      },
                    ]}
                  >
                    <Icon name="log-out" style={{ color: "#fff" }} />
                    <Text style={stylesLocal.info}>خـــــــروج</Text>
                  </View>
                </TouchableOpacity>
              </Row>
              <Row
                style={{ width: "100%", padding: 10, justifyContent: "center" }}
              >
                <TouchableOpacity
                  activeOpacity={0.5}
                  disabled={this.state.disableBtns}
                  onPress={() =>
                    this.areYouSure(
                      "AttendanceByQRCodeScanner",
                      this.state.qrData + ",61",
                      "هل أنت متأكد من تسجيل حركة عمـــــل رسمي ؟"
                    )
                  }
                >
                  <View
                    style={[
                      stylesLocal.menuBox,
                      {
                        backgroundColor: this.state.disableBtns
                          ? "#607D8B"
                          : "#fac125",
                      },
                    ]}
                  >
                    <Icon name="paper" style={{ color: "#fff" }} />
                    <Text style={stylesLocal.info}>عمـــــل رسمي</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.5}
                  disabled={this.state.disableBtns}
                  onPress={() =>
                    this.areYouSure(
                      "AttendanceByQRCodeScanner",
                      this.state.qrData + ",41",
                      "هل أنت متأكد من تسجيل حركةاســــــتراحة ؟"
                    )
                  }
                >
                  <View
                    style={[
                      stylesLocal.menuBox,
                      {
                        backgroundColor: this.state.disableBtns
                          ? "#607D8B"
                          : "#46639E",
                      },
                    ]}
                  >
                    <Icon name="pizza" style={{ color: "#fff" }} />
                    <Text style={stylesLocal.info}>اســــــتراحة</Text>
                  </View>
                </TouchableOpacity>
              </Row>
              {/* <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
                <Col style={{ width: widthTwo }}>
                  <Button
                    style={{
                      //justifyContent: "center",
                      margin: 8,
                      width: "100%",
                      backgroundColor: this.state.disableBtns
                        ? "#607D8B"
                        : "#E14343",
                    }}
                    activeOpacity={0.5}
                    disabled={this.state.disableBtns}
                    onPress={() =>
                      this.areYouSure(
                        "AttendanceByQRCodeScanner",
                        this.state.qrData + ",1",
                        "هل أنت متأكد من تسجيل حركة دخول ؟"
                      )
                    }
                  >
                    <Icon active name="home" />
                    <Text style={stylesLocal.buttonText}>دخـــــــــول</Text>
                  </Button>
                </Col>
              </Row> */}
              {/* <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
                <Col style={{ width: widthTwo }}>
                  <Button
                    style={{
                      //justifyContent: "center",
                      margin: 8,
                      width: "100%",
                      backgroundColor: this.state.disableBtns
                        ? "#607D8B"
                        : "#fac125",
                    }}
                    activeOpacity={0.5}
                    disabled={this.state.disableBtns}
                    onPress={() =>
                      this.areYouSure(
                        "AttendanceByQRCodeScanner",
                        this.state.qrData + ",21",
                        "هل أنت متأكد من تسجيل حركة خروج ؟"
                      )
                    }
                  >
                    <Icon active name="log-out" />
                    <Text style={stylesLocal.buttonText}>خـــــــروج</Text>
                  </Button>
                </Col>
              </Row>
              <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
                <Col style={{ width: widthTwo }}>
                  <Button
                    style={{
                      //justifyContent: "center",
                      margin: 8,
                      width: "100%",
                      backgroundColor: this.state.disableBtns
                        ? "#607D8B"
                        : "#32db64",
                    }}
                    activeOpacity={0.5}
                    disabled={this.state.disableBtns}
                    onPress={() =>
                      this.areYouSure(
                        "AttendanceByQRCodeScanner",
                        this.state.qrData + ",61",
                        "هل أنت متأكد من تسجيل حركة عمـــــل رسمي ؟"
                      )
                    }
                  >
                    <Icon active name="paper" />
                    <Text style={stylesLocal.buttonText}>عمـــــل رسمي</Text>
                  </Button>
                </Col>
              </Row>
              <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
                <Col style={{ width: widthTwo }}>
                  <Button
                    style={{
                      //justifyContent: "center",
                      margin: 8,
                      width: "100%",
                      backgroundColor: this.state.disableBtns
                        ? "#607D8B"
                        : "#387ef5",
                    }}
                    activeOpacity={0.5}
                    disabled={this.state.disableBtns}
                    onPress={() =>
                      this.areYouSure(
                        "AttendanceByQRCodeScanner",
                        this.state.qrData + ",41",
                        "هل أنت متأكد من تسجيل حركةاســــــتراحة ؟"
                      )
                    }
                  >
                    <Icon active name="pizza" />
                    <Text style={stylesLocal.buttonText}>اســــــتراحة</Text>
                  </Button>
                </Col>
              </Row>*/}
            </Grid>
          ) : (
            <QRCodeScanner
              onRead={this.onSuccess}
              flashMode={RNCamera.Constants.FlashMode.auto}
              showMarker={true}
              topContent={
                <Text style={stylesLocal.centerText}>
                  قراءة باركود الختم عن طريق الكاميرا
                  {"\n\n"}
                </Text>
              }
            />
          )}
        </Content>
        <Fab
          direction="down"
          style={{ backgroundColor: "#451e3e" }}
          position="bottomRight"
        >
          <Text style={{ fontSize: 18 }}>
            {" " + this.state.sessionEndsOn + " "}
          </Text>
        </Fab>
      </Container>
    );
  }
}

const stylesLocal = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#eeeeee",
  },
  nameBox: {
    //backgroundColor: "#FFFFFF",
    width: screenWidth / 1.02,
    height: screenHeight / 7,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    shadowColor: "white",
    shadowOpacity: 0.8,
    shadowOffset: {
      height: 0.5,
      width: -0.5,
    },
    borderRadius: 15,
    elevation: 12,
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
    paddingTop: 2,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 35,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
  },
  header: {
    backgroundColor: "#00BFFF",
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  body: {
    //paddingTop: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
  },
  menuBox: {
    //backgroundColor: "#DCDCDC",
    width: screenWidth / 2.3,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 2,
      width: -2,
    },
    borderRadius: 60,
    elevation: 4,
  },
  icon: {
    width: 50,
    height: 50,
  },
  info: {
    paddingTop: 5,
    fontSize: 23,
    color: "#fff",
    fontWeight: "600",
  },
});

export default urgentSigniture;
