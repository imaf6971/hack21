import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChargingStationRow, RentStates } from "./ChargingStationRow";
import { ChargerHeadingView } from "./chargers/ChargerHeading";

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
      <ChargerHeadingView id={id} title={title} address={address} />
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
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
})
