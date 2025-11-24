import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';

export type CardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  lightColor?: string;
  darkColor?: string;
  padding?: number;
  className?: string;
};

export function Card({ children, onPress, style, lightColor, darkColor, padding = 16, className }: CardProps) {
  const content = (
    <ThemedView
      lightColor={lightColor}
      darkColor={darkColor}
      className={className}
      style={[styles.card, { padding }, style]}
    >
      {children}
    </ThemedView>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
  },
  pressed: {
    opacity: 0.85,
  },
});
