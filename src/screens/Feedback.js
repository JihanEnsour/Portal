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
  Right,
  Body,
  List,
  View,
  SwipeRow
} from "native-base";
import styles from "./styles";
import { API_LINK_PUBLIC } from "../exportsPublic";

class Feedback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: {
        FbMessage: undefined,
        dateFBMessage: undefined,
        name: undefined,
        empNum: undefined,
      }
    };

    this.getData = this.getData.bind(this);
    this.getData();
  }


  async getData() {
    try {
      var url = API_LINK_PUBLIC +  "Home/ShowFeedback";
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
            <Title>التغذية الراجعة</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.getData()}>
              <Icon name="refresh" />
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
                  right={
                    <Button
                      full
                      onPress={() => alert(data.dateFBMessage + "\n" + data.FbMessage)}
                      style={{
                        backgroundColor: "#CCC",
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center"
                      }} >
                      <Icon active name="information-circle" />
                    </Button>
                  }
                  body={
                    <View style={{ paddingLeft: 20 }}>
                      <Text>{data.empNum + " - " + data.name}</Text>
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

export default Feedback;
