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
  Toast,
} from "native-base";
import styles from "./styles";
import { API_LINK_PUBLIC } from "../exportsPublic";

class TaskDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabName: "",
      strEmployee: "",
      strDBName: "",
    };
  }
  async deleteTask() {
    if (this.props.navigation.state.params.SentResults.statusType === "معلقة") {
      var url =
        API_LINK_PUBLIC +  "Home/DeleteSentTask?taskId=" +
        this.props.navigation.state.params.SentResults.id;
      //console.warn(url);
      return fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          Toast.show({
            text: "تم حذف المهمة",
            type: "warning",
            duration: 2000,
          });
          this.props.navigation.navigate("NHForm", { tabName: "المرسلة" });
          return responseData;
        })
        .catch((error) => console.warn(error));
    } else {
      Toast.show({
        text: "لا يمكنك حذف مهمة تم العمل عليها من قبل المستلم!",
        type: "danger",
        duration: 4000,
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
            <Title>{this.props.navigation.state.params.tabName}</Title>
          </Body>
          <Right>
            {this.props.navigation.state.params.bDeleteBtn ? (
              <Button transparent onPress={() => this.deleteTask()}>
                <Icon name="trash" />
              </Button>
            ) : null}
          </Right>
        </Header>

        <Content padder>
          <Card style={styles.mb}>
            <CardItem header bordered first>
              <Text>
                {"العنوان: " +
                  this.props.navigation.state.params.SentResults.title}
              </Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                  {"التاريخ: " +
                    this.props.navigation.state.params.SentResults.date}
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                  {"التاريخ النهائي: " +
                    this.props.navigation.state.params.SentResults.endDate}
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                  {"حالة المهمة: " +
                    this.props.navigation.state.params.SentResults.statusType}
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                  {"مرسل المهمة: " +
                    this.props.navigation.state.params.SentResults.SenderName}
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                  {"مستلم المهمة: " +
                    this.props.navigation.state.params.SentResults.ReaciverName}
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                  {"مدير مستلم المهمة: " +
                    this.props.navigation.state.params.SentResults.ManagerName}
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text selectable>
                  {"الموضوع: " +
                    this.props.navigation.state.params.SentResults.content}
                </Text>
              </Body>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text selectable>
                  {"سبب التأجيل: " +
                    this.props.navigation.state.params.SentResults.postponeNote}
                </Text>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

export default TaskDetails;
