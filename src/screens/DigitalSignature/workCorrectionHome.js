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
  Spinner,
  Badge,
} from "native-base";
import { Dimensions, View, Text } from "react-native";
import * as JsonData from "../../exportsPublic";
const screenWidth = Dimensions.get("window").width;

class workCorrectionHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userArray: [],
      Table1: [],
      Table2: [],
      Table3: [],
      Table4: [],
      Table5: [],
      count1: 0,
      count2: 0,
    };

    this.getDataThisComp = this.getDataThisComp.bind(this);

    const didBlurSubscription = this.props.navigation.addListener(
      "didFocus",
      (payload) => {
        JsonData.storageGet("UserLoggedData").then((value) => {
          this.setState({ userArray: value[0] });
          //console.warn(value);
          this.getDataThisComp();
        });
      }
    );
  }
  // async componentDidMount() {
  //   await JsonData.storageGet("UserLoggedData").then((value) => {
  //     this.setState({ userArray: value[0] });
  //     //console.warn(value);
  //     this.getDataThisComp();
  //   });
  // }

  async getDataThisComp() {
    //console.warn(this.state.userArray);
    await JsonData.getData(
      "WorkHoursCorrection",
      this.state.userArray,
      new Date().toLocaleString()
    ).then((values) => {
      this.setState({
        Table1: values.Table1,
        Table2: values.Table2,
        Table3: values.Table3,
        Table4: values.Table4,
        Table5: values.Table5,
        count1: values.Table1.length,
        count2: values.Table2.length,
      });
      //console.warn(values);
      // console.warn(this.state.Table2);
    });
  }
  reloadData() {
    this.getDataThisComp();
  }
  itemPressed(item) {
    this.props.navigation.navigate(item.strTabScreen, {
      itemPressed: item,
      Table1: this.state.Table1,
      Table2: this.state.Table2,
      Table3: this.state.Table3,
      Table5: this.state.Table5,
      userArray: this.state.userArray,
    });
  }

  render() {
    return (
      <Container>
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
          <Right>
            <Button transparent onPress={() => this.reloadData()}>
              <Icon name="refresh" />
            </Button>
          </Right>
        </Header>

        <Content>
          {this.state.Table4.length > 0 ? ( // condition
            // if true
            <List
              dataArray={this.state.Table4}
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
                      {data.strTabName}
                    </Text>
                    <Text numberOfLines={1} note>
                      {data.strTabDescription}
                    </Text>
                  </Body>
                  <Right>
                    <Badge style={{ backgroundColor: "#FD3C2D" }}>
                      <Text style={{ color: "#FFF" }}>
                        {data.intTabId == 31
                          ? this.state.count1
                          : this.state.count2}
                      </Text>
                    </Badge>
                  </Right>
                </ListItem>
              )}
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
export default workCorrectionHome;
