import { useAtom } from "jotai";
import { StyleSheet, View } from "react-native";
import { MapPointModal } from "../../components/MapPointModal";
import { favourites } from "../store";

type ChargeRowProps = {
  stationId: number
}


export function FavouritesScreen() {
  const [favs] = useAtom(favourites);

  return (
    <View style={styles.container}>
      {favs.map(fav => <MapPointModal pointId={fav} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
});
