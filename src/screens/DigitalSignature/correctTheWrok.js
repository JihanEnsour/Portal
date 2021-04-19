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
  Picker,
  Textarea,
  Item,
  Label,
  Spinner,
  Input,
} from "native-base";
import { StyleSheet, Dimensions, Text } from "react-native";
import * as JsonData from "../../exportsPublic";
const screenWidth = Dimensions.get("window").width;

export default class correctTheWrok extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenReason: "",
      isOtherChosen: false,
      showSpinner: false,
      strReason: "",
      manager: "0",
      time: "AM",
      timeText: "",
    };
  }

  afterChecking() {
    if (this.state.manager != "0") {
      var data =
        this.props.navigation.state.params.itemPressed.lngEmployee +
        "," +
        this.props.navigation.state.params.itemPressed.lngSerial +
        "," +
        this.props.navigation.state.params.itemPressed.byteSequence +
        "," +
        this.state.chosenReason +
        "," +
        this.state.time +
        " " +
        this.state.timeText +
        " " +
        this.state.strReason +
        "," +
        this.state.manager;

      this.setState({ showSpinner: true });
      JsonData.getData(
        "SPUpdateReasonOfWrongTime",
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
          //this.props.navigation.goBack();
          this.props.navigation.navigate("workCorrectionHome", {
            tabName: "تصحيح الدوام",
          });
        } else {
          Toast.show({ text: "حدث خطأ ما.", type: "danger", duration: 5000 });
        }
      });
    } else {
      Toast.show({
        text: "يرجى إختيار المدير!",
        buttonText: "Ok",
        type: "danger",
      });
    }
  }

  updateReason() {
    if (this.state.chosenReason !== "") {
      if (
        this.state.chosenReason != 9 ||
        (this.state.chosenReason == 9 && this.state.strReason != "")
      ) {
        this.afterChecking();
      } else {
        Toast.show({
          text: "الرجاء كتابة السبب بخانة ما هو السبب",
          type: "danger",
          duration: 8000,
        });
      }
    } else {
      Toast.show({
        text: "الرجاء اختيار السبب",
        type: "danger",
        duration: 5000,
      });
    }
  }

  async onValueChange(value) {
    await this.setState({
      chosenReason: value,
      isOtherChosen: value == 9 ? true : false,
    });
  }
  getItems = () => {
    var items = [];
    var gotItems = this.props.navigation.state.params.Table3;
    items.push(<Picker.Item key="0" value="0" label="-- اختر السبب --" />);
    for (var i = 0; i < gotItems.length; i++) {
      items.push(
        <Picker.Item
          key={gotItems[i].value}
          value={gotItems[i].value}
          label={gotItems[i].label}
        />
      );
    }
    return items;
  };
  updateValues(text, field) {
    if (field === "reasonTxt") {
      this.setState({
        strReason: text,
      });
    } else if (field === "time") {
      this.setState({
        timeText: text,
      });
    }
  }
  getItemsTwo() {
    var items = [];
    var gotItems = this.props.navigation.state.params.Table5;
    //console.warn(gotItems);
    for (var i = 0; i < gotItems.length; i++) {
      items.push(
        <Picker.Item
          key={gotItems[i].value}
          value={gotItems[i].value}
          label={gotItems[i].label}
        />
      );
    }
    return items;
  }
  returnOneItem(value) {
    var item = "";
    var gotItems = this.props.navigation.state.params.Table5;
    for (var i = 0; i < gotItems.length; i++) {
      if (gotItems[i].value === value) {
        item = gotItems[i].value + "_" + gotItems[i].label;
      }
    }
    //console.warn(item);
    return item;
  }

  onValueChangeTwo(value) {
    var data = this.returnOneItem(value);
    //console.warn(data);
    this.setState({
      manager: value,
    });

    // console.warn(this.state.manager.split("_")[1]);
  }
  onTimeChange(value) {
    //console.warn(value);
    this.setState({
      time: value,
    });

    // console.warn(this.state.manager.split("_")[1]);
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
          <Grid style={[stylesLocal.card, { borderColor: "#46639E" }]}>
            <Row style={{ marginTop: 10, width: screenWidth }}>
              <Col style={{ width: screenWidth }}>
                <Text
                  selectable
                  style={[stylesLocal.description, { color: "#46639E" }]}
                >
                  {"التاريخ: " +
                    this.props.navigation.state.params.itemPressed.dateIs}
                  {"\n"}
                  {"اليوم: " +
                    this.props.navigation.state.params.itemPressed.Day}
                </Text>
                <Row style={{ margin: 5, paddingTop: 5 }}>
                  <Col style={{ width: screenWidth / 4 }}>
                    <Text
                      selectable
                      style={[stylesLocal.date, { fontWeight: "bold" }]}
                    >
                      الدوام
                    </Text>
                  </Col>
                  <Col style={{ width: screenWidth / 3 }}>
                    <Text selectable style={stylesLocal.date}>
                      {"من: " +
                        this.props.navigation.state.params.itemPressed
                          .DateINTime2}
                    </Text>
                  </Col>
                  <Col style={{ width: screenWidth / 3 }}>
                    <Text selectable style={stylesLocal.date}>
                      {"الى: " +
                        this.props.navigation.state.params.itemPressed
                          .DateOUTTime2}
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
                    <Text style={stylesLocal.date}>
                      {"من: " +
                        this.props.navigation.state.params.itemPressed
                          .DateOUTTime7}
                    </Text>
                  </Col>
                  <Col style={{ width: screenWidth / 3 }}>
                    <Text selectable style={stylesLocal.date}>
                      {"الى: " +
                        this.props.navigation.state.params.itemPressed
                          .DateINTime7}
                    </Text>
                  </Col>
                </Row>
                <Row style={{ margin: 5 }}>
                  <Col style={{ width: screenWidth / 4 }}>
                    <Text
                      selectable
                      style={[stylesLocal.date, { fontWeight: "bold" }]}
                    >
                      عمل رسمي
                    </Text>
                  </Col>
                  <Col style={{ width: screenWidth / 3 }}>
                    <Text selectable style={stylesLocal.date}>
                      {"من: " +
                        this.props.navigation.state.params.itemPressed
                          .DateOUTTime4}
                    </Text>
                  </Col>
                  <Col style={{ width: screenWidth / 3 }}>
                    <Text style={stylesLocal.date}>
                      {"الى: " +
                        this.props.navigation.state.params.itemPressed
                          .DateINTime4}
                    </Text>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Grid>

          <Grid>
            <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
              <Col style={{ width: "100%" }}>
                <Item regular>
                  <Label>المدير</Label>
                  <Picker
                    mode="dropdown"
                    iosHeader={<Icon name="ios-arrow-down" />}
                    style={{
                      flex: 1,
                      paddingBottom: 10,
                    }}
                    textStyle={{ textAlign: "center", alignSelf: "flex-end" }}
                    itemStyle={{
                      marginLeft: 0,
                      paddingLeft: 10,
                    }}
                    selectedValue={this.state.manager}
                    onValueChange={(value) => this.onValueChangeTwo(value)}
                  >
                    {this.getItemsTwo()}
                  </Picker>
                </Item>
              </Col>
            </Row>
            <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
              <Col style={{ width: "100%" }}>
                <Item regular>
                  {/* <Label>الوقت</Label> */}
                  <Input
                    style={{
                      textAlign: "right",
                      borderWidth: 2,
                      borderColor: "#46639E",
                    }}
                    onChangeText={(text) => this.updateValues(text, "time")}
                    placeholder="اكتب الوقت"
                  />
                  <Picker
                    mode="dropdown"
                    iosHeader={<Icon name="ios-arrow-down" />}
                    style={{
                      flex: 1,
                      paddingBottom: 10,
                    }}
                    textStyle={{ textAlign: "center", alignSelf: "center" }}
                    itemStyle={{
                      marginLeft: 0,
                      paddingLeft: 10,
                    }}
                    selectedValue={this.state.time}
                    onValueChange={(value) => this.onTimeChange(value)}
                  >
                    <Item label="AM" value="AM" />
                    <Item label="PM" value="PM" />
                  </Picker>
                </Item>
              </Col>
            </Row>
            <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
              <Col style={{ width: screenWidth / 2.5 }}>
                <Row
                  style={{
                    marginTop: 15,
                    width: screenWidth / 1.25,
                  }}
                >
                  <Text style={[stylesLocal.description, { color: "#46639E" }]}>
                    {"الرجاء إختيار ســبب الخطأ:"}
                  </Text>
                </Row>
                <Row>
                  <Col style={{ width: screenWidth, paddingTop: 10 }}>
                    <Picker
                      mode="dropdown"
                      iosHeader={<Icon name="ios-arrow-down" />}
                      placeholder="السبب"
                      style={{
                        flex: 1,
                        paddingBottom: 10,
                        border: 1,
                        color: "#000",
                      }}
                      textStyle={{ textAlign: "center", alignSelf: "flex-end" }}
                      itemStyle={{
                        marginLeft: 0,
                        paddingLeft: 10,
                      }}
                      selectedValue={this.state.chosenReason}
                      onValueChange={(value) => this.onValueChange(value)}
                    >
                      {this.getItems()}
                    </Picker>
                  </Col>
                </Row>
                {this.state.isOtherChosen ? (
                  <Row>
                    <Col
                      style={{
                        width: screenWidth / 1.25,
                        paddingTop: 10,
                        color: "#000",
                      }}
                    >
                      <Textarea
                        style={{ textAlign: "right", alignSelf: "flex-start" }}
                        rowSpan={5}
                        onChangeText={(text) =>
                          this.updateValues(text, "reasonTxt")
                        }
                        placeholder="ما هو السبب"
                      />
                    </Col>
                  </Row>
                ) : null}

                <Row>
                  <Col style={{ width: screenWidth, paddingTop: 10 }}>
                    <Button
                      danger
                      style={{
                        margin: 8,
                        width: screenWidth / 1.25,
                      }}
                      onPress={() => this.updateReason()}
                    >
                      <Icon active name="send" />
                      <Text style={stylesLocal.buttonText}>
                        إرســــال الســــبب
                      </Text>
                      {this.state.showSpinner ? <Spinner color="#FFF" /> : null}
                    </Button>
                  </Col>
                </Row>
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
    padding: 7,
    flexDirection: "row",
    flexWrap: "wrap",
    borderLeftWidth: 6,
  },

  description: {
    paddingRight: 10,
    fontSize: 17,
    flex: 1,
    color: "#2c3e50",
    fontWeight: "bold",
    textAlign: "left",
  },
  date: {
    textAlign: "left",
    fontSize: 15.5,
    fontWeight: "bold",
    flex: 1,
    color: "#000",
    marginTop: 5,
  },
});
