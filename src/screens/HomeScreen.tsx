// src/screens/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors, Spacing } from '../constants/colors';
import { Strings } from '../constants/strings';
import BotAvatar from '../components/BotAvatar';
import FeatureCard from '../components/FeatureCard';
import MicButton from '../components/MicButton';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const features: Array<{
    title: string;
    description: string;
    icon: any;
    backgroundColor: string;
    mode: 'chatgpt' | 'dalle' | 'smartai';
  }> = [
    {
      title: Strings.chatGPTTitle,
      description: Strings.chatGPTDesc,
      icon: require('../../assets/images/chatgptIcon.png'),
      backgroundColor: Colors.chatGPTCard,
      mode: 'chatgpt',
    },
    {
      title: Strings.dalleTitle,
      description: Strings.dalleDesc,
      icon: require('../../assets/images/dalleIcon.png'),
      backgroundColor: Colors.dalleCard,
      mode: 'dalle',
    },
    {
      title: Strings.smartAITitle,
      description: Strings.smartAIDesc,
      icon: require('../../assets/images/smartaiIcon.png'),
      backgroundColor: Colors.smartAICard,
      mode: 'smartai',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bot avatar */}
        <View style={styles.avatarContainer}>
          <BotAvatar size={100} />
        </View>

        {/* Features section */}
        <Text style={styles.sectionTitle}>{Strings.features}</Text>

        {features.map(feature => (
          <FeatureCard
            key={feature.mode}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            backgroundColor={feature.backgroundColor}
            onPress={() =>
              navigation.navigate('Assistant', { mode: feature.mode })
            }
          />
        ))}

        <View style={styles.spacer} />
      </ScrollView>

      {/* Floating mic button */}
      <View style={styles.micContainer}>
        <MicButton
          isListening={false}
          onPress={() => navigation.navigate('Assistant', { mode: 'smartai' })}
          size={64}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  spacer: {
    height: Spacing.xl,
  },
  micContainer: {
    position: 'absolute',
    bottom: 36,
    alignSelf: 'center',
  },
});
