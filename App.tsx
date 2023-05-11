import { StatusBar } from 'expo-status-bar';
import { Button, Dimensions, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { LatLng, MapMarker, Region } from 'react-native-maps';
import Charger from './assets/charger.svg';

import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const isError = errorMsg !== null;
  return { location, errorMsg, isError };
}

type MapBox = {
  l: number,
  b: number,
  r: number,
  t: number,
}

async function fetchChargingStations({ l, b, r, t }: MapBox) {
  console.log('fetchChargingStations');
  const bbox = `${l},${b},${r},${t}`;

  console.log("bbox", `
        [out:json][timeout:25];
        (
         node["amenity"="charging_station"](${bbox});
         way["amenity"="charging_station"](${bbox});
         relation["amenity"="charging_station"](${bbox});
        );
        out body;
      `);
  const resp = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `
        [out:json][timeout:25];
        (
         node["amenity"="charging_station"](${bbox});
         way["amenity"="charging_station"](${bbox});
         relation["amenity"="charging_station"](${bbox});
        );
        out body;
      `})
  const body = await resp.text();
  console.log(body)
  // const response = await resp.json();
  // return response.elements;
}

function regionToMapBox(region: Region): MapBox {
  return {
    l: region.longitude + (-0.5 * region.longitudeDelta),
    r: region.longitude + (0.5 * region.longitudeDelta),
    b: region.latitude + (-0.5 * region.latitudeDelta),
    t: region.latitude + (0.5 * region.latitudeDelta),
  }
}

function Screen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsIndoors={false}
        showsPointsOfInterest={false}
        followsUserLocation
        showsMyLocationButton={true}
        showsUserLocation
        onPress={() => {
        }}
      >
        <MapMarker
          onPress={() => setIsModalVisible(true)}
          coordinate={{ latitude: 55.7799284, longitude: 49.1334644 }}
        />
      </MapView>

      <Modal
        transparent
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false)
        }}
        animationType="slide"
      >
        <View style={styles.modal}>
          <TouchableOpacity
            onPress={() => setIsModalVisible(false)}
            style={styles.closeButton}
          />
          <View style={{ marginTop: 26, alignSelf: 'flex-start' }}>
            <Text style={{ fontSize: 18, fontWeight: '700' }}>ITCHARGE</Text>
            <Text>Ул. Петербургская 52, Казань</Text>
          </View>
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 26 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 42, height: 42, backgroundColor: '#111C35', borderRadius: 1000 }} />
              <View>
                <Text style={{ fontSize: 16, fontWeight: '700' }}>Type 1</Text>
                <Text>22 КВт</Text>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.8} style={{ width: 150, backgroundColor: '#111C35', borderRadius: 20, padding: 12 }}>
              <Text style={{ color: 'white', textAlign: 'center', textTransform: 'uppercase', fontWeight: '400' }}>Свободен</Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 26 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 42, height: 42, backgroundColor: '#111C35', borderRadius: 1000 }} />
              <View>
                <Text style={{ fontSize: 16, fontWeight: '700' }}>Type 1</Text>
                <Text>22 КВт</Text>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.8} style={{ width: 150, backgroundColor: '#DAFE00', borderRadius: 20, padding: 12 }}>
              <Text style={{ color: '#111C35', textAlign: 'center', textTransform: 'uppercase', fontWeight: '400' }}>Забронировано</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal >
      <StatusBar style="auto" />
    </View >
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Screen />
    </QueryClientProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  modal: {
    height: '40%',
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    borderRadius: 20,
    borderColor: '#111C35',
    borderWidth: 2,
    bottom: 0,
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  closeButton: {
    backgroundColor: '#111C35',
    width: 105,
    height: 8,
    borderRadius: 20,
    color: '#111C35',
    borderColor: 'black'
  },
});
