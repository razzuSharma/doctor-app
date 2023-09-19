import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { firebase } from "../firebase/config";
import "firebase/storage";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { useAuth } from "../contexts/AuthContext";

const AdminScreen = () => {
  const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );

  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [hospital1, setHospital1] = useState("");
  const [hospital2, setHospital2] = useState("");
  const [fee, setFee] = useState("");
  const [rating, setRating] = useState("");
  const [Latitude, setLatitude] = useState("");
  const [Longitude, setLongitude] = useState("");

  const [image, setImage] = useState(null);

  const { setLoggedInUser } = useAuth();

  const { setAdminLoggedIn } = useAuth();

  console.log("image uri", image);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImageToFirebase = async () => {
    try {
      const { uri } = await FileSystem.getInfoAsync(image);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          reject(new TypeError("Network request Failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const imageName = image.substring(image.lastIndexOf("/") + 1);
      const ref = firebase.storage().ref().child(imageName);

      await ref.put(blob);

      //get imageurl from storager
      const imageUrl = await ref.getDownloadURL();

      handleSubmit(imageUrl);
    } catch (error) {
      console.log("errors", error);
      Alert.alert(error);
    }
  };

  const handleSubmit = async (imageUrl) => {
    try {
      const formData = {
        name: name,
        id: id,
        department: department,
        description: description,
        hospitals: [hospital1, hospital2],
        latitude: Latitude,
        longitude: Longitude,
        fee,
        rating,
        image: imageUrl,
      };

      await firebase.firestore().collection("doctors").add(formData);

      Alert.alert("Doctor Added");
      // Clear form fields and selected image
      setName("");
      setId("");
      setDepartment("");
      setDescription("");
      setHospital1("");
      setHospital2("");
      setFee("");
      setRating("");
      setImage(null);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <MyStatusBar backgroundColor="#5E8D48" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView>
          <Text
            style={{ textAlign: "center", fontSize: 18, fontWeight: "800" }}
          >
            {" "}
            Welcome To Admin Portal
          </Text>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setName(text)}
            value={name}
          />
          <Text style={styles.label}>Id:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setId(text)}
            value={id}
          />
          <Text style={styles.label}>Department:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setDepartment(text)}
            value={department}
          />
          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setDescription(text)}
            value={description}
            multiline
          />
          <Text style={styles.label}>Hospital (Primary):</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setHospital1(text)}
            value={hospital1}
          />
          <Text style={styles.label}>Hospital (Alternatve):</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setHospital2(text)}
            value={hospital2}
          />
          <Text
            style={{
              textDecorationLine: "underline",
            }}
          >
            Give Latitude and Longitude for Doctor's map address
          </Text>
          <Text style={styles.label}>Latitude</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => setLatitude(text)}
            value={Latitude}
          />
          <Text style={styles.label}>Longitude</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => setLongitude(text)}
            value={Longitude}
          />

          <Text style={styles.label}>Fee:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => setFee(text)}
            value={fee}
          />
          <Text style={styles.label}>Rating:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => setRating(text)}
            value={rating}
          />
          {/* image */}
          <Text style={styles.label}>Image:</Text>
          <TouchableOpacity onPress={pickImage}>
            <Text
              style={{
                marginVertical: 10,
                textDecorationLine: "underline",
              }}
            >
              Pick Image
            </Text>
          </TouchableOpacity>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          )}
          <TouchableOpacity
            onPress={uploadImageToFirebase}
            style={{
              marginVertical: 20,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                textAlign: "center",

                fontSize: 18,
                fontWeight: 800,
              }}
            >
              Add Doctor
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setAdminLoggedIn(false);
              setLoggedInUser(false);
            }}
            style={{
              marginVertical: 20,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                textAlign: "center",

                fontSize: 18,
                fontWeight: 800,
              }}
            >
              Go to clinet side
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
});

export default AdminScreen;
