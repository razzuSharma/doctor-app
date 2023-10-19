import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { signOut } from "firebase/auth";
import { authentication } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import { Linking } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
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
    <View style={styles.aboutContainer}>
      <Text style={styles.mainHeader}> Dipesh Bhandari and Dawa Lama </Text>
      <Text style={styles.paraStyle}>
        {" "} 
        We are a team for better connecting with care 😀{" "}
      </Text>

      <View>
        <Image
          style={styles.imgStyle}
          source={require('../assets/logo-care.png')}
        />
      </View>

      <View style={styles.aboutLayout}>
        <Text style={styles.aboutSubHeader}> About Care Connect </Text>
        <Text style={[styles.paraStyle, styles.aboutPara]}>
          Care Connect is a user-friendly mobile application designed to
          simplify the process of connecting patients with healthcare
          professionals. Our app allows users to easily schedule appointments
          with doctors and access essential medical information. Whether you're
          a patient looking for quality healthcare or an admin responsible for
          managing medical facilities, Care Connect has you covered. Join us in
          our mission to make healthcare more accessible and convenient for
          everyone.
        </Text>
      </View>

      <Text style={styles.mainHeader}> Share your thoughts below </Text>
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => openEmail("dawalama@gmail.com")}
        >
          <FontAwesomeIcon icon={faEnvelope} style={styles.emailIcon} />
          <Text style={styles.emailText}>dawalama@gmail.com</Text>
        </TouchableOpacity>
        <Text style={{ marginTop: 10 }}>Or</Text>

        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => openEmail("dawalama@gmail.com")}
        >
          <FontAwesomeIcon icon={faEnvelope} style={styles.emailIcon} />
          <Text style={styles.emailText}>dipeshbhandari@gmail.com</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const openEmail = (email) => {
  // Define the subject and body for the email
  const subject = "Hello from Care Connect";
  const body = "I have a question for you...";

  // Construct the email URI
  const emailUri = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  // Open the default email app (Gmail in this case) with the predefined subject and body
  Linking.openURL(emailUri)
    .then(() => {
      console.log(
        `Opened email app with subject: ${subject} and body: ${body}`
      );
    })
    .catch((error) => {
      console.error("Error opening email app:", error);
    });
};

const styles = StyleSheet.create({
  aboutContainer: {
    display: "flex",
    alignItems: "center",
  },

  imgStyle: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  mainHeader: {
    fontSize: 18,
    color: "#344055",
    textTransform: "uppercase",
    fontWeight: "500",
    marginTop: 50,
    marginBottom: 10,
    fontFamily: "JosefinSans_700Bold",
  },
  paraStyle: {
    fontSize: 18,
    color: "#7d7d7d",
    paddingBottom: 30,
    lineHeight: 24,
  },
  aboutLayout: {
    backgroundColor: "#4c5dab",
    paddingHorizontal: 30,
    marginVertical: 30,
  },
  aboutSubHeader: {
    fontSize: 18,
    color: "#fff",
    textTransform: "uppercase",
    fontWeight: "500",
    marginVertical: 15,
    fontFamily: "JosefinSans_700Bold",
    alignSelf: "center",
  },
  aboutPara: {
    color: "#fff",
  },
  menuContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  iconStyle: {
    width: "100%",
    height: 50,
    aspectRatio: 1,
  },
  emailButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007aff", // Button background color
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  emailIcon: {
    width: 20, // Set the width of the email icon as needed
    height: 20, // Set the height of the email icon as needed
    marginRight: 10,
  },
  emailText: {
    color: "#fff", // Text color for the button
    fontWeight: "bold",
  },
});

export default SettingScreen;
