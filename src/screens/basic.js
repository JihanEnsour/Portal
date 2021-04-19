import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Card,
  CardItem,
  Text,
  Left,
  Body,
  Right,
  View,
  Toast
} from "native-base";
import { AsyncStorage } from "react-native";
import styles from "./styles";
import RadioForm from "react-native-simple-radio-button";
import { API_LINK_PUBLIC } from "../exportsPublic";

class Basic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: { label: "", value: 0 },
      selectedValue: undefined,
      btnDisabled: false
    };

    this.getData = this.getData.bind(this);
    this.getData();
    //console.warn(this.props.navigation.state.params.RecievedResults.intSurId);
  }

  async getData() {
    var url =
      API_LINK_PUBLIC +  "Home/GetSurviesOptions?surId=" +
      this.props.navigation.state.params.RecievedResults.intSurId;
    return fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseData => {
        var data = JSON.parse(responseData);
        //console.warn(data);
        this.setState({ results: data });
        return responseData;
      })
      .catch(error => console.warn(error));
  }
  saveButton() {
    AsyncStorage.getItem("UserLoggedData").then(value => {
      var data = JSON.parse(value);

      var url = API_LINK_PUBLIC +  "Home/GetAnswersFromUsers";
      //console.warn(url);
      return fetch(url, {
        method: "Post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          surId: this.props.navigation.state.params.RecievedResults.intSurId,
          optId: this.state.selectedValue,
          userId: data[0].strEmployee,
          company: data[0].strDBName
        })
      })
        .then(response => response.json())
        .then(responseData => {
          Toast.show({
            text: "تم الحفظ",
            type: "success",
            buttonText: "موافق",
            duration: 8000
          });
          this.props.navigation.navigate("Survey");
          return responseData;
        })
        .catch(error => console.warn(error));
    });
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
            <Title>
              {this.props.navigation.state.params.RecievedResults.intSurId}
            </Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          <Card style={styles.mb}>
            <CardItem bordered>
              <Left>
                <Body>
                  <Text>
                    {
                      this.props.navigation.state.params.RecievedResults
                        .strSubject
                    }
                  </Text>
                  <Text
                    numberOfLines={1}
                    note
                    style={{ textAlign: "right", alignSelf: "flex-start" }}
                  >
                    {
                      this.props.navigation.state.params.RecievedResults
                        .dateCreationDate
                    }
                  </Text>
                </Body>
              </Left>
            </CardItem>

            <CardItem cardBody style={{ padding: 10 }}>
              <Text style={{ alignSelf: "flex-end", padding: 10 }}>
                {this.props.navigation.state.params.RecievedResults.strQuestion}
              </Text>
            </CardItem>
            <View style={{ margin: 4 }} />
            <CardItem cardBody style={{ padding: 10 }}>
              <RadioForm
                radio_props={this.state.results}
                initial={0}
                formHorizontal={false}
                labelHorizontal={true}
                buttonColor={"#2196f3"}
                animation={true}
                onPress={value => {
                  this.setState({ selectedValue: value });
                }}
              />
            </CardItem>
            <View style={{ margin: 8 }} />
            <CardItem cardBody>
              <Button
                disabled={this.state.btnDisabled}
                success
                style={[styles.mb15, { marginLeft: 20, padding: 10 }]}
                onPress={() => this.saveButton()}
              >
                <Icon active name="warning" />
                <Text>إرسال</Text>
              </Button>
            </CardItem>
            <View style={{ margin: 8 }} />
          </Card>
        </Content>
      </Container>
    );
  }
}

export default Basic;
