// src/screens/AssistantScreen.tsx
import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors, Spacing, BorderRadius } from '../constants/colors';
import { Strings } from '../constants/strings';
import BotAvatar from '../components/BotAvatar';
import MicButton from '../components/MicButton';
import ChatBubble from '../components/ChatBubble';
import { useVoice } from '../hooks/useVoice';
import { useTTS } from '../hooks/useTTS';
import { useChat } from '../hooks/useChat';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Assistant'>;
  route: RouteProp<RootStackParamList, 'Assistant'>;
};

export default function AssistantScreen({ navigation, route }: Props) {
  const { mode } = route.params;
  const flatListRef = useRef<FlatList>(null);

  const { isListening, spokenText, error: voiceError, startListening, stopListening, resetSpokenText } = useVoice();
  const { isSpeaking, speak, stop: stopSpeaking } = useTTS();
  const { messages, isLoading, error: chatError, sendUserMessage, clearMessages } = useChat();

  // When voice recognition produces text, send it as a message
  useEffect(() => {
    if (spokenText && !isListening) {
      handleSendText(spokenText);
      resetSpokenText();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spokenText, isListening]);

  // Show voice errors
  useEffect(() => {
    if (voiceError) {
      Alert.alert('Voice Error', voiceError);
    }
  }, [voiceError]);

  // Show chat errors
  useEffect(() => {
    if (chatError) {
      Alert.alert('Error', chatError);
    }
  }, [chatError]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendText = useCallback(
    async (text: string) => {
      const response = await sendUserMessage(text);
      if (response) {
        speak(response);
      }
    },
    [sendUserMessage, speak],
  );

  const handleMicPress = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      startListening();
    }
  }, [isListening, startListening, stopListening, stopSpeaking]);

  const handleStop = useCallback(() => {
    stopListening();
    stopSpeaking();
  }, [stopListening, stopSpeaking]);

  const getScreenTitle = () => {
    switch (mode) {
      case 'chatgpt': return 'ChatGPT';
      case 'dalle': return 'DALL-E';
      case 'smartai': return Strings.assistant;
      default: return Strings.assistant;
    }
  };

  const showUserText = isListening ? Strings.listeningPlaceholder : spokenText;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{'← Back'}</Text>
        </TouchableOpacity>
      </View>

      {/* Bot avatar */}
      <View style={styles.avatarContainer}>
        <BotAvatar size={90} isSpeaking={isSpeaking} isThinking={isLoading} />
      </View>

      {/* Section title */}
      <Text style={styles.sectionTitle}>{getScreenTitle()}</Text>

      {/* Chat area */}
      <View style={styles.chatContainer}>
        {/* Interim recognized text at top of chat */}
        {showUserText ? (
          <View style={styles.interimBubble}>
            <Text style={styles.interimText}>{showUserText}</Text>
          </View>
        ) : null}

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Bottom controls */}
      <View style={styles.controls}>
        {(isListening || isSpeaking) && (
          <TouchableOpacity style={styles.stopBtn} onPress={handleStop}>
            <Text style={styles.stopText}>{Strings.stop}</Text>
          </TouchableOpacity>
        )}

        <MicButton
          isListening={isListening}
          isRecording={isListening}
          onPress={handleMicPress}
          size={64}
        />

        {messages.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={clearMessages}>
            <Text style={styles.clearText}>{Strings.clear}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  backBtn: {
    padding: Spacing.sm,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  interimBubble: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    margin: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: '80%',
  },
  interimText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
  },
  chatList: {
    paddingVertical: Spacing.sm,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.xl,
  },
  stopBtn: {
    backgroundColor: Colors.recording,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  stopText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 15,
  },
  clearBtn: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  clearText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 15,
  },
});
