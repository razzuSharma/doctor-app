import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { firebase } from "../firebase/config";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";

const EditDoctor = ({ doctorId }) => {
  const [editedDoctor, setEditedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSave = () => {
    // Update the doctor data in Firebase with the editedDoctor data
    if (editedDoctor) {
      const updatedData = { ...editedDoctor };
      firebase.firestore().collection("doctors").doc(doctorId).set(updatedData);
      console.log("Save button clicked", doctorId);

      // Set the success message
      setSuccessMessage("Doctor data saved successfully!");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      setEditedDoctor({ ...editedDoctor, image: result.uri });
    }
  };

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const doctorRef = firebase
          .firestore()
          .collection("doctors")
          .doc(doctorId);
        const doctorSnapshot = await doctorRef.get();
        if (doctorSnapshot.exists) {
          const doctorData = doctorSnapshot.data();
          setEditedDoctor(doctorData);
          setImage(doctorData.image);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [doctorId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView>
        <View style={styles.formContainer}>
          {successMessage && (
            <View style={styles.successMessage}>
              <Text style={styles.successMessageText}>{successMessage}</Text>
            </View>
          )}
          <Text style={styles.title}>Edit Doctor</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editedDoctor?.name || ""}
              onChangeText={(text) => {
                setEditedDoctor({ ...editedDoctor, name: text });
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Department:</Text>
            <TextInput
              style={styles.input}
              placeholder="Department"
              value={editedDoctor?.department || ""}
              onChangeText={(text) => {
                setEditedDoctor({ ...editedDoctor, department: text });
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fee:</Text>
            <TextInput
              style={styles.input}
              placeholder="Fee"
              value={editedDoctor?.fee || ""}
              onChangeText={(text) => {
                setEditedDoctor({ ...editedDoctor, fee: text });
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Rating:</Text>
            <TextInput
              style={styles.input}
              placeholder="Rating"
              value={editedDoctor?.rating || ""}
              onChangeText={(text) => {
                setEditedDoctor({ ...editedDoctor, rating: text });
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Reviews:</Text>
            <TextInput
              style={styles.input}
              placeholder="Reviews"
              value={editedDoctor?.reviews || ""}
              onChangeText={(text) => {
                setEditedDoctor({ ...editedDoctor, reviews: text });
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Image:</Text>
            <TouchableOpacity onPress={pickImage} style={styles.pickImageButton}>
              <FontAwesome name="image" size={20} color="#fff" />
              <Text style={styles.pickImageButtonText}>Pick Image</Text>
            </TouchableOpacity>
            {image && (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            )}
          </View>
          <View style={styles.fullWidthButtonContainer}>
            <Button title="Save" onPress={handleSave} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: "100%",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  fullWidthButtonContainer: {
    width: "100%", // Occupies full width
    paddingHorizontal: 16, // Add some padding on the sides if needed
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  pickImageButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  pickImageButtonText: {
    color: "#fff",
    marginLeft: 10,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  successMessage: {
    backgroundColor: "green",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  successMessageText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default EditDoctor;
