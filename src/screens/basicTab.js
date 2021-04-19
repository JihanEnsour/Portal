import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Button,
  Icon,
  Tabs,
  Tab,
  Right,
  Left,
  Body,
  Content,
  Accordion,
  View,
  Text
} from "native-base";
import { AsyncStorage } from "react-native";
import { API_LINK_PUBLIC } from "../exportsPublic";

class BasicTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabName: "",
      strEmployee: "",
      strDBName: "",
      RecievedResults: {
        id: undefined,
        title: undefined,
        content: undefined,
        date: undefined,
        strName: undefined,
        statusType: undefined
      },
      SentResults: {
        id: undefined,
        title: undefined,
        content: undefined,
        date: undefined,
        strName: undefined,
        statusType: undefined
      },
      MangerResults: {
        id: undefined,
        title: undefined,
        content: undefined,
        date: undefined,
        strName: undefined,
        statusType: undefined
      },
    };

    this.fillGottenData = this.fillGottenData.bind(this);
    this.getRecievedResults = this.getRecievedResults.bind(this);
    this.getSentResults = this.getSentResults.bind(this);
    this.getMangerResults = this.getMangerResults.bind(this);
    this.fillGottenData();
  }
  fillGottenData() {
    AsyncStorage.getItem("UserLoggedData").then(value => {
      var data = JSON.parse(value);
      this.setState({ strDBName: data[0].strDBName });
      this.setState({ strEmployee: data[0].strEmployee });

      this.getRecievedResults(data[0].strEmployee);
      this.getSentResults(data[0].strEmployee);
      this.getMangerResults(data[0].strEmployee);
    });
  }
  async getRecievedResults(xxxx) {
    try {
      var url = API_LINK_PUBLIC +  "Home/GetAllTasks?type=1&strEmployee=" + xxxx;
      //console.warn(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
      const responseData = await response.json();
      this.setState({ RecievedResults: JSON.parse(responseData) });
      return responseData;
    }
    catch (error) {
      return console.warn(error);
    }
  }
  async getSentResults(xxxx) {
    try {
      var url = API_LINK_PUBLIC +  "Home/GetAllTasks?type=2&strEmployee=" + xxxx;
      //console.warn(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
      const responseData = await response.json();
      this.setState({ SentResults: JSON.parse(responseData) });
      return responseData;
    }
    catch (error) {
      return console.warn(error);
    }
  }
  async getMangerResults(xxxx) {
    try {
      var url = API_LINK_PUBLIC +  "Home/GetAllTasks?type=3&strEmployee=" + xxxx;
      //console.warn(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
      const responseData = await response.json();
      this.setState({ MangerResults: JSON.parse(responseData) });
      return responseData;
    }
    catch (error) {
      return console.warn(error);
    }
  }
  returnNullView() {
    return (
      <View style={{ flex: 1, alignSelf: "center", margin: 50 }}>
        <Text style={{ color: "gray" }}>لا يوجد مهمات</Text>
      </View>
    );
  }
  _renderHeader(item, expanded) {
    return (
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#5cb85c",
          height: 55
        }}
      >
        <Text style={{ fontWeight: "600" }}>
          {" "}{"   مستلم المهمة    " + item.strName}
        </Text>
        {expanded
          ? <Icon style={{ fontSize: 16, fontWeight: "bold" }} name="arrow-up" />
          : <Icon style={{ fontSize: 16, fontWeight: "bold" }} name="arrow-down" />}
      </View>
    );
  }
  _renderContent(item) {
    return (
      <View style={{
        flexDirection: "row",
        padding: 10,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#E6E6E6",
      }}>

        <Body>
          <Text style={{ fontSize: 16, color: "black", alignSelf: "flex-start", textAlign: "right" }}>
            {"التاريخ " + item.date}
          </Text>
          <Text style={{ fontSize: 16, color: "black", alignSelf: "flex-start", textAlign: "right" }}>
            {"العنوان " + item.title}
          </Text>
          <Text style={{ fontSize: 16, color: "black", alignSelf: "flex-start", textAlign: "right" }}>
            {"الموضوع " + item.content}
          </Text>
          <Text style={{ fontSize: 16, color: "black", alignSelf: "flex-start", textAlign: "right" }}>
            {"الحالة " + item.statusType}
          </Text>
        </Body>
      </View>
    );
  }

  render() {
    return (
      <Container>
        <Header hasTabs>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-forward" />
            </Button>
          </Left>
          <Body>
            <Title>{this.props.navigation.state.params.tabName}</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.navigation.navigate("BasicTab")}>
              <Icon name="search" />
            </Button>
            <Button transparent onPress={() => this.props.navigation.navigate("PlaceholderLabel")}>
              <Icon name="add" />
            </Button>
          </Right>
        </Header>

        <Tabs>
          <Tab heading="مستلم">
            <Content padder style={{ backgroundColor: "white" }}>
              {this.state.MangerResults.length > 0 // condition
                ? // if true
                // <Accordion
                //   contentStyle={{ alignSelf: "flex-start" }}
                //   dataArray={this.state.MangerResults}
                //   animation={true}
                //   expanded={true}
                //   icon="add"
                //   expandedIcon="remove"
                //   iconStyle={{ color: "green" }}
                //   expandedIconStyle={{ color: "red" }}
                // /> 
                <Accordion
                  dataArray={this.state.MangerResults}
                  animation={true}
                  expanded={true}
                  renderHeader={this._renderHeader}
                  renderContent={this._renderContent}
                />
                :
                this.returnNullView()}
            </Content>
          </Tab>
          <Tab heading="مسلّم">
            <Content padder style={{ backgroundColor: "white" }}>
              {this.state.SentResults.length > 0 // condition
                ? // if true
                <Accordion
                  contentStyle={{ alignSelf: "flex-start" }}
                  dataArray={this.state.SentResults}
                  animation={true}
                  expanded={true}
                  icon="add"
                  expandedIcon="remove"
                  iconStyle={{ color: "green" }}
                  expandedIconStyle={{ color: "red" }}
                />
                :
                this.returnNullView()}
            </Content>
          </Tab>
          <Tab heading="مهمات القسم">
            <Content padder style={{ backgroundColor: "white" }}>
              {this.state.RecievedResults.length > 0 // condition
                ? // if true
                <Accordion
                  contentStyle={{ alignSelf: "flex-start" }}
                  dataArray={this.state.RecievedResults}
                  animation={true}
                  expanded={true}
                  icon="add"
                  expandedIcon="remove"
                  iconStyle={{ color: "green" }}
                  expandedIconStyle={{ color: "red" }}
                /> :
                this.returnNullView()}
            </Content>
          </Tab>
        </Tabs>

      </Container>
    );
  }
}

export default BasicTab;
