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
} from "native-base";
import { StyleSheet, Text, Alert, Dimensions } from "react-native";
import * as JSONData from "../../exportsPublic";
import { RNCamera } from "react-native-camera";
import QRCodeScanner from "react-native-qrcode-scanner";
import moment from "moment";
import BackgroundTimer from "react-native-background-timer";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const widthTwo = "90%";

class QRCodeDataScanner extends Component {
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
    };
  }

  async componentDidMount() {
    var value = await JSONData.storageGet("UserLoggedData");
    this.setState({ userArray: value[0] });
  }

  insertData = async (actionResult, extraData) => {
    const results = await JSONData.getData(
      actionResult,
      this.state.userArray,
      extraData
    );
    //console.warn(results);
    if (results) {
      Toast.show({ text: "تم الحفظ", type: "success", duration: 5000 });
      this.props.navigation.goBack();
    } else {
      Toast.show({ text: "حدث خطأ ما.", type: "danger", duration: 5000 });
    }
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

  checkQRCode = async (data) => {
    await JSONData.getData("ScanQRCodeData", this.state.userArray, data).then(
      (value) => {
        if (value != undefined && value != false) {
          this.setState({ qrData: data, showData: true });
          this.setState({
            detailsAfter: value[0],
            disableBtns: false,
            sessionEndsOn: Number(value[0].sessionEndsOn),
            serverTimeMob: moment(value[0].serverTime, "hh:mm:ss A").format(
              "hh:mm:ss A"
            ),
            showTime: true,
          });

          BackgroundTimer.runBackgroundTimer(() => {
            let newTime = moment(this.state.serverTimeMob, "hh:mm:ss A")
              .add(1, "seconds")
              .format("hh:mm:ss A");
    
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
        } else {
          Toast.show({
            text: "هذا الكود غير فعَال!",
            type: "danger",
            buttonText: "Ok",
            duration: 5000,
          });
          this.props.navigation.goBack();
        }
      }
    );
  };

  showAlert() {
    var msg = "الفرع الحالي: " + this.state.detailsAfter.strMachineAr;

    Alert.alert(
      "معلومات الفرع",
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
  }

  onSuccess = (e) => {
    //console.warn(e);
    this.checkQRCode(e.data);
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
              <Icon active name="map" />
            </Button>
          </Right>
        </Header>
        <Content>
          {this.state.showData ? (
            <Grid>
              <Row style={{ alignSelf: "center" }}>
                <View style={stylesLocal.nameBox}>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 18,
                      fontWeight: "600",
                    }}
                  >
                    {"ســـاعة الختـــم"}{" "}
                    {this.state.showTime
                      ? this.state.serverTimeMob
                      : "00:00:00"}
                  </Text>

                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 12,
                      fontWeight: "600",
                      color: "#fac125",
                    }}
                  >
                    {"\nالكود فعال لـ " + this.state.sessionEndsOn + " ثانية."}
                  </Text>
                </View>
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
                        : "#E14343",
                    }}
                    activeOpacity={0.5}
                    disabled={this.state.disableBtns}
                    onPress={() =>
                      this.areYouSure(
                        "TransactionAfterCheckingQRCodeData",
                        this.state.qrData + ",1",
                        "هل أنت متأكد من تسجيل حركة خروج ؟"
                      )
                    }
                  >
                    <Icon active name="home" />
                    <Text style={stylesLocal.buttonText}>دخـــــــــول</Text>
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
                        : "#fac125",
                    }}
                    activeOpacity={0.5}
                    disabled={this.state.disableBtns}
                    onPress={() =>
                      this.areYouSure(
                        "TransactionAfterCheckingQRCodeData",
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
                        "TransactionAfterCheckingQRCodeData",
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
                        "TransactionAfterCheckingQRCodeData",
                        this.state.qrData + ",41",
                        "هل أنت متأكد من تسجيل حركةاســــــتراحة ؟"
                      )
                    }
                  >
                    <Icon active name="pizza" />
                    <Text style={stylesLocal.buttonText}>اســــــتراحة</Text>
                  </Button>
                </Col>
              </Row>
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
    height: screenHeight / 6,
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
  buttons: { width: "95%", marginLeft: 5, marginBottom: 5 },
  buttonText: {
    textAlign: "right",
    padding: 10,
    fontSize: 21,
    color: "#fff",
  },
  tasks: {
    flex: 1,
  },
  cardContent: {
    marginLeft: 20,
    marginTop: 10,
  },
  image: {
    width: 25,
    height: 25,
  },
  card: {
    shadowColor: "#00000021",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    marginVertical: 5,
    marginHorizontal: 8,
    backgroundColor: "white",
    flexBasis: "46%",
    padding: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    borderLeftWidth: 5,
    alignItems: "center",
  },
  description: {
    fontSize: 20,
    flex: 1,
    fontWeight: "bold",
    color: "#2c3e50",
    alignSelf: "flex-start",
  },
  date: {
    fontSize: 15,
    flex: 1,
    color: "#696969",
    marginTop: 5,
  },
});
export default QRCodeDataScanner;
