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
  Body,
  Left,
  Right,
  Footer,
  FooterTab,
  Picker,
  Item,
  Label,
  Form,
  Toast
} from "native-base";
import styles from "./styles";
import DialogInput from "react-native-dialog-input";
import { API_LINK_PUBLIC } from "../exportsPublic";

class ProcessTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postponeNote: "",
      isDialogVisible: false,
      selected1: "0",
      tabName: "",
      strEmployee: "",
      strDBName: ""
    };

    //console.warn(this.props.navigation.state.params.RecievedResults.id);
  }
  onValueChange(value) {
    this.setState({
      selected1: value
    });
    // console.warn(this.state.selected1);
    // console.warn(value);
    if (value === "4") {
      this.showDialog(true);
    }
    else {
      this.setState({
        postponeNote: ""
      });
    }
  }
  async updateTask() {
    if (this.state.selected1 !== "0") {
      var url = API_LINK_PUBLIC +  "Home/UpdateTask?taskId=" + this.props.navigation.state.params.RecievedResults.id + "&statusType=" + this.state.selected1 + "&postponeNote=" + this.state.postponeNote;
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
            text: "تم تحديث حالة المهمة",
            type: "success",
            duration: 5000
          });
          return responseData;
        })
        .catch(error => console.warn(error));
    }
    else {
      Toast.show({
        text: "يرجى تحديد حالة المهمة",
        type: "warning",
        duration: 5000
      });
    }
  }
  showDialog(hereBool) {
    this.setState({
      isDialogVisible: hereBool
    });
  }
  setPostponeNote(txt) {
    if (txt != null && txt !== "") {
      this.setState({
        postponeNote: txt
      });
      this.showDialog(false);
    } else {
      alert("يرجى تحديد سبب التأجيل");
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
            <Title>{this.props.navigation.state.params.tabName}</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          <Card style={styles.mb}>
            <CardItem header bordered first>
              <Text>{"العنوان: " + this.props.navigation.state.params.RecievedResults.title}</Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                  {"التاريخ: " + this.props.navigation.state.params.RecievedResults.date}
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                  {"التاريخ النهائي: " + this.props.navigation.state.params.RecievedResults.endDate}
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                  {"حالة المهمة: " + this.props.navigation.state.params.RecievedResults.statusType}
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                  {"مرسل المهمة: " + this.props.navigation.state.params.RecievedResults.SenderName}
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                  {"مستلم المهمة: " + this.props.navigation.state.params.RecievedResults.ReaciverName}
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                  {"مدير مستلم المهمة: " + this.props.navigation.state.params.RecievedResults.ManagerName}
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text selectable>
                  {"الموضوع: " + this.props.navigation.state.params.RecievedResults.content}
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text selectable>
                  {"سبب التأجيل: " + this.props.navigation.state.params.RecievedResults.postponeNote}
                </Text>
              </Body>
            </CardItem>
          </Card>
          <DialogInput
            isDialogVisible={this.state.isDialogVisible}
            title={"السبب"}
            message={"يرجى ذكر سبب التأجيل"}
            hintInput={"سبب التأجيل..."}
            cancelText={"إلغاء"}
            submitText={"موافق"}
            modalStyleProps={{ textAlign: "right", alignContent: "flex-start", }}
            submitInput={(inputText) => { this.setPostponeNote(inputText) }}
            closeDialog={() => { this.showDialog(false) }} />
        </Content>
        <Footer>
          <FooterTab>
            <Form>
              <Item inlineLabel>
                <Label style={{ color: "white" }}>بيان الحالة</Label>
                <Picker
                  style={{ width: 160, color: "white", fontWeight: "600" }}
                  iosHeader="Select one"
                  mode="dropdown"
                  selectedValue={this.state.selected1}
                  onValueChange={this.onValueChange.bind(this)}>
                  <Item label="-- إختر --" value="0" />
                  <Item label="قيد التنفيذ" value="1" />
                  <Item label="منفذّة" value="2" />
                  <Item label="لا يمكن التنفيذ" value="3" />
                  <Item label="مؤجلة" value="4" />
                </Picker>
                <Button success style={{ marginTop: 4 }} onPress={() => this.updateTask()}>
                  <Icon active name="checkmark-circle" />
                  <Text style={{ color: "white", fontWeight: "600" }}>حفظ</Text>
                </Button>
              </Item>

            </Form>

          </FooterTab>
        </Footer>

      </Container >
    );
  }
}

export default ProcessTask;
