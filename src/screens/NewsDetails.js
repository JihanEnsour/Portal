import React, { Component } from "react";
import {  Linking } from "react-native";
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
  Thumbnail,
  Left,
  Body,
  Right,
  List,
  View,
} from "native-base";
import styles from "./styles";
import { API_LINK_PUBLIC } from "../exportsPublic";

class NewsDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: {
        fileId: undefined,
        fileType: "",
        fileData: "",
        fileName: "",
      },
    };

    this.getData = this.getData.bind(this);
    this.getData();
    //console.warn(this.props.navigation.state.params.RecievedResults.idNews);
  }
  async getData() {
    var url =
      API_LINK_PUBLIC +  "Home/GetBasicCompanyNewsFiles?intId=" +
      this.props.navigation.state.params.RecievedResults.idNews;
    return fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        var data = JSON.parse(responseData);
        //console.warn(data);
        this.setState({ results: data });
        // this.setState({ fileData: data[0].fileData });
        // this.setState({ fileType: data[0].fileType });
        return responseData;
      })
      .catch((error) => console.warn(error));
  }

  showLinkWhatContains(filedd) {
    Linking.openURL(filedd).catch((err) =>
      console.error("An error occurred", err)
    );
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
            <Title>
              {this.props.navigation.state.params.RecievedResults.title}
            </Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          <Card style={styles.mb}>
            <CardItem bordered>
              <Left>
                <Body>
                  <Text selectable style={{ color: "blue" }}>
                    {this.props.navigation.state.params.RecievedResults.title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    note
                    style={{ textAlign: "right", alignSelf: "flex-start" }}
                  >
                    {this.props.navigation.state.params.RecievedResults.year +
                      "-" +
                      this.props.navigation.state.params.RecievedResults.month +
                      "-" +
                      this.props.navigation.state.params.RecievedResults.day}
                  </Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody bordered style={{ padding: 5, margin: 10 }}>
              <Text selectable style={{ alignSelf: "flex-end" }}>
                {this.props.navigation.state.params.RecievedResults.content +
                  "\n\n"}
              </Text>
            </CardItem>

            {this.state.results.length > 0 ? (
              <List
                dataArray={this.state.results}
                renderRow={(data) => (
                  <CardItem style={{ paddingVertical: 0 }} bordered>
                    <Button transparent>
                      <Thumbnail
                        square
                        source={{
                          uri:
                            "https://img.icons8.com/bubbles/50/000000/attach.png",
                        }}
                        style={{ width: 40, height: 40 }}
                      />
                      <Text
                        onPress={() => this.showLinkWhatContains(data.fileData)}
                      >
                        {" "}
                        {data.fileName}{" "}
                      </Text>
                    </Button>
                  </CardItem>
                )}
              />
            ) : (
              <View style={{ flex: 1, alignSelf: "center", margin: 50 }}>
                <Text style={{ color: "#46639E" }}>لا يوجد مرفقات</Text>
              </View>
            )}
          </Card>
        </Content>
      </Container>
    );
  }
}

export default NewsDetails;
