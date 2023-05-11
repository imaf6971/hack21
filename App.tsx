import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { LatLng, Region } from 'react-native-maps';

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
  const bbox = `${l},${b},${t},${r}`;
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
  const response = await resp.json();
  console.log('response', response);
}

function regionToMapBox(region: Region): MapBox {
  return {
    l: region.longitude,
    r: region.longitude + region.longitudeDelta,
    b: region.latitude,
    t: region.latitude + region.latitudeDelta,
  }
}

function Screen() {
  const q = useQuery({
    queryKey: ['map',]

  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsIndoors={false}
        showsPointsOfInterest={false}
        followsUserLocation
        showsUserLocation
        onRegionChangeComplete={async (region) => {
          fetchChargingStations(regionToMapBox(region));
        }}
      />
      <StatusBar style="auto" />
    </View>
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
  }
});
