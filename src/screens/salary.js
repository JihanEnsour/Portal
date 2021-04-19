import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Item,
  Label,
  Grid,
  Body,
  Left,
  Right,
  Icon,
  Row,
  Text,
  Separator,
  Card,
  CardItem,
  List,
  Toast,
  View,
  Col,
  Picker,
} from "native-base";
import { I18nManager, Dimensions } from "react-native";
import styles from "./styles";
import { API_LINK_PUBLIC } from "../exportsPublic";

const screenWidth = Dimensions.get("window").width;

class Salary extends Component {
  constructor(props) {
    super(props);
    I18nManager.forceRTL(true);
    this.state = {
      Emp_ID: "",
      strDBName: "",
      tabName: "",
      months: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      years: [
        new Date().getFullYear().toString(),
        (new Date().getFullYear() - 1).toString(),
      ],
      month: 1,
      year: new Date().getFullYear(),
      results: {
        labelEn: "",
        labelAr: "",
        value: "",
      },
    };

    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    //this.getMonths();
  }

  async getData() {
    if (this.state.month != "" && this.state.year != "") {
      if (
        this.state.month >= 1 &&
        this.state.month <= 12 &&
        this.state.year >= 2018
      ) {
        try {
          var url =
            API_LINK_PUBLIC +
            "Home/GetEmployeeSalaryData?userId=" +
            this.props.navigation.state.params.strEmployee +
            "&DbName=" +
            this.props.navigation.state.params.strDBName +
            "&month=" +
            this.state.month +
            "&year=" +
            this.state.year;
          //console.warn(url);

          const response = await fetch(url, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          const responseData = await response.json();
          this.setState({ results: JSON.parse(responseData) });

          // console.warn(responseData);
          // console.warn(this.state.results);
          return responseData;
        } catch (error) {
          return console.warn(error);
        }
      } else {
        Toast.show({
          text: "يمكنك الإستعلام فقط عن آخر سنتين",
          buttonText: "Ok",
          type: "danger",
        });
      }
    } else {
      Toast.show({
        text: "جميع الحقول إلزامية!",
        buttonText: "Ok",
        type: "danger",
      });
    }
  }

  updateValues(text, field) {
    if (field === "month") {
      this.setState({
        month: text,
      });
    } else if (field === "year") {
      this.setState({
        year: text,
      });
    }
  }

  onValueChange(value) {
    this.setState({ month: value });
  }
  onValueChangeYear(value) {
    this.setState({ year: value });
  }

  render() {
    let mm = this.state.months.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />;
    });
    let yy = this.state.years.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />;
    });

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
          <Grid style={{ flex: 1, margin: 10 }}>
            <Row>
              <Col>
                <Item regular style={{ width: screenWidth / 2.2 }}>
                  <Label>شهر</Label>
                  <Picker
                    mode="dropdown"
                    iosHeader={<Icon name="ios-arrow-down" />}
                    placeholder="شهر"
                    style={{
                      flex: 1,
                      paddingBottom: 10,
                    }}
                    textStyle={{ textAlign: "center", alignSelf: "flex-end" }}
                    itemStyle={{
                      marginLeft: 0,
                      paddingLeft: 10,
                    }}
                    selectedValue={this.state.month}
                    onValueChange={(value) => this.onValueChange(value)}
                  >
                    {mm}
                  </Picker>
                </Item>
              </Col>
              <Col>
                <Item regular style={{ width: screenWidth / 2.2 }}>
                  <Label>سنة</Label>
                  <Picker
                    mode="dropdown"
                    iosHeader={<Icon name="ios-arrow-down" />}
                    placeholder="سنة"
                    style={{
                      width: undefined,
                      paddingBottom: 10,
                    }}
                    textStyle={{ textAlign: "center", alignSelf: "flex-end" }}
                    itemStyle={{
                      marginLeft: 0,
                      paddingLeft: 10,
                    }}
                    selectedValue={this.state.year}
                    onValueChange={(value) => this.onValueChangeYear(value)}
                  >
                    {yy}
                  </Picker>
                </Item>
              </Col>
            </Row>
            <Row style={{ margin: 10 }}>
              <Button
                style={{ width: screenWidth - 50 }}
                onPress={() => this.getData()}
              >
                <Icon style={{ textAlign: "right" }} name="search" />
                <Text style={styles.buttonText}>بـــــحــث</Text>
              </Button>
            </Row>
          </Grid>
          {this.state.results.length > 0 ? ( // condition
            // if true
            <List
              dataArray={this.state.results}
              renderRow={(data) => (
                <Card style={styles.mb}>
                  {data.labelEn === "Root" ? (
                    <Separator bordered>
                      <Text style={{ fontWeight: "600", fontSize: 20 }}>
                        {data.labelAr}
                      </Text>
                    </Separator>
                  ) : (
                    <CardItem bordered>
                      <Body>
                        <Text> {data.labelAr} </Text>
                      </Body>
                      <Right>
                        <Text> {data.value} </Text>
                      </Right>
                    </CardItem>
                  )}
                </Card>
              )}
            />
          ) : (
            <View style={{ flex: 1, alignSelf: "center", margin: 50 }}>
              <Text style={{ color: "gray" }}>لا يوجد بيانات</Text>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

export default Salary;
