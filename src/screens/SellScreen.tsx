import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import type { ListingCondition, TabScreenProps } from '../types';
import { useAuth } from '../hooks/useAuth';
import { createListing } from '../lib/listings';
import { colors } from '../constants/theme';

const CONDITIONS: ListingCondition[] = ['DS', 'VNDS', 'GC', 'Fair', 'Poor'];

const SIZES = Array.from({ length: 30 }, (_, i) => 3.5 + i * 0.5);

const inputClassName =
  'bg-gray-50 rounded-xl px-4 py-3.5 text-base border border-gray-100 text-gray-900';

interface SuccessState {
  listingId: string;
  title: string;
  price: number;
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <Text className="text-sm font-semibold text-gray-700 mb-1">{children}</Text>;
}

function SellSuccessView({
  success,
  insets,
  onViewListing,
  onListAnother,
  onGoHome,
}: {
  success: SuccessState;
  insets: { top: number; bottom: number };
  onViewListing: () => void;
  onListAnother: () => void;
  onGoHome: () => void;
}) {
  return (
    <View
      className="flex-1 items-center justify-center px-8"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 24 }}
    >
      <View
        className="w-24 h-24 rounded-full items-center justify-center mb-6"
        style={{ backgroundColor: `${colors.brand}20` }}
      >
        <Ionicons name="checkmark-circle" size={64} color={colors.brand} />
      </View>

      <Text className="text-3xl font-bold text-gray-900 text-center">You're live!</Text>
      <Text className="text-gray-500 text-center mt-3 leading-6">
        {success.title} is now listed on Kick'n Kicks for ${success.price}.
      </Text>

      <Pressable
        onPress={onViewListing}
        className="w-full py-4 rounded-xl items-center mt-10"
        style={{ backgroundColor: colors.brand }}
      >
        <Text className="text-white font-bold text-base">View Listing</Text>
      </Pressable>

      <Pressable
        onPress={onListAnother}
        className="w-full py-4 rounded-xl items-center mt-3 border border-gray-200"
      >
        <Text className="text-gray-900 font-semibold">List Another Shoe</Text>
      </Pressable>

      <Pressable onPress={onGoHome} className="mt-6 py-2">
        <Text className="text-brand font-semibold">Back to Home</Text>
      </Pressable>
    </View>
  );
}

export function SellScreen({ navigation }: TabScreenProps<'SellTab'>) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [photos, setPhotos] = useState<string[]>([]);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [colorway, setColorway] = useState('');
  const [size, setSize] = useState<number | null>(null);
  const [condition, setCondition] = useState<ListingCondition | null>(null);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [locationLoading, setLocationLoading] = useState(true);
  const [sizePickerVisible, setSizePickerVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<SuccessState | null>(null);

  useEffect(() => {
    let active = true;

    async function loadLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted' || !active) return;

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const [place] = await Location.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        if (place && active) {
          const label = [place.city, place.region].filter(Boolean).join(', ');
          if (label) setLocation(label);
        }
      } catch {
        // Location is optional — seller can still list without it
      } finally {
        if (active) setLocationLoading(false);
      }
    }

    loadLocation();
    return () => {
      active = false;
    };
  }, []);

  const listingTitle = useMemo(() => {
    const parts = [brand, model].filter(Boolean);
    if (colorway) parts.push(colorway);
    return parts.join(' ') || 'Your sneaker';
  }, [brand, model, colorway]);

  const pickPhotos = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo access to upload listing images.');
      return;
    }

    const remaining = 8 - photos.length;
    if (remaining <= 0) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.85,
    });

    if (!result.canceled) {
      setPhotos((current) => [
        ...current,
        ...result.assets.map((asset) => asset.uri),
      ].slice(0, 8));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((current) => current.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setPhotos([]);
    setBrand('');
    setModel('');
    setColorway('');
    setSize(null);
    setCondition(null);
    setPrice('');
    setDescription('');
    setSuccess(null);
  };

  const validate = (): string | null => {
    if (photos.length === 0) return 'Add at least one photo.';
    if (!brand.trim()) return 'Brand is required.';
    if (!model.trim()) return 'Model is required.';
    if (size == null) return 'Select a size.';
    if (!condition) return 'Select a condition.';
    const parsedPrice = Number(price);
    if (!price.trim() || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      return 'Enter a valid price.';
    }
    return null;
  };

  const handleListShoe = async () => {
    const validationError = validate();
    if (validationError) {
      Alert.alert('Missing info', validationError);
      return;
    }

    if (!user?.id || user.id === 'demo') {
      Alert.alert('Sign in required', 'Sign in with a real account to list shoes.');
      return;
    }

    setSubmitting(true);

    const { data, error } = await createListing({
      sellerId: user.id,
      brand: brand.trim(),
      model: model.trim(),
      colorway: colorway.trim(),
      size: size!,
      condition: condition!,
      price: Number(price),
      description: description.trim(),
      photoUris: photos,
      location: location.trim() || undefined,
    });

    setSubmitting(false);

    if (error || !data) {
      Alert.alert('Listing failed', error?.message ?? 'Could not publish your listing.');
      return;
    }

    setSuccess({
      listingId: data.id,
      title: listingTitle,
      price: Number(data.price),
    });
  };

  if (success) {
    return (
      <SellSuccessView
        success={success}
        insets={insets}
        onViewListing={() =>
          navigation.navigate('ListingDetail', { listingId: success.listingId })
        }
        onListAnother={resetForm}
        onGoHome={() => {
          resetForm();
          navigation.navigate('HomeTab');
        }}
      />
    );
  }

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerClassName="px-5 pb-32" showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => navigation.navigate('SellerDashboard')} className="mt-2 mb-4">
          <Text className="text-brand font-semibold">Seller Dashboard →</Text>
        </Pressable>

        <Text className="text-2xl font-bold text-gray-900">Sell Your Kicks</Text>
        <Text className="text-gray-500 mt-1 mb-5">List in minutes. Ship when sold.</Text>

        <FieldLabel>Photos ({photos.length}/8)</FieldLabel>
        <Pressable
          onPress={pickPhotos}
          className="min-h-[130px] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-3 mb-5"
        >
          {photos.length === 0 ? (
            <View className="flex-1 items-center justify-center py-8">
              <Ionicons name="camera-outline" size={40} color={colors.brand} />
              <Text className="text-brand font-semibold mt-2">Add Photos</Text>
              <Text className="text-gray-400 text-sm mt-1">Up to 8 images</Text>
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
              {photos.length < 8 && (
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

        <FieldLabel>Brand</FieldLabel>
        <TextInput
          className={`${inputClassName} mb-4`}
          value={brand}
          onChangeText={setBrand}
          placeholder="Nike, Jordan, Adidas…"
          placeholderTextColor="#ADB5BD"
        />

        <FieldLabel>Model</FieldLabel>
        <TextInput
          className={`${inputClassName} mb-4`}
          value={model}
          onChangeText={setModel}
          placeholder="Air Jordan 1 Retro High OG"
          placeholderTextColor="#ADB5BD"
        />

        <FieldLabel>Colorway</FieldLabel>
        <TextInput
          className={`${inputClassName} mb-4`}
          value={colorway}
          onChangeText={setColorway}
          placeholder="Chicago, Panda, Military Black…"
          placeholderTextColor="#ADB5BD"
        />

        <FieldLabel>Size</FieldLabel>
        <Pressable
          onPress={() => setSizePickerVisible(true)}
          className={`${inputClassName} mb-4 flex-row items-center justify-between`}
        >
          <Text className={size != null ? 'text-gray-900 text-base' : 'text-gray-400 text-base'}>
            {size != null ? `US ${size}` : 'Select size'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#ADB5BD" />
        </Pressable>

        <FieldLabel>Condition</FieldLabel>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 mb-4"
        >
          {CONDITIONS.map((item) => {
            const selected = condition === item;
            return (
              <Pressable
                key={item}
                onPress={() => setCondition(item)}
                className={`px-4 py-2.5 rounded-full border ${
                  selected ? 'bg-brand border-brand' : 'bg-white border-gray-200'
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${selected ? 'text-white' : 'text-gray-700'}`}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <FieldLabel>Price ($)</FieldLabel>
        <TextInput
          className={`${inputClassName} mb-4`}
          value={price}
          onChangeText={setPrice}
          placeholder="150"
          keyboardType="decimal-pad"
          placeholderTextColor="#ADB5BD"
        />

        <FieldLabel>Description</FieldLabel>
        <TextInput
          className={`${inputClassName} mb-4 min-h-[100px]`}
          value={description}
          onChangeText={setDescription}
          placeholder="Box included, worn twice, minor creasing…"
          placeholderTextColor="#ADB5BD"
          multiline
          textAlignVertical="top"
        />

        <FieldLabel>Location</FieldLabel>
        <View className={`${inputClassName} mb-2 flex-row items-center`}>
          <Ionicons name="location-outline" size={18} color={colors.brand} />
          {locationLoading ? (
            <View className="ml-2">
              <ActivityIndicator size="small" color={colors.brand} />
            </View>
          ) : (
            <TextInput
              className="flex-1 ml-2 text-base text-gray-900"
              value={location}
              onChangeText={setLocation}
              placeholder="City, State"
              placeholderTextColor="#ADB5BD"
            />
          )}
        </View>
        <Text className="text-xs text-gray-400 mb-6">Auto-filled from your device location</Text>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 px-5 pt-4 border-t border-gray-100 bg-white"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <Pressable
          onPress={handleListShoe}
          disabled={submitting}
          className="py-4 rounded-xl items-center flex-row justify-center"
          style={{ backgroundColor: colors.brand, opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-base">List Shoe</Text>
          )}
        </Pressable>
      </View>

      <Modal visible={sizePickerVisible} transparent animationType="slide">
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setSizePickerVisible(false)}
        >
          <Pressable
            className="bg-white rounded-t-3xl max-h-[50%]"
            onPress={(event) => event.stopPropagation()}
          >
            <View className="items-center pt-3 pb-2">
              <View className="w-10 h-1 rounded-full bg-gray-300" />
            </View>
            <Text className="text-lg font-bold text-gray-900 px-5 pb-3">Select size (US)</Text>
            <FlatList
              data={SIZES}
              keyExtractor={(item) => String(item)}
              numColumns={4}
              contentContainerClassName="px-4 pb-8"
              renderItem={({ item }) => {
                const selected = size === item;
                return (
                  <Pressable
                    onPress={() => {
                      setSize(item);
                      setSizePickerVisible(false);
                    }}
                    className={`flex-1 m-1 py-3 rounded-xl items-center border ${
                      selected ? 'bg-brand border-brand' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <Text
                      className={`font-semibold ${selected ? 'text-white' : 'text-gray-800'}`}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
