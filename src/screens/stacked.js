import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Item,
  Label,
  Grid,
  Body,
  Left,
  Right,
  Icon,
  Row,
  Text,
  Picker,
  View,
  Col
} from "native-base";
import { I18nManager } from "react-native";
import styles from "./styles";
import { API_LINK_PUBLIC } from "../exportsPublic";

class Stacked extends Component {
  constructor(props) {
    super(props);
    I18nManager.forceRTL(true);
    this.state = {
      company: "",
      day: 1,
      month: 1,
      year: new Date().getFullYear(),
      tabName: "",
      pickerList: {
        value: 0,
        label: ""
      }
    };

    this.getPickerData = this.getPickerData.bind(this);
    this.getPickerData();
  }
  async getPickerData() {
    try {
      const response = await fetch(
        API_LINK_PUBLIC +  "Home/GetCompanies",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );
      const responseData = await response.json();
      this.setState({
        pickerList: JSON.parse(responseData)
      });
      return responseData;
    } catch (error) {
      return console.warn(error);
    }
  }

  getItems() {
    var items = [];
    var gotItems = this.state.pickerList;
    for (var i = 0; i < gotItems.length; i++) {
      items.push(
        <Picker.Item
          key={gotItems[i].value}
          value={gotItems[i].value}
          label={gotItems[i].label}
        />
      );
    }
    return items;
  }

  onValueChange(value) {
    this.setState({
      company: value
    });
  }
  onValueDay(value) {
    this.setState({
      day: value
    });
  }
  onValueMonth(value) {
    this.setState({
      month: value
    });
  }
  onValueYear(value) {
    this.setState({
      month: value
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
            <Title>{this.props.navigation.state.params.tabName}</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <View style={{ margin: 8 }}>
            <Grid>
              <Row style={styles.row}>
                <Col style={styles.col}>
                  <Item regular style={{ margin: 20 }}>
                    <Label>اسم الشركة</Label>
                    <Picker
                      mode="dropdown"
                      iosHeader="--  الشركة  --"
                      style={{ width: undefined, paddingBottom: 10, flex: 1 }}
                      selectedValue={this.state.company}
                      onValueChange={value => this.onValueChange(value)}
                    >
                      {this.getItems()}
                    </Picker>
                  </Item>
                </Col>
              </Row>
              <Row style={styles.row}>
                <Col style={styles.col}>
                  <Item regular style={{ margin: 5 }}>
                    <Label>يوم</Label>
                    <Picker
                      mode="dropdown"
                      iosHeader="يوم"
                      selectedValue={this.state.day}
                      onValueChange={value => this.onValueDay(value)}
                    >
                      <Item label="1" value="1" />
                      <Item label="2" value="2" />
                      <Item label="3" value="3" />
                      <Item label="4" value="4" />
                      <Item label="5" value="5" />
                      <Item label="6" value="6" />
                      <Item label="7" value="7" />
                      <Item label="8" value="8" />
                      <Item label="9" value="9" />
                      <Item label="10" value="10" />
                      <Item label="11" value="11" />
                      <Item label="12" value="12" />
                      <Item label="13" value="13" />
                      <Item label="14" value="14" />
                      <Item label="15" value="15" />
                      <Item label="16" value="16" />
                      <Item label="17" value="17" />
                      <Item label="18" value="18" />
                      <Item label="19" value="19" />
                      <Item label="20" value="20" />
                      <Item label="21" value="21" />
                      <Item label="22" value="22" />
                      <Item label="23" value="23" />
                      <Item label="24" value="24" />
                      <Item label="25" value="25" />
                      <Item label="26" value="26" />
                      <Item label="27" value="27" />
                      <Item label="28" value="28" />
                      <Item label="29" value="29" />
                      <Item label="30" value="30" />
                      <Item label="30" value="31" />
                    </Picker>
                  </Item>
                </Col>
                <Col style={styles.col}>
                  <Item regular style={{ margin: 5 }}>
                    <Label>شهر</Label>
                    <Picker
                      mode="dropdown"
                      iosHeader="شهر"
                      selectedValue={this.state.month}
                      onValueChange={value => this.onValueMonth(value)}
                    >
                      <Item label="1" value="1" />
                      <Item label="2" value="2" />
                      <Item label="3" value="3" />
                      <Item label="4" value="4" />
                      <Item label="5" value="5" />
                      <Item label="6" value="6" />
                      <Item label="7" value="7" />
                      <Item label="8" value="8" />
                      <Item label="9" value="9" />
                      <Item label="10" value="10" />
                      <Item label="11" value="11" />
                      <Item label="12" value="12" />
                    </Picker>
                  </Item>
                </Col>
              </Row>
              <Row style={styles.row}>
                <Col style={styles.col}>
                  <Item regular style={{ margin: 5 }}>
                    <Label>سنة</Label>
                    <Picker
                      mode="dropdown"
                      iosHeader="سنة"
                      selectedValue={this.state.year}
                      onValueChange={value => this.onValueYear(value)}
                    >
                      <Item label="2019" value="2019" />
                      <Item label="2020" value="2020" />
                    </Picker>
                  </Item>
                </Col>
              </Row>
            </Grid>

            <Button
              block
              style={{
                margin: 15,
                marginTop: 20,
                fontWeight: "bold",
                fontSize: 18
              }}
            >
              <Text>بحث</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

export default Stacked;
