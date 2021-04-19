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
  Left,
  Right,
  Body,
  Text,
  List,
  View,
  Spinner,
  Badge,
  Grid,
  Row,
  Col
} from "native-base";
import styles from "./styles";
import Pie from "react-native-pie";
import { API_LINK_PUBLIC } from "../exportsPublic";

const coloring = ["#E14343", "#ffc125", "#1898", "#00BFFF", "#663399", "#aaa", "#5cb85c"];
class NHCardShowcase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: {
        subject: undefined,
        question: undefined,
        countAll: undefined,
        countSpecific: undefined,
        series: undefined,
        options: undefined,
        colors: undefined
      }
    };
    this.getData = this.getData.bind(this);
    this.getData();
  }
  async getData() {
    var url = API_LINK_PUBLIC +  "Home/GetSurviesPercentage";
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
        // console.warn(data[0].colors);
        //console.warn(data[0].options);
        this.setState({ results: data });
        return responseData;
      })
      .catch(error => console.warn(error));
  }
  reloadData() {
    this.getData();
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
            <Title>إحصائيات الإستبيان</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.reloadData()}>
              <Icon name="refresh" />
            </Button>
          </Right>
        </Header>

        <Content padder>
          {this.state.results.length > 0
            ? <List
                dataArray={this.state.results}
                renderRow={data =>
                  <Card style={styles.mb} bordered>
                    <CardItem style={{ paddingVertical: 0 }} bordered>
                      <Text style={{ fontSize: 18 }}>
                        {"الموضوع: " + data.subject}
                      </Text>
                    </CardItem>
                    <CardItem bordered>
                      <Text style={{ fontSize: 18 }}>
                        {"السؤال: " + data.question}
                      </Text>
                    </CardItem>
                    <CardItem style={{ alignSelf: "center" }}>
                      <Pie
                        radius={100}
                        series={data.series}
                        colors={coloring}
                        backgroundColor={"#aaa"}
                      />
                    </CardItem>
                    <CardItem bordered>
                      <Badge primary>
                        <Text>
                          {"عدد الكلي للإجابات: " + data.countAll}
                        </Text>
                      </Badge>
                    </CardItem>
                    <CardItem bordered>
                      <Grid>
                        {data.series.map((item, index) => {
                          return (
                            <Row>
                              <Col>
                                <Text>
                                  {data.options[index]}
                                </Text>
                              </Col>
                              <Col>
                                <Badge primary>
                                  <Text>
                                    {data.countAll +
                                      "/" +
                                      data.countSpecific[index]}
                                  </Text>
                                </Badge>
                              </Col>
                              <Col>
                                <Badge
                                  style={[
                                    styles.mb,
                                    { backgroundColor: coloring[index] }
                                  ]}
                                >
                                  <Text>
                                    {item + "% "}
                                  </Text>
                                </Badge>
                              </Col>
                            </Row>
                          );
                        })}
                      </Grid>
                    </CardItem>
                  </Card>}
              />
            : <View style={{ flex: 1, alignSelf: "center", margin: 50 }}>
                <Spinner style={{ color: "#00BFFF" }} />
              </View>}
        </Content>
      </Container>
    );
  }
}

export default NHCardShowcase;
