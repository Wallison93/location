import { Text, View, StyleSheet } from "react-native";

import { useEffect, useState, useRef } from "react";
/* import { styles } from "./styles"; */

import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy
} from 'expo-location'; //  npx expo install expo-location


import MapView, { Marker } from 'react-native-maps';  // npm i react-native-maps



export default function Index() {

  const [location, setLocation] = useState<LocationObject | null>(null);

  const mapRef = useRef<MapView>(null)


  async function requestLocationPermission() {
    console.log("Solicitando permissão...");
    const { granted } = await requestForegroundPermissionsAsync();
    if (!granted) {
      console.log("Permissão de localização negada.");
      return;
    }
    console.log("Permissão concedida! Obtendo localização...");
    try {
      const currentPosition = await getCurrentPositionAsync({
        accuracy: 6, // Define uma precisão maior
        mayShowUserSettingsDialog: true, // Abre as configurações caso a permissão esteja bloqueada
      });
      setLocation(currentPosition);
      console.log("Localização atual =>", currentPosition);
    } catch (error) {
      console.error("Erro ao obter localização:", error);
    }
  }


  useEffect(() => {
    requestLocationPermission();
  }, []);


  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1
    }, (response) => {
      setLocation(response)
      mapRef.current?.animateCamera({
        pitch: 10,
        center: response.coords
      })

    })
  }, []);


  return (
    <View style={styles.container} >

      {location &&
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude:  location.coords.latitude,
            longitude:  location.coords.longitude,
            latitudeDelta: 0.006,
            longitudeDelta: 0.006,
          }}>
          <Marker coordinate={{
              latitude: location.coords.latitude,
             longitude: location.coords.longitude, 
  
          }
          } />
        </MapView>
      }



    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#A9090D'
  },

  map: {
    flex: 1,
    width: '100%',
  }

})