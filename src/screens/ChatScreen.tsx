import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

type ChatScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Chat'>;
  route: RouteProp<RootStackParamList, 'Chat'>;
};

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isSender: boolean;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'You both noticed each other. Say what you couldn\'t then.',
      timestamp: new Date().toISOString(),
      isSender: false,
    },
  ]);
  const flatListRef = useRef<FlatList>(null);

  // Gradient colors as tuple for LinearGradient
  const gradientColors: [string, string] = [COLORS.primary, COLORS.primaryLight];

  useEffect(() => {
    // Initialize real-time chat functionality
    // TODO: Set up Firestore listeners for real-time messages
    // TODO: Handle user authentication and chat permissions
    // TODO: Implement message encryption for privacy
  }, []);

  const handleSend = () => {
    if (message.trim().length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      timestamp: new Date().toISOString(),
      isSender: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');

    // Simulate response after 2 seconds
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Thanks for reaching out! I noticed you too.',
        timestamp: new Date().toISOString(),
        isSender: false,
      };
      setMessages((prev) => [...prev, response]);
    }, 2000);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isSender ? styles.senderContainer : styles.receiverContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isSender ? styles.senderBubble : styles.receiverBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isSender ? styles.senderText : styles.receiverText,
          ]}
        >
          {item.content}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.gradientBg}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chat</Text>
          <View style={{ width: 50 }} />
        </View>

        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={COLORS.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryLight,
  },
  backButton: {
    padding: SPACING.s,
  },
  backButtonText: {
    fontSize: SIZES.body1,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: SIZES.h4,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: SPACING.m,
  },
  messageContainer: {
    marginBottom: SPACING.m,
    maxWidth: '80%',
  },
  senderContainer: {
    alignSelf: 'flex-end',
  },
  receiverContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: SPACING.m,
    borderRadius: 20,
    maxWidth: '100%',
  },
  senderBubble: {
    backgroundColor: COLORS.primaryLight,
    borderBottomRightRadius: 4,
  },
  receiverBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: SIZES.body1,
    lineHeight: 20,
  },
  senderText: {
    color: COLORS.text,
    fontFamily: FONTS.medium,
  },
  receiverText: {
    color: COLORS.text,
    fontFamily: FONTS.regular,
  },
  timestamp: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.primaryLight,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    marginRight: SPACING.s,
    color: COLORS.text,
    fontSize: SIZES.body1,
    fontFamily: FONTS.regular,
  },
  sendButton: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: COLORS.text,
    fontSize: SIZES.body1,
    fontFamily: FONTS.bold,
  },
});

export default ChatScreen; 