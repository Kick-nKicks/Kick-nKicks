import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackScreenProps } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useRestoration } from '../hooks/useRestoration';
import { ServiceTile } from '../components/ServiceTile';
import { createRestorationRequest } from '../lib/restoration';
import { colors } from '../constants/theme';

export function RestoreScreen({ navigation }: RootStackScreenProps<'Restore'>) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { services, selectedServiceId, selectedService, priceRange, selectService } =
    useRestoration();

  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const pickPhotos = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo access to upload shoe images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 6,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotos((current) => [
        ...current,
        ...result.assets.map((asset) => asset.uri),
      ].slice(0, 6));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((current) => current.filter((_, i) => i !== index));
  };

  const handleGetQuote = async () => {
    if (!selectedService) {
      Alert.alert('Select a service', 'Choose a restoration service to continue.');
      return;
    }

    if (!user?.id || user.id === 'demo') {
      Alert.alert('Sign in required', 'Sign in with a real account to request a restoration quote.');
      return;
    }

    setSubmitting(true);

    const { data, error } = await createRestorationRequest({
      userId: user.id,
      serviceType: selectedService.id,
      notes,
      estimatedPriceLow: selectedService.priceLow,
      estimatedPriceHigh: selectedService.priceHigh,
      photoUris: photos,
    });

    setSubmitting(false);

    if (error || !data) {
      Alert.alert('Request failed', error?.message ?? 'Could not save your restoration request.');
      return;
    }

    navigation.replace('OrderTracking', {
      orderId: data.id,
      kind: 'restoration',
    });
  };

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text className="text-xl font-bold text-gray-900 ml-3">Restore My Shoes</Text>
      </View>

      <ScrollView contentContainerClassName="px-4 pb-36" showsVerticalScrollIndicator={false}>
        <Text className="text-gray-500 mt-2 mb-4">
          Upload photos, pick a service, and get a quote from a trusted cobbler.
        </Text>

        <Text className="text-sm font-semibold text-gray-700 mb-2">Photos</Text>
        <Pressable
          onPress={pickPhotos}
          className="min-h-[120px] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 mb-2"
        >
          {photos.length === 0 ? (
            <View className="flex-1 items-center justify-center py-6">
              <Ionicons name="images-outline" size={36} color={colors.brand} />
              <Text className="text-brand font-semibold mt-2">Upload Photos</Text>
              <Text className="text-gray-400 text-sm mt-1">Tap to add up to 6 images</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {photos.map((uri, index) => (
                <View key={`${uri}-${index}`} className="mr-3 relative">
                  <Image source={{ uri }} className="w-24 h-24 rounded-xl" />
                  <Pressable
                    onPress={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-gray-900 rounded-full p-1"
                  >
                    <Ionicons name="close" size={14} color="#fff" />
                  </Pressable>
                </View>
              ))}
              {photos.length < 6 && (
                <Pressable
                  onPress={pickPhotos}
                  className="w-24 h-24 rounded-xl border border-gray-200 items-center justify-center bg-white"
                >
                  <Ionicons name="add" size={28} color={colors.brand} />
                </Pressable>
              )}
            </ScrollView>
          )}
        </Pressable>

        <Text className="text-sm font-semibold text-gray-700 mt-4 mb-2">Service</Text>
        <View className="flex-row flex-wrap -mx-1.5">
          {services.map((service) => (
            <View key={service.id} className="w-1/2">
              <ServiceTile
                service={service}
                selected={selectedServiceId === service.id}
                onPress={() => selectService(service.id)}
              />
            </View>
          ))}
        </View>

        <Text className="text-sm font-semibold text-gray-700 mt-4 mb-2">Notes</Text>
        <TextInput
          className="bg-gray-50 rounded-xl px-4 py-3.5 text-base border border-gray-100 min-h-[100px]"
          value={notes}
          onChangeText={setNotes}
          placeholder="Describe damage, preferred colors, timeline…"
          placeholderTextColor="#ADB5BD"
          multiline
          textAlignVertical="top"
        />

        <View className="mt-6 p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <Text className="text-sm text-gray-500">Estimated price range</Text>
          {priceRange ? (
            <Text className="text-2xl font-bold text-gray-900 mt-1">
              ${priceRange.low} – ${priceRange.high}
            </Text>
          ) : (
            <Text className="text-base text-gray-400 mt-1">Select a service to see pricing</Text>
          )}
          {selectedService && (
            <Text className="text-sm text-gray-500 mt-2">
              Final quote may vary based on condition and cobbler assessment.
            </Text>
          )}
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 px-5 pt-4 border-t border-gray-100 bg-white"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <Pressable
          onPress={handleGetQuote}
          disabled={submitting || !selectedService}
          className="py-4 rounded-xl items-center flex-row justify-center"
          style={{
            backgroundColor: colors.brand,
            opacity: submitting || !selectedService ? 0.6 : 1,
          }}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-base">Get Quote</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
