import { ThemedText } from "@/components/themed-text";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image } from "expo-image";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const friendsData = [
  { id: "1", name: "John Doe", backgroundColor: "bg-green-200" },
  { id: "2", name: "Jane Smith", backgroundColor: "bg-orange-200" },
  { id: "3", name: "Alice Johnson", backgroundColor: "bg-purple-200" },
  { id: "4", name: "Bob Brown", backgroundColor: "bg-green-200" },
];

export default function UploadingScreen() {
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );
  }, [scale]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 250); // Adjust the interval speed as needed

    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const toggleFriendSelection = (id: string) => {
    if (selectedFriends.includes(id)) {
      setSelectedFriends(selectedFriends.filter((friendId) => friendId !== id));
    } else {
      setSelectedFriends([...selectedFriends, id]);
    }
  };

  const renderFriendItem = ({ item }: { item: { id: string; name: string; backgroundColor: string } }) => (
    <TouchableOpacity
      className={`flex-row items-center gap-16 p-2 my-1 ${item.backgroundColor} rounded-full`}
      onPress={() => toggleFriendSelection(item.id)}
    >
      <View className="flex flex-row gap-4 items-center w-full">
        <View className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <FontAwesome name="user" size={20} color="black" />
        </View>
        <Text className="text-lg grow">{item.name}</Text>
        <View className="w-6 h-6 mr-2 bg-white rounded flex items-center justify-center">
          {selectedFriends.includes(item.id) && (
            <FontAwesome name="check" size={20} color="black" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView className="p-4">
      <ThemedText type="title" className="mb-4">
        Gemmer video
      </ThemedText>
      <View className="flex-row items-center gap-4 bg-blue-100 w-full p-4 rounded-3xl mb-12">
        <Animated.View style={animatedStyle}>
          <View className="w-10 aspect-[9/16]">
            <Image
              source={require("@/assets/images/camera-background.png")}
              className="rounded-lg h-full w-full"
            />
          </View>
        </Animated.View>
        <Text className="text-3xl font-bold opacity-70">{`${uploadProgress}%`}</Text>
      </View>
      <ThemedText type="title" className="mb-4">
        Udfordre dine venner!
      </ThemedText>
      <FlatList
        data={friendsData}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id}
        className="w-full"
      />
      <Link href="/" className="bg-blue-500 p-4 rounded-full w-full text-white text-lg font-bold text-center my-8">
        <Pressable accessibilityRole="button" accessibilityLabel="Færdig med upload">
          Færdig
        </Pressable>
      </Link>
    </ScrollView>
  );
}
