import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Textarea,
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

class ManageEmpOfMonth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      month: "",
      year: "",
      empName: "",
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
    else if (field === "name") {
      this.setState({
        empName: text
      });
    }
  }

  saveEmpsButton() {

    var url = API_LINK_PUBLIC +  "Home/InsertEmpOfTheMonth?month=" + this.state.month + "&year=" + this.state.year + "&empName=" + this.state.empName;
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
            <Title>إضافة موظف شهر</Title>
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
            <Item regular>
              <Textarea rowSpan={2} onChangeText={text => this.updateValues(text, "name")} placeholder="اسم الموظف" />
            </Item>
            <View style={{ marginTop: 15 }} />
            <Button regular block style={{ margin: 15 }} onPress={() => this.saveEmpsButton()}><Text>حفظ</Text></Button>
          </Form>
        </Content>

      </Container>
    );
  }
}

export default ManageEmpOfMonth;
