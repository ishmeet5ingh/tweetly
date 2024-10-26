import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUsers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://192.168.1.5:3000/get-posts");
      setPosts(response.data);
    } catch (error) {
      console.log("Error fetching posts", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `http://192.168.1.5:3000/posts/${postId}/${userId}/like`
      );
      const updatedPost = response.data;
      const updatedPosts = posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );

      setPosts(updatedPosts);
    } catch (error) {
      console.log("Error liking the post", error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await axios.put(
        `http://192.168.1.5:3000/posts/${postId}/${userId}/unlike`
      );
      const updatedPost = response.data;
      const updatedPosts = posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );

      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  const renderPost = ({ item }) => (
    <View key={item._id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image
          style={styles.avatar}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.postDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      <Text style={styles.postContent}>{item.content}</Text>

      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => item.likes.includes(userId) ? handleDislike(item._id) : handleLike(item._id)}>
          {item.likes.includes(userId) ? (
            <AntDesign name="heart" size={20} color="red" />
          ) : (
            <AntDesign name="hearto" size={20} color="black" />
          )}
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="comment-o" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="share-social-outline" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.likesReplies}>
        {item.likes.length} likes • {item.replies.length} replies
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={{
            uri: "https://img.freepik.com/premium-vector/t-letter-wave-logo-vector_667864-8691.jpg?semt=ais_hybrid",
          }}
        />
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.postsContainer}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 50,
    resizeMode: "contain",
  },
  postsContainer: {
    paddingHorizontal: 15,
  },
  postCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  postDate: {
    fontSize: 12,
    color: "#888",
  },
  postContent: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  likesReplies: {
    marginTop: 5,
    color: "gray",
    fontSize: 12,
  },
});
