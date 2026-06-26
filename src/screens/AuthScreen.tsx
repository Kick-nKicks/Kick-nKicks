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
import { useAuth } from '../hooks/useAuth';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { SurfaceCard } from '../components/SurfaceCard';
import { colors, radii, surfaceStyle } from '../constants/theme';

export function AuthScreen() {
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

  const inputStyle = {
    backgroundColor: 'rgba(255, 253, 245, 0.8)',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerClassName="flex-grow px-6 pb-8"
        style={{ paddingTop: insets.top + 48 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-4xl font-bold text-center" style={{ color: colors.text }}>
          Kick<Text style={{ color: colors.brand }}>'</Text>n Kicks
        </Text>
        <Text className="text-center mt-2 mb-8" style={{ color: colors.textMuted }}>
          The sneaker marketplace with soul
        </Text>

        <SurfaceCard style={{ marginBottom: 8 }}>
          <Text className="text-sm font-semibold mb-1" style={{ color: colors.text }}>
            Email
          </Text>
          <TextInput
            className="px-4 py-3.5 text-base mb-4"
            style={inputStyle}
            value={email}
            onChangeText={setEmail}
            placeholder="you@email.com"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text className="text-sm font-semibold mb-1" style={{ color: colors.text }}>
            Password
          </Text>
          <TextInput
            className="px-4 py-3.5 text-base mb-6"
            style={inputStyle}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
          />

          <Pressable
            onPress={handleEmailAuth}
            disabled={loading}
            className="py-4 rounded-xl items-center"
            style={{ backgroundColor: colors.brand, opacity: loading ? 0.7 : 1, borderRadius: radii.md }}
          >
            <Text className="text-white font-bold">
              {loading ? 'Please wait…' : isSignUp ? 'Create Account' : 'Sign In'}
            </Text>
          </Pressable>

          <Pressable onPress={() => setIsSignUp(!isSignUp)} className="mt-4 items-center">
            <Text className="font-medium" style={{ color: colors.brand }}>
              {isSignUp ? 'Already have an account? Sign in' : 'New here? Create account'}
            </Text>
          </Pressable>
        </SurfaceCard>

        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
          <Text className="mx-4 text-sm" style={{ color: colors.textMuted }}>
            or continue with
          </Text>
          <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
        </View>

        <Pressable
          onPress={handleGoogle}
          className="flex-row items-center justify-center py-3.5 mb-3 rounded-xl"
          style={surfaceStyle}
        >
          <Ionicons name="logo-google" size={22} color="#4285F4" />
          <Text className="ml-3 font-semibold" style={{ color: colors.text }}>
            Google
          </Text>
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
            <Text className="font-semibold" style={{ color: colors.brand }}>
              Continue as Demo
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
