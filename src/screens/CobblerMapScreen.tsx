import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackScreenProps } from '../types';
import { useRestoration } from '../hooks/useRestoration';
import { colors } from '../constants/theme';

export function CobblerMapScreen({ navigation }: RootStackScreenProps<'CobblerMap'>) {
  const insets = useSafeAreaInsets();
  const { cobblers } = useRestoration();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const region = {
    latitude: 33.4484,
    longitude: -112.074,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  return (
    <View className="flex-1">
      <MapView style={{ flex: 1 }} initialRegion={region}>
        {cobblers.map((cobbler) => (
          <Marker
            key={cobbler.id}
            coordinate={{ latitude: cobbler.latitude, longitude: cobbler.longitude }}
            title={cobbler.name}
            onPress={() => setSelectedId(cobbler.id)}
          />
        ))}
      </MapView>

      <Pressable
        onPress={() => navigation.goBack()}
        className="absolute left-4 rounded-full bg-white p-2 shadow"
        style={{ top: insets.top + 8 }}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-64"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <FlatList
          data={cobblers}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4"
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedId(item.id)}
              className={`p-4 mb-2 rounded-xl border ${
                selectedId === item.id ? 'border-brand bg-red-50' : 'border-gray-100'
              }`}
            >
              <Text className="font-bold text-gray-900">{item.name}</Text>
              <Text className="text-gray-500 text-sm mt-1">{item.address}</Text>
              <Text className="text-brand text-sm mt-1">★ {item.rating}</Text>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}
