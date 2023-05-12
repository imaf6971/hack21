import { useAtom } from "jotai";
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, View, Text } from "react-native";
import { favourites } from "../../src/store";


type ChargerHeadingViewProps = {
  id: number
  address: string
  title: string
}

export function ChargerHeadingView({ id, address, title }: ChargerHeadingViewProps) {
  const [favs, setFavourites] = useAtom(favourites);
  const isFavourite = favs.some(fav => fav === id);

  return (
    <View style={{ marginTop: 26, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>{title}</Text>
        <Text>{address}</Text>
      </View>

      <AntDesign
        onPress={() => {
          if (!isFavourite) {
            setFavourites(prev => [...prev, id])
            return;
          }
          setFavourites(prev => prev.filter(fav => fav !== id))
        }}
        size={24}
        name={isFavourite ? "heart" : "hearto"}
        color={isFavourite ? "#FFCF26" : '#111C35'}
      />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {

  }
});
