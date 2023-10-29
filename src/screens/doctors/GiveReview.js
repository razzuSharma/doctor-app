import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
} from "react-native";

import { Header } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";
import { TextInput } from "@react-native-material/core";
import { firebase } from "../../firebase/config";

const GiveReview = ({ route }) => {
  const { Id } = route.params;
  const reviewAdd = firebase.firestore().collection("reviews");
  const [addName, setAddName] = useState("");
  const [addReview, setAddReview] = useState("");
  const [addRating, setAddRating] = useState("");

  const addField = () => {
    if (addName && addName.length > 0) {
      const data = {
        reviewer: addName,
        review: addReview,
        reviewRating: addRating,
        referenceDoc: Id,
      };

      Alert.alert("Data Sent", "Your data has been sent to Firebase successfully!");

      reviewAdd
        .add(data)
        .then((res) => {
          setAddName("");
          setAddReview("");
          setAddRating("");
          Keyboard.dismiss();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <ScrollView>
        <Header
          leftComponent={{ icon: "menu", color: "#fff" }}
          centerComponent={{
            text: "Health Care Nepal",
            style: styles.headerText,
          }}
        />
        <View style={styles.body}>
          <Text style={styles.heading}>Give Review</Text>
          <Text style={styles.formLabel}>Your Name</Text>
          <TextInput
            value={addName}
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="grey"
            inputContainerStyle={styles.inputContainer}
            backgroundColor="white"
            onChangeText={(reviewer) => setAddName(reviewer)}
          />
          <Text style={styles.formLabel}>Review:</Text>
          <TextInput
            value={addReview}
            style={styles.input}
            placeholder="Enter your review"
            placeholderTextColor="grey"
            backgroundColor="white"
            onChangeText={(review) => setAddReview(review)}
          />
          <Text style={styles.formLabel}>Rating</Text>
          {addRating >= 1 && addRating <= 5 ? (
            <TouchableOpacity onPress={() => setAddRating("")}>
              <TextInput
                value={addRating}
                style={styles.ratingInput}
                placeholder="Edit your rating"
                placeholderTextColor="grey"
                keyboardType="numeric"
                inputContainerStyle={styles.inputContainer}
                backgroundColor="white"
                onChangeText={(reviewRating) => {
                  if (reviewRating >= 1 && reviewRating <= 5) {
                    setAddRating(reviewRating);
                  } else {
                    setAddRating("");
                  }
                }}
              />
            </TouchableOpacity>
          ) : (
            <TextInput
              value={addRating}
              style={styles.input}
              placeholder="Give your rating"
              placeholderTextColor="grey"
              keyboardType="numeric"
              inputContainerStyle={styles.inputContainer}
              backgroundColor="white"
              onChangeText={(reviewRating) => {
                if (reviewRating >= 1 && reviewRating <= 5) {
                  setAddRating(reviewRating);
                } else {
                  setAddRating("");
                }
              }}
            />
          )}
          <TouchableOpacity style={styles.btn} onPress={addField}>
            <FontAwesome name="send" size={20} color="blue" style={styles.print} />
            <Text style={styles.btnText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default GiveReview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50,
  },
  body: {
    margin: 20,
  },
  heading: {
    color: "crimson",
    fontSize: 24,
    fontFamily: "UbuntuBold",
    marginBottom: 3,
  },
  formLabel: {
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: "UbuntuMedium",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 0.3,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  inputContainer: {
    borderBottomWidth: 0,
  },
  ratingInput: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 0.3,
    paddingHorizontal: 10,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#8ec7cf",
    width: 180,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
  },
  print: {
    marginRight: 10,
    paddingLeft: 5,
  },
  btnText: {
    fontSize: 16,
    color: "blue",
    fontFamily: "UbuntuBold",
  },
});
