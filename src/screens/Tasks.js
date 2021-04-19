import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Body,
  Left,
  Right,
  List,
  ListItem,
  Text,
  Thumbnail,
  Badge,
  View,
  Spinner
} from "native-base";
import { AsyncStorage } from "react-native";
import styles from "./styles";
import { API_LINK_PUBLIC } from "../exportsPublic";

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabName: "",
      results: {
        img: "",
        route: "",
        text: "",
        note: "",
        id: 0,
        count: "0"
      }
    }

    this.fillGottenData = this.fillGottenData.bind(this);
    this.getData = this.getData.bind(this);
    this.fillGottenData();
  }

  fillGottenData() {
    AsyncStorage.getItem("UserLoggedData").then(value => {
      var data = JSON.parse(value);
      this.getData(data[0].strEmployee, data[0].strDBName);
      //console.warn(data[0].strEmployee + data[0].strDBName);
    });
  }

  async getData(emp, db) {
    try {
      var url = API_LINK_PUBLIC +  "Home/GetTasksTabsData?strEmployee=" + emp + "&dbName=" + db;
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
    }
    catch (error) {
      return console.warn(error);
    }
  }

  itemPressed(item) {
    this.props.navigation.navigate(item.route, { tabName: item.text });
  }

  reloadData() {
    this.fillGottenData();
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate("MainMenu")}>
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
            <Button transparent onPress={() => this.props.navigation.navigate("CreateATask")}>
              <Icon name="add" />
            </Button>
            <Button transparent onPress={() => this.props.navigation.navigate("DisabledInput")}>
              <Icon name="information-circle" />
            </Button>
          </Right>
        </Header>

        <Content>
          {this.state.results.length > 0 // condition
            ? // if true
            <List
              dataArray={this.state.results}
              renderRow={data =>
                <ListItem thumbnail onPress={() => this.itemPressed(data)}>
                  <Left>
                    <Thumbnail square source={{ uri: data.img }} />
                  </Left>
                  <Body>
                    <Text>
                      {data.text}
                    </Text>
                    <Text numberOfLines={1} note>
                      {data.note}
                    </Text>
                  </Body>
                  <Right>
                    <Badge style={{ backgroundColor: "#FD3C2D" }}>
                      <Text>{data.count}</Text>
                    </Badge>
                  </Right>
                </ListItem>}
            /> :
            <View style={{ flex: 1, alignSelf: "center", margin: 50 }}>
              <Spinner color="#46639E" />
            </View>}
        </Content>
      </Container>
    );
  }
}

export default Tasks;
