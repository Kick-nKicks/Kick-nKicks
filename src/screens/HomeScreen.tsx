import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { TabScreenProps } from '../types';
import { useListings } from '../hooks/useListings';
import { SearchBar } from '../components/SearchBar';
import { ShoeCard } from '../components/ShoeCard';
import { colors, pastelForKey, surfaceShadow } from '../constants/theme';

const HOME_BRANDS = ['All', 'Nike', 'Jordan', 'Adidas', 'New Balance'] as const;

export function HomeScreen({ navigation }: TabScreenProps<'HomeTab'>) {
  const insets = useSafeAreaInsets();
  const { listings, filters, setFilters, loading, refreshing, error, refetch } = useListings();

  const selectedBrand = filters.brand ?? 'All';

  const handleBrandPress = (brand: (typeof HOME_BRANDS)[number]) => {
    setFilters({ ...filters, brand: brand === 'All' ? undefined : brand });
  };

  const listHeader = (
    <>
      <View
        className="px-4 pb-5 border-b"
        style={[
          surfaceShadow,
          {
            paddingTop: insets.top + 12,
            backgroundColor: colors.surfaceGlass,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text className="text-3xl font-bold text-center tracking-tight" style={{ color: colors.text }}>
          Kick<Text style={{ color: colors.brand }}>'</Text>n Kicks
        </Text>
        <Text className="text-center text-sm mt-1 mb-5" style={{ color: colors.textMuted }}>
          Buy · Sell · Restore
        </Text>

        <SearchBar
          editable={false}
          variant="light"
          placeholder="Search sneakers, brands, sizes…"
          onPress={() => navigation.navigate('SearchTab')}
        />
      </View>

      <FlatList
        horizontal
        data={[...HOME_BRANDS]}
        keyExtractor={(brand) => brand}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 py-3 gap-2"
        style={{ backgroundColor: 'transparent' }}
        renderItem={({ item: brand }) => {
          const isActive = selectedBrand === brand;
          const pastel = pastelForKey(brand);
          return (
            <Pressable
              onPress={() => handleBrandPress(brand)}
              className="px-4 py-2 rounded-full border mr-2"
              style={
                isActive
                  ? { backgroundColor: colors.brand, borderColor: colors.brand }
                  : { backgroundColor: `${pastel}CC`, borderColor: pastel }
              }
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: isActive ? '#FFFFFF' : colors.text }}
              >
                {brand}
              </Text>
            </Pressable>
          );
        }}
      />

      <View className="mx-4 my-4 rounded-2xl overflow-hidden" style={surfaceShadow}>
        <LinearGradient
          colors={[colors.brand, '#D4939A', '#C4B8D9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-4 flex-row items-center justify-between"
        >
          <View className="flex-1 pr-3">
            <Text className="text-white font-bold text-lg">Restore My Shoes</Text>
            <Text className="text-white/85 text-sm mt-1">
              Deep clean, repaint, sole swap — find a cobbler near you
            </Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Restore')}
            className="px-4 py-2.5 rounded-xl"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
          >
            <Text className="font-bold text-sm" style={{ color: colors.brand }}>
              Try Now
            </Text>
          </Pressable>
        </LinearGradient>
      </View>

      <View className="px-4 pb-2 flex-row items-center justify-between">
        <Text className="text-lg font-bold" style={{ color: colors.text }}>
          Latest Listings
        </Text>
        {!loading && listings.length > 0 && (
          <Text className="text-sm" style={{ color: colors.textMuted }}>
            {listings.length} results
          </Text>
        )}
      </View>
    </>
  );

  return (
    <View className="flex-1">
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        numColumns={2}
        style={{ backgroundColor: 'transparent' }}
        ListHeaderComponent={listHeader}
        contentContainerClassName="pb-8"
        columnWrapperClassName="px-2"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetch}
            tintColor={colors.brand}
            colors={[colors.brand]}
          />
        }
        ListEmptyComponent={
          loading && !refreshing ? (
            <View className="py-16 items-center">
              <ActivityIndicator size="large" color={colors.brand} />
              <Text className="mt-3" style={{ color: colors.textMuted }}>
                Loading listings…
              </Text>
            </View>
          ) : (
            <View className="py-16 px-6 items-center">
              <Text className="font-semibold text-center" style={{ color: colors.text }}>
                {error ? 'Could not load listings' : 'No listings yet'}
              </Text>
              <Text className="text-center mt-2" style={{ color: colors.textMuted }}>
                {error ?? 'Pull down to refresh or list a shoe on the Sell+ tab.'}
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <ShoeCard
            listing={item}
            onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}
          />
        )}
      />
    </View>
  );
}
