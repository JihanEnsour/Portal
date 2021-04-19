import React, { Component } from "react";
import { Platform, AsyncStorage } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  ListItem,
  Text,
  Badge,
  Left,
  Right,
  Body,
  Separator,
  Toast
} from "native-base";
import styles from "./styles";
import { API_LINK_PUBLIC } from "../exportsPublic";

class ManageApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bIsHrAccess: false,
      AdminHR: false,
      strDBName: "",
      strEmployee: "",
      selectedItem: undefined,
      selected1: "key1",
      results: {
        items: []
      }
    };

    this.fillGottenData = this.fillGottenData.bind(this);
    this.fillGottenData();
  }
  fillGottenData() {
    AsyncStorage.getItem("UserLoggedData").then(value => {
      var data = JSON.parse(value);
      this.setState({ bIsHrAccess: data[0].bIsHrAccess }, () => {
        //console.warn(this.state.bIsHrAccess, 'bIsHrAccess');
      });
      this.setState({ strDBName: data[0].strDBName });
      this.setState({ strEmployee: data[0].strEmployee });
      //this.setState({ bIsHrAccess: data[0].bIsHrAccess });
      this.setState({ AdminHR: data[0].AdminHR });
    });
  }

  onValueChange(value) {
    this.setState({
      selected1: value
    });
  }
  warningMsg(item) {
    Toast.show({
      text: "لطفاً، لا يوجد لديك صلاحيات إدارة التطبيق!",
      type: "warning",
      duration: 5000
    });
  }
  async LogoutMethod() {
    var url =
      API_LINK_PUBLIC +  "Home/Logout?userId=" +
      this.state.strEmployee +
      "&company=" +
      this.state.strDBName +
      "&allUsers=true";
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
        if (responseData === true) {
          AsyncStorage.setItem("KeepMeSignedIn", "false");
          AsyncStorage.setItem("UserLoggedData", "");
          this.props.navigation.navigate("Home");
        } else {
          this.props.navigation.navigate("MainMenu");
        }

        return responseData;
      })
      .catch(error => console.log(error));
  }
  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() =>
                this.props.navigation.navigate("MainMenu")
              }
            >
              <Icon name="arrow-forward" />
            </Button>
          </Left>
          <Body>
            <Title>{this.props.navigation.state.params.tabName}</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <Separator bordered noTopBorder>
            <Text style={{ fontSize: 18 }}>شؤون الموظفين</Text>
          </Separator>
          <ListItem
            icon
            onPress={() =>
              this.state.bIsHrAccess === false
                ? this.warningMsg()
                : this.props.navigation.navigate("ManageNews")
            }
          >
            <Left>
              <Button style={{ backgroundColor: "#FD3C2D" }}>
                <Icon active name="notifications" />
              </Button>
            </Left>
            <Body>
              <Text>الأخبار</Text>
            </Body>
            <Right>
              {Platform.OS === "ios" && <Icon active name="arrow-forward" />}
            </Right>
          </ListItem>
          <ListItem
            icon
            onPress={() =>
              this.state.bIsHrAccess === false
                ? this.warningMsg()
                : this.props.navigation.navigate("ManageSalary")
            }
          >
            <Left>
              <Button style={{ backgroundColor: "#8F8E93" }}>
                <Icon active name="switch" />
              </Button>
            </Left>
            <Body>
              <Text>الرواتب</Text>
            </Body>
            <Right>
              {Platform.OS === "ios" && <Icon active name="arrow-forward" />}
            </Right>
          </ListItem>
          <ListItem
            last
            icon
            onPress={() =>
              this.state.bIsHrAccess === false
                ? this.warningMsg()
                : this.props.navigation.navigate("CreateEmpOfMonth")
            }
          >
            <Left>
              <Button style={{ backgroundColor: "#007AFF" }}>
                <Icon active name="hand" />
              </Button>
            </Left>
            <Body>
              <Text>موظف الشهر</Text>
            </Body>
            <Right>
              {Platform.OS === "ios" && <Icon active name="arrow-forward" />}
            </Right>
          </ListItem>
          <ListItem
            last
            icon
            onPress={() =>
              this.state.bIsHrAccess === false
                ? this.warningMsg()
                : this.props.navigation.navigate("NHCardShowcase")
            }
          >
            <Left>
              <Button style={{ backgroundColor: "#663399" }}>
                <Icon active name="paper-plane" />
              </Button>
            </Left>
            <Body>
              <Text>إحصائيات الإستبيان</Text>
            </Body>
            <Right>
              {Platform.OS === "ios" && <Icon active name="arrow-forward" />}
            </Right>
          </ListItem>
          <Separator bordered noTopBorder>
            <Text style={{ fontSize: 18 }}>تكنولوجيا المعلومات</Text>
          </Separator>
          <ListItem
            icon
            onPress={() =>
              this.state.AdminHR === false
                ? this.warningMsg()
                : this.props.navigation.navigate("Feedback")
            }
          >
            <Left>
              <Button style={{ backgroundColor: "#4CDA64" }}>
                <Icon active name="phone-portrait" />
              </Button>
            </Left>
            <Body>
              <Text>التغذية الراجعة </Text>
            </Body>
            <Right>
              <Badge style={{ backgroundColor: "#FD3C2D" }}>
                <Text>+1</Text>
              </Badge>
            </Right>
          </ListItem>
         {/* <ListItem
            icon
            onPress={() =>
              this.state.AdminHR === false
                ? this.warningMsg()
                : this.LogoutMethod()
            }
          >
            <Left>
              <Button style={{ backgroundColor: "#FD3C" }}>
                <Icon active name="log-out" />
              </Button>
            </Left>
            <Body>
              <Text>تسجيل خروج الجميع</Text>
            </Body>
            <Right>
              {Platform.OS === "ios" && <Icon active name="arrow-forward" />}
            </Right>
          </ListItem>
           <ListItem
            icon
            onPress={() =>
              this.state.AdminHR === false
                ? this.warningMsg()
                : this.props.navigation.navigate("AccordionDefault")
            }
          >
            <Left>
              <Button style={{ backgroundColor: "#aaa" }}>
                <Icon active name="map" />
              </Button>
            </Left>
            <Body>
              <Text>الخرائط</Text>
            </Body>
            <Right>
              {Platform.OS === "ios" && <Icon active name="arrow-forward" />}
            </Right>
          </ListItem> */}
        </Content>
      </Container>
    );
  }
}

export default ManageApp;
