import { View, Text } from "react-native";
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import AdminScreen from "../screens/AdminScreen";
import DoctorsList from "../screens/DoctorsList";

const Stack = createNativeStackNavigator();

const AdminStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Admin"
        component={AdminScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
          name="DoctorsList"
          component={DoctorsList}
          options={{ title: "Doctor List" }}
        />
    </Stack.Navigator>
  );
};

export default AdminStack;
