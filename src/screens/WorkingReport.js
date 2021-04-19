import React, { Component } from "react";
import { I18nManager, StyleSheet, Dimensions } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Text,
  Left,
  Right,
  Body,
  View,
  Spinner,
  Grid,
  Row,
  Col,
  List,
} from "native-base";
import styles from "./styles";
import { API_LINK_PUBLIC } from "../exportsPublic";

const screenWidth = Dimensions.get("window").width;

class WorkingReport extends Component {
  constructor(props) {
    super(props);
    I18nManager.forceRTL(true);
    this.state = {
      Emp_ID: "",
      strDBName: "",
      tabName: "",
      results: {
        strEmployee: undefined,
        Names: undefined,
        Day: undefined,
        DateIN2: undefined,
        DateINTime2: undefined,
        DateOUTTime2: undefined,
        Diff1: undefined,
        DateOUTTime4: undefined,
        DateINTime4: undefined,
        Diff2: undefined,
        DateOUTTime7: undefined,
        DateINTime7: undefined,
        Diff3: undefined,
        Color: "",
      },
    };
  }

  componentDidMount() {
    this.getData();
  }
  getData() {
    var url =
      API_LINK_PUBLIC +
      "Home/GetDailyWorkingHoursData?userId=" +
      this.props.navigation.state.params.strEmployee +
      "&DbName=" +
      this.props.navigation.state.params.strDBName;
    return fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({ results: JSON.parse(responseData) });
        return responseData;
      })
      .catch((error) => console.warn(error));
  }
  reloadData() {
    this.getData();
  }

  getval(item) {
    if (item == "null" || item == "0") {
      return "معلقة";
    } else if (item == "1") {
      return "مقبولة";
    } else if (item == "2") {
      return "مرفوضة";
    }
  }
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
          <Right>
            <Button transparent onPress={() => this.reloadData()}>
              <Icon name="refresh" />
            </Button>
          </Right>
        </Header>
        <Content>
          {this.state.results.length > 0 ? ( // condition
            // if true
            <List
              dataArray={this.state.results}
              renderRow={(item) => (
                <Grid
                  style={[
                    stylesLocal.card,
                    {
                      borderColor:
                        "" + item.isFormalWorkApproved == "null" ||
                        item.isFormalWorkApproved == "0"
                          ? item.Color
                          : item.isFormalWorkApproved == "1"
                          ? "#32db64"
                          : "#E14343",
                    },
                  ]}
                >
                  <Row>
                    <Col style={{ width: screenWidth / 2 }}>
                      <Text
                        style={[stylesLocal.description, { color: item.Color }]}
                      >
                        {"التاريخ: " + item.DateIN2}
                      </Text>
                      <Row style={{ margin: 5, paddingTop: 5 }}>
                        <Col style={{ width: screenWidth / 4 }}>
                          <Text
                            style={[stylesLocal.date, { fontWeight: "bold" }]}
                          >
                            الدوام
                          </Text>
                        </Col>
                        <Col style={{ width: screenWidth / 3 }}>
                          <Text style={stylesLocal.date}>
                            {"من: " + item.DateINTime2}
                          </Text>
                        </Col>
                        <Col style={{ width: screenWidth / 3 }}>
                          <Text style={stylesLocal.date}>
                            {"الى: " + item.DateOUTTime2}
                          </Text>
                        </Col>
                      </Row>
                      <Row style={{ margin: 5 }}>
                        <Col style={{ width: screenWidth / 4 }}>
                          <Text
                            style={[stylesLocal.date, { fontWeight: "bold" }]}
                          >
                            الاستراحة
                          </Text>
                        </Col>
                        <Col style={{ width: screenWidth / 3 }}>
                          <Text style={stylesLocal.date}>
                            {"من: " + item.DateOUTTime7}
                          </Text>
                        </Col>
                        <Col style={{ width: screenWidth / 3 }}>
                          <Text style={stylesLocal.date}>
                            {"الى: " + item.DateINTime7}
                          </Text>
                        </Col>
                      </Row>
                      <Row style={{ margin: 5 }}>
                        <Col style={{ width: screenWidth / 4 }}>
                          <Text
                            style={[stylesLocal.date, { fontWeight: "bold" }]}
                          >
                            عمل رسمي
                          </Text>
                        </Col>
                        <Col style={{ width: screenWidth / 3 }}>
                          <Text style={stylesLocal.date}>
                            {"من: " + item.DateOUTTime4}
                          </Text>
                        </Col>
                        <Col style={{ width: screenWidth / 3 }}>
                          <Text style={stylesLocal.date}>
                            {"الى: " + item.DateINTime4}
                          </Text>
                        </Col>
                      </Row>
                      <Row style={{ margin: 5 }}>
                        <Col style={{ width: screenWidth }}>
                          <Text
                            style={[
                              stylesLocal.date,
                              {
                                color: "#2c3e50",
                                fontWeight: "600",
                                textAlign: "left",
                              },
                            ]}
                          >
                            {"" + item.strReasonAr == "null"
                              ? null
                              : "السبب: " +
                                item.strReasonAr +
                                "\n" +
                                item.strReasonAndDetails +
                                "\n" +
                                this.getval(item.isFormalWorkApproved) +
                                "\n"}
                          </Text>
                        </Col>
                      </Row>
                    </Col>
                    <Col style={{ width: screenWidth / 2 }}>
                      <Text
                        style={[stylesLocal.description, { color: item.Color }]}
                      >
                        {"اليوم: " + item.Day}
                      </Text>
                    </Col>
                  </Row>
                </Grid>
              )}
            />
          ) : (
            <View style={{ flex: 1, alignSelf: "center", margin: 50 }}>
              <Spinner color="#46639E" />
            </View>
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
  tasks: {
    flex: 1,
  },
  cardContent: {
    marginLeft: 20,
    marginTop: 10,
  },
  image: {
    width: 20,
    height: 20,
  },

  card: {
    shadowColor: "#00000021",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: "white",
    flexBasis: "46%",
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    borderLeftWidth: 6,
  },

  description: {
    fontSize: 18,
    flex: 1,
    color: "#2c3e50",
    fontWeight: "bold",
  },
  date: {
    fontSize: 15,
    flex: 1,
    color: "#696969",
    marginTop: 5,
  },
});

export default WorkingReport;
