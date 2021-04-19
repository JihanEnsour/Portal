import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Text,
  Left,
  Body,
  Right,
  Grid,
  Row,
  Col,
} from "native-base";
import { StyleSheet, AsyncStorage } from "react-native";
import styles from "./styles";
import * as JSONData from "../exportsPublic";

const widthOne = "50%";
const widthTwo = "50%";

class Vacations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userArray: [],
      Table1: [],

      Patient: [],
      Consumer: [],
      Leaving: [],
      SumPatient: "",
    };
  }
  async componentDidMount() {
    this.getData();
  }
  async getData() {
    await AsyncStorage.getItem("UserLoggedData").then((value) => {
      const data = JSON.parse(value);
      this.setState({ userArray: data[0] });

      JSONData.getData("VacationsDetails", data[0], "VacationsDetails").then(
        (values) => {
          console.warn(values);
          this.setState({
            Table1: values.Table1[0],
            Consumer: values.Table2.filter((item) => item.Types === "Consumer"),
            Leaving: values.Table2.filter((item) => item.Types === "Leaving"),
            Patient: values.Table2.filter((item) => item.Types === "Patient"),
            SumPatient:
              values.Table3.length > 0 ? values.Table3[0].VacationCount : 0,
          });
          // const statusActiveArr = values.Table2.filter(item => item.Types === "Consumer");

          console.warn(this.state.SumPatient);
        }
      );
    });
  }
  reloadData() {
    this.getData();
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
          <Grid>
            <Row style={[stylesLocal.card, { borderColor: "#E14343" }]}>
              <Col style={{ width: "100%" }}>
                <Text style={[stylesLocal.description]}>
                  {this.state.Table1.Msg}
                </Text>
              </Col>
            </Row>
            <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
              <Col style={{ width: widthOne }}>
                <Text style={[stylesLocal.description]}>
                  {"الرصيد الافتتاحي"}
                </Text>
              </Col>
              <Col style={{ width: widthTwo }}>
                <Text style={[stylesLocal.description]}>
                  {this.state.Table1.sngOpenBalance}
                </Text>
              </Col>
            </Row>
            <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
              <Col style={{ width: widthOne }}>
                <Text style={[stylesLocal.description]}>
                  {"مستحق هذا العام"}
                </Text>
              </Col>
              <Col style={{ width: widthTwo }}>
                <Text style={[stylesLocal.description]}>
                  {this.state.Table1.Deservethisyear}
                </Text>
              </Col>
            </Row>
            <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
              <Col style={{ width: widthOne }}>
                <Text style={[stylesLocal.description]}>{"أيام إضافية"}</Text>
              </Col>
              <Col style={{ width: widthTwo }}>
                <Text style={[stylesLocal.description]}>
                  {this.state.Table1.ExtraDay}
                </Text>
              </Col>
            </Row>
            <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
              <Col style={{ width: widthOne }}>
                <Text style={[stylesLocal.description]}>{"رصيد الفترة"}</Text>
              </Col>
              <Col style={{ width: widthTwo }}>
                <Text style={[stylesLocal.description]}>
                  {this.state.Table1.PeriodBalance}
                </Text>
              </Col>
            </Row>
            <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
              <Col style={{ width: widthOne }}>
                <Text style={[stylesLocal.description]}>{"الرصيد العام"}</Text>
              </Col>
              <Col style={{ width: widthTwo }}>
                <Text style={[stylesLocal.description]}>
                  {this.state.Table1.GeneralBalance}
                </Text>
              </Col>
            </Row>
            <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
              <Col style={{ width: widthOne }}>
                <Text style={[stylesLocal.description]}>{"الرصيد المرضي"}</Text>
              </Col>
              <Col style={{ width: widthTwo }}>
                <Text style={[stylesLocal.description]}>
                  {this.state.Table1.Disease}
                </Text>
              </Col>
            </Row>
            <Row style={[stylesLocal.card, { borderColor: "#4CDA64" }]}>
              <Col style={{ width: widthOne, paddingTop: 8 }}>
                <Text style={[stylesLocal.description]}>
                  {"المستهلك / سنوي"}
                </Text>
              </Col>
              <Col style={{ width: "30%", paddingTop: 8 }}>
                <Text style={[stylesLocal.description]}>
                  {this.state.Table1.Consumer}
                </Text>
              </Col>
              <Col style={{ width: "20%" }}>
                <Button
                  onPress={() =>
                    this.props.navigation.navigate("vacatonsDetails", {
                      RecievedResults: this.state.Consumer,
                      tabName: "المستهلك / سنوي",
                      type: "1", //date
                    })
                  }
                >
                  <Icon name="arrow-back" />
                </Button>
              </Col>
            </Row>
            <Row style={[stylesLocal.card, { borderColor: "#4CDA64" }]}>
              <Col style={{ width: widthOne, paddingTop: 8 }}>
                <Text style={[stylesLocal.description]}>
                  {"المستهلك / مرضي"}
                </Text>
              </Col>
              <Col style={{ width: "30%", paddingTop: 8 }}>
                <Text style={[stylesLocal.description]}>
                  {this.state.SumPatient}
                </Text>
              </Col>
              <Col style={{ width: "20%" }}>
                <Button
                  onPress={() =>
                    this.props.navigation.navigate("vacatonsDetails", {
                      RecievedResults: this.state.Patient,
                      tabName: "المستهلك / مرضي",
                      type: "1", //date
                    })
                  }
                >
                  <Icon name="arrow-back" />
                </Button>
              </Col>
            </Row>
            <Row style={[stylesLocal.card, { borderColor: "#4CDA64" }]}>
              <Col style={{ width: widthOne, paddingTop: 8 }}>
                <Text style={[stylesLocal.description]}>
                  {"مجموع المغادرات"}
                </Text>
              </Col>
              <Col style={{ width: "30%", paddingTop: 8 }}>
                <Text style={[stylesLocal.description]}>
                  {this.state.Table1.Leaving}
                </Text>
              </Col>
              <Col style={{ width: "20%" }}>
                <Button
                  onPress={() =>
                    this.props.navigation.navigate("vacatonsDetails", {
                      RecievedResults: this.state.Leaving,
                      tabName: "مجموع المغادرات",
                      type: "2", //time
                    })
                  }
                >
                  <Icon name="arrow-back" />
                </Button>
              </Col>
            </Row>
          </Grid>
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
    width: 25,
    height: 25,
  },

  card: {
    shadowColor: "#00000021",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: "white",
    flexBasis: "46%",
    padding: 7,
    flexDirection: "row",
    flexWrap: "wrap",
    borderLeftWidth: 6,
  },

  description: {
    fontSize: 16,
    flex: 1,
    color: "#2c3e50",
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  date: {
    fontSize: 15,
    flex: 1,
    color: "#696969",
    marginTop: 5,
  },
});

export default Vacations;
