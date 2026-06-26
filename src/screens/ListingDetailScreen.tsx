import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { Listing, RootStackScreenProps } from '../types';
import { useListings } from '../hooks/useListings';
import { OfferModal } from '../components/OfferModal';
import { colors } from '../constants/theme';

export function ListingDetailScreen({
  route,
  navigation,
}: RootStackScreenProps<'ListingDetail'>) {
  const insets = useSafeAreaInsets();
  const { getListingById, fetchListing } = useListings();
  const [listing, setListing] = useState<Listing | null>(() =>
    getListingById(route.params.listingId),
  );
  const [loading, setLoading] = useState(!listing);
  const [offerVisible, setOfferVisible] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const cached = getListingById(route.params.listingId);
      if (cached) {
        setListing(cached);
        setLoading(false);
        return;
      }

      setLoading(true);
      const fetched = await fetchListing(route.params.listingId);
      if (active) {
        setListing(fetched);
        setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [route.params.listingId, getListingById, fetchListing]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  if (!listing) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Listing not found.</Text>
        <Pressable onPress={() => navigation.goBack()} className="mt-4">
          <Text className="text-brand font-semibold">Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScrollView contentContainerClassName="pb-32">
        <Image source={{ uri: listing.imageUrl }} className="w-full aspect-square" />
        <View className="p-5">
          <Text className="text-brand font-semibold uppercase">{listing.brand}</Text>
          <Text className="text-2xl font-bold text-gray-900 mt-1">{listing.title}</Text>
          <Text className="text-gray-500 mt-2">
            Size {listing.size} · {listing.condition.replace(/_/g, ' ')}
          </Text>
          <Text className="text-3xl font-bold text-gray-900 mt-4">${listing.price}</Text>
          <Text className="text-gray-600 mt-4 leading-6">
            {listing.description ?? 'Authentic sneakers from a verified seller on Kick\'n Kicks.'}
          </Text>
          <Text className="text-sm text-gray-500 mt-4">Sold by {listing.sellerName}</Text>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 flex-row gap-3 px-5 pt-4 border-t border-gray-100 bg-white"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <Pressable
          onPress={() => setOfferVisible(true)}
          className="flex-1 py-3.5 rounded-xl border border-gray-200 items-center"
        >
          <Text className="font-semibold text-gray-800">Make Offer</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Checkout', { listingId: listing.id })}
          className="flex-1 py-3.5 rounded-xl items-center"
          style={{ backgroundColor: colors.brand }}
        >
          <Text className="font-semibold text-white">Buy Now</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => navigation.goBack()}
        className="absolute left-4 rounded-full bg-black/40 p-2"
        style={{ top: insets.top + 8 }}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </Pressable>

      <OfferModal
        visible={offerVisible}
        listingPrice={listing.price}
        onClose={() => setOfferVisible(false)}
        onSubmit={(amount) => Alert.alert('Offer sent', `You offered $${amount}`)}
      />
    </View>
  );
}
