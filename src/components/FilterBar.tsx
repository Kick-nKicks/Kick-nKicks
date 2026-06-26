import { Pressable, ScrollView, Text } from 'react-native';
import type { ListingFilters, ShoeCondition } from '../types';
import { colors, pastelForKey } from '../constants/theme';

const BRANDS = ['Jordan', 'Nike', 'Adidas', 'New Balance'] as const;
const CONDITIONS: ShoeCondition[] = ['deadstock', 'lightly_worn', 'used', 'beaters'];

interface FilterBarProps {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const toggleBrand = (brand: string) => {
    onChange({ ...filters, brand: filters.brand === brand ? undefined : brand });
  };

  const toggleCondition = (condition: ShoeCondition) => {
    onChange({
      ...filters,
      condition: filters.condition === condition ? undefined : condition,
    });
  };

  const pillStyle = (active: boolean, key: string) =>
    active
      ? { backgroundColor: colors.brand, borderColor: colors.brand }
      : { backgroundColor: `${pastelForKey(key)}CC`, borderColor: `${pastelForKey(key)}` };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-4 py-2 gap-2"
    >
      {BRANDS.map((brand) => {
        const active = filters.brand === brand;
        return (
          <Pressable
            key={brand}
            onPress={() => toggleBrand(brand)}
            className="px-4 py-2 rounded-full border mr-1"
            style={pillStyle(active, brand)}
          >
            <Text className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-800'}`}>
              {brand}
            </Text>
          </Pressable>
        );
      })}
      {CONDITIONS.map((condition) => {
        const active = filters.condition === condition;
        return (
          <Pressable
            key={condition}
            onPress={() => toggleCondition(condition)}
            className="px-4 py-2 rounded-full border mr-1"
            style={pillStyle(active, condition)}
          >
            <Text
              className={`text-sm font-medium capitalize ${active ? 'text-white' : 'text-gray-800'}`}
            >
              {condition.replace(/_/g, ' ')}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
