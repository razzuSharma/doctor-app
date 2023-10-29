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
  RefreshControl,
} from "react-native";
import { firebase } from "../firebase/config";
import "firebase/storage";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";

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
  const [errors, setErrors] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const [image, setImage] = useState(null);

  const { setLoggedInUser } = useAuth();

  const { setAdminLoggedIn } = useAuth();

  const navigation = useNavigation();

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

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);

    // Add your refresh logic here, e.g., reload data from the server

    // After refreshing is complete, set refreshing to false
    setRefreshing(false);
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
      handleAddDoctor();
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
      navigation.navigate("DoctorsList");
    } catch (error) {
      alert(error);
    }
  };

  const validateFields = () => {
    const fieldErrors = {};

    if (!name) {
      fieldErrors.name = "Name is required";
    }
    if (!id) {
      fieldErrors.id = "ID is required";
    }
    if (!department) {
      fieldErrors.department = "Department is required";
    }
    if (!description) {
      fieldErrors.description = "Description is required";
    }
    if (!hospital1 && !hospital2) {
      fieldErrors.hospital = "At least one hospital is required";
    }
    if (!Latitude) {
      fieldErrors.Latitude = "Latitude is required";
    }
    if (!Longitude) {
      fieldErrors.Longitude = "Longitude is required";
    }
    if (!fee) {
      fieldErrors.fee = "Fee is required";
    }
    if (!rating) {
      fieldErrors.rating = "Rating is required";
    }

    setErrors(fieldErrors);

    // Return true if there are no errors
    return Object.keys(fieldErrors).length === 0;
  };

  const handleAddDoctor = () => {
    const isValid = validateFields();

    if (isValid) {
      uploadImageToFirebase();
    } else {
      // Display an error message for any validation errors
      let errorMessage = "Please correct the following errors:\n";
      if (errors.name) {
        errorMessage += `- ${errors.name}\n`;
      }
      if (errors.id) {
        errorMessage += `- ${errors.id}\n`;
      }
      if (errors.department) {
        errorMessage += `- ${errors.department}\n`;
      }
      if (errors.description) {
        errorMessage += `- ${errors.description}\n`;
      }
      if (errors.hospital) {
        errorMessage += `- ${errors.hospital}\n`;
      }
      if (errors.Latitude) {
        errorMessage += `- ${errors.Latitude}\n`;
      }
      if (errors.Longitude) {
        errorMessage += `- ${errors.Longitude}\n`;
      }
      if (errors.fee) {
        errorMessage += `- ${errors.fee}\n`;
      }
      if (errors.rating) {
        errorMessage += `- ${errors.rating}\n`;
      }

      Alert.alert("Validation Error", errorMessage);
    }
  };

  return (
    <>
      <MyStatusBar backgroundColor="#5E8D48" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text
            style={{ textAlign: "center", fontSize: 18, fontWeight: "800" }}
          >
            {" "}
            Welcome To Admin Portal
          </Text>
          <TouchableOpacity
            onPress={() => {
              setAdminLoggedIn(false);
              setLoggedInUser(true);
            }}
            style={{
              marginVertical: 20,
              marginBottom: 20,
            }}
          >
            <View style={styles.clientButton}>
              <FontAwesome
                name="arrow-left"
                size={20}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Go to client side</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setName(text);
              setErrors({ ...errors, name: "" }); // Clear error when user starts typing
            }}
            value={name}
            placeholder="Enter your name here"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            onBlur={validateFields} // Validate all fields on blur
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <Text style={styles.label}>Id:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setId(text)}
            value={id}
            onBlur={validateFields}
            placeholder="Enter your id here"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          />
          {errors.id && <Text style={styles.errorText}>{errors.id}</Text>}
          <Text style={styles.label}>Department:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setDepartment(text)}
            value={department}
            onBlur={validateFields}
            placeholder="Enter your department here"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          />
          {errors.department && (
            <Text style={styles.errorText}>{errors.department}</Text>
          )}
          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setDescription(text)}
            value={description}
            onBlur={validateFields}
            placeholder="Enter your description here"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            multiline
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}

          <Text style={styles.label}>Hospital (Primary):</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setHospital1(text)}
            value={hospital1}
            placeholder="Enter primary hospital you work here"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          />
          <Text style={styles.label}>Hospital (Alternatve):</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setHospital2(text)}
            value={hospital2}
            placeholder="Enter alternative hospital you work"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          />
          {/* Information icon */}
          <TouchableOpacity onPress={() => setShowMessage(!showMessage)}>
            <View style={styles.infoIconCircle}>
              <Text style={styles.infoIcon}>i</Text>
            </View>
          </TouchableOpacity>
          {showMessage && (
            <Text style={styles.message}>
              Give Latitude and Longitude for Doctor's map address
            </Text>
          )}
          <Text style={styles.label}>Latitude</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => setLatitude(text)}
            value={Latitude}
            placeholder="Enter your latitude"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          />

          <Text style={styles.label}>Longitude</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => setLongitude(text)}
            value={Longitude}
            placeholder="Enter your latitude"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          />

          <Text style={styles.label}>Fee:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => setFee(text)}
            value={fee}
            placeholder="Enter your free here"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          />
          {errors.fee && <Text style={styles.errorText}>{errors.fee}</Text>}
          <Text style={styles.label}>Rating:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => setRating(text)}
            value={rating}
            placeholder="Give your rating"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          />
          {/* image */}
          <Text style={styles.label}>Image:</Text>
          <TouchableOpacity onPress={pickImage} style={styles.pickImageButton}>
            <FontAwesome
              name="image"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.pickImageText}>Pick Image</Text>
          </TouchableOpacity>
          {image && (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          )}

          <TouchableOpacity
            onPress={uploadImageToFirebase}
            style={{
              backgroundColor: "#007bff", // Button background color
              borderRadius: 8, // Button border radius
              paddingVertical: 12, // Vertical padding
              paddingHorizontal: 24, // Horizontal padding
              marginVertical: 20,
              marginBottom: 20,
              alignItems: "center", // Center text horizontally
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold", // Use "bold" for the button text
                color: "#fff", // Text color
              }}
            >
              Add Doctor
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("DoctorsList");
            }}
            style={{
              backgroundColor: "#007bff", // Button background color
              borderRadius: 8, // Button border radius
              paddingVertical: 12, // Vertical padding
              paddingHorizontal: 24, // Horizontal padding
              marginVertical: 20,
              marginBottom: 20,
              alignItems: "center", // Center text horizontally
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold", // Use "bold" for the button text
                color: "#fff", // Text color
              }}
            >
              List of Doctor
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
  pickImageButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 10,
    alignItems: "center",
  },
  pickImageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 10, // Add some spacing between the "Pick Image" button and the image
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  clientButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    flexDirection: "row", // To align the icon and text horizontally
    width: 200,
  },

  icon: {
    marginRight: 10, // Add some spacing between the icon and text
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  infoIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "45deg" }], // Rotate the circle
  },
  infoIcon: {
    fontSize: 20,
    color: "white",
    transform: [{ rotate: "-45deg" }], // Counter-rotate the 'i' inside the circle
  },
  message: {
    backgroundColor: 'red', // Add a semi-transparent background
    color: 'white', // Set the text color to white
    padding: 10, // Add some padding
    borderRadius: 10, // Add rounded corners
    textAlign: 'center', // Center-align the text
    fontWeight: 'bold', // Make the text bold
    fontSize: 16, // Adjust the font size
    marginVertical: 10, // Add vertical margin to separate it from other elements
  },
});

export default AdminScreen;
