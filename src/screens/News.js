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
  Spinner,
  Text,
  List,
  ListItem,
} from "native-base";
import { API_LINK_PUBLIC } from "../exportsPublic";

class News extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Emp_ID: "",
      strDBName: "",
      tabName: "",
      results: {
        idNews: undefined,
        title: undefined,
        content: undefined,
        dateNews: undefined,
        day: undefined,
        month: undefined,
        year: undefined,
        hour: undefined,
        bActive: undefined,
      },
      data: [],
    };

    this.getData = this.getData.bind(this);
    this.getData();
  }

  async getData() {
    try {
      var url =
        API_LINK_PUBLIC +  "Home/GetBasicCompanyNewsData?DbName=" +
        this.props.navigation.state.params.strDBName;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      this.setState({ results: JSON.parse(responseData) });
      // console.warn(responseData);
      return responseData;
    } catch (error) {
      return console.warn(error);
    }
  }

  itemPressed(item) {
    this.props.navigation.navigate("NewsDetails", { RecievedResults: item });
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
            <Title>{this.props.navigation.state.params.tabName}</Title>
          </Body>
          <Right />
        </Header>
        <Content padder style={{ backgroundColor: "white" }}>
          {this.state.results.length > 0 ? ( // condition
            <List
              dataArray={this.state.results}
              renderRow={(data) => (
                <ListItem onPress={() => this.itemPressed(data)}>
                  <Body>
                    <Text style={{ color: "#46639E", fontWeight: "600" , fontSize : 20}}>{data.title}</Text>
                    <Text
                      numberOfLines={1}
                      note
                      style={{ textAlign: "right", alignSelf: "flex-start" }}
                    >
                      {data.year + "-" + data.month + "-" + data.day}
                    </Text>
                  </Body>
                  <Right>
                    <Icon name="arrow-back" />
                  </Right>
                </ListItem>
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

export default News;
