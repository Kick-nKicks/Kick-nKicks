import { Image, Pressable, Text, View } from 'react-native';
import type { Listing } from '../types';
import { colors, pastelForKey, surfaceShadow } from '../constants/theme';

interface ShoeCardProps {
  listing: Listing;
  onPress: () => void;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCondition(condition: string): string {
  const labels: Record<string, string> = {
    DS: 'Deadstock',
    VNDS: 'VNDS',
    GC: 'Good Condition',
    Fair: 'Fair',
    Poor: 'Poor',
  };
  return labels[condition] ?? condition.replace(/_/g, ' ');
}

export function ShoeCard({ listing, onPress }: ShoeCardProps) {
  const accent = pastelForKey(listing.brand);

  return (
    <Pressable
      onPress={onPress}
      className="flex-1 m-1.5 rounded-2xl overflow-hidden"
      style={[
        surfaceShadow,
        {
          backgroundColor: colors.surfaceGlass,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.9)',
        },
      ]}
    >
      <View style={{ height: 4, backgroundColor: accent }} />
      <Image
        source={{ uri: listing.imageUrl }}
        className="w-full aspect-square"
        resizeMode="cover"
      />
      <View className="p-3">
        <View
          className="self-start px-2 py-0.5 rounded-md mb-1"
          style={{ backgroundColor: `${accent}99` }}
        >
          <Text className="text-xs text-gray-800 font-semibold uppercase">{listing.brand}</Text>
        </View>
        <Text className="text-sm font-semibold text-gray-900 mt-0.5" numberOfLines={2}>
          {listing.title}
        </Text>
        <Text className="text-xs text-gray-500 mt-1">
          Size {listing.size} · {formatCondition(listing.condition)}
        </Text>
        <Text className="text-lg font-bold mt-2" style={{ color: colors.text }}>
          {formatPrice(listing.price)}
        </Text>
      </View>
    </Pressable>
  );
}
