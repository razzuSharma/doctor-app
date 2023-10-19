import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DoctorItem = ({ doctor, onEditPress, onDeletePress }) => {
  return (
    <View style={styles.container}>
      <Text>Name: {doctor.name}</Text>
      <Text>Department: {doctor.department}</Text>
      {/* Add more fields here as needed */}
      <TouchableOpacity onPress={onEditPress} style={styles.button}>
        <Text>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDeletePress} style={styles.button}>
        <Text>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 5,
    marginLeft: 10,
  },
});

export default DoctorItem;
