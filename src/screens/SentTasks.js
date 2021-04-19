import React, { Component } from "react";
import { AsyncStorage, Dimensions } from "react-native";
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
  List,
  View,
  ListItem,
  Item,
  Input,
  Label,
  Picker,
  Row,
  Grid,
  Separator,
  Toast,
  Col,
} from "native-base";
import styles from "./styles";
import { API_LINK_PUBLIC } from "../exportsPublic";

const screenWidth = Dimensions.get("window").width;

class SentTasks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: "",
      tabName: "",
      day: "0",
      month: "0",
      year: "0",
      SentResults: {
        id: undefined,
        title: undefined,
        content: undefined,
        postponeNote: undefined,
        date: undefined,
        endDate: undefined,
        SenderName: undefined,
        ReaciverName: undefined,
        ManagerName: undefined,
        statusType: undefined,
      },
    };

    this.fillGottenData = this.fillGottenData.bind(this);
    this.getResults = this.getResults.bind(this);
    this.fillGottenData();
  }
  fillGottenData() {
    AsyncStorage.getItem("UserLoggedData").then((value) => {
      var data = JSON.parse(value);
      this.getResults(
        data[0].strEmployee,
        data[0].strDBName,
        this.state.searchText
      );
    });
  }
  async getResults(strEmployee, strDBName, searchText) {
    var databool = true;
    var yyyy = this.state.year;
    var MM = this.state.month;
    var dd = this.state.day;

    if (yyyy !== "0" && MM !== "0" && dd === "0") {
      databool = false;
      Toast.show({
        text: "الرجاء تحديد اليوم",
        buttonText: "Ok",
        type: "warn",
      });
    } else if (yyyy !== "0" && MM === "0" && dd !== "0") {
      databool = false;
      Toast.show({
        text: "الرجاء تحديد الشهر",
        buttonText: "Ok",
        type: "warn",
      });
    } else if (yyyy === "0" && MM !== "0" && dd !== "0") {
      databool = false;
      Toast.show({
        text: "الرجاء تحديد السنة",
        buttonText: "Ok",
        type: "warn",
      });
    } else if (
      (yyyy !== "0" && MM === "0" && dd === "0") ||
      (yyyy === "0" && MM !== "0" && dd === "0") ||
      (yyyy === "0" && MM === "0" && dd !== "0")
    ) {
      databool = false;
      Toast.show({
        text: "الرجاء تحديد السنة-الشهر-اليوم",
        buttonText: "Ok",
        type: "warn",
      });
    }

    if (databool === true) {
      try {
        var url =
          API_LINK_PUBLIC +  "Home/GetAllTasks?type=2&strEmployee=" +
          strEmployee +
          "&dbName=" +
          strDBName +
          "&searchText=" +
          searchText +
          "&searchDate=" +
          this.state.year +
          "/" +
          this.state.month +
          "/" +
          this.state.day;
        //console.warn(url);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        const responseData = await response.json();
        this.setState({ SentResults: JSON.parse(responseData) });
        return responseData;
      } catch (error) {
        return console.log(error);
      }
    }
  }
  reloadData() {
    this.setState({
      searchText: "",
      day: "0",
      month: "0",
      year: "0",
    });
    this.fillGottenData();
  }
  updateValues(text, field) {
    if (field === "textToSearch") {
      this.setState({
        searchText: text,
      });
    }
  }

  onValueDay(val) {
    this.setState({
      day: val,
    });
  }
  onValueMonth(val) {
    this.setState({
      month: val,
    });
  }
  onValueYear(val) {
    this.setState({
      year: val,
    });
  }
  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() =>
                this.props.navigation.navigate("Tasks", {
                  tabName: "المهمات",
                })
              }
            >
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

        <Content padder>
          <Grid style={{ flex: 1, margin: 2 }}>
            <Row>
              <Col>
                <Item regular style={{ width: screenWidth / 3.1 }}>
                  <Label>يوم</Label>
                  <Picker
                    mode="dropdown"
                    iosHeader="يوم"
                    selectedValue={this.state.day}
                    onValueChange={(value) => this.onValueDay(value)}
                  >
                    <Item label="0" value="0" />
                    <Item label="1" value="01" />
                    <Item label="2" value="02" />
                    <Item label="3" value="03" />
                    <Item label="4" value="04" />
                    <Item label="5" value="05" />
                    <Item label="6" value="06" />
                    <Item label="7" value="07" />
                    <Item label="8" value="08" />
                    <Item label="9" value="09" />
                    <Item label="10" value="10" />
                    <Item label="11" value="11" />
                    <Item label="12" value="12" />
                    <Item label="13" value="13" />
                    <Item label="14" value="14" />
                    <Item label="15" value="15" />
                    <Item label="16" value="16" />
                    <Item label="17" value="17" />
                    <Item label="18" value="18" />
                    <Item label="19" value="19" />
                    <Item label="20" value="20" />
                    <Item label="21" value="21" />
                    <Item label="22" value="22" />
                    <Item label="23" value="23" />
                    <Item label="24" value="24" />
                    <Item label="25" value="25" />
                    <Item label="26" value="26" />
                    <Item label="27" value="27" />
                    <Item label="28" value="28" />
                    <Item label="29" value="29" />
                    <Item label="30" value="30" />
                    <Item label="31" value="31" />
                  </Picker>
                </Item>
              </Col>
              <Col>
                <Item regular style={{ width: screenWidth / 3.1 }}>
                  <Label>شهر</Label>
                  <Picker
                    mode="dropdown"
                    iosHeader="شهر"
                    selectedValue={this.state.month}
                    onValueChange={(value) => this.onValueMonth(value)}
                  >
                    <Item label="0" value="0" />
                    <Item label="1" value="01" />
                    <Item label="2" value="02" />
                    <Item label="3" value="03" />
                    <Item label="4" value="04" />
                    <Item label="5" value="05" />
                    <Item label="6" value="06" />
                    <Item label="7" value="07" />
                    <Item label="8" value="08" />
                    <Item label="9" value="09" />
                    <Item label="10" value="10" />
                    <Item label="11" value="11" />
                    <Item label="12" value="12" />
                  </Picker>
                </Item>
              </Col>
              <Col>
                <Item regular style={{ width: screenWidth / 3.1 }}>
                  <Label>سنة</Label>
                  <Picker
                    mode="dropdown"
                    iosHeader="سنة"
                    selectedValue={this.state.year}
                    onValueChange={(value) => this.onValueYear(value)}
                  >
                    <Item label="0" value="0" />
                    <Item label="2019" value="2019" />
                    <Item label="2020" value="2020" />
                  </Picker>
                </Item>
              </Col>
            </Row>
            <Row style={{ alignSelf: "center" }}>
              <Col>
                <Item regular>
                  <Icon active name="search" />
                  <Input
                    style={{ textAlign: "right", width: screenWidth / 1.1 }}
                    onChangeText={(text) =>
                      this.updateValues(text, "textToSearch")
                    }
                    placeholder="بحث..."
                  />
                  <Button
                    style={{ marginTop: 2 }}
                    onPress={() => this.fillGottenData()}
                  >
                    <Text>ابحث</Text>
                  </Button>
                </Item>
              </Col>
            </Row>
          </Grid>

          <Separator bordered noTopBorder style={{ marginTop: 5 }} />
          <View style={{ marginTop: 10 }} />
          {this.state.SentResults.length > 0 ? ( // condition
            // if true
            <List
              dataArray={this.state.SentResults}
              renderRow={(data) => (
                <ListItem
                  button
                  onPress={() =>
                    this.props.navigation.navigate("TaskDetails", {
                      tabName: "تفاصيل المهمة",
                      SentResults: data,
                      bDeleteBtn: true,
                    })
                  }
                >
                  <Left>
                    <Text>{"مستلم المهمة: " + data.ReaciverName}</Text>
                  </Left>
                  <Right>
                    <Icon name="arrow-back" />
                  </Right>
                </ListItem>
              )}
            />
          ) : (
            <View style={{ flex: 1, alignSelf: "center", margin: 50 }}>
              <Text style={{ color: "gray" }}>لا يوجد مهمات</Text>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

export default SentTasks;
