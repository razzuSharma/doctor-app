import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  Pressable,
  Linking,
  Modal,
} from "react-native";
import { FontAwesome } from "react-native-vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { authentication } from "../firebase/config";
import { signOut } from "firebase/auth";

import { firebase } from "../firebase/config";
import { useNavigation } from "@react-navigation/native";

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

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
  const [query, setQuery] = useState("");
  const [doctorDetails, setDoctorDetails] = useState([]);
  const fetchDoctorDetails = firebase.firestore().collection("doctors");

  const handleDoctorDetails = () => {
    setDoctorDetails([]);
    fetchDoctorDetails.onSnapshot((QuerySnapshot) => {
      let _doctorDetails = [];

      QuerySnapshot.forEach((doc) => {
        _doctorDetails.push({ ...doc.data() });
      });
      setDoctorDetails(_doctorDetails);
    });
  };

  useEffect(() => {
    handleDoctorDetails();
  }, []);

  const filteredItems = doctorDetails.filter((item) =>
    item?.name?.toLowerCase()?.includes(query?.toLowerCase())
  );

  const categories = [
    {
      id: 1,
      label: "covid-19",
      image: require("../assets/covid.png"),
      link: "https://www.cdc.gov/coronavirus/2019-ncov/prevent-getting-sick/prevention.html#:~:text=In%20those%20situations%2C%20use%20as,sick%20or%20who%20tested%20positive.",
    },
    {
      id: 2,
      label: "hospotal",
      image: require("../assets/hospital.png"),
      link: "https://ghealth121.com/top_hospitals/nepal/",
    },
    {
      id: 3,
      label: "Helpline",
      image: require("../assets/ambulance.png"),
      link: "https://sherpaexpeditiontrekking.com/page/emergency-numbers-in-nepal",
    },
    {
      id: 4,
      label: "pills",
      image: require("../assets/pills.png"),
      link: "https://www.rxsaver.com/blog/top-50-prescription-drugs-filled",
    },
  ];

  const Card = ({ refId, id, name, department, rating, image, screenName }) => {
    const doctorDrillData = doctorDetails.filter((x) => x.id === id);

    const navigation = useNavigation();

    const handleCardPress = () => {
      navigation.navigate("doctorProfile", { doctorDrillData });
    };

    return (
      <TouchableOpacity onPress={handleCardPress} style={styles.DoctorCard}>
        <Image source={{ uri: image }} style={styles.DoctorImage} />
        <Text style={styles.DoctorName}>{name}</Text>
        <Text style={styles.DoctorDepartment}>{department}</Text>
        <Text style={styles.DoctorRating}>{rating} ⭐</Text>
      </TouchableOpacity>
    );
  };

  const renderCard = ({ item }) => <Card {...item} />;

  return (
    <>
      <MyStatusBar backgroundColor="#5E8D48" barStyle="light-content" />
      <FlatList
        data={filteredItems}
        ListHeaderComponent={
          <>
            <View style={styles.container}>
              <Text style={{ fontSize: 24 }}>Hello There 👋 !</Text>
              <View style={styles.avatar}>
                <TouchableOpacity onPress={signOutUser}>
                  <Image
                    source={require("../assets/signout.jpg")}
                    style={{ width: 40, height: 40, borderRadius: 25 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
              <View style={styles.row}>
                {/* First Card */}
                <TouchableOpacity onPress={toggleModal} style={styles.card}>
                  <Image
                    source={require("../assets/clinic.png")}
                    style={styles.cardImage}
                  />
                  <Text style={styles.cardTitle}>Clinic Visit</Text>
                  <Text style={styles.cardDescription}>
                    Visit your doctor in the clinic
                  </Text>
                </TouchableOpacity>

                {/* Second Card */}
                <TouchableOpacity onPress={toggleModal} style={styles.card}>
                  <Image
                    source={require("../assets/home.png")}
                    style={styles.cardImage}
                  />
                  <Text style={styles.cardTitle}>Home Visit</Text>
                  <Text style={styles.cardDescription}>
                    Schedule a doctor visit at home
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Modal */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <TouchableOpacity
                      onPress={toggleModal}
                      style={styles.closeButton}
                    >
                      <FontAwesome name="close" size={20} color="#333" />
                    </TouchableOpacity>
                    <FontAwesome name="smile-o" size={40} color="#FFD700" />
                    <Text style={styles.modalText}>Coming Soon!</Text>
                  </View>
                </View>
              </Modal>
            </ScrollView>
            <Text
              style={{
                fontSize: 24,
                margin: 10,
              }}
            >
              Services
            </Text>
            <View style={{ width: "100%", height: 120 }}>
              <FlatList
                horizontal={true}
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.categoryContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(item?.link);
                      }}
                    >
                      <View
                        style={[
                          styles.barCard,
                          { width: Dimensions.get("window").width / 4 },
                        ]}
                      >
                        <Image
                          style={styles.categoryImage}
                          source={item.image}
                        />
                      </View>
                    </TouchableOpacity>
                    <Text style={styles.categoryLabel}>{item.label}</Text>
                  </View>
                )}
              />
            </View>

            <Text
              style={{
                fontSize: 24,
                margin: 10,
              }}
            >
              Popular Doctors
            </Text>
          </>
        }
        renderItem={renderCard}
        scrollEnabled
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eceff7",
    borderRadius: 15,
    padding: 10,
    margin: 10,
  },
  inputBox: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "black",
  },
  icon: {
    paddingHorizontal: 5,
    paddingRight: 15,
  },
  searchIcon: {
    paddingRight: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  iconContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  iconcard: {
    marginRight: 10,
    fontSize: 20,
    color: "#000",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    color: "#000",
  },
  subtext: {
    color: "#999",
    fontSize: 14,
    lineHeight: 20,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    marginLeft: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  categoryContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  barCard: {
    backgroundColor: "#deded7",
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    marginLeft: 5,
  },
  categoryImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  categoryLabel: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    fontFamily: "UbuntuMedium",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 20,
  },
  card1: {
    backgroundColor: "#5ad3f3",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "45%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "45%",
  },
  cardImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "UbuntuBold",
  },
  cardDescription: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "UbuntuRegular",
  },
  DoctorContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  DoctorCard: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: "#deded7",
    borderRadius: 10,
    alignItems: "center",
  },
  DoctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  DoctorName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "UbuntuBold",
  },
  DoctorDepartment: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "UbuntuMedium",
  },
  DoctorRating: {
    fontSize: 14,
    color: "gray",
    fontFamily: "UbuntuMedium",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 100,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
