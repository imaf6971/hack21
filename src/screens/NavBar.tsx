import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { MapScreen } from "./MapScreen";
import { FavouritesScreen } from "./FavouritesScreen";

const Tab = createBottomTabNavigator();

export function Navigation() {
  return (
    <Tab.Navigator
      initialRouteName="map"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#111C35'
        },
        headerTitleStyle: {
          color: '#fff'
        },
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="map"
        component={MapScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, size }) => <Ionicons
            name={"ios-location-outline"}
            size={size}
            color={focused ? '#FFCF26' : 'white'}
          />
        }}
      />
      <Tab.Screen
        name="favourite"
        component={FavouritesScreen}
        options={{
          headerTitle: "Избранное",
          tabBarIcon: ({ focused, size }) => <AntDesign
            name="hearto"
            size={size}
            color={focused ? '#FFCF26' : 'white'}
          />
        }}
      />
      <Tab.Screen
        children={() => <Text>favourite</Text>}
        name="booking"
        options={{
          tabBarIcon: ({ focused, size }) => <MaterialIcons
            name="list-alt"
            size={size}
            color={focused ? '#FFCF26' : 'white'}
          />

        }}
      />
      <Tab.Screen
        children={() => <Text>favourite</Text>}
        name="profile"
        options={{
          tabBarIcon: ({ focused, size }) => <SimpleLineIcons
            name="user"
            size={size}
            color={focused ? '#FFCF26' : 'white'}
          />
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
