import React, { Component } from "react";
import {
  AsyncStorage,
  Image,
  Switch,
} from "react-native";
import {
  Container,
  Item,
  Toast,
  Input,
  Content,
  Icon,
  Body,
  ListItem,
  Spinner,
  Text,
  Picker,
  Button,
  View,
  CheckBox,
  Fab,
} from "native-base";
import * as JSONDATA from "../../exportsPublic";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobile: "",
      password: "",
      company: "",
      intEmployee: 0,
      isLogged: false,
      status: "",
      checkbox1: false,
      pickerList: [],
      showPassword: true,
    };

    this.showMePassword = this.showMePassword.bind(this);
    this.fillGottenData = this.fillGottenData.bind(this);
    this.getPickerData = this.getPickerData.bind(this);

    // this.props.navigation.addListener("willFocus", (payload) => {
    //   this.fillGottenData();
    // });
  }
  async componentDidMount() {
    this.fillGottenData();
    this.getPickerData();
  }

  emptyTheData() {
    AsyncStorage.setItem("KeepMeSignedIn", "false");
    //AsyncStorage.setItem("UserLoggedData", "");
    this.props.navigation.navigate("Home");
    this.getPickerData();
  }
  fillGottenData() {
    AsyncStorage.getItem("KeepMeSignedIn").then((keep) => {
      if (keep === "true") {
        AsyncStorage.getItem("UserLoggedData").then((value) => {
          var data = JSON.parse(value);
          this.onCheckOnUser(data);
        });
      } else {
        //console.warn("i'm in login");
        this.emptyTheData();
      }
    });
  }
  async getPickerData() {
    try {
      var url = JSONDATA.API_LINK_PUBLIC + "Home/GetCompanies";
      // console.warn(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      this.setState({
        pickerList: JSON.parse(responseData),
      });
      return responseData;
    } catch (error) {
      return console.log(error);
    }
  }
  updateValues(text, field) {
    if (field === "mobile") {
      this.setState({
        mobile: text,
      });
    } else if (field === "password") {
      this.setState({
        password: text,
      });
    }
  }
  showMePassword() {
    this.setState({ showPassword: !this.state.showPassword });
  }
  async onPressEvent() {
    if (
      this.state.mobile !== "" &&
      this.state.password !== "" &&
      this.state.company !== ""
    ) {
      var url =
        JSONDATA.API_LINK_PUBLIC +
        "Home/Login?userId=" +
        this.state.mobile +
        "&pwd=" +
        this.state.password +
        "&company=" +
        this.state.company;
      //console.warn(url);
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        const responseData = await response.json();
        //console.warn(responseData);
        if (responseData === false) {
          Toast.show({
            text: "اسم المستخدم أو كلمة المرور غير صحيح!",
            buttonText: "Ok",
            type: "danger",
          });
        } else {
          if (this.state.checkbox1 === true) {
            AsyncStorage.setItem("KeepMeSignedIn", "true");
          } else {
            AsyncStorage.setItem("KeepMeSignedIn", "false");
          }
          AsyncStorage.setItem("UserLoggedData", responseData);
          this.props.navigation.navigate("MainMenu");
          return responseData;
        }
      } catch (error) {
        return console.log(error);
      }
    } else {
      Toast.show({
        text: "جميع الحقول إلزامية!",
        buttonText: "Ok",
        type: "danger",
      });
    }
  }
  async onCheckOnUser(data) {
    var url =
      JSONDATA.API_LINK_PUBLIC +
      "Home/Login?userId=" +
      data[0].strEmployee +
      "&pwd=" +
      data[0].Password +
      "&company=" +
      data[0].strDBName +
      "&check=true";
    //console.warn(url);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      var gotten = JSON.parse(responseData);
      if (gotten[0].bitIsLoggedMobileApp === false) {
        this.emptyTheData();
        return responseData;
      } else {
        AsyncStorage.setItem("UserLoggedData", responseData);
        this.props.navigation.navigate("MainMenu");
      }
    } catch (error) {
      return console.log(error);
    }
  }
  onValueChange(value) {
    this.setState({
      company: value,
    });
  }
  getItems = () => {
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
  };
  getEmpPassword() {
    this.props.navigation.navigate("forgetPassword");
  }
  toggleSwitch1() {
    this.setState({
      checkbox1: !this.state.checkbox1,
    });
  }
  render() {
    return (
      <Container>
        <Content>
          <View style={{ marginTop: 50 }} />
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../../assets/logo_future_arab.png")}
              style={{ width: 190, height: 100 }}
            />
          </View>

          <View style={{ marginTop: 40 }} />
          {this.state.pickerList.length > 0 ? (
            <View style={{ margin: 20 }}>
              <Item rounded>
                <Icon active name="home" style={{ color: "#387ef5" }} />
                <Picker
                  mode="dropdown"
                  iosHeader={<Icon name="ios-arrow-down" />}
                  placeholder="الشركة"
                  style={{
                    width: undefined,
                    paddingBottom: 10,
                  }}
                  textStyle={{ textAlign: "center", alignSelf: "flex-end" }}
                  itemStyle={{
                    marginLeft: 0,
                    paddingLeft: 10,
                  }}
                  selectedValue={this.state.company}
                  onValueChange={(value) => this.onValueChange(value)}
                >
                  {this.getItems()}
                </Picker>
              </Item>
              <View style={{ marginTop: 10 }} />
              <Item rounded>
                <Icon active name="hand" style={{ color: "#387ef5" }} />
                <Input
                  style={{ textAlign: "right" }}
                  keyboardType="numeric"
                  onChangeText={(text) => this.updateValues(text, "mobile")}
                  placeholder="الرقم الوظيفي"
                />
              </Item>
              <View style={{ marginTop: 10 }} />
              <Item rounded>
                <Icon active name="barcode" style={{ color: "#387ef5" }} />
                <Input
                  style={{ textAlign: "right" }}
                  onChangeText={(text) => this.updateValues(text, "password")}
                  placeholder="كلمة المرور"
                  secureTextEntry={this.state.showPassword}
                />
                <Switch
                  style={{ marginRight: 5 }}
                  onValueChange={this.showMePassword}
                  value={!this.state.showPassword}
                />
              </Item>
              <View style={{ marginTop: 20 }} />
              <ListItem onPress={() => this.toggleSwitch1()}>
                <CheckBox
                  checked={this.state.checkbox1}
                  onPress={() => this.toggleSwitch1()}
                />
                <Body>
                  <Text style={{ color: "#000", padding: 10 }}>تذكرني</Text>
                </Body>
              </ListItem>
              <Button
                rounded
                block
                style={{ margin: 15, marginTop: 20 }}
                onPress={() => this.onPressEvent()}
              >
                <Text style={{ color: "#fff" }}>تسجيل الدخول</Text>
              </Button>

              <Text
                style={[
                  {
                    color: "blue",
                    fontSize: 15,
                    paddingTop: 10,
                    alignSelf: "center",
                    fontWeight: "600",
                  },
                ]}
                onPress={() => this.getEmpPassword()}
              >
                نسيت كلمة المرور؟
              </Text>
            </View>
          ) : (
            <View style={{ flex: 1, alignSelf: "center", margin: 50 }}>
              <Spinner color="#46639E" />
            </View>
          )}
        </Content>
        <Fab
          onPress={() => this.props.navigation.navigate("urgentSigniture")}
          direction="right"
          style={{ backgroundColor: "#46639E" }}
          position="bottomRight"
        >
          <Icon active name="pin" />
        </Fab>
      </Container>
    );
  }
}

export default Home;
