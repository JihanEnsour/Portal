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
  View,
  Text,
  List,
  ListItem
} from "native-base";
import { AsyncStorage } from "react-native";
import { API_LINK_PUBLIC } from "../exportsPublic";

class Survey extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabName: "",
      results: {
        intSurId: undefined,
        intType: undefined,
        strSubject: undefined,
        strQuestion: undefined,
        dateCreationDate: undefined,
        dateEndDate: undefined,
        bActive: undefined
      }
    };

    this.getData = this.getData.bind(this);
    this.fillGottenData = this.fillGottenData.bind(this);
    this.fillGottenData();
  }
  fillGottenData() {
    AsyncStorage.getItem("UserLoggedData").then(value => {
      var data = JSON.parse(value);
      this.getData(data[0].strEmployee);
    });
  }
  async getData(strEmp) {
    try {
      var url =
        API_LINK_PUBLIC +  "Home/GetSurvies?strEmployee=" + strEmp;
      //console.warn(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
      const responseData = await response.json();
      this.setState({ results: JSON.parse(responseData) });
      //console.warn(responseData);
      return responseData;
    } catch (error) {
      return console.warn(error);
    }
  }

  itemPressed(item) {
    this.props.navigation.navigate("BasicCard", { RecievedResults: item });
  }
  reloadData() {
    this.fillGottenData();
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
            <Title>
              {this.props.navigation.state.params.tabName}
            </Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.reloadData()}>
              <Icon name="refresh" />
            </Button>
          </Right>
        </Header>
        <Content padder style={{ backgroundColor: "white" }}>
          {this.state.results.length > 0 // condition
            ? <List
                dataArray={this.state.results}
                renderRow={data =>
                  <ListItem onPress={() => this.itemPressed(data)}>
                    <Left>
                      <Text>
                        {data.strSubject.substring(0, 20)}
                      </Text>
                    </Left>
                    <Right>
                      <Icon name="arrow-back" />
                    </Right>
                  </ListItem>}
              />
            : <View style={{ flex: 1, alignSelf: "center", margin: 50 }}>
                 <Text style={{ color: "gray" }}>لا يوجد إستبيانات</Text>
              </View>}
        </Content>
      </Container>
    );
  }
}

export default Survey;
