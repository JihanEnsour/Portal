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
  ListItem,
  List,
} from "native-base";
import { Text, View } from "react-native";

class SelfWorkCorrectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Table1: [],
      Table3: [],
      Table5: [],
    };
  }

  itemPressed(item) {
    this.props.navigation.navigate("CorrectTheWrok", {
      itemPressed: item,
      Table3: this.props.navigation.state.params.Table3,
      Table5: this.props.navigation.state.params.Table5,
      userArray: this.props.navigation.state.params.userArray,
    });
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
          {this.props.navigation.state.params.Table1.length > 0 &&
          this.props.navigation.state.params.Table3.length > 0 ? (
            <List
              dataArray={this.props.navigation.state.params.Table1}
              renderRow={(data) => (
                <ListItem onPress={() => this.itemPressed(data)}>
                  <Body>
                    <Text
                      style={{
                        color: "#46639E",
                        fontWeight: "600",
                        fontSize: 20,
                      }}
                    >
                      {data.Day}
                    </Text>
                    <Text
                      numberOfLines={1}
                      note
                      style={{ textAlign: "right", alignSelf: "flex-start" }}
                    >
                      {data.dateIs}
                    </Text>
                  </Body>
                  <Right>
                    <Icon name="arrow-back" />
                  </Right>
                </ListItem>
              )}
            />
          ) : (
            <View style={{ flex: 1, alignSelf: "center", margin: 50 }}>
              <Text style={{ color: "gray" }}>لا يوجد أخطاء بالدوام</Text>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

export default SelfWorkCorrectionList;
