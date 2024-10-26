import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [user, setUser] = useState({});
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://192.168.1.5:3000/profile/${userId}`
        );
        const { user } = response.data;
        setUser(user);
      } catch (error) {
        console.log("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
    console.log("Cleared auth token");
    navigation.replace("Login");
  };

  const logout = () => {
    clearAuthToken();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>

        <View style={styles.profileDetails}>
          <Image
            style={styles.profileImage}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
            }}
          />
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>BTech.</Text>
            <Text style={styles.bioText}>Movie Buff | Musical Nerd</Text>
            <Text style={styles.bioText}>Love Yourself</Text>
          </View>
        </View>

        <Text style={styles.followersCount}>
          {user?.followers?.length} followers
        </Text>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.editButton}>
            <Text>Edit Profile</Text>
          </Pressable>
          <Pressable onPress={logout} style={styles.logoutButton}>
            <Text>Logout</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 55,
    padding: 15,
    backgroundColor: "#f0f4f8",
  },
  header: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },
  userTag: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#D0D0D0",
  },
  profileDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "contain",
    marginRight: 15,
  },
  bioContainer: {
    flex: 1,
  },
  bioText: {
    fontSize: 15,
    fontWeight: "400",
  },
  followersCount: {
    color: "gray",
    fontSize: 15,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  editButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#f8f8f8",
    marginRight: 5,
  },
  logoutButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#f8f8f8",
    marginLeft: 5,
  },
});
