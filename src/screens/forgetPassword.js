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
  Item,
  Input,
  Toast
} from "native-base";
import { Alert, View } from "react-native";
import styles from "./styles";
import { API_LINK_PUBLIC } from "../exportsPublic";

class forgetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nationalNum: "",
      company: "",
      intEmployee: 0,
      status: "",
      pickerList: {
        value: 0,
        label: "",
      },
    };

  }

  updateValues(text, field) {
    if (field === "nationalNum") {
      this.setState({
        nationalNum: text
      });
    }
  }

  async onPressEvent() {
    if (this.state.nationalNum !== "") {
      var url =
        API_LINK_PUBLIC +  "Home/GetEmployeePassword?nationalNum=" + this.state.nationalNum;
      // console.warn(url);
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        });
        const responseData = await response.json();
        var data = JSON.parse(responseData);
        if (responseData === false) {
          Toast.show({ text: "الرقم الوطني غير صحيح", buttonText: "Ok", type: "danger" });
        }
        else {
          Alert.alert("معلومات الموظف", "الرقم الوظيفي     " + data[0].strEmployee + "\n\n" + "الرقم السري     " + data[0].Password);
          return responseData;
        }
      }
      catch (error) {
        return console.log(error);
      }
    } else {
      Toast.show({ text: "جميع الحقول إلزامية!", buttonText: "Ok", type: "danger" });
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
            <Title> نسيت كلمة المرور</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <View style={{ margin: 10 }}>
            <View style={{ marginTop: 50 }} />
            <Item rounded>
              <Icon active name="person" style={{ color: "#387ef5" }} />
              <Input style={{ textAlign: "right" }} keyboardType="numeric" onChangeText={text => this.updateValues(text, "nationalNum")} placeholder="الرقم الوطني" />
            </Item>
            <View style={{ marginTop: 20 }} />
            <Button
              bordered
              block
              style={[styles.mb15, { alignSelf: "center" }]}
              onPress={() => this.onPressEvent()}
            >
              <Text style={{ color: "#2c3e50" , fontSize: 18}}>استرجاع كلمة المرور</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

export default forgetPassword;
