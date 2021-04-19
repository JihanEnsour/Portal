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
  SwipeRow,
  Toast
} from "native-base";
import styles from "./styles";
import { API_LINK_PUBLIC } from "../exportsPublic";

class CreateEmpOfMonth extends Component {
  constructor(props) {
    super(props);


    this.state = {
      results: {
        Id: undefined,
        intMonth: undefined,
        intYear: undefined,
        strName: undefined,
      }
    };

    this.getData = this.getData.bind(this);
    this.getData();
  }

  async getData() {
    try {
      var url = API_LINK_PUBLIC +  "Home/GetEmployeeOfTheMonthData";
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

  deleteEmp(id) {
    var url = API_LINK_PUBLIC +  "Home/DeleteEmpOfTheMonth?empId=" + id;
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
          text: "تم حذف موظف الشهر",
          type: "success",
          duration: 5000
        });

        this.getData();
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
            <Title>موظف الشهر</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.navigation.navigate("UnderlineInput")}>
              <Icon name="refresh" />
            </Button>
            <Button transparent onPress={() => this.props.navigation.navigate("ManageEmpOfMonth")}>
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
                  right={
                    <Button danger onPress={() => this.deleteEmp(data.Id)}>
                      <Icon active name="trash" />
                    </Button>
                  }
                  body={
                    <View style={{ paddingLeft: 20 }}>
                      <Text>{data.intMonth + "-" + data.intYear + ": " + data.strName}</Text>
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

export default CreateEmpOfMonth;
