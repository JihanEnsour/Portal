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
  Grid,
  Row,
  Col,
  Toast,
} from "native-base";
import {
  StyleSheet,
  Text,
  PermissionsAndroid,
  Platform,
  Alert,
} from "react-native";
import * as geolib from "geolib";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import * as JSONData from "../../exportsPublic";

const widthOne = "10%";
const widthTwo = "90%";

class AccordionCustomHeaderContent extends Component {
  watchId = null;
  constructor(props) {
    super(props);
    this.state = {
      userArray: [],
      detailsAfter: [],
      isMapReady: false,
      latitude: 0,
      longitude: 0,
      error: null,
      getDistance: null,
      getPreciseDistance: null,
      lessThanFive: false,
      disableBtns: true,
    };
  }
  async componentDidMount() {
    var value = await JSONData.storageGet("UserLoggedData");
    this.setState({ userArray: value[0] });
    //console.warn("here: " + this.state.userArray.strName);

    this.getLocation();
  }

  getResult = async (actionResult, extraData) => {
    const results = await JSONData.getData(
      actionResult,
      this.state.userArray,
      extraData
    );
    if (results) {
      //console.warn(results[0]);
      this.setState({
        detailsAfter: results[0],
        disableBtns: results[0].disableBtns === "true" ? true : false,
      });
      //console.warn(this.state.disableBtns);
    }
  };

  hasLocationPermission = async () => {
    if (
      Platform.OS === "ios" ||
      (Platform.OS === "android" && Platform.Version < 23)
    ) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      Toast.show({ text: "Location permission denied by user." });
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Toast.show({ text: "Location permission revoked by user." });
    }

    return false;
  };

  onMapLayout = () => {
    this.setState({ isMapReady: true });
  };

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) return;

    this.watchID = Geolocation.getCurrentPosition(
      (position) => {
        // this.setState({ latitude: position.coords.latitude });
        // this.setState({ longitude: position.coords.longitude });
        var d1 = geolib.getDistance(position.coords, {
          latitude: 32.0378041,
          longitude: 35.6955207,
        });
        var d2 = geolib.getPreciseDistance(position.coords, {
          latitude: 32.0378041,
          longitude: 35.6955207,
        });

        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          getDistance: d1,
          getPreciseDistance: d2,
          lessThanFive: d1 <= 5 && d2 <= 5 ? true : false,
        });

        var coords =
          position.coords.latitude + ", " + position.coords.longitude;
        this.getResult("GetMachinesLocations", coords); //"31.985064, 35.897729"
      },
      (error) => {
        this.setState({ error: error });
        console.warn(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 50,
        forceRequestLocation: true,
      }
    );
  };

  componentWillUnmount() {
    Geolocation.clearWatch(this.watchID);
  }

  showAlert() {
    var msg =
      "موقع الحالي: " +
      this.state.detailsAfter.machineName +
      "\n" +
      "المسافة: " +
      this.state.detailsAfter.distance +
      " متر";

    Alert.alert(
      "معلومات الموقع",
      msg,
      [{ text: "موافق", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
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
          <Right>
            <Button
              style={{
                color: this.state.disableBtns ? "#607D8B" : "",
              }}
              activeOpacity={0.5}
              disabled={this.state.disableBtns}
              transparent
              onPress={() => this.showAlert()}
            >
              <Icon name="map" />
            </Button>
          </Right>
        </Header>
        <Content padder>
          <Grid>
            <Row style={{ alignSelf: "center" }}>
              <MapView
                style={{ flex: 1, height: 180 }}
                region={{
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onLayout={this.onMapLayout}
                showsScale
                showsCompass
                showsPointsOfInterest
                showsBuildings
              >
                {this.state.isMapReady && (
                  <Marker
                    coordinate={{
                      latitude: this.state.latitude,
                      longitude: this.state.longitude,
                    }}
                    title={this.state.detailsAfter.machineName}
                  />
                )}
              </MapView>
            </Row>
            <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
              <Col style={{ width: widthTwo }}>
                <Button
                  style={{
                    justifyContent: "center",
                    margin: 8,
                    width: "100%",
                    backgroundColor: this.state.disableBtns
                      ? "#607D8B"
                      : "#E14343",
                  }}
                  activeOpacity={0.5}
                  disabled={this.state.disableBtns}
                  onPress={() =>
                    this.getResult("InsertUpdateEmployeeLocation", "1")
                  }
                >
                  <Text>دخــــــــــــول</Text>
                </Button>
              </Col>
            </Row>
            <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
              <Col style={{ width: widthTwo }}>
                <Button
                  style={{
                    justifyContent: "center",
                    margin: 8,
                    width: "100%",
                    backgroundColor: this.state.disableBtns
                      ? "#607D8B"
                      : "#fac125",
                  }}
                  activeOpacity={0.5}
                  disabled={this.state.disableBtns}
                  onPress={() =>
                    this.getResult("InsertUpdateEmployeeLocation", "21")
                  }
                >
                  <Text>خـــــــــــروج</Text>
                </Button>
              </Col>
            </Row>
            <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
              <Col style={{ width: widthTwo }}>
                <Button
                  style={{
                    justifyContent: "center",
                    margin: 8,
                    width: "100%",
                    backgroundColor: this.state.disableBtns
                      ? "#607D8B"
                      : "#32db64",
                  }}
                  activeOpacity={0.5}
                  disabled={this.state.disableBtns}
                  onPress={() =>
                    this.getResult("InsertUpdateEmployeeLocation", "61")
                  }
                >
                  <Text>عمــــــل رسمي</Text>
                </Button>
              </Col>
            </Row>
            <Row style={[stylesLocal.card, { borderColor: "#46639E" }]}>
              <Col style={{ width: widthTwo }}>
                <Button
                  style={{
                    justifyContent: "center",
                    margin: 8,
                    width: "100%",
                    backgroundColor: this.state.disableBtns
                      ? "#607D8B"
                      : "#387ef5",
                  }}
                  activeOpacity={0.5}
                  disabled={this.state.disableBtns}
                  onPress={() =>
                    this.getResult("InsertUpdateEmployeeLocation", "41")
                  }
                >
                  <Text> اســــتراحة</Text>
                </Button>
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
    backgroundColor: "#eeeeee",
  },
  tasks: {
    flex: 1,
  },
  cardContent: {
    marginLeft: 20,
    marginTop: 10,
  },
  image: {
    width: 25,
    height: 25,
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
    marginVertical: 5,
    marginHorizontal: 8,
    backgroundColor: "white",
    flexBasis: "46%",
    padding: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    borderLeftWidth: 5,
    alignItems: "center",
  },
  description: {
    fontSize: 20,
    flex: 1,
    fontWeight: "bold",
    color: "#2c3e50",
    alignSelf: "flex-start",
  },
  date: {
    fontSize: 15,
    flex: 1,
    color: "#696969",
    marginTop: 5,
  },
});

export default AccordionCustomHeaderContent;
