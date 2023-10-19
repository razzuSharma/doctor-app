import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { firebase } from "../../firebase/config";

import MapView from "react-native-maps";
import AppointmentForm from "../../component/AppointmentForm";
import { Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

const DoctorProfile = ({ route }) => {
  const { doctorDrillData } = route.params;
  const navigation = useNavigation();

  const [myReviews, setMyReviews] = useState([]);
  const fetchReviews = firebase.firestore().collection("reviews");

  const Id = doctorDrillData[0]?.id;

  const handleFetchReviews = () => {
    setMyReviews([]);
    fetchReviews.where("referenceDoc", "==", Id).onSnapshot((QuerySnapshot) => {
      let _reviews = [];

      QuerySnapshot.forEach((doc) => {
        _reviews.push({ ...doc.data() });
      });
      setMyReviews(_reviews);
    });
  };

  useEffect(() => {
    handleFetchReviews();
  }, [Id]);

  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleBookAppointment = () => {
    setIsFormVisible(true);
  };

  const handleFormClose = () => {
    setIsFormVisible(false);
  };

  if (!doctorDrillData) {
    return <ActivityIndicator size="large" />;
  }

  const region = {
    latitude: doctorDrillData[0].latitude,
    longitude: doctorDrillData[0].longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const reviewerData = myReviews.map((reviewList) => ({
    reviewer: reviewList.reviewer,
    reviewRating: reviewList.reviewRating,
    review: reviewList.review,
  }));

  const ReviewCard = ({ name, rating, review, reviewerImage }) => {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Image
            style={styles.avatar}
            source={require("../../assets/person.png")}
          />
          <Text style={styles.ReviewName}>{name}</Text>
          <Text style={styles.ReviewRating}>{rating}</Text>
        </View>

        <Text style={styles.ReviewDesc}>{review}</Text>
      </View>
    );
  };

  return (
    <>
      <MyStatusBar backgroundColor="#2596be" barStyle="light-content" />
      <ScrollView>
        <View style={styles.upperCOntainer}>
          <Image
            source={{ uri: doctorDrillData[0].image }}
            style={styles.image}
          />
          <Text style={styles.name}>{doctorDrillData[0].name}</Text>
          <Text style={styles.dept}>{doctorDrillData[0].department}</Text>
          <View style={styles.upperIconsContainer}>
            <View style={styles.circular}>
              <Image
                source={require("../../assets/phone.png")}
                style={styles.iconUpper}
              />
            </View>
            <View style={styles.circular}>
              <Image
                source={require("../../assets/messages.png")}
                style={styles.iconUpper}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 15,
            }}
          >
            <Text style={styles.consultation}>Consultation Fee</Text>
            <Text style={styles.fee}>{doctorDrillData[0].fee}</Text>
          </View>
          <TouchableOpacity
            style={styles.BookButton}
            onPress={handleBookAppointment}
          >
            <Text style={styles.BookText}>Book Appointment</Text>
          </TouchableOpacity>
          <Modal visible={isFormVisible} animationType="slide">
            <AppointmentForm doctor={Id} onClose={handleFormClose} />
          </Modal>
        </View>
        <Text style={styles.labelHead}>About Doctor</Text>
        <Text style={styles.desc}>{doctorDrillData[0].description}</Text>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
          }}
        >
          <Text style={styles.labelHead}>Reviews</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("giveReview", { Id });
            }}
          >
            <Image
              style={styles.add}
              source={require("../../assets/add1.png")}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => navigation.navigate("send")}>
            <Image
              style={styles.add1}
              source={require("../../assets/iconsee.png")}
            />
          </TouchableOpacity> */}
        </View>
        <View style={styles.container}>
          <FlatList
            horizontal={true}
            data={reviewerData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <ReviewCard
                key={index}
                name={item.reviewer}
                rating={item.reviewRating}
                review={item.review}
                reviewerImage={item.reviewerImage}
              />
            )}
          />
        </View>

        <Text style={styles.labelHead}>Location</Text>
        <MapView style={styles.map} region={region} />
        <View style={styles.hospitalsContainer}>
          <Text style={styles.hospitalsHeading}>Where can you find me?</Text>
          <Text style={styles.hospitalsList}>
            {doctorDrillData[0].hospitals.map(
              (hospital, index) => `\u2022 ${hospital}\n`
            )}
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  upperCOntainer: {
    height: 370,
    width: "100%",
    backgroundColor: "#63c3e6",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius:50,
    resizeMode: "cover",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  name: {
    marginTop: 5,
    fontSize: 24,
    alignSelf: "center",
    fontFamily: "UbuntuBold",
  },
  dept: {
    fontSize: 18,
    alignSelf: "center",
    fontFamily: "UbuntuMedium",
  },
  upperIconsContainer: {
    flexDirection: "row",
    alignSelf: "center",
  },
  iconUpper: {
    height: 35,
    width: 35,
  },
  desc: {
    fontSize: 16,
    margin: 10,
    fontFamily: "UbuntuMedium",
  },
  labelHead: {
    fontSize: 18,
    marginLeft: 10,
    marginTop: 15,
    fontFamily: "UbuntuBold",
  },
  add: {
    marginLeft: 280,
    marginTop: 10,
    height: 30,
    width: 30,
  },
  add1: {
    marginLeft: 15,
    marginTop: 10,
    height: 30,
    width: 30,
  },
  circular: {
    backgroundColor: "white",
    height: 60,
    width: 60,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },
  map: {
    width: 350,
    height: 200,
    marginTop: 10,
    justifyContent: "center",
    alignSelf: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#c9d1d4",
    height: 170,
    marginTop: 10,
    // margin: 10,
    // borderRadius: 16,
  },
  card: {
    width: 260,
    height: 150,
    borderRadius: 10,
    backgroundColor: "#FFF",
    margin: 10,
    padding: 10,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  ReviewName: {
    flex: 1,
    fontSize: 16,
    fontFamily: "UbuntuBold",
  },
  ReviewRating: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFA500",
    fontFamily: "UbuntuBold",
  },
  ReviewDesc: {
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "UbuntuMedium",
  },
  BookButton: {
    backgroundColor: "#2557da",
    borderRadius: 15,
    padding: 10,
    margin: 14,
  },
  BookText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "UbuntuBold",
  },
  consultation: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: "UbuntuBold",
  },
  fee: {
    color: "green",
    fontSize: 16,
    marginLeft: 10,
    fontFamily: "UbuntuBold",
  },
  hospitalsHeading: {
    fontSize: 18,
    marginLeft: 10,
    marginTop: 15,
    fontFamily: "UbuntuBold",
  },
  hospitalsList: {
    fontSize: 16,
    marginLeft: 10,
    marginTop: 10,
    color: "#063e77",
    fontFamily: "UbuntuMedium",
  },
});

export default DoctorProfile;
