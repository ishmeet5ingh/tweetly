import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
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

  useEffect(() => {
    fetchPosts();
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
      console.log("error fetching posts", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `http://192.168.1.5:3000/posts/${postId}/${userId}/like`
      );
      const updatedPost = response.data;
      const updatedPosts = posts?.map((post) =>
        post?._id === updatedPost._id ? updatedPost : post
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={{
            uri: "https://img.freepik.com/premium-vector/t-letter-wave-logo-vector_667864-8691.jpg?semt=ais_hybrid",
          }}
        />
      </View>

      <View style={styles.postsContainer}>
        {posts?.map((post) => (
          <View key={post._id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image
                style={styles.avatar}
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                }}
              />
              <View>
                <Text style={styles.userName}>{post?.user?.name}</Text>
                <Text style={styles.postContent}>{post?.content}</Text>
              </View>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity onPress={() => post?.likes?.includes(userId) ? handleDislike(post?._id) : handleLike(post?._id)}>
                {post?.likes?.includes(userId) ? (
                  <AntDesign name="heart" size={18} color="red" />
                ) : (
                  <AntDesign name="hearto" size={18} color="black" />
                )}
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesome name="comment-o" size={18} color="black" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="share-social-outline" size={18} color="black" />
              </TouchableOpacity>
            </View>

            <Text style={styles.likesReplies}>
              {post?.likes?.length} likes • {post?.replies?.length} replies
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 20,
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
    paddingHorizontal: 10,
  },
  postCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    elevation: 3,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  postContent: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 10,
  },
  likesReplies: {
    marginTop: 7,
    color: "gray",
    fontSize: 12,
  },
});
