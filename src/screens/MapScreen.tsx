import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useQuery } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import SvgMarkerGreen from "../../components/icons/MarkerGreen";
import SvgMarkerWhite from "../../components/icons/MarkerWhite";
import SvgMarkerYellow from "../../components/icons/MarkerYellow";
import { MapPointModal } from "../../components/MapPointModal";
import * as Location from 'expo-location';
import BottomSheet from '@gorhom/bottom-sheet';

function useLocation() {
  const [isGranted, setIsGranted] = useState(false);

  async function requestPermissions() {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    setIsGranted(granted);
  }

  useEffect(() => {
    requestPermissions()
  }, []);

  return { isGranted, requestPermissions };
}

type MapMarkers = {
  id: number,
  latitude: number,
  longitude: number,
  color: "GREEN" | "YELLOW" | "WHITE"
}[];
function useMapMarkers() {
  return useQuery<MapMarkers>({
    queryKey: ['useMapMarkers'],
    queryFn: () => fetch('http://10.178.130.105:3001/api/v1/mapPoints')
      .then(a => a.json())
  })
}

export function MapScreen() {
  const { isGranted } = useLocation();
  const [userLocation, setUserLocation] = useState(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
  const { isSuccess, data: mapMarkers } = useMapMarkers();
  const mapRef = useRef<MapView>(null);
  const bsRef = useRef<BottomSheet>(null);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsIndoors={false}
        showsPointsOfInterest={false}
        showsMyLocationButton={false}
        showsUserLocation
        onUserLocationChange={e => {
          if (userLocation === null) {
            mapRef.current.animateToRegion({
              ...e.nativeEvent.coordinate,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            })
          }
          setUserLocation(e.nativeEvent.coordinate)
        }}
      >
        {isSuccess && mapMarkers.map(mapMarker => (
          <Marker
            onPress={() => {
              setSelectedMarkerId(mapMarker.id)
              bsRef.current.collapse();
            }}
            key={mapMarker.id}
            coordinate={{
              latitude: mapMarker.latitude,
              longitude: mapMarker.longitude
            }}
          >
            {mapMarker.color === "YELLOW" && <SvgMarkerYellow />}
            {mapMarker.color === "WHITE" && <SvgMarkerWhite />}
            {mapMarker.color === "GREEN" && <SvgMarkerGreen />}
          </Marker>
        ))}
      </MapView>
      <View style={{ position: 'absolute', bottom: 72, right: 16 }}>
        <TouchableHighlight
          onPress={() => {
            mapRef.current.animateToRegion({
              ...userLocation,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            })
          }}
          activeOpacity={0.8}
          style={styles.locationButton}>
          <FontAwesome size={40} color='#FFCF26' name={isGranted ? "location-arrow" : 'close'} />
        </TouchableHighlight>
      </View>
      <BottomSheet
        enablePanDownToClose={true}
        ref={bsRef}
        snapPoints={['40%', '80%']}
        index={-1}
      >
        <MapPointModal pointId={selectedMarkerId} />
      </BottomSheet>
      <StatusBar style="auto" />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '125%',
  },
  locationButton: { borderRadius: 1000, width: 72, height: 72, backgroundColor: '#111C35', justifyContent: 'center', alignItems: 'center' }
});
