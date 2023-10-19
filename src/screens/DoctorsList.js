import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { firebase } from "../firebase/config";
import { Table, Row } from "react-native-table-component";
import EditDoctor from "../component/EditDoctor";
import { doc, deleteDoc } from "firebase/firestore";

const DoctorsList = ({ navigation }) => {
  const [doctorsData, setDoctorsData] = useState([]);
  const [tableHead, setTableHead] = useState(["Name", "ID", "Edit", "Delete"]);
  const [doctorVisible, setDoctorVisible] = useState(false);


  const [globalExtractedId, setglobalExtractedId] = useState();

  useEffect(() => {
    const doctorsCollection = firebase.firestore().collection("doctors");
    const unsubscribe = doctorsCollection.onSnapshot((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setDoctorsData(data);
    });

    // Cleanup function to unsubscribe from the snapshot listener
    return () => {
      unsubscribe();
    };
  }, []);

  const handleEdit = (doctorId) => {
    console.log(doctorId);
    // Navigate to the edit screen with the doctorId for editing
    // navigation.navigate("EditDoctor", { doctorId });
    setDoctorVisible(!doctorVisible);
    setglobalExtractedId(doctorId)
    console.log(doctorVisible, "fjfsjgjc");
  };

  const handleDelete = async (doctorId) => {
    try {
      const doctorDocRef = doc(firebase.firestore(), "doctors", doctorId);
      await deleteDoc(doctorDocRef);
      console.log("Document successfully deleted.");

      // Now, you should update your local state to reflect the deletion.
      // You can filter out the deleted document from your `doctorsData` array.
      setDoctorsData((prevData) =>
        prevData.filter((doc) => doc.id !== doctorId)
      );
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Table borderStyle={{ borderWidth: 0 }}>
          <Row
            data={tableHead}
            style={styles.head}
            textStyle={styles.headText}
          />
          {doctorsData.map((doctor) => (
            <>
              <Row
                style={{ textAlign: "center" }}
                key={doctor.id}
                data={[
                  doctor.name,
                  doctor.id,
                  <View style={styles.centeredContainer}>
                    <TouchableOpacity
                      onPress={() => handleEdit(doctor.id)}
                      style={styles.editButton}
                    >
                      <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                  </View>,
                  <View style={styles.centeredContainer}>
                    <TouchableOpacity
                      onPress={() => handleDelete(doctor.id)}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>,
                ]}
                textStyle={styles.text}
              />
            </>
          ))}
        </Table>
        <View style={{height:50}} />
      {doctorVisible ? <EditDoctor doctorId={globalExtractedId} /> : null}
      </View>

    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  headText: { margin: 6, fontWeight: "bold", textAlign: "center" },
  text: { margin: 6 },
  editButton: {
    backgroundColor: "#5E8D48", // Green color
    borderRadius: 5,
    padding: 3, // Smaller button size
    width: 80,
  },
  deleteButton: {
    backgroundColor: "#FF5733", // Red color
    borderRadius: 5,
    padding: 3,
    width: 80,
    // Smaller button size
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DoctorsList;
