import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import { authentication } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";

const SettingScreen = () => {
  const { loggedInUser, setLoggedInUser } = useAuth();
  const signOutUser = () => {
    signOut(authentication)
      .then((res) => {
        console.log(res);
        setLoggedInUser(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={signOutUser}>
        <Text>SettingScreen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({});
