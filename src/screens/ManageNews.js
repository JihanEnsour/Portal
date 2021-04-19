import React, { Component } from "react";
import { AsyncStorage } from "react-native";
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
  SwipeRow,
  Toast
} from "native-base";
import styles from "./styles";
import { API_LINK_PUBLIC } from "../exportsPublic";

class ManageNews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      strDBName: undefined,
      results: {
        idNews: undefined,
        title: undefined,
        content: undefined,
        day: undefined,
        month: undefined,
        year: undefined,
        hour: undefined,
        bActive: undefined
      }
    };

    this.fillGottenData = this.fillGottenData.bind(this);
    this.getData = this.getData.bind(this);
    this.fillGottenData();
  }

  fillGottenData() {
    AsyncStorage.getItem("UserLoggedData").then(value => {
      var data = JSON.parse(value);
      this.setState({ strDBName: data[0].strDBName });
      this.getData(data[0].strDBName);
    });
  }

  async getData(xxx) {
    try {
      var url = API_LINK_PUBLIC +  "Home/GetBasicCompanyNewsData?DbName=" + xxx;
      // console.warn(url);
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
    }
    catch (error) {
      return console.warn(error);
    }
  }

  deleteNews(id) {
    var url = API_LINK_PUBLIC +  "Home/DeleteNews?idNews=" + id;
    //console.warn(url);
    return fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseData => {
        Toast.show({
          text: "تم حذف الخبر",
          type: "success",
          duration: 5000
        });

        this.fillGottenData();
        return responseData;
      })
      .catch(error => console.warn(error));
  }

  deactivateNews(id) {
    var url = API_LINK_PUBLIC +  "Home/DeactivateNews?idNews=" + id;
    //console.warn(url);
    return fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseData => {
        Toast.show({
          text: "تم إلغاء تفعيل الخبر",
          type: "success",
          duration: 5000
        });
        this.fillGottenData();
        return responseData;
      })
      .catch(error => console.warn(error));
  }

  reloadData() {
    this.fillGottenData();
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
            <Title>الأخبار</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.reloadData()}>
              <Icon name="refresh" />
            </Button>
            <Button transparent onPress={() => this.props.navigation.navigate("AddNews")}>
              <Icon name="add" />
            </Button>
          </Right>
        </Header>

        <Content>
          {this.state.results.length > 0 // condition
            ? // if true
            <List
              dataArray={this.state.results}
              renderRow={data =>
                <SwipeRow
                  leftOpenValue={75}
                  rightOpenValue={-75}
                  left={
                    <Button success onPress={() => this.deactivateNews(data.idNews)}>
                      <Icon active name="mic-off" style={{ color: "#FFF" }} />
                    </Button>
                  }
                  right={
                    <Button danger onPress={() => this.deleteNews(data.idNews)}>
                      <Icon active name="trash" />
                    </Button>
                  }
                  body={
                    <View style={{ paddingLeft: 20 }}>
                      <Text>{data.title}</Text>
                      <Text numberOfLines={1} note>{data.content.substring(0, 35) + "..."}</Text>
                    </View>
                  }
                />
              }

            /> :
            <View style={{ flex: 1, alignSelf: "center", margin: 50 }}>
              <Text style={{ color: "gray" }}>لا يوجد بيانات</Text>
            </View>}
        </Content>
      </Container>
    );
  }
}

export default ManageNews;
