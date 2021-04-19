import React, { Component } from "react";
import { Linking, Clipboard, StyleSheet } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Text,
  Body,
  Left,
  Right,
  Toast,
  Grid,
  Row,
  Col,
  View,
  Item
} from "native-base";

import styles from "./styles";

const width1 = "30%";
const width2 = "70%";

class EmpsConatctDetails extends Component {
  copyData(email) {
    Clipboard.setString(email);
    Toast.show({
      text: "تم النسخ!",
      type: "success",
      duration: 3000
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
          <Grid>
            <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
              <Col style={{ width: width1 }}>
                <Text style={{ color: "#46639E" }}>الاسم</Text>
              </Col>
              <Col style={{ width: width2 }}>
                <Text style={{ alignSelf: "flex-start" }}>
                  {this.props.navigation.state.params.RecievedResults.Name}
                </Text>
              </Col>
            </Row>
            <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
              <Col style={{ width: width1 }}>
                <Text style={{ color: "#46639E" }}>الشركة</Text>
              </Col>
              <Col style={{ width: width2 }}>
                <Text style={{ alignSelf: "flex-start" }}>
                  {this.props.navigation.state.params.RecievedResults.Company}
                </Text>
              </Col>
            </Row>
            <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
              <Col style={{ width: width1 }}>
                <Text style={{ color: "#46639E" }}>الوظيفة</Text>
              </Col>
              <Col style={{ width: width2 }}>
                <Text style={{ alignSelf: "flex-start" }}>
                  {this.props.navigation.state.params.RecievedResults.Job}
                </Text>
              </Col>
            </Row>
            {this.props.navigation.state.params.RecievedResults.Mobile !==
            "Hidden" ? (
              <Row style={[stylesLocal.card, { borderColor: "green" }]}>
                <Col style={{ width: width1 }}>
                  <Text style={{ color: "#46639E" }}>الهاتف</Text>
                </Col>
                <Col style={{ width: width2 }}>
                  <View style={stylesLocal.cardContent}>
                    <Text
                      style={[stylesLocal.description, { paddingBottom: 5 }]}
                    >
                      {this.props.navigation.state.params.RecievedResults
                        .Mobile + "\n"}
                    </Text>
                    <Item inlineLabel>
                      <Button
                        success
                        style={{
                          marginRight: 5
                        }}
                        onPress={() =>
                          Linking.openURL(
                            `tel:${this.props.navigation.state.params.RecievedResults.Mobile}`
                          )
                        }
                      >
                        <Icon name="call" />
                      </Button>
                      <Button
                        onPress={() =>
                          this.copyData(
                            this.props.navigation.state.params.RecievedResults
                              .Mobile
                          )
                        }
                      >
                        <Icon name="copy" />
                      </Button>
                    </Item>
                  </View>
                </Col>
              </Row>
            ) : null}
            {this.props.navigation.state.params.RecievedResults.Phone !== "" &&
            this.props.navigation.state.params.RecievedResults.Phone !==
              "Hidden" ? (
              <Row style={[stylesLocal.card, { borderColor: "green" }]}>
                <Col style={{ width: width1 }}>
                  <Text style={{ color: "#46639E" }}>الهاتف</Text>
                </Col>
                <Col style={{ width: width2 }}>
                  <View style={stylesLocal.cardContent}>
                    <Text
                      style={[stylesLocal.description, { paddingBottom: 5 }]}
                    >
                      {this.props.navigation.state.params.RecievedResults
                        .Phone + "\n"}
                    </Text>
                    <Item inlineLabel>
                      <Button
                        success
                        style={{
                          marginRight: 5
                        }}
                        onPress={() =>
                          Linking.openURL(
                            `tel:${this.props.navigation.state.params.RecievedResults.Phone}`
                          )
                        }
                      >
                        <Icon name="call" />
                      </Button>
                      <Button
                        onPress={() =>
                          this.copyData(
                            this.props.navigation.state.params.RecievedResults
                              .Phone
                          )
                        }
                      >
                        <Icon name="copy" />
                      </Button>
                    </Item>
                  </View>
                </Col>
              </Row>
            ) : null}

            <Row style={[stylesLocal.card, { borderColor: "green" }]}>
              <Col style={{ width: width1 }}>
                <Text style={{ color: "#46639E" }}>رقم الأرضي</Text>
              </Col>
              <Col style={{ width: width2 }}>
                <View style={stylesLocal.cardContent}>
                  <Text style={[stylesLocal.description, { paddingBottom: 5 }]}>
                    {this.props.navigation.state.params.RecievedResults
                      .Telephone + "\n"}
                  </Text>

                  <Item inlineLabel>
                    <Button
                      success
                      style={{
                        marginRight: 5
                      }}
                      onPress={() =>
                        Linking.openURL(
                          `tel:${this.props.navigation.state.params.RecievedResults.Telephone}`
                        )
                      }
                    >
                      <Icon name="call" />
                    </Button>
                    <Button
                      onPress={() =>
                        this.copyData(
                          this.props.navigation.state.params.RecievedResults
                            .Telephone
                        )
                      }
                    >
                      <Icon name="copy" />
                    </Button>
                  </Item>
                </View>
              </Col>
            </Row>
            <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
              <Col style={{ width: width1 }}>
                <Text style={{ color: "#46639E" }}>البريد الإلكتروني</Text>
              </Col>
              <Col style={{ width: width2 }}>
                <View style={stylesLocal.cardContent}>
                  <Text style={[stylesLocal.description, { paddingBottom: 5 }]}>
                    {this.props.navigation.state.params.RecievedResults.Email}
                  </Text>
                  <Item inlineLabel>
                    <Button
                      style={{
                        marginRight: 5
                      }}
                      onPress={() =>
                        this.copyData(
                          this.props.navigation.state.params.RecievedResults
                            .Email
                        )
                      }
                    >
                      <Icon name="copy" />
                      <Text>نسخ</Text>
                    </Button>
                  </Item>
                </View>
              </Col>
            </Row>
          </Grid>
        </Content>
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
    fontSize: 17,
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

export default EmpsConatctDetails;
