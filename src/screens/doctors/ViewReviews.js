import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Divider } from "react-native-elements";
import { firebase } from "../../firebase/config";

const ViewReviews = () => {
  const [myReviews, setMyReviews] = useState([]);
  const fetchReviews = firebase.firestore().collection("reviews");

  const handleFetchReviews = () => {
    setMyReviews([]);
    fetchReviews.onSnapshot((QuerySnapshot) => {
      let _reviews = [];

      QuerySnapshot.forEach((doc) => {
        _reviews.push({ ...doc.data() });
      });
      setMyReviews(_reviews);
    });
  };

  useEffect(() => {
    handleFetchReviews();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>All Reviews</Text>
        <Divider style={styles.divider} />
        {myReviews.map((review, index) => (
          <View key={index} style={styles.reviewContainer}>
            <Text style={styles.reviewTitle}>Name: {review.reviewer}</Text>
            <Text style={styles.reviewDescription}>Review: {review.review}</Text>
            <Text style={styles.reviewDescription}>Rating: {review.reviewRating}</Text>
            <Divider style={styles.divider} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ViewReviews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2596be",
    paddingTop: 50,
  },
  card: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 20,
    margin: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  divider: {
    marginVertical: 20,
  },
  reviewContainer: {
    marginBottom: 20,
  },
  reviewTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  reviewDescription: {
    color: "#555",
    fontSize: 18,
  },
});
