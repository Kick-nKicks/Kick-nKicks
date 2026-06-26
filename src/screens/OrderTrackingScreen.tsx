import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackScreenProps } from '../types';
import { Pressable } from 'react-native';
import { fetchRestorationRequest } from '../lib/restoration';
import { colors } from '../constants/theme';

const ORDER_STEPS = ['Paid', 'Shipped', 'Delivered'] as const;
const RESTORATION_STEPS = ['Submitted', 'Quoted', 'In Progress', 'Done'] as const;

const RESTORATION_STATUS_INDEX: Record<string, number> = {
  pending: 0,
  quoted: 1,
  accepted: 1,
  in_progress: 2,
  done: 3,
};

export function OrderTrackingScreen({
  route,
  navigation,
}: RootStackScreenProps<'OrderTracking'>) {
  const insets = useSafeAreaInsets();
  const isRestoration = route.params.kind === 'restoration';
  const [loading, setLoading] = useState(isRestoration);
  const [restorationStatus, setRestorationStatus] = useState<string>('pending');
  const [priceRange, setPriceRange] = useState<{ low: number; high: number } | null>(null);

  useEffect(() => {
    if (!isRestoration) return;

    let active = true;

    async function load() {
      const { data } = await fetchRestorationRequest(route.params.orderId);
      if (!active) return;

      if (data) {
        setRestorationStatus(data.status ?? 'pending');
        if (data.estimated_price_low != null && data.estimated_price_high != null) {
          setPriceRange({
            low: Number(data.estimated_price_low),
            high: Number(data.estimated_price_high),
          });
        }
      }
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [isRestoration, route.params.orderId]);

  const steps = isRestoration ? RESTORATION_STEPS : ORDER_STEPS;
  const activeStep = isRestoration
    ? (RESTORATION_STATUS_INDEX[restorationStatus] ?? 0)
    : 1;

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text className="text-xl font-bold text-gray-900 ml-3">
          {isRestoration ? 'Restoration Request' : 'Track Order'}
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brand} />
        </View>
      ) : (
        <View className="p-5">
          <Text className="text-gray-500">
            {isRestoration ? 'Request' : 'Order'} #{route.params.orderId.slice(0, 8)}
          </Text>
          <Text className="text-2xl font-bold text-gray-900 mt-2">
            {isRestoration ? 'Quote request submitted' : 'On the way'}
          </Text>
          {isRestoration && priceRange ? (
            <Text className="text-gray-600 mt-1">
              Est. ${priceRange.low} – ${priceRange.high}
            </Text>
          ) : (
            !isRestoration && (
              <Text className="text-gray-600 mt-1">Tracking: KK123456789</Text>
            )
          )}

          <View className="mt-10">
            {steps.map((step, index) => {
              const done = index <= activeStep;
              return (
                <View key={step} className="flex-row items-start mb-6">
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center ${
                      done ? 'bg-brand' : 'bg-gray-200'
                    }`}
                  >
                    {done && <Ionicons name="checkmark" size={18} color="#fff" />}
                  </View>
                  <View className="ml-3 pt-1">
                    <Text className={`font-semibold ${done ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}
