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
  DatePicker,
  View,
  Toast,
  Picker,
  Label
} from "native-base";
import { AsyncStorage } from "react-native";
import styles from "./styles";
import { API_LINK_PUBLIC } from "../exportsPublic";

class CreateATask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      strDBName: "",
      chosenDate: new Date(),
      title: "",
      subject: "",
      sender: "",
      reciever: "0",
      recieverData: "",
      manager: "0",
      managerData: "",
      pickerList: {
        value: "",
        label: "",
        dbName: "",
      },
    };

    this.setDate = this.setDate.bind(this);
    this.fillGottenData = this.fillGottenData.bind(this);
    this.getEmployees();
  }
  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  fillGottenData() {
    AsyncStorage.getItem("UserLoggedData").then(value => {
      var data = JSON.parse(value);
      this.setState({ sender: data[0].strEmployee });
      this.setState({ strDBName: data[0].strDBName });
      this.saveTasksButton(data[0].strDBName);
    });
  }

  getEmployees() {
    return fetch(API_LINK_PUBLIC +  "Home/GetEmployees", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseData => {
        this.setState({
          pickerList: JSON.parse(responseData)
        });
        //console.warn(this.state.pickerList);
        return responseData;
      })
      .catch(error => console.log(error));
  }
  getItems() {
    var items = [];
    var gotItems = this.state.pickerList;
    for (var i = 0; i < gotItems.length; i++) {
      // console.log("pickerList : " + JSON.stringify(gotItems))
      items.push(< Picker.Item key={
        gotItems[i].value
      }
        value={
          gotItems[i].value
        }
        label={
          gotItems[i].label
        }
      />);
    }
    return items;
  }

  updateValues(text, field) {
    if (field === "title") {
      this.setState({
        titleNew: text
      });
    } else if (field === "subject") {
      this.setState({
        subjectNews: text
      });
    }
  }
  returnOneItem(value) {
    var item = "";
    var gotItems = this.state.pickerList;
    for (var i = 0; i < gotItems.length; i++) {
      if (gotItems[i].value === value) {
        item = gotItems[i].value + "_" + gotItems[i].label;
      }
    }
    //console.warn(item);
    return item;
  }
  onValueChange(value, index) {
    var data = this.returnOneItem(value);
    this.setState({
      reciever: value,
      recieverData: data,
    });

    //console.warn(this.state.strDBNamer);
    //console.warn(this.state.reciever.split("_")[0]);
  }
  onValueChangeTwo(value, index) {
    var data = this.returnOneItem(value);
    this.setState({
      manager: value,
      managerData: data
    });

    // console.warn(this.state.manager);
    // console.warn(this.state.manager.split("_")[0]);
  }
  saveTasksButton(dbName) {
    if (dbName !== undefined && this.state.recieverData !== "" && this.state.managerData !== "") {
      var url = API_LINK_PUBLIC +  "Home/InsertTask?sender=" + this.state.sender + "&senderDB=" + dbName + " &reciever=" + this.state.reciever.split("_")[1] + "&recieverDB=" + this.state.recieverData.split("_")[0] + " &manager=" + this.state.manager.split("_")[1] + "&managerDB=" + this.state.managerData.split("_")[0] + " &title=" + this.state.titleNew + "&subject=" + this.state.subjectNews + "&date=" + this.state.chosenDate.toString("dd'/'MM'/'yyyy").substr(4, 12);
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
          this.props.navigation.navigate("Tasks");
          return responseData;
        })
        .catch(error => console.warn(error));
    }
    else {
      Toast.show({
        text: "جميع الحقول إلزامية",
        type: "danger",
        duration: 8000
      });
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
            <Title>إضافة مهمة</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          <Form>
            <View style={{ marginTop: 10 }} />
            <Item regular>
              <Label>مستلم المهمة</Label>
              <Picker
                iosHeader="Select one"
                mode="dropdown"
                selectedValue={this.state.reciever}
                onValueChange={(itemValue, itemIndex) => { setTimeout(() => { this.onValueChange(itemValue, itemIndex) }, 10) }}>
                {this.getItems()}
              </Picker>
            </Item>
            <View style={{ marginTop: 15 }} />
            <Item regular>
              <Label>مدير المستلم</Label>
              <Picker
                iosHeader="Select one"
                mode="dropdown"
                selectedValue={this.state.manager}
                onValueChange={(itemValue, itemIndex) => { setTimeout(() => { this.onValueChangeTwo(itemValue, itemIndex) }, 10) }}>
                {this.getItems()}
              </Picker>
            </Item>
            <View style={{ marginTop: 15 }} />
            <Item regular>
              <Label style={{ marginRight: 30 }}>الموعد النهائي</Label>
              <DatePicker
                defaultDate={new Date()}
                //minimumDate={new Date(2018, 1, 1)}
                locale={"en"}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={"fade"}
                androidMode={"default"}
                placeHolderText="حدد التاريخ"
                textStyle={{ color: "green" }}
                placeHolderTextStyle={{ color: "black" }}
                onDateChange={this.setDate}
              />
            </Item>
            <View style={{ marginTop: 15 }} />
            <Item regular>
              <Input style={{ textAlign: "right" }} onChangeText={text => this.updateValues(text, "title")} placeholder="عنوان المهمة" />
            </Item>
            <View style={{ marginTop: 15 }} />
            <Item regular>
              <Textarea rowSpan={5} onChangeText={text => this.updateValues(text, "subject")} placeholder="موضوع المهمة" />
            </Item>
            <View style={{ marginTop: 15 }} />
            <Button regular block style={{ margin: 15 }} onPress={() => this.fillGottenData()}><Text>حفظ</Text></Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default CreateATask;
