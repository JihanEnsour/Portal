import React, { Component } from "react";
import { Dimensions } from "react-native";
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
  Row,
  Grid,
  Separator,
} from "native-base";
import styles from "./styles";
import { API_LINK_PUBLIC } from "../exportsPublic";

const screenWidth = Dimensions.get("window").width;

class EmpsContacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: "",
      tabName: "",
      DoneResults: {
        Name: undefined,
        Mobile: undefined,
        Phone: undefined,
        Telephone: undefined,
        Email: undefined,
        Company: undefined,
        Job: undefined,
      },
    };

    this.getResults = this.getResults.bind(this);
    this.getResults(this.state.searchText);
  }

  async getResults(searchText) {
    try {
      var url =
        API_LINK_PUBLIC +  "Home/GetEmployeeData?search=" + searchText;
      //console.warn(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      //console.warn(responseData);
      this.setState({ DoneResults: JSON.parse(responseData) });
      return responseData;
    } catch (error) {
      return console.log(error);
    }
  }
  reloadData() {
    this.setState({
      searchText: "",
    });
    this.getResults(this.state.searchText);
  }
  updateValues(text, field) {
    if (field === "textToSearch") {
      this.setState({
        searchText: text,
      });
    }
  }

  itemPressed(item) {
    this.props.navigation.navigate("EmpsConatctDetails", {
      RecievedResults: item,
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
                this.props.navigation.navigate("MainMenu")
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
            <Row style={{ alignSelf: "center" }}>
              <Item regular style={{ width: screenWidth / 1.1 }}>
                <Icon active name="search" />
                <Input
                  style={{ textAlign: "right" }}
                  onChangeText={(text) =>
                    this.updateValues(text, "textToSearch")
                  }
                  placeholder="بحث..."
                />
                <Button
                  style={{ marginTop: 2, marginLeft: 3 }}
                  onPress={() => this.getResults(this.state.searchText)}
                >
                  <Text>ابحث</Text>
                </Button>
              </Item>
            </Row>
          </Grid>

          <Separator bordered noTopBorder style={{ marginTop: 5 }} />
          <View style={{ marginTop: 10 }} />
          {this.state.DoneResults.length > 0 ? ( // condition
            <List
              dataArray={this.state.DoneResults}
              renderRow={(data) => (
                <ListItem onPress={() => this.itemPressed(data)}>
                  <Left>
                    <Text>{data.Name}</Text>
                  </Left>
                  <Right>
                    <Icon name="arrow-back" />
                  </Right>
                </ListItem>
              )}
            />
          ) : (
            <View style={{ flex: 1, alignSelf: "center", margin: 50 }}>
              <Text style={{ color: "gray" }}>لا يوجد بيانات</Text>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

export default EmpsContacts;
