import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
  Icon,
  List,
} from "native-base";
import { Text, View, StyleSheet, Dimensions } from "react-native";

class vacatonsDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container>
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
          <View style={stylesLocal.nameBox}>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              {this.props.navigation.state.params.tabName}
            </Text>
          </View>

          {this.props.navigation.state.params.RecievedResults.length > 0 ? 
          this.props.navigation.state.params.type == "1" ? (
            <List
              dataArray={this.props.navigation.state.params.RecievedResults}
              renderRow={(data) => (
                <View style={[stylesLocal.card, { borderColor: "#46639E" }]}>
                  <View style={stylesLocal.cardContent}>
                    <Text style={[stylesLocal.description]}>
                      {"من: " + data.dateStart + " - الى: " + data.DateEnd}
                    </Text>
                  </View>
                </View>
              )}
            />
          ) :(<List
            dataArray={this.props.navigation.state.params.RecievedResults}
            renderRow={(data) => (
              <View style={[stylesLocal.card, { borderColor: "#46639E" }]}>
                <View style={stylesLocal.cardContent}>
                <Text style={[stylesLocal.description]}>
                    {data.dateStart + "\n"+ data.DateEnd }
                  </Text>                
                </View>
              </View>
            )}
          />) : (
            <View style={{ flex: 1, alignSelf: "center", margin: 50 }}>
              <Text style={{ color: "gray" }}>لا يوجد تفاصيل</Text>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const stylesLocal = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#eeeeee",
  },
  tasks: {
    flex: 1,
  },
  cardContent: {
    marginLeft: 10,
    marginTop: 10,
  },
  image: {
    width: 25,
    height: 25,
  },
  nameBox: {
    //backgroundColor: "#FFFFFF",
    width: screenWidth / 1.02,
    height: screenHeight / 7,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    shadowColor: "white",
    shadowOpacity: 0.8,
    shadowOffset: {
      height: 0.5,
      width: -0.5,
    },
    borderRadius: 15,
    elevation: 12,
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
    paddingTop: 2,
  },
  card: {
    shadowColor: "#00000021",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: "white",
    flexBasis: "46%",
    padding: 7,
    flexDirection: "row",
    flexWrap: "wrap",
    borderLeftWidth: 6,
  },

  description: {
    fontSize: 18,
    flex: 1,
    fontWeight: "bold",
    color: "#46639E",
    alignSelf: "center",
  },
  date: {
    fontSize: 15,
    flex: 1,
    color: "#696969",
    marginTop: 5,
  },
});

export default vacatonsDetails;
