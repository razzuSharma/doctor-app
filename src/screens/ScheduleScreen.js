import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../firebase/config";
import { Calendar } from "react-native-calendars";
import { Divider } from "@react-native-material/core";

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

const ScheduleScreen = () => {
  const [myData, setMyData] = useState([]);
  const fetchFirebaseDetails = firebase.firestore().collection("Appointments");

  const handleFirebaseFetching = () => {
    setMyData([]);
    fetchFirebaseDetails.onSnapshot((query) => {
      let _tempData = [];
      query.forEach((doc) => {
        _tempData.push({ ...doc.data() });
      });
      setMyData(_tempData);
    });
  };

  useEffect(() => {
    handleFirebaseFetching();
  }, []);

  const [myDoctorRef, setMyDoctorRef] = useState([]);
  const fetchDoctorRef = firebase.firestore().collection("doctors");

  const handleDoctorRef = () => {
    setMyData([]);
    fetchDoctorRef.onSnapshot((query) => {
      let _tempRef = [];
      query.forEach((doc) => {
        _tempRef.push({ ...doc.data() });
      });
      setMyDoctorRef(_tempRef);
    });
  };

  useEffect(() => {
    handleDoctorRef();
  }, []);

  const renderAppointmentCard = (item) => {
    const markedDates = {
      [item.date]: {
        marked: true,
        dotColor: "red",
        selected: true,
      },
    };

    const matchedDoctor = myDoctorRef.find(
      (doctor) => doctor.id === item.doctor
    );

    return (
      <View key={item.id} style={styles.card}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flexDirection: "column" }}>
            <Image
              source={{ uri: matchedDoctor ? matchedDoctor.image : "" }}
              style={styles.doctorImage}
            />

            <Text style={styles.doctorName}>
              {matchedDoctor ? matchedDoctor.name : ""}
            </Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.name}>
              {item.firstname} {item.lastname}
            </Text>
            <Text style={styles.detail}>{item.address}</Text>
            <Text style={styles.detail}>{item.phone}</Text>
            <Text style={styles.detail}>{item.date}</Text>
          </View>
        </View>
        <Divider
          style={{
            marginTop: 10,
            justifyContent: "center",
          }}
          leadingInset={16}
        />
        <View style={styles.calendar}>
          <Calendar markedDates={markedDates} disableArrowLeft={false} />
        </View>
      </View>
    );
  };

  return (
    <>
      <MyStatusBar backgroundColor="#5E8D48" barStyle="light-content" />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Scheduled Appointments</Text>
          {myData.map((item) => renderAppointmentCard(item, item.id))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: "UbuntuBold",
  },
  card: {
    flexDirection: "column",
    // alignItems: "center",
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  cardText: {
    flex: 1,
    marginLeft: 30,
    fontFamily: "UbuntuMedium",
  },
  name: {
    fontSize: 18,
    marginBottom: 10,
    color: "#0B172A",
    fontFamily: "UbuntuMedium",
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
    color: "#4F4F4F",
    fontFamily: "UbuntuRegular",
  },
  doctorName: {
    fontSize: 15,
    marginTop: 10,
    color: "#0B172A",
    fontFamily: "UbuntuMedium",
  },
  calendar: {
    justifyContent: "center",
    width: "100%",
  },
});

export default ScheduleScreen;

// const renderAppointmentCard = (item) => {
//   const markedDates = {
//     [item.date]: {
//       marked: true,
//       dotColor: "red",
//       selected: true,
//     },
//   };

//   const doctor = myDoctorRef.find((doc) => doc.id === item.doctor);
//   // find the doctor object that matches the appointment's doctor ID

//   return (
//     <View style={styles.card}>
//       <Image source={require("../assets/doctor.png")} style={styles.image} />
//       <View style={styles.cardText}>
//         <Text style={styles.name}>
//           {item.firstname} {item.lastname}
//         </Text>
//         <Text style={styles.detail}>{item.address}</Text>
//         <Text style={styles.detail}>{item.phone}</Text>
//         <Text style={styles.detail}>{item.date}</Text>
//         <Text style={styles.detail}>{doctor ? doctor.name : ""}</Text>
//         <View style={styles.calendar}>
//           <Calendar markedDates={markedDates} disableArrowLeft={true} />

//           {doctor && (
//             <View style={styles.doctor}>
//               <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
//               <Text style={styles.doctorName}>{doctor.name}</Text>
//             </View>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// };
