import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { Message, RootStackScreenProps } from '../types';
import { colors } from '../constants/theme';

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    senderId: 'seller',
    text: 'Hey! These are 100% authentic with receipt.',
    createdAt: '10:02 AM',
    isMine: false,
  },
  {
    id: '2',
    senderId: 'me',
    text: 'Would you take $250?',
    createdAt: '10:05 AM',
    isMine: true,
  },
];

export function ChatScreen({ navigation }: RootStackScreenProps<'Chat'>) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [draft, setDraft] = useState('');

  const send = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        senderId: 'me',
        text: draft.trim(),
        createdAt: 'Now',
        isMine: true,
      },
    ]);
    setDraft('');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text className="text-lg font-bold text-gray-900 ml-3">KickVault</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4 gap-3"
        renderItem={({ item }) => (
          <View className={`max-w-[80%] ${item.isMine ? 'self-end' : 'self-start'}`}>
            <View
              className={`px-4 py-2.5 rounded-2xl ${
                item.isMine ? 'bg-brand' : 'bg-gray-100'
              }`}
            >
              <Text className={item.isMine ? 'text-white' : 'text-gray-900'}>{item.text}</Text>
            </View>
            <Text className="text-xs text-gray-400 mt-1">{item.createdAt}</Text>
          </View>
        )}
      />

      <View
        className="flex-row items-center px-4 py-2 border-t border-gray-100 gap-2"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <TextInput
          className="flex-1 bg-gray-50 rounded-full px-4 py-2.5"
          value={draft}
          onChangeText={setDraft}
          placeholder="Message…"
          placeholderTextColor="#ADB5BD"
        />
        <Pressable onPress={send} className="p-2">
          <Ionicons name="send" size={22} color={colors.brand} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
