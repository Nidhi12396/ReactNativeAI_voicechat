// src/components/BotAvatar.tsx
import React, { useEffect, useRef } from 'react';
import { Image, Animated, StyleSheet, View } from 'react-native';

interface BotAvatarProps {
  size?: number;
  isSpeaking?: boolean;
  isThinking?: boolean;
}

export default function BotAvatar({
  size = 120,
  isSpeaking = false,
  isThinking = false,
}: BotAvatarProps) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isSpeaking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -8,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isSpeaking, bounceAnim]);

  useEffect(() => {
    if (isThinking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isThinking, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-5deg', '5deg'],
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={{
          transform: [
            { translateY: bounceAnim },
            { rotate: isThinking ? rotate : '0deg' },
          ],
        }}
      >
        <Image
          source={require('../../assets/images/bot.png')}
          style={[styles.image, { width: size, height: size }]}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    // sizing handled by prop
  },
});
