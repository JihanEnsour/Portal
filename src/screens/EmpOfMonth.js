import React, { Component } from "react";
import { StyleSheet, FlatList, Dimensions } from "react-native";
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
  View,
  Spinner,
  Grid,
  Row,
  Col,
} from "native-base";
import styles from "./styles";
import { API_LINK_PUBLIC } from "../exportsPublic";

const screenWidth = Dimensions.get("window").width;

class EmpOfMonth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Emp_ID: "",
      strDBName: "",
      tabName: "",
      results: {
        intMonth: undefined,
        intYear: undefined,
        strName: undefined,
      },
    };
  }
  componentDidMount() {
    var url = API_LINK_PUBLIC +  "Home/GetEmployeeOfTheMonthData";
    return fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({ results: JSON.parse(responseData) });
        return responseData;
      })
      .catch((error) => console.warn(error));
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
          {this.state.results.length > 0 ? ( // condition
            // if true
            <FlatList
              style={stylesLocal.tasks}
              columnWrapperStyle={stylesLocal.listContainer}
              data={this.state.results}
              keyExtractor={(item) => {
                return item.intYear;
              }}
              renderItem={({ item }) => {
                return (
                  <Grid style={[stylesLocal.card, { borderColor: item.Color }]}>
                    <Row>
                      <Col style={{ width: screenWidth / 3 }}>
                        <Text
                          style={[
                            {
                              color: "#46639E",
                              fontSize: 24,
                              fontWeight: "bold",
                              textAlign: "center",
                            },
                          ]}
                        >
                          {item.intMonth + "." + item.intYear}
                        </Text>
                      </Col>
                      <Col style={{ width: screenWidth / 2 }}>
                        <Text
                          style={[
                            stylesLocal.description,
                            { textAlign: "center" },
                          ]}
                        >
                          {item.strName}
                        </Text>
                      </Col>
                    </Row>
                  </Grid>
                );
              }}
            />
          ) : (
            <View style={{ flex: 1, alignSelf: "center", margin: 50 }}>
              <Spinner color="#46639E" />
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

const stylesLocal = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#eeeeee",
  },
  tasks: {
    flex: 1,
    marginTop: 10,
  },
  cardContent: {
    marginLeft: 20,
    marginTop: 10,
  },
  image: {
    width: 20,
    height: 20,
  },

  card: {
    shadowColor: "#00000021",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    borderColor: "#46639E",
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: "white",
    flexBasis: "46%",
    padding: 7,
    flexDirection: "row",
    flexWrap: "wrap",
    borderLeftWidth: 6,
  },

  description: {
    paddingRight: 10,
    fontSize: 17,
    flex: 1,
    color: "#2c3e50",
    fontWeight: "bold",
  },
  date: {
    fontSize: 15,
    flex: 1,
    color: "#696969",
    marginTop: 5,
  },
});

export default EmpOfMonth;
