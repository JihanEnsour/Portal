import React, { Component } from "react";
import {
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View
} from "react-native";
import * as geolib from "geolib";
import Geolocation from "react-native-geolocation-service";
import MapView, { Marker } from "react-native-maps";

export default class AccordionDefault extends Component {
  watchId = null;
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      updatesEnabled: false,
      yourLocation: {},
      MachineLocation: {},
      getDistance: null,
      getPreciseDistance: null,
      computeDestinationPoint: null,
      lat: 0,
      long: 0,
      isMapReady: false
    };

    this.hasLocationPermission = this.hasLocationPermission.bind(this);
    this.hasLocationPermission();
  }
  componentDidMount() {
    //this.getLocation(1);
    //console.warn(this.state.location);
  }

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
      ToastAndroid.show(
        "Location permission denied by user.",
        ToastAndroid.LONG
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        "Location permission revoked by user.",
        ToastAndroid.LONG
      );
    }

    return false;
  };

  getLocation = async type => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) return;

    this.setState({ loading: true }, () => {
      Geolocation.getCurrentPosition(
        position => {
          var d1 = geolib.getDistance(position.coords, {
            latitude: 31.9849025,
            longitude: 35.897549
          });

          var d2 = geolib.getPreciseDistance(position.coords, {
            latitude: 31.9849025,
            longitude: 35.897549
          });
          var d3 = geolib.computeDestinationPoint(
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            },
            15000,
            180
          );

          console.warn(
            "You are ",
            d1,
            "meters away from 31.9849025, 35.897549 by getDistance "
          );

          console.warn(
            "You are ",
            d2,
            "meters away from 31.9849025, 35.897549 by getPreciseDistance"
          );

          console.warn("computeDestinationPoint: ", d3);

          const machine = {
            latitude: 31.9849025,
            longitude: 35.897549
          };

          this.setState({
            lat: position.coords.latitude,
            long: position.coords.longitude,
            yourLocation: position.coords,
            MachineLocation: machine,
            getDistance: d1,
            getPreciseDistance: d2,
            computeDestinationPoint: d3,
            loading: false
          });
          console.warn(" enableHighAccuracy: false");
        },
        error => {
          this.setState({ location: error, loading: false });
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
          distanceFilter: 50,
          forceRequestLocation: true
        }
      );
    });
  };

  getLocationUpdates = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) return;   
      this.watchId = Geolocation.watchPosition(
        position => {
          this.setState({
            location: position,
            lat: position.coords.latitude,
            long: position.coords.longitude
          });
          console.log(position);
        },
        error => {
          this.setState({ location: error });
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 5000,
          fastestInterval: 2000
        }
      );
  
  };

  removeLocationUpdates = () => {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);     
    }
  };
  onMapLayout = () => {
    this.setState({ isMapReady: true });
  };
  render() {
    const {
      loading,
      MachineLocation,
      yourLocation,
      updatesEnabled,
      getDistance,
      getPreciseDistance,
      computeDestinationPoint
    } = this.state;
    return (
      <View style={styles.container}>
        <Button
          title="Enter"
          onPress={() => this.getLocation("F1")}
          disabled={loading || updatesEnabled}
        />
        <Button
          title="Start Observing"
          onPress={this.getLocationUpdates}
          disabled={updatesEnabled}
        />
        <Button
          title="Stop Observing"
          onPress={this.removeLocationUpdates}
          disabled={!updatesEnabled}
        />
        <View style={styles.result}>
          <Text>
            {"Finger Print Machine Location " +
              JSON.stringify(MachineLocation, null, 4)}
          </Text>
          <Text>
            {"Your Location " + JSON.stringify(yourLocation, null, 4)}
          </Text>
          <Text>
            {"getDistance " + JSON.stringify(getDistance, null, 4) + " meter"}
          </Text>
          <Text>
            {"getPreciseDistance " +
              JSON.stringify(getPreciseDistance, null, 4) +
              " meter"}
          </Text>
          <Text>
            {"computeDestinationPoint " +
              JSON.stringify(computeDestinationPoint, null, 4)}
          </Text>
          <MapView
            style={{ flex: 1, height: 200, width: 200, minHeight: 100 }}
            region={{
              latitude: this.state.lat,
              longitude: this.state.long,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            onLayout={this.onMapLayout}
            showsScale
            showsCompass
            showsPointsOfInterest
            showsBuildings
          >
            {this.state.isMapReady && (
              <MapView.Marker
                coordinate={{
                  latitude: this.state.lat,
                  longitude: this.state.long
                }}
                title={"title here"}
              />
            )}
          </MapView>
        </View>
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    paddingHorizontal: 12
  },
  result: {
    borderWidth: 1,
    borderColor: "#666",
    width: "100%",
    paddingHorizontal: 16
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 12,
    width: "100%"
  }
});
