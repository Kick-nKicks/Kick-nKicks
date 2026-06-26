import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { TabScreenProps } from '../types';
import { useAuth } from '../hooks/useAuth';
import { SurfaceCard } from '../components/SurfaceCard';
import { colors, pastelForKey } from '../constants/theme';

const MENU_ITEMS = [
  { icon: 'storefront' as const, label: 'Seller Dashboard', route: 'SellerDashboard' as const },
  { icon: 'cube' as const, label: 'Order Tracking', route: 'OrderTracking' as const, params: { orderId: 'ord-1' } },
  { icon: 'images' as const, label: 'App Store Screenshots', route: 'AppStoreScreenshots' as const },
  { icon: 'leaf' as const, label: 'Sustainability', route: 'Sustainability' as const },
  { icon: 'chatbubbles' as const, label: 'Messages', route: 'Chat' as const, params: { conversationId: 'conv-1' } },
];

export function ProfileScreen({ navigation }: TabScreenProps<'ProfileTab'>) {
  const insets = useSafeAreaInsets();
  const { profile, signOut } = useAuth();
  const avatarAccent = pastelForKey(profile?.email ?? 'guest');

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-5 pb-10"
      style={{ paddingTop: insets.top + 16, backgroundColor: 'transparent' }}
    >
      <View className="items-center mb-8">
        <View
          className="w-24 h-24 rounded-full items-center justify-center"
          style={{ backgroundColor: `${avatarAccent}99`, borderWidth: 3, borderColor: colors.surface }}
        >
          <Ionicons name="person" size={48} color={colors.brand} />
        </View>
        <Text className="text-2xl font-bold mt-4" style={{ color: colors.text }}>
          {profile?.displayName ?? 'Guest'}
        </Text>
        <Text style={{ color: colors.textMuted }}>{profile?.email}</Text>
        {profile && (
          <Text className="text-sm mt-1" style={{ color: colors.textMuted }}>
            ★ {profile.rating} · {profile.totalSales} sales
          </Text>
        )}
      </View>

      <SurfaceCard padded={false}>
        {MENU_ITEMS.map((item, index) => (
          <Pressable
            key={item.route}
            onPress={() => navigation.navigate(item.route, item.params as never)}
            className="flex-row items-center py-4 px-4"
            style={
              index < MENU_ITEMS.length - 1
                ? { borderBottomWidth: 1, borderBottomColor: colors.border }
                : undefined
            }
          >
            <View
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: `${pastelForKey(item.label)}99` }}
            >
              <Ionicons name={item.icon} size={18} color={colors.text} />
            </View>
            <Text className="flex-1 ml-3 text-base" style={{ color: colors.text }}>
              {item.label}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>
        ))}
      </SurfaceCard>

      <Pressable onPress={signOut} className="mt-8 py-4 items-center">
        <Text className="font-semibold" style={{ color: colors.brand }}>
          Sign Out
        </Text>
      </Pressable>
    </ScrollView>
  );
}
