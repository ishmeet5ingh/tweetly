import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { UserType } from "../UserContext";
import User from "../components/User";

const ActivityScreen = () => {
  const [selectedButton, setSelectedButton] = useState("people");
  const [users, setUsers] = useState([]);
  const { setUserId } = useContext(UserType);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      axios
        .get(`http://192.168.1.5:3000/user/${userId}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log("Error fetching users", error);
        });
    };

    fetchUsers();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
      </View>

      <View style={styles.buttonContainer}>
        {["people", "all", "requests"].map((button) => (
          <TouchableOpacity
            key={button}
            onPress={() => handleButtonClick(button)}
            style={[
              styles.button,
              selectedButton === button ? styles.buttonSelected : {},
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                selectedButton === button ? styles.buttonTextSelected : {},
              ]}
            >
              {button.charAt(0).toUpperCase() + button.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedButton === "people" && (
        <View style={styles.userList}>
          {users.map((item, index) => (
            <User key={index} item={item} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    backgroundColor: "#f0f4f8",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "white",
    borderColor: "#D0D0D0",
    borderRadius: 6,
    borderWidth: 1,
    marginHorizontal: 5,
    elevation: 2, 
  },
  buttonSelected: {
    backgroundColor: "#333",
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  buttonTextSelected: {
    color: "white",
  },
  userList: {
    marginTop: 20,
    paddingVertical: 10,
  },
});
