console.log('MapScreen...');
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, Image, StatusBar } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Entypo } from '@expo/vector-icons';
import styles from './styles/MapScreen';

const DEFAULT_PADDING = { top: 100, right: 100, bottom: 100, left: 100 };

// M a p S c r e e n
// -----------------
class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.mapRef = null;
  }

  state = {
    margin: 1,
    extraData: false
  }

  onMapReady = () => this.setState({ margin: 0 })

  getContactByEmail = (email) => {
    const {
      contacts,
    } = this.props;
    contacts.allContactsArray.forEach((_contact) => {
      if (_contact.emails) {
        _contact.emails.forEach((_email) => {
          if (_email.email === email) {
            contact = _contact;
          }
        })
      }
    })
    console.log('MapScreen/getContactByEmail: return contact=', contact);
    return contact;
  }

  onCalloutClick = async (email) => {
    const { navigate } = this.props.navigation;

    console.log('MapScreen/onCalloutClick: Marker was clicked !!!');
    var contact = this.getContactByEmail(email);
    navigate('ContactsDetailsScreen', { contact: contact });
  }

  render = () => {
    // console.log('MapScreen/render: this.props.user.userInfos.fullName=', this.props.user.userInfos.fullName);

    const {
      user,
    } = this.props;
    var lastLocation = user.userInfos.locations.length - 1;
    var latitude = user.userInfos.locations[lastLocation].coords.latitude;
    var longitude = user.userInfos.locations[lastLocation].coords.longitude;
    var initialRegion = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    return (
      <View style={{ ...StyleSheet.absoluteFillObject, margin: this.state.margin, }} >

        <MapView
          ref={(ref) => { this.mapRef = ref; }}
          rotateEnabled={true}
          zoomEnabled={true}
          showsCompass={true}
          zoomControlEnabled={true}
          showsMyLocationButton={true}
          showsPointsOfInterest={true}
          showsUserLocation={(!user.isTracting ? true : false)}
          showsScale={true}
          style={styles.map}
          initialRegion={initialRegion}
          onMapReady={this.onMapReady}
        >
          {user.isTracting ?
            <MapView.Circle
              center={{
                latitude: latitude,
                longitude: longitude,
              }}
              fillColor="#FFA500"
              radius={20}
              strokeColor="#FF8C00"
              strokeWidth={1}
            />
            : null}
          {
            user.markers.map((marker, index) => {
              console.log('MapScreen/render: marker.image=', marker.image, ' Platform.OS=', Platform.OS);
              return (
                <Marker
                  key={index}
                  coordinate={marker.coordinates}
                  title={marker.title}
                  description={marker.description}
                  image={Platform.OS === 'android' ? marker.image : undefined}
                  onCalloutPress={() => { this.onCalloutClick(marker.email); }}
                >

                  {Platform.OS === 'ios' ? <Image source={marker.image} style={styles.image} /> : null}

                  <MapView.Callout>
                    <View style={styles.calloutView}>
                      <Text style={styles.calloutText}>
                        {marker.title}{"\n"}{marker.description}
                      </Text>
                    </View>
                  </MapView.Callout>

                </Marker>
              );
            })
          }

        </MapView>
        <TouchableOpacity
          onPress={() => {
            console.log('MapScreen/render: click on fitToCoordinates !');
            var locationsBoundArray = [];
            let latlong = {
              latitude: latitude,
              longitude: longitude
            };
            locationsBoundArray.push(latlong);
            user.markers.forEach((marker) => {
              locationsBoundArray.push(marker.coordinates);
            });
            console.log('MapScreen/render click on fitToCoordinates : locationsBoundArray=', locationsBoundArray);
            this.mapRef.fitToCoordinates(locationsBoundArray, {
              edgePadding: DEFAULT_PADDING,
              animated: true,
            });
          }}
          style={[styles.touchableOpacitySquareIcon,
          { backgroundColor: 'rgba(	255, 	255, 	255, 0.7)' }]}>
          <Entypo
            name="resize-100-"
            size={24}
            color={EStyleSheet.value('$grayIcon1')} />
        </TouchableOpacity>


      </View>
    );
  }

  componentDidMount() {
    // console.log('MapScreen/componentDidMount');
    let self = this;
    setTimeout(() => self.setState({ extraData: true }), 100);
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    contacts: state.contacts,
  };
};

export default connect(mapStateToProps, null)(MapScreen);