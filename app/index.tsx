import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { bunkenStats, moodCategories, MoodCategory } from '@/constants/home-data';

import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

export default function HomeScreen() {
  const scale = useSharedValue(0.90);
  const rotate = useSharedValue('20deg');
  const bottom = useSharedValue(-100);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 1000, easing: Easing.bezier(0.5, 0.01, 0, 1) });
    rotate.value = withTiming('0deg', { duration: 1000, easing: Easing.bezier(0.5, 0.01, 0, 1) });
    bottom.value = withTiming(-30, { duration: 1000, easing: Easing.bezier(0.5, 0.01, 0, 1) });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value}, { rotate: rotate.value }],
  }));

  const parentAnimatedStyle = useAnimatedStyle(() => ({
    bottom: bottom.value,
    position: 'absolute',
    right: 0,
    height: '100%',
  }));

  return (
    <ScrollView className='p-4'>
      {/* Bunken Section */}
      <Section>
        <ThemedText type="title" style={styles.sectionTitle}>Bunken</ThemedText>
        <View className='bg-yellow-100 rounded-3xl p-2 flex flex-row items-center'>
          <Text className='ml-2 flex-1 text-lg font-bold'>{bunkenStats.count} udfordringer</Text>
          <Image
            source={require('@/assets/images/bunken-stack.png')}
            className='h-24 w-24'
          />
        </View>
      </Section>

      {/* Udfordringer Section */}
      <View className='mb-4'>
        <ThemedText type="title" style={styles.sectionTitle}>Udfordringer</ThemedText>
      </View>

      <View className='mb-12'>
        <View className='bg-purple-100 p-4 rounded-3xl w-full'>
          <View className='relative h-24'>
            <View className='absolute -bottom-16 left-[50%] -translate-x-1/2 w-3/4 z-10'>
              <View className='w-full pb-[100%] relative overflow-hidden'>
                <Animated.View style={[parentAnimatedStyle]} >
                  <Animated.Image source={require('@/assets/images/challenge-painting.png')} className='w-full h-full' style={[animatedStyle]} />
                </Animated.View>
              </View>
            </View>
          </View>
          <View className='bg-white shadow-xl shadow-purple-300 rounded-2xl p-4 flex flex-row gap-4 items-center w-full'>
            <View className='flex-1 grow'>
              <Text className='text-lg font-bold'>Kunst udfordring!</Text>
              <Text className='opacity-50'>Anda har udfordret dig</Text>
            </View>
            <View className='h-12 w-12 bg-orange-300 rounded-full'>
                <Image
                  source={require('@/assets/images/arrow-white.png')}
                  style={{ width: 23, height: 16, margin: 'auto' }}
                />
            </View>
          </View>
        </View>
        </View>

      {/* Humør Section */}
      <Section>
        <ThemedText type="title" style={styles.sectionTitle}>Hvad har du lyst til?</ThemedText>
        <View style={{ gap: 16 }}>
          {moodCategories.map((m: MoodCategory) => {
            const content = (
              <View className='bg-yellow-100 rounded-3xl p-2 flex flex-row items-center' style={{ backgroundColor: m.colorLight }}>
                <Text className='ml-2 flex-1 text-lg font-bold'>{m.label}</Text>
                <Image
                  source={m.image}
                  className='h-24 w-24'
                />
              </View>
            );
            if (m.id === 'movement') {
              return (
                <Link key={m.id} href="/challenge" asChild>
                  <Pressable accessibilityRole="button" accessibilityLabel="Åbn udfordring for bevægelse" onPress={() => router.push('/challenge')}>
                    {content}
                  </Pressable>
                </Link>
              );
            }
            return (
              <View key={m.id}>{content}</View>
            );
          })}
        </View>
      </Section>
    </ScrollView>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <View className='mb-12 gap-4'>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginLeft: 0,
  },
  imageContainer: {
    position: 'absolute',
    height: '100%',
    width: '20%',
    left: 0,
    bottom: 0,
  },
});
