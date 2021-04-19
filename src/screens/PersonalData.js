import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Text,
  View,
  Left,
  Body,
  Right,
  Footer,
  FooterTab,
  Toast,
  Item,
  Grid,
  Row,
  Col
} from "native-base";
import {
  I18nManager,
  StyleSheet,
  AsyncStorage
} from "react-native";
import DialogInput from "react-native-dialog-input";
import styles from "./styles";
import { API_LINK_PUBLIC } from "../exportsPublic";

const widthOne = "35%";
const widthTwo = "65%";

class PersonalData extends Component {
  constructor(props) {
    super(props);
    I18nManager.forceRTL(true);
    this.state = {
      isDialogVisible: false,
      Emp_ID: "",
      strDBName: "",
      tabName: "",

      lngEmployee: "",
      strEmployee: "",
      EmployeeName: "",
      strOrganizationAr: "",
      strJobAr: "",
      NumberOfDaysPreviousYear: "",
      dateStart: "",

      sngOpenBalance: "",
      DeserveThisYear: "",
      ExtraDay: "",
      Consumer: "",
      Disease: "",
      LeaveTotal: "",
      GeneralBalance: "",
      NextGeneralBalance: "",
      PeriodBalance: ""
    };
    this.getEmployeeData = this.getEmployeeData.bind(this);
    this.getEmployeeData();
  }
  getEmployeeData() {
    var url =
      API_LINK_PUBLIC +  "Home/GetBasicEmployeeData?userId=" +
      this.props.navigation.state.params.strEmployee +
      "&DbName=" +
      this.props.navigation.state.params.strDBName;
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
        var data = JSON.parse(responseData);
        // console.warn(data);
        this.setState({ lngEmployee: data[0].lngEmployee });
        this.setState({ strEmployee: data[0].strEmployee });
        this.setState({ EmployeeName: data[0].EmployeeName });
        this.setState({ strOrganizationAr: data[0].strOrganizationAr });
        this.setState({ strJobAr: data[0].strJobAr });
        this.setState({ dateStart: data[0].dateStart });
        return responseData;
      })
      .catch(error => console.warn(error));
  }

  changePassword(text) {
    this.showDialog(false);
    if (text != null && text != "") {
      var url =
        API_LINK_PUBLIC +  "Home/GetNewPassword?userId=" +
        this.state.strEmployee +
        "&company=" +
        this.props.navigation.state.params.strDBName +
        "&password=" +
        text;
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
            text: "تم تغيير كلمة السر بنجاح",
            type: "success",
            duration: 8000
          });

          AsyncStorage.setItem("UserLoggedData", "");
          this.props.navigation.navigate("Home");

          return responseData;
        })
        .catch(error => console.warn(error));
    } else {
      Toast.show({
        text: "لم يتم تغيير كلمة المرور",
        buttonText: "موافق",
        type: "danger",
        duration: 8000
      });
    }
  }

  activateDeactivatePhone(val) {
    var url =
      API_LINK_PUBLIC +  "Home/ActivateEmployeePhone?userId=" +
      this.state.strEmployee +
      "&company=" +
      this.props.navigation.state.params.strDBName +
      "&activate=" +
      val;
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
          text: "تم ",
          type: "success",
          duration: 8000
        });

        return responseData;
      })
      .catch(error => console.warn(error));
  }

  showDialog(hereBool) {
    this.setState({
      isDialogVisible: hereBool
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
          <View>
            <View style={stylesLocal.body}>
              <View style={stylesLocal.bodyContent}>
                <Grid>
                  <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
                    <Col style={{ width: widthOne }}>
                      <Text style={[stylesLocal.description]}>{"الإسم"}</Text>
                    </Col>
                    <Col style={{ width: widthTwo }}>
                      <Text style={[stylesLocal.description]}>
                        {this.state.EmployeeName}
                      </Text>
                    </Col>
                  </Row>
                  <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
                    <Col style={{ width: widthOne }}>
                      <Text style={[stylesLocal.description]}>
                        {"رقم الموظف"}
                      </Text>
                    </Col>
                    <Col style={{ width: widthTwo }}>
                      <Text style={[stylesLocal.description]}>
                        {this.state.strEmployee}
                      </Text>
                    </Col>
                  </Row>
                  <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
                    <Col style={{ width: widthOne }}>
                      <Text style={[stylesLocal.description]}>{"القسم"}</Text>
                    </Col>
                    <Col style={{ width: widthTwo }}>
                      <Text style={[stylesLocal.description]}>
                        {this.state.strOrganizationAr}
                      </Text>
                    </Col>
                  </Row>
                  <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
                    <Col style={{ width: widthOne }}>
                      <Text style={[stylesLocal.description]}>{"الوظيفة"}</Text>
                    </Col>
                    <Col style={{ width: widthTwo }}>
                      <Text style={[stylesLocal.description]}>
                        {this.state.strJobAr}
                      </Text>
                    </Col>
                  </Row>
                  <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
                    <Col style={{ width: widthOne }}>
                      <Text style={[stylesLocal.description]}>
                        {"بداية عقد العمل"}
                      </Text>
                    </Col>
                    <Col style={{ width: widthTwo }}>
                      <Text style={[stylesLocal.description]}>
                        {this.state.dateStart}
                      </Text>
                    </Col>
                  </Row>
                </Grid>

                <View style={[stylesLocal.card, { borderColor: "#f53d3d" }]}>
                  <View style={stylesLocal.cardContent}>
                    <Text style={[stylesLocal.description]}>
                      {" أظهر رقم هاتفي للموظفين في جهات الإتصال!"}
                    </Text>
                  </View>
                  <Item inlineLabel>
                    <Button
                      success
                      onPress={() => this.activateDeactivatePhone(true)}
                      style={{ justifyContent: "flex-start", margin: 8 }}
                    >
                      <Text>إظهار</Text>
                    </Button>
                    <Button
                      danger
                      onPress={() => this.activateDeactivatePhone(false)}
                      style={{ justifyContent: "flex-start", margin: 8 }}
                    >
                      <Text>إخفاء</Text>
                    </Button>
                  </Item>
                </View>
              </View>
            </View>
          </View>
          <DialogInput
            isDialogVisible={this.state.isDialogVisible}
            title={"كلمة المرور الجديدة"}
            message={"الرجاء إدخال كلمة المرور الجديدة!"}
            hintInput={"كلمة المرور"}
            submitText={"موافق"}
            cancelText={"إلغاء"}
            submitInput={inputText => {
              this.changePassword(inputText);
            }}
            closeDialog={() => {
              this.showDialog(false);
            }}
          />
        </Content>
        <Footer>
          <FooterTab>
            <Button onPress={() => this.showDialog(true)}>
              <Icon active name="barcode" />
              <Text style={{ fontSize: 17 }}>تغيير كلمة السر</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
const stylesLocal = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#eeeeee"
  },
  tasks: {
    flex: 1
  },
  cardContent: {
    marginLeft: 20,
    marginTop: 10
  },
  image: {
    width: 25,
    height: 25
  },

  card: {
    shadowColor: "#00000021",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
     elevation: 12,

    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: "white",
    flexBasis: "46%",
    padding: 7,
    flexDirection: "row",
    flexWrap: "wrap",
    borderLeftWidth: 6
  },

  description: {
    fontSize: 16,
    flex: 1,
    fontWeight: "bold",
    color: "#2c3e50",
    alignSelf: "flex-start"
  },
  date: {
    fontSize: 15,
    flex: 1,
    color: "#696969",
    marginTop: 5
  }
});

export default PersonalData;
