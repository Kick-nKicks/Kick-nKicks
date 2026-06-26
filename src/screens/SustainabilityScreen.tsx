import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackScreenProps } from '../types';
import { colors } from '../constants/theme';

export function SustainabilityScreen({ navigation }: RootStackScreenProps<'Sustainability'>) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text className="text-xl font-bold text-gray-900 ml-3">Your Impact</Text>
      </View>

      <View className="p-5">
        <Text className="text-gray-600 leading-6">
          Every resale and restore on Kick'n Kicks keeps sneakers out of landfills.
        </Text>

        <View className="mt-8 p-6 rounded-2xl bg-green-50 items-center">
          <Ionicons name="leaf" size={48} color={colors.success} />
          <Text className="text-4xl font-bold text-gray-900 mt-4">12</Text>
          <Text className="text-gray-600">Pairs saved from landfill</Text>
        </View>

        <View className="flex-row gap-3 mt-4">
          <View className="flex-1 p-4 rounded-xl bg-gray-50 items-center">
            <Text className="text-2xl font-bold text-gray-900">48 kg</Text>
            <Text className="text-gray-500 text-sm text-center mt-1">CO₂ avoided</Text>
          </View>
          <View className="flex-1 p-4 rounded-xl bg-gray-50 items-center">
            <Text className="text-2xl font-bold text-gray-900">3</Text>
            <Text className="text-gray-500 text-sm text-center mt-1">Restores done</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
