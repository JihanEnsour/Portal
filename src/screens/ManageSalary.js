import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Body,
  Left,
  Right,
  Icon,
  Form,
  Item,
  Input,
  Text,
  View,
  Toast
} from "native-base";
import styles from "./styles";
import { API_LINK_PUBLIC } from "../exportsPublic";

class  ManageSalary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      month: "",
      year: "",
    };
  }

  updateValues(text, field) {
    if (field === "month") {
      this.setState({
        month: text
      });
    } else if (field === "year") {
      this.setState({
        year: text
      });
    }
  }

  activateAndDeactivateSalary(xyz) {

    var url = API_LINK_PUBLIC +  "Home/ActivateAndDeactivateSalary?month=" + this.state.month + "&year=" + this.state.year + "&ItsDe=" + xyz;
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
          text: "تم الحفظ",
          type: "success",
          duration: 8000
        });

        return responseData;
      })
      .catch(error => console.warn(error));

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
            <Title>الرواتب</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          <Form>
            <Item regular>
              <Input style={{ textAlign: "right" }} onChangeText={text => this.updateValues(text, "month")} placeholder="الشهر" />
            </Item>
            <View style={{ marginTop: 15 }} />
            <Item regular>
              <Input style={{ textAlign: "right" }} onChangeText={text => this.updateValues(text, "year")} placeholder="السنة" />
            </Item>
            <View style={{ marginTop: 15 }} />

            <View style={{ flexDirection: "row" }}>
              <Button iconLeft danger style={styles.mb15} onPress={() => this.activateAndDeactivateSalary(false)} >
                <Icon active name="close" />
                <Text>إلغاء تفعيل</Text>
              </Button>
              <Button success style={[styles.mb15, { marginLeft: 20 }]} onPress={() => this.activateAndDeactivateSalary(true)}>
                <Icon active name="warning" />
                <Text>  تفعيل</Text>
              </Button>
            </View>

          </Form>
        </Content>

      </Container>
    );
  }
}

export default  ManageSalary;
