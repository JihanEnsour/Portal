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
  Item,
  Toast,
} from "native-base";
import { StyleSheet, Dimensions, Text, View } from "react-native";
import * as JsonData from "../../exportsPublic";
const screenWidth = Dimensions.get("window").width;

class approveMyDeptWorkCorrection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
   // console.warn(this.props.navigation.state.params.itemPressed);
  }

  ApproveOrNot(vall) {
    var data =
      vall +
      "," +
      this.props.navigation.state.params.itemPressed.lngEmployee +
      "," +
      this.props.navigation.state.params.itemPressed.lngSerial +
      "," +
      this.props.navigation.state.params.itemPressed.byteSequence +
      "," +
      this.props.navigation.state.params.itemPressed.strDBName;

    JsonData.getData(
      "SPAcceptOrRejectThe",
      this.props.navigation.state.params.userArray,
      data
    ).then((results) => {
      //console.warn(results);
      if (results === true || results === "true") {
        Toast.show({
          text: "تم الحفظ",
          type: "success",
          duration: 5000,
        });
        this.props.navigation.navigate("workCorrectionHome");      
      } else {
        Toast.show({ text: "حدث خطأ ما.", type: "danger", duration: 5000 });
      }
    });
  }

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
            <Title>{"تصحيح الخطأ"}</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={[stylesLocal.card, { borderColor: "#f53d3d" }]}>
            <View style={stylesLocal.cardContent}>
              <Text style={[stylesLocal.description]}>
                {"الموظف: " +
                  this.props.navigation.state.params.itemPressed.strNameAr}
                {"\n"}
                {"التاريخ: " +
                  this.props.navigation.state.params.itemPressed.dateIs}
                {"\n"}
                {"اليوم: " + this.props.navigation.state.params.itemPressed.Day}
                {"\n"}
                {"السبب: " +
                  this.props.navigation.state.params.itemPressed.strReasonAr}
                {"\n"}
                {
                  this.props.navigation.state.params.itemPressed
                    .strReasonAndDetails
                }
                {"\n"}
              </Text>
            </View>
          </View>

          <Grid style={[stylesLocal.card, { borderColor: "#46639E" }]}>
            <Row style={{ marginTop: 10, width: screenWidth }}>
              <Col style={{ width: screenWidth }}>
                <Row style={{ margin: 5, paddingTop: 5 }}>
                  <Col style={{ width: screenWidth / 4 }}>
                    <Text style={[stylesLocal.date, { fontWeight: "bold" }]}>
                      الدوام
                    </Text>
                  </Col>
                  <Col style={{ width: screenWidth / 3 }}>
                    <Text style={stylesLocal.description}>
                      {"من: " +
                        (this.props.navigation.state.params.itemPressed
                          .DateINTime2 == undefined
                          ? ""
                          : this.props.navigation.state.params.itemPressed
                              .DateINTime2)}
                    </Text>
                  </Col>
                  <Col style={{ width: screenWidth / 3 }}>
                    <Text style={stylesLocal.description}>
                      {"الى: " +
                        (this.props.navigation.state.params.itemPressed
                          .DateOutTime2 == undefined
                          ? ""
                          : this.props.navigation.state.params.itemPressed
                              .DateOutTime2)}
                    </Text>
                  </Col>
                </Row>
                <Row style={{ margin: 5 }}>
                  <Col style={{ width: screenWidth / 4 }}>
                    <Text style={[stylesLocal.date, { fontWeight: "bold" }]}>
                      الاستراحة
                    </Text>
                  </Col>
                  <Col style={{ width: screenWidth / 3 }}>
                    <Text style={stylesLocal.description}>
                      {"من: " +
                        (this.props.navigation.state.params.itemPressed
                          .DateOutTime7 == undefined
                          ? ""
                          : this.props.navigation.state.params.itemPressed
                              .DateOutTime7)}
                    </Text>
                  </Col>
                  <Col style={{ width: screenWidth / 3 }}>
                    <Text style={stylesLocal.description}>
                      {"الى: " +
                        (this.props.navigation.state.params.itemPressed
                          .DateINTime7 == undefined
                          ? ""
                          : this.props.navigation.state.params.itemPressed
                              .DateINTime7)}
                    </Text>
                  </Col>
                </Row>
                <Row style={{ margin: 5 }}>
                  <Col style={{ width: screenWidth / 4 }}>
                    <Text style={[stylesLocal.date, { fontWeight: "bold" }]}>
                      عمل رسمي
                    </Text>
                  </Col>
                  <Col style={{ width: screenWidth / 3 }}>
                    <Text style={stylesLocal.description}>
                      {"من: " +
                        (this.props.navigation.state.params.itemPressed
                          .DateINTime4 == undefined
                          ? ""
                          : this.props.navigation.state.params.itemPressed
                              .DateINTime4)}
                    </Text>
                  </Col>
                  <Col style={{ width: screenWidth / 3 }}>
                    <Text style={stylesLocal.description}>
                      {"الى: " +
                        (this.props.navigation.state.params.itemPressed
                          .DateOutTime4 == undefined
                          ? ""
                          : this.props.navigation.state.params.itemPressed
                              .DateOutTime4)}
                    </Text>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Grid>

          <View style={[stylesLocal.card, { borderColor: "#f53d3d" }]}>
            <View style={stylesLocal.cardContent}>
              <Text style={[stylesLocal.description]}>
                {"الرجـاء قبول أو رفض هذة الحركة للموظف"}
              </Text>
            </View>
            <Item inlineLabel>
              <Button
                success
                onPress={() => this.ApproveOrNot(1)}
                style={{ justifyContent: "flex-start", margin: 8, padding: 20 }}
              >
                <Text style={{ color: "#FFF", fontWeight: "600" }}>
                  قـبـــول
                </Text>
              </Button>
              <Button
                danger
                onPress={() => this.ApproveOrNot(2)}
                style={{ justifyContent: "flex-start", margin: 8, padding: 20 }}
              >
                <Text style={{ color: "#FFF", fontWeight: "600" }}>رفـــض</Text>
              </Button>
            </Item>
          </View>
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
  tasks: {
    flex: 1,
    marginTop: 10,
  },
  cardContent: {
    marginLeft: 20,
    marginTop: 10,
  },
  image: {
    width: 20,
    height: 20,
  },
  buttonText: {
    textAlign: "right",
    padding: 10,
    fontSize: 15,
    color: "#fff",
  },
  card: {
    shadowColor: "#00000021",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    borderColor: "#46639E",
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: "white",
    flexBasis: "46%",
    padding: 3,
    flexDirection: "row",
    flexWrap: "wrap",
    borderLeftWidth: 6,
  },

  description: {
    fontSize: 17,
    flex: 1,
    color: "#2c3e50",
    fontWeight: "bold",
    textAlign: "left",
  },
  date: {
    textAlign: "left",
    fontSize: 15,
    flex: 1,
    color: "#696969",
    marginTop: 5,
  },
});

export default approveMyDeptWorkCorrection;
