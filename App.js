import React from "react";
import { LogBox, SafeAreaView, StyleSheet, Text, View } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

import { NavigationContainer } from "@react-navigation/native";

import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import GuestStack from "./src/navigation/GuestStack";
import AppStack from "./src/navigation/AppStack";
import AdminStack from "./src/navigation/AdminStack";

import { useFonts } from "expo-font";

const AppContent = () => {
  const { AdminLoggedIn } = useAuth();
  const { loggedInUser } = useAuth();

  return (
    <NavigationContainer>
      {AdminLoggedIn ? (
        <AdminStack />
      ) : loggedInUser ? (
        <AppStack />
      ) : (
        <GuestStack />
      )}
    </NavigationContainer>
  );
};

export default function App() {
  let [fontsLoaded] = useFonts({
    UbuntuRegular: require("../HealthCareNepal/src/assets/fonts/Ubuntu-Regular.ttf"),
    UbuntuBold: require("../HealthCareNepal/src/assets/fonts/Ubuntu-Bold.ttf"),
    UbuntuMedium: require("../HealthCareNepal/src/assets/fonts/Ubuntu-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
