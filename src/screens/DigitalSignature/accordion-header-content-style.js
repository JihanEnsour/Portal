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
  Row,
  Col,
  Grid,
  Toast,
} from "native-base";
import { StyleSheet, Text } from "react-native";
import { RNCamera } from "react-native-camera";
import QRCodeScanner from "react-native-qrcode-scanner";
import * as JSONData from "../../exportsPublic";

class AccordionHeaderContentStyle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userArray: [],
      qrData: "",
      showData: false,
    };
  }
  async componentDidMount() {
    var value = await JSONData.storageGet("UserLoggedData");
    this.setState({ userArray: value[0] });
    //console.warn("here: " + this.state.userArray.strName);
  }

  getResult = async (actionResult, extraData) => {
    const results = await JSONData.getData(
      actionResult,
      this.state.userArray,
      extraData
    );
    console.warn(results);
    if (results) {
      Toast.show({ text: "تم الحفظ.", type: "success" });
      this.props.navigation.goBack();
    } else {
      Toast.show({ text: "حدث خطأ ما.", type: "danger" });
    }
  };

  onSuccess = (e) => {
    //console.warn(e);
    this.setState({ qrData: e.data, showData: true });
  };

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-forward" />
            </Button>
          </Left>
          <Body>
            <Title>{this.props.navigation.state.params.tabName}</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          {this.state.showData ? (
            <Grid style={{ paddingTop: 20, width: "100%" }}>
              <Row>
                <Col>
                  <Text style={[styles.centerText, { width: "100%" }]}>
                    {this.state.qrData.split(",")[0]}
                  </Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    style={styles.buttons}
                    danger
                    iconLeft
                    onPress={() =>
                      this.getResult(
                        "AttendanceByQRCodeScanner",
                        this.state.qrData + ",1"
                      )
                    }
                  >
                    <Icon active name="home" />
                    <Text style={styles.buttonText}>دخـــول</Text>
                  </Button>
                </Col>
                <Col>
                  <Button
                    warning
                    iconLeft
                    style={styles.buttons}
                    onPress={() =>
                      this.getResult(
                        "AttendanceByQRCodeScanner",
                        this.state.qrData + ",21"
                      )
                    }
                  >
                    <Icon active name="log-out" />
                    <Text style={styles.buttonText}>خـــروج</Text>
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    style={styles.buttons}
                    info
                    iconLeft
                    onPress={() =>
                      this.getResult(
                        "AttendanceByQRCodeScanner",
                        this.state.qrData + ",61"
                      )
                    }
                  >
                    <Icon active name="paper" />
                    <Text style={styles.buttonText}>عمـــل رسمي</Text>
                  </Button>
                </Col>
                <Col>
                  <Button
                    style={styles.buttons}
                    success
                    iconLeft
                    onPress={() =>
                      this.getResult(
                        "AttendanceByQRCodeScanner",
                        this.state.qrData + ",41"
                      )
                    }
                  >
                    <Icon active name="pizza" />
                    <Text style={styles.buttonText}>اســــتراحة</Text>
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
                <Text style={styles.centerText}>
                  قراءة الباركود عن طريق كاميرا الهاتف لتسجيل حركات الدوام
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
const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 35,
    fontWeight: "500",
    color: "#000",
  },
  buttons: { width: "95%", marginLeft: 5, marginBottom: 5 },
  buttonText: {
    textAlign: "right",
    padding: 10,
    fontSize: 21,
    color: "#fff",
  },
});
export default AccordionHeaderContentStyle;
