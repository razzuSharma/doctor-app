import { ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import YoutubePlayer from "react-native-youtube-iframe";
import { Card, Title, Paragraph } from "react-native-paper"; // Import card components

const MessageScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* First Video Card */}
      <Card style={styles.card}>
        <YoutubePlayer
          height={200}
          width={400}
          play={false}
          autoplay={false}
          videoId={"-_VhU5rqyko"}
        />
        <Card.Content style={{marginTop: 10}}>
          <Title>7 Fitness Habits That Will Change Your Life</Title>
        </Card.Content>
      </Card>

      {/* Second Video Card */}
      <Card style={styles.card}>
        <YoutubePlayer
          height={200}
          width={400}
          play={false}
          autoplay={false}
          videoId={"YNsuneGBsMY"}
        />
        <Card.Content style={{marginTop: 10}}>
          <Title>5 Tips for Living a Long and Healthy Life</Title>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <YoutubePlayer
          height={200}
          width={400}
          play={false}
          autoplay={false}
          videoId={"-7V9S9wdLfc"}
        />
        <Card.Content style={{marginTop: 10}}>
          <Title>Why we should not shy away from sexual education</Title>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center", // Center items vertically
    marginTop: 100, // Top margin
  },
  card: {
    marginVertical: 10,
    elevation: 3, // Add shadow to the card
  },
});
