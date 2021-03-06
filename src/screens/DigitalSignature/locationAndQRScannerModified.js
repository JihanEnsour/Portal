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
  Spinner,
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
  TouchableOpacity
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import * as JSONData from "../../exportsPublic";
import { RNCamera } from "react-native-camera";
import QRCodeScanner from "react-native-qrcode-scanner";
import moment from "moment";
import BackgroundTimer from "react-native-background-timer";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const widthTwo = "90%";

class MergedLocationWithQRCode extends Component {
  watchId = null;
  constructor(props) {
    super(props);
    this.state = {
      userArray: [],
      detailsAfter: [],
      isMapReady: false,
      latitude: 0,
      longitude: 0,
      error: null,
      disableBtns: true,
      qrData: "",
      showData: false,
      showTime: false,
      serverTimeMob: moment(new Date(), "hh:mm:ss A").format("hh:mm:ss A"),
      sessionEndsOn: 0,
      showSpinner: true,
    };
  }

  async componentDidMount() {
    Geolocation.clearWatch(this.watchID);

    var value = await JSONData.storageGet("UserLoggedData");
    this.setState({ userArray: value[0] });

    //Active this, when I need to test on Emulator
    //this.getLocation();
  }

  getResult = async (actionResult, extraData) => {
    const results = await JSONData.getData(
      actionResult,
      this.state.userArray,
      extraData
    );
    //console.warn(results);
    if (results != undefined && results != false) {
      this.setState({
        detailsAfter: results[0],
        disableBtns: results[0].disableBtns === "true" ? true : false,
        sessionEndsOn: Number(results[0].sessionEndsOn),
        serverTimeMob: moment(results[0].serverTime, "hh:mm:ss A").format(
          "hh:mm:ss A"
        ),
        showTime: true,
        showSpinner: false,
      });

      BackgroundTimer.runBackgroundTimer(() => {
        let newTime = moment(this.state.serverTimeMob, "hh:mm:ss A")
          .add(1, "seconds")
          .format("hh:mm:ss A");

        let cc = this.state.sessionEndsOn - 1;
        if (cc <= 0) {
          Alert.alert(
            "??????????",
            "!?????????? ?????? ???????????? ?????? ??????????",
            [
              {
                text: "??????????",
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
    }
  };

  insertData = async (actionResult, extraData) => {
    const results = await JSONData.getData(
      actionResult,
      this.state.userArray,
      extraData
    );
    //console.warn(results);
    if (results) {
      this.props.navigation.goBack();
    } else {
      Toast.show({ text: "?????? ?????? ????.", type: "danger" });
    }
  };

  async areYouSure(actionResult, extraData, alertMSG) {
    await Alert.alert(
      "?????????????????? ????????????????",
      alertMSG,
      [
        {
          text: "????????????????",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "??????????????????",
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

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();
    if (!hasLocationPermission) return;

    this.watchID = Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        var coords =
          position.coords.latitude + ", " + position.coords.longitude;
        this.getResult("GetMachinesLocations", coords); //"31.985064, 35.897729"

        // this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
        //   this.setState({ lastPosition });
        //   console.warn(lastPosition);
        // });
      },
      (error) => {
        this.setState({ error: error });
        console.warn(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
        distanceFilter: 0,
        forceRequestLocation: true,
      }
    );
  };

  componentWillUnmount() {
    Geolocation.clearWatch(this.watchID);
  }

  showAlert() {
    var msg = "???????????? ????????????: " + this.state.detailsAfter.machineName;
    Alert.alert(
      "?????????????? ????????????",
      msg,
      [
        {
          text: "??????????",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
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
            <Title>{this.props.navigation.state.params.tabName}</Title>
          </Body>
          <Right>
            <Button
              style={{
                color: this.state.disableBtns ? "#607D8B" : "",
              }}
              activeOpacity={0.5}
              disabled={this.state.disableBtns}
              onPress={() => this.showAlert()}
              transparent
            >
              <Icon active name="pin" />
            </Button>
          </Right>
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
                      title={this.state.detailsAfter.machineName}
                    />
                  )}
                </MapView>
              </Row>
              <Row style={{ alignSelf: "center" }}>
                {this.state.showSpinner ? (
                  <Spinner color="#46639E" />
                ) : (
                  <View style={stylesLocal.nameBox}>
                    <Text
                      style={{
                        alignSelf: "center",
                        fontSize: 18,
                        fontWeight: "600",
                      }}
                    >
                      {"?????????????? ????????????????"}
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
                    <Text
                      style={{
                        alignSelf: "center",
                        fontSize: 10,
                        color: "green",
                      }}
                    >
                      {this.state.latitude + ", " + +this.state.longitude}
                    </Text>
                  </View>
                )}
              </Row>
              <Row style={{ width: "100%", padding: 10, justifyContent: "center" }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  disabled={this.state.disableBtns}
                  onPress={() =>
                    this.areYouSure(
                      "AttendanceByQRCodeScanner",
                      this.state.qrData + ",1",
                      "???? ?????? ?????????? ???? ?????????? ???????? ???????? ??"
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
                    <Text style={stylesLocal.info}>??????????????????????????</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.5}
                  disabled={this.state.disableBtns}
                  onPress={() =>
                    this.areYouSure(
                      "AttendanceByQRCodeScanner",
                      this.state.qrData + ",21",
                      "???? ?????? ?????????? ???? ?????????? ???????? ???????? ??"
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
                    <Text style={stylesLocal.info}>??????????????????????</Text>
                  </View>
                </TouchableOpacity>
              </Row>
              <Row style={{ width: "100%", padding: 10, justifyContent: "center" }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  disabled={this.state.disableBtns}
                  onPress={() =>
                    this.areYouSure(
                      "AttendanceByQRCodeScanner",
                      this.state.qrData + ",61",
                      "???? ?????? ?????????? ???? ?????????? ???????? ???????????????? ???????? ??"
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
                    <Text style={stylesLocal.info}>???????????????? ????????</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.5}
                  disabled={this.state.disableBtns}
                  onPress={() =>
                    this.areYouSure(
                      "AttendanceByQRCodeScanner",
                      this.state.qrData + ",41",
                      "???? ?????? ?????????? ???? ?????????? ?????????????????????????????????? ??"
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
                    <Text style={stylesLocal.info}>??????????????????????????</Text>
                  </View>
                </TouchableOpacity>
              </Row>
            </Grid>
          ) : (
            <QRCodeScanner
              onRead={this.onSuccess}
              flashMode={RNCamera.Constants.FlashMode.auto}
              showMarker={true}
              topContent={
                <Text style={stylesLocal.centerText}>
                  ?????????? ???????????? ?????????? ???? ???????? ????????????????
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
export default MergedLocationWithQRCode;
