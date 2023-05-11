import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChargingStationRow, RentStates } from "./ChargingStationRow";

type MapPointModalProps = {
  id: number;
  title: string;
  address: string;
  mapPointChargers: {
    state: RentStates,
    charger: {
      id: number
      type: string
      power: number
    }
  }[]
}

function MapPointView({ id, title, address, mapPointChargers }: MapPointModalProps) {
  return (
    <View style={styles.modal}>
      <TouchableOpacity
        style={styles.closeButton}
      />
      <View style={{ marginTop: 26, alignSelf: 'flex-start' }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>{title}</Text>
        <Text>{address}</Text>
      </View>
      {mapPointChargers.map(pointCharger => (
        <ChargingStationRow
          mapPointId={id}
          key={pointCharger.charger.id}
          charger={pointCharger.charger}
          state={pointCharger.state}
        />
      ))}
    </View>
  );
}

export function MapPointModal({ pointId }: { pointId: number }) {
  const { isLoading, data } = useMapMarkerById(pointId)

  if (isLoading)
    return (
      <View style={{ ...styles.modal, ...styles.loadingModal }}>
        <ActivityIndicator />
      </View>
    );

  return <MapPointView id={data.id} title={data.title} address={data.address} mapPointChargers={data.mapPointChargers} />
}

type MapMarkerById = {
  id: number;
  title: string;
  address: string;
  mapPointChargers: {
    state: RentStates;
    charger: {
      id: number;
      type: string;
      power: number;
    }
  }[]
}

function useMapMarkerById(markerId: number | null) {
  return useQuery<MapMarkerById>({
    queryKey: ['useMapMarkersById', markerId],
    queryFn: () => fetch(`http://10.178.130.105:3001/api/v1/mapPoints/${markerId}`)
      .then(a => a.json()),
    enabled: markerId !== null
  })
}

const styles = StyleSheet.create({
  loadingModal: {
    justifyContent: "center",
    alignItems: "center"
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
})
