import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SvgCharger from "./icons/Charger";

type ChargingStationRowProps = {
  mapPointId: number
  state: RentStates,
  charger: {
    id: number,
    type: string,
    power: number,
  }
}

function useRentChargingStation(opts?: UseMutationOptions) {
  return useMutation({
    mutationFn: async (input: { mapPointId: number, chargerId: number }) => {
      const resp = await fetch('http://10.178.130.105:3001/api/v1/rent/', {
        method: 'POST',
        body: JSON.stringify(input),
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (resp.status !== 200) {
        console.log(resp.status);
        throw new Error();
      }
      return await resp.json();
    }
  });
}

export function ChargingStationRow({ mapPointId, state, charger, }: ChargingStationRowProps) {
  const client = useQueryClient();
  const { isLoading, mutate: rent, isError } = useRentChargingStation({
    onSuccess: async (data) => {
      await client.invalidateQueries(['useMapMarkersById', mapPointId]);
      console.log(data)
    }
  });
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <SvgCharger />
        <View>
          <Text style={styles.chargerType}>{charger.type}</Text>
          <Text>{charger.power} КВт</Text>
        </View>
      </View>
      <RentButton
        onPress={state === 'FREE' ? () => {
          Alert.alert(
            'Забронировать зарядную станцию?',
            'Вы уверены, что хотите забронировать зарядную станцию?',
            [{
              text: 'Да',
              onPress() {
                rent({ chargerId: charger.id, mapPointId }, {
                  async onSuccess(data) {
                    console.log(data)
                    await client.invalidateQueries();
                  }
                })
              }
            }])
        } : null}
        isLoading={isLoading}
        state={state}
      />
    </View>
  );
}

type RentButtonProps = {
  onPress: () => void,
  state: RentStates,
  isLoading: boolean,
}

export type RentStates = "FREE" | "IN_USE" | "UNAVAILABLE";

function RentButton({ state, onPress, isLoading }: RentButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        ...styles.button,
        backgroundColor: getButtonBgColor(state)
      }}>
      <Text style={{
        ...styles.buttonText,
        color: getButtonTextColor(state)
      }}>
        {isLoading ? <ActivityIndicator /> : getButtonText(state)}
      </Text>
    </TouchableOpacity>
  );
}

function getButtonText(state: RentStates) {
  if (state === 'FREE') return "Свободен";
  if (state === 'IN_USE') return "Забронировано";
  if (state === 'UNAVAILABLE') return "Не доступен";
}

function getButtonTextColor(state: RentStates) {
  if (state === 'FREE')
    return '#FFFFFF'
  return '#111C35';
}

function getButtonBgColor(state: RentStates) {
  if (state === 'UNAVAILABLE')
    return '#FFCF26';
  if (state === 'FREE')
    return '#111C35';
  if (state === 'IN_USE')
    return '#EAEAEA';
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 26
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  round: { width: 42, height: 42, backgroundColor: '#111C35', borderRadius: 1000 },
  chargerType: { fontSize: 16, fontWeight: '700' },
  button: { width: 150, borderRadius: 20, padding: 12 },
  buttonText: { textAlign: 'center', textTransform: 'uppercase', fontWeight: '400' },
})
