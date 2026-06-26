import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackScreenProps } from '../types';
import { colors } from '../constants/theme';

const MOCK_ORDERS = [
  { id: '1', title: 'Jordan 1 Retro', status: 'Shipped', price: 285 },
  { id: '2', title: 'Dunk Low Panda', status: 'Paid', price: 120 },
];

export function SellerDashboardScreen({ navigation }: RootStackScreenProps<'SellerDashboard'>) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text className="text-xl font-bold text-gray-900 ml-3">Seller Dashboard</Text>
      </View>

      <View className="flex-row p-4 gap-3">
        <View className="flex-1 p-4 rounded-xl bg-gray-50">
          <Text className="text-gray-500 text-sm">Active listings</Text>
          <Text className="text-2xl font-bold text-gray-900 mt-1">4</Text>
        </View>
        <View className="flex-1 p-4 rounded-xl bg-gray-50">
          <Text className="text-gray-500 text-sm">Total sales</Text>
          <Text className="text-2xl font-bold text-gray-900 mt-1">$1,240</Text>
        </View>
      </View>

      <Text className="px-4 text-lg font-bold text-gray-900 mb-2">Recent orders</Text>
      <FlatList
        data={MOCK_ORDERS}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-8"
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
            className="flex-row items-center py-4 border-b border-gray-100"
          >
            <View className="flex-1">
              <Text className="font-semibold text-gray-900">{item.title}</Text>
              <Text className="text-gray-500 text-sm">{item.status}</Text>
            </View>
            <Text className="font-bold text-gray-900">${item.price}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
