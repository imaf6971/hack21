import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { MapScreen } from "./MapScreen";

const Tab = createBottomTabNavigator();

const NavIcon = ({ iconColor, onPress, index }) => {
  switch (index) {
    case 0:
      return (
        <Ionicons
          name={"ios-location-outline"}
          size={38}
          color={iconColor}
          onPress={onPress}
        />
      );
      break;
    case 1:
      return (
        <AntDesign
          name="hearto"
          size={38}
          color={iconColor}
          onPress={onPress}
        />
      );
      break;
    case 2:
      return (
        <MaterialIcons
          name="list-alt"
          size={48}
          color={iconColor}
          onPress={onPress}
        />
      );
    default:
      return (
        <SimpleLineIcons
          name="user"
          size={38}
          color={iconColor}
          onPress={onPress}
        />
      );
  }
};

function MyTabBar({ state, descriptors, navigation }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
            setActiveTab(index);
          } else {
            setActiveTab(index);
          }
        };

        const iconColor = activeTab === index ? "#FFCF26" : "#fff";

        return (
          <View key={route.key} style={styles.tabItem}>
            <NavIcon iconColor={iconColor} onPress={onPress} index={index} />
            <Text style={{ color: iconColor, fontSize: 12 }}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}

export function NavBar() {
  return (
    <Tab.Navigator
      initialRouteName="map"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen
        name="map"
        component={MapScreen}
        options={{
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="favourite"
        children={() => <Text>favourite</Text>}
        options={{
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        children={() => <Text>favourite</Text>}
        name="booking"
        options={{
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        children={() => <Text>favourite</Text>}
        name="profile"
        options={{
          tabBarLabel: "",
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    flexDirection: "row",
    height: 65,
    backgroundColor: "#111C35",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
});
