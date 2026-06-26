import { FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { TabScreenProps } from '../types';
import { useListings } from '../hooks/useListings';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { ShoeCard } from '../components/ShoeCard';
import { colors } from '../constants/theme';

export function SearchScreen({ navigation }: TabScreenProps<'SearchTab'>) {
  const insets = useSafeAreaInsets();
  const { listings, query, setQuery, filters, setFilters } = useListings();

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <View className="px-4 pb-2">
        <Text className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
          Search
        </Text>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>

      <FilterBar filters={filters} onChange={setFilters} />

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        numColumns={2}
        style={{ backgroundColor: 'transparent' }}
        contentContainerClassName="px-2 pb-8"
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-12">No listings match your search.</Text>
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
