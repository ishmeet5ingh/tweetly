import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useState, useContext } from "react";
import { UserType } from "../UserContext";
import axios from "axios";

const ThreadsScreen = () => {
  const { userId } = useContext(UserType);
  const [content, setContent] = useState("");

  const handlePostSubmit = () => {
    const postData = {
      userId,
      content,
    };

    if (content) {
      axios
        .post("http://192.168.1.5:3000/create-post", postData)
        .then((response) => {
          setContent(""); // Clear input after submission
        })
        .catch((error) => {
          console.log("Error creating post", error);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.profileImage}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />
        <Text style={styles.headerText}>What's on your mind?</Text>
      </View>

      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        placeholderTextColor="#888"
        placeholder="Type your message..."
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handlePostSubmit}>
        <Text style={styles.buttonText}>Share Post</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ThreadsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
