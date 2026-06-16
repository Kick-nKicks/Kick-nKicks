import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Ionicons } from '@expo/vector-icons';
import type { AuthStackScreenProps } from '../types';
import { useAuth } from '../hooks/useAuth';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { colors } from '../constants/theme';

export function AuthScreen(_props: AuthStackScreenProps<'Auth'>) {
  const insets = useSafeAreaInsets();
  const { signInWithEmail, signUpWithEmail, signInDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Required', 'Enter email and password.');
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        Alert.alert('Check your email', 'Confirm your account to continue.');
      } else {
        await signInWithEmail(email, password);
      }
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!isSupabaseConfigured) {
      signInDemo();
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'kicknkicks://auth/callback' },
    });
    if (error) Alert.alert('Google sign-in', error.message);
  };

  const handleApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (!isSupabaseConfigured) {
        signInDemo();
        return;
      }
      if (credential.identityToken) {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });
        if (error) Alert.alert('Apple sign-in', error.message);
      }
    } catch (e: unknown) {
      if ((e as { code?: string }).code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Apple sign-in', 'Unable to sign in with Apple.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerClassName="flex-grow px-6 pb-8"
        style={{ paddingTop: insets.top + 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-4xl font-bold text-gray-900 text-center">
          Kick<Text className="text-brand">'</Text>n Kicks
        </Text>
        <Text className="text-gray-500 text-center mt-2 mb-10">
          The sneaker marketplace with soul
        </Text>

        <Text className="text-sm font-semibold text-gray-700 mb-1">Email</Text>
        <TextInput
          className="bg-gray-50 rounded-xl px-4 py-3.5 text-base border border-gray-100 mb-4"
          value={email}
          onChangeText={setEmail}
          placeholder="you@email.com"
          placeholderTextColor="#ADB5BD"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text className="text-sm font-semibold text-gray-700 mb-1">Password</Text>
        <TextInput
          className="bg-gray-50 rounded-xl px-4 py-3.5 text-base border border-gray-100 mb-6"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor="#ADB5BD"
          secureTextEntry
        />

        <Pressable
          onPress={handleEmailAuth}
          disabled={loading}
          className="py-4 rounded-xl items-center"
          style={{ backgroundColor: colors.brand, opacity: loading ? 0.7 : 1 }}
        >
          <Text className="text-white font-bold">
            {loading ? 'Please wait…' : isSignUp ? 'Create Account' : 'Sign In'}
          </Text>
        </Pressable>

        <Pressable onPress={() => setIsSignUp(!isSignUp)} className="mt-4 items-center">
          <Text className="text-brand font-medium">
            {isSignUp ? 'Already have an account? Sign in' : 'New here? Create account'}
          </Text>
        </Pressable>

        <View className="flex-row items-center my-8">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="mx-4 text-gray-400 text-sm">or continue with</Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        <Pressable
          onPress={handleGoogle}
          className="flex-row items-center justify-center bg-gray-50 rounded-xl py-3.5 mb-3 border border-gray-100"
        >
          <Ionicons name="logo-google" size={22} color="#4285F4" />
          <Text className="ml-3 font-semibold text-gray-900">Google</Text>
        </Pressable>

        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={12}
            style={{ width: '100%', height: 48 }}
            onPress={handleApple}
          />
        )}

        {!isSupabaseConfigured && (
          <Pressable onPress={signInDemo} className="mt-6 py-3 items-center">
            <Text className="text-brand font-semibold">Continue as Demo</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
