import { Alert, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackScreenProps } from '../types';
import { useListings } from '../hooks/useListings';
import { colors } from '../constants/theme';

export function CheckoutScreen({ route, navigation }: RootStackScreenProps<'Checkout'>) {
  const insets = useSafeAreaInsets();
  const { getListingById } = useListings();
  const listing = route.params.listingId ? getListingById(route.params.listingId) : null;

  const total = listing?.price ?? 0;

  const handlePay = () => {
    Alert.alert('Payment', 'Stripe checkout will be wired here.');
    navigation.replace('OrderTracking', { orderId: 'ord-new' });
  };

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text className="text-xl font-bold text-gray-900 ml-3">Checkout</Text>
      </View>

      <View className="flex-1 p-5">
        {listing ? (
          <>
            <Text className="text-lg font-bold text-gray-900">{listing.title}</Text>
            <Text className="text-gray-500 mt-1">Size {listing.size}</Text>
          </>
        ) : (
          <Text className="text-gray-500">Review your order</Text>
        )}

        <View className="mt-8 p-4 rounded-xl bg-gray-50">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Subtotal</Text>
            <Text className="font-semibold">${total}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Shipping</Text>
            <Text className="font-semibold">$12</Text>
          </View>
          <View className="flex-row justify-between pt-2 border-t border-gray-200">
            <Text className="font-bold text-gray-900">Total</Text>
            <Text className="font-bold text-gray-900">${total + 12}</Text>
          </View>
        </View>
      </View>

      <View className="px-5 pb-5" style={{ paddingBottom: insets.bottom + 16 }}>
        <Pressable
          onPress={handlePay}
          className="py-4 rounded-xl items-center"
          style={{ backgroundColor: colors.brand }}
        >
          <Text className="text-white font-bold">Pay with Stripe</Text>
        </Pressable>
      </View>
    </View>
  );
}
